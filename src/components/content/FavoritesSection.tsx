import React from 'react';
import ContentCard from './ContentCard';
import type { ContentItem } from '@/store/slices/feedSlice';

interface FavoritesSectionProps {
  favorites: ContentItem[];
  onItemAction: (url: string) => void;
}

/**
 * FavoritesSection
 * Displays user's favorited content items with count and empty state.
 */
export default function FavoritesSection({ favorites, onItemAction }: FavoritesSectionProps) {
  if (!favorites || favorites.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">💝</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          No favorites yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Click the heart icon on any content to add it to your favorites
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          ❤️ My Favorites
        </h2>
        <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
          {favorites.length} items
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {favorites.filter(item => item && item.id).map((item, index) => (
          <ContentCard key={`favorite-${item.id}-${index}`} item={item} onAction={onItemAction} />
        ))}
      </div>
    </div>
  );
}


