import { Extension } from "@tiptap/react";
import { Plugin, PluginKey, type EditorState } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

/**
 * In-document skeletons for images that are still uploading. Each placeholder is a widget
 * decoration whose position is mapped through every edit, so the finished image lands where
 * the editor dropped/pasted it even if they kept typing meanwhile.
 */
type Meta = { add: { id: string; pos: number; el: HTMLElement } } | { remove: { id: string } };

export const uploadKey = new PluginKey<DecorationSet>("nst-upload-placeholder");

export const UploadPlaceholder = Extension.create({
  name: "uploadPlaceholder",
  addProseMirrorPlugins() {
    return [
      new Plugin<DecorationSet>({
        key: uploadKey,
        state: {
          init: () => DecorationSet.empty,
          apply(tr, set) {
            let next = set.map(tr.mapping, tr.doc);
            const meta = tr.getMeta(uploadKey) as Meta | undefined;
            if (meta && "add" in meta) {
              const deco = Decoration.widget(meta.add.pos, meta.add.el, { id: meta.add.id, side: -1, ignoreSelection: true });
              next = next.add(tr.doc, [deco]);
            } else if (meta && "remove" in meta) {
              next = next.remove(next.find(undefined, undefined, (spec) => spec.id === meta.remove.id));
            }
            return next;
          },
        },
        props: {
          decorations(state) {
            return uploadKey.getState(state);
          },
        },
      }),
    ];
  },
});

export function findPlaceholder(state: EditorState, id: string): number | null {
  const set = uploadKey.getState(state);
  const found = set?.find(undefined, undefined, (spec) => spec.id === id);
  return found && found.length ? found[0].from : null;
}

/** Skeleton element for a pending upload. Returns the element and a progress setter. */
export function placeholderElement(previewUrl: string | null, name: string) {
  const el = document.createElement("div");
  el.contentEditable = "false";
  el.setAttribute("aria-hidden", "true");
  el.className = "my-5 overflow-hidden rounded-[1.25rem] border border-hairline bg-air";
  const box = document.createElement("div");
  box.className = "relative grid aspect-[16/9] max-h-[360px] w-full place-items-center overflow-hidden bg-mint/40";
  if (previewUrl) {
    const img = document.createElement("img");
    img.src = previewUrl;
    img.alt = "";
    img.className = "absolute inset-0 size-full object-cover opacity-40 blur-[2px]";
    box.appendChild(img);
  }
  const pulse = document.createElement("div");
  pulse.className = "absolute inset-0 animate-pulse bg-white/30";
  box.appendChild(pulse);
  const label = document.createElement("span");
  label.className = "relative rounded-full bg-white/90 px-4 py-1.5 text-[14px] font-semibold text-pine shadow-sm";
  label.textContent = "이미지 준비 중…";
  box.appendChild(label);
  el.appendChild(box);
  const track = document.createElement("div");
  track.className = "h-1.5 w-full bg-hairline";
  const bar = document.createElement("div");
  bar.className = "h-full w-0 bg-action transition-[width] duration-200";
  track.appendChild(bar);
  el.appendChild(track);
  const caption = document.createElement("div");
  caption.className = "truncate px-4 py-2 text-[13px] text-muted-ink";
  caption.textContent = name;
  el.appendChild(caption);

  return {
    el,
    setProgress(fraction: number | null, text?: string) {
      if (fraction != null) bar.style.width = `${Math.round(fraction * 100)}%`;
      if (text) label.textContent = text;
    },
  };
}
