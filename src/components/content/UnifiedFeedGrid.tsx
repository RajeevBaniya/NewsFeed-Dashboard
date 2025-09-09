import React from 'react';
import ContentCard from './ContentCard';
import type { ContentItem } from '@/store/slices/feedSlice';

interface UnifiedFeedGridProps {
  items: ContentItem[];
  onOpen: (item: ContentItem) => void;
}

/**
 * UnifiedFeedGrid
 * Read-only grid for normal view mode.
 */
export default function UnifiedFeedGrid({ items, onOpen }: UnifiedFeedGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      {items.filter(i => i && i.id).map((item, index) => (
        <ContentCard key={`${item.type}-${item.id}-${index}`} item={item} onOpen={onOpen} />
      ))}
    </div>
  );
}


