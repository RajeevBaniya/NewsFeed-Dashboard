'use client';

import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import {
  fetchNewsContent,
  fetchMovieContent,
  fetchMusicContent,
  fetchSocialContent,
  reorderItems,
} from '@/store/slices/feedSlice';
import ContentCard from './ContentCard';
import ContentSectionWithToggle from './ContentSectionWithToggle';
import FilterBar from '../ui/FilterBar';
import ViewToggle from '../ui/ViewToggle';
import { ContentSectionSkeleton, SearchSkeleton } from '../ui/LoadingSkeleton';
import SaveButton from '../ui/SaveButton';
import { DragDropProvider } from '../drag-drop/DragDropContext';

interface MainContentProps {
  activeSection: string;
}

/**
 * MainContent component - Central hub for displaying and managing content feed
 * Handles content loading, search, filtering, and drag-and-drop functionality
 */
export default function MainContent({ activeSection }: MainContentProps) {
  const dispatch = useAppDispatch();
  
  // Redux state selectors
  const { 
    items, 
    temporaryOrder, 
    loading, 
    error, 
    hasInitialData, 
    hasCustomOrder, 
    hasUnsavedChanges 
  } = useAppSelector((state) => state.feed);
  const categories = useAppSelector((state) => state.preferences.categories);
  const { query, results, isSearching } = useAppSelector((state) => state.search);
  const viewMode = useAppSelector((state) => state.preferences.viewMode);
  const favorites = useAppSelector((state) => state.favorites.items);

  // Load content from APIs on component mount
  useEffect(() => {
    const loadContent = async () => {
      // Skip loading if we already have data or user has custom order
      if (hasInitialData || hasCustomOrder) {
        return;
      }
      
      try {
        // Fetch news for each selected category
        for (const category of categories) {
          await dispatch(fetchNewsContent(category));
        }
        
        // Fetch other content types
        await dispatch(fetchMovieContent());
        await dispatch(fetchMusicContent());
        await dispatch(fetchSocialContent());
      } catch (error) {
        console.error('Error loading content:', error);
      }
    };

    loadContent();
  }, [dispatch, categories, hasInitialData, hasCustomOrder]);

  // Handle opening content links in new tab
  const handleItemAction = (url: string) => {
    window.open(url, '_blank');
  };

  // Handle drag-and-drop reordering of content items
  const handleReorder = (dragIndex: number, hoverIndex: number, dragSection: string, targetSection: string) => {
    dispatch(reorderItems({ dragIndex, hoverIndex, dragSection, targetSection }));
  };

  if (loading && items.length === 0) {
    return (
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 12 }).map((_, index) => (
              <ContentSectionSkeleton key={index} />
            ))}
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

  // Use temporary order if it exists and we're in draggable mode, otherwise use items
  const currentItems = (viewMode === 'draggable' && temporaryOrder && temporaryOrder.length > 0) ? temporaryOrder : items;
  const displayItems = query ? results : currentItems;
  const isSearchMode = query && query.trim() !== '';

  const renderFavoritesSection = () => {
    if (favorites.length === 0) {
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((item, index) => (
            <ContentCard key={`favorite-${item.id}-${index}`} item={item} onAction={handleItemAction} />
          ))}
        </div>
      </div>
    );
  };

  const renderTrendingSection = () => {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">🔥</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Trending Content
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Trending content will be displayed here based on popular items
        </p>
      </div>
    );
  };


  if (isSearchMode) {
    return (
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {isSearchMode && (
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Search Results
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {isSearching ? 'Searching...' : `Found ${results.length} results for "${query}"`}
              </p>
              {isSearching ? <SearchSkeleton /> : <FilterBar />}
            </div>
          )}

          {isSearchMode && results.length === 0 && !isSearching && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No results found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Try adjusting your search terms or filters
              </p>
            </div>
          )}

          {isSearchMode && results.length > 0 && (
            <div className="space-y-8">
              {['news', 'movie', 'music', 'social'].map((contentType) => {
                const typeItems = results.filter(item => item.type === contentType);
                if (typeItems.length === 0) return null;
                
                const getSectionInfo = (type: string) => {
                  switch (type) {
                    case 'news':
                      return { title: 'News', icon: '📰' };
                    case 'movie':
                      return { title: 'Movies', icon: '🎬' };
                    case 'music':
                      return { title: 'Music', icon: '🎵' };
                    case 'social':
                      return { title: 'Social Posts', icon: '💬' };
                    default:
                      return { title: 'Content', icon: '📄' };
                  }
                };
                
                const sectionInfo = getSectionInfo(contentType);
                
                return (
                  <ContentSectionWithToggle
                    key={`search-${contentType}`}
                    title={`${sectionInfo.title} Results`}
                    icon={sectionInfo.icon}
                    items={typeItems}
                    viewMode="normal"
                    onItemAction={handleItemAction}
                    initialDisplayCount={6}
                  />
                );
              })}
            </div>
          )}
        </div>
      </main>
    );
  }

  return (
    <DragDropProvider>
      <main className="flex-1 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
        {activeSection === 'feed' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Content Feed
              </h2>
              <div className="flex items-center gap-4">
                {viewMode === 'draggable' && <SaveButton />}
                <ViewToggle />
              </div>
            </div>

            <div className="space-y-8">
              {['news', 'movie', 'music', 'social'].map((contentType) => {
                const typeItems = displayItems.filter(item => item.type === contentType);
                if (typeItems.length === 0) return null;
                
                const getSectionInfo = (type: string) => {
                  switch (type) {
                    case 'news':
                      return { title: 'News', icon: '📰' };
                    case 'movie':
                      return { title: 'Movies', icon: '🎬' };
                    case 'music':
                      return { title: 'Music', icon: '🎵' };
                    case 'social':
                      return { title: 'Social Posts', icon: '💬' };
                    default:
                      return { title: 'Content', icon: '📄' };
                  }
                };
                
                const sectionInfo = getSectionInfo(contentType);
                
                return (
                  <ContentSectionWithToggle
                    key={contentType}
                    title={sectionInfo.title}
                    icon={sectionInfo.icon}
                    items={typeItems}
                    viewMode={viewMode}
                    onItemAction={handleItemAction}
                    onReorder={viewMode === 'draggable' ? handleReorder : undefined}
                    initialDisplayCount={9}
                    sectionType={contentType}
                  />
                );
              })}
            </div>
          </div>
        )}

        {activeSection === 'favorites' && renderFavoritesSection()}
        {activeSection === 'trending' && renderTrendingSection()}
        </div>
      </main>
    </DragDropProvider>
  );
}