/* ============================================================
   KP-ATLAS · SYSTEM ICONS
   One simple line glyph per medical system. Inner SVG markup
   only; the engine wraps it in <svg viewBox="0 0 24 24"
   fill="none" stroke="currentColor" …>. Keep strokes simple.
   ============================================================ */
const SYSTEM_ICONS = {
  "Kardiologie & Angiologie":
    '<path d="M12 20.3C6.8 16.6 3.8 13.2 3.8 9.4A3.9 3.9 0 0 1 12 7a3.9 3.9 0 0 1 8.2 2.4c0 1.2-.3 2.3-.9 3.4"/><path d="M11.5 12.4h3.2l1.3-2.2 1.6 4 1.1-2.1h2.5"/>',
  "Pneumologie":
    '<path d="M12 3.5v6.2"/><path d="M12 9.7c-.7-1.1-2.6-1.4-3.2.4-.5 1.5-1.1 2.2-2.4 3.1-1 .7-1.4 1.7-1.2 3.4.2 1.9 1 3.4 2.7 3.4 1.6 0 2.4-1 2.5-2.7l.6-7.6"/><path d="M12 9.7c.7-1.1 2.6-1.4 3.2.4.5 1.5 1.1 2.2 2.4 3.1 1 .7 1.4 1.7 1.2 3.4-.2 1.9-1 3.4-2.7 3.4-1.6 0-2.4-1-2.5-2.7l-.6-7.6"/>',
  "Gastroenterologie":
    '<path d="M9 4v3.2c0 1.3.8 1.9 1.9 2.2 3 .7 4.8 2.6 4.8 5.4 0 2.7-2.1 4.7-4.8 4.7-2.4 0-4.4-1.6-4.4-3.8 0-1 .4-1.8 1-2.3"/><path d="M15.6 13.2c.9-.3 1.7-1 1.7-2"/>',
  "Nephrologie":
    '<path d="M14.4 4.5c-3.1 0-5.2 2.9-5.2 6.2 0 1.4-1.9 1.5-1.9 3.9 0 2.2 1.8 4.1 4.1 4.1 3.4 0 6.1-3.2 6.1-7.3 0-3.9-1.3-6.9-3.1-6.9z"/><path d="M11.6 12.2c.7-.7 1.7-.6 2.3.2"/>',
  "Endokrinologie":
    '<path d="M12 3.2 19 7.1v7.8L12 18.8 5 14.9V7.1z"/><circle cx="12" cy="11" r="2.4"/><path d="M12 13.4v3"/>',
  "Hämatologie & Onkologie":
    '<path d="M12 3.4s5 5.6 5 9.1A5 5 0 1 1 7 12.5C7 9 12 3.4 12 3.4z"/><circle cx="12.5" cy="13.5" r="1.4"/><circle cx="9.6" cy="11.4" r="0.9"/>',
  "Infektiologie":
    '<circle cx="12" cy="12" r="4.4"/><path d="M12 3.6v2.6M12 17.8v2.6M3.6 12h2.6M17.8 12h2.6M6 6l1.9 1.9M16.1 16.1 18 18M18 6l-1.9 1.9M7.9 16.1 6 18"/><circle cx="12" cy="3.4" r="0.5"/><circle cx="12" cy="20.6" r="0.5"/><circle cx="3.4" cy="12" r="0.5"/><circle cx="20.6" cy="12" r="0.5"/>',
  "Rheumatologie":
    '<circle cx="7" cy="17" r="2.1"/><circle cx="14.3" cy="9.7" r="2.1"/><path d="M8.5 15.5 12.8 11.2"/><path d="M16 8l1.8-1.8M18.3 10.3 20 8.6"/>',
  "Leitsymptome":
    '<circle cx="11" cy="11" r="6"/><path d="M19.5 19.5 15.2 15.2"/><path d="M11 8.2v5.6M8.2 11h5.6"/>',
  "Notfallmedizin":
    '<path d="M13.4 3.5 5.5 13.4h5.2l-1.1 7.1 8-10.6h-5.3z"/>',
  "Chirurgie":
    '<path d="M4 20.2 12.3 11.9"/><path d="M12.3 11.9 18.6 5.6a2.7 2.7 0 0 0-3.8-3.8L9 7.6z"/><path d="M9 7.6l3.3 3.3"/>',
  "Orthopädie & Unfallchirurgie":
    '<path d="M8.2 15.8 15.8 8.2"/><path d="M8.2 15.8a1.8 1.8 0 1 1-2-1.9 1.8 1.8 0 0 1 1.9-2 1.8 1.8 0 1 1 2 1.9 1.8 1.8 0 0 1-1.9 2zM15.8 8.2a1.8 1.8 0 1 0 1.9 2 1.8 1.8 0 0 0 2-1.9 1.8 1.8 0 1 0-1.9-2 1.8 1.8 0 0 0-2 1.9z"/>',
  "Stationsalltag & Untersuchung":
    '<path d="M6 3.5v5a4 4 0 0 0 8 0v-5"/><path d="M10 16.5a4 4 0 0 0 8 0v-2.3"/><circle cx="18" cy="11.6" r="2.2"/><circle cx="6" cy="3.5" r="0.6"/><circle cx="14" cy="3.5" r="0.6"/>',
  "Pharmakologie & Basismedikation":
    '<path d="M8.3 16.7 16.7 8.3a3.6 3.6 0 0 0-5.1-5.1L3.2 11.6a3.6 3.6 0 0 0 5.1 5.1z"/><path d="M7.4 7.4 12.6 12.6"/>',
  "Recht, Entlassung & Palliativmedizin":
    '<path d="M7 3.5h6.5L18 8v12.5H7z"/><path d="M13.4 3.6V8H18"/><path d="M12.5 17.6c-1.9-1.1-2.9-2.3-2.9-3.7a1.45 1.45 0 0 1 2.9-.6 1.45 1.45 0 0 1 2.9.6c0 1.4-1 2.6-2.9 3.7z"/>',
  "Klinische Übungen & Skills":
    '<rect x="4.2" y="4.2" width="15.6" height="15.6" rx="2.4"/><path d="M7.6 9.6l2 2 3.3-3.4"/><path d="M7.6 15.4h6.8"/>',
  "Sonstiges":
    '<circle cx="6" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="18" cy="12" r="1.4"/>',
};
