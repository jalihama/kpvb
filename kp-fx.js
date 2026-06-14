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
    { url: "models/ribbon-rainbow.glb", n: 2, size: 8 },
  ];
  /* cohesive cool tints so the specimens suit the theme + glow */
  const TINTS = ["#27c4e6", "#34c7c0", "#3f8fd0", "#57cfe8", "#2aa6c6", "#6a8fe0"];
  const rand = (a, b) => a + Math.random() * (b - a);

  let renderer, scene, camera, composer, bokeh, fxaa, ready = false;
  let items = [], parts = [], lastScroll = 0, glcanvas;
  const SPAN = 15;                       // vertical world-wrap span

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
    renderer = new THREE.WebGLRenderer({ canvas: glcanvas, antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.6));
    renderer.setSize(innerWidth, innerHeight);
    if ("outputEncoding" in renderer) renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.92;

    scene = new THREE.Scene();
    const bg = bgColor();
    scene.background = bg;
    scene.fog = new THREE.Fog(bg, 11, 36);
    /* environment map so metallic glTF materials are lit (no more black) */
    try {
      const pmrem = new THREE.PMREMGenerator(renderer);
      scene.environment = pmrem.fromScene(new THREE.RoomEnvironment(), 0.04).texture;
    } catch (e) { console.warn("env map unavailable", e); }

    camera = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, 0.1, 120);
    camera.position.set(0, 0, 14);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x3a4a55, 0.55));
    const d1 = new THREE.DirectionalLight(0xffffff, 0.5); d1.position.set(6, 9, 8); scene.add(d1);
    const d2 = new THREE.DirectionalLight(0x9fd0ff, 0.22); d2.position.set(-7, -3, 4); scene.add(d2);

    /* glowing sprite particles (also get DoF) */
    const tex = particleTexture();
    const pcount = Math.round(Math.min(40, innerWidth / 30));
    for (let i = 0; i < pcount; i++) {
      const mat = new THREE.SpriteMaterial({ map: tex, color: new THREE.Color(PCOL[i % PCOL.length]), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, opacity: rand(0.25, 0.7) });
      const sp = new THREE.Sprite(mat);
      const s = rand(0.12, 0.6); sp.scale.set(s, s, s);
      sp.userData = { baseX: rand(-11, 11), baseY: rand(-7.5, 7.5), baseZ: rand(-7, 3), par: rand(0.2, 1.1), ph: rand(0, 6.28) };
      sp.position.set(sp.userData.baseX, sp.userData.baseY, sp.userData.baseZ);
      scene.add(sp); parts.push(sp);
    }

    /* post-processing: render + bokeh DoF */
    composer = new THREE.EffectComposer(renderer);
    composer.addPass(new THREE.RenderPass(scene, camera));
    bokeh = new THREE.BokehPass(scene, camera, { focus: 14.0, aperture: 0.009, maxblur: 0.08, width: innerWidth, height: innerHeight });
    composer.addPass(bokeh);
    /* FXAA — EffectComposer bypasses the renderer's MSAA, so antialias the composed image */
    fxaa = new THREE.ShaderPass(THREE.FXAAShader);
    composer.addPass(fxaa);
    composer.setSize(innerWidth, innerHeight);
    setFxaaRes();

    ready = true;
    loadModels();
    render(lastScroll);
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
      const u = {
        baseX: rand(-7.5, 7.5), baseY: rand(-7, 7), baseZ: rand(-16, 2),
        par: rand(0.35, 1.15), ph: rand(0, 6.28), ph2: rand(0, 6.28),
        rx0: rand(0, 6.28), ry0: rand(0, 6.28), rxs: rand(-0.0004, 0.0004), rys: rand(-0.0009, 0.0009) || 0.0005,
        zAmp: rand(1.8, 4.0),
      };
      inst.userData = u;
      inst.position.set(u.baseX, u.baseY, u.baseZ);
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

  function setTheme() {
    if (!ready) return;
    const bg = bgColor();
    scene.background = bg; scene.fog.color = bg;
    render(lastScroll);
  }

  function setFxaaRes() {
    if (!fxaa) return;
    const pr = renderer.getPixelRatio();
    fxaa.material.uniforms.resolution.value.set(1 / (innerWidth * pr), 1 / (innerHeight * pr));
  }

  function resize() {
    if (!ready) return;
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.6));
    renderer.setSize(innerWidth, innerHeight);
    camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
    composer.setSize(innerWidth, innerHeight);
    setFxaaRes();
    render(lastScroll);
  }

  function render(scroll) {
    if (!ready) return;
    lastScroll = scroll;
    const wp = 0.011;
    for (const it of items) {
      const u = it.userData;
      let y = u.baseY - scroll * wp * u.par;
      y = ((y + SPAN / 2) % SPAN + SPAN) % SPAN - SPAN / 2;
      it.position.y = y;
      it.position.z = u.baseZ + Math.sin(scroll * 0.0009 + u.ph) * u.zAmp;
      it.position.x = u.baseX + Math.sin(scroll * 0.0006 + u.ph2) * 0.7;
      it.rotation.y = u.ry0 + scroll * u.rys;
      it.rotation.x = u.rx0 + scroll * u.rxs;
    }
    for (const p of parts) {
      const u = p.userData;
      let y = u.baseY - scroll * wp * u.par;
      y = ((y + SPAN / 2) % SPAN + SPAN) % SPAN - SPAN / 2;
      p.position.y = y;
      p.position.z = u.baseZ + Math.sin(scroll * 0.0011 + u.ph) * 1.3;
    }
    composer.render();
  }

  window.KPFX = { init, resize, render, setTheme };
})();
