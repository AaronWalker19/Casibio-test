import { useState } from "react";

interface HalArticle {
  title_s: string[];
  authLastNameFirstName_s: string[];
  uri_s: string;
}

interface HalCardProps {
  article: HalArticle;
}

export function HalCard({ article }: HalCardProps) {
  const [isHovering, setIsHovering] = useState(false);
  
  const title = Array.isArray(article.title_s) && article.title_s.length > 0 
    ? article.title_s[0] 
    : "Sans titre";
  
  const participants = Array.isArray(article.authLastNameFirstName_s)
    ? article.authLastNameFirstName_s
    : [];
  
  const handleCardClick = () => {
    if (article.uri_s) {
      window.open(article.uri_s, "_blank");
    }
  };

  return (
    <a
      href={article.uri_s}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => {
        e.preventDefault();
        handleCardClick();
      }}
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 overflow-hidden"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="p-6 h-full flex flex-col">
        {/* Titre */}
        <h3 className={`text-lg font-semibold mb-4 line-clamp-3 ${isHovering ? 'text-primary' : 'text-gray-900'} transition-colors`}>
          {title}
        </h3>
        
        {/* Participants */}
        <div className="flex-1 mb-4">
          <p className="text-sm text-gray-600 font-medium mb-2">Participants:</p>
          <div className="flex flex-wrap gap-2">
            {participants.length > 0 ? (
              participants.map((participant, idx) => (
                <span
                  key={idx}
                  className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                >
                  {participant}
                </span>
              ))
            ) : (
              <span className="text-xs text-gray-500">Non spécifiés</span>
            )}
          </div>
        </div>
        
        {/* Lien */}
        <div className="text-right pt-4 border-t border-gray-200">
          <span className="inline-block text-primary font-medium text-sm hover:underline">
            Consulter →
          </span>
        </div>
      </div>
    </a>
  );
}
