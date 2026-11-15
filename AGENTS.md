<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep portfolio language selection and rendering in shared browser scripts; all static pages load the same dictionary so navigation preserves one language.
- Render project carousels through the shared browser script with native scroll snapping and cleanup on rerender, so touch navigation and language changes remain consistent.
- Deploy only `public/portfolio` to GitHub Pages through the Pages artifact workflow on the repository default branch, so the static site publishes independently of the TanStack preview and draft branches cannot replace it.
- Stage the static portfolio with `scripts/export-portfolio.mjs`, downloading pointer media into the Pages artifact and rewriting URLs to relative paths, because Lovable asset paths do not resolve on external hosts; keep media binaries out of the repository.
