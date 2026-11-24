<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules

- The app is a slide deck: each slide is a component wrapped in `SlideLayout` (src/components/deck) and registered in `registry.ts`; `/` is the player (`?slide=N`), `/print` renders all slides for PDF. Why: one 1920×1080 canvas and one registry keep player, overview and print in sync.
- All energy numbers on slides are computed from `src/lib/energy.ts` (A = P·t, cost = A·tariff), covered by `src/lib/energy.test.ts`. Why: slide figures stay consistent when inputs change.
- Slide entrance animations are CSS classes in src/styles.css with only `from` keyframes and `backwards` fill; `.slide-static` (thumbnails/print) and `.slide-settled` (added 4 s after mount) switch them off. Why: the base style is the final look, so content can never stay hidden if a mobile browser stalls animations. The same applies to the player's slide-change transition (`DeckStage` drops its class after 1.2 s) and to ambient layers (aurora, mouse parallax via `--mx/--my`, card sheen), which only move things and never hide them.
- Slide sub-components that contain animations or `CountUp` live at module level, never declared inside a slide function. Why: an inner component is a new type each render, so any parent re-render remounts it and restarts its animation from zero.
- The audience poll (questions, QR target URL, percentage math) lives in `src/lib/poll.ts` (tested in `poll.test.ts`); ballots go to the `poll_votes` table (insert-only for visitors, one per browser `voter_id`) and results are read only through the `get_poll_results()` aggregate function. Why: individual ballots stay private while the `/vote` page and the poll slide show live percentages.
