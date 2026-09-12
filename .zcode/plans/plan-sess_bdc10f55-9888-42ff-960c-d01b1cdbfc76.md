# 中华文明探源工程网站 — 改版计划（修订版）：结构不动 · 沉浸式质感升级

## 核心原则

**四大板块与导航完全保留**：时空探源 / 文化遗珍 / 探源社区 / 个人中心 的 Tab 结构、吸顶导航、各模块内容与功能（高德地图、canvas-confetti、AI 助手、全部文案与图片）一律不动。所有升级都在各板块**内部**进行——视觉质感 + 沉浸式交互。

执行模式：**本会话完成准备工作**（Git 安全网 + 任务书），**你重启 ZCode 后由新会话派发 web-designer agent 按任务书执行**。

---

## 阶段 0：本会话内完成（重启前）

### 0.1 Git 安全网（还原保障）
在仓库 `D:\codex\end` 执行：
```
git tag backup-pre-redesign                  # 给当前已上线的状态打标签
git checkout -b feature/immersive-polish     # 改版工作全部在此分支
```
- GitHub Pages 只跟随 main 部署 → **改版期间线上网站完全不变**
- 不满意：`git checkout main && git branch -D feature/immersive-polish` → 本地一秒还原
- 满意：合并进 main 推送上线；上线后反悔仍可 `git revert` / 回退到 tag

### 0.2 生成任务书 `D:\codex\end\改版任务书-沉浸式质感升级.md`
新会话没有本轮对话记忆，任务书是 agent 的全部上下文，包含：

**现状盘点（已查明）**
- 单文件 `网页代码/src/app/App.tsx`（5228 行），Tab 切换：时空探源（含高德地图 18 处引用、CinematicPrologue 电影序章约 960 行）/ 文化遗珍 / 探源社区 / 个人中心 + AIAssistant
- 主题 "Imperial Han"：背景 #17130d、鎏金 #c9a227/#C89640、绛红 #8b1a1a、绢米 #f0e6cc、radius 0、Noto Serif SC
- 图片资产 170+ 张（黄河/长江/其他遗址，出土文物 + 非遗照片），当前利用率低

**升级清单（按板块，结构不动）**
- 全局：滚动渐显动画、青铜纹样装饰系统、鎏金渐变标题、四字短语章节分隔强化、按钮/链接微交互
- 时空探源：hero 加轻量 WebGL 背景（react-bits，全页仅 1 个 + 移动端静态降级）、地图⇄时间轴双向联动（点时间轴地图飞行定位/点地图高亮年代）、章节式滚动叙事
- 文化遗珍：文物卡片 hover 3D 倾斜/高光扫过/图片慢 zoom、点击弹出文物深度查看层（大图+纹饰细节）、CountUp 数字统计（遗址数/文物数/年代跨度）
- 探源社区：图片画廊升级（hover 揭示、瀑布流排布）、非遗文化卡片动效
- 个人中心：轻度质感统一（不新增功能）
- 收尾：impeccable 清单审查、无障碍 + prefers-reduced-motion、图片懒加载、移动端适配

**技能使用指引**（agent 直接照做）
- ui-ux-pro-max：`python scripts/search.py "<关键词>" --domain style|ux / --stack react`（在 `C:\Users\刘振洲\.zcode\skills\ui-ux-pro-max` 下执行，Windows 用 python）
- react-bits：查 `C:\Users\刘振洲\.agents\skills\react-bits\reference\catalog.md` 选组件，`npx shadcn@latest add "@react-bits/<组件>-TS-TW"` 安装；优先轻量组件（如 CountUp、SplitText、GlareHover），WebGL 背景仅 hero 一处
- impeccable：收尾阶段逐条对照其 SKILL.md 审查
- karpathy-guidelines：外科手术式修改——5228 行单文件只改必要处，不重写可用代码，不动 Tab 架构

**硬性约束**
- 不增删 Tab、不重组模块、不换导航结构；高德地图与现有功能必须保持可用
- 性能预算：WebGL 组件全站 1 个、移动端降级、图片懒加载
- 遵循现有 Imperial Han 主题色板，不换风格基调

**里程碑与验收**
- M1 全局质感（装饰系统/滚动渐显/标题升级）+ 时空探源 hero
- M2 文化遗珍（卡片/深度查看/CountUp）+ 探源社区画廊
- M3 地图⇄时间轴联动 + 沉浸叙事
- M4 impeccable 审查 + 性能与移动端收尾

**还原操作手册**（写给新会话和用户）

### 0.3 你重启 ZCode

---

## 阶段 1：重启后（新会话）

1. 你说：**"读取 D:\codex\end\改版任务书-沉浸式质感升级.md，用 web-designer agent 按里程碑执行"**
2. 主会话确认 web-designer agent 已加载，按 M1→M4 分批派发；每个里程碑启动 `npm run dev`（localhost:5173）供你浏览器验收，确认后才进入下一里程碑
3. 全部完成后（可选）渲染 PNG 交 judge agent 视觉验收
4. 你满意后合并分支推送上线

---

## 验收标准
- 每里程碑你实际过目确认
- 最终：桌面/移动端正常、无障碍达标、WebGL 可降级、高德地图等功能无损
- 线上站在合并前保持原版