# Old-site content coverage

The archived old website in `docs/reference/` is the content source. The redesign changes presentation; original article titles, dates, wording and context-specific year counts must be retained. The company representative follows the old footer and greeting: **장대규**.

| Client checklist | Implementation |
| --- | --- |
| Information printed in images | Homepage sections, technology/product/evidence pages, and imported article image transcriptions. Original graphics remain available alongside readable text. |
| Kakao contact | `https://pf.kakao.com/_ScCkn` in the public floating button, header, footer and contact actions. |
| Blog images | Migration 0008 restores omitted galleries, article images and first-image covers; news uses the archived list thumbnails. Text-only originals retain a decorative cover. |
| News and announcements | Separate `/news/` and `/notices/` lists, article pages, pagination and admin categories. All 3 archived news items and 19 notices are retained. |
| Content admin | `/admin/`: authenticated rich-text editing, covers, image uploads/library, categories, drafts, publishing, unpublishing and deletion for blog/news/notices. Static company/product page layouts remain source-managed. |
| Incorrect name | Company/footer/about/contact metadata uses 장대규 from the old website. Historical names printed in documents and news quotations are not rewritten. |

## Restoration migrations

- `0007` is frozen: it was already applied in production.
- `0008` replaces 12 resource summaries with their original articles and restores imported content/images. Updates require the original stored content and timestamps, protecting later admin edits.
- `0009` restores 11 omitted guide pages and 2 earlier articles that had been collapsed into other posts. Original URLs redirect to each article's own body.
- Expected archive total after restoration: **75 posts** (53 blog/resource articles, 19 notices, 3 news items).

Generate with `node scripts/import-old-site.mjs`; validate with `python3 scripts/check-content-restore.py`. An optional D1 SQL export argument checks the migration against a production snapshot. Generated assets must be deployed before the migrations are applied.

The import retains the existing exclusions for hosting-console screenshots and a collage containing personal documents; public evidence pages use the prepared document assets with personal details obscured. Archive conversion artifacts are normalized to HTML rather than published as `[TABLE]` markers or broken Markdown.
