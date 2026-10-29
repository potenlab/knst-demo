"""Check content migrations against the original seed or a supplied D1 SQL export.

Usage: python3 scripts/check-content-restore.py [path-to-d1-export.sql]
Runs entirely in memory and never connects to Cloudflare.
"""
import json
import pathlib
import re
import sqlite3
import sys
from urllib.parse import unquote, urlparse

ROOT = pathlib.Path(__file__).resolve().parents[1]
MIGRATIONS = ROOT / "migrations"
BASE = (
    pathlib.Path(sys.argv[1]).read_text()
    if len(sys.argv) > 1
    else "\n".join(p.read_text() for p in sorted(MIGRATIONS.glob("*.sql")) if p.name[:4] <= "0007")
)
RESTORES = [MIGRATIONS / "0008_restore_board_content.sql", MIGRATIONS / "0009_restore_omitted_articles.sql"]


def database():
    db = sqlite3.connect(":memory:")
    db.executescript(BASE)
    return db


db = database()
before = dict(db.execute("SELECT slug, published_at FROM posts"))
for migration in RESTORES:
    start = db.total_changes
    db.executescript(migration.read_text())
    print(f"{migration.name}: {db.total_changes - start} rows changed")

after = dict(db.execute("SELECT slug, published_at FROM posts"))
assert all(after.get(slug) == date for slug, date in before.items()), "Existing slugs/dates changed"

for slug, title, html, cover in db.execute("SELECT slug,title,content_html,cover_image FROM posts"):
    for src in re.findall(r'<img[^>]+src="([^"]+)"', html) + ([cover] if cover else []):
        if src.startswith("/old/"):
            assert (ROOT / "public" / src[1:]).is_file(), f"Missing asset: {slug}: {src}"
    if slug == "nst-method-20-years-factcheck-history":
        assert "18년의 진솔한 이야기" in title and "18년간 축적된" in html

mapping = json.loads((ROOT / "docs/reference/old-site/url-map.json").read_text())
for source, target in mapping.items():
    slug = unquote(urlparse(target).path.rstrip("/").split("/")[-1])
    assert slug in after, f"Archived URL has no restored post: {source} -> {target}"

start = db.total_changes
for migration in RESTORES:
    db.executescript(migration.read_text())
assert db.total_changes == start, "Reapplying migrations must not change any rows"

edited = database()
edited.execute("UPDATE posts SET content_html='<p>Author edit</p>', updated_at='2099-01-01' WHERE slug=?",
               ("new-house-syndrome-formaldehyde-vocs",))
for migration in RESTORES:
    edited.executescript(migration.read_text())
assert edited.execute("SELECT content_html FROM posts WHERE slug=?",
                      ("new-house-syndrome-formaldehyde-vocs",)).fetchone()[0] == "<p>Author edit</p>"

print(f"PASS: {len(after)} posts; archive mappings, image files, original dates, original year wording, idempotence and author-edit protection.")
