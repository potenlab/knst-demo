-- Blog posts for knst.co.kr redesign. Dates are ISO-8601 UTC strings.
CREATE TABLE IF NOT EXISTS posts (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  slug          TEXT    NOT NULL UNIQUE,
  title         TEXT    NOT NULL,
  excerpt       TEXT    NOT NULL DEFAULT '',
  content_md    TEXT    NOT NULL DEFAULT '',
  cover_image   TEXT,
  category      TEXT    NOT NULL DEFAULT '칼럼',
  status        TEXT    NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
  source_url    TEXT,
  published_at  TEXT,
  created_at    TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
  updated_at    TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
CREATE INDEX IF NOT EXISTS idx_posts_status_published ON posts (status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_posts_category ON posts (category);
