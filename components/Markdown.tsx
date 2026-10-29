import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/** Renders post markdown with brand typography. Raw HTML in the source is NOT rendered (safe by default). */
export default function Markdown({ source }: { source: string }) {
  return (
    <div className="prose-nst">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children }) => {
            const external = !!href && /^https?:\/\//.test(href);
            return (
              <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
                {children}
              </a>
            );
          },
          img: ({ src, alt }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={typeof src === "string" ? src : undefined} alt={alt ?? ""} loading="lazy" />
          ),
        }}
      >
        {source}
      </ReactMarkdown>
    </div>
  );
}
