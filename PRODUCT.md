# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary users are people in El Salvador seeking handcrafted amigurumi as gifts, home decor, or personal collectibles. They value artisanal quality, the story behind the maker, and supporting local craft. Secondary audience: friends and family of the artisan sharing the work socially.

## Product Purpose

Yamgurumi sells handcrafted amigurumi online, giving a solo artisan a professional storefront to reach local customers. Success means establishing a trusted online presence that converts browsing into orders and builds a loyal local following.

## Positioning

Each amigurumi is made entirely by hand by a single artisan in El Salvador using 100% organic cotton and hypoallergenic materials. Mass-produced plush toys cannot replicate the individuality, material safety, or human story behind every piece.

## Operating Context

- Solo artisan: one person designs, crafts, ships, and manages the business
- Small-scale, early-stage operation with no existing sales channel prior to this site
- Shipping within El Salvador (local couriers, hand delivery in some cases)
- Payment likely via local methods (Pago Movil, bank transfers, cash on delivery); no international payment gateway confirmed yet
- Products are photographed and listed manually; no automated inventory system
- The crafting process itself (yarn selection, stitching, finishing) is a key part of the product story

## Capabilities and Constraints

- Next.js 16 app with React 19, Tailwind CSS v4, Three.js (3D hero), GSAP, Zustand
- Landing page built: hero with 3D amigurumi scene, category grid, best sellers, process steps, newsletter, footer
- 404 page built with thematic copy
- Planned but not yet built: catalog, product detail, checkout, about page, user profile, FAQ, contact, custom commissions, cart, order tracking
- No backend/API layer yet; product data is hardcoded in components
- No authentication, database, or payment integration
- Spanish language only (es) — no i18n planned
- All product images currently hosted on Google CDN (aida-public URLs)

## Brand Commitments

- Name: **Yamgurumi**
- Tagline: "Hecho a mano, tejido con amor"
- Logo: real brand asset (hosted externally)
- Visual identity: warm, cozy, handcrafted feel — cream backgrounds, teal secondary, brown primary, blush pink accents
- Typography: Comfortaa (headlines), Manrope (body)
- Voice: warm, personal, approachable, artisanal — never corporate or generic
- Material: 100% organic cotton, hypoallergenic fill — this is a brand promise, not just a product spec

## Evidence on Hand

- Landing page with full visual system (design tokens, components, CSS)
- 4 product listings with images (Dragón Celestino, Set de Setas Mágicas, Ballena Mini Llavero, Zorro Otoñal)
- 4 category cards with images (Animales & Mascotas, Personajes Mágicos, Decoración & Hogar, Encargos Especiales)
- 3D interactive hero scene (yarn ball with cat amigurumi)
- Logo asset
- SITEMAP.md with full site structure plan

## Product Principles

1. **Handcraft is the product** — every design decision should let the human story of making shine through
2. **Trust through transparency** — materials, process, and the maker's identity are always visible
3. **Local first** — serve the El Salvador market excellently before expanding
4. **Warmth over polish** — the site should feel like the maker's workshop, not a corporate storefront
5. **Start small, grow intentionally** — ship the core pages well before adding complexity

## Accessibility & Inclusion

No specific accessibility standard confirmed. The existing code includes `prefers-reduced-motion` support and semantic HTML basics. No formal a11y audit has been performed.
