---
name: Imperial Han
colors:
  surface: '#17130d'
  surface-dim: '#17130d'
  surface-bright: '#3e3832'
  surface-container-lowest: '#120d08'
  surface-container-low: '#201b15'
  surface-container: '#241f19'
  surface-container-high: '#2e2923'
  surface-container-highest: '#3a342d'
  on-surface: '#ebe1d7'
  on-surface-variant: '#d1c5af'
  inverse-surface: '#ebe1d7'
  inverse-on-surface: '#352f29'
  outline: '#99907b'
  outline-variant: '#4d4635'
  surface-tint: '#ecc246'
  primary: '#ecc246'
  on-primary: '#3d2e00'
  primary-container: '#c9a227'
  on-primary-container: '#4b3a00'
  inverse-primary: '#755b00'
  secondary: '#ffb3ac'
  on-secondary: '#680007'
  secondary-container: '#8e1c1c'
  on-secondary-container: '#ff9e96'
  tertiary: '#cfc6ad'
  on-tertiary: '#35301f'
  tertiary-container: '#afa68f'
  on-tertiary-container: '#413c2a'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffe08e'
  primary-fixed-dim: '#ecc246'
  on-primary-fixed: '#241a00'
  on-primary-fixed-variant: '#584400'
  secondary-fixed: '#ffdad6'
  secondary-fixed-dim: '#ffb3ac'
  on-secondary-fixed: '#410003'
  on-secondary-fixed-variant: '#8a1a1a'
  tertiary-fixed: '#ece2c8'
  tertiary-fixed-dim: '#cfc6ad'
  on-tertiary-fixed: '#201b0b'
  on-tertiary-fixed-variant: '#4c4734'
  background: '#17130d'
  on-background: '#ebe1d7'
  surface-variant: '#3a342d'
  xuanshu-black: '#0d0905'
  jinqi-gold: '#c9a227'
  chini-red: '#8b1a1a'
  silk-cream: '#f0e6cc'
  wood-charcoal: '#1a1108'
  muted-gold: '#8b7a5e'
typography:
  hero-display:
    fontFamily: Noto Serif SC
    fontSize: 96px
    fontWeight: '400'
    lineHeight: 112px
    letterSpacing: 0.05em
  hero-display-mobile:
    fontFamily: Noto Serif SC
    fontSize: 48px
    fontWeight: '400'
    lineHeight: 56px
  section-heading:
    fontFamily: Noto Serif SC
    fontSize: 48px
    fontWeight: '400'
    lineHeight: 60px
  card-heading:
    fontFamily: Noto Serif SC
    fontSize: 20px
    fontWeight: '400'
    lineHeight: 28px
  body-lg:
    fontFamily: Noto Serif SC
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 32px
  body-md:
    fontFamily: Noto Serif SC
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 28px
  label-caps:
    fontFamily: Noto Serif SC
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.2em
  metadata:
    fontFamily: Noto Serif SC
    fontSize: 10px
    fontWeight: '400'
    lineHeight: 14px
    letterSpacing: 0.3em
spacing:
  unit: 4px
  gutter: 24px
  margin-mobile: 24px
  margin-desktop: 32px
  section-padding: 96px
  container-max: 1280px
---

## Brand & Style

This design system embodies the **Imperial & Ceremonial** essence of the Han Dynasty, blending historical gravitas with modern minimalist precision. The brand personality is solemn, authoritative, and culturally profound, designed to evoke a sense of "Grand Han Atmosphere" (大汉气象). 

The visual style is a fusion of **Corporate Modernism** and **Imperial Brutalism**. It utilizes architectural framing, sharp geometries, and a "museum-gallery" layout to create a cinematic and academic experience. Key aesthetic drivers include:
- **Lacquerware Aesthetic:** Deep, high-contrast surfaces inspired by traditional Chinese lacquer.
- **Architectural Framing:** Use of bracketed corners and rigid lines mimicking traditional post-and-beam construction.
- **Atmospheric Depth:** Layered compositions using dark overlays, shimmering gold accents, and vertical typography.

## Colors

The palette is derived from the "Three Colors of Empire": **Xuan** (Deep Black), **Chi** (Cinnabar Red), and **Jin** (Imperial Gold). 

- **Primary (Gold):** Used for branding, interactive states, and ornamental framing. It represents the "Golden Age" and divinity.
- **Secondary (Red):** Reserved for high-impact Call-to-Action (CTA) elements, badges, and cultural emphasis.
- **Tertiary (Cream):** The primary text color, chosen for its high legibility against dark backgrounds and its resemblance to aged silk or paper.
- **Neutral (Black):** The foundation of the system, providing a deep, infinite canvas that allows gold and red to shimmer.

Decorative dividers utilize a vanishing gold gradient (`from-transparent via-gold/40 to-transparent`) to separate sections without breaking the flow of the "eternal" black background.

## Typography

The typography system is built exclusively on **Noto Serif SC** to maintain cultural authenticity and a scholarly tone. 

- **Hierarchical Contrast:** Use extreme size differentials between Hero Display (96px) and Metadata (10px) to create a dramatic, cinematic rhythm.
- **Letter Spacing:** Apply generous tracking (up to 0.3em) to labels and metadata to evoke the feeling of luxury museum placards.
- **Vertical Orientation:** For decorative sidebar titles, utilize vertical writing modes to mimic traditional Chinese scrolls and bamboo slips.
- **Bilingual Balance:** When English subtitles are used, they should be treated as metadata—small, widely spaced, and secondary to the primary Chinese glyphs.

## Layout & Spacing

The layout philosophy follows a **Museum Gallery Model**, prioritizing whitespace (or "dark space") to create a sense of scale and importance.

- **Fixed Grid:** A 12-column grid system is used within a maximum container width of 1280px.
- **Section Rhythm:** Major sections are separated by significant vertical padding (96px to 120px) to allow content to "breathe" and maintain a slow, ceremonial pace of discovery.
- **Responsive Reflow:**
  - **Desktop:** Multi-column grids (3 or 4 columns) for cards and experiences.
  - **Tablet:** 2-column transition.
  - **Mobile:** Single column with 24px side margins. 
- **The "Vertical Axis":** Use thin, 1px vertical gold lines to guide the eye downward through the content sections, acting as a structural "spine" for the page.

## Elevation & Depth

This system avoids modern drop shadows in favor of **Tonal Layering** and **Atmospheric Gradients**.

- **Surfaces:** Depth is achieved by placing cards (`#1a1108`) on the base background (`#0d0905`). These surfaces are distinguished by a subtle 1px border in low-opacity gold (15%).
- **Glassmorphism:** Navigation bars and sticky elements use a heavy backdrop blur (8px to 12px) with an 80% opaque dark fill to maintain legibility without losing the sense of underlying background imagery.
- **Light Wells:** Use radial gradients and bottom-up linear gradients on large images to "sink" the visual content into the darkness, making text overlays pop.
- **Framing:** Elements are elevated through "Bracketed Corners"—absolute positioned 1px L-shaped borders—rather than shadows.

## Shapes

The shape language is strictly **Sharp (0px roundedness)**. 

Every UI element—from buttons and cards to input fields and image containers—must utilize 90-degree corners. This rigidity mirrors the timber-frame architecture and stone masonry of the Han Dynasty. 

The only exception to this rule is for purely decorative "seal" elements or circular icons which may use `rounded-full` to represent traditional ink stamps.

## Components

- **Buttons:**
  - *Primary:* Rectangular, sharp-edged, solid `#8b1a1a` (Red) background with `#f0e6cc` text. No border.
  - *Outline:* Sharp-edged, 1px `#c9a227` (Gold) border with gold text. Subtle hover scale effect (1.02x).
- **Cards:**
  - Background: `#1a1108`.
  - Border: 1px `#c9a227` at 15% opacity.
  - Detail: Add absolute-positioned "Corner Brackets" (1px gold) to the top-left and bottom-right of featured cards.
- **Dividers:** 
  - Horizontal: A vanishing line created with a linear gradient (transparent -> gold/40 -> transparent).
  - Glyph: Use a small gold diamond glyph (◆) to break text-heavy sections.
- **Inputs:** 
  - Sharp corners, deep black background, 1px gold border. 
  - Focus state: Border opacity increases to 100% with a subtle inner gold glow.
- **Navigation:**
  - Sticky header with heavy backdrop blur.
  - Active links are indicated by a 2px gold underline or a vertical gold bar.
- **Interactive States:** 
  - Image hover: Slow cinematic zoom (duration 700ms).
  - List items: Text shifts 8px to the right on hover, accompanied by a small gold arrow icon.