/* Shared behavior: header, footer, rendering, animations. No editing needed. */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const page = document.body.dataset.page;
  const fmt = d => new Date(d + "T00:00:00").toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  let sorted = [...POSTS].sort((a, b) => b.date.localeCompare(a.date));

  /* Header */
  const links = [["index.html", "Home", "home"], ["projects.html", "Projects", "projects"], ["blog.html", "Blog", "blog"]];
  $("#site-header").innerHTML = `
    <div class="container nav">
      <a href="index.html" class="logo">${SITE.name}</a>
      <button class="menu-btn" aria-label="Open menu" aria-expanded="false"><span></span><span></span></button>
      <nav aria-label="Main"><ul>${links.map(([h, l, k]) => `<li><a href="${h}" ${k === page || (page === "post" && k === "blog") ? 'aria-current="page"' : ""}>${l}</a></li>`).join("")}
      <li><a class="btn btn-small" href="mailto:${SITE.email}">Contact</a></li></ul></nav>
    </div>`;
  const btn = $(".menu-btn");
  btn.addEventListener("click", () => {
    const open = document.body.classList.toggle("menu-open");
    btn.setAttribute("aria-expanded", open);
  });

  /* Footer */
  $("#site-footer").innerHTML = `
    <div class="container footer">
      <div><p class="footer-brand">${SITE.name}</p><p class="footer-tagline">Creativity for Quality Solutions</p></div>
      <ul><li><a href="${SITE.github}" target="_blank" rel="noopener">GitHub</a></li>
      <li><a href="${SITE.linkedin}" target="_blank" rel="noopener">LinkedIn</a></li>
      <li><a href="mailto:${SITE.email}">Email</a></li></ul>
    </div>`;

  /* Templates */
  const projectCard = p => `
    <article class="card project reveal">
      <a href="${p.link}" class="project-media">
        ${p.image ? `<img src="${p.image}" alt="${p.title}" loading="lazy">` : `<span aria-hidden="true">${p.title.charAt(0)}</span>`}
      </a>
      <div class="card-body"><p class="meta">${p.category} · ${p.year}</p><h3>${p.title}</h3><p>${p.description}</p></div>
    </article>`;
  const postCard = p => `
    <article class="card post-card reveal">
      <a href="${p.link}" target="_blank" rel="noopener" class="card-body">
        <p class="meta"><time datetime="${p.date}">${fmt(p.date)}</time> · ${p.tags.join(", ")}</p>
        <h3>${p.title}</h3><p>${p.excerpt}</p><span class="read-more">Read on Medium →</span>
      </a>
    </article>`;

  /* Page rendering */
  document.querySelectorAll("[data-site]").forEach(el => el.textContent = SITE[el.dataset.site]);
  if (page === "home") {
    $("#featured-projects").innerHTML = PROJECTS.slice(0, 3).map(projectCard).join("");
  }
  function drawPosts() {
    if ($("#latest-posts")) $("#latest-posts").innerHTML = sorted.slice(0, 3).map(postCard).join("");
    if ($("#post-list")) $("#post-list").innerHTML = sorted.map(postCard).join("");
    observe();
  }
  if (page === "projects") {
    const grid = $("#gallery"), filters = $("#filters");
    const cats = ["All", ...new Set(PROJECTS.map(p => p.category))];
    filters.innerHTML = cats.map((c, i) => `<button class="chip" aria-pressed="${i === 0}">${c}</button>`).join("");
    const draw = c => { grid.innerHTML = PROJECTS.filter(p => c === "All" || p.category === c).map(projectCard).join(""); observe(); };
    filters.addEventListener("click", e => {
      if (!e.target.matches(".chip")) return;
      filters.querySelectorAll(".chip").forEach(b => b.setAttribute("aria-pressed", b === e.target));
      draw(e.target.textContent);
    });
    draw("All");
  }
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
