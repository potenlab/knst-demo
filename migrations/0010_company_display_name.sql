-- Requested display-name change: (주)엔에스티 / ㈜엔에스티 → 엔에스티.
-- Keep article URLs, media, categories, publication dates, and all other copy intact.
UPDATE posts
SET title = replace(replace(title, '(주)엔에스티', '엔에스티'), '㈜엔에스티', '엔에스티'),
    excerpt = replace(replace(excerpt, '(주)엔에스티', '엔에스티'), '㈜엔에스티', '엔에스티'),
    content_md = replace(replace(content_md, '(주)엔에스티', '엔에스티'), '㈜엔에스티', '엔에스티'),
    content_html = replace(replace(content_html, '(주)엔에스티', '엔에스티'), '㈜엔에스티', '엔에스티')
WHERE instr(title || excerpt || content_md || content_html, '(주)엔에스티') > 0
   OR instr(title || excerpt || content_md || content_html, '㈜엔에스티') > 0;
