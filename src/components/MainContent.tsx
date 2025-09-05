'use client';

import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {
  fetchNewsContent,
  fetchMovieContent,
  fetchMusicContent,
  fetchSocialContent,
} from '@/store/slices/feedSlice';
import ContentSection from './ContentSection';
import SidebarContent from './SidebarContent';
import { CONTENT_ICONS, DEFAULT_MAX_ITEMS, MUSIC_MAX_ITEMS } from '@/constants';

export default function MainContent() {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.feed);
  const categories = useAppSelector((state) => state.preferences.categories);

  useEffect(() => {
    const loadContent = async () => {
      try {
        for (const category of categories) {
          await dispatch(fetchNewsContent(category));
        }
        
        await dispatch(fetchMovieContent());
        await dispatch(fetchMusicContent());
        await dispatch(fetchSocialContent());
      } catch (error) {
        console.error('Error loading content:', error);
      }
    };

    loadContent();
  }, [dispatch, categories]);

  const handleItemAction = (url: string) => {
    window.open(url, '_blank');
  };

  if (loading && items.length === 0) {
    return (
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading content...</p>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-8">
            <p className="text-red-600 dark:text-red-400 mb-4">Error: {error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome section */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Welcome back!
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Here&apos;s your personalized content feed
          </p>
        </div>

        {/* Content sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main feed */}
          <div className="lg:col-span-2 space-y-6">
            <ContentSection
              title="News"
              icon={CONTENT_ICONS.NEWS}
              items={items}
              type="news"
              maxItems={DEFAULT_MAX_ITEMS}
              onItemAction={handleItemAction}
            />

            <ContentSection
              title="Movies"
              icon={CONTENT_ICONS.MOVIE}
              items={items}
              type="movie"
              maxItems={DEFAULT_MAX_ITEMS}
              onItemAction={handleItemAction}
            />

            <ContentSection
              title="Music"
              icon={CONTENT_ICONS.MUSIC}
              items={items}
              type="music"
              maxItems={MUSIC_MAX_ITEMS}
              onItemAction={handleItemAction}
            />

            <ContentSection
              title="Social Posts"
              icon={CONTENT_ICONS.SOCIAL}
              items={items}
              type="social"
              maxItems={DEFAULT_MAX_ITEMS}
              onItemAction={handleItemAction}
            />
          </div>

          {/* Sidebar content */}
          <SidebarContent />
        </div>
      </div>
    </main>
  );
}