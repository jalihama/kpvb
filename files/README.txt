KP-ATLAS · files/ folder
========================

Put your study materials here (PDFs, images, HTML tools, audio…).

In index.html, each resource is ONE line in the ITEMS array, e.g.:

  { title:"Strukturierter EKG-Befund", system:"Kardiologie & Angiologie",
    topic:"EKG", type:"pdf", file:"files/ekg-befund.pdf" },

- file: a path inside this repo ("files/…") OR a full https:// link
        (e.g. a YouTube/Drive video).
- type: "pdf" | "html" | "video" | "audio" | "image" | "link"
- system / topic must match a name in CATEGORIES (unknown topics fall
  under "Sonstiges" inside their system).

Then: Commit → Push (GitHub Desktop). Refresh the page. Done.
