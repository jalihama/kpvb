# Hamas KP Atlas — Design Language & Build Spec

A single self-contained study hub for the German Kenntnisprüfung. Root `index.html` +
sibling modules; media in `files/`. Hand-maintained: **add a resource = add one line** to
`ITEMS` in `kp-data.js`. No build step, no localStorage. Deployed on GitHub Pages.

## Files
- `index.html` — page shell, hero, toolbar, in-page viewer, theme + scroll-journey logic.
- `kp-data.js` — `CATEGORIES` (verbatim taxonomy), `ITEMS` (the editable list), `EXAM_DATE`.
- `kp-engine.js` — builds the System→Topic→Resource tree, search, type filter, collapse, counts.
- `kp-icons.js` — one simple vector glyph per system.
- `kp-fx.js` — WebGL scene (Three.js): blood-cell helix, central object, fireflies/dust, sky.
- `kp-tree.css` — tree component styles.
- Bump the `?v=N` query on every `<script>`/`<link>` in index.html when you edit a module.

## Palette (the law)
**Light:** bg `#eef5f8` · card `#ffffff` · ink `#08222c` · ink-soft `#45697a` · line `#cddbe0` · accent `#0a7c9c`
**Dark:** bg `#0a2733` · card `#0f3848` · ink `#e3eef2` · ink-soft `#9fc0cc` · line `#1c4253` · accent `#24c4e6`
Dark-app chrome (when reskinning navy/black apps): bg `#061d28` · panel `#0f3848` · panel-2 `#14495c` · accent `#24c4e6`.
Aqua/teal focus, shifted off green toward cyan-blue. Trauma-sensitive: nothing alarms.

## Type
Roboto Flex (sans) + Roboto Mono (labels/counts/code). Nothing else.
`https://fonts.googleapis.com/css2?family=Roboto+Flex:opsz,wght@8..144,300..800&family=Roboto+Mono:wght@400;500;600&display=swap`

## Themes
Light = daylight→sunset journey; dark = midnight→dawn. Scene + whole UI recolor with scroll.
Matches device color-scheme on load; manual toggle remembered for the session (sessionStorage).
Theme switch resets scroll to position 0.

## Motion (kp-fx.js) — settled values, don't relitigate
Central object: scroll-driven Y-rotation only (no idle spin), matte (no env glow), behind a 6px
frost (2px on phones). Fireflies: sparse, small, slow wander + slow blink (sin⁶), single warm-teal
glow in dark / subtle in light, screen-blend so they pass through the sky. Blood-cell helix: wide
vessel, loose winding (~2.4 turns), flows forward faster than it rotates, emerges from lower-right
(aspect-aware in portrait), recedes into DoF. Loop pauses when tab hidden, capped ~60fps, DoF off
on phones.

## Hierarchy / interaction
System cards **and** topics default **collapsed**. Opening a card highlights it; opening a
different card moves the single highlight; collapsing clears it. Side-menu click collapses all,
opens+highlights that one (transitions suppressed during the jump so no scroll-jerk). Each system
has its own oklch hue on icon/count/dots/index entry. Only populated branches render; unknown
topics fall under "Sonstiges". Search auto-expands matches.

## In-page viewer
Opens pdf/html/image in an overlay (`#view=<id>` hash → browser back closes it). Back button +
"Neuer Tab ↗". **Images/SVG:** pinch/drag/double-tap/wheel + −/⊡/+ zoom, opens fit-to-screen.
**HTML pages:** A−/A/A+ text-size buttons that do `body { transform: scale(n); transform-origin:0 0 }`
(NOT css `zoom` — zoom doesn't scale width-pinned SVGs; transform scales flowcharts too).

## Adding/reskinning imported resources — the core recurring task
Goal: make every imported doc speak the KP-Atlas language **without touching meaning**.
1. Copy parenthesized/spaced filenames to safe kebab-case names first (the script reader rejects
   `(`, spaces). Rename SVGs without spaces.
2. **Reskin chrome only:** swap fonts → Roboto; map neutral bg/ink/line/muted to the palette above
   (light + any dark mode). Common warm-neutral family to convert: `#f0ece3→#eef5f8`,
   `#1a1814→#08222c`, `#5a5650→#45697a`, `#c8c2b5→#cddbe0`, hairlines `#ede8dc→#e1ebee`.
3. **Never change meaningful color:** clinical flags (red danger, blue/red lab ↓↑, amber caveat),
   drug-class/organ codes, CD4 strata, TNM stage gradients, phase coding, decision-tree node
   colors, legends. If a color IS the legend, keep it.
4. **Never restyle paper-emulation** (BGA/Blutbild/Gerinnung printouts, Totenschein, etc.) — leave as-is.
5. Token-only `:root` overrides with `!important` cascade cleanly; prefer that over rewriting.
6. Fragments that rely on host tokens (`var(--color-text-primary)` etc.) or have no `<head>`:
   wrap in a full doc that DEFINES those tokens in the palette (light+dark) + Roboto + a titled
   header + `.sr-only{position:absolute;width:1px;height:1px;clip:rect(0,0,0,0)}`.
7. SVGs with `width="100%"` / only a viewBox: add explicit `width`/`height` (else they collapse as
   `<img>`); add a `<rect ... fill="#eef5f8">` bg behind `<defs>`; set `font-family` on `<svg>`.
8. Inject brand `<style id="kp-brand">` before `<body>` (NOT before `</head>` — some files split
   their CSS at a `</head>`-like boundary and leak raw CSS text). Verify: one `</head>`, balanced
   `</style>`.
9. **saveFile commits only if the whole script finishes** — never batch a save with a later step
   that can throw (a parenthesized filename killed an earlier save → dead link). One job per script
   or copy-first.
10. Add ONE line to `ITEMS`: `{ title, system, topic, type, file, size }`. `type`:
    pdf|html|video|audio|image|link. system/topic must match `CATEGORIES` names exactly (German).
    Categorize by content; unknown topic → still shows under system in "Sonstiges".
11. If a file is a newer revision of one already present, replace in place (keep its ITEMS entry).
    Skip exact duplicates.

## Verify-before-deliver
Preview is flaky and html-to-image can't capture nested iframes — don't trust a blank capture.
Verify via: `eval_js` on `KPA.registry` (item/system counts), file structure checks
(`</head>`/`</style>`/`<body>` balance, roboto present, meaning-colors kept), `get_webview_logs`.
Then re-package the whole project as a download for GitHub.

## Voice
German UI microcopy (Suche…, Alle, Systeme, Öffnen, noch N Tage bis zur Prüfung; type labels
PDF · Seite · Video · Audio · Bild · Link). Plain, exact, calm. No emoji. Minimal — no filler.
