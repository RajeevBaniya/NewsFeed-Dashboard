'use client';

import { } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useModalState } from '@/hooks/useModalState';
import { useFeedPaging } from '@/hooks/useFeedPaging';
import { useInitialContentLoad } from '@/hooks/useInitialContentLoad';
import { useTrendingOnView } from '@/hooks/useTrendingOnView';
import { 
  fetchTrendingContent,
  reorderItems,
  ContentItem,
} from '@/store/slices/feedSlice';

// Components
// ContentCard is imported by subcomponents
import FavoritesSection from './FavoritesSection';
import TrendingSection from './TrendingSection';
import InfiniteLoader from './InfiniteLoader';
import UnifiedFeedGrid from './UnifiedFeedGrid';
import ContentModal from './ContentModal';
// ContentSectionWithToggle used inside SearchSections
import SearchHeader from './SearchHeader';
import SearchSections from './SearchSections';
import SearchEmpty from './SearchEmpty';
import DraggableFeed from './DraggableFeed';
// FilterBar used by SearchHeader
import FeedHeader from './FeedHeader';
import { ContentSectionSkeleton } from '../ui/LoadingSkeleton';
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
  const { modalItem, openModal, closeModal } = useModalState();
  
  // Redux state selectors
  const { 
    items, 
    temporaryOrder, 
    loading, 
    error, 
    hasInitialData, 
    hasCustomOrder, 
    pagination,
    trending
  } = useAppSelector((state) => state.feed);
  
  // Ensure trending state is always defined with fallback
  const trendingState = trending || {
    items: [],
    loading: false,
    error: null,
    lastUpdated: null
  };
  const categories = useAppSelector((state) => state.preferences.categories);
  const { query, results, isSearching } = useAppSelector((state) => state.search);
  const viewMode = useAppSelector((state) => state.preferences.viewMode);
  const favorites = useAppSelector((state) => state.favorites.items);

  // Initial content load
  useInitialContentLoad({ categories, hasInitialData, hasCustomOrder });

  // Trending loader on view change
  useTrendingOnView({
    activeSection,
    isLoading: Boolean(trendingState.loading),
    currentCount: trendingState.items.length,
  });

  // Handle opening content links in new tab
  const handleItemAction = (url: string) => {
    window.open(url, '_blank');
  };

  // Handle card click for modal opening
  const handleCardClick = (item: ContentItem) => {
    if (viewMode === 'normal') {
      openModal(item);
    }
  };

  // Handle drag-and-drop reordering of content items in unified feed
  const handleReorder = (dragIndex: number, hoverIndex: number) => {
    // Since we have a unified feed, we don't need section-specific logic
    // Just reorder within the unified feed
    dispatch(reorderItems({ dragIndex, hoverIndex, dragSection: 'feed', targetSection: 'feed' }));
  };

  // Calculate display items and search mode
  const currentItems = (viewMode === 'draggable' && temporaryOrder && temporaryOrder.length > 0) ? temporaryOrder : items;
  const displayItems = query ? results : currentItems;
  const isSearchMode = query && query.trim() !== '';

  // Infinite scroll logic via hook
  const { loadMoreContent } = useFeedPaging({
    loading,
    pagination,
    categories,
  });

  const { loadingRef } = useInfiniteScroll({
    hasMore: displayItems.length > 0,
    isLoading: loading,
    onLoadMore: loadMoreContent,
    threshold: 200
  });

  if (loading && items.length === 0) {
    return (
      <main className="flex-1 p-3 sm:p-4 lg:p-6 xl:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
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
      <main className="flex-1 p-3 sm:p-4 lg:p-6 xl:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-6 sm:py-8">
            <p className="text-red-600 dark:text-red-400 mb-4 text-sm sm:text-base">Error: {error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
            >
              Retry
            </button>
          </div>
        </div>
      </main>
    );
  }


  const renderFavoritesSection = () => (
    <FavoritesSection favorites={favorites} onItemAction={handleItemAction} />
  );

  const renderTrendingSection = () => (
    <TrendingSection
      items={trendingState.items}
      loading={Boolean(trendingState.loading)}
      error={trendingState.error}
      onOpen={handleCardClick}
      onRetry={() => dispatch(fetchTrendingContent())}
    />
  );


  if (isSearchMode) {
    return (
      <main className="flex-1 p-3 sm:p-4 lg:p-6 xl:p-8">
        <div className="max-w-6xl mx-auto">
          {isSearchMode && <SearchHeader query={query} isSearching={isSearching} />}

          {isSearchMode && results.length === 0 && !isSearching && (
            <SearchEmpty />
          )}

          {isSearchMode && results.length > 0 && (
            <SearchSections results={results} onItemAction={handleItemAction} />
          )}
        </div>
      </main>
    );
  }

  return (
    <DragDropProvider>
      <main className="flex-1 p-3 sm:p-4 lg:p-6 xl:p-8 overflow-visible">
        <div className="max-w-6xl mx-auto overflow-visible">
        {activeSection === 'feed' && (
          <div className="space-y-4 sm:space-y-6">
            <FeedHeader title="Content Feed" showSave={viewMode === 'draggable'} />

            {/* Unified Content Feed */}
            <div className="bg-white dark:bg-gray-800 rounded-xl border-2 border-dashed border-gray-200 dark:border-gray-500 p-3 sm:p-4 lg:p-6 overflow-visible">
              
              {displayItems.length > 0 ? (
                viewMode === 'draggable' ? (
                  <DraggableFeed
                    items={displayItems}
                    onReorder={handleReorder}
                    onItemAction={handleItemAction}
                  />
                ) : (
                  <UnifiedFeedGrid items={displayItems} onOpen={openModal} />
                )
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 dark:text-gray-400 text-lg">
                    Loading your personalized content...
                  </p>
                </div>
              )}

              {/* Infinite Scroll Loader */}
              {displayItems.length > 0 && (
                <InfiniteLoader loadingRef={loadingRef} isLoading={loading} />
              )}
            </div>

            {/* Modal only in non-draggable view */}
            {viewMode !== 'draggable' && (
              <ContentModal item={modalItem} onClose={closeModal} />
            )}
          </div>
        )}

        {activeSection === 'favorites' && renderFavoritesSection()}
        {activeSection === 'trending' && renderTrendingSection()}
        </div>
      </main>
    </DragDropProvider>
  );
}