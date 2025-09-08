import React from 'react';
import ContentSectionWithToggle from './ContentSectionWithToggle';
import type { ContentItem } from '@/store/slices/feedSlice';

interface SearchSectionsProps {
  results: ContentItem[];
  onItemAction: (url: string) => void;
}

/**
 * SearchSections
 * Renders grouped search results using the existing toggle section component.
 */
export default function SearchSections({ results, onItemAction }: SearchSectionsProps) {
  const groups: Array<{ key: string; title: string; icon: string }> = [
    { key: 'news', title: 'News', icon: '📰' },
    { key: 'movie', title: 'Movies', icon: '🎬' },
    { key: 'music', title: 'Music', icon: '🎵' },
    { key: 'social', title: 'Social Posts', icon: '💬' },
  ];

  return (
    <div className="space-y-8">
      {groups.map((g) => {
        const typeItems = results.filter((item) => item.type === g.key);
        if (typeItems.length === 0) return null;
        return (
          <ContentSectionWithToggle
            key={`search-${g.key}`}
            title={`${g.title} Results`}
            icon={g.icon}
            items={typeItems}
            viewMode="normal"
            onItemAction={onItemAction}
            initialDisplayCount={12}
          />
        );
      })}
    </div>
  );
}


