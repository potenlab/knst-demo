"use client";

import { useState } from "react";

export default function LiteYouTube({ id, start = 0, title }: { id: string; start?: number; title: string }) {
  const [on, setOn] = useState(false);
  return (
    <div className="video">
      {on ? (
        <iframe
          src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0&start=${start}`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button type="button" onClick={() => setOn(true)} aria-label={`${title} 재생`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`} alt="" loading="lazy" />
          <span className="play" aria-hidden="true">▶</span>
        </button>
      )}
    </div>
  );
}
