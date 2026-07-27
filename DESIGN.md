---
name: Yamgurumi
description: Hecho a mano, tejido con amor — handcrafted amigurumi e-commerce
colors:
  background: "#fdf3df"
  surface: "#fff8f0"
  surface-bright: "#fff8f0"
  surface-dim: "#e3d9c6"
  surface-container-lowest: "#ffffff"
  surface-container-low: "#fdf3df"
  surface-container: "#f7edda"
  surface-container-high: "#f1e7d4"
  surface-container-highest: "#ebe1cf"
  surface-variant: "#ebe1cf"
  on-surface: "#1f1b10"
  on-surface-variant: "#4f4440"
  inverse-surface: "#353023"
  inverse-on-surface: "#faf0dc"
  primary: "#72594e"
  on-primary: "#ffffff"
  primary-container: "#e3c2b4"
  on-primary-container: "#674f44"
  primary-fixed: "#fedbcd"
  primary-fixed-dim: "#e1c0b2"
  on-primary-fixed: "#29170f"
  inverse-primary: "#e1c0b2"
  secondary: "#206776"
  on-secondary: "#ffffff"
  secondary-container: "#acedfe"
  on-secondary-container: "#286d7c"
  secondary-fixed: "#acedfe"
  secondary-fixed-dim: "#90d0e1"
  on-secondary-fixed: "#001f26"
  tertiary: "#81524c"
  on-tertiary: "#ffffff"
  tertiary-container: "#f6bab2"
  on-tertiary-container: "#754842"
  error: "#ba1a1a"
  on-error: "#ffffff"
  error-container: "#ffdad6"
  on-error-container: "#93000a"
  outline: "#81746f"
  outline-variant: "#d3c3bd"
typography:
  display:
    fontFamily: "Comfortaa, cursive"
    fontSize: "clamp(2.5rem, 5vw, 3rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  headline-xl:
    fontFamily: "Comfortaa, cursive"
    fontSize: "48px"
    fontWeight: 700
    lineHeight: "56px"
    letterSpacing: "-0.02em"
  headline-lg:
    fontFamily: "Comfortaa, cursive"
    fontSize: "32px"
    fontWeight: 700
    lineHeight: "40px"
  headline-md:
    fontFamily: "Comfortaa, cursive"
    fontSize: "24px"
    fontWeight: 600
    lineHeight: "32px"
  headline-sm:
    fontFamily: "Comfortaa, cursive"
    fontSize: "20px"
    fontWeight: 600
    lineHeight: "28px"
  body-lg:
    fontFamily: "Manrope, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: "28px"
  body:
    fontFamily: "Manrope, sans-serif"
    fontSize: "16px"
    fontWeight: 400
    lineHeight: "24px"
  body-sm:
    fontFamily: "Manrope, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "20px"
  label:
    fontFamily: "Manrope, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: "16px"
    letterSpacing: "0.05em"
rounded:
  sm: "8px"
  md: "16px"
  lg: "32px"
  xl: "48px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
components:
  button-primary:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.on-secondary}"
    rounded: "{rounded.full}"
    padding: "14px 32px"
  button-primary-hover:
    backgroundColor: "{colors.secondary}"
    textColor: "{colors.on-secondary}"
    rounded: "{rounded.full}"
    padding: "14px 32px"
  button-secondary:
    backgroundColor: "{colors.primary-container}"
    textColor: "{colors.on-primary-container}"
    rounded: "{rounded.full}"
    padding: "14px 32px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.full}"
    padding: "14px 32px"
  card:
    backgroundColor: "{colors.surface-container-lowest}"
    rounded: "{rounded.lg}"
    padding: "16px"
  input:
    backgroundColor: "{colors.surface-container-lowest}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.md}"
    padding: "14px 20px"
  chip:
    backgroundColor: "{colors.secondary-container}"
    textColor: "{colors.secondary}"
    rounded: "{rounded.full}"
    padding: "6px 14px"
---

# Design System: Yamgurumi

## Overview

**Creative North Star: "The Yarn Garden"**

Yamgurumi's design system is rooted in the warmth of handmade craft and the organic textures of yarn, cotton, and fiber. Like a garden where every plant has its own character, each element in the system feels individually considered — never factory-stamped, never interchangeable. The palette draws from the materials themselves: unbleached cotton, natural clay, ocean-dyed teal, and the soft blush of inner ear fur. Depth is built through warm-toned layered shadows that feel like diffused afternoon light falling across a worktable. The typography pairs Comfortaa's rounded, friendly geometry for headlines with Manrope's clean legibility for body text — a combination that reads as approachable without being childish. The system rejects the cold precision of generic e-commerce in favor of something that feels like it was made by the same hands that make the amigurumi.

**Key Characteristics:**
- Warm, material-derived palette (clay, cotton, ocean teal, blush)
- Generously rounded forms — everything feels soft and holdable
- Layered warm shadows that create physical depth without harshness
- Bouncy, organic motion (squish easing on interactions)
- Glassmorphism on navigation — translucent surfaces with animated yarn-thread accents
- 3D and illustrated elements treated as first-class content, not decoration
- Spanish-language voice that is personal, warm, and artisanal

## Colors

The palette is a Material Design 3 tonal system built from warm earth and ocean hues. Every color traces back to a physical material in the amigurumi-making process.

### Primary
- **Clay & Earth** (#72594e): The foundational warm brown. Used for primary text emphasis, section headings (via SectionHeading), price displays, and the primary button ghost variant border. Appears as the `surface-tint` value, connecting it to the tonal surface system.
- **Clay Container** (#e3c2b4): A lighter clay wash used on card borders (`border-primary-container/20`), step badges, and secondary button backgrounds. Creates soft visual connection to the primary without dominating.
- **Clay Deep** (#674f44): On-primary-container text — used when text sits on Clay Container backgrounds.

### Secondary
- **Ocean Teal** (#206776): The action color. Used for primary CTA buttons, active nav states, filter tab selection, social icons, category badges, newsletter subscribe button, and all interactive emphasis. This is the color of "do something."
- **Sky Wash** (#acedfe): Secondary container — used for badge pill backgrounds, newsletter success states, step 4 background, and soft accent washes.
- **Teal Mist** (#90d0e1): Secondary fixed dim — used for the 3D scene's ambient light color, yarn strand accents, and subtle highlights.

### Tertiary
- **Blush Rose** (#81524c): A warm muted rose for secondary emphasis — favorite heart fills, limited-edition tags, and accent moments that need warmth without competing with the teal action color.
- **Petal Pink** (#f6bab2): Tertiary container — used for inner ear color in the 3D scene, product card favorite hearts when filled, and soft warm accents.

### Neutral
- **Warm Cream** (#fdf3df): The background. The page's base warmth — not white, not beige, but the color of natural unbleached cotton.
- **Parchment** (#fff8f0): Surface — slightly lighter than background, used for elevated surfaces and content areas.
- **Linen** (#f7edda): Surface container — the default card and section background.
- **Sandstone** (#f1e7d4): Surface container high — footer background, newsletter gradient endpoints.
- **Parchment Dark** (#ebe1cf): Surface variant — used for subtle dividers and secondary surfaces.
- **Ink** (#1f1b10): On-surface text — a warm near-black that never feels cold or blue.
- **Charcoal** (#4f4440): On-surface variant — body text, descriptions, secondary labels.

### Error
- **Crimson** (#ba1a1a): Error state only. Used sparingly — form validation, destructive action warnings.
- **Rose Error** (#ffdad6): Error container background.

### Outline
- **Warm Gray** (#81746f): Subtle borders and dividers.
- **Mist Gray** (#d3c3bd): Lighter outline variant — card borders, input borders, section separators.

### Named Rules

**The Teal Action Rule.** Ocean Teal (#206776) is reserved for interactive elements the user should click, tap, or notice as actionable. It must not be used for decorative backgrounds, large surface fills, or text that isn't on a button/link. Its rarity as an action signal is the point.

**The Warmth Constraint.** Every color in the system has warm undertones. No cool grays, no blue-based neutrals, no cold whites. Even the error red (#ba1a1a) leans warm. If a color feels clinical, it doesn't belong.

## Typography

**Display Font:** Comfortaa (with system cursive fallback)
**Body Font:** Manrope (with system sans-serif fallback)

**Character:** Comfortaa's rounded, geometric letterforms feel like they were shaped by hand — soft terminals, open counters, a friendly weight that never screams. Paired with Manrope's clean, slightly humanist sans-serif, the combination reads as modern craft: professional enough for e-commerce, warm enough for a maker's studio.

### Hierarchy
- **Display** (700, clamp(2.5rem, 5vw, 3rem), 1.2): Hero headlines only — the largest text on any page. Appears once per surface.
- **Headline XL** (700, 48px, 56px, -0.02em): Major section titles (404 page "404" text).
- **Headline LG** (700, 32px, 40px): Section headings in desktop (e.g., "Los Amigurumis más Queridos").
- **Headline MD** (600, 24px, 32px): Sub-section headings, product card prices, SectionHeading component default.
- **Headline SM** (600, 20px, 28px): Card titles, step titles, footer column headings.
- **Body LG** (400, 18px, 28px): Hero descriptions, newsletter body text, prominent paragraphs.
- **Body** (400, 16px, 24px): Default body text — section descriptions, product materials, form labels.
- **Body SM** (400, 14px, 20px): Secondary text — star ratings, badge labels, footer links, helper text.
- **Label** (600, 12px, 16px, 0.05em, uppercase): Category badges ("Favoritos de la Comunidad"), step numbers, trust badges, section overlines.

### Named Rules

**The Headline-Body Contract.** Headlines use Comfortaa. Body uses Manrope. No exceptions. If text is a heading, it gets Comfortaa. If it's reading material, it gets Manrope. The label font inherits from Manrope but adds uppercase transform and letter-spacing.

## Layout

The layout system centers content to a maximum width of 80rem (1280px) using a padding-inline calculation that scales with viewport width — never relying on margin:auto on the child. This keeps full-bleed backgrounds intact while content stays perfectly centered at any width.

**Container:** `section-container` class applies `padding-inline: max(1rem, calc((100% - 80rem) / 2 + 1rem))` at mobile, scaling to 1.5rem at 640px and 2rem at 1024px.

**Max content width:** `max-w-7xl` (80rem / 1280px) on inner wrappers.

**Section rhythm:** Vertical padding follows `py-16 sm:py-20 md:py-24` (64px → 80px → 96px). Sections stack with no gap between them — visual separation comes from alternating background tones and border treatments.

**Grid patterns:**
- Product grid: 1 column mobile → 2 columns sm → 4 columns lg
- Category bento: 1 column mobile → 2 columns sm → 4 columns lg with `auto-rows-[220px]` and spanning for the lead category
- Footer: 1 column mobile → 3 columns md

**Responsive headline scaling:** Headlines use `text-2xl sm:text-3xl md:text-4xl` or `text-4xl sm:text-5xl md:text-6xl lg:text-7xl` patterns — always stepping up at sm and md breakpoints.

## Elevation & Depth

The system uses layered warm-toned shadows to create physical depth. Shadows are tinted with the primary brown (#72594e at low opacity), giving them a warm cast that integrates with the cream palette rather than appearing as cold gray cuts.

### Shadow Vocabulary
- **Card** (`0 4px 24px rgba(114, 89, 78, 0.08)`): Resting state for cards, containers, and elevated surfaces. A soft ambient presence.
- **Elevation** (`0 12px 40px rgba(114, 89, 78, 0.12)`): Hover state for cards, newsletter section, navbar on scroll. Signals interactivity and lift.
- **Button** (`0 4px 16px rgba(114, 89, 78, 0.1)`): Subtle lift under buttons and small interactive elements.
- **Neumorphic** (`0 20px 40px -15px rgba(114, 89, 78, 0.1), inset 0 1px 3px rgba(255, 255, 255, 0.7)`): Specialty treatment for cards that need extra dimensionality — combines outer shadow with inner highlight.

### Named Rules

**The Hover Lift Rule.** Cards and interactive containers transition from `shadow-card` to `shadow-elevation` on hover, paired with `translateY(-6px)` or `translateY(-1.5px)`. The shadow change is the primary depth cue; the translation is secondary.

**The Glassmorphism Rule.** The navbar uses `backdrop-blur-xl` with semi-transparent backgrounds (`bg-surface-bright/40` at rest, `/70` on scroll) and `border border-white/40` to create a floating glass effect. This is the only component that uses glassmorphism — it must not spread to other surfaces.

## Shapes

The form language is defined by generous, unbroken curves. Corners are always round — the system has no sharp angles. The radius scale progresses from subtle (8px for small interactive elements) to dramatic (32px for cards, full-radius for buttons and badges).

**Radius scale:**
- **sm** (8px): Input fields, small interactive targets
- **md** (16px): Modal-like containers, form success messages
- **lg** (32px): Product cards, step cards, newsletter container, category cards
- **xl** (48px): Rarely used — reserved for oversized containers
- **full** (9999px): Buttons, badge pills, nav links, avatar circles, filter tabs

**Border treatment:** Cards use `border border-primary-container/20` — a barely-there warm border that adds definition without competing with the shadow. The newsletter uses `border border-primary-container/30` for slightly more presence.

**Image treatment:** Product and category images use `rounded-2xl` (16px) for contained images or inherit the card's `rounded-3xl` (24px) when they fill the container edge-to-edge.

## Components

### Buttons
- **Shape:** Fully rounded pill (radius: full / 9999px)
- **Primary:** Ocean Teal background, white text, bold weight, `px-8 py-3.5`, button shadow. Hover: scale-105, active: scale-[0.98]. Uses squish easing.
- **Secondary:** Clay Container background, On-Primary-Container text. Same sizing and motion as primary.
- **Ghost:** Transparent background, On-Surface text, 2px border using On-Surface. Hover: fills with Surface-Container.
- **Icon-only:** 40px circle, background transitions from surface to teal on hover (footer social icons). Used for cart, favorite, close actions.

### Chips / Badge Pills
- **Style:** Fully rounded pill, `px-3.5 py-1.5`, bold uppercase label text at 12px. Secondary Container background with secondary text color.
- **State:** No selectable state — these are informational badges only (section overlines, product tags, trust badges).
- **Product tags:** Variant colors per tag type — "Best Seller" uses secondary bg, "Nuevo" uses tertiary, "Popular" uses secondary-container, "Limitado" uses primary bg.

### Cards / Containers
- **Corner Style:** Rounded-3xl (24px) for section cards (BestSellers, ProcessSteps, Newsletter). Rounded-lg (8px) for the reusable ProductCard component.
- **Background:** Surface Container Lowest (white) — the lightest surface in the system.
- **Shadow Strategy:** Card shadow at rest, elevation shadow on hover. Transition: `duration-300`.
- **Border:** `border border-primary-container/20` — warm, barely visible.
- **Internal Padding:** p-4 (16px) for product cards, p-6 (24px) for step cards, p-8 to p-16 responsive for newsletter.
- **Hover behavior:** `hover:-translate-y-1.5` (product cards) or `hover:-translate-y-1` (step cards) with shadow elevation.

### Inputs / Fields
- **Style:** Surface Container Lowest background, Outline Variant border at 30% opacity, rounded-2xl (16px), `px-5 py-3.5`. Body font at body-md size.
- **Focus:** `focus:ring-2 focus:ring-secondary focus:border-transparent` — teal glow ring, no border color change.
- **Placeholder:** On-Surface Variant at 50% opacity.
- **Disabled:** `disabled:opacity-50` with loading spinner replacement in newsletter.

### Navigation
- **Style:** Floating glass morphism bar. Rounded-full pill shape. Position: fixed, centered horizontally, with responsive top spacing (top-8 → top-4 on scroll).
- **Typography:** Body font, 14-15px, bold weight. Active link gets secondary color + white/40 background + shadow-sm.
- **Scroll behavior:** On scroll, background opacity increases from 40% to 70%, shadow deepens, border becomes more opaque.
- **Mobile:** Slide-in drawer from right, 85vw max 340px, surface-bright background with backdrop-blur. Overlay: on-surface/30 with blur.
- **Yarn threads:** Animated SVG paths behind the navbar — decorative yarn-thread lines that undulate gently, reinforcing the craft theme.

### Newsletter Section
- **Style:** Full-width gradient container (`from-surface-container-high via-surface-container to-surface-container-high`), rounded-3xl, elevation shadow.
- **Decorative:** Two blurred circles (secondary/10 and tertiary/10) in opposite corners — ambient color without competing with content.
- **Form layout:** Stacked on mobile, inline on sm+. Email input + subscribe button side by side.

### Section Heading Pattern
Every major section follows a consistent pattern:
1. Overline badge: uppercase label text, secondary color, secondary-container background at 50%, rounded-full pill
2. Headline: Comfortaa font, headline-lg or headline-xl, on-surface color, bold
3. Description: Manrope body text, on-surface-variant color, max-w-2xl centered

### 3D Hero Scene
- **Content:** Interactive Three.js canvas with a yarn ball, cat amigurumi, crochet hook, sparkle particles, and ambient ring.
- **Animation:** Gentle floating motion (`soft-float` animation, 6s ease-in-out infinite), yarn ball rotation, subtle head bob on the kitten.
- **Camera:** Position [0, 0.5, 8.5], fov 55. Transparent background — blends with the page cream.
- **Lighting:** Ambient (0.6), two directional lights (warm white + teal-tinted), hemisphere light (cream sky / teal ground).

## Do's and Don'ts

### Do:
- **Do** use Ocean Teal (#206776) exclusively for interactive/CTA elements — buttons, active nav, links, action icons.
- **Do** keep all corners rounded. The minimum radius in the system is 8px. Nothing has sharp corners.
- **Do** use warm-tinted shadows (brown-based rgba) for all elevation. Never use cold gray or black shadows.
- **Do** maintain the section heading pattern: overline badge → Comfortaa headline → Manrope description, centered.
- **Do** use the squish easing (`cubic-bezier(0.34, 1.56, 0.64, 1)`) for button and card press interactions — it gives the bouncy, tactile feel.
- **Do** keep the navbar glassmorphism contained to the navbar. Other surfaces use solid backgrounds.
- **Do** use `prefers-reduced-motion` to disable all animations for users who request it — the system already respects this.

### Don't:
- **Don't** use Ocean Teal for large surface fills, decorative backgrounds, or non-interactive text. It is an action signal, not a theme color.
- **Don't** introduce cold grays, blue-based neutrals, or pure white (#ffffff is only for surface-container-lowest and on-primary/on-secondary text).
- **Don't** use sharp corners anywhere. Even the smallest interactive element gets at least 8px radius.
- **Don't** stack multiple shadow levels on the same element. One shadow at a time — card or elevation, not both.
- **Don't** use Comfortaa for body text or Manrope for headlines. The font pairing is fixed.
- **Don't** make the site feel like a generic e-commerce template. Every section should feel hand-considered, not drop-in.
- **Don't** add glassmorphism, neumorphism, or other specialty treatments to components beyond those already using them (navbar glass, neumorphic cards).
