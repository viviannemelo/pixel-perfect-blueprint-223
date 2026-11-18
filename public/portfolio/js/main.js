/* Shared behavior: header, footer, rendering, animations. No editing needed. */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const page = document.body.dataset.page;
  const { normalize, text, post: localizedPost } = window.PortfolioLanguage;
  let language = "en";
  try { language = normalize(localStorage.getItem("lang")); } catch (_) {}
  const t = value => text(value, language);
  const fmt = d => new Date(d + "T00:00:00").toLocaleDateString(language === "pt" ? "pt-BR" : "en-US", { year: "numeric", month: "short", day: "numeric" });
  let sorted = [...POSTS].sort((a, b) => b.date.localeCompare(a.date));

  /* Header */
  function drawHeader() {
  const links = [["index.html", "Home", "home"], ["projects.html", "Projects", "projects"], ["blog.html", "Blog", "blog"]];
  $("#site-header").innerHTML = `
    <div class="container nav">
      <a href="index.html" class="logo">${SITE.name}</a>
      <button class="menu-btn" aria-label="${t("Open menu")}" aria-expanded="false"><span></span><span></span></button>
      <nav aria-label="${t("Main")}"><ul>${links.map(([h, l, k]) => `<li><a href="${h}" ${k === page || (page === "post" && k === "blog") || (page === "project" && k === "projects") ? 'aria-current="page"' : ""}>${t(l)}</a></li>`).join("")}
      <li><a class="btn btn-small" href="mailto:${SITE.email}">${t("Contact")}</a></li></ul></nav>
      <div class="lang-switch" role="group" aria-label="Language / Idioma"><button type="button" data-set-lang="en" aria-label="English" aria-pressed="${language === "en"}">EN</button><button type="button" data-set-lang="pt" aria-label="Português" aria-pressed="${language === "pt"}">PT</button></div>
    </div>`;
  const btn = $(".menu-btn");
  const menuOpen = document.body.classList.contains("menu-open");
  btn.setAttribute("aria-expanded", menuOpen);
  btn.setAttribute("aria-label", t(menuOpen ? "Close menu" : "Open menu"));
  btn.addEventListener("click", () => {
    const open = document.body.classList.toggle("menu-open");
    btn.setAttribute("aria-expanded", open);
    btn.setAttribute("aria-label", t(open ? "Close menu" : "Open menu"));
  });

  document.querySelectorAll("[data-set-lang]").forEach(button => button.addEventListener("click", () => setLanguage(button.dataset.setLang)));
  }

  /* Footer */
  function drawFooter() {
  $("#site-footer").innerHTML = `
    <div class="container footer">
      <div><p class="footer-brand">${SITE.name}</p><p class="footer-tagline">${t("Creativity for Quality Solutions")}</p></div>
      <ul><li><a href="${SITE.github}" target="_blank" rel="noopener">GitHub</a></li>
      <li><a href="${SITE.linkedin}" target="_blank" rel="noopener">LinkedIn</a></li>
      <li><a href="mailto:${SITE.email}">Email</a></li>
      ${SITE.resume ? `<li><a href="${SITE.resume}" download>${t("Download résumé")}</a></li>` : ""}</ul>
    </div>`;

  }

  /* Templates */
  const escapeHTML = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
  const projectCard = p => `
    <article class="card project reveal">
      <a href="${p.link}" class="project-media">
        ${p.image ? `<img src="${p.image}" alt="${t(p.title)}" loading="lazy">` : `<span aria-hidden="true">${p.title.charAt(0)}</span>`}
      </a>
      <a href="${p.link}" class="card-body"><p class="meta">${t(p.category)} · ${p.year}</p><h3>${t(p.title)}</h3><p>${t(p.description)}</p></a>
    </article>`;
  const postCard = original => { const p = localizedPost(original, language); return `
    <article class="card post-card reveal">
      <a href="${escapeHTML(p.link)}" target="_blank" rel="noopener" class="card-body">
        <p class="meta"><time datetime="${escapeHTML(p.date)}">${fmt(p.date)}</time> · ${p.tags.map(tag => escapeHTML(t(tag))).join(", ")}</p>
        <h3>${escapeHTML(t(p.title))}</h3><p>${escapeHTML(p.excerpt)}</p><span class="read-more">${t("Read on Medium →")}</span>
      </a>
    </article>`; };

  /* Page rendering */
  const staticText = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const languageBlock = node.parentElement.closest("[lang]");
    if (!node.parentElement.closest("script, [data-i18n-html]") && (!languageBlock || languageBlock === document.documentElement)) staticText.push([node, node.textContent]);
  }
  const carousels = new Map();
  function drawCarousel(root, projects) {
    const previous = carousels.get(root.id);
    const initial = Math.min(previous?.index || 0, Math.max(0, projects.length - 1));
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    let playing = previous ? previous.playing && !reduced.matches : !reduced.matches && projects.length > 1;
    previous?.cleanup();
    root.className = "project-carousel";
    root.setAttribute("role", "region");
    root.setAttribute("aria-roledescription", "carousel");
    root.setAttribute("aria-label", t("Projects"));
    const arrow = direction => `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="${direction === "previous" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}"/></svg>`;
    root.innerHTML = `<div class="carousel-track" tabindex="0" aria-label="${t("Projects")}">${projects.map(projectCard).join("")}</div>
      <div class="carousel-controls"><div class="carousel-progress" aria-hidden="true"><span></span></div><div class="carousel-dots">${projects.map((p, i) => `<button class="carousel-dot" data-slide="${i}" aria-label="${t("Go to project")}: ${t(p.title)}" title="${t(p.title)}"></button>`).join("")}</div>
      <span class="carousel-count"></span><div class="carousel-arrows">
      <button class="btn btn-ghost carousel-button" data-action="previous" aria-label="${t("Previous project")}" title="${t("Previous project")}">${arrow("previous")}</button>
      <button class="btn btn-ghost carousel-button" data-action="play" aria-label="${t("Pause carousel")}" title="${t("Pause carousel")}"></button>
      <button class="btn btn-ghost carousel-button" data-action="next" aria-label="${t("Next project")}" title="${t("Next project")}">${arrow("next")}</button></div></div>`;
    const track = $(".carousel-track", root), cards = [...track.children];
    const controller = new AbortController(), options = { signal: controller.signal };
    let hovered = false, visible = false, frame = 0, clock = 0, elapsed = 0, lastTime = 0, direction = 1, settlingUntil = 0;
    const duration = 6500;
    const progress = $(".carousel-progress span", root);
    const state = { index: initial, playing, cleanup: () => { controller.abort(); cancelAnimationFrame(frame); cancelAnimationFrame(clock); observer.disconnect(); resize.disconnect(); } };
    carousels.set(root.id, state);
    cards.forEach(card => card.classList.add("visible"));
    function update() {
      state.playing = playing;
      cards.forEach((card, i) => card.classList.toggle("is-active", i === state.index));
      root.querySelectorAll("[data-slide]").forEach((dot, i) => dot.setAttribute("aria-current", i === state.index ? "true" : "false"));
      $(".carousel-count", root).textContent = `${String(state.index + 1).padStart(2, "0")} / ${String(projects.length).padStart(2, "0")}`;
      const play = $('[data-action="play"]', root);
      play.setAttribute("aria-pressed", String(playing));
      play.setAttribute("aria-label", t(playing ? "Pause carousel" : "Play carousel"));
      play.title = t(playing ? "Pause carousel" : "Play carousel");
      play.innerHTML = playing ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 5h3v14H7zM14 5h3v14h-3z"/></svg>' : '<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>';
      root.querySelectorAll("[data-action]").forEach(button => button.disabled = projects.length < 2);
    }
    function go(index, manual = false) {
      if (!cards.length) return;
      if (manual) playing = false;
      const wrapping = index < 0 || index >= cards.length;
      state.index = (index + cards.length) % cards.length;
      elapsed = 0;
      settlingUntil = performance.now() + 800;
      track.scrollTo({ left: cards[state.index].offsetLeft, behavior: reduced.matches || wrapping ? "instant" : "smooth" });
      update();
    }
    root.addEventListener("click", event => {
      const button = event.target.closest("button");
      if (!button) return;
      if (button.dataset.slide !== undefined) go(Number(button.dataset.slide), true);
      if (button.dataset.action === "previous") go(state.index - 1, true);
      if (button.dataset.action === "next") go(state.index + 1, true);
      if (button.dataset.action === "play") { playing = !playing; elapsed = 0; update(); }
    }, options);
    track.addEventListener("keydown", event => {
      if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      go(event.key === "Home" ? 0 : event.key === "End" ? cards.length - 1 : state.index + (event.key === "ArrowRight" ? 1 : -1), true);
    }, options);
    track.addEventListener("pointerdown", () => { playing = false; update(); }, options);
    track.addEventListener("wheel", () => { playing = false; update(); }, options);
    track.addEventListener("scroll", () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const distances = cards.map(card => Math.abs(card.offsetLeft - track.scrollLeft));
        const nearest = distances.indexOf(Math.min(...distances));
        if (nearest !== state.index) { state.index = nearest; elapsed = 0; update(); }
      });
    }, options);
    root.addEventListener("mouseenter", () => hovered = true, options);
    root.addEventListener("mouseleave", () => hovered = false, options);
    const observer = new IntersectionObserver(entries => visible = entries[0].isIntersecting && entries[0].intersectionRatio >= .35, { threshold: [0, .35] });
    observer.observe(root);
    const resize = new ResizeObserver(() => {
      if (!cards.length) return;
      const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      track.style.setProperty("--tail-space", `${Math.max(0, track.clientWidth - cards[0].offsetWidth - gap)}px`);
      track.scrollTo({ left: cards[state.index].offsetLeft, behavior: "instant" });
    });
    resize.observe(track);
    reduced.addEventListener("change", () => { if (reduced.matches) { playing = false; elapsed = 0; update(); } }, options);
    function tick(now) {
      const active = playing && visible && !hovered && !document.hidden && !track.contains(document.activeElement) && now >= settlingUntil;
      if (active && lastTime) elapsed += Math.min(now - lastTime, 100);
      lastTime = now;
      progress.style.transform = `scaleX(${elapsed / duration})`;
      root.dataset.running = String(active);
      if (elapsed >= duration) {
        if (state.index === cards.length - 1) direction = -1;
        if (state.index === 0) direction = 1;
        go(state.index + direction);
      }
      clock = requestAnimationFrame(tick);
    }
    clock = requestAnimationFrame(tick);
    update();
    frame = requestAnimationFrame(() => track.scrollTo({ left: cards[initial]?.offsetLeft || 0, behavior: "instant" }));
  }
  function drawProjects() {
    const grid = $("#gallery");
    if (!grid) return;
    grid.className = "grid project-grid";
    grid.innerHTML = PROJECTS.map(projectCard).join("");
    observe();
  }
  function setLanguage(value) {
    language = normalize(value);
    try { localStorage.setItem("lang", language); } catch (_) {}
    document.documentElement.lang = language;
    staticText.forEach(([node, original]) => {
      const trimmed = original.trim();
      node.textContent = trimmed ? original.replace(trimmed, t(trimmed)) : original;
    });
    document.querySelectorAll("[data-i18n-html]").forEach(el => el.innerHTML = t(el.dataset.i18nHtml));
    document.querySelectorAll("[data-site]").forEach(el => el.textContent = t(SITE[el.dataset.site]));
    drawHeader(); drawFooter();
    if ($("#featured-projects")) drawCarousel($("#featured-projects"), PROJECTS);
    drawProjects(); drawPosts();
    const titles = { home: "Vivianne Melo — QA Engineer & AI SDET", projects: "Projects — Vivianne Melo", blog: "Blog — Vivianne Melo" };
    if (titles[page]) document.title = page === "home" ? `Vivianne Melo — ${t(SITE.role)}` : `${t(page === "projects" ? "Projects" : "Blog")} — Vivianne Melo`;
  }
  function drawPosts() {
    if ($("#latest-posts")) $("#latest-posts").innerHTML = sorted.slice(0, 3).map(postCard).join("");
    if ($("#post-list")) $("#post-list").innerHTML = sorted.map(postCard).join("");
    observe();
  }
  setLanguage(language);
  window.addEventListener("storage", event => { if (event.key === "lang") setLanguage(event.newValue); });
  if (page === "post") location.replace("blog.html");
  /* Live Medium feed plus a scheduled static snapshot for GitHub Pages. */
  if (page === "home" || page === "blog") {
    let refreshing = false;
    function applyPosts(posts) {
      const valid = posts.filter(p => typeof p.title === "string" && /^https:\/\/medium\.com\//.test(p.link) && /^\d{4}-\d{2}-\d{2}$/.test(p.date) && Array.isArray(p.tags) && typeof p.excerpt === "string");
      if (!valid.length) return;
      const combined = new Map(sorted.map(p => [p.link, p]));
      valid.forEach(p => combined.set(p.link, p));
      sorted = [...combined.values()].sort((a, b) => b.date.localeCompare(a.date));
      drawPosts();
    }
    async function refreshPosts() {
      if (refreshing || document.hidden) return;
      refreshing = true;
      try {
        await fetch("medium-posts.json", { cache: "no-store", signal: AbortSignal.timeout(15000) })
          .then(r => r.ok ? r.json() : null).then(d => { if (Array.isArray(d?.posts)) applyPosts(d.posts); }).catch(() => {});
        await fetch("https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent("https://medium.com/feed/@" + MEDIUM_USER), { cache: "no-store", signal: AbortSignal.timeout(15000) })
      .then(r => r.json()).then(d => {
        if (d.status !== "ok" || !Array.isArray(d.items) || !d.items.length) return;
        const strip = h => { const t = document.createElement("div"); t.innerHTML = h; return [...t.querySelectorAll("p")].map(x => x.textContent.trim()).find(x => x.length > 60) || ""; };
        applyPosts(d.items.map(i => { const e = strip(i.content || i.description); return {
          title: i.title, date: i.pubDate.slice(0, 10), link: i.link.split("?")[0],
          tags: (i.categories || []).slice(0, 2).map(c => c.replace(/-/g, " ").replace(/\b\w/g, m => m.toUpperCase()).replace(/\bQa\b/g, "QA").replace(/\bAi\b/g, "AI")),
          excerpt: e.length > 160 ? e.slice(0, 160).replace(/\s\S*$/, "") + "…" : e }; }));
      }).catch(() => {});
      } finally { refreshing = false; }
    }
    refreshPosts();
    setInterval(refreshPosts, 5 * 60 * 1000);
    document.addEventListener("visibilitychange", () => { if (!document.hidden) refreshPosts(); });
    window.addEventListener("focus", refreshPosts);
  }

  /* Scroll reveal (skipped automatically if user prefers reduced motion) */
  function observe() {
    const items = document.querySelectorAll(".reveal:not(.visible)");
    if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items.forEach(i => i.classList.add("visible")); return;
    }
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("visible"); io.unobserve(e.target); } }), { threshold: 0.12 });
    items.forEach((i, n) => { i.style.transitionDelay = (n % 3) * 80 + "ms"; io.observe(i); });
  }
  observe();
})();
