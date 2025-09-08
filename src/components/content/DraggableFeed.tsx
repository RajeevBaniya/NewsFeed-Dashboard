import React from 'react';
import DraggableGrid from '../drag-drop/DraggableGrid';
import type { ContentItem } from '@/store/slices/feedSlice';

interface DraggableFeedProps {
  items: ContentItem[];
  onReorder: (dragIndex: number, hoverIndex: number) => void;
  onItemAction: (url: string) => void;
}

/**
 * DraggableFeed
 * Thin wrapper around DraggableGrid to keep MainContent minimal.
 */
export default function DraggableFeed({ items, onReorder, onItemAction }: DraggableFeedProps) {
  return (
    <DraggableGrid
      items={items}
      onReorder={onReorder}
      onItemAction={onItemAction}
      section="feed"
    />
  );
}


