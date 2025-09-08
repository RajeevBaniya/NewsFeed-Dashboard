import React from 'react';
import ContentCard from './ContentCard';
import type { ContentItem } from '@/store/slices/feedSlice';

interface TrendingSectionProps {
  items: ContentItem[];
  loading: boolean;
  error: string | null;
  onOpen: (item: ContentItem) => void;
  onRetry: () => void;
}

/**
 * TrendingSection
 * Renders loading, error, empty, and grouped trending content states.
 */
export default function TrendingSection({ items, loading, error, onOpen, onRetry }: TrendingSectionProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">🔥 Trending Content</h2>
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-4 animate-pulse">
              <div className="w-full h-40 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Failed to load trending content</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
        <button onClick={onRetry} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          Try Again
        </button>
      </div>
    );
  }

  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">🔥</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No trending content available</h3>
        <p className="text-gray-600 dark:text-gray-400">Check back later for the latest trending content</p>
      </div>
    );
  }

  const grouped = {
    news: items.filter(i => i.type === 'news'),
    movie: items.filter(i => i.type === 'movie'),
    music: items.filter(i => i.type === 'music'),
    social: items.filter(i => i.type === 'social'),
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">🔥 Trending Content</h2>
        <span className="text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
          {items.length} items
        </span>
      </div>

      {grouped.news.length > 0 && (
        <SectionGrid title={`📰 Trending News (${grouped.news.length})`} items={grouped.news} onOpen={onOpen} />
      )}
      {grouped.movie.length > 0 && (
        <SectionGrid title={`🎬 Trending Movies (${grouped.movie.length})`} items={grouped.movie} onOpen={onOpen} />
      )}
      {grouped.music.length > 0 && (
        <SectionGrid title={`🎵 Trending Music (${grouped.music.length})`} items={grouped.music} onOpen={onOpen} />
      )}
      {grouped.social.length > 0 && (
        <SectionGrid title={`📱 Trending Social (${grouped.social.length})`} items={grouped.social} onOpen={onOpen} />
      )}
    </div>
  );
}

function SectionGrid({ title, items, onOpen }: { title: string; items: ContentItem[]; onOpen: (item: ContentItem) => void }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item, index) => (
          <ContentCard key={`${item.type}-${item.id}-${index}`} item={item} onOpen={onOpen} />
        ))}
      </div>
    </div>
  );
}


