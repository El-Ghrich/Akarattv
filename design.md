# DESIGN.md: عقارات تيفي (Akarat TV)

A bilingual (Arabic primary, French secondary) real estate news website.
This file is the single source of truth for the visual design system.

---

## 1. Brand overview

**Name:** عقارات تيفي / Akarat TV
**Domain:** Real estate news, market analysis, laws and regulations, projects, investment, financing, guides.
**Audience:** Property buyers, investors, developers, agents and professionals, mainly in Morocco and the Arabic-speaking world, with a French-speaking segment.

**Personality:** Trustworthy, authoritative, modern, calm. A serious news outlet with the warmth of a premium property brand. Never flashy, never cluttered.

**Visual idea:** Deep forest green and brushed gold, taken directly from the logo, on a clean warm-white canvas. Generous whitespace, strong typographic hierarchy, large editorial photography. Green is the structure, gold is the accent that guides the eye.

**Keywords:** premium, editorial, clean, institutional, architectural, confident.

---

## 2. Logo usage

- The logo is a gold Arabic wordmark ("عقارات تيفي") with a monogram of a building outline and a gold "tv" mark.
- **On dark green backgrounds:** use the full-color logo (gold wordmark, as supplied).
- **On white or light backgrounds:** use a version with the wordmark in dark green (#0F2E04) and the gold accent kept. A dedicated light-background logo file should be prepared.
- Clear space around the logo: at least the height of the "tv" mark on all sides.
- Minimum height: 32px on mobile, 44px on desktop.
- Do not stretch, recolor outside the palette, or place on busy photos without a dark overlay.

---

## 3. Color palette

Values are derived from the logo and should be verified against the original brand file.

### Brand colors

| Token | Hex | Usage |
|---|---|---|
| `green-950` | `#0A2003` | Footer background, deepest surfaces |
| `green-900` | `#0F2E04` | Header background, primary dark |
| `green-800` | `#143A06` | Logo background tone, hero overlays |
| `green-700` | `#1F4F0C` | Hover on dark surfaces |
| `green-600` | `#2E6A17` | Links, secondary buttons |
| `green-100` | `#E6EFE1` | Tints, subtle highlights |
| `gold-500` | `#C9A24B` | **Main accent**: buttons, highlights, active states |
| `gold-400` | `#DDBE6F` | Hover, light accents |
| `gold-300` | `#EBD59C` | Soft backgrounds for badges |
| `gold-700` | `#8F6B1F` | Gold text on light backgrounds (contrast) |

### Neutrals

| Token | Hex | Usage |
|---|---|---|
| `ink-900` | `#111712` | Primary text |
| `ink-700` | `#3A423B` | Body text |
| `ink-500` | `#6B746C` | Secondary text, metadata |
| `ink-300` | `#B8BFB8` | Disabled, placeholder |
| `line` | `#E5E1D3` | Borders, dividers |
| `canvas` | `#F7F5EF` | Page background (warm off-white) |
| `surface` | `#FFFFFF` | Cards, article body |

### Semantic

| Token | Hex | Usage |
|---|---|---|
| `breaking` | `#B3261E` | "Breaking" label only |
| `success` | `#2E7D32` | Confirmations (newsletter) |
| `error` | `#B3261E` | Form errors |

### Gold gradient (use sparingly)
`linear-gradient(135deg, #8F6B1F 0%, #DDBE6F 50%, #C9A24B 100%)`
Only for the logo area, thin decorative rules, and one key button. Everything else uses flat gold.

### Contrast rules
- Body text on `canvas` or `surface`: `ink-900` or `ink-700`.
- Gold text on white fails contrast. Use `gold-700` for text, `gold-500` only for fills, borders and icons.
- Text on `green-900`: white or `gold-300`.

---

## 4. Typography

**Font family: Cairo** (Google Fonts), for both Arabic and Latin text.
Load subsets: `arabic` and `latin`. Weights: 400, 600, 700, 800.

Fallback stack: `"Cairo", "Segoe UI", Tahoma, system-ui, sans-serif`.

### Scale (desktop / mobile)

| Role | Size | Weight | Line height |
|---|---|---|---|
| Display (hero headline) | 44px / 30px | 800 | 1.35 |
| H1 (article title) | 38px / 28px | 800 | 1.4 |
| H2 | 28px / 22px | 700 | 1.45 |
| H3 | 22px / 19px | 700 | 1.5 |
| Card title | 20px / 18px | 700 | 1.5 |
| Body (article) | 19px / 17px | 400 | 1.9 |
| Body (UI) | 16px | 400 | 1.7 |
| Meta / caption | 14px | 600 | 1.5 |
| Label / badge | 12px | 700 | 1.2 |

### Rules
- Arabic needs more line height than Latin. Never go below 1.6 for Arabic body text.
- Never use letter-spacing on Arabic text. Letter-spacing only on small Latin uppercase labels (0.04em).
- No italics for Arabic. Use weight or color for emphasis.
- Numbers: use Western digits (0-9) consistently across both languages.
- Keep line length between 55 and 75 characters for article body.

---

## 5. Layout and spacing

- **Direction:** RTL by default (`dir="rtl"`, `lang="ar"`). French pages use LTR (`dir="ltr"`, `lang="fr"`). Use logical properties only (start/end, never left/right).
- **Grid:** 12 columns, max content width 1280px, gutters 24px (16px on mobile).
- **Spacing scale (4px base):** 4, 8, 12, 16, 24, 32, 48, 64, 96.
- **Section spacing:** 64px between homepage sections on desktop, 40px on mobile.
- **Breakpoints:** mobile 0-639, tablet 640-1023, desktop 1024+.

### Shape and elevation
- Radius: 8px for cards and inputs, 999px for pills and badges, 0 for hero image edges.
- Shadows are subtle: `0 1px 2px rgba(15,46,4,0.06)` for cards; `0 8px 24px rgba(15,46,4,0.10)` on hover only.
- Borders: 1px `line`. Prefer borders and whitespace over heavy shadows.

---

## 6. Components

### Header
- Top utility bar (green-950): date in current language, language switcher (AR | FR), search icon. Height 36px.
- Main header (green-900): logo at the start side, primary navigation of category links, search and newsletter button at the end side. Sticky on scroll, collapses to a compact height.
- Active category: gold underline (3px). Hover: `gold-400` text.
- Mobile: logo, search icon, hamburger. Full-screen drawer menu with category list and language switch.

### Breaking / latest ticker (optional strip under header)
- White strip, red "عاجل" / "Dernière minute" label, horizontally scrolling headlines. Hidden if there is no breaking news.

### Buttons
- **Primary:** gold-500 fill, green-950 text, 8px radius, 44px height, weight 700. Hover: gold-400.
- **Secondary:** transparent, 1px green-700 border, green-900 text. Hover: green-100 fill.
- **On dark:** transparent, 1px gold-500 border, gold-300 text.
- Focus ring: 2px gold-500 with 2px offset on every interactive element.

### Category badge
- Pill, `gold-300` background, `gold-700` text, 12px bold. Sits above the title on cards.

### Article cards
1. **Hero card:** large 16:9 image with a dark green gradient overlay at the bottom, badge, headline (white, display size), meta line.
2. **Standard card:** image 3:2 on top, badge, title (max 3 lines), excerpt (max 2 lines, hidden on mobile), meta (date, reading time).
3. **Compact card:** small square thumbnail 96px beside a 3-line title and date. Used in lists and sidebars.
4. **Horizontal card:** image beside text, used for the latest-news feed.
- Image corners: 8px. Hover: image zooms 1.03x over 300ms, title turns green-600.

### Section header
- Category title in H2 (green-900), a short gold bar (48px by 3px) under it, and a "View all" link at the end side with an arrow that follows text direction.

### Region chips
- Horizontal scrollable row of pills (city names). White with a `line` border; hover fills `green-100`.

### Newsletter block
- Full-width band in green-900 with a subtle architectural line pattern at low opacity. Headline in white, one-line subtext in gold-300, email input and gold primary button side by side (stacked on mobile). Small privacy note below.

### Footer
- Background green-950. Logo, short description, columns for categories, regions, About, Editorial policy, Contact, Privacy and Terms. Social icons in gold. Language switcher. Copyright line.

### Article page (for later screens)
- Breadcrumb, badge, H1, excerpt, author line with avatar and date, hero image with caption and credit, narrow content column (720px) with semantic blocks: H2, H3, blockquote with a gold start border, figure with figcaption, info box (green-100 background), related articles at the bottom.

---

## 7. Homepage structure

1. Utility bar and header
2. Breaking ticker (conditional)
3. **Hero zone:** one large featured article (2/3 width) and a column of 3 compact latest articles (1/3 width)
4. **Latest news:** 4-card grid (standard cards)
5. **Category blocks:** repeated for each category, each with a section header and 1 large card plus 3 compact cards
6. **Region chips:** "Browse by city"
7. **Newsletter band**
8. Footer

---

## 8. Imagery

- Real estate photography: architecture, skylines, interiors, construction sites, Moroccan and Arabic urban landscapes. Natural light, high quality.
- Avoid generic stock handshake photos and heavy filters.
- Hero images at least 1600px wide. Overlay gradient `rgba(10,32,3,0) to rgba(10,32,3,0.85)` for text legibility.
- Placeholder when no image: `green-100` background with the logo monogram in gold at low opacity.

---

## 9. Motion

- Subtle only. 150-300ms, ease-out.
- Allowed: hover states, image zoom on cards, header compacting, drawer slide.
- Respect `prefers-reduced-motion`.
- No auto-playing carousels.

---

## 10. Accessibility

- WCAG AA contrast minimum.
- Visible focus states on all interactive elements.
- Every image has alt text in the active language.
- Touch targets at least 44px.
- Semantic landmarks: header, nav, main, article, aside, footer. One H1 per page.
- Language and direction are declared on the root element and on any inline text in another language.

---

## 11. Do and don't

**Do**
- Let green be the structure and gold be the accent, used in small doses.
- Use whitespace and clear hierarchy, with large readable Arabic headlines.
- Keep the mirrored RTL layout natural: logo at the right, nav flows right to left.
- Keep every card in a section visually consistent.

**Don't**
- Don't use gold for large text blocks on white.
- Don't add extra colors beyond the palette.
- Don't use heavy shadows, gradients on every surface, or decorative clutter.
- Don't use left/right in layout logic; always start/end.
- Don't use more than two card styles in one section.