"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { CircleAlert, ImagePlus, LoaderCircle, RefreshCw, Trash2, X } from "lucide-react";
import { ACCEPT, deleteMediaItem, fetchMedia, formatBytes, mediaUrl, type MediaItem } from "./image-upload";
import { btn } from "./styles";

type Props = {
  open: boolean;
  onClose: () => void;
  /** Called with the chosen image; the dialog closes itself afterwards. */
  onPick: (item: MediaItem) => void;
  /** "insert" = put it in the body, "cover" = use as 대표 이미지. Only changes the wording. */
  purpose: "insert" | "cover";
  /** Current body HTML, to flag images this post already uses. */
  currentHtml?: string;
  /** Optional: let the dialog start an upload (handled by the caller), e.g. to upload then pick. */
  onUploadFiles?: (files: File[]) => void;
};

/**
 * 미디어 보관함 — every uploaded image (newest first). Click to use; delete with confirmation.
 * Native <dialog> (focus trap, Esc to close, inert background) styled like the admin cards.
 */
export default function MediaLibrary({ open, onClose, onPick, purpose, currentHtml = "", onUploadFiles }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const titleId = useId();
  const [items, setItems] = useState<MediaItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [status, setStatus] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await fetchMedia());
    } catch (e) {
      setError(e instanceof Error ? e.message : "보관함을 불러오지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      setStatus("");
      void load();
    } else if (!open && d.open) d.close();
  }, [open, load]);

  async function remove(item: MediaItem) {
    const inThisPost = currentHtml.includes(`/media/${item.id}`);
    const first =
      `「${item.filename || item.id}」을(를) 보관함에서 삭제할까요? 되돌릴 수 없습니다.` +
      (inThisPost ? "\n\n지금 쓰는 이 글의 본문에도 들어 있습니다. 삭제하면 그 자리에 이미지가 깨져 보입니다." : "");
    if (!window.confirm(first)) return;
    setBusyId(item.id);
    setError(null);
    let res = await deleteMediaItem(item.id);
    if (!res.ok && res.usedBy?.length) {
      const list = res.usedBy
        .slice(0, 8)
        .map((p) => `· ${p.title || "(제목 없음)"} (${p.status === "published" ? "발행" : "초안"})`)
        .join("\n");
      const again = window.confirm(
        `이 이미지는 아래 글에서 쓰고 있습니다.\n${list}\n\n그래도 삭제할까요? 삭제하면 그 글들에서 이미지가 깨져 보입니다. 먼저 글에서 이미지를 빼는 것을 권합니다.`,
      );
      if (!again) {
        setBusyId(null);
        setStatus("삭제를 취소했습니다.");
        return;
      }
      res = await deleteMediaItem(item.id, true);
    }
    setBusyId(null);
    if (res.ok) {
      setItems((list) => (list ? list.filter((i) => i.id !== item.id) : list));
      setStatus(`「${item.filename || item.id}」을(를) 삭제했습니다.`);
    } else {
      setError(res.error);
    }
  }

  const pickLabel = purpose === "cover" ? "대표 이미지로 쓰기" : "본문에 넣기";

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose(); // backdrop click
      }}
      className="m-auto max-h-[min(88dvh,900px)] w-[calc(100%-1.5rem)] max-w-[1040px] overflow-hidden rounded-3xl border border-hairline bg-white p-0 text-ink shadow-[0_40px_120px_-40px_rgba(14,59,50,.7)] backdrop:bg-pine/45 backdrop:backdrop-blur-[2px]"
    >
      <div className="flex max-h-[min(88dvh,900px)] flex-col">
        <div className="flex flex-wrap items-center gap-3 border-b border-hairline px-5 py-4 sm:px-7">
          <div className="min-w-0 flex-1">
            <h2 id={titleId} className="font-display text-[22px] font-bold text-pine">
              미디어 보관함
            </h2>
            <p className="text-[13.5px] text-muted-ink">
              {purpose === "cover" ? "대표 이미지로 쓸 사진을 고르세요." : "누르면 커서 위치에 이미지가 들어갑니다."} 올린 이미지는 모든 글에서 다시 쓸 수 있습니다.
            </p>
          </div>
          {onUploadFiles ? (
            <>
              <input
                ref={fileRef}
                type="file"
                accept={ACCEPT}
                multiple={purpose === "insert"}
                className="sr-only"
                tabIndex={-1}
                aria-hidden
                onChange={(e) => {
                  const files = Array.from(e.target.files ?? []);
                  e.target.value = "";
                  if (files.length) {
                    onUploadFiles(files);
                    onClose();
                  }
                }}
              />
              <button type="button" className={btn.secondary} onClick={() => fileRef.current?.click()}>
                <ImagePlus aria-hidden />새 이미지 올리기
              </button>
            </>
          ) : null}
          <button
            type="button"
            onClick={onClose}
            className="inline-flex size-11 items-center justify-center rounded-full text-pine outline-none hover:bg-mint/50 focus-visible:ring-3 focus-visible:ring-action/40"
          >
            <X aria-hidden className="size-5" />
            <span className="sr-only">보관함 닫기</span>
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-7">
          <p role="status" aria-live="polite" className="sr-only">
            {loading ? "보관함을 불러오는 중입니다." : status}
          </p>
          {status && !loading ? <p className="mb-4 text-[14px] font-medium text-pine">{status}</p> : null}
          {error ? (
            <div role="alert" className="mb-4 flex flex-wrap items-start gap-3 rounded-2xl border border-[#b42318]/25 bg-[#fff4f2] px-4 py-3 text-[14.5px] text-[#8a1c13]">
              <CircleAlert aria-hidden className="mt-0.5 size-5 shrink-0" />
              <p className="min-w-0 flex-1 leading-relaxed">{error}</p>
              <button type="button" className={btn.row} onClick={() => void load()}>
                <RefreshCw aria-hidden />
                다시 불러오기
              </button>
            </div>
          ) : null}

          {loading && !items ? (
            <ul aria-hidden className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }, (_, i) => (
                <li key={i} className="overflow-hidden rounded-2xl border border-hairline">
                  <div className="aspect-[4/3] animate-pulse bg-mint/50" />
                  <div className="space-y-2 p-3">
                    <div className="h-3 w-3/4 animate-pulse rounded bg-hairline" />
                    <div className="h-3 w-1/2 animate-pulse rounded bg-hairline" />
                  </div>
                </li>
              ))}
            </ul>
          ) : items && items.length === 0 ? (
            <div className="px-4 py-14 text-center">
              <div aria-hidden className="mx-auto grid size-14 place-items-center rounded-full bg-mint text-pine">
                <ImagePlus className="size-6" />
              </div>
              <p className="mt-4 font-display text-[19px] font-bold text-pine">아직 올린 이미지가 없습니다</p>
              <p className="mt-1 text-[14.5px] text-muted-ink">
                {onUploadFiles ? "‘새 이미지 올리기’를 누르거나, " : ""}본문에 이미지를 끌어다 놓거나 붙여넣으면 여기에 모입니다.
              </p>
            </div>
          ) : items ? (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {items.map((item) => {
                const used = currentHtml.includes(`/media/${item.id}`);
                const busy = busyId === item.id;
                return (
                  <li key={item.id} className="group relative flex flex-col overflow-hidden rounded-2xl border border-hairline bg-white transition-colors hover:border-pine/40">
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => {
                        onPick(item);
                        onClose();
                      }}
                      className="relative block aspect-[4/3] w-full overflow-hidden bg-air outline-none focus-visible:ring-3 focus-visible:ring-inset focus-visible:ring-action/50"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={mediaUrl(item)} alt="" loading="lazy" decoding="async" className="size-full object-contain" />
                      <span className="sr-only">
                        {item.filename || item.id} — {pickLabel}
                      </span>
                      <span
                        aria-hidden
                        className="absolute inset-x-2 bottom-2 rounded-full bg-action px-3 py-1.5 text-center text-[13px] font-semibold text-white opacity-0 shadow transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
                      >
                        {pickLabel}
                      </span>
                      {used ? (
                        <span className="absolute left-2 top-2 rounded-full bg-pine px-2.5 py-0.5 text-[12px] font-semibold text-white">이 글에 사용 중</span>
                      ) : null}
                    </button>
                    <div className="flex items-start gap-1 p-2.5 pl-3">
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[13.5px] font-semibold text-ink" title={item.filename}>
                          {item.filename || item.id}
                        </p>
                        <p className="text-[12.5px] tabular-nums text-muted-ink">
                          {formatBytes(item.size)}
                          {item.width && item.height ? ` · ${item.width}×${item.height}` : ""}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => void remove(item)}
                        disabled={busy}
                        className="-mr-1 inline-flex size-11 shrink-0 items-center justify-center rounded-full text-[#b42318] outline-none hover:bg-[#fff4f2] focus-visible:ring-3 focus-visible:ring-action/40 disabled:opacity-50"
                      >
                        {busy ? <LoaderCircle aria-hidden className="size-[18px] animate-spin" /> : <Trash2 aria-hidden className="size-[18px]" />}
                        <span className="sr-only">「{item.filename || item.id}」 삭제</span>
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : null}
        </div>
      </div>
    </dialog>
  );
}
