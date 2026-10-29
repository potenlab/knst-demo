# Old-site content coverage

Report date: **2026-10-29** · Live website: [knst.co.kr](https://knst.co.kr/) · Implementation: [df47d2e](https://github.com/potenlab/knst-demo/commit/df47d2e)

The archived old website in `docs/reference/` is the content source. The redesign changes presentation; original article titles, dates, wording and context-specific year counts must be retained. The company representative follows the old footer and greeting: **장대규**.

## Checklist comparison and live URLs

| # | Requirement / old website | Current redesign | Live URL |
| --- | --- | --- | --- |
| 1 | Preserve information contained in images | Original graphics and readable text included in homepage sections, technology/product/evidence pages, and imported articles. | [Homepage](https://knst.co.kr/) · [Technology](https://knst.co.kr/technology/) · [Evidence](https://knst.co.kr/evidence/) |
| 2 | Add the correct Kakao contact | Public floating button, header, footer and contact actions use the requested channel. | [Contact page](https://knst.co.kr/contact/) · [Kakao channel](https://pf.kakao.com/_ScCkn) |
| 3 | Preserve blog content and images | Full articles, omitted galleries and first-image covers restored. News uses archived thumbnails; text-only originals retain decorative covers. | [Blog](https://knst.co.kr/blog/) · [Restored article example](https://knst.co.kr/blog/bakeout-effect-limit/) |
| 4 | Preserve news and announcements | Separate lists, article pages, pagination and admin categories. All **3 news items and 19 notices** retained. | [News](https://knst.co.kr/news/) · [Announcements](https://knst.co.kr/notices/) |
| 5 | Provide content administration | Authenticated rich-text editing, covers, image uploads/library, categories, drafts, publishing, unpublishing and deletion for blog/news/notices. | [Admin login](https://knst.co.kr/admin/login/) |
| 6 | Correct the representative's name | Company/footer/about/contact metadata uses **장대규**, matching the old footer and greeting. Historical names printed in documents and news quotations are not rewritten. | [About](https://knst.co.kr/about/) · [Contact](https://knst.co.kr/contact/) |

**Admin scope:** Blog, news and announcements are editable through the admin. Static company and product pages remain managed through code.

## Verification

- Production deployment completed on 2026-10-29.
- Checked **75 article titles and their image references**, **75 distinct article images**, and archived article redirects.
- Cache-warming checks returned HTTP 200 for **100 public URLs**.
- Verified admin login, editor controls, the authenticated media-library endpoint, and all 75 articles in the admin list. Publishing/deletion were not exercised on production content during this audit.
- Checked the restored article at a 390px mobile viewport with no horizontal overflow.
- TypeScript, production build and deployment dry run passed. Migration checks passed against both the original seed and a production database export, including rerun safety and protection of later author edits.

## Restoration migrations

- `0007` is frozen: it was already applied in production.
- `0008` replaces 12 resource summaries with their original articles and restores imported content/images. Updates require the original stored content and timestamps, protecting later admin edits.
- `0009` restores 11 omitted guide pages and 2 earlier articles that had been collapsed into other posts. Original URLs redirect to each article's own body.
- Expected archive total after restoration: **75 posts** (53 blog/resource articles, 19 notices, 3 news items).

Generate with `node scripts/import-old-site.mjs`; validate with `python3 scripts/check-content-restore.py`. An optional D1 SQL export argument checks the migration against a production snapshot. Generated assets must be deployed before the migrations are applied.

The import retains the existing exclusions for hosting-console screenshots and a collage containing personal documents; public evidence pages use the prepared document assets with personal details obscured. Archive conversion artifacts are normalized to HTML rather than published as `[TABLE]` markers or broken Markdown.
