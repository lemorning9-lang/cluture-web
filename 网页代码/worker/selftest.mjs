/**
 * Worker 自测脚本（不联网、不需要真实密钥）
 *
 * 用法： node worker/selftest.mjs
 *
 * 做法：把全局 fetch 换成 mock，模拟 DeepSeek 的 chat 与 search 返回，
 * 然后直接调用 worker.fetch()，检查路由、CORS、鉴权、两段式编排与出处拼装。
 */

import worker from "./index.js";

let pass = 0;
let fail = 0;
const failures = [];

function check(name, cond, detail = "") {
  if (cond) {
    pass += 1;
    console.log(`  ✓ ${name}`);
  } else {
    fail += 1;
    failures.push(`${name}${detail ? " — " + detail : ""}`);
    console.log(`  ✗ ${name}${detail ? " — " + detail : ""}`);
  }
}

const ENV = { DEEPSEEK_API_KEY: "sk-test" };
const ORIGIN = "https://lemorning9-lang.github.io";

function chatReply(obj) {
  return new Response(
    JSON.stringify({ choices: [{ message: { content: JSON.stringify(obj) } }] }),
    { status: 200, headers: { "Content-Type": "application/json" } },
  );
}

function searchReply(results) {
  return new Response(JSON.stringify({ results }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

/** 按调用序列返回预设响应，并记录每次请求的 URL 与 body */
function installMock(handlers) {
  const calls = [];
  const counters = {};
  const pick = (key, body, url) => {
    const list = handlers[key] || [];
    const index = counters[key] ?? 0;
    counters[key] = index + 1;
    const h = list[Math.min(index, list.length - 1)];
    if (!h) throw new Error("未配置 " + key + " 的 mock");
    return h(body, url);
  };
  globalThis.fetch = async (url, init) => {
    const u = String(url);
    const body = init?.body ? JSON.parse(init.body) : null;
    calls.push({ url: u, body });
    if (u.includes("/chat/completions")) return pick("chat", body, u);
    if (u.includes("/tools/search")) return pick("search", body, u);
    if (u.includes("/geocode/geo")) return pick("geocode", body, u);
    if (u.includes("/v3/distance")) return pick("distance", body, u);
    throw new Error("未预期的请求: " + u);
  };
  return calls;
}

/** 构造高德接口的 JSON 响应 */
function amapReply(obj) {
  return new Response(JSON.stringify(obj), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

function postChat(payload, env = ENV) {
  return worker.fetch(
    new Request("https://example.com/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: ORIGIN },
      body: typeof payload === "string" ? payload : JSON.stringify(payload),
    }),
    env,
  );
}

const EVIDENCE = [
  { site: "陶寺遗址", field: "遗址档案 · 考古证据", text: "280万平方米城址、宫城与功能分区、大型墓葬、礼乐器" },
  { site: "陶寺遗址", field: "器物影像 · 陶寺遗址彩绘蟠龙纹陶盘", text: "陶寺遗址（黄河流域）器物与现场影像：陶寺遗址彩绘蟠龙纹陶盘" },
];

// ─── 1. 基础行为 ──────────────────────────────────────────────────────────────

console.log("\n[1] 路由与基础校验");

{
  const res = await worker.fetch(
    new Request("https://example.com/apichat", { method: "POST" }),
    ENV,
  );
  check("非 /api/* 路径返回 404", res.status === 404, `实际 ${res.status}`);
}

{
  const res = await worker.fetch(
    new Request("https://example.com/api/chat", {
      method: "OPTIONS",
      headers: { Origin: ORIGIN },
    }),
    ENV,
  );
  check("预检请求返回 204", res.status === 204, `实际 ${res.status}`);
  check(
    "CORS 回显允许来源",
    res.headers.get("Access-Control-Allow-Origin") === ORIGIN,
    res.headers.get("Access-Control-Allow-Origin") || "空",
  );
}

{
  const res = await worker.fetch(
    new Request("https://example.com/api/chat", {
      method: "GET",
      headers: { Origin: ORIGIN },
    }),
    ENV,
  );
  check("GET 返回 405", res.status === 405, `实际 ${res.status}`);
}

{
  const res = await postChat({ question: "陶寺" }, {});
  const body = await res.json();
  check("缺少 DEEPSEEK_API_KEY 返回 503", res.status === 503, `实际 ${res.status}`);
  check("503 带可读提示", /DEEPSEEK_API_KEY/.test(body.error || ""), body.error);
}

{
  const res = await postChat("{这不是json");
  check("非法 JSON 返回 400", res.status === 400, `实际 ${res.status}`);
}

{
  const res = await postChat({ question: "   " });
  check("空问题返回 400", res.status === 400, `实际 ${res.status}`);
}

// ─── 2. 本地证据充足：不应联网 ─────────────────────────────────────────────────

console.log("\n[2] 本地证据充足 + 搜索无结果 → 只答本地");

{
  const calls = installMock({
    chat: [
      () =>
        chatReply({
          local_answer: "陶寺遗址已确认城址面积约 280 万平方米，宫城、大型墓葬与礼乐器构成综合证据。",
          confidence: "high",
          usedLocal: [0, 1],
          usedWeb: [],
          note: null,
        }),
    ],
    search: [() => searchReply([])],
  });

  const res = await postChat({ question: "陶寺遗址的规模和证据", evidence: EVIDENCE });
  const body = await res.json();

  check("状态 200", res.status === 200, `实际 ${res.status}`);
  check("搜索仍会被调用（每次提问都联网）", calls.some((c) => c.url.includes("/tools/search")));
  check(
    "搜索无结果时不再重问模型",
    calls.filter((c) => c.url.includes("/chat/completions")).length === 1,
    String(calls.filter((c) => c.url.includes("/chat/completions")).length),
  );
  check("searchedWeb 为 false", body.meta?.searchedWeb === false, JSON.stringify(body.meta));
  check("local 有 2 条", body.local?.length === 2, String(body.local?.length));
  check(
    "local 带出遗址与字段",
    body.local?.[0]?.site === "陶寺遗址" && /考古证据/.test(body.local?.[0]?.field || ""),
    JSON.stringify(body.local?.[0]),
  );
  check("web 为空数组", Array.isArray(body.web) && body.web.length === 0);
  check("confidence 透传", body.confidence === "high", body.confidence);
  check("答案非空", (body.answer || "").length > 10);
}

// ─── 3. 本地不足：联网补全并回填出处 ──────────────────────────────────────────

console.log("\n[3] 本地不足 → 联网检索 → 回填来源链接");

{
  const calls = installMock({
    chat: [
      () =>
        chatReply({
          local_answer: "",
          confidence: "low",
          usedLocal: [],
          usedWeb: [],
          note: null,
        }),
      () =>
        chatReply({
          answer:
            "据 2023 年报道，陶寺遗址新发现大型夯土建筑基址，进一步支持其都邑性质。本地资料库未收录该进展。",
          confidence: "medium",
          usedLocal: [],
          usedWeb: [0, 1],
          note: "本地资料库未收录该条新发现，已依据联网结果补充。",
        }),
    ],
    search: [
      () =>
        searchReply([
          { title: "陶寺遗址新发现", url: "https://example.com/a", snippet: "新发现夯土基址", rerank_score: 2.2, authority: 3 },
          { title: "陶寺考古新进展", url: "https://example.com/b", snippet: "进一步确认都邑性质", rerank_score: 1.8, authority: 4 },
          { title: "低相关页面", url: "https://example.com/c", snippet: "无关内容", rerank_score: 0.4, authority: 0 },
        ]),
    ],
  });

  const res = await postChat({ question: "陶寺遗址最近有什么新发现", evidence: [] });
  const body = await res.json();

  check("调用了搜索接口", calls.some((c) => c.url.includes("/tools/search")));
  check("共调用两次模型", calls.filter((c) => c.url.includes("/chat/completions")).length === 2);
  check("searchedWeb 为 true", body.meta?.searchedWeb === true);
  check("web 回填 2 条", body.web?.length === 2, String(body.web?.length));
  check(
    "web 都带标题与链接",
    (body.web || []).length === 2 &&
      (body.web || []).every((w) => !!w.url && !!w.title) &&
      (body.web || []).some((w) => w.url === "https://example.com/a"),
    JSON.stringify(body.web),
  );
  check(
    "权威度高的排在前面",
    body.web?.[0]?.url === "https://example.com/b",
    JSON.stringify(body.web?.[0]),
  );
  check(
    "低分结果被过滤",
    !(body.web || []).some((w) => w.url === "https://example.com/c"),
  );
  check("note 透传", /未收录/.test(body.note || ""), body.note);
  check("confidence 为 medium", body.confidence === "medium", body.confidence);
}

// ─── 4. 联网无结果：不编造，明确缺口 ───────────────────────────────────────────

console.log("\n[4] 联网无结果 → 不编造");

{
  installMock({
    chat: [
      () =>
        chatReply({
          local_answer: "",
          confidence: "low",
          usedLocal: [],
          usedWeb: [],
          note: null,
        }),
    ],
    search: [() => searchReply([])],
  });

  const res = await postChat({ question: "良渚玉琮的显微磨损分析", evidence: [] });
  const body = await res.json();

  check("状态 200（不报错）", res.status === 200, `实际 ${res.status}`);
  check("web 为空", body.web?.length === 0);
  check("searchedWeb 为 false（搜索无结果）", body.meta?.searchedWeb === false);
  check("给出了兜底答复", (body.answer || "").length > 0, body.answer);
}

// ─── 5. 模型返回非严格 JSON ────────────────────────────────────────────────────

console.log("\n[5] 模型输出被代码块包裹时仍可解析");

{
  installMock({
    chat: [
      () =>
        new Response(
          JSON.stringify({
            choices: [
              {
                message: {
                  content:
                    '```json\n{"local_answer":"良渚古城遗址距今约5300-4300年。","confidence":"high","usedLocal":[0],"usedWeb":[],"note":null}\n```',
                },
              },
            ],
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        ),
    ],
    search: [() => searchReply([])],
  });

  const res = await postChat({ question: "良渚古城多少年", evidence: [EVIDENCE[0]] });
  const body = await res.json();

  check("状态 200", res.status === 200, `实际 ${res.status}`);
  check("成功提取答案", /5300/.test(body.answer || ""), body.answer);
}

// ─── 6. 行程规划的参数与凭据校验 ──────────────────────────────────────────────────

console.log("\n[6] /api/plan 参数与凭据校验");

{
  const res = await worker.fetch(
    new Request("https://example.com/api/plan", {
      method: "POST",
      headers: { Origin: ORIGIN, "Content-Type": "application/json" },
      body: JSON.stringify({ origin: "西安", days: 3 }),
    }),
    ENV,
  );
  const body = await res.json();
  check("缺 AMAP_WEB_KEY 返回 503", res.status === 503, `实际 ${res.status}`);
  check("提示里点名 AMAP_WEB_KEY", /AMAP_WEB_KEY/.test(body.error || ""), body.error);
}

{
  const res = await worker.fetch(
    new Request("https://example.com/api/plan", {
      method: "POST",
      headers: { Origin: ORIGIN, "Content-Type": "application/json" },
      body: JSON.stringify({ days: 3 }),
    }),
    { ...ENV, AMAP_WEB_KEY: "amap-test" },
  );
  check("缺 origin 返回 400", res.status === 400, `实际 ${res.status}`);
}

// ─── 7. 联网结果的标题去重与链接去锚点 ────────────────────────────────────────

console.log("\n[7] 搜索结果清洗：重复标题、同一链接带锚点");

{
  installMock({
    chat: [
      () =>
        chatReply({
          local_answer: "",
          confidence: "low",
          usedLocal: [],
          usedWeb: [],
          note: null,
        }),
      () =>
        chatReply({
          local_answer: "据联网资料整理。",
          confidence: "medium",
          usedLocal: [],
          usedWeb: [0, 1],
          note: null,
        }),
    ],
    search: [
      () =>
        searchReply([
          { title: "重复标题 - 重复标题", url: "https://example.com/1", snippet: "a", rerank_score: 2, authority: 4 },
          { title: "重复标题", url: "https://example.com/1#anchor", snippet: "同一篇", rerank_score: 2, authority: 1 },
          { title: "另一篇", url: "https://example.com/2", snippet: "b", rerank_score: 1.8, authority: 2 },
        ]),
    ],
  });

  const res = await postChat({ question: "某个新发现", evidence: [] });
  const body = await res.json();

  check("去重后剩 2 条", body.web?.length === 2, JSON.stringify(body.web));
  check(
    "重复标题已清理",
    body.web?.[0]?.title === "重复标题",
    JSON.stringify(body.web?.[0]),
  );
  check(
    "同一链接的锚点版本被去掉",
    !(body.web || []).some((w) => w.url.includes("#")),
    JSON.stringify((body.web || []).map((w) => w.url)),
  );
}

// ─── 8. 多轮上下文透传 ────────────────────────────────────────────────────────

console.log("\n[8] 多轮上下文透传");

{
  const calls = installMock({
    chat: [
      () =>
        chatReply({
          local_answer: "结合上文，陶寺遗址出土的陶器包括彩绘蟠龙纹陶盘。",
          confidence: "high",
          usedLocal: [0],
          usedWeb: [],
          note: null,
        }),
    ],
    search: [() => searchReply([])],
  });

  const res = await postChat({
    question: "它出土了哪些陶器",
    evidence: [EVIDENCE[1]],
    history: [
      { role: "user", content: "介绍一下陶寺遗址" },
      { role: "ai", content: "陶寺遗址位于山西临汾，是四大都邑之一。" },
    ],
  });
  await res.json();

  const msgs = calls.find((c) => c.url.includes("/chat/completions"))?.body?.messages || [];
  check("状态 200", res.status === 200);
  check("历史进了 messages（system+2+本轮）", msgs.length === 4, String(msgs.length));
  check(
    "角色映射 ai→assistant",
    msgs[1]?.role === "user" && msgs[2]?.role === "assistant",
    JSON.stringify(msgs.map((m) => m.role)),
  );
  check(
    "历史内容原样带入",
    (msgs[1]?.content || "").includes("陶寺") && (msgs[2]?.content || "").includes("山西"),
    JSON.stringify(msgs.slice(1, 3)),
  );
  check(
    "本轮问题在最后一条",
    /它出土了哪些陶器/.test(msgs[msgs.length - 1]?.content || ""),
    (msgs[msgs.length - 1]?.content || "").slice(0, 80),
  );
}

// ─── 9. 联网查询词使用模型改写结果 ────────────────────────────────────────────

console.log("\n[9] 联网查询词使用模型改写结果");

{
  const calls = installMock({
    chat: [
      () =>
        chatReply({
          local_answer: "",
          confidence: "low",
          search_query: "陶寺遗址 出土 陶器",
          usedLocal: [],
          usedWeb: [],
          note: null,
        }),
      () =>
        chatReply({
          local_answer: "陶寺遗址出土陶器包括彩绘蟠龙纹陶盘等。",
          confidence: "medium",
          search_query: "",
          usedLocal: [],
          usedWeb: [0],
          note: null,
        }),
    ],
    search: [
      () =>
        searchReply([
          { title: "陶寺陶器", url: "https://example.com/t", snippet: "x", rerank_score: 2, authority: 3 },
        ]),
    ],
  });

  const res = await postChat({
    question: "它出土了哪些陶器",
    evidence: [],
    history: [{ role: "user", content: "介绍一下陶寺遗址" }],
  });
  await res.json();

  const searchCall = calls.find((c) => c.url.includes("/tools/search"));
  check(
    "搜索用改写后的查询词，而不是带代词的原文",
    searchCall?.body?.query === "陶寺遗址 出土 陶器",
    JSON.stringify(searchCall?.body),
  );
}

// ─── 10. 搜索有结果时，即使模型判定充足也进入第二遍 ────────────────────────────

console.log("\n[10] 每次都联网：搜索有结果就重问一遍，由模型决定是否引用");

{
  const calls = installMock({
    chat: [
      () =>
        chatReply({
          local_answer: "初版答案",
          confidence: "high",
          search_query: "",
          usedLocal: [0],
          usedWeb: [],
          note: null,
        }),
      () =>
        chatReply({
          local_answer: "终版答案",
          confidence: "high",
          search_query: "",
          usedLocal: [0],
          usedWeb: [0],
          note: null,
        }),
    ],
    search: [
      () =>
        searchReply([
          { title: "补充材料", url: "https://example.com/x", snippet: "y", rerank_score: 2.2, authority: 3 },
        ]),
    ],
  });

  const res = await postChat({ question: "陶寺遗址的规模和证据", evidence: EVIDENCE });
  const body = await res.json();

  check("共两次模型调用", calls.filter((c) => c.url.includes("/chat/completions")).length === 2);
  check("searchedWeb 为 true", body.meta?.searchedWeb === true);
  check("web 有 1 条", body.web?.length === 1, String(body.web?.length));
  check("采用第二遍答案", body.answer === "终版答案", body.answer);
}

// ─── 11. 分段输出：本地不相关时只给联网段，且不挂本地出处 ──────────────────────

console.log("\n[11] 分段输出：本地不相关时只给联网段");

{
  installMock({
    chat: [
      () =>
        chatReply({
          local_answer: "",
          web_answer: "",
          search_query: "陶寺遗址 附近 景点",
          confidence: "low",
          usedLocal: [],
          usedWeb: [],
          note: null,
        }),
      () =>
        chatReply({
          local_answer: "",
          web_answer: "· 丁村遗址\n· 洪洞大槐树寻根祭祖园\n· 壶口瀑布",
          search_query: "",
          confidence: "medium",
          usedLocal: [],
          usedWeb: [0],
          note: null,
        }),
    ],
    search: [
      () =>
        searchReply([
          { title: "临汾周边景点", url: "https://example.com/n", snippet: "x", rerank_score: 2, authority: 3 },
        ]),
    ],
  });

  const res = await postChat({ question: "陶寺遗址附近的景点有哪些", evidence: EVIDENCE });
  const body = await res.json();

  check("只有一段", body.segments?.length === 1, JSON.stringify(body.segments));
  check("该段是联网", body.segments?.[0]?.kind === "web", JSON.stringify(body.segments?.[0]));
  check("本地出处为空（不硬挂无关本地来源）", (body.local || []).length === 0, JSON.stringify(body.local));
  check("答案仍是分点", /· 丁村/.test(body.answer || ""), body.answer);
}

// ─── 12. 行程规划：高德距离矩阵 + 模型排序 + 校验 ───────────────────────────────

console.log("");
console.log("[12] 行程规划：距离按矩阵重算，编造地点被丢弃");

const PLAN_SITES = [
  { name: "陶寺遗址", culture: "龙山文化", period: "高潮", location: "山西临汾", brief: "观象台与宫城", domain: "黄河", lng: 111.52, lat: 35.88 },
  { name: "石峁遗址", culture: "龙山文化", period: "高潮", location: "陕西神木", brief: "皇城台石城", domain: "黄河", lng: 110.5, lat: 38.6 },
  { name: "碧村遗址", culture: "龙山文化", period: "高潮", location: "山西兴县", brief: "黄河边的石城", domain: "黄河", lng: 111.1, lat: 38.7 },
  { name: "南佐遗址", culture: "仰韶文化", period: "古国", location: "甘肃庆阳", brief: "大型宫殿基址", domain: "黄河", lng: 107.6, lat: 35.7 },
];

{
  const calls = installMock({
    geocode: [() => amapReply({ status: "1", geocodes: [{ location: "112.549,37.857" }] })],
    distance: [
      (body, url) => {
        const origins = new URL(url).searchParams.get("origins") || "";
        const n = origins.split("|").length;
        return amapReply({
          status: "1",
          results: Array.from({ length: n }, (_, i) => ({
            origin_id: String(i + 1),
            dest_id: "1",
            distance: "100000",
            duration: "6000",
            info: "ok",
          })),
        });
      },
    ],
    chat: [
      () =>
        chatReply({
          assumptions: ["未提供偏好，按黄河流域规划"],
          summary: "晋南—陕北的龙山都邑线",
          days: [
            {
              day: 1,
              title: "太原—临汾",
              stops: [{ site: "陶寺遗址", time: "14:00-17:00", highlight: "观象台与宫城", transport: "随便写的 3 小时" }],
              tips: "提前预约",
            },
            {
              day: 2,
              title: "临汾—神木",
              stops: [
                { site: "石峁遗址", time: "10:00-13:00", highlight: "皇城台", transport: "" },
                { site: "编造遗址", time: "", highlight: "", transport: "" },
              ],
              tips: "",
            },
          ],
          cautions: ["部分遗址需提前预约"],
        }),
    ],
  });

  const res = await worker.fetch(
    new Request("https://example.com/api/plan", {
      method: "POST",
      headers: { Origin: ORIGIN, "Content-Type": "application/json" },
      body: JSON.stringify({
        origin: "太原",
        days: 2,
        preferences: ["黄河"],
        travel: "自驾",
        sites: PLAN_SITES,
      }),
    }),
    { ...ENV, AMAP_WEB_KEY: "amap-test" },
  );
  const body = await res.json();

  check("状态 200", res.status === 200, JSON.stringify(body).slice(0, 200));
  check("调用了地理编码", calls.some((c) => c.url.includes("/geocode/geo")));
  check("调用了距离测量", calls.some((c) => c.url.includes("/v3/distance")));
  check("两天行程", body.days?.length === 2, String(body.days?.length));
  check("编造的地点被丢弃", !JSON.stringify(body).includes("编造遗址"));
  check(
    "车程引用矩阵数值而非模型写的",
    String(body.days?.[0]?.stops?.[0]?.transport || "").includes("驾车 100 公里") &&
      !JSON.stringify(body).includes("随便写的"),
    body.days?.[0]?.stops?.[0]?.transport,
  );
  check("总里程按矩阵重算", body.totals?.distance_km === 200, JSON.stringify(body.totals));
  check("总车程按矩阵重算", body.totals?.drive_hours === 3.3, JSON.stringify(body.totals));
  check("保留模型的注意事项", (body.cautions || []).some((c) => /预约/.test(c)), JSON.stringify(body.cautions));
  check("保留假设说明", (body.assumptions || []).length > 0);
}

{
  installMock({ geocode: [() => amapReply({ status: "1", geocodes: [] })] });
  const res = await worker.fetch(
    new Request("https://example.com/api/plan", {
      method: "POST",
      headers: { Origin: ORIGIN, "Content-Type": "application/json" },
      body: JSON.stringify({ origin: "不存在的地方", days: 2, sites: PLAN_SITES }),
    }),
    { ...ENV, AMAP_WEB_KEY: "amap-test" },
  );
  check("定位失败返回 400", res.status === 400, `实际 ${res.status}`);
}

// ─── 13. 自由描述规划：解析意图 + 联网找周边景区 + 车程重算 ──────────────────────

console.log("");
console.log("[13] 自由描述：解析意图、联网找周边景区");

{
  const calls = installMock({
    chat: [
      // 1) 解析意图
      () =>
        chatReply({
          origin: "太原",
          days: 2,
          anchor_sites: ["陶寺遗址"],
          nearby_query: "陶寺遗址 周边 景区",
          preferences: [],
          travel: "自驾",
        }),
      // 2) 从摘要里摘出周边景点
      () =>
        chatReply({
          attractions: [{ name: "壶口瀑布", note: "黄河壶口瀑布风景名胜区" }],
        }),
      // 3) 排行程
      () =>
        chatReply({
          assumptions: ["按 2 天安排"],
          summary: "太原出发，陶寺与壶口瀑布两日线",
          days: [
            {
              day: 1,
              title: "太原—临汾",
              stops: [{ site: "陶寺遗址", time: "下午", highlight: "观象台与宫城", transport: "" }],
              tips: "",
            },
            {
              day: 2,
              title: "临汾—吉县",
              stops: [{ site: "壶口瀑布", time: "上午", highlight: "", transport: "" }],
              tips: "",
            },
          ],
          cautions: [],
        }),
    ],
    search: [
      () =>
        searchReply([
          {
            title: "陶寺遗址周边景点推荐",
            url: "https://example.com/nearby",
            snippet: "陶寺遗址周边可顺道游览壶口瀑布、洪洞大槐树等",
            rerank_score: 2.2,
            authority: 3,
          },
        ]),
    ],
    geocode: [() => amapReply({ status: "1", geocodes: [{ location: "112.549,37.857" }] })],
    distance: [
      (body, url) => {
        const origins = new URL(url).searchParams.get("origins") || "";
        const n = origins.split("|").length;
        return amapReply({
          status: "1",
          results: Array.from({ length: n }, (_, i) => ({
            origin_id: String(i + 1),
            dest_id: "1",
            distance: "100000",
            duration: "6000",
            info: "ok",
          })),
        });
      },
    ],
  });

  const res = await worker.fetch(
    new Request("https://example.com/api/plan", {
      method: "POST",
      headers: { Origin: ORIGIN, "Content-Type": "application/json" },
      body: JSON.stringify({
        message: "我下周想去陶寺遗址，顺带去周边景区看看，从太原出发，两天",
        sites: PLAN_SITES,
      }),
    }),
    { ...ENV, AMAP_WEB_KEY: "amap-test" },
  );
  const body = await res.json();

  check("状态 200", res.status === 200, JSON.stringify(body).slice(0, 240));
  check(
    "三次模型调用（解析 / 摘景点 / 排行程）",
    calls.filter((c) => c.url.includes("/chat/completions")).length === 3,
    String(calls.filter((c) => c.url.includes("/chat/completions")).length),
  );
  check(
    "用解析出的查询词联网",
    calls.some((c) => c.url.includes("/tools/search") && /周边 景区/.test(JSON.stringify(c.body || {}))),
  );
  check("解析出出发地", body.resolved?.origin === "太原", JSON.stringify(body.resolved));
  check("解析出天数", body.resolved?.days === 2, JSON.stringify(body.resolved));
  check(
    "锚点遗址被识别",
    (body.resolved?.anchors || []).includes("陶寺遗址"),
    JSON.stringify(body.resolved?.anchors),
  );
  check("周边景区被摘出", body.nearby?.[0]?.name === "壶口瀑布", JSON.stringify(body.nearby));
  check(
    "周边景区进了行程",
    JSON.stringify(body.days || []).includes("壶口瀑布"),
    JSON.stringify(body.days || []),
  );
  check("总里程按矩阵重算", body.totals?.distance_km === 200, JSON.stringify(body.totals));
  check(
    "提示周边景点来自联网",
    (body.cautions || []).some((c) => /联网/.test(c)),
    JSON.stringify(body.cautions),
  );
}

// ─── 汇总 ─────────────────────────────────────────────────────────────────────

console.log(`\n通过 ${pass}，失败 ${fail}`);
if (fail > 0) {
  console.log("失败项：");
  for (const f of failures) console.log("  - " + f);
  process.exit(1);
}
