interface HtmlContentProps {
  html: string;
  className?: string;
}

export default function HtmlContent({ html, className = "" }: HtmlContentProps) {
  if (!html || !html.trim()) {
    return <p className={`text-gray-500 italic ${className}`}>Non complété</p>;
  }

  return (
    <>
      <style>{`
        .rich-text-content a {
          color: #0066cc;
          text-decoration: underline;
          cursor: pointer;
        }
        .rich-text-content a:hover {
          color: #0052a3;
        }
        .rich-text-content ul,
        .rich-text-content ol {
          padding-left: 2rem;
          margin: 1em 0;
          list-style-position: outside;
        }
        .rich-text-content ul {
          list-style-type: disc;
        }
        .rich-text-content ol {
          list-style-type: decimal;
        }
        .rich-text-content li {
          margin-bottom: 0.5em;
          display: list-item;
        }
      `}</style>
      <div
        className={`rich-text-content font-['Inter:Regular',sans-serif] font-normal leading-6 sm:leading-7 text-sm sm:text-base md:text-base text-black text-justify w-full ${className}`}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </>
  );
}
