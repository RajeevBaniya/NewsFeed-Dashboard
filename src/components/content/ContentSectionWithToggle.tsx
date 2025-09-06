import { useState } from 'react';
import ContentCard from './ContentCard';
import DraggableContentCard from '../drag-drop/DraggableContentCard';
import DraggableGrid from '../drag-drop/DraggableGrid';
import { ContentItem } from '@/store/slices/feedSlice';

interface ContentSectionWithToggleProps {
  title: string;
  icon: string;
  items: ContentItem[];
  viewMode: 'normal' | 'draggable';
  onItemAction: (url: string) => void;
  onReorder?: (dragIndex: number, hoverIndex: number, dragSection: string, targetSection: string) => void;
  initialDisplayCount?: number;
  sectionType?: string;
}

export default function ContentSectionWithToggle({
  title,
  icon,
  items,
  viewMode,
  onItemAction,
  onReorder,
  initialDisplayCount = 9,
  sectionType = 'content',
}: ContentSectionWithToggleProps) {
  const [showAll, setShowAll] = useState(false);
  
  if (items.length === 0) {
    return null;
  }

  const displayItems = showAll ? items : items.slice(0, initialDisplayCount);
  const hasMoreItems = items.length > initialDisplayCount;

  const toggleShowMore = () => {
    setShowAll(!showAll);
  };

  return (
    <div className={`space-y-4 border-2 rounded-lg p-4 ${
      viewMode === 'draggable' 
        ? 'border-solid border-green-500 dark:border-green-300 bg-green-50/30 dark:bg-green-900/20' 
        : 'border-dashed border-blue-400 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-900/20'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {icon} {title}
            {viewMode === 'draggable' && (
              <span className="ml-2 text-sm text-green-600 dark:text-green-300 font-normal">
                (Draggable)
              </span>
            )}
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-full">
            {items.length} items
          </span>
          {viewMode === 'draggable' && (
            <span className="text-xs text-gray-400 dark:text-gray-500 bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded-full">
              Drag to reorder
            </span>
          )}
        </div>
        
        {hasMoreItems && (
          <button
            onClick={toggleShowMore}
            className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors"
          >
            {showAll ? 'Show Less' : `Show More (${items.length - initialDisplayCount} more)`}
          </button>
        )}
      </div>
      
      {viewMode === 'draggable' && onReorder ? (
        <DraggableGrid
          items={displayItems}
          onReorder={onReorder}
          onItemAction={onItemAction}
          section={sectionType}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayItems.map((item, index) => (
            <ContentCard
              key={`${title}-${item.id}-${index}`}
              item={item}
              onAction={onItemAction}
            />
          ))}
        </div>
      )}
    </div>
  );
}
