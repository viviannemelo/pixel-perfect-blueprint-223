# Portfolio + Blog (static, no build)

## Customize
- `js/data.js` — your name, links, projects and blog posts (everything marked [PLACEHOLDER]).
- `css/style.css` — colors and fonts at the top (`:root`).
- Project images: create an `images/` folder and set `image: "images/file.jpg"`.

## Add a blog post
Copy a post object in `POSTS` (js/data.js), give it a unique `slug`, date and HTML body. It appears automatically.

## Publish on GitHub Pages
1. Create a repository (e.g. `your-username.github.io` for a root site, or any name).
2. Upload all these files to the repository root (`index.html` must be at the root).
3. Go to **Settings → Pages**, under "Build and deployment" choose **Deploy from a branch**, branch `main`, folder `/ (root)`, and save.
4. After ~1 minute your site is live at `https://your-username.github.io/` (or `/repo-name/`).
