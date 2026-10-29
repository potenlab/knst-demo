/** Mint-air mesh + breath rings behind blog page headers (same recipe as components/Hero.tsx). */
export default function BlogBackdrop({ rings = true }: { rings?: boolean }) {
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-20"
        style={{
          background: [
            "radial-gradient(46rem 30rem at 88% 8%, rgba(205,238,221,.95), rgba(205,238,221,0) 62%)",
            "radial-gradient(30rem 22rem at -6% 90%, rgba(205,238,221,.6), rgba(205,238,221,0) 60%)",
            "radial-gradient(24rem 18rem at 55% 100%, rgba(0,71,156,.05), rgba(0,71,156,0) 70%)",
            "linear-gradient(180deg, #f6faf7 0%, #eef8f2 70%, #f6faf7 100%)",
          ].join(","),
        }}
      />
      {rings && (
        <div
          aria-hidden
          className="pointer-events-none absolute -right-40 -top-48 -z-10 size-[34rem] sm:-right-24 lg:-right-10 lg:-top-40 lg:size-[42rem]"
        >
          {[1, 0.76, 0.54, 0.34].map((k, i) => (
            <span
              key={k}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border motion-safe:animate-[breathe_10s_cubic-bezier(.4,0,.2,1)_infinite]"
              style={{
                width: `${k * 100}%`,
                height: `${k * 100}%`,
                borderColor: `rgba(47,143,107,${0.12 + i * 0.05})`,
                animationDelay: `${i * -2}s`,
              }}
            />
          ))}
        </div>
      )}
      {/* melt into the page background so the section has no hard bottom edge */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-b from-[#f6faf7]/0 to-[#f6faf7]" />
    </>
  );
}
