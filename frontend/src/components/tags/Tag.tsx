import { RecipeTag } from '@flayva-monorepo/shared/types';

interface TagProps {
  tag: RecipeTag;
  selected?: boolean;
  onClick?: () => void;
}

export default function Tag({ tag, selected = false, onClick }: TagProps) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-1 py-1 px-3 rounded-full text-sm ${
        selected
          ? 'bg-blue-100 text-blue-700 border border-blue-300'
          : 'bg-gray-100 text-gray-700 border border-gray-200'
      }`}
    >
      <span>{tag.emoji}</span>
      <span>{tag.tagName}</span>
    </button>
  );
}
