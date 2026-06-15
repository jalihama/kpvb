/* ============================================================
   KP-ATLAS · ENGINE  (shared across the exploration directions)
   Pure vanilla. No storage. Renders CATEGORIES + ITEMS into a
   collapsible System → Topic → Resource tree, with search,
   type filter, live counts, optional countdown and scroll-reveal.
   Mount with:  KPAtlas.mount({ root, indexRoot, searchInput,
                 typeBar, countEl, countdownEl, reveal:true })
   ============================================================ */
(function () {
  const TYPE_LABEL = { pdf:"PDF", html:"Seite", video:"Video", audio:"Audio", image:"Bild", link:"Link" };
  const TYPE_ORDER = ["all","pdf","html","video","audio","image","link"];
  const norm = (s) => (s || "").toString().toLowerCase()
    .replace(/ä/g,"a").replace(/ö/g,"o").replace(/ü/g,"u").replace(/ß/g,"ss")
    .normalize("NFD").replace(/[\u0300-\u036f]/g,"");
  const slug = (s) => norm(s).replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");

  function svgIcon(system) {
    const map = (typeof SYSTEM_ICONS !== "undefined") ? SYSTEM_ICONS : {};
    const inner = map[system] || map["Sonstiges"] || "";
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" '
      + 'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + inner + '</svg>';
  }

  /* ---- shape the data: only populated branches, in CATEGORIES order ---- */
  function buildModel() {
    const bySystem = new Map();
    const known = {};
    Object.keys(CATEGORIES).forEach(sys => { known[sys] = new Set(CATEGORIES[sys]); });

    ITEMS.forEach(it => {
      const system = CATEGORIES[it.system] ? it.system : "Sonstiges";
      let topic = it.topic || "Sonstiges";
      if (system === "Sonstiges") { /* keep topic */ }
      else if (!known[system].has(topic)) topic = "Sonstiges";
      if (!bySystem.has(system)) bySystem.set(system, new Map());
      const topics = bySystem.get(system);
      if (!topics.has(topic)) topics.set(topic, []);
      topics.get(topic).push(it);
    });

    const order = Object.keys(CATEGORIES).concat(["Sonstiges"]);
    const model = [];
    order.forEach(system => {
      if (!bySystem.has(system)) return;
      const topicsMap = bySystem.get(system);
      const topicOrder = (CATEGORIES[system] || []).slice();
      if (!topicOrder.includes("Sonstiges")) topicOrder.push("Sonstiges");
      const extra = [...topicsMap.keys()].filter(t => !topicOrder.includes(t));
      const finalTopics = topicOrder.concat(extra).filter(t => topicsMap.has(t));
      model.push({ system, topics: finalTopics.map(t => ({ topic: t, items: topicsMap.get(t) })) });
    });
    return model;
  }

  function el(tag, cls, html) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  function mount(opts) {
    const root = opts.root;
    const model = buildModel();
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let activeType = "all";
    let query = "";

    const sysNodes = [];
    const registry = {};
    let regIndex = 0;
    const VIEW_TYPES = new Set(["pdf", "html", "image"]);

    const sysColor = (i) => `oklch(0.7 0.14 ${(202 + i * 47) % 360})`;
    model.forEach((sys, si) => {
      const section = el("section", "sys");
      section.dataset.system = sys.system;
      section.style.setProperty("--sys-accent", sysColor(si));
      section.id = "sys-" + slug(sys.system);

      const head = el("button", "sys-head");
      head.type = "button";
      head.setAttribute("aria-expanded", "false");
      section.classList.add("collapsed");
      const bodyId = "body-" + slug(sys.system);
      head.setAttribute("aria-controls", bodyId);
      head.innerHTML =
        '<span class="sys-ic">' + svgIcon(sys.system) + '</span>'
      + '<span class="sys-name"></span>'
      + '<span class="sys-count" aria-hidden="true"></span>'
      + '<span class="sys-chev" aria-hidden="true"></span>';
      head.querySelector(".sys-name").textContent = sys.system;

      const body = el("div", "sys-body");
      body.id = bodyId;
      const bodyInner = el("div", "sys-body-inner");
      body.appendChild(bodyInner);

      const topicNodes = [];
      sys.topics.forEach(tp => {
        const topic = el("div", "topic");
        topic.dataset.topic = tp.topic;
        const th = el("button", "topic-head");
        th.type = "button";
        th.setAttribute("aria-expanded", "false");
        topic.classList.add("collapsed");
        th.innerHTML =
          '<span class="topic-dot" aria-hidden="true"></span>'
        + '<span class="topic-name"></span>'
        + '<span class="topic-count" aria-hidden="true"></span>'
        + '<span class="topic-chev" aria-hidden="true"></span>';
        th.querySelector(".topic-name").textContent = tp.topic;

        const list = el("ul", "items");
        const itemNodes = [];
        tp.items.forEach(it => {
          const li = el("li", "item");
          li.dataset.type = it.type;
          let id = slug(sys.system + "-" + tp.topic + "-" + it.title) || ("r" + regIndex);
          if (registry[id]) id += "-" + regIndex;
          it._id = id; registry[id] = it; regIndex++;
          const a = el("a");
          a.href = it.file || "#";
          a.target = "_blank";
          a.rel = "noopener noreferrer";
          a.dataset.rid = id;
          a.innerHTML =
            '<span class="item-type" data-t="' + it.type + '">' + (TYPE_LABEL[it.type] || "Link") + '</span>'
          + '<span class="item-title"></span>'
          + (it.size ? '<span class="item-size"></span>' : '')
          + '<span class="item-open">Öffnen<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17 17 7M9 7h8v8"/></svg></span>';
          a.querySelector(".item-title").textContent = it.title;
          if (it.size) a.querySelector(".item-size").textContent = it.size;
          if (VIEW_TYPES.has(it.type) && typeof opts.onOpen === "function") {
            a.addEventListener("click", (e) => {
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;
              e.preventDefault(); opts.onOpen(it);
            });
          }
          li.appendChild(a);
          list.appendChild(li);
          itemNodes.push({ li, it, hay: norm(it.title + " " + tp.topic + " " + sys.system) });
        });

        th.addEventListener("click", () => toggle(topic, th));
        const tbody = el("div", "topic-body");
        tbody.appendChild(list);
        topic.appendChild(th);
        topic.appendChild(tbody);
        bodyInner.appendChild(topic);
        topicNodes.push({ wrap: topic, head: th, countEl: th.querySelector(".topic-count"), items: itemNodes });
      });

      head.addEventListener("click", () => {
        const willOpen = section.classList.contains("collapsed");
        toggle(section, head);
        const minimal = document.documentElement.hasAttribute("data-min");
        sysNodes.forEach(o => o.wrap.classList.toggle("hl", o.wrap === section && (willOpen || minimal)));
      });
      section.appendChild(head);
      section.appendChild(body);
      root.appendChild(section);
      sysNodes.push({ wrap: section, head, countEl: head.querySelector(".sys-count"), topics: topicNodes, color: sysColor(si) });
    });

    function toggle(wrap, btn) {
      const isCollapsed = wrap.classList.toggle("collapsed");
      btn.setAttribute("aria-expanded", String(!isCollapsed));
    }

    /* ---- system index (jump links / drawer) ---- */
    if (opts.indexRoot) {
      sysNodes.forEach(sn => {
        const a = el("a", "ix-link");
        a.href = "#" + sn.wrap.id;
        a.style.setProperty("--sys-accent", sn.color);
        a.innerHTML = '<span class="ix-ic">' + svgIcon(sn.wrap.dataset.system) + '</span><span class="ix-name"></span><span class="ix-count" aria-hidden="true"></span>';
        a.querySelector(".ix-name").textContent = sn.wrap.dataset.system;
        a.addEventListener("click", (e) => {
          e.preventDefault();
          const docEl = document.documentElement;
          docEl.classList.add("kp-noanim");
          sysNodes.forEach(o => {
            const on = o === sn;
            o.wrap.classList.toggle("collapsed", !on);
            o.head.setAttribute("aria-expanded", String(on));
            o.wrap.classList.toggle("hl", on);
          });
          void sn.wrap.offsetHeight;                       // force layout to settle
          const y = sn.wrap.getBoundingClientRect().top + window.scrollY - 84;
          requestAnimationFrame(() => docEl.classList.remove("kp-noanim"));
          window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
          if (opts.onIndexClick) opts.onIndexClick();
        });
        sn.ixLink = a;
        opts.indexRoot.appendChild(a);
      });
    }

    /* ---- filtering ---- */
    function apply() {
      const q = norm(query.trim());
      let total = 0;
      sysNodes.forEach(sn => {
        let sysCount = 0;
        sn.topics.forEach(tn => {
          let tCount = 0;
          tn.items.forEach(node => {
            const okType = activeType === "all" || node.it.type === activeType;
            const okQuery = !q || node.hay.indexOf(q) !== -1;
            const show = okType && okQuery;
            node.li.hidden = !show;
            if (show) tCount++;
          });
          tn.countEl.textContent = tCount;
          tn.wrap.hidden = tCount === 0;
          if (q && tCount > 0) { tn.wrap.classList.remove("collapsed"); tn.head.setAttribute("aria-expanded","true"); }
          sysCount += tCount;
        });
        sn.countEl.textContent = sysCount;
        sn.wrap.hidden = sysCount === 0;
        if (q && sysCount > 0) { sn.wrap.classList.remove("collapsed"); sn.head.setAttribute("aria-expanded","true"); }
        if (sn.ixLink) {
          sn.ixLink.hidden = sysCount === 0;
          sn.ixLink.querySelector(".ix-count").textContent = sysCount;
        }
        total += sysCount;
      });
      if (opts.countEl) opts.countEl.textContent = total;
      if (opts.emptyEl) opts.emptyEl.hidden = total !== 0;
    }

    /* ---- wire controls ---- */
    if (opts.searchInput) {
      opts.searchInput.addEventListener("input", (e) => { query = e.target.value; apply(); });
    }
    if (opts.typeBar) {
      TYPE_ORDER.forEach(t => {
        const b = el("button", "type-btn" + (t === "all" ? " is-active" : ""));
        b.type = "button";
        b.dataset.type = t;
        b.textContent = t === "all" ? "Alle" : TYPE_LABEL[t];
        b.addEventListener("click", () => {
          activeType = t;
          opts.typeBar.querySelectorAll(".type-btn").forEach(x => x.classList.toggle("is-active", x === b));
          apply();
        });
        opts.typeBar.appendChild(b);
      });
    }
    if (opts.collapseAllBtn) {
      opts.collapseAllBtn.addEventListener("click", () => {
        const anyOpen = sysNodes.some(sn => !sn.wrap.classList.contains("collapsed") && !sn.wrap.hidden);
        sysNodes.forEach(sn => {
          sn.wrap.classList.toggle("collapsed", anyOpen);
          sn.head.setAttribute("aria-expanded", String(!anyOpen));
        });
        const _lbl = opts.collapseAllBtn.querySelector("[data-collapse-label]") || opts.collapseAllBtn;
        _lbl.textContent = anyOpen ? "Alle ausklappen" : "Alle einklappen";
      });
    }

    /* ---- countdown ---- */
    if (opts.countdownEl) {
      const d = (typeof EXAM_DATE === "string") ? EXAM_DATE.trim() : "";
      const target = d ? new Date(d + "T00:00:00") : null;
      if (target && !isNaN(target) && target > new Date()) {
        const tick = () => {
          const days = Math.ceil((target - new Date()) / 86400000);
          if (days <= 0) { opts.countdownEl.hidden = true; return; }
          opts.countdownEl.hidden = false;
          const n = opts.countdownEl.querySelector("[data-n]") || opts.countdownEl;
          n.textContent = days;
        };
        tick();
        setInterval(tick, 60000);
      } else {
        opts.countdownEl.hidden = true;
      }
    }

    /* ---- scroll reveal ---- */
    if (opts.reveal && !reduce && "IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
      }, { rootMargin: "0px 0px -12% 0px", threshold: 0.08 });
      sysNodes.forEach(sn => io.observe(sn.wrap));
    } else {
      sysNodes.forEach(sn => sn.wrap.classList.add("in"));
    }

    apply();
    return { sysNodes, apply, registry };
  }

  window.KPAtlas = { mount };
})();
