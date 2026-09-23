# Estate Intelligence

A responsive real-estate solutions showcase built with Vite, vanilla JavaScript, and GSAP ScrollTrigger. The working brand **Estate Intelligence** is a replaceable concept name.

## Run locally

```sh
npm install
npm run dev
```

## Production

```sh
npm run build
npm run preview
```

Deploy the resulting `dist/` directory to any static host. No backend or environment variables are needed.

## Experience

- Paper-on-stone landing matching the supplied opening reference, followed by a continuous scroll film.
- Custom notched, frosted-glass overlay with a raised tools tab and a compact title/button row.
- Title-to-button gap: 40px desktop, 28px tablet, 20px phone, 16px on very small screens.
- Eased entrances, reversible scroll transitions, and restrained hover motion.
- Four scroll-controlled chapters over the supplied real-estate film.
- Chapter navigation, accessible native use-case dialogs, and full film playback.
- Mobile layouts, keyboard navigation, and a reduced-motion experience with manual chapter selection.
- A functional project-brief download. The contact interface does **not** send email or collect leads; connect a real endpoint and business contact details before using it as a lead form.

## Content and assets

`public/media/` contains frames and an optimized 1280px MP4 derived from the user-supplied `Handd Shobit website video D2.mp4`. The WebM was reviewed as an alternate version; the screen recording informed the cinematic treatment. Original files were not changed.

`src/main.js` holds chapter content. RA Bill & BOQ Reconciliation and Floor Plan to 3D Render follow the supplied references. The remaining chapters describe visual capabilities illustrated by the footage; they do not assert measured client outcomes. Trust-strip logo assets come from the existing Framer project; OpenAI Academy is rendered as typography. Confirm brand permissions/relationships before publication.

## Framer component

`framer/EstateIntelligence.tsx` is the generated, self-contained React component with scoped styles, container-query breakpoints, motion cleanup, reduced-motion support, and image/video property controls. Regenerate it with `node scripts/build-framer.mjs` after changes to the local site or component template. Upload the assets from `public/media` to the corresponding Framer property controls; local file URLs cannot be used on a deployed website.

Framer import has not completed: the connected editor returned read-only during a required update, and the browser fallback requires the user's Google passkey sign-in. No new page was successfully created or published.

Google Fonts provides Prata, DM Sans, and Manrope; system fonts are available as fallbacks.

## MotionSites MCP

Connected to the configured MotionSites MCP and searched for luxury real-estate design guidance. `luxury-real-estate` was the strongest search match, but `get_prompt` returned `locked: true` for the current account. `list_prompts` with free access returned no results. No premium prompt text was retrieved or copied. The final implementation is original, based on the user’s footage, screenshots, and requested luxury glass aesthetic.

## Before publishing

Replace the concept brand with the final name, confirm the trust-strip assets, and add the intended contact destination. The site is a local deliverable and has not been published.
