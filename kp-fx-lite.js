/* ============================================================
   KP-FX-LITE — mobile fallback renderer (2D canvas)
   Drop-in for window.KPFX: same public API, but no WebGL.
   Draws cells + shapes on #gl (2D) and light-points on #fgdots,
   honouring the SAME controls (cells / shapes / particles /
   motion / gradient via CSS). Cheap enough for phones; every
   toggle stays live — nothing is pre-baked.
   API: init({canvas}), resize(), render(scroll),
        setScene(bright,deep,obj,ang), setVisible(key,on),
        setMotion(mode)
   ============================================================ */
(function () {
  "use strict";
  const TAU = Math.PI * 2;
  const REDUCE = matchMedia("(prefers-reduced-motion:reduce)").matches;
  const FG_DARK = ["150,224,243", "130,226,168", "244,194,110", "240,138,160"];
  const FG_LIGHT = ["20,140,170", "26,150,120", "180,120,40", "170,80,100"];

  let gl, ctx, fg, fgx, DPR = 1, W = 0, H = 0;
  let cells = [], shapes = [], pts = [];
  let showCells = true, showShapes = true, showParticles = true;
  let motion = "scroll", lastScroll = 0, raf = null, objCol = "180,200,210";

  const rnd = (a, b) => a + Math.random() * (b - a);
  const isLight = () => document.documentElement.getAttribute("data-theme") === "light";

  function seed() {
    cells = [];
    const nC = Math.round(Math.min(26, innerWidth / 18));
    for (let i = 0; i < nC; i++) cells.push({ x: Math.random(), y: Math.random(), r: rnd(0.55, 1.5), a: Math.random() * TAU, ph: Math.random() * TAU, sp: rnd(0.05, 0.22), par: rnd(0.04, 0.16) });
    shapes = [];
    const nS = Math.round(Math.min(7, innerWidth / 90));
    for (let i = 0; i < nS; i++) shapes.push({ x: Math.random(), y: Math.random(), s: rnd(26, 58), a: Math.random() * TAU, spin: rnd(-0.12, 0.12), ph: Math.random() * TAU, kind: i % 3, par: rnd(0.05, 0.2) });
    pts = [];
    const nP = Math.round(Math.min(30, innerWidth / 16));
    for (let i = 0; i < nP; i++) pts.push({ x: Math.random(), y: Math.random(), r: rnd(0.6, 1.9), ph: Math.random() * TAU, sp: rnd(0.25, 0.7), c: i % FG_DARK.length, par: rnd(0.05, 0.35) });
  }

  function size() {
    DPR = Math.min(devicePixelRatio || 1, 1.5);
    W = Math.round(innerWidth * DPR); H = Math.round(innerHeight * DPR);
    [gl, fg].forEach(c => { if (!c) return; c.width = W; c.height = H; c.style.width = innerWidth + "px"; c.style.height = innerHeight + "px"; });
  }

  function phase(t) { return motion === "still" ? 0 : motion === "loop" ? t * 0.04 : lastScroll * 0.0006; }

  function drawCell(c, x, y, R) {
    ctx.globalAlpha = 0.82; ctx.fillStyle = "#c0473f";
    ctx.beginPath(); ctx.ellipse(x, y, R, R * 0.82, c.a, 0, TAU); ctx.fill();
    ctx.globalAlpha = 0.5; ctx.fillStyle = "rgba(255,190,180,.55)";
    ctx.beginPath(); ctx.ellipse(x, y, R * 0.42, R * 0.34, c.a, 0, TAU); ctx.fill();
    ctx.globalAlpha = 1;
  }
  function drawShape(s, x, y, t) {
    const col = "rgba(" + objCol + ",0.42)";
    ctx.save(); ctx.translate(x, y); ctx.rotate(s.a + (motion === "still" ? 0 : t * s.spin));
    ctx.strokeStyle = col; ctx.lineWidth = 1.6 * DPR; ctx.lineCap = "round"; ctx.lineJoin = "round";
    const u = s.s * DPR;
    if (s.kind === 0) {                                   // hexagon ring (benzene)
      ctx.beginPath(); for (let i = 0; i <= 6; i++) { const an = i / 6 * TAU; const px = Math.cos(an) * u, py = Math.sin(an) * u; i ? ctx.lineTo(px, py) : ctx.moveTo(px, py); } ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, u * 0.6, 0, TAU); ctx.stroke();
    } else if (s.kind === 1) {                            // short double-helix
      for (let k = 0; k < 2; k++) { ctx.beginPath(); for (let i = 0; i <= 24; i++) { const ty = (i / 24 - 0.5) * 2 * u; const tx = Math.sin(i / 24 * TAU * 1.5 + k * Math.PI) * u * 0.5; i ? ctx.lineTo(tx, ty) : ctx.moveTo(tx, ty); } ctx.stroke(); }
      for (let i = 0; i <= 6; i++) { const ty = (i / 6 - 0.5) * 2 * u; const tx = Math.sin(i / 6 * TAU * 1.5) * u * 0.5; ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(-tx, ty); ctx.stroke(); }
    } else {                                              // fused ring cluster
      [[-u * 0.5, 0], [u * 0.5, 0]].forEach(([cx]) => { ctx.beginPath(); ctx.arc(cx, 0, u * 0.62, 0, TAU); ctx.stroke(); });
    }
    ctx.restore();
  }

  function frame(now) {
    const t = (now || 0) * 0.001, p = phase(t);
    if (ctx) {
      ctx.clearRect(0, 0, W, H);
      if (showCells) for (const c of cells) {
        let y = (c.y + p * c.par * 6 + (motion === "still" ? 0 : Math.cos(c.ph + t * 0.3) * 0.02)); y = ((y % 1) + 1) % 1;
        const x = (c.x + Math.sin(c.ph + p) * 0.02) * W;
        drawCell(c, x, y * H, c.r * 0.045 * Math.min(W, H));
      }
      if (showShapes) for (const s of shapes) {
        let y = (s.y + p * s.par * 4); y = ((y % 1) + 1) % 1;
        drawShape(s, (s.x + Math.sin(s.ph + p * 0.5) * 0.02) * W, y * H, t);
      }
    }
    if (fgx) {
      fgx.clearRect(0, 0, W, H);
      if (showParticles) {
        const pal = isLight() ? FG_LIGHT : FG_DARK; fgx.globalCompositeOperation = "lighter";
        for (const q of pts) {
          const still = motion === "still";
          const b = still ? 0.5 : Math.pow(Math.sin(t * q.sp + q.ph) * 0.5 + 0.5, 6);
          if (!still && b < 0.03) continue;
          let y = (q.y - p * q.par * 4); y = ((y % 1) + 1) % 1;
          const x = (q.x + Math.sin(q.ph + p * 0.3) * 0.015) * W, r = q.r * DPR * (2.2 + b * 3.2);
          const g = fgx.createRadialGradient(x, y * H, 0, x, y * H, r);
          g.addColorStop(0, "rgba(" + pal[q.c] + "," + (0.85 * b).toFixed(3) + ")");
          g.addColorStop(1, "rgba(" + pal[q.c] + ",0)");
          fgx.fillStyle = g; fgx.beginPath(); fgx.arc(x, y * H, r, 0, TAU); fgx.fill();
        }
        fgx.globalCompositeOperation = "source-over";
      }
    }
    if (motion !== "still" && !REDUCE) raf = requestAnimationFrame(frame); else raf = null;
  }
  function start() { if (raf || REDUCE) { if (REDUCE) frame(0); return; } if (motion === "still") { frame(0); return; } raf = requestAnimationFrame(frame); }
  function stop() { if (raf) { cancelAnimationFrame(raf); raf = null; } }

  function init(opts) {
    gl = opts && opts.canvas ? opts.canvas : document.getElementById("gl");
    fg = document.getElementById("fgdots");
    try { ctx = gl ? gl.getContext("2d") : null; } catch (e) { ctx = null; }
    fgx = fg ? fg.getContext("2d") : null;
    seed(); size(); start();
  }
  function resize() { size(); if (!raf) frame(0); }
  function render(scroll) { lastScroll = scroll; if (motion === "scroll") { if (!raf) frame(0); } }
  function setScene(bright, deep, obj) { if (obj) { const m = String(obj).match(/\d+/g); if (m) objCol = m.slice(0, 3).join(","); } }
  function setVisible(key, on) {
    if (key === "cells") showCells = on;
    else if (key === "object") showShapes = on;
    else if (key === "particles") { showParticles = on; if (fg) fg.style.display = on ? "" : "none"; }
    frame(0);
  }
  function setMotion(mode) { motion = mode; stop(); start(); }

  window.KPFXLite = { init, resize, render, setScene, setVisible, setMotion };
})();
