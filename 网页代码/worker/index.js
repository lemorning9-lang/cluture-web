/**
 * 探源 AI 后端 —— Cloudflare Worker
 *
 * 路由（配合 wrangler.jsonc 的 run_worker_first: ["/api/*"]）：
 *   POST /api/chat  智能体 1：知识问答（本地证据优先，不足则联网）
 *   POST /api/plan  智能体 2：行程规划（M2 实现，当前返回未启用）
 *
 * 密钥来自运行时的 Secret（Settings → Variables and secrets → Production）：
 *   DEEPSEEK_API_KEY  DeepSeek 对话与搜索共用
 *   AMAP_WEB_KEY      高德「Web服务」Key（M2 用）
 *
 * 设计依据见仓库根目录 智能体设计.md
 */

const DEEPSEEK_BASE = "https://api.deepseek.com";
const CHAT_MODEL = "deepseek-chat";
const SEARCH_PATH = "/v1/tools/search";

/** 允许跨域调用的来源：GitHub Pages 与本地开发 */
const ALLOWED_ORIGINS = [
  "https://lemorning9-lang.github.io",
  "http://localhost:8787",
  "http://127.0.0.1:8787",
  "http://localhost:5173",
];

const MAX_QUESTION_LEN = 300;
const MAX_EVIDENCE = 10;
const WEB_TIMEOUT_MS = 20000;

// ─── 系统提示词 ───────────────────────────────────────────────────────────────

const CHAT_SYSTEM = `你是「探源AI导游」的资料助理，服务于「中华文明探源工程」网站。

你会收到：
1) 对话历史（可能为空），用于理解追问和指代
2) 用户本轮问题
3) 本地资料库检索结果 evidence[]，每条含 index（编号）、site（遗址名）、field（字段名）、text（正文）
4) 联网检索结果 web[]，可能为空，每条含 index（编号）、title、url、snippet

回答必须分成两段，每段只用各自的来源：
- local_answer：只依据 evidence 作答
- web_answer：只依据 web 作答（web 为空时留空字符串）

判断与落段规则（必须遵守）：
- 先判断 evidence 是否直接回答了本轮问题的核心
  · 是：把内容写进 local_answer
  · 否：local_answer 留空字符串。不要为了显得有内容而把不相关的本地信息硬塞进去
    （例：问「附近有哪些景点」，而 evidence 只有该遗址自身的位置与性质 → local_answer 留空）
- web 与问题无关时，web_answer 留空字符串
- 结合对话历史理解指代：「它」「这个遗址」「还有呢」指向上文提到的对象，不要反问
- 任何具体事实（年代、尺寸、器物名、单位、人名、数量）必须能在对应来源中找到
- 不得编造链接
- 两段都要分点：每项单独一行、以「· 」开头；即使只有一条也用分点，保持格式统一
- 每段分点控制在 6 条以内；同类内容合并成一条（多个景点、多个器物并列时用「、」连接），
  不要把每个名词单独拆成一行
- 只输出答案本身：不讨论资料是否充分、不解释检索过程、不道歉；
  禁止出现「本地资料库没有」「数据库未收录」「现有资料仅列出」「资料未给出」「无法补全」「尚不足以回答」这类表述
- 答案正文里不要写「web 1」「evidence 2」这类编号引用，出处由结构化字段体现
- 语气简练、书面、克制，不用表情符号
- 与本工程无关的问题（天气、闲聊、编程等）：只写一句说明超出范围，放进 web_answer，两段都不用分点
- 本地与 web 内容冲突时：以本地为准，冲突说明写入 note

请始终给出 search_query：可以直接拿去搜索引擎检索的查询词。
把「它」「这个遗址」这类指代替换成上文提到的具体对象，保留关键限定词，不超过 30 字。

usedLocal / usedWeb 填你实际引用的编号数组，没用到就填空数组。

只返回 JSON，不要任何额外文字，格式：
{"local_answer":"","web_answer":"","search_query":"","confidence":"high","usedLocal":[],"usedWeb":[],"note":null}`;

const CHAT_SYSTEM_WITH_WEB = `${CHAT_SYSTEM}

补充：本次已提供联网检索结果 web[]。请把与问题相关的内容写进 web_answer（分点），并填好 usedWeb。
若 web 与问题无关，web_answer 留空字符串。`;

const PLAN_SYSTEM = `你是「中华文明探源」主题旅行的行程规划师。

输入：
1) 用户需求：出发地 origin、天数 days、偏好 preferences、交通方式 travel
2) 候选遗址 sites[]：每条含 name、culture、period、location、brief、straight_km（到出发地的直线距离）
3) 距离矩阵 matrix[]：由高德接口计算，每条含 from、to、km（驾车公里）、min（驾车分钟）

规则（必须遵守）：
- 只能从 sites 中选择，不得推荐名单外的地点
- 距离与车程只能引用 matrix 中的数值，不得估算
- 若所需的某段在 matrix 中找不到，transport 写「该段未获得路径规划数据」
- 默认每天不超过 2 个遗址 + 1-2 小时车程；用户要求高强度时才放宽，并在 cautions 说明
- 相邻两站车程超过 4 小时的组合不要安排在同一天；宁可少安排一处，并在 cautions 里说明原因
- 不编造门票价格、开放时间、联系电话；不确定时提示「出行前请核实」
- 用户未提供的信息要在 assumptions 中说明你做的假设（例如未提供天数则按 3 天）
- 同一天内的遗址要在地理上连贯：优先选择 matrix 中相互车程较短的组合
- highlight 用一句话点出这处遗址最值得看的东西，不要空泛
- 语气简练、书面，不用表情符号；不要讨论资料是否充分、不解释规划过程

只返回 JSON，不要任何额外文字，格式：
{"assumptions":[""],"summary":"","days":[{"day":1,"title":"","stops":[{"site":"","time":"","highlight":"","transport":""}],"tips":""}],"cautions":[""]}`;

// ─── 入口 ─────────────────────────────────────────────────────────────────────

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);

    if (pathname === "/api/chat") return withCors(request, () => handleChat(request, env));
    if (pathname === "/api/plan") return withCors(request, () => handlePlan(request, env));

    return new Response("Not Found", { status: 404 });
  },
};

// ─── CORS ─────────────────────────────────────────────────────────────────────

function corsHeaders(origin) {
  const allowed = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    "Access-Control-Allow-Origin": allowed,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

async function withCors(request, handler) {
  const origin = request.headers.get("Origin") || "";
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders(origin) });
  }
  try {
    return await handler();
  } catch (err) {
    if (err instanceof ApiError) {
      return json({ error: err.message, detail: err.detail }, err.status, origin);
    }
    return json({ error: "后端内部错误", detail: String(err).slice(0, 300) }, 500, origin);
  }
}

function json(payload, status = 200, origin = "") {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", ...corsHeaders(origin) },
  });
}

class ApiError extends Error {
  constructor(message, status, detail) {
    super(message);
    this.status = status;
    this.detail = detail;
  }
}

// ─── 智能体 1：知识问答 ───────────────────────────────────────────────────────

async function handleChat(request, env) {
  if (request.method !== "POST") throw new ApiError("只支持 POST", 405);
  if (!env.DEEPSEEK_API_KEY) {
    throw new ApiError("后端尚未配置 DEEPSEEK_API_KEY", 503, "在 Worker 的 Runtime variables and secrets 中添加");
  }

  const body = await readJson(request);
  const question = String(body.question || "").trim().slice(0, MAX_QUESTION_LEN);
  if (!question) throw new ApiError("question 不能为空", 400);

  const evidence = normalizeEvidence(body.evidence);
  const history = normalizeHistory(body.history);

  // 第一遍：只依据本地证据作答，让模型自己判断够不够
  const first = await chatJSON(env, [
    { role: "system", content: CHAT_SYSTEM },
    ...history,
    { role: "user", content: buildUserPayload(question, evidence, []) },
  ]);

  let result = first;
  let searchedWeb = false;
  let webItems = [];

  // 每次提问都联网检索。
  // 原因：让模型自己判断「本地够不够」的历史表现并不稳定（同一输入两次结论不同），
  // 而一次搜索成本极低（¥5/1000 次）。是否采用联网内容交给第二遍的模型决定：
  // 本地证据已能完整回答时，提示词要求它不要引用 web。
  // 查询词优先用模型改写的 search_query——带代词的问题直接搜会跑偏。
  const searchQuery = String(first.search_query || "").trim() || question;
  const found = await searchWeb(env, searchQuery);

  if (found.length > 0) {
    searchedWeb = true;
    webItems = found;
    result = await chatJSON(env, [
      { role: "system", content: CHAT_SYSTEM_WITH_WEB },
      ...history,
      { role: "user", content: buildUserPayload(question, evidence, webItems) },
    ]);
  }

  const localText = String(result.local_answer || "").trim();
  const webText = String(result.web_answer || "").trim();
  const segments = [];
  if (localText) segments.push({ kind: "local", text: localText });
  if (webText) segments.push({ kind: "web", text: webText });

  return json(
    {
      // segments 是主结构（前端据此分两段渲染）；answer 保留给旧前端做兼容
      segments,
      answer: segments.map((s) => s.text).join("\n\n") || fallbackAnswer(evidence),
      local: pickLocal(evidence, result.usedLocal, Boolean(localText)),
      web: pickWeb(webItems, result.usedWeb),
      confidence: normalizeConfidence(result.confidence, searchedWeb),
      note: result.note || null,
      meta: { searchedWeb, model: CHAT_MODEL },
    },
    200,
    request.headers.get("Origin") || "",
  );
}

function normalizeEvidence(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .slice(0, MAX_EVIDENCE)
    .map((item, index) => ({
      index,
      site: String(item?.site || "").slice(0, 60),
      field: String(item?.field || "").slice(0, 60),
      text: String(item?.text || "").slice(0, 600),
    }))
    .filter((item) => item.text);
}

/** 多轮上下文：取最近几条并限制单条长度，避免整段历史挤占上下文 */
function normalizeHistory(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .slice(-8)
    .map((m) => ({
      role: m?.role === "ai" ? "assistant" : "user",
      content: String(m?.content || "").trim().slice(0, 600),
    }))
    .filter((m) => m.content);
}

function buildUserPayload(question, evidence, web) {
  return JSON.stringify({
    question,
    evidence: evidence.map(({ index, site, field, text }) => ({ index, site, field, text })),
    web: web.map(({ index, title, url, snippet }) => ({ index, title, url, snippet })),
  });
}

function pickLocal(evidence, used, hasLocalText) {
  // 本地段为空时不挂本地出处——避免把不相关的本地信息当成"来源"列出来
  if (!hasLocalText) return [];
  const ids = Array.isArray(used) && used.length > 0 ? used : evidence.map((e) => e.index);
  return ids
    .map((i) => evidence.find((e) => e.index === i))
    .filter(Boolean)
    .map((e) => ({ site: e.site, field: e.field, quote: e.text.slice(0, 120) }));
}

function pickWeb(web, used) {
  if (!Array.isArray(used) || used.length === 0) return [];
  return used
    .map((i) => web.find((w) => w.index === i))
    .filter(Boolean)
    .map((w) => ({ title: w.title, url: w.url, snippet: w.snippet.slice(0, 160) }));
}

function normalizeConfidence(value, searchedWeb) {
  const v = String(value || "").toLowerCase();
  if (v === "high" || v === "medium" || v === "low") return v;
  return searchedWeb ? "medium" : "high";
}

function fallbackAnswer(evidence) {
  if (evidence.length > 0) return evidence[0].text;
  return "暂时没有找到与该问题直接相关的内容，可以换个问法试试。";
}

// ─── 智能体 2：行程规划 ───────────────────────────────────────────────────────

const AMAP_BASE = "https://restapi.amap.com";
const MAX_CANDIDATES = 10;
const MAX_PLAN_DAYS = 10;

async function handlePlan(request, env) {
  if (request.method !== "POST") throw new ApiError("只支持 POST", 405);
  if (!env.DEEPSEEK_API_KEY) throw new ApiError("后端尚未配置 DEEPSEEK_API_KEY", 503);
  if (!env.AMAP_WEB_KEY) {
    throw new ApiError(
      "后端尚未配置 AMAP_WEB_KEY",
      503,
      "在 Worker 的 Runtime variables and secrets 中添加（类型选 Secret，服务平台需为「Web服务」）",
    );
  }

  const body = await readJson(request);
  const origin = String(body.origin || "").trim().slice(0, 40);
  if (!origin) throw new ApiError("origin（出发地）不能为空", 400);

  const days = clampInt(body.days, 1, MAX_PLAN_DAYS, 3);
  const travel = String(body.travel || "自驾").slice(0, 10);
  const preferences = Array.isArray(body.preferences)
    ? body.preferences.map((p) => String(p).slice(0, 20)).slice(0, 5)
    : [];

  const sites = normalizePlanSites(body.sites);
  if (sites.length < 4) throw new ApiError("可用候选遗址太少（至少 4 处），无法规划", 400);

  // 1) 出发地转坐标
  const start = await geocode(env, origin);
  if (!start) {
    throw new ApiError(`无法定位出发地「${origin}」`, 400, "请写得更具体，例如「西安」「山西临汾」");
  }

  // 2) 按距离与偏好收敛候选
  const candidates = pickCandidates(sites, start, preferences);
  const points = [
    { id: "出发地", lng: start.lng, lat: start.lat },
    ...candidates.map((s) => ({ id: s.name, lng: s.lng, lat: s.lat })),
  ];

  // 3) 高德算真实驾车距离矩阵（这是"距离必须有据可查"的来源）
  const matrix = await buildMatrix(env, points);
  if (matrix.length === 0) throw new ApiError("高德未能返回路径数据", 502);

  // 4) 模型在真实数据上排行程
  const raw = await chatJSON(
    env,
    [
    { role: "system", content: PLAN_SYSTEM },
    {
      role: "user",
      content: JSON.stringify({
        request: { origin, days, preferences, travel },
        sites: candidates.map((s) => ({
          name: s.name,
          culture: s.culture,
          period: s.period,
          location: s.location,
          brief: s.brief,
          straight_km: Math.round(s.straight_km),
        })),
        matrix,
      }),
    },
    ],
    // 行程是多天多站的 JSON，输出预算要比问答大得多
    3500,
  );

  // 5) 校验并重算里程：距离只认矩阵，不认模型自己写的数
  const plan = finalizePlan(raw, candidates, matrix);

  return json(
    {
      ...plan,
      meta: { model: CHAT_MODEL, candidates: candidates.length, legs: matrix.length },
    },
    200,
    request.headers.get("Origin") || "",
  );
}

function clampInt(value, min, max, fallback) {
  const n = Number(value);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(max, Math.max(min, Math.round(n)));
}

function normalizePlanSites(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .slice(0, 40)
    .map((s) => ({
      name: String(s?.name || "").slice(0, 40),
      culture: String(s?.culture || "").slice(0, 30),
      period: String(s?.period || "").slice(0, 20),
      location: String(s?.location || "").slice(0, 40),
      brief: String(s?.brief || "").slice(0, 120),
      domain: String(s?.domain || "").slice(0, 10),
      lng: Number(s?.lng),
      lat: Number(s?.lat),
    }))
    .filter((s) => s.name && Number.isFinite(s.lng) && Number.isFinite(s.lat));
}

function haversineKm(a, b) {
  const R = 6371;
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** 先按偏好筛流域，再按直线距离取最近的一批，控制高德调用次数 */
function pickCandidates(sites, start, preferences) {
  const pref = preferences.join(" ");
  let pool = sites;
  if (/黄河/.test(pref)) pool = sites.filter((s) => s.domain === "黄河");
  else if (/长江/.test(pref)) pool = sites.filter((s) => s.domain === "长江");
  else if (/其他|三星堆|辽河|牛河梁/.test(pref)) pool = sites.filter((s) => s.domain === "其他");
  if (pool.length < 4) pool = sites;

  return pool
    .map((s) => ({ ...s, straight_km: haversineKm(start, s) }))
    .sort((a, b) => a.straight_km - b.straight_km)
    .slice(0, MAX_CANDIDATES);
}

async function amapJson(env, path, params) {
  const url = new URL(AMAP_BASE + path);
  url.searchParams.set("key", env.AMAP_WEB_KEY);
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, String(v));

  const res = await fetchWithTimeout(url.toString(), { method: "GET" });
  const text = await res.text();
  if (!res.ok) throw new ApiError(`高德接口请求失败 (${res.status})`, 502, text.slice(0, 200));

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    throw new ApiError("高德接口返回无法解析", 502, text.slice(0, 200));
  }
  if (String(data.status) !== "1") {
    throw new ApiError("高德接口返回错误", 502, `${data.info || ""} ${data.infocode || ""}`.trim());
  }
  return data;
}

async function geocode(env, address) {
  const data = await amapJson(env, "/v3/geocode/geo", { address });
  const first = (data.geocodes || [])[0];
  if (!first?.location) return null;
  const [lng, lat] = String(first.location).split(",").map(Number);
  if (!Number.isFinite(lng) || !Number.isFinite(lat)) return null;
  return { lng, lat };
}

/** 对每个目的地点调用一次距离测量，1 次请求拿回所有起点到它的驾车距离 */
async function buildMatrix(env, points) {
  const legs = [];
  for (const dest of points) {
    const data = await amapJson(env, "/v3/distance", {
      origins: points.map((p) => `${p.lng},${p.lat}`).join("|"),
      destination: `${dest.lng},${dest.lat}`,
      type: "1",
    });
    for (const row of data.results || []) {
      const from = points[Number(row.origin_id) - 1];
      if (!from) continue;
      const meters = Number(row.distance);
      const seconds = Number(row.duration);
      if (!Number.isFinite(meters) || !Number.isFinite(seconds) || meters <= 0) continue;
      legs.push({
        from: from.id,
        to: dest.id,
        km: Math.round(meters / 100) / 10,
        min: Math.max(1, Math.round(seconds / 60)),
      });
    }
  }
  return legs;
}

/** 只保留候选内的遗址；车程与总里程一律按矩阵重算，模型给的数值不采信 */
function finalizePlan(raw, candidates, matrix) {
  const byName = new Map(candidates.map((s) => [s.name, s]));
  const legIndex = new Map(matrix.map((l) => [`${l.from}→${l.to}`, l]));

  const cautions = Array.isArray(raw?.cautions)
    ? raw.cautions.map((c) => String(c).slice(0, 120)).filter(Boolean)
    : [];
  const assumptions = Array.isArray(raw?.assumptions)
    ? raw.assumptions.map((a) => String(a).slice(0, 120)).filter(Boolean)
    : [];

  const outDays = [];
  let cursor = "出发地";
  let totalKm = 0;
  let totalMin = 0;
  let missing = 0;

  for (const day of Array.isArray(raw?.days) ? raw.days : []) {
    const stops = [];
    for (const stop of Array.isArray(day?.stops) ? day.stops : []) {
      const site = byName.get(String(stop?.site || "").trim());
      if (!site) continue; // 模型编造的地点直接丢弃

      const leg = legIndex.get(`${cursor}→${site.name}`);
      if (leg) {
        totalKm += leg.km;
        totalMin += leg.min;
        stops.push({
          site: site.name,
          time: String(stop?.time || "").slice(0, 30),
          highlight: String(stop?.highlight || "").slice(0, 120),
          transport: `${cursor} → ${site.name}：驾车 ${leg.km} 公里 / 约 ${leg.min} 分钟`,
        });
      } else {
        missing += 1;
        stops.push({
          site: site.name,
          time: String(stop?.time || "").slice(0, 30),
          highlight: String(stop?.highlight || "").slice(0, 120),
          transport: `${cursor} → ${site.name}：该段未获得路径规划数据`,
        });
      }
      cursor = site.name;
    }
    if (stops.length > 0) {
      outDays.push({
        day: outDays.length + 1,
        title: String(day?.title || "").slice(0, 40),
        stops,
        tips: String(day?.tips || "").slice(0, 160),
      });
    }
  }

  if (missing > 0) {
    cautions.push(`有 ${missing} 段行程未获得路径规划数据，实际车程请以导航为准`);
  }

  return {
    assumptions,
    summary: String(raw?.summary || "").slice(0, 120),
    days: outDays,
    totals: {
      distance_km: Math.round(totalKm),
      drive_hours: Math.round((totalMin / 60) * 10) / 10,
    },
    cautions,
  };
}

// ─── DeepSeek 调用 ────────────────────────────────────────────────────────────

async function chatJSON(env, messages, maxTokens = 1200) {
  const res = await fetchWithTimeout(`${DEEPSEEK_BASE}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${env.DEEPSEEK_API_KEY}`,
    },
    body: JSON.stringify({
      model: CHAT_MODEL,
      messages,
      temperature: 0.2,
      max_tokens: maxTokens,
      response_format: { type: "json_object" },
    }),
  });

  const raw = await res.text();
  if (!res.ok) {
    throw new ApiError(`模型调用失败 (${res.status})`, 502, raw.slice(0, 300));
  }

  let content = "";
  try {
    content = JSON.parse(raw).choices?.[0]?.message?.content || "";
  } catch {
    throw new ApiError("模型返回无法解析", 502, raw.slice(0, 300));
  }
  return parseLooseJSON(content);
}

/** 模型偶尔会把 JSON 包在 ```json 里或前后带解释，这里做宽松提取 */
function parseLooseJSON(text) {
  const trimmed = String(text || "").trim();
  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf("{");
    const end = trimmed.lastIndexOf("}");
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(trimmed.slice(start, end + 1));
      } catch {
        /* 落到下面抛错 */
      }
    }
    throw new ApiError("模型输出不是合法 JSON", 502, trimmed.slice(0, 300));
  }
}

async function searchWeb(env, question) {
  let res;
  try {
    res = await fetchWithTimeout(`${DEEPSEEK_BASE}${SEARCH_PATH}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({ query: question.slice(0, 128), count: 8 }),
    });
  } catch {
    return []; // 联网失败不阻断回答，退回只用本地证据
  }
  if (!res.ok) return [];

  let data;
  try {
    data = await res.json();
  } catch {
    return [];
  }

  const list = Array.isArray(data.results)
    ? data.results
    : Array.isArray(data.data?.results)
      ? data.data.results
      : [];

  // 质量过滤：优先 rerank_score >= 1.5；不足 3 条时放宽到 >= 1.0
  const strong = list.filter((r) => Number(r.rerank_score ?? 0) >= 1.5);
  const pool = strong.length >= 3 ? strong : list.filter((r) => Number(r.rerank_score ?? 0) >= 1.0);

  const seen = new Set();
  return pool
    .sort((a, b) => Number(b.authority ?? 0) - Number(a.authority ?? 0))
    .map((r) => ({
      title: cleanTitle(r.title),
      url: String(r.url || ""),
      snippet: String(r.snippet || r.summary || "").slice(0, 200),
    }))
    .filter((r) => {
      if (!r.url) return false;
      // 同一篇文章可能以带 #锚点 的不同 URL 重复返回，按标题+去锚点 URL 去重
      const key = r.title + "|" + r.url.split("#")[0];
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 6)
    .map((r, index) => ({ index, ...r }));
}

/**
 * 搜索结果常返回「标题 - 标题」「标题_站点」这类重复，取可推定的前半段。
 * 不用精确相等判断，是因为同一标题两次出现时常有空格或标点差异。
 */
function cleanTitle(raw) {
  const title = String(raw || "").trim().replace(/\s+/g, " ");
  const m = title.match(/^(.{4,}?)\s*[-–—－|_]\s*(.+)$/);
  if (!m) return title;
  const head = m[1].trim();
  const tail = m[2].trim();
  if (tail === head || tail.startsWith(head) || head.startsWith(tail)) return head;
  return title;
}

async function readJson(request) {
  try {
    return await request.json();
  } catch {
    throw new ApiError("请求体不是合法 JSON", 400);
  }
}

async function fetchWithTimeout(url, init) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), WEB_TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}
