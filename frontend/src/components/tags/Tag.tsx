import { RecipeTag } from '@flayva-monorepo/shared/types';

interface TagProps {
  tag: RecipeTag;
  selected?: boolean;
  onClick?: () => void;
  transparent?: boolean;
}

export default function Tag({ 
  tag, 
  selected = false, 
  onClick,
  transparent = false 
}: TagProps) {
  console.log({tag})
  
  // Determine the background and text colors based on props
  const bgClass = transparent 
    ? selected 
      ? 'bg-blue-100/70 border-blue-300/70' // Semi-transparent selected
      : 'bg-gray-100/70 border-gray-200/70' // Semi-transparent normal
    : selected
      ? 'bg-blue-100 border-blue-300' // Fully opaque selected
      : 'bg-gray-100 border-gray-200'; // Fully opaque normal
      
  // Text color remains fully opaque
  const textClass = selected ? 'text-blue-700' : 'text-gray-700';
  
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-1 py-1 px-3 rounded-full text-sm ${bgClass} ${textClass} border text-nowrap`}
    >
      <span>{tag.emoji}</span>
      <span>{tag.name || tag.tagName}</span>
    </button>
  );
}
