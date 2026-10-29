import type { Extensions } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import { TableKit } from "@tiptap/extension-table";
import Placeholder from "@tiptap/extension-placeholder";
import { UploadPlaceholder } from "./upload-placeholder";

/**
 * Body image. Same attributes the sanitizer keeps (src, alt, title, width, height). In the editor
 * it renders like the public page — `width` is the max display width — and an image with no `alt`
 * attribute at all is outlined until the author describes it or marks it decorative (`alt=""`).
 */
export const PostImage = Image.extend({
  addNodeView() {
    return ({ node }) => {
      const dom = document.createElement("div");
      dom.className = "nst-img";
      const frame = document.createElement("span");
      frame.className = "nst-img-frame";
      const img = document.createElement("img");
      img.draggable = false;
      frame.appendChild(img);
      dom.appendChild(frame);

      let current = node;
      const apply = (n: typeof node) => {
        const { src, alt, title, width, height } = n.attrs as {
          src: string | null;
          alt: string | null;
          title: string | null;
          width: number | string | null;
          height: number | string | null;
        };
        if (img.getAttribute("src") !== src) img.setAttribute("src", src ?? "");
        if (alt == null) img.removeAttribute("alt");
        else img.setAttribute("alt", alt);
        if (title) img.setAttribute("title", title);
        else img.removeAttribute("title");
        const w = Number(width) || 0;
        const h = Number(height) || 0;
        if (w) img.setAttribute("width", String(w));
        else img.removeAttribute("width");
        if (h) img.setAttribute("height", String(h));
        else img.removeAttribute("height");
        img.style.width = w ? `${w}px` : "";
        if (alt == null) dom.setAttribute("data-missing-alt", "");
        else dom.removeAttribute("data-missing-alt");
        if (alt === "") dom.setAttribute("data-decorative", "");
        else dom.removeAttribute("data-decorative");
      };
      apply(node);

      return {
        dom,
        update(n) {
          if (n.type !== current.type) return false;
          current = n;
          apply(n);
          return true;
        },
      };
    };
  },
});

export function editorExtensions(placeholder: string): Extensions {
  return [
    StarterKit.configure({
      heading: { levels: [2, 3, 4] },
      link: false,
      dropcursor: { color: "#00479c", width: 3 },
    }),
    Link.configure({
      openOnClick: false,
      autolink: true,
      linkOnPaste: true,
      defaultProtocol: "https",
      HTMLAttributes: { target: null, rel: null, class: null },
    }),
    PostImage.configure({ inline: false, allowBase64: false }),
    // the sanitizer keeps `style="text-align:…"` on <p> only
    TextAlign.configure({ types: ["paragraph"], alignments: ["left", "center", "right"] }),
    TableKit.configure({ table: { resizable: false, allowTableNodeSelection: false } }),
    Placeholder.configure({ placeholder }),
    UploadPlaceholder,
  ];
}
