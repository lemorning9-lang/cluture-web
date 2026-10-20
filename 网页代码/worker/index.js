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

你会收到三部分输入：
1) 用户问题
2) 本地资料库检索结果 evidence[]，每条含 index（编号）、site（遗址名）、field（字段名）、text（正文）
3) 可选：联网检索结果 web[]，每条含 index（编号）、title、url、snippet

回答规则（必须遵守）：
- 只能使用 evidence 和 web 中的内容，不得引入其他知识
- 先判断 evidence 是否足以回答问题的核心部分
  · 足够：只依据 evidence 作答，sufficient 置为 true
  · 不足以覆盖核心问题：sufficient 置为 false，并在 gap 中用一句话说明缺什么
  · 特别地：若本地证据只能列出名称或给出笼统结论，无法说明年代、特征、数量、出土情况等实质内容，同样视为不足
- 任何具体事实（年代、尺寸、器物名、单位、人名、数量）必须能在输入材料中找到
- 本地与 web 冲突时：在 note 中指出冲突，答案以本地为准
- 不得编造链接
- 语气简练、书面、克制，不用表情符号
- 长度 150-300 字；用户明确要求详细时才展开
- 答案正文里不要写「web 1」「evidence 2」这类编号引用，出处由结构化字段体现
- 与本工程无关的问题（天气、闲聊、编程等）：直接说明超出范围，sufficient 置为 true

把 usedLocal 填成你实际引用过的 evidence 编号数组，usedWeb 填实际引用过的 web 编号数组。
若某个数组没有可用内容，填空数组。

只返回 JSON，不要任何额外文字，格式：
{"answer":"","sufficient":true,"confidence":"high","usedLocal":[],"usedWeb":[],"gap":null,"note":null}`;

const CHAT_SYSTEM_WITH_WEB = `${CHAT_SYSTEM}

补充：本次已提供联网检索结果 web[]。请据此补全回答，并把你实际使用的 web 条目标号填进 usedWeb。`;

const PLAN_SYSTEM = `你是「中华文明探源」主题旅行的行程规划师。

输入：
1) 用户需求：出发地、天数、偏好、人数、交通方式
2) 候选遗址 sites[]：每条含 name、culture、period、location、lat、lng、brief
3) 距离矩阵 matrix[]：由高德接口计算，每条含 from、to、distance_m、duration_s

规则（必须遵守）：
- 只能从 sites 中选择，不得推荐名单外的地点
- 距离与车程只能引用 matrix 中的数值，不得估算
- 若所需的某段在 matrix 中不存在，必须标注"该段未获得路径规划数据"
- 默认每天不超过 2 个遗址 + 1-2 小时车程；用户要求高强度时才放宽，并在 cautions 说明
- 不编造门票价格、开放时间、联系电话；不确定时提示"出行前请核实"
- 用户未提供的信息要在 assumptions 中说明你做的假设
- 只返回 JSON，不要任何额外文字`;

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

  // 第一遍：只依据本地证据作答，让模型自己判断够不够
  const first = await chatJSON(env, [
    { role: "system", content: CHAT_SYSTEM },
    { role: "user", content: buildUserPayload(question, evidence, []) },
  ]);

  let result = first;
  let searchedWeb = false;
  let webItems = [];

  // 证据太少时不必等模型判断，直接联网补齐（模型对"够不够"的判断并不稳定）
  const thinEvidence = evidence.length < 2;
  // 枚举式提问要的是清单，本地单条字段通常覆盖不全，直接联网
  const wantsList = /哪些|哪几|列出|盘点|几种/.test(question);

  if (!first.sufficient || thinEvidence || wantsList) {
    // 第二遍：联网检索后重新作答
    const found = await searchWeb(env, question);
    if (found.length > 0) {
      searchedWeb = true;
      webItems = found;
      result = await chatJSON(env, [
        { role: "system", content: CHAT_SYSTEM_WITH_WEB },
        { role: "user", content: buildUserPayload(question, evidence, webItems) },
      ]);
    }
  }

  return json(
    {
      answer: String(result.answer || "").trim() || fallbackAnswer(evidence, searchedWeb),
      local: pickLocal(evidence, result.usedLocal),
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

function buildUserPayload(question, evidence, web) {
  return JSON.stringify({
    question,
    evidence: evidence.map(({ index, site, field, text }) => ({ index, site, field, text })),
    web: web.map(({ index, title, url, snippet }) => ({ index, title, url, snippet })),
  });
}

function pickLocal(evidence, used) {
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

function fallbackAnswer(evidence, searchedWeb) {
  if (evidence.length > 0) return evidence[0].text;
  return searchedWeb
    ? "已联网检索，但没有找到可引用的可靠来源。"
    : "本地资料库未命中，且联网检索未启用。";
}

// ─── 智能体 2：行程规划（M2） ─────────────────────────────────────────────────

async function handlePlan() {
  throw new ApiError("行程规划尚未启用（M2）", 501);
}

// ─── DeepSeek 调用 ────────────────────────────────────────────────────────────

async function chatJSON(env, messages) {
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
      max_tokens: 1200,
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
