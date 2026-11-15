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
      <li><a href="mailto:${SITE.email}">Email</a></li></ul>
    </div>`;

  }

  /* Templates */
  const projectCard = p => `
    <article class="card project reveal">
      <a href="${p.link}" class="project-media">
        ${p.image ? `<img src="${p.image}" alt="${t(p.title)}" loading="lazy">` : `<span aria-hidden="true">${p.title.charAt(0)}</span>`}
      </a>
      <div class="card-body"><p class="meta">${t(p.category)} · ${p.year}</p><h3>${t(p.title)}</h3><p>${t(p.description)}</p></div>
    </article>`;
  const postCard = original => { const p = localizedPost(original, language); return `
    <article class="card post-card reveal">
      <a href="${p.link}" target="_blank" rel="noopener" class="card-body">
        <p class="meta"><time datetime="${p.date}">${fmt(p.date)}</time> · ${p.tags.map(t).join(", ")}</p>
        <h3>${t(p.title)}</h3><p>${p.excerpt}</p><span class="read-more">${t("Read on Medium →")}</span>
      </a>
    </article>`; };

  /* Page rendering */
  const staticText = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (!node.parentElement.closest("script, [lang], [data-i18n-html]")) staticText.push([node, node.textContent]);
  }
  let selectedCategory = "All";
  function drawProjects() {
    const grid = $("#gallery"), filters = $("#filters");
    if (!grid || !filters) return;
    const cats = ["All", ...new Set(PROJECTS.map(p => p.category))];
    filters.setAttribute("aria-label", t("Filter by category"));
    filters.innerHTML = cats.map(c => `<button class="chip" data-category="${c}" aria-pressed="${c === selectedCategory}">${t(c)}</button>`).join("");
    grid.innerHTML = PROJECTS.filter(p => selectedCategory === "All" || p.category === selectedCategory).map(projectCard).join("");
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
    if ($("#featured-projects")) $("#featured-projects").innerHTML = PROJECTS.slice(0, 3).map(projectCard).join("");
    drawProjects(); drawPosts();
    const titles = { home: "Vivianne Melo — QA Engineer & AI SDET", projects: "Projects — Vivianne Melo", blog: "Blog — Vivianne Melo" };
    if (titles[page]) document.title = page === "home" ? `Vivianne Melo — ${t(SITE.role)}` : `${t(page === "projects" ? "Projects" : "Blog")} — Vivianne Melo`;
  }
  function drawPosts() {
    if ($("#latest-posts")) $("#latest-posts").innerHTML = sorted.slice(0, 3).map(postCard).join("");
    if ($("#post-list")) $("#post-list").innerHTML = sorted.map(postCard).join("");
    observe();
  }
  if (page === "projects") {
    $("#filters").addEventListener("click", e => {
      const chip = e.target.closest("[data-category]");
      if (!chip) return;
      selectedCategory = chip.dataset.category;
      drawProjects();
    });
  }
  setLanguage(language);
  window.addEventListener("storage", event => { if (event.key === "lang") setLanguage(event.newValue); });
  if (page === "post") location.replace("blog.html");
  /* Live Medium feed (falls back to the list in data.js) */
  if (page === "home" || page === "blog") {
    drawPosts();
    fetch("https://api.rss2json.com/v1/api.json?rss_url=" + encodeURIComponent("https://medium.com/feed/@" + MEDIUM_USER))
      .then(r => r.json()).then(d => {
        if (d.status !== "ok" || !d.items.length) return;
        const strip = h => { const t = document.createElement("div"); t.innerHTML = h; return [...t.querySelectorAll("p")].map(x => x.textContent.trim()).find(x => x.length > 60) || ""; };
        sorted = d.items.map(i => { const e = strip(i.content || i.description); return {
          title: i.title, date: i.pubDate.slice(0, 10), link: i.link.split("?")[0],
          tags: (i.categories || []).slice(0, 2).map(c => c.replace(/-/g, " ").replace(/\b\w/g, m => m.toUpperCase()).replace(/\bQa\b/g, "QA").replace(/\bAi\b/g, "AI")),
          excerpt: e.length > 160 ? e.slice(0, 160).replace(/\s\S*$/, "") + "…" : e }; });
        drawPosts();
      }).catch(() => {});
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
