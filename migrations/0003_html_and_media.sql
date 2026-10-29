-- Posts are authored and stored as sanitized HTML. content_md stays for legacy rows (renderer falls back to it).
ALTER TABLE posts ADD COLUMN content_html TEXT NOT NULL DEFAULT '';

-- Uploaded images (PNG/JPEG/WebP/GIF) live in D1 as BLOBs (R2 is not enabled on this account).
-- D1 row limit is 2 MB, so uploads are capped at 1.5 MB (the editor downsizes big images client-side).
CREATE TABLE IF NOT EXISTS media (
  id          TEXT    PRIMARY KEY,
  filename    TEXT    NOT NULL DEFAULT '',
  mime        TEXT    NOT NULL,
  size        INTEGER NOT NULL,
  width       INTEGER,
  height      INTEGER,
  data        BLOB    NOT NULL,
  created_at  TEXT    NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
);
