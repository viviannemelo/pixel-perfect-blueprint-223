/* =========================================================
   CONTENT FILE — edit this file to add projects and posts.
   Everything marked [PLACEHOLDER] should be replaced.
   ========================================================= */

/* --- Your profile (CUSTOMIZE) --- */
const SITE = {
  name: "Vivianne Melo",
  role: "QA Engineer & AI SDET",
  intro: "I build solutions to improve quality assurance for products and processes.",
  email: "you@example.com",                  // [PLACEHOLDER]
  github: "https://github.com/your-username",// [PLACEHOLDER]
  linkedin: "https://linkedin.com/in/your-profile" // [PLACEHOLDER]
};

/* --- Visual projects ---
   To add a project, copy one object and change its values.
   "image" can be a path like "images/my-project.jpg" or left empty
   to show a colored gradient placeholder. */
const PROJECTS = [
  { title: "Project One [PLACEHOLDER]", category: "Web Design", year: 2026, image: "", hue: 190, description: "Short description of what this project is and what you did.", link: "#" },
  { title: "Project Two [PLACEHOLDER]", category: "Illustration", year: 2026, image: "", hue: 320, description: "Short description of what this project is and what you did.", link: "#" },
  { title: "Project Three [PLACEHOLDER]", category: "Data Viz", year: 2025, image: "", hue: 45, description: "Short description of what this project is and what you did.", link: "#" },
  { title: "Project Four [PLACEHOLDER]", category: "Web Design", year: 2025, image: "", hue: 140, description: "Short description of what this project is and what you did.", link: "#" },
  { title: "Project Five [PLACEHOLDER]", category: "Branding", year: 2025, image: "", hue: 260, description: "Short description of what this project is and what you did.", link: "#" },
  { title: "Project Six [PLACEHOLDER]", category: "Illustration", year: 2024, image: "", hue: 15, description: "Short description of what this project is and what you did.", link: "#" }
];

/* --- Blog posts ---
   To add a post: copy one object, give it a unique "slug"
   (lowercase, dashes, no spaces) and write the body in HTML.
   It will appear automatically on the blog list and open at
   post.html?slug=your-slug. Newest dates show first. */
const POSTS = [
  {
    slug: "hello-world",
    title: "Hello World: Why I Started This Blog [PLACEHOLDER]",
    date: "2026-10-27",
    tags: ["Personal"],
    excerpt: "A short summary of the post that appears on the blog list.",
    body: `
      <p>This is an example post. Replace this text with your own story.</p>
      <h2>A section title</h2>
      <p>Write paragraphs, lists and code examples using simple HTML.</p>
      <ul><li>First point</li><li>Second point</li></ul>
      <pre><code>// Example code block
function greet(name) {
  return \`Hello, \${name}!\`;
}</code></pre>
      <blockquote>A highlighted quote or key takeaway.</blockquote>
    `
  },
  {
    slug: "solving-a-tricky-bug",
    title: "How I Solved a Tricky Bug [PLACEHOLDER]",
    date: "2026-10-10",
    tags: ["Technical", "Debugging"],
    excerpt: "The problem, the investigation and the fix — explained step by step.",
    body: `<p>Describe the problem, what you tried, and what finally worked.</p>`
  },
  {
    slug: "my-design-process",
    title: "My Design Process, Explained Simply [PLACEHOLDER]",
    date: "2026-09-22",
    tags: ["Design"],
    excerpt: "From a blank page to a finished visual — how I approach a new project.",
    body: `<p>Explain your process in a way anyone can follow.</p>`
  }
];
