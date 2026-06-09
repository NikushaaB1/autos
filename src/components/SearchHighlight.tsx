import React from 'react';

interface SearchHighlightProps {
  text: string | number;
  query: string;
}

export const SearchHighlight: React.FC<SearchHighlightProps> = ({ text, query }) => {
  const strText = String(text);
  
  if (!query || !query.trim()) {
    return <span>{strText}</span>;
  }

  // Escape special regex characters
  const escapedQuery = query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  const parts = strText.split(regex);

  return (
    <span>
      {parts.map((part, index) =>
        regex.test(part) ? (
          <span key={index} className="highlight-match">
            {part}
          </span>
        ) : (
          part
        )
      )}
    </span>
  );
};

export default SearchHighlight;
