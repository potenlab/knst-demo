-- Posts pushed by Trina (trina.app auto-publish → POST /api/blog/ingest) carry origin='trina'.
-- The ingest endpoint only ever updates rows it created, so a Trina slug can never overwrite
-- a column written by hand in /admin. NULL = written in the admin or seeded.
ALTER TABLE posts ADD COLUMN origin TEXT;
