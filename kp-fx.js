/* ============================================================
   KP-ATLAS · FX  —  real 3D specimens (WebGL) with depth-of-field
   Loads the user's .glb models, scatters clones in 3D space, and
   drives drift / rotation from scroll (static when idle). A real
   Bokeh depth-of-field pass blurs near & far; mid-plane stays
   sharp. Glowing sprite particles live in the same scene, so they
   pick up the DoF too. Opaque scene (= page bg colour) → clean DoF.
   Requires THREE + GLTFLoader + EffectComposer/RenderPass/
   BokehPass (loaded via CDN before this file).
   API: KPFX.init({canvas}); KPFX.resize(); KPFX.render(scrollPx);
        KPFX.setTheme()
   ============================================================ */
(function () {
  const MODELS = [
    { url: "models/ribbon-rainbow.glb", n: 1, size: 9.2 },
  ];
  /* cohesive cool tints so the specimens suit the theme + glow */
  const TINTS = ["#27c4e6", "#34c7c0", "#3f8fd0", "#57cfe8", "#2aa6c6", "#6a8fe0"];
  const rand = (a, b) => a + Math.random() * (b - a);

  let renderer, scene, camera, composer, bokeh, fxaa, ready = false;
  let items = [], parts = [], lastScroll = 0, glcanvas, fgcvs, fgctx, fgdots = [], fgRaf = null, skyCanvas, skyTex, objMats = [], cells = [], helixGroup, helixPath, hemi, _T, _N, _B, _off, UP_Y, UP_X, hxOff = 4, vyOff = -3;
  const SPAN = 15;                       // vertical world-wrap span
  const REDUCE = matchMedia("(prefers-reduced-motion:reduce)").matches;
  /* curated complementary firefly palette (cool cyan/mint ↔ warm amber/rose) */
  const FG_DARK = ["150,224,243", "130,226,168", "244,194,110", "240,138,160"];
  const FG_LIGHT = ["28,118,146", "46,134,92", "182,108,52", "166,80,108"];

  function bgColor() {
    const hex = getComputedStyle(document.documentElement).getPropertyValue("--bg").trim() || "#061d28";
    return new THREE.Color(hex);
  }

  function particleTexture() {
    const c = document.createElement("canvas"); c.width = c.height = 64;
    const x = c.getContext("2d"), g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(255,255,255,1)"); g.addColorStop(0.35, "rgba(255,255,255,.5)"); g.addColorStop(1, "rgba(255,255,255,0)");
    x.fillStyle = g; x.fillRect(0, 0, 64, 64);
    const t = new THREE.CanvasTexture(c); return t;
  }

  const PCOL = ["#7fd6ec", "#82d7c7", "#a0c0f0", "#bdb7f1", "#f4c99f", "#eeb4c3", "#8cdab1"];

  function init(opts) {
    glcanvas = opts.canvas;
    fgcvs = document.getElementById("fgdots");
    if (fgcvs) fgctx = fgcvs.getContext("2d");
    renderer = new THREE.WebGLRenderer({ canvas: glcanvas, antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, innerWidth < 760 ? 1 : 1.4));
    renderer.setSize(innerWidth, innerHeight);
    if ("outputEncoding" in renderer) renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.92;

    scene = new THREE.Scene();
    skyCanvas = document.createElement("canvas"); skyCanvas.width = 64; skyCanvas.height = 64;
    skyTex = new THREE.CanvasTexture(skyCanvas);
    if ("encoding" in skyTex) skyTex.encoding = THREE.sRGBEncoding;
    buildSky("#0a2733", "#04141d");
    scene.background = skyTex;
    scene.fog = new THREE.Fog(new THREE.Color("#0a2733"), 11, 36);
    /* environment map so metallic glTF materials are lit (no more black) */
    try {
      const pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromScene(new THREE.RoomEnvironment(), 0.04).texture;
    } catch (e) { console.warn("env map unavailable", e); }

    camera = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, 0.1, 120);
    camera.position.set(0, 0, 14);

    hemi = new THREE.HemisphereLight(0xffffff, 0x3a4a55, 0.7); scene.add(hemi);
    const d1 = new THREE.DirectionalLight(0xffffff, 0.5); d1.position.set(6, 9, 8); scene.add(d1);
    const d2 = new THREE.DirectionalLight(0x9fd0ff, 0.22); d2.position.set(-7, -3, 4); scene.add(d2);
    buildHelix();

    /* particles are drawn in the 2D foreground layer (continuous DoF, theme-aware) */

    /* post-processing: render + bokeh DoF */
    composer = new THREE.EffectComposer(renderer);
    composer.addPass(new THREE.RenderPass(scene, camera));
    if (innerWidth >= 760) {
      bokeh = new THREE.BokehPass(scene, camera, { focus: 14.0, aperture: 0.009, maxblur: 0.08, width: innerWidth, height: innerHeight });
      composer.addPass(bokeh);
    }
    /* FXAA — EffectComposer bypasses the renderer's MSAA, so antialias the composed image */
    fxaa = new THREE.ShaderPass(THREE.FXAAShader);
    composer.addPass(fxaa);
    composer.setSize(innerWidth, innerHeight);
    setFxaaRes();
    frameCamera();

    ready = true;
    sizeFg(); seedFg(); startFg();
    document.addEventListener("visibilitychange", () => { if (document.hidden) { if (fgRaf) { cancelAnimationFrame(fgRaf); fgRaf = null; } } else startFg(); });
    loadModels();
    render(lastScroll);
  }

  /* pull the camera back on narrow/portrait screens so the symmetric
     object field stays centered & in view; keep fog + DoF focus in sync */
  function frameCamera() {
    const aspect = camera.aspect, fovV = camera.fov * Math.PI / 180;
    let z = 14;
    if (aspect < 1.15) z = Math.min(40, Math.max(14, 7.6 / (Math.tan(fovV / 2) * Math.max(aspect, 0.34))));
    camera.position.z = z;
    if (aspect < 1) { hxOff = 2.2; vyOff = -5.5; } else { hxOff = 4; vyOff = -3; }
    scene.fog.near = z - 6; scene.fog.far = z + 22;
    if (bokeh && bokeh.uniforms && bokeh.uniforms.focus) bokeh.uniforms.focus.value = z;
  }

  function prep(gltf, targetSize) {
    const root = gltf.scene || gltf.scenes[0];
    root.updateWorldMatrix(true, true);
    const box = new THREE.Box3().setFromObject(root);
    const size = new THREE.Vector3(); box.getSize(size);
    const center = new THREE.Vector3(); box.getCenter(center);
    const maxDim = Math.max(size.x, size.y, size.z) || 1;
    root.position.sub(center);
    root.traverse(o => {
      if (!o.isMesh) return;
      o.frustumCulled = false;
      const g = o.geometry;
      if (g && (!g.attributes || !g.attributes.normal)) g.computeVertexNormals();
    });
    const g = new THREE.Group();
    g.add(root);
    g.scale.setScalar(targetSize / maxDim);
    return g;
  }

  function scatter(proto, count, idx) {
    for (let i = 0; i < count; i++) {
      const inst = proto.clone(true);
      inst.scale.multiplyScalar(rand(0.8, 1.18));
      const col = new THREE.Color(TINTS[(idx * 3 + i) % TINTS.length]);
      const meshMat = new THREE.MeshStandardMaterial({ color: col, roughness: 0.78, metalness: 0, emissive: 0x000000, envMapIntensity: 0, side: THREE.DoubleSide });
      const lineMat = new THREE.LineBasicMaterial({ color: col });
      const ptMat = new THREE.PointsMaterial({ color: col, size: 0.05, sizeAttenuation: true });
      inst.traverse(o => {
        o.frustumCulled = false;
        if (o.isMesh) o.material = meshMat;
        else if (o.isLine) o.material = lineMat;
        else if (o.isPoints) o.material = ptMat;
      });
      objMats.push(meshMat, lineMat, ptMat);
      const u = { rx0: rand(0, 6.28), ry0: rand(0, 6.28), rxs: 0.0006 };
      inst.userData = u;
      inst.position.set(0, 0, -1);          // centered, just behind the focus plane
      inst.rotation.set(0, u.rx0, 0);
      scene.add(inst); items.push(inst);
    }
  }

  function loadModels() {
    const loader = new THREE.GLTFLoader();
    MODELS.forEach((m, idx) => {
      loader.load(m.url, (gltf) => {
        const proto = prep(gltf, m.size);
        scatter(proto, m.n, idx);
        render(lastScroll);
      }, undefined, (err) => { console.warn("Model failed:", m.url, err); });
    });
  }

  function buildSky(bright, deep, ang) {
    ang = ang || 0;
    const c = skyCanvas.getContext("2d"), W = skyCanvas.width, H = skyCanvas.height;
    const cx = W / 2, cy = H / 2, R = Math.hypot(W, H) / 2;
    const dx = Math.cos(ang) * R, dy = Math.sin(ang) * R;            // sun direction rotates with scroll
    const g = c.createLinearGradient(cx - dx, cy - dy, cx + dx, cy + dy);
    g.addColorStop(0, bright); g.addColorStop(1, deep);
    c.fillStyle = g; c.fillRect(0, 0, W, H);
    const g2 = c.createLinearGradient(cx - dx, cy - dy, cx + dx, cy + dy);
    g2.addColorStop(0, "rgba(255,255,255,0.6)"); g2.addColorStop(1, "rgba(0,0,0,0.45)");
    c.globalCompositeOperation = "soft-light";
    c.fillStyle = g2; c.fillRect(0, 0, W, H);
    c.globalCompositeOperation = "source-over";
    if (skyTex) skyTex.needsUpdate = true;
  }
  function setScene(bright, deep, obj, ang) {
    if (!ready) return;
    buildSky(bright, deep, ang);
    if (scene.fog) scene.fog.color.set(deep);
    if (hemi) hemi.color.set(bright);
    for (const m of objMats) { if (m && m.color) m.color.set(obj); }
    render(lastScroll);
  }

  function setFxaaRes() {
    if (!fxaa) return;
    const pr = renderer.getPixelRatio();
    fxaa.material.uniforms.resolution.value.set(1 / (innerWidth * pr), 1 / (innerHeight * pr));
  }

  function resize() {
    if (!ready) return;
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, innerWidth < 760 ? 1 : 1.4));
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
    composer.setSize(innerWidth, innerHeight);
    setFxaaRes();
    frameCamera();
    sizeFg(); seedFg(); startFg();
    render(lastScroll);
  }

  function sizeFg() {
    if (!fgcvs) return;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    fgcvs.width = innerWidth * dpr; fgcvs.height = innerHeight * dpr;
    fgcvs.style.width = innerWidth + "px"; fgcvs.style.height = innerHeight + "px";
    fgcvs._dpr = dpr;
  }
  function seedFg() {
    fgdots = [];
    const n = Math.round(Math.min(90, innerWidth / 15));
    for (let i = 0; i < n; i++) {
      fgdots.push({
        bx: Math.random(), by: Math.random(),
        r: rand(0.6, 1.6), a: rand(0.85, 1.7), par: rand(0.2, 0.85), ci: (Math.random() * 4) | 0,
        wax: rand(0.015, 0.05), way: rand(0.015, 0.05),
        wsx: rand(0.08, 0.32), wsy: rand(0.08, 0.32), phx: rand(0, 6.28), phy: rand(0, 6.28),
        tw: rand(0.25, 0.75), pht: rand(0, 6.28)
      });
    }
  }
  function startFg() {
    if (REDUCE) return;                 // reduced motion → fireflies static (painted by render)
    if (fgRaf) return;
    let lastT = 0;
    const loop = (now) => { fgRaf = requestAnimationFrame(loop); if (now - lastT < 15.5) return; lastT = now; paintFg(now); };
    fgRaf = requestAnimationFrame(loop);
  }
  function paintFg(now) {
    if (!fgctx || !fgcvs._dpr) return;
    const dpr = fgcvs._dpr, W = fgcvs.width, H = fgcvs.height, span = H * 1.4;
    const t = now * 0.001, scroll = lastScroll;
    const max = (document.documentElement.scrollHeight - innerHeight) || 1;
    const p = Math.min(1, Math.max(0, scroll / max));
    fgctx.clearRect(0, 0, W, H);
    const dark = document.documentElement.getAttribute("data-theme") !== "light";

    if (!dark) {
      // daytime → sunset: drifting dust motes (scene colour handled by CSS journey)
      fgctx.globalCompositeOperation = "source-over";
      for (const d of fgdots) {
        const wx = d.bx + Math.sin(t * d.wsx + d.phx) * d.wax;
        const wy = d.by + Math.sin(t * d.wsy + d.phy) * d.way;
        let y = wy * H - scroll * dpr * d.par * 0.03; y = ((y % span) + span) % span;
        const x = (((wx % 1) + 1) % 1) * W;
        const sh = 0.5 + 0.5 * Math.sin(t * d.tw * 0.5 + d.pht);
        const glow = d.r * dpr * 3.2, a = 0.34 * (0.5 + 0.5 * sh);
        const g = fgctx.createRadialGradient(x, y, 0, x, y, glow);
        g.addColorStop(0, `rgba(150,120,80,${a})`);
        g.addColorStop(0.4, `rgba(150,120,80,${a * 0.5})`);
        g.addColorStop(1, `rgba(150,120,80,0)`);
        fgctx.fillStyle = g; fgctx.beginPath(); fgctx.arc(x, y, glow, 0, 6.2832); fgctx.fill();
      }
      return;
    }

    // midnight → dawn: fireflies winking out as the dawn light comes up
    fgctx.globalCompositeOperation = "lighter";
    const fade = 1 - p * 0.8;
    const col = "190,226,120";
    for (const d of fgdots) {
      const wx = d.bx + Math.sin(t * d.wsx + d.phx) * d.wax;
      const wy = d.by + Math.sin(t * d.wsy + d.phy) * d.way;
      let y = wy * H - scroll * dpr * d.par * 0.025; y = ((y % span) + span) % span;
      const x = (((wx % 1) + 1) % 1) * W;
      const blink = Math.pow(Math.max(0, Math.sin(t * d.tw + d.pht)), 6);
      const glow = d.r * dpr * 4.2, a = d.a * (0.1 + 0.9 * blink) * fade;
      const g = fgctx.createRadialGradient(x, y, 0, x, y, glow);
      g.addColorStop(0, `rgba(${col},${a})`);
      g.addColorStop(0.35, `rgba(${col},${a * 0.5})`);
      g.addColorStop(1, `rgba(${col},0)`);
      fgctx.fillStyle = g; fgctx.beginPath(); fgctx.arc(x, y, glow, 0, 6.2832); fgctx.fill();
    }
    fgctx.globalCompositeOperation = "source-over";
  }

  function fadeCell(t) { if (t < 0.03) return t / 0.03; return Math.max(0, 1 - Math.pow(Math.max(0, (t - 0.45) / 0.55), 1.4)); }
  function buildHelix() {
    class HP extends THREE.Curve {
      getPoint(t) {
        const turns = 2.4, a = t * turns * Math.PI * 2;
        const z = 10 - t * 64, rad = 1.2 + t * 6;
        const ox = hxOff * (1 - t), oy = vyOff * (1 - t);    // emerge from corner -> sweep to centre (aspect-aware)
        return new THREE.Vector3(Math.cos(a) * rad + ox, Math.sin(a) * rad * 0.8 + oy, z);
      }
    }
    helixPath = new HP();
    helixGroup = new THREE.Group();
    helixGroup.scale.setScalar(1);
    helixGroup.position.set(0, 0, 0);
    scene.add(helixGroup);
    const pts = [[0,.22],[.30,.26],[.62,.40],[.88,.34],[1,.02],[.88,-.34],[.62,-.40],[.30,-.26],[0,-.22]].map(p => new THREE.Vector2(p[0], p[1]));
    const rbcGeo = new THREE.LatheGeometry(pts, 28); rbcGeo.computeVertexNormals();
    const wbcGeo = new THREE.IcosahedronGeometry(0.95, 1);
    const pltGeo = new THREE.IcosahedronGeometry(0.42, 0);
    const mRBC = new THREE.MeshStandardMaterial({ color: 0xc41e2a, roughness: .42, metalness: .05, transparent: true });
    const mRBC2 = new THREE.MeshStandardMaterial({ color: 0x9e1520, roughness: .5, metalness: .05, transparent: true });
    const mWBC = new THREE.MeshStandardMaterial({ color: 0xe9e2f0, roughness: .65, transparent: true, flatShading: true });
    const mPLT = new THREE.MeshStandardMaterial({ color: 0xd8b389, roughness: .7, transparent: true, flatShading: true });
    const N = innerWidth < 760 ? 80 : Math.round(Math.min(150, 90 + innerWidth / 14)); cells = [];
    for (let i = 0; i < N; i++) {
      const roll = Math.random(); let mesh, scale;
      if (roll < 0.78) { mesh = new THREE.Mesh(rbcGeo, (Math.random() < .5 ? mRBC : mRBC2).clone()); scale = .5 + Math.random() * .18; }
      else if (roll < 0.93) { mesh = new THREE.Mesh(pltGeo, mPLT.clone()); scale = .5 + Math.random() * .3; }
      else { mesh = new THREE.Mesh(wbcGeo, mWBC.clone()); scale = .7 + Math.random() * .25; }
      mesh.scale.setScalar(innerWidth < 760 ? scale * 1.5 : scale); mesh.rotation.set(Math.random() * 6.28, Math.random() * 6.28, Math.random() * 6.28); mesh.frustumCulled = false;
      helixGroup.add(mesh);
      cells.push({ mesh, baseT: Math.random(), flow: 0.00010 + Math.random() * 0.00004, offAng: Math.random() * 6.28, offRad: Math.random() * 3.4, spin: new THREE.Vector3((Math.random() - .5) * .006, (Math.random() - .5) * .006, (Math.random() - .5) * .006) });
    }
    _T = new THREE.Vector3(); _N = new THREE.Vector3(); _B = new THREE.Vector3(); _off = new THREE.Vector3();
    UP_Y = new THREE.Vector3(0, 1, 0); UP_X = new THREE.Vector3(1, 0, 0);
  }
  function updateCells() {
    if (!cells.length) return;
    for (const c of cells) {
      let ct = (c.baseT + lastScroll * c.flow) % 1; if (ct < 0) ct += 1;
      const p = helixPath.getPoint(ct); _T.copy(helixPath.getTangent(ct));
      const up = Math.abs(_T.y) < 0.95 ? UP_Y : UP_X;
      _N.crossVectors(up, _T).normalize(); _B.crossVectors(_T, _N).normalize();
      const taper = 0.65 + 0.55 * ct, r = c.offRad * taper;
      _off.copy(_N).multiplyScalar(Math.cos(c.offAng) * r).addScaledVector(_B, Math.sin(c.offAng) * r);
      c.mesh.position.copy(p).add(_off);
      c.mesh.rotation.x += c.spin.x; c.mesh.rotation.y += c.spin.y; c.mesh.rotation.z += c.spin.z;
      c.mesh.material.opacity = fadeCell(ct);
    }
  }

  function render(scroll) {
    if (!ready) return;
    lastScroll = scroll;
    updateCells();
    for (const it of items) {
      const u = it.userData;
      it.rotation.y = u.rx0 + scroll * u.rxs;   // object moves only with scroll
    }
    composer.render();
    if (REDUCE) paintFg(performance.now());
  }

  window.KPFX = { init, resize, render, setScene };
})();
