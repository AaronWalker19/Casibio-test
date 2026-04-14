interface HtmlContentProps {
  html: string;
  className?: string;
}

export default function HtmlContent({ html, className = "" }: HtmlContentProps) {
  if (!html || !html.trim()) {
    return <p className={`text-gray-500 italic ${className}`}>Non complété</p>;
  }

  return (
    <div
      className={`rich-text-content font-['Inter:Regular',sans-serif] font-normal leading-6 sm:leading-7 text-sm sm:text-base md:text-base text-black text-justify w-full ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
