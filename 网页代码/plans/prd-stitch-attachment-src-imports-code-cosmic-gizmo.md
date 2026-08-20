# 中华文明探源工程文旅数字化平台 — Phase 3: Card Texture & Section Transition

## Context

Two visual refinements requested by the user after seeing the current prologue:

1. **方案B — 宣纸拓片风 cards**: The bottom cards in both 源 (4 cards) and 汇 (3 cards) sections look visually flat and dark. Replace with a high-contrast "rubbing on xuan paper" aesthetic: warm parchment background (#E8D4A8 range) on dark page, ink-black text, fine ink-border lines, large calligraphic title with subtle ink-bleed shadow. The light cards stand out dramatically from the surrounding dark page, like physical rubbing cards placed on a museum display.

2. **方案甲 — 金线分割 chapter transitions**: The boundaries between sections (Grand Opening → 源 → 流 → 汇) are currently invisible hard cuts. Insert a thin decorative transition strip (~100–120px tall) between each pair of sections: pure near-black background, centered thin gold horizontal rule, centered ornament glyph (◆), and a small classical poetic phrase beneath. Feels like a chapter divider in a thread-bound classical book (线装书).

---

## File to Modify

`src/app/App.tsx` only. All changes are in the `CinematicPrologue` function (lines ~245–522).

---

## Implementation Plan

### A. 宣纸拓片 Card Style (源 bottom 4-card grid + 汇 bottom 3-card grid)

**Visual spec:**
- Background: `#EAD9B0` (warm aged xuan paper)
- Text (body): `#1A0C04` (deep ink black)
- Title: `#0E0604`, font `FD` (Zhi Mang Xing), large (~text-3xl), with `textShadow: "1px 2px 8px rgba(10,4,0,0.18)"` for ink-bleed feel
- Era label (源 cards only): `#6B4820`, small caps, font `FH`
- English sub (汇 cards only): `#7A5A30`, font `FE`, xs
- Border: `1px solid rgba(90,50,10,0.30)` — thin ink-line
- No border-radius (already 0)
- Hover (汇 cards): keep existing `-translate-y-2 scale hover:shadow` but shadow color changes to `rgba(200,150,64,0.25)`
- The 4 源 cards: remove individual `bg-*` classes, all use same parchment bg
- The 3 汇 cards: same parchment bg

**Code location:**
- 源 cards: `src/app/App.tsx` ~line 339–357 (`.map(card =>` block, `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4`)
- 汇 cards: `src/app/App.tsx` ~line 494–509 (`.map(card =>` block, `grid grid-cols-1 md:grid-cols-3 gap-3`)

**Change pattern (same for both grids):**

```tsx
// Before
<div key={card.title} className={`${card.bg} border-t ${card.border} p-8 ...`}>
  <div className="text-xs ... text-primary/40 ...">{card.era}</div>
  <h3 className="text-foreground/90 text-2xl ..." style={{ fontFamily: FD }}>{card.title}</h3>
  <p className="text-muted-foreground ...">{card.text}</p>

// After
<div key={card.title} className="p-8 ..." style={{ background: "#EAD9B0", border: "1px solid rgba(90,50,10,0.28)" }}>
  <div className="text-xs ..." style={{ color: "#7A5830", fontFamily: FH }}>{card.era}</div>
  <h3 className="text-3xl mb-4" style={{ color: "#0E0604", fontFamily: FD, textShadow: "1px 2px 8px rgba(10,4,0,0.18)" }}>{card.title}</h3>
  <p className="leading-relaxed" style={{ color: "#2A1A0A" }}>{card.text}</p>
```

### B. 金线分割 Transition Strips

Insert a `<ChapterDivider>` component between each section. Create a small inline helper component above `CinematicPrologue`:

```tsx
function ChapterDivider({ phrase }: { phrase: string }) {
  return (
    <div className="relative flex flex-col items-center justify-center py-10 bg-[#0E0604]">
      <div className="h-px w-48 bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
      <div className="my-3 text-primary/80 text-lg" style={{ fontFamily: FD }}>◆</div>
      <p className="text-primary/45 text-xs tracking-[0.35em]" style={{ fontFamily: FH }}>{phrase}</p>
      <div className="h-px w-48 bg-gradient-to-r from-transparent via-primary/70 to-transparent mt-3" />
    </div>
  );
}
```

Insert between sections:
- After Section 1 (Grand Opening) → before Section 2 (源): `<ChapterDivider phrase="天地玄黄·文明初萌" />`
- After Section 2 (源) → before Section 3 (流): `<ChapterDivider phrase="万流归宗·生生不息" />`
- After Section 3 (流) → before Section 4 (汇): `<ChapterDivider phrase="殊途同归·华夏一统" />`

**Code insertion points** in `CinematicPrologue` return JSX:
- Between `</section>{/* Section 2 */}` and `{/* Section 3 */}` (after line ~359)
- Between `</section>{/* Section 3 */}` and `{/* Section 4 */}` (after line ~407)
- Between `</section>{/* Grand Opening */}` and `{/* Section 2 */}` (after line ~282)

---

## Visual Effect Description for User

**方案B 宣纸拓片**: Each card looks like a physical slip of aged paper laid on a dark surface. The warm parchment color (#EAD9B0) pops sharply against the near-black page. Titles in Zhi Mang Xing calligraphy appear as if brushed in ink. Body text in dark sepia. The contrast between light cards and dark surroundings mirrors how museum display cases illuminate artifacts against darkness.

**方案甲 金线分割**: A narrow (~100px) completely dark strip separates each chapter. Within it, a gold gradient rule fades in from both sides toward center, a subtle diamond glyph (◆) floats at the midpoint, and a four-character classical phrase sits below in small gold text. Like turning a page in a classical thread-bound book — minimal, ceremonial, clearly marking the transition without interrupting the mood.

---

## Verification

After implementation:
- Scroll through the full prologue — confirm 3 divider strips appear between 4 sections
- Check 源 section: 4 cards should show warm parchment bg, ink titles, no dark card bg
- Check 汇 section: 3 cards same parchment style, hover still lifts cards
- Confirm text readability on parchment cards (dark ink on light bg)
- No TypeScript or build errors


**Phase 2** addresses three user requests:
1. Reference the **"何以中国"** (Making of Zhongguo) visual style from 故宫博物院 — monumental single-character typographic anchors, full-screen cinematic sections, poetic classical prose, chapter-block subdivisions.
2. Replace gradient `ImgPlaceholder` divs with **real Unsplash images** throughout (hero, site cards, activity cards, post thumbnails).
3. Redesign the **时空探源** module to include a cinematic prologue (scrolling narrative intro) before the map, and replace the plain filter buttons with a **beautiful illustrated horizontal timeline**.

**User-uploaded reference images** (`src/imports/1.png–4.png`) are screenshots of the 何以中国 exhibition page showing the exact aesthetic to reference: warm terra-cotta/gold tones, giant chapter characters (源/流/汇), colored chapter-block subdivisions, classical prose layout.

---

## Approach

Full rewrite of `src/app/App.tsx` only. Fonts and theme CSS are already correct from Phase 1. The primary changes are:

1. Import the 4 user-uploaded PNG images from `src/imports/` and Unsplash URLs as real image sources
2. Add a `CinematicPrologue` component at the top of `ModuleTimeSpace`
3. Replace the flat button timeline filter with a `HorizontalTimeline` component
4. Swap `ImgPlaceholder` gradient backgrounds with real `<img>` tags across all modules

---

## File Changes — `src/app/App.tsx` only

### A. Image Assets

**Imported PNGs** (user-uploaded reference art, used as decorative visual anchors):
```ts
import ref1 from "../imports/1.png"; // 何以中国 title page — orange/gold hero
import ref2 from "../imports/2.png"; // 源章 — chapter blocks
import ref3 from "../imports/3.png"; // 流章 — text + large character
import ref4 from "../imports/4.png"; // 汇章 — subdivisions
```

**Unsplash URLs** (curated from search results, stored as a `IMGS` constant object):
```ts
const IMGS = {
  heroMountain:   "https://images.unsplash.com/photo-1770637112710-40b2e3c2d333?...", // karst mountains at dusk
  inkWash:        "https://images.unsplash.com/photo-1762114974502-551aeb189066?...", // traditional ink wash painting
  mistyRiver:     "https://images.unsplash.com/photo-1779437651154-b08971da294f?...", // misty karst + river
  bronzeVessel:   "https://images.unsplash.com/photo-1758092320137-e9dcf38c8672?...", // ancient bronze bull
  terracottaJar:  "https://images.unsplash.com/photo-1758092320133-cd36eea79f46?...", // ornate terracotta jar
  paintedPottery: "https://images.unsplash.com/photo-1761724794595-44562ceac80c?...", // pottery with floral designs
  ceramicVessel:  "https://images.unsplash.com/photo-1758092320158-1d12b7dfea4b?...", // ancient ceramic with figures
  stoneStructure: "https://images.unsplash.com/photo-1726372060171-ab2314c4fd8f?...", // stone structures on hillside
  stoneCarvings:  "https://images.unsplash.com/photo-1769888913161-ec40418b7c07?...", // intricate stone carvings
  digTools:       "https://images.unsplash.com/photo-1632821405254-a8166e7c201d?...", // archaeology dig close-up
  chineseTemple:  "https://images.unsplash.com/photo-1507868162883-6b769c1a88c1?...", // Chinese cultural heritage
}
```

### B. New `CinematicPrologue` Component

Inserted as the first child of `ModuleTimeSpace`, before the filter bar. Three full-viewport-height sections, scroll naturally one into the next:

**Section 1 — Grand Opening** (`min-h-screen`):
- Background: `IMGS.heroMountain` with `object-cover` + dark overlay gradient (bottom 60% to `#0d0905`)
- Centered: small English subtitle `"ORIGINS OF CHINESE CIVILIZATION"` in gold tracking-widest
- Giant central text: `中华文明探源` (96px, Noto Serif SC, Silk Cream)
- Below: a 3-line poetic couplet in muted gold about 5000 years of civilization
- Bottom: animated gold chevron-down scroll cue

**Section 2 — 源 (Origin chapter, mirroring 何以中国)**:
- Split layout: left 40% = huge calligraphic character `源` (200px, semi-transparent gold), right 60% = prose block
- Prose: "源，聚多源之水，奔涌成流。数万年前，中华先民在黄河、长江、西辽河流域生生不息…" (3 short paragraphs in muted cream)
- Background: `IMGS.inkWash` at 15% opacity as a full-cover tinted layer
- Three chapter-block cards beneath the prose (matching 何以中国's colored subdivisions):
  - `天地之间` — teal-dark (#1a2d2a), with brief about environment
  - `生作在兹` — terracotta (#2d1a0d), with brief about agriculture origins  
  - `启蒙奠基` — deep gold (#2d2200), with brief about early institutions
  - Each card: 140px tall, chapter name large, brief paragraph small, no border-radius

**Section 3 — 流 (Civilizational flow)**:
- Right-aligned monumental `流` character (180px, gold/20 opacity) 
- Left side: 3 bold chapter theme headers stacked vertically — `血脉相依 / 和衷共济 / 休戚与共`
- Thin gold vertical line connecting them (absolute positioned, 1px, left: 0)
- Right side: body prose about the continuity and exchange of Chinese civilization
- Background: `IMGS.mistyRiver` at 20% opacity

**Transition to Map**:
- A final narrow section: gold horizontal divider line, then centered text `"探索二十九处文明遗址"` with a down-arrow icon, which scrolls the user to the filter/map section

### C. New `HorizontalTimeline` Component

Replaces the 5 plain filter `<button>` tags. A visually rich horizontal era selector:

```
 8000BCE ─────────────────────────────────────── 221BCE
          ●               ●          ●        ●
        仰韶文化         良渚文化    二里头     商周文明
       8000–5000BC     5300–4300BC 1900–1500BC 1600–256BC
       彩陶·农耕       玉器·水利    青铜·宫殿   礼乐·铭文
```

Implementation:
- Container: `relative w-full h-32 flex items-center`
- Background horizontal line: `absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent`
- 5 nodes (全部 + 4 eras) evenly spaced using `justify-between` flex
- Each node:
  - Year range label ABOVE the line (text-xs, muted-foreground)
  - Circular dot ON the line (w-3 h-3 rounded-full, border border-primary, bg-background)  
  - Active dot: w-4 h-4 bg-primary with pulsing `animate-ping` outer ring (opacity-30)
  - Era name BELOW the dot (text-sm, foreground when active, muted otherwise)
  - Artifact keyword BELOW name (text-xs, tracking-widest, primary/60)
- Clicking a node sets `timePeriod` state, filters map markers
- "全部" node at left has no year range, shows a special `◆` diamond glyph instead of a dot

### D. Image Integration across All Modules

Replace all `<ImgPlaceholder>` gradient divs with `<img src={url} className="w-full h-full object-cover" />` wrapped in the same size container.

Assign images semantically:
- **时空探源 prologue sections**: heroMountain, inkWash, mistyRiver
- **Map drawer header**: rotate through ceramicVessel / bronzeVessel / paintedPottery based on `selectedSite.id % 3`
- **Featured site cards** (3 cards): stoneStructure, paintedPottery, bronzeVessel
- **文化遗珍 activity cards** (9 items): cycle through bronzeVessel, terracottaJar, paintedPottery, ceramicVessel, chineseTemple, stoneStructure, stoneCarvings, digTools, mistyRiver
- **Community posts image grids**: mistyRiver, stoneStructure, inkWash (repeated for post image grids)
- **Personal center profile bg**: inkWash

### E. Content Enrichment

**Navigation**: add `中华文明探源工程` subtitle line below logo in header (smaller, cream/50).

**Featured sites section**: expand from 3 to 4 cards; add a 4th "殷墟遗址" card.

**ModuleCommunity sidebar**: Add a new "关于探源工程" info panel below experts with 2-line summary and external link prompt.

**Footer**: Add three column layout — About / Quick Links / Contact — with the 何以中国-style gold divider separating from main.

---

## Verification

1. Build check: all PNG imports resolve (files exist at `src/imports/1.png` through `4.png`)
2. Unsplash images load (no CORS issue — Unsplash CDN supports browser fetch)
3. Cinematic prologue renders all 3 sections, each fills viewport height
4. Timeline component shows all 5 nodes with correct year labels; clicking each filters map markers
5. All 4 module tabs remain functional
6. AI chat, drawer, and masonry filter all still work
7. Mobile layout: timeline scrolls horizontally on small screens (`overflow-x-auto`)
