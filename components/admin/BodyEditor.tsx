"use client";

import {
  useCallback,
  useDeferredValue,
  useEffect,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  type Ref,
} from "react";
import { EditorContent, useEditor, useEditorState, type Editor } from "@tiptap/react";
import { NodeSelection } from "@tiptap/pm/state";
import {
  BetweenHorizontalEnd,
  BetweenVerticalEnd,
  Bold,
  CircleAlert,
  CodeXml,
  Eye,
  Heading2,
  Heading3,
  ImagePlus,
  Images,
  Info,
  Italic,
  Link2,
  List,
  ListOrdered,
  PenLine,
  Quote,
  Redo2,
  SeparatorHorizontal,
  Table2,
  TextAlignCenter,
  TextAlignEnd,
  TextAlignStart,
  Trash2,
  Undo2,
  Unlink,
  X,
  type LucideIcon,
} from "lucide-react";
import "./editor.css";
import { renderPostHtml } from "@/components/PostBody";
import { sanitizePostHtml } from "@/lib/sanitize";
import { editorExtensions } from "./editor-extensions";
import { findPlaceholder, placeholderElement, uploadKey } from "./upload-placeholder";
import { ACCEPT, UploadError, formatBytes, mediaUrl, pickImageFiles, prepareImage, uploadImage } from "./image-upload";
import { isExternalHref, normalizeHref, prettyHtml, removedParts, textLength } from "./html-tools";
import { LIMITS } from "./post-rules";
import MediaLibrary from "./MediaLibrary";
import { btn, field } from "./styles";

export type BodyMode = "visual" | "source" | "preview";

export type BodyEditorHandle = {
  /** Show the body and put the caret in it; with `missingAlt`, select the first image that still needs a description. */
  focus(opts?: { missingAlt?: boolean }): void;
  /** Take the body as stored (sanitized) after a save. Returns the HTML the editor now holds. */
  adopt(html: string): string;
  /** What the sanitizer removed on the last save (an empty list clears the report). */
  report(removed: string[]): void;
};

type Props = {
  ref?: Ref<BodyEditorHandle>;
  value: string;
  onChange: (html: string) => void;
  /** The editor's own serialization of the initial body (so merely opening a post is not an edit). */
  onBaseline: (html: string) => void;
  onUploadingChange: (count: number) => void;
  /** id of the editable surface (the parent focuses it on errors). */
  inputId: string;
  labelId: string;
  describedBy?: string;
  invalid: boolean;
  title: string;
  /** The post only had legacy markdown; it was converted to HTML for this session. */
  legacyNote: boolean;
};

type Note = { tone: "info" | "warn"; text: string; items?: string[] } | null;
type Issue = { id: number; text: string; authExpired?: boolean };

const PLACEHOLDER = "여기에 본문을 쓰세요. 이미지는 끌어다 놓거나 붙여넣어도 올라갑니다.";
const MAX_FILES = 10;
const n = (v: number) => v.toLocaleString("ko-KR");
const read = (e: Editor) => (e.isEmpty ? "" : e.getHTML());

const MODES: { key: BodyMode; label: string; icon: LucideIcon }[] = [
  { key: "visual", label: "시각 편집", icon: PenLine },
  { key: "source", label: "HTML 소스", icon: CodeXml },
  { key: "preview", label: "미리보기", icon: Eye },
];

export default function BodyEditor({
  ref,
  value,
  onChange,
  onBaseline,
  onUploadingChange,
  inputId,
  labelId,
  describedBy,
  invalid,
  title,
  legacyNote,
}: Props) {
  const uid = useId();
  const [mode, setMode] = useState<BodyMode>("visual");
  const [source, setSource] = useState("");
  /** Source text edited and not yet loaded into the visual editor. */
  const [sourcePending, setSourcePending] = useState(false);
  const [note, setNote] = useState<Note>(null);
  const [saveReport, setSaveReport] = useState<string[] | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [uploads, setUploads] = useState(0);
  const [announce, setAnnounce] = useState("");
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const [linkDraft, setLinkDraft] = useState("");
  const [linkText, setLinkText] = useState("");
  const [linkError, setLinkError] = useState<string | null>(null);
  const [altDraft, setAltDraft] = useState("");

  const fileRef = useRef<HTMLInputElement>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);
  const altRef = useRef<HTMLInputElement>(null);
  const linkRef = useRef<HTMLInputElement>(null);
  const sourceRef = useRef<HTMLTextAreaElement>(null);
  const tabRefs = useRef<Partial<Record<BodyMode, HTMLButtonElement | null>>>({});
  const issueSeq = useRef(0);
  const uploadSeq = useRef(0);
  const dragDepth = useRef(0);

  // Tiptap registers callbacks once; route them through refs so they always see fresh props.
  const cb = useRef({ onChange, onBaseline, upload: (_f: File[], _p?: number | null) => {}, openLink: () => {} });
  cb.current.onChange = onChange;
  cb.current.onBaseline = onBaseline;
  const [initialHtml] = useState(value);

  const extensions = useMemo(() => editorExtensions(PLACEHOLDER), []);
  const editorProps = useMemo(
    () => ({
      attributes: {
        id: inputId,
        class: "prose-nst prose-html",
        role: "textbox",
        "aria-multiline": "true",
        "aria-labelledby": labelId,
        ...(describedBy ? { "aria-describedby": describedBy } : {}),
        ...(invalid ? { "aria-invalid": "true" } : {}),
        spellcheck: "false",
      },
      handleDrop(view: Editor["view"], event: DragEvent, _slice: unknown, moved: boolean) {
        if (moved) return false;
        const files = Array.from(event.dataTransfer?.files ?? []);
        if (!files.length) return false;
        event.preventDefault();
        const at = view.posAtCoords({ left: event.clientX, top: event.clientY });
        cb.current.upload(files, at?.pos ?? null);
        return true;
      },
      handlePaste(_view: Editor["view"], event: ClipboardEvent) {
        const files = Array.from(event.clipboardData?.files ?? []);
        if (!files.length) return false;
        // text copied from Word/Excel can carry a picture of itself as well — keep the text then
        if ((event.clipboardData?.getData("text/plain") ?? "").trim()) return false;
        event.preventDefault();
        cb.current.upload(files, null);
        return true;
      },
      handleKeyDown(_view: Editor["view"], event: KeyboardEvent) {
        if ((event.metaKey || event.ctrlKey) && !event.altKey && event.key.toLowerCase() === "k") {
          event.preventDefault();
          cb.current.openLink();
          return true;
        }
        return false;
      },
    }),
    [inputId, labelId, describedBy, invalid],
  );

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    extensions,
    content: initialHtml,
    editorProps,
    onCreate({ editor: e }) {
      const html = read(e);
      // Anything the visual editor can't represent stays in the stored body until the first visual edit.
      const lost = removedParts(initialHtml, html);
      if (lost.length) {
        setNote({
          tone: "warn",
          text: "시각 편집기가 지원하지 않는 부분이 있습니다. 시각 편집에서 고치고 저장하면 이 부분은 정리됩니다. 그대로 두려면 ‘HTML 소스’ 탭에서만 고쳐 주세요.",
          items: lost,
        });
      } else cb.current.onBaseline(html);
    },
    onUpdate({ editor: e }) {
      cb.current.onChange(read(e));
    },
  });

  // useEditorState only re-selects on transactions; until the first one, read the fresh editor directly.
  const selected = useEditorState({ editor, selector: ({ editor: e }) => (e ? selectUi(e) : null) });
  const ui = selected ?? (editor ? selectUi(editor) : null);

  useEffect(() => onUploadingChange(uploads), [uploads, onUploadingChange]);

  /* ───────── image description (alt) ───────── */

  const imgKey = ui?.image ? `${ui.image.pos}|${ui.image.src}` : "";
  const imgAlt = ui?.image?.alt;
  useEffect(() => {
    if (imgKey) setAltDraft(imgAlt ?? "");
    // only when another image gets selected — typing must not be overwritten
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imgKey]);

  const setImageAlt = useCallback(
    (alt: string | null) => {
      if (!editor || !ui?.image) return;
      const pos = ui.image.pos;
      editor
        .chain()
        .command(({ tr }) => {
          tr.setNodeAttribute(pos, "alt", alt);
          return true;
        })
        .run();
    },
    [editor, ui?.image],
  );

  const focusAltSoon = useCallback(() => {
    setTimeout(() => {
      altRef.current?.focus();
      altRef.current?.scrollIntoView({ block: "nearest" });
    }, 60);
  }, []);

  /** Select the next image without a description (wrapping). False when there is none. */
  const selectMissingAlt = useCallback(
    (fromStart = false) => {
      if (!editor) return false;
      const positions: number[] = [];
      editor.state.doc.descendants((nd, pos) => {
        if (nd.type.name === "image" && nd.attrs.alt == null) positions.push(pos);
        return true;
      });
      if (!positions.length) return false;
      const after = fromStart ? -1 : editor.state.selection.from;
      const pos = positions.find((p) => p > after) ?? positions[0];
      editor.chain().setNodeSelection(pos).scrollIntoView().run();
      focusAltSoon();
      return true;
    },
    [editor, focusAltSoon],
  );

  /* ───────── images: insert, upload ───────── */

  const insertImage = useCallback(
    (at: number | null, attrs: { src: string; width: number | null; height: number | null }) => {
      if (!editor || editor.isDestroyed) return;
      const size = editor.state.doc.content.size;
      const pos = Math.max(0, Math.min(at ?? editor.state.selection.to, size));
      editor
        .chain()
        .insertContentAt(pos, { type: "image", attrs: { src: attrs.src, width: attrs.width || null, height: attrs.height || null, alt: null } })
        .run();
      // select what we just inserted (nearest image with that src) and ask for its description
      let found = -1;
      let best = Infinity;
      editor.state.doc.descendants((nd, p) => {
        if (nd.type.name === "image" && nd.attrs.src === attrs.src && Math.abs(p - pos) < best) {
          best = Math.abs(p - pos);
          found = p;
        }
        return true;
      });
      if (found >= 0) {
        editor.chain().setNodeSelection(found).scrollIntoView().run();
        focusAltSoon();
      }
    },
    [editor, focusAltSoon],
  );

  const addIssue = useCallback((text: string, authExpired = false) => {
    const id = ++issueSeq.current;
    setIssues((list) => [...list.slice(-3), { id, text, authExpired }]);
  }, []);

  const uploadOne = useCallback(
    async (file: File, at: number | null) => {
      const ed = editor;
      if (!ed || ed.isDestroyed) return;
      const id = `up-${++uploadSeq.current}`;
      const previewUrl = /^image\/(png|jpe?g|webp|gif)$/i.test(file.type) ? URL.createObjectURL(file) : null;
      const ph = placeholderElement(previewUrl, file.name);
      const pos = Math.max(0, Math.min(at ?? ed.state.selection.from, ed.state.doc.content.size));
      ed.view.dispatch(ed.state.tr.setMeta(uploadKey, { add: { id, pos, el: ph.el } }));
      setUploads((c) => c + 1);
      try {
        ph.setProgress(0.03, "이미지 확인 중…");
        const prepared = await prepareImage(file);
        ph.setProgress(
          0.06,
          prepared.resized ? `크기 줄임 ${formatBytes(prepared.originalSize)} → ${formatBytes(prepared.blob.size)} · 올리는 중…` : "올리는 중…",
        );
        const res = await uploadImage(prepared, (f) => ph.setProgress(f, `올리는 중… ${Math.round(f * 100)}%`));
        if (ed.isDestroyed) return;
        const where = findPlaceholder(ed.state, id);
        ed.view.dispatch(ed.state.tr.setMeta(uploadKey, { remove: { id } }));
        insertImage(where, { src: res.url, width: res.width, height: res.height });
        setAnnounce(
          `「${file.name}」을(를) 넣었습니다${
            prepared.resized ? ` (용량이 커서 ${formatBytes(prepared.originalSize)} → ${formatBytes(res.size)}, 가로 ${prepared.width}px로 줄였습니다)` : ""
          }. 아래 칸에 이미지 설명을 적어 주세요.`,
        );
      } catch (e) {
        if (!ed.isDestroyed) ed.view.dispatch(ed.state.tr.setMeta(uploadKey, { remove: { id } }));
        const msg = e instanceof UploadError ? e.message : "이미지를 올리지 못했습니다. 잠시 뒤 다시 시도해 주세요. 계속되면 관리자에게 알려 주세요.";
        addIssue(`${file.name}: ${msg}`, e instanceof UploadError && e.authExpired);
      } finally {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setUploads((c) => c - 1);
      }
    },
    [editor, insertImage, addIssue],
  );

  const uploadFiles = useCallback(
    (list: File[], at: number | null = null) => {
      const { images, others } = pickImageFiles(list);
      if (others.length) {
        addIssue(
          `${others.map((f) => f.name).join(", ")}: 이미지 파일이 아니라 넣지 않았습니다. PNG, JPG, WebP, GIF 이미지만 넣을 수 있습니다.`,
        );
      }
      if (images.length > MAX_FILES) addIssue(`한 번에 ${MAX_FILES}장까지 올릴 수 있습니다. 처음 ${MAX_FILES}장만 올립니다. 나머지는 다시 골라 주세요.`);
      if (mode !== "visual") switchModeRef.current("visual");
      for (const f of images.slice(0, MAX_FILES)) void uploadOne(f, at);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [uploadOne, addIssue, mode],
  );
  cb.current.upload = uploadFiles;

  /* ───────── links ───────── */

  const openLink = useCallback(() => {
    if (!editor) return;
    const href = (editor.getAttributes("link").href as string | undefined) ?? "";
    setLinkDraft(href);
    setLinkText("");
    setLinkError(null);
    setLinkOpen(true);
    setTimeout(() => linkRef.current?.focus(), 30);
  }, [editor]);
  cb.current.openLink = openLink;

  const closeLink = useCallback(() => {
    setLinkOpen(false);
    setLinkError(null);
    editor?.commands.focus();
  }, [editor]);

  function applyLink() {
    if (!editor) return;
    const href = normalizeHref(linkDraft);
    if (!href) {
      setLinkError("주소를 확인해 주세요. https://로 시작하는 주소, /로 시작하는 사이트 안 경로, mailto: 이메일 주소만 넣을 수 있습니다.");
      linkRef.current?.focus();
      return;
    }
    const attrs = isExternalHref(href) ? { href, target: "_blank", rel: "noopener noreferrer" } : { href, target: null, rel: null };
    const { empty } = editor.state.selection;
    if (empty && !editor.isActive("link")) {
      const text = linkText.trim() || href.replace(/^https?:\/\//, "");
      editor.chain().focus().insertContent({ type: "text", text, marks: [{ type: "link", attrs }] }).run();
    } else {
      editor.chain().focus().extendMarkRange("link").setLink(attrs).run();
    }
    setLinkOpen(false);
    setAnnounce("링크를 걸었습니다.");
  }

  function removeLink() {
    editor?.chain().focus().extendMarkRange("link").unsetLink().run();
    setLinkOpen(false);
    setAnnounce("링크를 뺐습니다.");
  }

  /* ───────── tabs ───────── */

  const switchMode = useCallback(
    (next: BodyMode) => {
      if (next === mode) return;
      if (next === "visual" && sourcePending && editor) {
        editor.commands.setContent(source, { emitUpdate: false });
        const out = read(editor);
        const lost = removedParts(source, out);
        setSourcePending(false);
        cb.current.onChange(out);
        setNote(
          lost.length
            ? { tone: "warn", text: "시각 편집기로 옮기면서 지원하지 않는 부분을 정리했습니다. 되돌리려면 실행취소(Ctrl/⌘+Z)를 누르세요.", items: lost }
            : null,
        );
      }
      if (next === "source" && !sourcePending) setSource(prettyHtml(value));
      setMode(next);
    },
    [mode, sourcePending, editor, source, value],
  );
  const switchModeRef = useRef(switchMode);
  switchModeRef.current = switchMode;

  function onTabKey(e: ReactKeyboardEvent<HTMLButtonElement>) {
    const i = MODES.findIndex((m) => m.key === mode);
    let j = -1;
    if (e.key === "ArrowRight") j = (i + 1) % MODES.length;
    else if (e.key === "ArrowLeft") j = (i - 1 + MODES.length) % MODES.length;
    else if (e.key === "Home") j = 0;
    else if (e.key === "End") j = MODES.length - 1;
    if (j < 0) return;
    e.preventDefault();
    const key = MODES[j].key;
    switchMode(key);
    tabRefs.current[key]?.focus();
  }

  /* ───────── parent API ───────── */

  useImperativeHandle(
    ref,
    () => ({
      focus(opts) {
        if (mode !== "visual") switchMode("visual");
        setTimeout(() => {
          if (opts?.missingAlt && selectMissingAlt(true)) return;
          editor?.commands.focus();
          document.getElementById(inputId)?.scrollIntoView({ block: "center" });
        }, 30);
      },
      adopt(html) {
        if (mode === "source") {
          const pretty = prettyHtml(html);
          setSource(pretty);
          setSourcePending(true);
          return pretty;
        }
        if (!editor) return html;
        editor.commands.setContent(html, { emitUpdate: false });
        setSourcePending(false);
        return read(editor);
      },
      report(removed) {
        setSaveReport(removed.length ? removed : null);
        if (removed.length) setNote(null);
      },
    }),
    [mode, switchMode, selectMissingAlt, editor, inputId],
  );

  /* ───────── toolbar: one tab stop, arrow keys move (WAI-ARIA toolbar) ───────── */

  useLayoutEffect(() => {
    const el = toolbarRef.current;
    if (!el) return;
    const items = Array.from(el.querySelectorAll<HTMLButtonElement>("button"));
    const current = items.find((b) => b.tabIndex === 0 && !b.disabled && b.dataset.roving === "1") ?? items.find((b) => !b.disabled);
    items.forEach((b) => {
      b.tabIndex = b === current ? 0 : -1;
      b.dataset.roving = "1";
    });
  });

  function onToolbarKey(e: ReactKeyboardEvent<HTMLDivElement>) {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(e.key)) return;
    const items = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>("button:not([disabled])"));
    if (!items.length) return;
    const i = items.indexOf(document.activeElement as HTMLButtonElement);
    let j = e.key === "Home" ? 0 : e.key === "End" ? items.length - 1 : i + (e.key === "ArrowRight" ? 1 : -1);
    j = (j + items.length) % items.length;
    e.preventDefault();
    items.forEach((b) => (b.tabIndex = -1));
    items[j].tabIndex = 0;
    items[j].focus();
  }

  /* ───────── derived ───────── */

  const deferred = useDeferredValue(mode === "source" ? source : value);
  const textCount = useMemo(() => textLength(deferred), [deferred]);
  const liveStrip = useMemo(() => (mode === "source" ? removedParts(deferred, sanitizePostHtml(deferred)) : []), [mode, deferred]);
  const previewHtml = useMemo(() => (mode === "preview" ? renderPostHtml(value) : ""), [mode, value]);
  const ready = !!editor && !!ui;
  const run = (fn: (e: Editor) => void) => () => editor && fn(editor);

  type Tool = { key: string; label: string; icon: LucideIcon; onClick: () => void; pressed?: boolean; disabled?: boolean; text?: string };
  const groups: Tool[][] = ui
    ? [
        [
          { key: "undo", label: "실행취소 (Ctrl/⌘+Z)", icon: Undo2, onClick: run((e) => e.chain().focus().undo().run()), disabled: !ui.canUndo },
          { key: "redo", label: "다시실행 (Ctrl/⌘+Shift+Z)", icon: Redo2, onClick: run((e) => e.chain().focus().redo().run()), disabled: !ui.canRedo },
        ],
        [
          { key: "h2", label: "제목 2 (큰 소제목)", icon: Heading2, pressed: ui.h2, onClick: run((e) => e.chain().focus().toggleHeading({ level: 2 }).run()) },
          { key: "h3", label: "제목 3 (작은 소제목)", icon: Heading3, pressed: ui.h3, onClick: run((e) => e.chain().focus().toggleHeading({ level: 3 }).run()) },
        ],
        [
          { key: "bold", label: "굵게 (Ctrl/⌘+B)", icon: Bold, pressed: ui.bold, disabled: !ui.canMark, onClick: run((e) => e.chain().focus().toggleBold().run()) },
          { key: "italic", label: "기울임 (Ctrl/⌘+I)", icon: Italic, pressed: ui.italic, disabled: !ui.canMark, onClick: run((e) => e.chain().focus().toggleItalic().run()) },
          { key: "link", label: "링크 (Ctrl/⌘+K)", icon: Link2, pressed: ui.link || linkOpen, onClick: () => (linkOpen ? closeLink() : openLink()) },
        ],
        [
          { key: "ul", label: "목록", icon: List, pressed: ui.bullet, onClick: run((e) => e.chain().focus().toggleBulletList().run()) },
          { key: "ol", label: "번호 목록", icon: ListOrdered, pressed: ui.ordered, onClick: run((e) => e.chain().focus().toggleOrderedList().run()) },
          { key: "quote", label: "인용", icon: Quote, pressed: ui.quote, onClick: run((e) => e.chain().focus().toggleBlockquote().run()) },
        ],
        [
          { key: "al", label: "왼쪽 정렬", icon: TextAlignStart, pressed: ui.align === "left", disabled: !ui.canAlign, onClick: run((e) => e.chain().focus().unsetTextAlign().run()) },
          { key: "ac", label: "가운데 정렬", icon: TextAlignCenter, pressed: ui.align === "center", disabled: !ui.canAlign, onClick: run((e) => e.chain().focus().setTextAlign("center").run()) },
          { key: "ar", label: "오른쪽 정렬", icon: TextAlignEnd, pressed: ui.align === "right", disabled: !ui.canAlign, onClick: run((e) => e.chain().focus().setTextAlign("right").run()) },
        ],
        [
          {
            key: "table",
            label: ui.table ? "표 안에 있습니다 — 아래 표 편집 줄을 쓰세요" : "표 넣기 (3×3, 첫 줄 머리글)",
            icon: Table2,
            pressed: ui.table,
            disabled: ui.table,
            onClick: run((e) => e.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()),
          },
          { key: "hr", label: "구분선", icon: SeparatorHorizontal, onClick: run((e) => e.chain().focus().setHorizontalRule().run()) },
        ],
        [
          { key: "img", label: "이미지 올리기", text: "이미지", icon: ImagePlus, onClick: () => fileRef.current?.click() },
          { key: "lib", label: "미디어 보관함에서 넣기", text: "보관함", icon: Images, onClick: () => setLibraryOpen(true) },
        ],
      ]
    : [];

  const tableTools: { key: string; label: string; icon?: LucideIcon; onClick: () => void; danger?: boolean }[] = [
    { key: "row", label: "아래에 행 추가", icon: BetweenHorizontalEnd, onClick: run((e) => e.chain().focus().addRowAfter().run()) },
    { key: "col", label: "오른쪽에 열 추가", icon: BetweenVerticalEnd, onClick: run((e) => e.chain().focus().addColumnAfter().run()) },
    { key: "delrow", label: "행 삭제", onClick: run((e) => e.chain().focus().deleteRow().run()) },
    { key: "delcol", label: "열 삭제", onClick: run((e) => e.chain().focus().deleteColumn().run()) },
    { key: "head", label: "첫 줄 머리글 켜기/끄기", onClick: run((e) => e.chain().focus().toggleHeaderRow().run()) },
    { key: "deltable", label: "표 삭제", icon: Trash2, danger: true, onClick: run((e) => e.chain().focus().deleteTable().run()) },
  ];

  const toolBtn =
    "relative inline-flex size-11 shrink-0 items-center justify-center rounded-xl text-pine outline-none transition-colors " +
    "hover:bg-mint/50 focus-visible:ring-3 focus-visible:ring-action/45 disabled:cursor-not-allowed disabled:opacity-35 " +
    "aria-pressed:bg-pine aria-pressed:text-white aria-pressed:hover:bg-pine-2 [&_svg]:size-[19px]";
  const smallBase =
    "inline-flex min-h-11 shrink-0 items-center gap-1.5 rounded-xl border border-hairline bg-white px-3 text-[14px] font-semibold outline-none " +
    "focus-visible:ring-3 focus-visible:ring-action/40 [&_svg]:size-4";
  const smallBtn = `${smallBase} text-pine hover:border-pine/40 hover:bg-mint/40`;
  const smallDanger = `${smallBase} text-[#b42318] hover:border-[#b42318]/50 hover:bg-[#fff4f2]`;

  const linkActive = !!ui?.link;
  const needLinkText = linkOpen && editor ? editor.state.selection.empty && !linkActive : false;

  /* ───────── render ───────── */

  return (
    <div>
      {legacyNote ? (
        <Callout tone="info" className="mb-4">
          마크다운 글을 HTML로 변환했습니다. 저장하면 HTML로 보관됩니다.
        </Callout>
      ) : null}

      {/* tabs */}
      <div role="tablist" aria-label="본문 편집 방식" className="grid grid-cols-3 gap-1 rounded-full bg-air p-1 ring-1 ring-hairline sm:inline-grid sm:min-w-[420px]">
        {MODES.map(({ key, label, icon: Icon }) => {
          const active = mode === key;
          return (
            <button
              key={key}
              ref={(el) => {
                tabRefs.current[key] = el;
              }}
              type="button"
              role="tab"
              id={`${uid}-tab-${key}`}
              aria-selected={active}
              aria-controls={`${uid}-panel-${key}`}
              tabIndex={active ? 0 : -1}
              onClick={() => switchMode(key)}
              onKeyDown={onTabKey}
              className={
                "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full px-2 text-[14px] font-semibold whitespace-nowrap outline-none transition-colors focus-visible:ring-3 focus-visible:ring-action/45 sm:px-4 sm:text-[15px] " +
                (active ? "bg-pine text-white shadow-[0_8px_18px_-12px_rgba(14,59,50,.9)]" : "text-pine hover:bg-mint/50")
              }
            >
              <Icon aria-hidden className="size-4 shrink-0" />
              {label}
            </button>
          );
        })}
      </div>

      {note ? (
        <Callout tone={note.tone} className="mt-4" onClose={() => setNote(null)}>
          {note.text}
          {note.items?.length ? <PartList items={note.items} /> : null}
        </Callout>
      ) : null}
      {saveReport ? (
        <Callout tone="warn" className="mt-4" onClose={() => setSaveReport(null)} live>
          저장하면서 허용되지 않는 부분을 지웠습니다. 편집기에는 지금 저장된 내용이 보입니다.
          <PartList items={saveReport} />
        </Callout>
      ) : null}

      {/* ── 시각 편집 ── */}
      <div
        id={`${uid}-panel-visual`}
        role="tabpanel"
        aria-labelledby={`${uid}-tab-visual`}
        hidden={mode !== "visual"}
        className="mt-4"
      >
        <div
          className={
            "nst-editor rounded-2xl border bg-white transition-[border-color,box-shadow] focus-within:border-action focus-within:ring-3 focus-within:ring-action/20 " +
            (invalid ? "border-[#b42318] ring-3 ring-[#b42318]/15" : "border-hairline")
          }
          data-dragging={dragging ? "" : undefined}
          onDragEnter={(e) => {
            if (!e.dataTransfer.types.includes("Files")) return;
            dragDepth.current++;
            setDragging(true);
          }}
          onDragOver={(e) => {
            if (e.dataTransfer.types.includes("Files")) e.preventDefault();
          }}
          onDragLeave={() => {
            dragDepth.current = Math.max(0, dragDepth.current - 1);
            if (!dragDepth.current) setDragging(false);
          }}
          onDrop={(e) => {
            dragDepth.current = 0;
            setDragging(false);
            if (e.defaultPrevented || !e.dataTransfer.files.length) return;
            e.preventDefault(); // dropped on the frame, not the text: add at the caret
            uploadFiles(Array.from(e.dataTransfer.files));
          }}
        >
          {/* sticky toolbar + contextual panels */}
          <div className="sticky top-16 z-20 rounded-t-2xl border-b border-hairline bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
            <div
              ref={toolbarRef}
              role="toolbar"
              aria-label="서식"
              aria-controls={inputId}
              onKeyDown={onToolbarKey}
              className="flex items-center gap-0.5 overflow-x-auto overscroll-x-contain px-1.5 py-1.5 [scrollbar-width:thin] md:flex-wrap md:overflow-visible"
            >
              {ready ? (
                groups.map((group, gi) => (
                  <div key={gi} className="flex shrink-0 items-center gap-0.5">
                    {gi > 0 ? <span aria-hidden className="mx-1 h-6 w-px shrink-0 bg-hairline" /> : null}
                    {group.map((t) => (
                      <button
                        key={t.key}
                        type="button"
                        aria-label={t.text ? undefined : t.label}
                        title={t.label}
                        aria-pressed={t.pressed === undefined ? undefined : t.pressed}
                        disabled={t.disabled}
                        onMouseDown={(e) => e.preventDefault() /* keep the text selection */}
                        onClick={t.onClick}
                        className={t.text ? `${toolBtn} w-auto gap-1.5 px-3 text-[14px] font-semibold` : toolBtn}
                      >
                        <t.icon aria-hidden />
                        {t.text ? <span>{t.text}</span> : null}
                      </button>
                    ))}
                  </div>
                ))
              ) : (
                <div aria-hidden className="flex gap-1.5 py-0.5">
                  {Array.from({ length: 12 }, (_, i) => (
                    <span key={i} className="size-11 shrink-0 animate-pulse rounded-xl bg-air" />
                  ))}
                </div>
              )}
            </div>

            {ui?.table ? (
              <div role="toolbar" aria-label="표 편집" className="flex items-center gap-1.5 overflow-x-auto border-t border-hairline px-2 py-1.5">
                <span className="shrink-0 px-1 text-[13px] font-semibold text-muted-ink">표</span>
                {tableTools.map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={t.onClick}
                    className={t.danger ? smallDanger : smallBtn}
                  >
                    {t.icon ? <t.icon aria-hidden /> : null}
                    {t.label}
                  </button>
                ))}
              </div>
            ) : null}

            {linkOpen ? (
              <div className="border-t border-hairline bg-air/80 px-3 py-3 sm:px-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
                  {needLinkText ? (
                    <div className="sm:w-56">
                      <label htmlFor={`${uid}-ltext`} className="text-[14px] font-semibold text-ink">
                        보일 글자
                      </label>
                      <input
                        id={`${uid}-ltext`}
                        type="text"
                        value={linkText}
                        onChange={(e) => setLinkText(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                            e.preventDefault();
                            applyLink();
                          } else if (e.key === "Escape") {
                            e.preventDefault();
                            closeLink();
                          }
                        }}
                        placeholder="비우면 주소가 보입니다"
                        className={`${field.input} mt-1 min-h-11`}
                      />
                    </div>
                  ) : null}
                  <div className="min-w-0 flex-1">
                    <label htmlFor={`${uid}-lhref`} className="text-[14px] font-semibold text-ink">
                      링크 주소
                    </label>
                    <input
                      ref={linkRef}
                      id={`${uid}-lhref`}
                      type="text"
                      inputMode="url"
                      autoComplete="off"
                      spellCheck={false}
                      value={linkDraft}
                      aria-invalid={linkError ? true : undefined}
                      aria-describedby={linkError ? `${uid}-lerr` : `${uid}-lhint`}
                      onChange={(e) => {
                        setLinkDraft(e.target.value);
                        if (linkError) setLinkError(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.nativeEvent.isComposing) {
                          e.preventDefault(); // never submit the post form
                          applyLink();
                        } else if (e.key === "Escape") {
                          e.preventDefault();
                          closeLink();
                        }
                      }}
                      placeholder="https://example.com 또는 /blog/글주소/"
                      className={`${field.input} mt-1 min-h-11`}
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" onClick={applyLink} className={btn.primary}>
                      적용
                    </button>
                    {linkActive ? (
                      <button type="button" onClick={removeLink} className={btn.secondary}>
                        <Unlink aria-hidden />
                        링크 빼기
                      </button>
                    ) : null}
                    <button type="button" onClick={closeLink} className={btn.ghost}>
                      취소
                    </button>
                  </div>
                </div>
                {linkError ? (
                  <p id={`${uid}-lerr`} role="alert" className={field.error}>
                    <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
                    {linkError}
                  </p>
                ) : (
                  <p id={`${uid}-lhint`} className={field.hint}>
                    다른 사이트 주소는 새 탭에서 열립니다. Enter로 적용, Esc로 닫기.
                  </p>
                )}
              </div>
            ) : null}

            {ui?.image ? (
              <div className="border-t border-hairline bg-air/80 px-3 py-3 sm:px-4">
                <div className="flex items-start gap-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ui.image.src} alt="" className="mt-1 hidden size-16 shrink-0 rounded-xl bg-white object-cover ring-1 ring-hairline sm:block" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <label htmlFor={`${uid}-alt`} className="text-[14.5px] font-semibold text-ink">
                        이미지 설명 <span className="font-normal text-muted-ink">(대체 텍스트)</span>
                      </label>
                      {ui.image.alt == null ? (
                        <span className="rounded-full bg-[#b42318] px-2 py-0.5 text-[12px] font-bold text-white">발행하려면 필요</span>
                      ) : ui.image.alt === "" ? (
                        <span className="rounded-full bg-white px-2 py-0.5 text-[12px] font-semibold text-muted-ink ring-1 ring-hairline">장식용</span>
                      ) : null}
                    </div>
                    <input
                      ref={altRef}
                      id={`${uid}-alt`}
                      type="text"
                      maxLength={250}
                      value={altDraft}
                      disabled={ui.image.alt === ""}
                      aria-describedby={`${uid}-althint`}
                      aria-invalid={ui.image.alt == null ? true : undefined}
                      onChange={(e) => {
                        setAltDraft(e.target.value);
                        setImageAlt(e.target.value.trim() ? e.target.value : null);
                      }}
                      onBlur={() => {
                        const v = altDraft.trim();
                        if (ui.image && ui.image.alt !== "" && v !== (ui.image.alt ?? "")) setImageAlt(v || null);
                      }}
                      onKeyDown={(e) => {
                        if ((e.key === "Enter" && !e.nativeEvent.isComposing) || e.key === "Escape") {
                          e.preventDefault();
                          editor?.commands.focus();
                        }
                      }}
                      placeholder="예: 시공 뒤 거실에서 공기질 측정기를 확인하는 모습"
                      className={`${field.input} mt-1 min-h-11 disabled:bg-air disabled:text-muted-ink`}
                    />
                    <p id={`${uid}-althint`} className={field.hint}>
                      화면을 보기 어려운 독자와 검색엔진이 읽는 문장입니다. 사진에 무엇이 보이는지 한 문장으로 적어 주세요.
                    </p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
                      <label className="inline-flex min-h-11 cursor-pointer items-center gap-2.5 text-[14.5px] font-medium text-ink">
                        <input
                          type="checkbox"
                          checked={ui.image.alt === ""}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setAltDraft("");
                              setImageAlt("");
                            } else {
                              setImageAlt(null);
                              setTimeout(() => altRef.current?.focus(), 0);
                            }
                          }}
                          className="size-5 accent-[#0e3b32]"
                        />
                        장식용 이미지 (설명 없이 둠)
                      </label>
                      <button
                        type="button"
                        onClick={run((e) => e.chain().focus().deleteSelection().run())}
                        className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-2 text-[14px] font-semibold text-[#b42318] outline-none hover:bg-[#fff4f2] focus-visible:ring-3 focus-visible:ring-action/40"
                      >
                        <Trash2 aria-hidden className="size-4" />
                        이미지 빼기
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>

          {/* upload problems */}
          {issues.length ? (
            <ul className="space-y-2 border-b border-hairline px-3 py-3 sm:px-4">
              {issues.map((it) => (
                <li key={it.id} role="alert" className="flex items-start gap-2.5 rounded-2xl border border-[#b42318]/25 bg-[#fff4f2] px-3.5 py-2.5 text-[14.5px] leading-relaxed text-[#8a1c13]">
                  <CircleAlert aria-hidden className="mt-0.5 size-[18px] shrink-0" />
                  <p className="min-w-0 flex-1 break-words">
                    {it.text}
                    {it.authExpired ? (
                      <>
                        {" "}
                        <a href="/admin/login/" target="_blank" rel="noopener" className="font-semibold text-action underline underline-offset-4">
                          새 탭에서 로그인
                        </a>
                      </>
                    ) : null}
                  </p>
                  <button
                    type="button"
                    onClick={() => setIssues((l) => l.filter((x) => x.id !== it.id))}
                    className="-my-2 -mr-2 inline-flex size-11 shrink-0 items-center justify-center rounded-full outline-none hover:bg-black/5 focus-visible:ring-3 focus-visible:ring-action/40"
                  >
                    <X aria-hidden className="size-4" />
                    <span className="sr-only">알림 닫기</span>
                  </button>
                </li>
              ))}
            </ul>
          ) : null}

          {/* the page */}
          <div className="px-4 pb-4 pt-6 sm:px-8 sm:pt-8">
            <div className="mx-auto max-w-[720px]">
              {ready ? null : (
                <div aria-hidden className="space-y-4">
                  <div className="h-5 w-11/12 animate-pulse rounded bg-air" />
                  <div className="h-5 w-10/12 animate-pulse rounded bg-air" />
                  <div className="h-5 w-8/12 animate-pulse rounded bg-air" />
                  <div className="h-64" />
                </div>
              )}
              <EditorContent editor={editor} />
            </div>
          </div>

          {/* footer */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-b-2xl border-t border-hairline bg-air/60 px-3 py-2 text-[13.5px] text-muted-ink sm:px-4">
            {ui?.missing ? (
              <button
                type="button"
                onClick={() => selectMissingAlt(false)}
                className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-2 font-semibold text-[#b42318] outline-none hover:bg-[#fff4f2] focus-visible:ring-3 focus-visible:ring-action/40"
              >
                <CircleAlert aria-hidden className="size-4" />
                설명이 필요한 이미지 {ui.missing}개 · 다음 이미지 고르기
              </button>
            ) : (
              <span className="inline-flex min-h-11 items-center">이미지는 끌어다 놓기·붙여넣기로도 올릴 수 있습니다 (PNG·JPG·WebP·GIF, 큰 사진은 자동으로 줄임)</span>
            )}
            <span className="ml-auto tabular-nums">
              {uploads ? <strong className="mr-3 font-semibold text-pine">이미지 {uploads}개 올리는 중…</strong> : null}
              글자 {n(textCount)}자 · HTML {n(value.length)}/{n(LIMITS.content)}
            </span>
          </div>
        </div>
      </div>

      {/* ── HTML 소스 ── */}
      <div
        id={`${uid}-panel-source`}
        role="tabpanel"
        aria-labelledby={`${uid}-tab-source`}
        hidden={mode !== "source"}
        className="mt-4"
      >
        <Callout tone="info">
          HTML을 직접 고칠 수 있습니다. 허용되지 않는 태그·속성(script, style, iframe, 입력 양식, onclick·onerror 같은 이벤트 속성, javascript: 링크,
          https가 아닌 외부 이미지 등)은 <strong className="font-semibold">저장할 때 자동으로 지워지고</strong>, 무엇을 지웠는지 저장 뒤 알려 드립니다.
        </Callout>
        {liveStrip.length ? (
          <Callout tone="warn" className="mt-3" live>
            지금 내용으로 저장하면 다음 부분이 지워집니다.
            <PartList items={liveStrip} />
          </Callout>
        ) : null}
        <label htmlFor={`${inputId}-source`} className="sr-only">
          본문 HTML 소스
        </label>
        <textarea
          ref={sourceRef}
          id={`${inputId}-source`}
          value={source}
          onChange={(e) => {
            setSource(e.target.value);
            setSourcePending(true);
            cb.current.onChange(e.target.value);
          }}
          aria-invalid={invalid ? true : undefined}
          aria-describedby={describedBy}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          wrap="soft"
          className={`${field.input} mt-3 min-h-[520px] resize-y font-mono text-[14px] leading-[1.7] [tab-size:2]`}
        />
        <p className="mt-2 text-right text-[13px] tabular-nums text-muted-ink">
          HTML {n(source.length)}/{n(LIMITS.content)}자
        </p>
      </div>

      {/* ── 미리보기 ── */}
      <div
        id={`${uid}-panel-preview`}
        role="tabpanel"
        aria-labelledby={`${uid}-tab-preview`}
        hidden={mode !== "preview"}
        className="mt-4"
      >
        <div className="rounded-2xl border border-hairline bg-white px-4 py-7 sm:px-8 sm:py-10">
          <div className="mx-auto max-w-[720px]">
            <p className="text-[12px] font-semibold tracking-[0.16em] text-leaf">미리보기 · 블로그에 보이는 모습 (저장 전)</p>
            {title.trim() ? (
              <p className="mt-3 font-display text-[28px] font-extrabold leading-tight tracking-[-0.03em] text-pine sm:text-[34px]">{title}</p>
            ) : null}
            {mode === "preview" && value.trim() ? (
              <div className="prose-nst prose-html mt-8" dangerouslySetInnerHTML={{ __html: previewHtml }} />
            ) : (
              <p className="mt-6 text-[15px] text-muted-ink">본문이 비어 있습니다. ‘시각 편집’ 탭에서 본문을 써 주세요.</p>
            )}
          </div>
        </div>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept={ACCEPT}
        multiple
        className="sr-only"
        tabIndex={-1}
        aria-hidden
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          e.target.value = "";
          if (files.length) uploadFiles(files);
        }}
      />

      <MediaLibrary
        open={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        purpose="insert"
        currentHtml={value}
        onPick={(item) => {
          insertImage(null, { src: mediaUrl(item), width: item.width, height: item.height });
          setAnnounce(`「${item.filename || item.id}」을(를) 넣었습니다. 이미지 설명을 적어 주세요.`);
        }}
        onUploadFiles={(files) => uploadFiles(files)}
      />

      <p className="sr-only" aria-live="polite">
        {announce}
      </p>
    </div>
  );
}

/** Toolbar / panel state for the current selection. */
function selectUi(e: Editor) {
  const { selection, doc } = e.state;
  const node = selection instanceof NodeSelection ? selection.node : null;
  let missing = 0;
  doc.descendants((nd) => {
    if (nd.type.name === "image" && nd.attrs.alt == null) missing++;
    return true;
  });
  return {
    h2: e.isActive("heading", { level: 2 }),
    h3: e.isActive("heading", { level: 3 }),
    bold: e.isActive("bold"),
    italic: e.isActive("italic"),
    link: e.isActive("link"),
    bullet: e.isActive("bulletList"),
    ordered: e.isActive("orderedList"),
    quote: e.isActive("blockquote"),
    table: e.isActive("table"),
    align: e.isActive({ textAlign: "center" }) ? "center" : e.isActive({ textAlign: "right" }) ? "right" : "left",
    canAlign: e.can().setTextAlign("center"),
    canMark: e.can().toggleBold(),
    canUndo: e.can().undo(),
    canRedo: e.can().redo(),
    image:
      node && node.type.name === "image"
        ? { pos: selection.from, src: String(node.attrs.src ?? ""), alt: (node.attrs.alt as string | null) ?? null }
        : null,
    missing,
  };
}

function Callout({
  tone,
  children,
  className = "",
  onClose,
  live = false,
}: {
  tone: "info" | "warn";
  children: ReactNode;
  className?: string;
  onClose?: () => void;
  live?: boolean;
}) {
  const warn = tone === "warn";
  return (
    <div
      role={live ? "status" : undefined}
      className={
        "flex items-start gap-2.5 rounded-2xl border px-4 py-3 text-[14.5px] leading-relaxed " +
        (warn ? "border-[#b42318]/25 bg-[#fff4f2] text-[#8a1c13]" : "border-leaf/30 bg-mint/45 text-pine") +
        " " +
        className
      }
    >
      {warn ? <CircleAlert aria-hidden className="mt-0.5 size-[18px] shrink-0" /> : <Info aria-hidden className="mt-0.5 size-[18px] shrink-0" />}
      <div className="min-w-0 flex-1">{children}</div>
      {onClose ? (
        <button
          type="button"
          onClick={onClose}
          className="-my-2 -mr-2 inline-flex size-11 shrink-0 items-center justify-center rounded-full outline-none hover:bg-black/5 focus-visible:ring-3 focus-visible:ring-action/40"
        >
          <X aria-hidden className="size-4" />
          <span className="sr-only">닫기</span>
        </button>
      ) : null}
    </div>
  );
}

function PartList({ items }: { items: string[] }) {
  return (
    <ul className="mt-1.5 flex flex-wrap gap-1.5">
      {items.map((t) => (
        <li key={t} className="rounded-lg bg-white/80 px-2 py-0.5 font-mono text-[13px] ring-1 ring-current/15">
          {t}
        </li>
      ))}
    </ul>
  );
}
