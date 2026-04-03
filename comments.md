# UI Design Review — ADT Website
**Reviewed:** 2026-04-03 | **Reviewer:** UI Design Audit (Playwright screenshots)

---

## Overall Impression

The dark navy + teal palette with Three.js background is striking and distinctive. The site has a strong "digital frontier" identity. However there are inconsistencies across pages and several polish issues that prevent it from feeling fully production-ready.

---

## 🔴 Bugs / Broken

### 1. Stray bullet character before body text on Hero
- **Where:** Hero section, paragraph below the Thai subtitle
- **Issue:** A `•` bullet character appears before "Shaping tomorrow's..." — this looks like a data/rendering artifact
- **Fix:** Remove the leading character from the string in `Hero.tsx`

### 2. Outdated intake year
- **Where:** Hero, gold link at bottom left
- **Text:** "Apply for 2025 intake" — should be 2026 (the site copyright already says 2026)
- **Fix:** Update to 2026 in `Hero.tsx:156`

### 3. `logo.png` returns 404
- **Error in console:** `GET /logo.png 404` — the file is missing from `public/`
- **Fix:** Ensure `logo.png` exists in `public/`. Currently `logo-light.png` and `logo-blue.png` exist but `logo.png` does not.

### 4. Footer programs list is completely wrong
- **Where:** Footer → "Programs" column
- **Shows:** "B.Sc. Computer Science", "B.Sc. Data Science", "B.Sc. Cybersecurity" etc.
- **Reality:** The actual programs are Digital Engineering, Software Engineering, Multimedia, etc.
- **Fix:** Update the footer links in `Footer.tsx` to match real program names and routes

---

## 🟠 Layout & Spacing Issues

### 5. Contact page — excessive empty space above content
- **Where:** `/contact` — there is ~250px of dead space between the navbar and "GET IN TOUCH"
- **Fix:** Reduce top padding or add a decorative element / hero banner to fill the space

### 6. Program detail page hero feels disconnected
- **Where:** `/programs/digital-engineering` — the stats panel (Degree, Duration, Credits, Tuition) floats in empty space on the right with no visual anchor to the left column
- **Fix:** Add a program cover image as the right-column hero visual, pushing the stats below it; or give the stats panel a stronger visual container

### 7. News section heading clipped
- **Where:** Homepage → News & Stories — when scrolling, the "N" of the heading is partially hidden under the navbar
- **Fix:** Add `scroll-mt-20` to the news section anchor or increase section top padding

### 8. Three.js geometry overlaps highlight card
- **Where:** Hero — the torus knot/icosahedron is positioned at `x=10` in 3D space, placing it directly behind the carousel card on the right, creating visual noise rather than depth
- **Fix:** Reposition central geometry further left or center it (x=0 to x=4) and reduce its scale slightly so it acts as background atmosphere rather than competing with the card content

---

## 🟡 Design & Visual Consistency

### 9. Program name accent colors are inconsistent
- **Where:** Programs section cards — names appear in teal, purple, and gold
- **Issue:** Purple (`#A78BFA`) is not part of the design system tokens. It appears on "Digital Technology for Business Innovation"
- **Fix:** Restrict to teal and gold only, or formally add purple as a design token

### 10. TCAS69 highlight card has jarring white background
- **Where:** Hero carousel — the admission schedule image has a white/cream background that breaks the dark immersive mood
- **Fix:** Apply `mix-blend-mode: multiply` or add a dark overlay on the image, or replace with a dark-background version of the image

### 11. Navbar active state is very subtle
- **Where:** All pages — active nav item uses teal text which is easy to miss against the dark background
- **Fix:** Consider a small underline indicator or a subtle teal pill background on the active item for stronger affordance

### 12. Footer lacks visual separation from About section
- **Where:** Scroll to bottom of homepage — the "Trust / Excellence / Agility / Mutual Respect" values section bleeds directly into the footer with no clear boundary
- **Fix:** Add a `border-t border-border` or a subtle gradient divider at the footer top

### 13. Social icons in footer are too small and low contrast
- **Where:** Footer bottom-left — Facebook/YouTube/Instagram icons are ~24px and barely visible
- **Fix:** Increase to 32px, add a subtle hover background ring, bump opacity to 70% default

---

## 🟢 What Works Well

- **Three.js hero background** — the particle nebula with torus knot is visually impressive and on-brand
- **Program cover images** — the AI-generated covers look consistently high quality and match the dark tech theme
- **Typography hierarchy** — Bebas for hero titles, Syne for section headings, DM Sans for body is a strong combination
- **News section layout** — featured article (large image + text) with supporting grid cards below is clear and editorial
- **Program cards** — cover image + program icon + degree badge + description is an effective information architecture
- **Apply Now button** — gold CTA in the navbar has strong contrast and draws the eye correctly
- **Glass card effect** on the highlight carousel reads nicely against the Three.js background
- **Bilingual support** — EN/TH toggle is well placed and consistent throughout

---

## 🏗️ Layout Decision: Should Highlights Move Below the Hero?

**Verdict: Yes — move highlights out of the hero and into a standalone strip between the hero and news.**

### What I observed

The current layout splits the hero 50/50: school branding on the left, a highlight carousel card on the right. Screenshots show:

- The Three.js torus knot/geometry sits directly behind the carousel card, creating visual clutter — the 3D effect competes with the card rather than framing it
- Only one highlight is visible at a time (carousel), forcing users to wait or click to discover others
- The TCAS69 image (white background) is jarring inside the dark immersive hero — it breaks the mood immediately on page load
- The hero's primary job — communicate school identity and drive CTAs — is diluted because half the hero's real estate is consumed by time-sensitive announcements
- At the hero→news transition (scroll ~600px), there is a large dead zone of ~150px of empty dark space before the news heading appears — a standalone highlights strip would fill that gap naturally

### Arguments FOR moving highlights below

| Reason | Impact |
|---|---|
| Hero becomes full-width and breathes | Three.js background finally commands the full viewport — the wow factor doubles |
| Content hierarchy is cleaner | Users read: *who we are → what's happening → latest news* — a logical F-pattern flow |
| All highlights visible at once | A horizontal row of 3–4 cards shows everything at a glance, no carousel cycling needed |
| Fills the dead zone | The gap between hero and news currently feels like a loading failure — a highlights strip closes it purposefully |
| Fixes the white-image problem | A dedicated section can style each card independently without the dark-hero constraint |
| News-adjacent grouping | Highlights (TCAS, events, announcements) are time-sensitive like news — placing them together creates logical content clustering |

### Arguments AGAINST (why the current approach has merit)

| Reason | Counter |
|---|---|
| Highlights above the fold = maximum visibility | A strip just below the hero fold is still seen with one short scroll, and a teaser/peek can be shown at the hero bottom edge |
| Hero needs a right-column visual balance | Without the card, the right side is empty sky — but Three.js geometry centered would fill this more cohesively than the card does now |
| Urgent content (TCAS) needs prominence | Agreed — but a bold strip immediately below the hero is arguably *more* prominent than a side card competing with the title |

### Recommended implementation

Replace the current hero right-column (carousel card) with this page structure:

```
[HERO]  — full width, branding only, Three.js background
         Left: Logo + Title + CTA buttons
         Right: empty — Three.js geometry centered, no card overlay

[HIGHLIGHTS STRIP]  — sits flush below hero, dark section bg
         3–4 cards in a horizontal row (or 2-col grid on mobile)
         Each card: image, type badge, title, date, CTA link
         No carousel needed — show all at once
         Add a subtle top border with teal glow to signal section start

[NEWS & STORIES]  — existing section, unchanged
```

This structure gives every element room to breathe, makes the Three.js effect the undisputed star of the hero, and keeps highlights highly visible just one scroll away.

---

## 🌤️ Light Mode Review

**Overall verdict: Light mode is unfinished.** The site was clearly designed dark-first and light mode was added as an afterthought. It is functional but loses all personality.

---

### Hero (light mode) — Partially works

| Observation | Severity |
|---|---|
| ADT logo correctly switches to `logo-blue.png` ✅ | — |
| Three.js particles still visible on light bg — teal/gold dots readable ✅ | — |
| "APPLIED DIGITAL" shimmer text washes out — the gradient blends into the pale background, loses glow | 🟠 |
| "Latest News" secondary button almost invisible — border is too light against the white hero bg | 🟠 |
| The TCAS white-background highlight card is no longer jarring in light mode — actually a point in favour of the move-highlights-below argument | 🟢 |

---

### Programs section (light mode) — Biggest problem area

The program cards become flat white rectangles. Every trace of the "digital frontier" aesthetic evaporates:

- Cards render as plain white boxes with hairline borders — no glass, no depth, no tech feel
- Program name colors (teal, purple, gold) now read as ordinary hyperlink text against white — looks like a 2010 Bootstrap site
- "Learn more →" arrows look like inline anchor links, not CTAs
- The section background is white, the cards are white — zero separation between section and card

**Fix:** In light mode, give cards a very light teal tint (`bg-teal/5`) and a stronger `1px solid teal/20` border. Add a soft `box-shadow` to restore depth. Keep program name colors but increase weight to `font-bold`.

---

### News page (light mode) — Mostly fine, small issues

- ✅ Page is clean and readable — white background, dark text works well for editorial content
- Filter buttons (News / Events / Research / Achievement / Announcement) have near-invisible borders on white — they look like text, not interactive buttons
- **Fix:** In light mode, give inactive filter buttons `bg-gray-100` fill so they read as buttons

---

### Program detail page (light mode) — Feels generic

- The page background maps to an extremely pale mint (`~#f0fdfe`) — indistinguishable from plain white, no character
- The large `DIGITAL ENGINEERING & COMMUNICATIONS` Bebas title renders in near-black — in dark mode the teal shimmer/accent made it dramatic; in light mode it's just a big heading
- Stats cards have a light teal tint which works, but the overall page feels like a generic university CMS page
- **Fix:** Add the program's accent color as a subtle left-border stripe or a colored top bar on the hero section to retain brand identity in light mode

---

### Footer (light mode) — Invisible logo, poor separation

- The ADT logo in the footer is nearly invisible — a dark/navy logo on a light grey footer bg with very low contrast
- Footer background is `~#f1f5f9` (near-white) — barely distinguishable from the "About" section above it; there is no clear footer boundary
- **Fix:** Give the footer a slightly darker background (`~#e2e8f0`) in light mode and use the `logo-blue.png` variant here instead of the dark logo

---

### Navbar (light mode) — Too generic

- The navbar in light mode is plain white with dark text and a faint bottom border — it looks like every Bootstrap university site from 2015
- The active nav item (teal text) is slightly more visible in light mode than dark, but still subtle
- The "Apply Now" button border in gold works but the button itself has low fill contrast on white
- **Fix:** Add a very subtle `bg-blue-50/50` tint to the navbar background in light mode to give it slightly more identity

---

### Summary table

| Section | Dark mode | Light mode |
|---|---|---|
| Hero | ⭐⭐⭐⭐⭐ Stunning | ⭐⭐⭐ Acceptable |
| Navbar | ⭐⭐⭐⭐ Good | ⭐⭐ Generic |
| News (homepage) | ⭐⭐⭐⭐ Good | ⭐⭐⭐⭐ Good |
| Programs cards | ⭐⭐⭐⭐ Good | ⭐⭐ Flat/plain |
| Program detail | ⭐⭐⭐ OK | ⭐⭐ Generic |
| News page | ⭐⭐⭐⭐ Good | ⭐⭐⭐⭐ Good |
| Footer | ⭐⭐⭐ OK | ⭐⭐ Poor contrast |

**Recommendation:** Either invest in proper light-mode tokens (card backgrounds, section separators, logo variants) or remove the light mode toggle entirely and ship dark-only. A half-finished light mode does more brand damage than not having one.

---

---

## ✨ Light Mode Redesign Proposal — "Arctic Luminance"

The root problem with the current light mode: it simply inverts the dark theme by mapping `void → white` and dimming the teal. This produces a generic look because **pure white + dimmed teal = every default university CMS site**. The fix is a deliberate light identity — cool blue-tinted backgrounds, full-vibrance teal, a dark footer, and glass-effect cards.

---

### New Color Token Proposal (`globals.css`)

Replace the `html.light { }` block with:

```css
html.light {
  /* Backgrounds — cool arctic blue tint, never plain white */
  --void-rgb:         240 248 255;   /* #F0F8FF alice blue — page base */
  --deep-rgb:         220 238 255;   /* #DCEEff — alternating section bg */
  --surface-rgb:      255 255 255;   /* pure white for inputs / form fields */
  --card-rgb:         248 252 255;   /* near-white with cool tint for card bodies */
  --border-rgb:       186 215 255;   /* soft sky-blue border */

  /* Teal — keep FULL vibrance, do NOT darken it */
  --teal-rgb:         12 200 212;    /* same as dark mode */
  --teal-bright-rgb:  34 235 248;
  --teal-muted-rgb:   8 160 170;

  /* Gold — slightly deeper for readability on light bg */
  --gold-rgb:         210 140 8;
  --gold-light-rgb:   245 170 40;
  --gold-muted-rgb:   162 104 6;

  /* Ink — deep navy family instead of near-black */
  --ink-primary-rgb:   8 22 58;      /* #08163A deep navy */
  --ink-secondary-rgb: 28 55 100;    /* medium navy */
  --ink-muted-rgb:     78 108 158;   /* steel blue */
  --ink-faint-rgb:     184 210 240;  /* for dividers */

  /* Misc */
  --body-bg:           #F0F8FF;
  --glass-bg:          rgba(255, 255, 255, 0.72);
  --glass-border:      rgba(12, 200, 212, 0.20);   /* teal-tinted glass! */
  --glass-shadow:      0 4px 24px rgba(12, 200, 212, 0.10),
                       0 1px 4px rgba(8, 22, 58, 0.06);
  --shimmer-from:      #0CC8D4;      /* restore original shimmer */
  --shimmer-mid:       #22EBF8;
  --shimmer-to:        #F5A623;
  --dot-color:         rgba(12, 200, 212, 0.15);
  --scrollbar-track:   #E0EFFF;
  --scrollbar-thumb:   #B0CEF0;
  --selection-color:   rgba(12, 200, 212, 0.22);
  --selection-text:    #08163A;
}
```

**Why this works:**
- `#F0F8FF` (alice blue) as the page base immediately signals "this is a designed light mode" vs plain white
- Full-vibrance teal on a cool blue background pops beautifully — no dimming needed
- Deep navy ink (`#08163A`) retains brand DNA vs generic near-black
- Teal-tinted `glass-border` and `glass-shadow` means `.glass-card` elements glow subtly with teal in both modes

---

### Keep the Footer Dark (Always)

The footer should stay dark navy in both modes. Dark footer on a light page is a proven premium pattern (used by Apple, Stripe, Linear). It also anchors the page and ties back to the core brand colour.

**In `Footer.tsx`**, override the light theme by hardcoding dark tokens on the footer element:

```tsx
// Force dark regardless of theme
<footer className="bg-[#070F20] text-[#EEF2FF] ...">
```

Or add a utility class `force-dark` in globals.css:
```css
.force-dark {
  --void-rgb: 3 11 26;
  --ink-primary-rgb: 238 242 255;
  /* etc. */
}
```

---

### Navbar — Frosted Glass (not solid white)

Currently in light mode: plain white bar — instantly generic.

**Replace with frosted glass:**
```tsx
// Navbar.tsx — the sticky nav container
className="... bg-white/70 backdrop-blur-xl border-b border-teal/10"
```

The `bg-white/70 backdrop-blur-xl` creates a translucent frost over the alice-blue page — premium, modern, and on-brand.

---

### Program Cards — Restore Glass Depth

In light mode, `.glass-card` renders as a near-flat white box. The new `--glass-shadow` token (teal-tinted) will fix this automatically once the token is updated. Additionally:

```css
/* In globals.css .glass-card utility */
html.light .glass-card {
  background: rgba(255, 255, 255, 0.80);
  border: 1px solid rgba(12, 200, 212, 0.18);
  box-shadow: 0 2px 20px rgba(12, 200, 212, 0.08),
              0 1px 3px rgba(8, 22, 58, 0.05);
}
```

Result: cards have a subtle teal aura — they feel like "digital" cards, not paper.

---

### Hero — Boost Three.js Particle Visibility

In `Hero.tsx`, the parallax div wrapping `<ThreeBackground />` has no explicit opacity. In light mode the particles are faint because the light background competes. Fix:

```tsx
// Hero.tsx — parallax wrapper
<div ref={gridRef} className="absolute inset-0 will-change-transform"
  style={{ opacity: document.documentElement.classList.contains('light') ? 1 : 1 }}>
```

Better: in `ThreeBackground.tsx`, increase the base opacity of particle colors for light mode by detecting the theme and multiplying alpha by 1.4. Or simpler — add a subtle dark overlay in dark mode only and let particles run at full opacity always.

---

### Section Alternation — Use Both Background Levels

Currently all sections use the same background in light mode. Use the two tokens to create rhythm:

| Section | Background token | Result |
|---|---|---|
| Hero | `--void` (#F0F8FF) | Cool blue |
| News | `--deep` (#DCEEff) | Slightly deeper blue |
| Programs | `--void` (#F0F8FF) | Back to base |
| About/Values | `--deep` (#DCEEff) | Deeper blue |
| Footer | Always dark navy | Strong anchor |

This creates a clean alternating cadence without resorting to grey.

---

### Visual Comparison: Before vs After

| Element | Current light | Proposed "Arctic Luminance" |
|---|---|---|
| Page background | `#FFFFFF` flat white | `#F0F8FF` arctic blue tint |
| Teal accent | `#0991A8` dimmed | `#0CC8D4` full vibrance |
| Glass cards | Near-flat white box | White + teal border glow |
| Navbar | Solid white bar | Frosted glass, backdrop-blur |
| Footer | Light grey (broken) | Always dark navy |
| Ink/text | Near-black `#0F172A` | Deep navy `#08163A` |
| Shimmer text | Washed out | Restored — full teal→gold gradient |
| Section rhythm | All same white | Alternating alice blue / sky blue |

---

## 💡 Suggestions for Next Steps

1. **Add page transition animations** — a simple fade-in on route change would make the multi-page experience feel polished
2. **Program detail hero image** — show the program cover image full-bleed as a hero banner on detail pages, it's currently unused there
3. **Mobile review** — resize to 375px; the Three.js canvas and hero grid layout likely need adjustments at small breakpoints
4. **Loading skeleton** for news/staff sections — instead of empty space while data loads from SQLite API, show skeleton cards
5. **Staff section preview** — the homepage staff grid shows only 6 members; consider adding a "View All Faculty →" button more prominently
6. **SEO meta tags** — each page uses the same `<title>`. Program, news, and staff pages should have unique titles and descriptions
