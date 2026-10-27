/* Shared behavior: header, footer, rendering, animations. No editing needed. */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const page = document.body.dataset.page;
  const fmt = d => new Date(d + "T00:00:00").toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  const sorted = [...POSTS].sort((a, b) => b.date.localeCompare(a.date));

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
      <p>© ${new Date().getFullYear()} ${SITE.name}. All rights reserved.</p>
      <ul><li><a href="${SITE.github}" target="_blank" rel="noopener">GitHub</a></li>
      <li><a href="${SITE.linkedin}" target="_blank" rel="noopener">LinkedIn</a></li>
      <li><a href="mailto:${SITE.email}">Email</a></li></ul>
    </div>`;

  /* Templates */
  const projectCard = p => `
    <article class="card project reveal">
      <a href="${p.link}" class="project-media" style="--hue:${p.hue}">
        ${p.image ? `<img src="${p.image}" alt="${p.title}" loading="lazy">` : `<span aria-hidden="true">${p.title.charAt(0)}</span>`}
      </a>
      <div class="card-body"><p class="meta">${p.category} · ${p.year}</p><h3>${p.title}</h3><p>${p.description}</p></div>
    </article>`;
  const postCard = p => `
    <article class="card post-card reveal">
      <a href="post.html?slug=${p.slug}" class="card-body">
        <p class="meta"><time datetime="${p.date}">${fmt(p.date)}</time> · ${p.tags.join(", ")}</p>
        <h3>${p.title}</h3><p>${p.excerpt}</p><span class="read-more">Read post →</span>
      </a>
    </article>`;

  /* Page rendering */
  document.querySelectorAll("[data-site]").forEach(el => el.textContent = SITE[el.dataset.site]);
  if (page === "home") {
    $("#featured-projects").innerHTML = PROJECTS.slice(0, 3).map(projectCard).join("");
    $("#latest-posts").innerHTML = sorted.slice(0, 3).map(postCard).join("");
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
  if (page === "blog") $("#post-list").innerHTML = sorted.map(postCard).join("");
  if (page === "post") {
    const slug = new URLSearchParams(location.search).get("slug") || sorted[0].slug;
    const p = POSTS.find(x => x.slug === slug);
    const el = $("#post");
    if (!p) { el.innerHTML = `<h1>Post not found</h1><p><a href="blog.html">← Back to the blog</a></p>`; }
    else {
      document.title = `${p.title} — ${SITE.name}`;
      el.innerHTML = `<a href="blog.html" class="back">← All posts</a>
        <p class="meta"><time datetime="${p.date}">${fmt(p.date)}</time> · ${p.tags.join(", ")}</p>
        <h1>${p.title}</h1><div class="prose">${p.body}</div>`;
    }
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
