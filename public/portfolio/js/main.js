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
      ${page === "blog" && p.image ? `<a href="${escapeHTML(p.link)}" target="_blank" rel="noopener" class="post-media" tabindex="-1" aria-hidden="true"><img src="${escapeHTML(p.image)}" alt="" loading="lazy" decoding="async"></a>` : ""}
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
    const initial = previous?.index || 0;
    previous?.cleanup();
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");
    root.className = "project-carousel";
    root.setAttribute("role", "region");
    root.setAttribute("aria-roledescription", "carousel");
    root.setAttribute("aria-label", t("Projects"));
    const arrow = direction => `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="${direction === "previous" ? "M15 5l-7 7 7 7" : "M9 5l7 7-7 7"}"/></svg>`;
    root.innerHTML = `<div class="carousel-track" tabindex="0" aria-label="${t("Projects")}">${projects.map(projectCard).join("")}</div>
      <div class="carousel-controls"><span class="carousel-count"></span><div class="carousel-arrows">
      <button class="btn btn-ghost carousel-button" data-action="previous" aria-label="${t("Previous project")}" title="${t("Previous project")}">${arrow("previous")}</button>
      <button class="btn btn-ghost carousel-button" data-action="next" aria-label="${t("Next project")}" title="${t("Next project")}">${arrow("next")}</button></div></div>`;
    const track = $(".carousel-track", root), cards = [...track.children];
    const controller = new AbortController(), options = { signal: controller.signal };
    let frame = 0, drag = null, suppressClick = false, suppressTimer = 0;
    let stops = [];
    const state = { index: initial, cleanup: () => {
      controller.abort(); cancelAnimationFrame(frame); clearTimeout(suppressTimer); resize.disconnect();
    } };
    carousels.set(root.id, state);
    cards.forEach(card => card.classList.add("visible"));
    function update() {
      if (!stops.length) return;
      const nearest = stops.reduce((best, stop, i) => Math.abs(stop - track.scrollLeft) < Math.abs(stops[best] - track.scrollLeft) ? i : best, 0);
      state.index = nearest;
      $('[data-action="previous"]', root).disabled = track.scrollLeft < 2;
      $('[data-action="next"]', root).disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
      const visible = cards.map((card, i) => ({ card, i })).filter(({card}) => card.offsetLeft + card.offsetWidth > track.scrollLeft + 8 && card.offsetLeft < track.scrollLeft + track.clientWidth - 8);
      const first = visible[0]?.i || 0, last = visible.at(-1)?.i || 0;
      $(".carousel-count", root).textContent = `${String(first + 1).padStart(2, "0")}–${String(last + 1).padStart(2, "0")} / ${String(cards.length).padStart(2, "0")}`;
    }
    function go(index) {
      if (!stops.length) return;
      state.index = Math.max(0, Math.min(index, stops.length - 1));
      track.scrollTo({ left: stops[state.index], behavior: reduced.matches ? "instant" : "smooth" });
    }
    root.addEventListener("click", event => {
      const button = event.target.closest("[data-action]");
      if (button) go(state.index + (button.dataset.action === "next" ? 1 : -1));
    }, options);
    track.addEventListener("keydown", event => {
      if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      go(event.key === "Home" ? 0 : event.key === "End" ? stops.length - 1 : state.index + (event.key === "ArrowRight" ? 1 : -1));
    }, options);
    track.addEventListener("dragstart", event => event.preventDefault(), options);
    track.addEventListener("pointerdown", event => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      drag = { id: event.pointerId, x: event.clientX, left: track.scrollLeft, moved: false };
      suppressClick = false;
    }, options);
    track.addEventListener("pointermove", event => {
      if (!drag || event.pointerId !== drag.id) return;
      const delta = event.clientX - drag.x;
      if (!drag.moved && Math.abs(delta) < 6) return;
      if (!drag.moved) {
        drag.moved = true;
        track.setPointerCapture(event.pointerId);
        track.classList.add("is-dragging");
      }
      event.preventDefault();
      track.scrollLeft = drag.left - delta;
    }, options);
    function endDrag(event) {
      if (!drag || event.pointerId !== drag.id) return;
      const moved = drag.moved;
      drag = null;
      track.classList.remove("is-dragging");
      if (track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId);
      if (moved) {
        suppressClick = true;
        clearTimeout(suppressTimer);
        suppressTimer = setTimeout(() => suppressClick = false, 150);
        update(); go(state.index);
      }
    }
    track.addEventListener("pointerup", endDrag, options);
    track.addEventListener("pointercancel", endDrag, options);
    track.addEventListener("lostpointercapture", endDrag, options);
    track.addEventListener("pointerleave", event => { if (drag && !drag.moved) endDrag(event); }, options);
    track.addEventListener("click", event => {
      if (suppressClick) { event.preventDefault(); event.stopPropagation(); }
    }, { ...options, capture: true });
    track.addEventListener("scroll", () => {
      cancelAnimationFrame(frame); frame = requestAnimationFrame(update);
    }, options);
    let measuredWidth = 0;
    const resize = new ResizeObserver(() => {
      if (track.clientWidth === measuredWidth) return;
      measuredWidth = track.clientWidth;
      const max = Math.max(0, track.scrollWidth - track.clientWidth);
      stops = [...new Set(cards.map(card => Math.min(card.offsetLeft, max)))];
      state.index = Math.min(state.index, stops.length - 1);
      track.scrollTo({ left: stops[state.index] || 0, behavior: "instant" });
      update();
    });
    resize.observe(track);
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
      valid.forEach(p => combined.set(p.link, { ...combined.get(p.link), ...p, image: p.image || combined.get(p.link)?.image || "" }));
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
        const strip = h => { const d = new DOMParser().parseFromString(h, "text/html"); return [...d.querySelectorAll("p")].map(x => x.textContent.trim()).find(x => x.length > 60) || ""; };
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
