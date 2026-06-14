# KP-Atlas — Kenntnisprüfung Lernzentrale

A self-hosted study hub for the German medical knowledge exam (*Kenntnisprüfung*).
Resources are organised by **medical system → disease/topic**, searchable and
filterable, opened in an in-page viewer. Maintained by editing **one file**.

## Live deploy (GitHub Pages)
1. Put this folder at the **root** of a repo.
2. Repo → **Settings → Pages** → Source: `main` / root.
3. Open the published URL. `index.html` is the entry point.

> Models and PDFs load over http(s). On GitHub Pages this just works. Opening
> `index.html` by double-click (`file://`) shows everything **except** the 3D
> models and embedded files, which browsers block from local fetch.

## Add a resource — edit ONE file
Open **`kp-data.js`** and copy a line in the `ITEMS` array:

```js
{ title:"BGA-Interpreter", system:"Nephrologie", topic:"Säure-Basen-Haushalt",
  type:"html", file:"files/bga-tool.html", size:"1 S." },
```

- **type** — `pdf` · `html` · `video` · `audio` · `image` · `link`
  (pdf / html / image open in the in-page viewer; video / audio / link open in a new tab)
- **file** — a path inside `files/` **or** a full `https://` link
- **size** — optional label shown on the row (e.g. `"1 S."`)
- **system / topic** — must match a name in `CATEGORIES` (an unknown topic falls
  under *Sonstiges* within its system). Only populated branches are shown.

Then drop the referenced file into **`files/`**, commit, push, refresh.

## Optional exam countdown
In `kp-data.js` set `EXAM_DATE = "2026-09-15"` to show *„noch N Tage bis zur Prüfung"*.
Leave it `""` (default) to hide it.

## Project files
| File | Purpose |
|---|---|
| `index.html` | The page. No build step. |
| `kp-data.js` | **Edit this** — your resources (`ITEMS`) + taxonomy (`CATEGORIES`) + `EXAM_DATE`. |
| `kp-icons.js` | One line-glyph per system. |
| `kp-engine.js` | Renders the tree, search, filters, collapse, viewer hooks, countdown. |
| `kp-tree.css` | Styling of the resource tree + controls. |
| `kp-fx.js` | The scroll-driven 3D molecular backdrop (Three.js + depth-of-field). |
| `files/` | Your PDFs / HTML tools / images. |
| `models/` | `.glb` models for the backdrop. |

## Notes
- **No browser storage** is used; state lives in memory + the URL (`#view=…` is
  deep-linkable, and the browser Back button closes the viewer).
- The files currently in `files/` are **placeholders** — replace them with your
  real documents (same names).
- Light/dark toggle is top-right; it follows the OS setting where supported.
- Three.js loads from a CDN; an internet connection is needed for the 3D backdrop.
