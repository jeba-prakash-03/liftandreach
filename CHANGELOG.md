# CHANGELOG

All notable changes and upgrades made during the Lift and Reach Equipments website modernization.

## [3.0.0] - 2026-11-16

### Modern React Interactive App Shell & State Engine
- **Foundation & Libraries (Part 1):**
  - Integrated `framer-motion` (with `LazyMotion` and `domAnimation`), `@tanstack/react-query`, `zustand`, `@radix-ui/react-tabs`, `@radix-ui/react-slider`, `@radix-ui/react-dialog`, `cmdk`, `sonner`, `embla-carousel-react`, and `lenis`.
  - Added motion tokens: `--dur-fast: 150ms`, `--dur-base: 250ms`, `--dur-slow: 450ms`, easing `cubic-bezier(0.22, 1, 0.36, 1)`, and depth tokens `elevation-1`, `elevation-2`, `elevation-3` strictly on floating layers.
  - Full respect for `prefers-reduced-motion` and touch disabling for smooth scroll.
- **App Shell & Routing (Part 2):**
  - `AnimatePresence mode="wait"` route transitions (200ms fade + 8px rise) with top 2px `--brand-blue` progress bar.
  - `React.lazy` + `Suspense` per route with shimmer skeletons matching page layout.
  - Header with auto hide-on-scroll-down, reveal-on-scroll-up, backdrop blur (`saturate(140%) blur(12px)`), shared `layoutId` nav underline, 180ms mega menu fade/translate with image crossfading, and hover-intent prefetching.
  - Scroll progress indicator under header on long pages.
- **Home Motion & Interactions (Part 3):**
  - Masked word-level slide-up stagger on hero title.
  - Embla carousel with crossfade and subtle mouse parallax (max 6px).
  - Facts numbers count up once when 60% in view using `tabular-nums`.
  - 5-column category grid with staggered `whileInView` reveals, 6px lift on hover, sliding arrows, and deep-link industry chips.
- **Catalog State & Interactions (Part 4):**
  - URL state synchronization (`q`, `category`, `industry`, `cap`, `sort`, `custom`).
  - 120ms debounced search with Fuse.js fuzzy matching and animated result count.
  - Framer layout FLIP animations on list/grid items during filtering and sorting.
  - Quick action icons on hover (`Quick view`, `Compare`, `Enquiry`).
  - Quick View 480px drawer with keyboard focus trap, Esc close, and full specs.
  - Floating batch selection bottom tray with Compare dialog and batch RFQ.
- **Product Detail Features (Part 5):**
  - Sticky condensed action bar sliding down under header after scrolling past title.
  - Hover zoom lens preview on product stage and full lightbox modal with arrow key controls.
  - Radix Tabs model selector with sliding `layoutId` indicator and dynamic column highlighting in datasheet table.
  - PDF datasheet loading state and WhatsApp pre-filled messaging.
- **Command Palette & Tools (Part 6 & 7):**
  - `cmdk` dialog on `Ctrl+K` and search button with fuzzy grouping for products, categories, and direct contact actions.
  - Animated enquiry drawer with item count bump badge, layout animations on item removal, and undo toast.
- **Performance & Guardrails:**
  - Initial JS gzipped: **210.20 KB** (strictly under 220 KB limit).
  - All compact sizes preserved (Hero <= 560px, padding <= 64px, Home height <= 3400px, no text > 52px).
  - Part 9 and Part 10 automated test suites passing 100%.

## [2.1.0] - 2026-11-16

### Premium Architectural Refinements & Image Scale System
- **Image Scale System (Rule 1):**
  - Stored natural image dimensions and generated clean alpha cutouts via Sharp (`scripts/cutout.ts`).
  - Implemented `<ArchitecturalImage>` enforcing:
    - `max-width: min(86%, calc(var(--nat-w) * 1px * 1.15))`
    - `max-height: 78%`
    - `object-contain`, centered with calm empty space—never stretched.
  - Plate hard caps: Hero plate max 560px tall, Category chapter plate max 420px tall and max 5/12 width, Catalog item plate 4:3 max 260px tall, Detail stage max 520px tall, Thumbnails 72px.
- **Header & Navbar Alignment (Rule 2):**
  - Structured header as a 3-column CSS grid (`[logo] [nav centered] [actions right]`, height 76px, `align-items: center`).
  - Nav items use uniform height 76px, Manrope 15px/1 500, with inline Chevron on Products. Active 2px `--brand-blue` underline at the bottom edge.
  - "Find my lift" in matching nav style. Enquiry list and phone in Inter 14px aligned to text baseline.
- **Spec-Forward Catalog Grid (Rule 4):**
  - Default view = compact catalog grid (4 cols at 1440px, 5 cols at >= 1800px, 6 cols at >= 2300px, 3 cols at 1100-1280px, 2 cols at <= 900px).
  - Item anatomy: Plate 4:3 -> Name (Inter 16px/600, 2-line min-height clamp) -> Model codes (each on own line in JetBrains Mono 12px) -> 3-row spec list (Capacity, Max height, Platform) formatted as clean ranges.
  - Sticky filter bar (64px tall, controls 40px tall, baseline aligned) with Sort dropdown (Default, A-Z, Z-A).
  - Views: Grid, List, Table with local storage persistence.
- **Home Page Proportions & Layout (Rule 3):**
  - Hero height `min(88vh, 760px)` on `--stone`. Headline `clamp(40px, 5.6vw, 88px)` with `text-wrap: balance` (max-width 11em). Subline in Inter 18px using verified copy.
  - 3-column intro statement with 36px font and max 30em measure.
  - Scissor lift SVG redrawn with diagonal hydraulic cylinder (no stray blue line) and 1m scale gauge with 11px Inter numbers.
  - Compact category chapters (row height ~520-560px on 1440px). Overall home height reduced by > 30%.
- **Copy Normalization (Rule 8):**
  - Cleaned all invented phrasing. Preserved authentic verbatim statements:
    - Eyebrow: "Hydraulic equipment manufacturer - Chennai"
    - Subline: "Hydraulic material handling equipment and aerial access platforms, designed and manufactured in Chennai with more than 25 years of industrial experience."
    - Facts: "25+ years", "25 m", "12 m / 25 tons" with original About wording.
- **Floating Controls (Rule 6):**
  - Proper WhatsApp SVG glyph (26px, white on 52px `--charcoal` square).
  - Back-to-top appears after 600px scroll, positioned 16px above WhatsApp in outline style.
- **Automated Playwright Quality Gates:**
  - 10 automated quality checks passing across 390px, 768px, 1280px, 1440px, 1920px, and 2560px.
  - 14 screenshots refreshed in `screenshots/`.

## [2.0.0] - 2026-11-16

### Visual Design Rebuild: "PREMIUM ARCHITECTURAL"
- **Design Philosophy:** Minimal, full-width, photography-led, calm and confident, in the spirit of high-end architecture and engineering practices.
- **Tokens & Theme:**
  - Backgrounds: `--paper: #F6F4F0` (warm off-white), `--stone: #E8E4DD` (alternate section / image plates), `--stone-deep: #D5CFC5` (1px hairlines).
  - Typography & Text: `--charcoal: #15191E` (primary text, dark footer/sections), `--graphite: #3A424C` (reading body), `--steel: #7C8794` (captions and specs).
  - Accents: `--brand-blue: #1F4E96` (primary buttons, active states, links), `--brand-red: #C8202F` (tiny status marks only). Zero yellow, zero hazard stripes.
- **Typography:**
  - Self-hosted WOFF2 fonts: Manrope (300/400/500/600), Inter (400/500), and JetBrains Mono (400/500).
  - Headings in sentence-case Manrope 300/500 with tight tracking (-0.02em); no uppercase yelling.
- **Components & Architectural Language:**
  - Created `/design-system` style guide with interactive tokens, typography scale, buttons, product figures, category chapters, and the scroll-linked scissor lift elevation drawing.
  - Verified responsive screenshots captured at 1440px and 390px:
    - `docs/screenshots/design-system-1440.png`
    - `docs/screenshots/design-system-390.png`
  - SVG signature elevation drawing (`ScissorLiftElevation`) with 1.25px stroke geometry.

## [1.2.0] - 2026-11-16

### Image Quality & Industrial Catalog Overhaul
- **High-Resolution Category Hero Images:**
  - Removed deprecated 50x50 icon thumbnails (`images/home/1.jpg` – `10.jpg`).
  - Mapped root categories in database and frontend directly to authentic equipment photos (`scissor lift.jpg`, `GOODS LIFT.JPG`, `aerial.jpg`, `stacker.jpg`, `PALLET TRUCK.jpg`, `ZERO LIFT.jpg`, `hydraulic barrel lifter tilter.jpg`, `HYDRAULIC FLOOR CRANE - LIGHT DUTY.jpg`, `DOCK LEVELLER.jpg`, `AIR CRAFT JACKS.jpg`, `hollow.jpg`).
- **Sharp Image Pipeline & Multi-Resolution WebP Variants:**
  - Generated multi-resolution WebP variants (`-480w.webp`, `-800w.webp`, `-1200w.webp`) via Sharp with `withoutEnlargement: true` and progressive fallback.
  - Implemented `<ResponsiveImage>` component providing `srcset`, `sizes`, explicit `width`/`height` preventing CLS, and `mixBlendMode: 'multiply'` on `#F4F7FB` technical blueprint pattern tiles with ground shadows.
- **Image Audit Script (`scripts/audit-images.ts`):**
  - Audits all site images, flagging any assets below 600px natural width and logging component call sites.
- **Home "Application / Selection of Product" Redesign:**
  - Standardized 10 cards with consistent 340px heights, 5-column desktop layout and 2-column mobile layout.
  - Replaced invented marketing sentences with verbatim application lines from original specifications.
  - Stabilized card hover (image lifts -4px, border highlights #2F5FA8, zero layout shift or card resizing).
  - Modal drawer displays full sharp images, use cases, application areas, and sector lists.
- **Engineering Catalog Redesign (`/products`):**
  - Desktop: Left sticky filter sidebar (Category Tree, Rated Capacity radio selectors, Industry sector dropdown, Custom Built Available toggle) + right results area.
  - View toggle with local storage persistence: Grid View (mini-spec table, model code, non-truncated tags), List View (horizontal row for quick scan), and Table View (sortable multi-column engineering matrix).
  - Cleaned up redundant chip rows; added persistent search box with `Ctrl+K` command palette indicator.
  - Strict line-iconography and sentence-case B2B UI adhering to navy `#0B1F3A`, industrial blue `#2F5FA8`, and safety yellow `#F5A623`.

## [1.1.0] - 2026-11-16

### A. Bug Fixes (A1 – A8)
- **A1. Mega Menu Viewport Clipping:**
  - Upgraded the Products mega menu to a full-viewport-width panel (`fixed left-0 right-0 top-full`) independent of anchor link coordinates.
  - Implemented 3-column layout: [All 11 Categories] | [Sub-categories of hovered category] | [Featured models with image, name, code].
  - Set max height to `calc(100vh - 80px)` with internal scrollable regions, ensuring all 11 categories fit without clipping or overflow.
  - Added hover-intent delays (~120ms open, ~200ms close), ESC key listener, outside click detection, and mobile slide-in drawer with 3-level accordion.
- **A2. Category Routing & Filtering:**
  - Standardized routing for `/products/:category`, `/products/:category/:sub`, and `/products/:category/:sub/:slug`.
  - Added full URL query string synchronization (`?q=&industry=&cap=&sort=`) with shareable links and back/forward browser history support.
  - Built dedicated 404 handler for missing slugs/categories with instant search and category navigation links.
- **A3. Product Ordering & Sort Options:**
  - Preserved exact original sequence across all 11 categories (Scissor Lift, Goods Lift, Aerial Access Platform, Stacker, Pallet Truck, Zero Lift, Hydraulic Barrel Lifter & Tilter, Hydraulic Floor Crane, Dock Leveler, Aircraft Jacks, Hollow & Solid Ram Hydraulic Jack).
  - Added interactive sort dropdown with Recommended, Capacity Low-High, Capacity High-Low, Name A-Z, and Name Z-A.
- **A4. Category Chip Row:**
  - Implemented responsive multi-line wrap on desktop viewports and smooth horizontal snap scroll with fade edges on mobile.
  - Converted stray filter icon into a unified "Filters & Sorting" drawer button for mobile.
- **A5. Admin Layout Isolation:**
  - Isolated `/admin/*` routes to dedicated `AdminLayout` completely free of public header, top bar, mega menu, footer, and floating WhatsApp buttons.
  - Redesigned `/admin` login screen into a centered card on industrial dark theme `#0B1526` with single brand logo, password visibility toggle, rate limit feedback, and `noindex, nofollow` robot headers.
  - Removed developer prefilled credentials.
- **A6. Branding Cleanup:**
  - Preserved the authentic high-resolution logo image without duplicate text lockup.
  - Completely removed unverified "ISO CERTIFIED MFG" badges and claims from all headers and templates.
- **A7. Fluid 100% Width Layout:**
  - Removed restrictive `max-w-*` container constraints across header, hero, catalog grids, and footer.
  - Adopted fluid padding (`px-4 sm:px-8 lg:px-16 2xl:px-24`) and CSS Grid `grid-cols-[repeat(auto-fill,minmax(260px,1fr))]` scaling from mobile (360px) to ultra-wide (2560px).
- **A8. Listing Hero & Spacing:**
  - Compacted product catalog hero section to ~200px including dynamic breadcrumbs and live result count, ensuring product cards are visible above the fold on 1080p screens.

### B. Product Cards & Detail Upgrades
- Standardized product cards with 4:3 container, neutral light backdrop, and subtle radial gradient.
- Added key spec chips (Capacity, Max Height) directly extracted from catalog specifications.
- Added "Custom Built Available" tags where noted in the original crawl data.
- Built sticky right-side quote request panel on desktop product detail pages with real-time validation.
- Responsive spec tables with sticky first column for mobile scrolling.

### C. Smart Features
- **C1. Multi-Item Enquiry Basket:**
  - Global `BasketContext` with local storage persistence and sliding enquiry drawer.
  - Added `EnquiryItem` relation in Prisma schema to save multi-product submissions.
- **C2. "Find My Lift" Wizard:**
  - 3-step interactive selector (Application -> Weight/Capacity -> Working Height) with deterministic matching.
- **C3. Smart Search Command Palette:**
  - Added global `Ctrl+K` / `Cmd+K` keyboard shortcut with fuzzy search powered by Fuse.js.
- **C4. Product Comparison Matrix:**
  - Side-by-side comparison drawer supporting up to 3 products across specifications.
- **C5. Server-Side PDF Datasheet Generator:**
  - Implemented `GET /api/products/:slug/datasheet.pdf` dynamically compiling specs and branding with PDFKit.
- **C6. WhatsApp Deep Links:**
  - Pre-filled WhatsApp enquiry links targeting `(+91) 89393 59592` with product name and code.

### D. Architecture & Reliability
- 100% Native stack running on host Node.js and local MySQL 8 without Docker dependencies.
