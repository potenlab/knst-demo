-- Fixed post categories: 'column' (default) | 'guide' | 'notice' | 'news'  (lib/post-categories.ts).
--   column · guide → /blog/<slug>/   notice → /notices/<slug>/   news → /news/<slug>/
--
-- posts.category already exists (0001) as free text with DEFAULT '칼럼'. SQLite cannot change a
-- column default or add a CHECK in place, so the table is rebuilt with the same columns in the same
-- order. Nothing references posts by foreign key. Every existing row keeps its id, slug and dates;
-- its category becomes a key: '칼럼' (all seeded/admin/Trina rows so far) → 'column'; other
-- free-text labels map by name, anything unknown → 'column'.

CREATE TABLE posts_new (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  slug          TEXT    NOT NULL UNIQUE,
  title         TEXT    NOT NULL,
  excerpt       TEXT    NOT NULL DEFAULT '',
  content_md    TEXT    NOT NULL DEFAULT '',
  cover_image   TEXT,
  category      TEXT    NOT NULL DEFAULT 'column' CHECK (category IN ('column','guide','notice','news')),
  status        TEXT    NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  source_url    TEXT,
  published_at  TEXT,
  created_at    TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at    TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  content_html  TEXT    NOT NULL DEFAULT '',
  origin        TEXT
);

INSERT INTO posts_new
  (id, slug, title, excerpt, content_md, cover_image, category, status, source_url, published_at, created_at, updated_at, content_html, origin)
SELECT
  id, slug, title, excerpt, content_md, cover_image,
  CASE
    WHEN category IN ('column','guide','notice','news') THEN category
    WHEN category IN ('가이드') THEN 'guide'
    WHEN category IN ('공지','공지사항') THEN 'notice'
    WHEN category IN ('뉴스','언론동향','언론보도') THEN 'news'
    ELSE 'column'
  END,
  status, source_url, published_at, created_at, updated_at, content_html, origin
FROM posts;

DROP TABLE posts;
ALTER TABLE posts_new RENAME TO posts;

CREATE INDEX IF NOT EXISTS idx_posts_status_published ON posts (status, published_at DESC);
-- list pages filter by category, then sort by date
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts (category, status, published_at DESC);
