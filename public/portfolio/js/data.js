/* =========================================================
   CONTENT FILE — edit this file to add projects and posts.
   Everything marked [PLACEHOLDER] should be replaced.
   ========================================================= */

/* --- Your profile (CUSTOMIZE) --- */
const SITE = {
  name: "Vivianne Melo",
  role: "QA Engineer & AI SDET",
  intro: "I build solutions to improve quality assurance for products and processes.",
  email: "viviannemmelo@gmail.com",
  github: "https://github.com/your-username",// [PLACEHOLDER]
  linkedin: "https://linkedin.com/in/viviannemelo",
  resume: null // Add the uploaded résumé URL when the file is supplied.
};

/* --- Visual projects ---
   To add a project, copy one object and change its values.
   "image" can be a path like "images/my-project.jpg" or left empty
   to show a colored gradient placeholder. */
const PROJECTS = [
  { title: "Support Bot", category: "AI Engineering", year: 2026, image: "/__l5e/assets-v1/167fe5aa-cd75-44b7-afe3-1addb320d6e2/support-draft-bot-cover.jpg", hue: 190, description: "An AI bot that researches every support ticket and drafts a reply for the team to review.", link: "support-bot.html" },
  { title: "Feature Validator", category: "AI Engineering", year: 2026, image: "/__l5e/assets-v1/cdac723b-7bdb-4008-8ce8-24966f02fe91/feature-validator-cover.jpg", hue: 15, description: "From one Jira task to a published QA report: the AI investigates, writes requirements, plans tests and executes them with Playwright.", link: "feature-validator.html" },
  { title: "Test Generator", category: "AI Engineering", year: 2026, image: "/__l5e/assets-v1/387484d2-b630-43ac-b3f7-5de96ddb5df7/test-generator-cover.jpg", hue: 15, description: "A Jira ticket becomes a complete test plan, evidence-backed results and an automated regression pack.", link: "test-generator.html" },
  { title: "Pre-release Smoketest", category: "AI Engineering", year: 2026, image: "/__l5e/assets-v1/404653cd-5384-4e9b-95d6-cf1d6e62fb0c/pre-release-smoketest-cover.jpg", hue: 15, description: "A release gate that tests every change before deploy and says whether the release can proceed.", link: "pre-release-smoketest.html" },
  { title: "Customer Articles every Release", category: "AI Engineering", year: 2026, image: "/__l5e/assets-v1/6c000216-6edd-46af-864e-3848716469d0/customer-articles-cover.jpg", hue: 15, description: "A board and a drafting skill that keep the customer article platform up to date with every release.", link: "customer-articles.html" },
  { title: "Internal Knowledge Base", category: "AI Engineering", year: 2026, image: "/__l5e/assets-v1/04838157-06aa-4e99-8fde-0468f4371a18/knowledge-base-cover.jpg", hue: 15, description: "A searchable base that gathers the company's scattered knowledge in one place and keeps itself up to date.", link: "knowledge-base.html" },
  { title: "Internal QA Metrics", category: "AI Engineering", year: 2026, image: "/__l5e/assets-v1/6568cdd1-5b0c-413b-ba65-4df29bb8b1d9/qa-metrics-cover.jpg", hue: 15, description: "A dashboard with three quality metrics, calculated from real Jira bugs, so the QA team knows where it stands and where it needs to go.", link: "qa-metrics.html" },
  { title: "Accessibility Audit", category: "AI Engineering", year: 2026, image: "/__l5e/assets-v1/f2f91ce8-ad46-455d-9089-d85de25426a9/accessibility-audit-cover.jpg", hue: 15, description: "A screen-by-screen accessibility survey of web and mobile, turned into a single prioritized WCAG report that guides fixes and re-tests.", link: "accessibility-audit.html" },
  { title: "E2E Triage", category: "AI Engineering", year: 2026, image: "/__l5e/assets-v1/afe4a527-de29-473b-a466-be6060e014bb/e2e-triage-cover.jpg", hue: 15, description: "An AI skill that triages every E2E pipeline failure: filters noise, reruns, classifies, fixes test errors and reports a short summary.", link: "e2e-triage.html" },
];

/* --- Blog posts ---
   Loaded live from Medium (MEDIUM_USER). This list is the
   fallback shown if Medium can't be reached. */
const MEDIUM_USER = "viviannemelo";
let POSTS = [
  {
    "title": "How Regression Testing Became an AI Skill",
    "date": "2026-10-29",
    "tags": [
      "QA",
      "Claude AI"
    ],
    "excerpt": "Everyone is familiar with the traditional IT workflow: Development → Testing → Release → Regression Testing or Smoke Testing. But in the world of AI, is it…",
    "link": "https://medium.com/@viviannemelo/how-regression-testing-became-an-ai-skill-1793572c044c"
  },
  {
    "title": "I Taught a Bot to Answer Support Tickets (and Then Tested It Like I Hate It)",
    "date": "2026-09-25",
    "tags": [
      "AI Engineering",
      "QA Engineer"
    ],
    "excerpt": "A QA engineer builds a drafting bot for the company’s customer support tool, spends most of her time trying to prove it wrong.",
    "link": "https://medium.com/@viviannemelo/i-taught-a-bot-to-answer-support-tickets-and-then-tested-it-like-i-hate-it-d86a99ec5d92"
  },
  {
    "title": "What Understanding Playwright’s Architecture Actually Changed in My Work as a QA",
    "date": "2026-07-28",
    "tags": [
      "Automation Testing",
      "QA"
    ],
    "excerpt": "For a long time, I thought “learning a test automation tool” just meant learning its syntax. Locators, assertions, a few hooks, done. I could write a test…",
    "link": "https://medium.com/@viviannemelo/what-understanding-playwrights-architecture-actually-changed-in-my-work-as-a-qa-3d0964caeed4"
  },
  {
    "title": "Ensuring Quality at Every Step",
    "date": "2025-02-26",
    "tags": [
      "Test",
      "Quality Assurance"
    ],
    "excerpt": "If you have ever developed or tested software, you know that, in the end, quality is what separates the experience of a happy user from a nightmare worthy of a…",
    "link": "https://medium.com/@viviannemelo/ensuring-quality-at-every-step-3dd1b9053714"
  },
  {
    "title": "Run, QA, Run! The journey of Quality Assurance as Forrest Gump",
    "date": "2024-05-29",
    "tags": [
      "Development Cycle",
      "Quality Assurance"
    ],
    "excerpt": "The movie “Forrest Gump” shows the amazing journey of a simple man who, even with his intellectual limitations, does great things and changes many people’s…",
    "link": "https://medium.com/@viviannemelo/run-qa-run-the-journey-of-quality-assurance-as-forrest-gump-8f269970a2dd"
  },
  {
    "title": "Ghostbusters vs. QA: The Incredible Journey of a Bug Hunter in the Software Development World",
    "date": "2024-05-16",
    "tags": [
      "Bugs",
      "QA Testing"
    ],
    "excerpt": "The movie Ghostbusters and the work of a QA hunting bugs share some surprising similarities.",
    "link": "https://medium.com/@viviannemelo/ghostbusters-vs-qa-the-incredible-journey-of-a-bug-hunter-in-the-software-development-world-537f52b7e014"
  }
];
