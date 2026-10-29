"use client";

import { useRef, useState, type InputHTMLAttributes, type ReactNode } from "react";
import { CircleAlert, ImageOff, ImagePlus, Images, LoaderCircle, X } from "lucide-react";
import MediaLibrary from "./MediaLibrary";
import { ACCEPT, UploadError, mediaUrl, prepareImage, uploadImage } from "./image-upload";
import { isHttpUrl, isSitePath } from "./post-rules";
import { btn, field } from "./styles";

type Props = {
  value: string;
  onChange: (value: string) => void;
  /** id/name/aria-* for the URL input (from the editor's field helper). */
  inputProps: InputHTMLAttributes<HTMLInputElement>;
  maxLength: number;
  error: ReactNode;
  currentHtml: string;
};

/** 대표 이미지: pick from the media library, upload a new one, or paste an address. */
export default function CoverPicker({ value, onChange, inputProps, maxLength, error, currentHtml }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [upload, setUpload] = useState<{ progress: number; label: string } | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [imgFailed, setImgFailed] = useState<string | null>(null);
  const [announce, setAnnounce] = useState("");

  const v = value.trim();
  const ok = !!v && (isHttpUrl(v) || isSitePath(v));

  async function uploadCover(file: File) {
    setUploadError(null);
    setUpload({ progress: 0, label: "이미지 준비 중…" });
    setAnnounce("대표 이미지를 올리는 중입니다.");
    try {
      const prepared = await prepareImage(file);
      setUpload({ progress: 0.02, label: prepared.resized ? "크기를 줄여 올리는 중…" : "올리는 중…" });
      const res = await uploadImage(prepared, (f) => setUpload({ progress: f, label: `올리는 중… ${Math.round(f * 100)}%` }));
      onChange(res.url);
      setAnnounce("대표 이미지를 올리고 적용했습니다.");
    } catch (e) {
      const msg = e instanceof UploadError ? e.message : "대표 이미지를 올리지 못했습니다. 잠시 뒤 다시 시도해 주세요.";
      setUploadError(`${file.name}: ${msg}`);
      setAnnounce(msg);
    } finally {
      setUpload(null);
    }
  }

  return (
    <div>
      <span id="l-cover" className={field.label}>
        대표 이미지 <span className="font-normal text-muted-ink">(선택)</span>
      </span>
      <div className="mt-2 grid gap-4 sm:grid-cols-[240px_minmax(0,1fr)] sm:items-start xl:grid-cols-1">
        {/* preview */}
        <div className="relative aspect-[16/9] overflow-hidden rounded-2xl border border-hairline bg-air">
          {ok && imgFailed !== v ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={v} src={v} alt="대표 이미지 미리보기" className="size-full object-cover" onError={() => setImgFailed(v)} />
          ) : (
            <div className="flex size-full flex-col items-center justify-center gap-1.5 px-3 text-center text-[13px] text-muted-ink">
              <ImageOff aria-hidden className="size-5" />
              {imgFailed && imgFailed === v ? "이미지를 불러오지 못했습니다. 주소를 확인해 주세요." : "대표 이미지 없음"}
            </div>
          )}
          {upload ? (
            <div className="absolute inset-0 grid place-items-center bg-white/80 backdrop-blur-[1px]">
              <div className="w-3/4 text-center">
                <LoaderCircle aria-hidden className="mx-auto size-6 animate-spin text-pine" />
                <p className="mt-1.5 text-[13px] font-semibold text-pine">{upload.label}</p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-hairline">
                  <div className="h-full bg-action transition-[width] duration-200" style={{ width: `${Math.round(upload.progress * 100)}%` }} />
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={btn.secondary} onClick={() => setLibraryOpen(true)} disabled={!!upload}>
              <Images aria-hidden />
              보관함에서 고르기
            </button>
            <button type="button" className={btn.secondary} onClick={() => fileRef.current?.click()} disabled={!!upload}>
              <ImagePlus aria-hidden />새 이미지 올리기
            </button>
            {v ? (
              <button type="button" className={btn.ghost} onClick={() => onChange("")} disabled={!!upload}>
                <X aria-hidden />
                지우기
              </button>
            ) : null}
            <input
              ref={fileRef}
              type="file"
              accept={ACCEPT}
              className="sr-only"
              tabIndex={-1}
              aria-hidden
              onChange={(e) => {
                const f = e.target.files?.[0];
                e.target.value = "";
                if (f) void uploadCover(f);
              }}
            />
          </div>

          <label htmlFor={inputProps.id} className="mt-4 block text-[14px] font-semibold text-ink">
            또는 이미지 주소
          </label>
          <input
            {...inputProps}
            type="text"
            inputMode="url"
            maxLength={maxLength}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://… 또는 /media/… · /img/hero.webp"
            className={`${field.input} mt-1.5`}
            autoComplete="off"
            spellCheck={false}
          />
          <p id="h-cover" className={field.hint}>
            글 목록 카드와 카카오톡·검색 공유 미리보기에 쓰입니다. 가로로 긴(16:9) 사진이 잘 어울립니다.
          </p>
          {error}
          {uploadError ? (
            <p role="alert" className={field.error}>
              <CircleAlert aria-hidden className="mt-0.5 size-4 shrink-0" />
              {uploadError}
            </p>
          ) : null}
          <p className="sr-only" aria-live="polite">
            {announce}
          </p>
        </div>
      </div>

      <MediaLibrary
        open={libraryOpen}
        onClose={() => setLibraryOpen(false)}
        purpose="cover"
        currentHtml={currentHtml}
        onPick={(item) => {
          onChange(mediaUrl(item));
          setAnnounce(`「${item.filename || item.id}」을(를) 대표 이미지로 정했습니다.`);
        }}
        onUploadFiles={(files) => files[0] && void uploadCover(files[0])}
      />
    </div>
  );
}
