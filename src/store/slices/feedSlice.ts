import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchNewsArticles } from '@/utils/newsApi';
import { fetchPopularMovies } from '@/utils/tmdbApi';
import { fetchFeaturedPlaylists } from '@/utils/spotifyApi';
import { fetchSocialPosts } from '@/utils/socialApi';
import { fetchAllTrendingContent } from '@/utils/trendingApi';
import { filterNewItems, removeDuplicates } from '@/utils/deduplication';

/**
 * Unified content item interface for all content types
 * Supports news, movies, music, and social posts with type-specific fields
 */
export interface ContentItem {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  source: string;
  category: string;
  publishedAt: string;
  readTime?: number;
  url: string;
  type: 'news' | 'movie' | 'music' | 'social';
  
  // Type-specific optional fields
  author?: string;        // For social posts
  platform?: string;     // For social posts
  likes?: number;         // For social posts
  hashtags?: string[];    // For social posts
  rating?: number;        // For movies
  genre?: string;         // For movies/music
  artist?: string;        // For music
  album?: string;         // For music
  duration?: number;      // For music
}

/**
 * Pagination state for each content type
 */
export interface ContentPagination {
  currentPage: number;
  hasMore: boolean;
  isLoading: boolean;
  totalLoaded: number;
}

/**
 * Feed state management for content items and drag-and-drop functionality
 * Manages both permanent order (items) and temporary order (temporaryOrder)
 */
export interface FeedState {
  items: ContentItem[];           // Permanent content order (saved)
  temporaryOrder: ContentItem[];  // Temporary order for drag-and-drop preview
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
  hasInitialData: boolean;        // Whether initial API data has been loaded
  hasCustomOrder: boolean;        // Whether user has saved a custom order
  hasUnsavedChanges: boolean;     // Whether there are unsaved drag-and-drop changes
  pagination: {
    news: ContentPagination;
    movie: ContentPagination;
    music: ContentPagination;
    social: ContentPagination;
  };
  trending: {
    items: ContentItem[];
    loading: boolean;
    error: string | null;
    lastUpdated: string | null;
  };
}

const initialState: FeedState = {
  items: [],
  temporaryOrder: [],
  loading: false,
  error: null,
  lastUpdated: null,
  hasInitialData: false,
  hasCustomOrder: false,
  hasUnsavedChanges: false,
  pagination: {
    news: { currentPage: 1, hasMore: true, isLoading: false, totalLoaded: 0 },
    movie: { currentPage: 1, hasMore: true, isLoading: false, totalLoaded: 0 },
    music: { currentPage: 1, hasMore: true, isLoading: false, totalLoaded: 0 },
    social: { currentPage: 1, hasMore: true, isLoading: false, totalLoaded: 0 },
  },
  trending: {
    items: [],
    loading: false,
    error: null,
    lastUpdated: null,
  },
};

/**
 * Helper function to ensure pagination state is initialized
 */
const ensurePaginationState = (state: FeedState) => {
  if (!state.pagination) {
    state.pagination = {
      news: { currentPage: 1, hasMore: true, isLoading: false, totalLoaded: 0 },
      movie: { currentPage: 1, hasMore: true, isLoading: false, totalLoaded: 0 },
      music: { currentPage: 1, hasMore: true, isLoading: false, totalLoaded: 0 },
      social: { currentPage: 1, hasMore: true, isLoading: false, totalLoaded: 0 },
    };
  }
};

/**
 * Helper function to ensure trending state is initialized
 */
const ensureTrendingState = (state: FeedState) => {
  if (!state.trending) {
    state.trending = {
      items: [],
      loading: false,
      error: null,
      lastUpdated: null,
    };
  }
};

/**
 * Async thunk for fetching news articles from NewsAPI
 * Transforms API response to unified ContentItem format
 */
export const fetchNewsContent = createAsyncThunk(
  'feed/fetchNews',
  async ({ category = 'technology', page = 1 }: { category?: string; page?: number } = {}) => {
    const newsArticles = await fetchNewsArticles(category, page);
    return newsArticles.map(article => ({
      id: article.id,
      title: article.title,
      description: article.description,
      imageUrl: article.urlToImage,
      source: article.source.name,
      category: article.category,
      publishedAt: article.publishedAt,
      readTime: Math.ceil(article.description.length / 200), // Estimate read time
      url: article.url,
      type: 'news' as const
    }));
  }
);

export const fetchMovieContent = createAsyncThunk(
  'feed/fetchMovies',
  async (page: number = 1) => {
    const movies = await fetchPopularMovies(page);
    return movies.map(movie => ({
      id: movie.id,
      title: movie.title,
      description: movie.description,
      imageUrl: movie.imageUrl,
      source: 'TMDB',
      category: 'movies',
      publishedAt: movie.releaseDate,
      url: movie.url,
      type: 'movie' as const,
      rating: movie.rating,
      genre: movie.genre
    }));
  }
);

export const fetchMusicContent = createAsyncThunk(
  'feed/fetchMusic',
  async () => {
    const tracks = await fetchFeaturedPlaylists();
    return tracks.map(track => ({
      id: track.id,
      title: track.title,
      description: track.description,
      imageUrl: track.imageUrl,
      source: 'Spotify',
      category: 'music',
      publishedAt: new Date().toISOString(),
      url: track.url,
      type: 'music' as const,
      artist: track.artist,
      album: track.album,
      duration: track.duration
    }));
  }
);

export const fetchSocialContent = createAsyncThunk(
  'feed/fetchSocial',
  async () => {
    const posts = await fetchSocialPosts();
    return posts.map(post => ({
      id: post.id,
      title: post.title,
      description: post.description,
      imageUrl: post.imageUrl,
      source: post.platform,
      category: 'social',
      publishedAt: post.publishedAt,
      url: post.url,
      type: 'social' as const,
      author: post.author,
      platform: post.platform,
      likes: post.likes,
      hashtags: post.hashtags
    }));
  }
);

/**
 * Fetch trending content across all categories
 */
export const fetchTrendingContent = createAsyncThunk(
  'feed/fetchTrending',
  async () => {
    const trendingData = await fetchAllTrendingContent();
    return trendingData.all;
  }
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setFeedItems: (state, action: PayloadAction<ContentItem[]>) => {
      // Filter out any null or invalid items
      state.items = action.payload.filter(item => item && item.id);
      state.lastUpdated = new Date().toISOString();
    },
    addFeedItems: (state, action: PayloadAction<ContentItem[]>) => {
      // Filter out any null or invalid items first
      const validItems = action.payload.filter(item => item && item.id);
      const newItems = filterNewItems(state.items, validItems);
      state.items = [...state.items, ...newItems];
      // Final deduplication step to ensure no duplicates
      state.items = removeDuplicates(state.items);
      state.lastUpdated = new Date().toISOString();
    },
    removeFeedItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    clearFeed: (state) => {
      state.items = [];
      state.temporaryOrder = [];
      state.lastUpdated = null;
      state.hasInitialData = false;
      state.hasCustomOrder = false;
      state.hasUnsavedChanges = false;
      // Reset pagination state
      state.pagination = {
        news: { currentPage: 1, hasMore: true, isLoading: false, totalLoaded: 0 },
        movie: { currentPage: 1, hasMore: true, isLoading: false, totalLoaded: 0 },
        music: { currentPage: 1, hasMore: true, isLoading: false, totalLoaded: 0 },
        social: { currentPage: 1, hasMore: true, isLoading: false, totalLoaded: 0 },
      };
    },
    reorderItems: (state, action: PayloadAction<{ dragIndex: number; hoverIndex: number; dragSection?: string; targetSection?: string }>) => {
      const { dragIndex, hoverIndex } = action.payload;
      
      // Use temporaryOrder if it exists, otherwise use items, and filter out null items
      const currentItems = ((state.temporaryOrder && state.temporaryOrder.length > 0) ? state.temporaryOrder : state.items)
        .filter(item => item && item.id && item.type);
      
      // For unified feed, we just reorder within the entire feed
      if (dragIndex >= 0 && hoverIndex >= 0 && dragIndex < currentItems.length && hoverIndex < currentItems.length) {
        const newItems = [...currentItems];
        const draggedItem = newItems[dragIndex];
        
        if (!draggedItem) return; // Safety check
        
        // Remove the dragged item
        newItems.splice(dragIndex, 1);
        // Insert it at the new position
        newItems.splice(hoverIndex, 0, draggedItem);
        
        state.temporaryOrder = newItems;
        state.hasUnsavedChanges = true;
        state.lastUpdated = new Date().toISOString();
      }
      
    },
    setCustomOrder: (state, action: PayloadAction<ContentItem[]>) => {
      state.items = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    clearCache: (state) => {
      state.items = [];
      state.temporaryOrder = [];
      state.lastUpdated = null;
      state.loading = false;
      state.error = null;
      state.hasInitialData = false;
      state.hasCustomOrder = false;
      state.hasUnsavedChanges = false;
    },
    markAsUnsaved: (state) => {
      state.hasUnsavedChanges = true;
    },
    saveChanges: (state) => {
      if (state.temporaryOrder && state.temporaryOrder.length > 0) {
        state.items = [...state.temporaryOrder];
        state.temporaryOrder = [];
      }
      state.hasUnsavedChanges = false;
      state.hasCustomOrder = true;
      state.lastUpdated = new Date().toISOString();
    },
    // Trending reducers
    setTrendingLoading: (state, action: PayloadAction<boolean>) => {
      ensureTrendingState(state);
      state.trending.loading = action.payload;
    },
    setTrendingError: (state, action: PayloadAction<string | null>) => {
      ensureTrendingState(state);
      state.trending.error = action.payload;
    },
    clearTrending: (state) => {
      ensureTrendingState(state);
      state.trending.items = [];
      state.trending.loading = false;
      state.trending.error = null;
      state.trending.lastUpdated = null;
    },
    discardChanges: (state) => {
      state.temporaryOrder = [];
      state.hasUnsavedChanges = false;
    },
    debugFeed: (state) => {
      console.log('🔍 Feed Debug Info:');
      console.log('Total items:', state.items.length);
      console.log('News items:', state.items.filter(item => item.type === 'news').length);
      console.log('Movie items:', state.items.filter(item => item.type === 'movie').length);
      console.log('Music items:', state.items.filter(item => item.type === 'music').length);
      console.log('Social items:', state.items.filter(item => item.type === 'social').length);
      
      // Check for duplicates by URL
      const urls = state.items.map(item => item.url).filter(url => url !== '#');
      const uniqueUrls = new Set(urls);
      console.log('Unique URLs:', uniqueUrls.size, 'Total URLs:', urls.length);
      
      // Check for duplicates by title
      const titles = state.items.map(item => item.title);
      const uniqueTitles = new Set(titles);
      console.log('Unique titles:', uniqueTitles.size, 'Total titles:', titles.length);
    },
    setPaginationLoading: (state, action: PayloadAction<{ contentType: keyof FeedState['pagination']; isLoading: boolean }>) => {
      const { contentType, isLoading } = action.payload;
      ensurePaginationState(state);
      state.pagination[contentType].isLoading = isLoading;
    },
    setPaginationHasMore: (state, action: PayloadAction<{ contentType: keyof FeedState['pagination']; hasMore: boolean }>) => {
      const { contentType, hasMore } = action.payload;
      ensurePaginationState(state);
      state.pagination[contentType].hasMore = hasMore;
    },
    incrementPaginationPage: (state, action: PayloadAction<keyof FeedState['pagination']>) => {
      const contentType = action.payload;
      ensurePaginationState(state);
      state.pagination[contentType].currentPage += 1;
    },
    updatePaginationTotal: (state, action: PayloadAction<{ contentType: keyof FeedState['pagination']; totalLoaded: number }>) => {
      const { contentType, totalLoaded } = action.payload;
      ensurePaginationState(state);
      state.pagination[contentType].totalLoaded = totalLoaded;
    },
  },
  extraReducers: (builder) => {
    // News content
    builder
      .addCase(fetchNewsContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewsContent.fulfilled, (state, action) => {
        state.loading = false;
        // Filter out any null or invalid items first
        const validItems = action.payload.filter(item => item && item.id);
        const newItems = filterNewItems(state.items, validItems);
        state.items = [...state.items, ...newItems];
        // Final deduplication step
        state.items = removeDuplicates(state.items);
        state.hasInitialData = true;
        state.lastUpdated = new Date().toISOString();
        
        // Update pagination state
        ensurePaginationState(state);
        state.pagination.news.totalLoaded += newItems.length;
      })
      .addCase(fetchNewsContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch news';
      });

    // Movie content
    builder
      .addCase(fetchMovieContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovieContent.fulfilled, (state, action) => {
        state.loading = false;
        // Filter out any null or invalid items first
        const validItems = action.payload.filter(item => item && item.id);
        const newItems = filterNewItems(state.items, validItems);
        state.items = [...state.items, ...newItems];
        // Final deduplication step
        state.items = removeDuplicates(state.items);
        state.hasInitialData = true;
        state.lastUpdated = new Date().toISOString();
        
        // Update pagination state
        ensurePaginationState(state);
        state.pagination.movie.totalLoaded += newItems.length;
      })
      .addCase(fetchMovieContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch movies';
      });

    // Music content
    builder
      .addCase(fetchMusicContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMusicContent.fulfilled, (state, action) => {
        state.loading = false;
        // Filter out any null or invalid items first
        const validItems = action.payload.filter(item => item && item.id);
        const newItems = filterNewItems(state.items, validItems);
        state.items = [...state.items, ...newItems];
        // Final deduplication step
        state.items = removeDuplicates(state.items);
        state.hasInitialData = true;
        state.lastUpdated = new Date().toISOString();
        
        // Update pagination state
        ensurePaginationState(state);
        state.pagination.music.totalLoaded += newItems.length;
      })
      .addCase(fetchMusicContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch music';
      });

    // Social content
    builder
      .addCase(fetchSocialContent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSocialContent.fulfilled, (state, action) => {
        state.loading = false;
        // Filter out any null or invalid items first
        const validItems = action.payload.filter(item => item && item.id);
        const newItems = filterNewItems(state.items, validItems);
        state.items = [...state.items, ...newItems];
        // Final deduplication step
        state.items = removeDuplicates(state.items);
        state.hasInitialData = true;
        state.lastUpdated = new Date().toISOString();
        
        // Update pagination state
        ensurePaginationState(state);
        state.pagination.social.totalLoaded += newItems.length;
      })
      .addCase(fetchSocialContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch social posts';
      })
      // Trending content handlers
      .addCase(fetchTrendingContent.pending, (state) => {
        ensureTrendingState(state);
        state.trending.loading = true;
        state.trending.error = null;
      })
      .addCase(fetchTrendingContent.fulfilled, (state, action) => {
        ensureTrendingState(state);
        state.trending.loading = false;
        state.trending.error = null;
        // Filter out any null or invalid items
        const validItems = action.payload.filter(item => item && item.id);
        state.trending.items = removeDuplicates(validItems);
        state.trending.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchTrendingContent.rejected, (state, action) => {
        ensureTrendingState(state);
        state.trending.loading = false;
        state.trending.error = action.error.message || 'Failed to fetch trending content';
      });
  },
});

export const {
  setLoading,
  setError,
  setFeedItems,
  addFeedItems,
  removeFeedItem,
  clearFeed,
  reorderItems,
  setCustomOrder,
  clearCache,
  markAsUnsaved,
  saveChanges,
  discardChanges,
  debugFeed,
  setPaginationLoading,
  setPaginationHasMore,
  incrementPaginationPage,
  updatePaginationTotal,
  setTrendingLoading,
  setTrendingError,
  clearTrending,
} = feedSlice.actions;

export default feedSlice.reducer;
