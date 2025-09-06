import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchNewsArticles } from '@/utils/newsApi';
import { fetchPopularMovies } from '@/utils/tmdbApi';
import { fetchFeaturedPlaylists } from '@/utils/spotifyApi';
import { fetchSocialPosts } from '@/utils/socialApi';
import { NewsArticle, Movie, Track, SocialPost } from '@/utils/types';

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
};

/**
 * Async thunk for fetching news articles from NewsAPI
 * Transforms API response to unified ContentItem format
 */
export const fetchNewsContent = createAsyncThunk(
  'feed/fetchNews',
  async (category: string = 'technology') => {
    const newsArticles = await fetchNewsArticles(category);
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
  async () => {
    const movies = await fetchPopularMovies();
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
      state.items = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
    addFeedItems: (state, action: PayloadAction<ContentItem[]>) => {
      const newItems = action.payload.filter(
        newItem => !state.items.some(existingItem => existingItem.id === newItem.id)
      );
      state.items = [...state.items, ...newItems];
      state.lastUpdated = new Date().toISOString();
    },
    removeFeedItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    clearFeed: (state) => {
      state.items = [];
      state.lastUpdated = null;
    },
    reorderItems: (state, action: PayloadAction<{ dragIndex: number; hoverIndex: number; dragSection?: string; targetSection?: string }>) => {
      const { dragIndex, hoverIndex, dragSection, targetSection } = action.payload;
      
      console.log('🔄 REDUX REORDER - dragIndex:', dragIndex, 'hoverIndex:', hoverIndex, 'section:', dragSection);
      
      // Use temporaryOrder if it exists, otherwise use items
      const currentItems = (state.temporaryOrder && state.temporaryOrder.length > 0) ? state.temporaryOrder : state.items;
      console.log('🔄 Current items length:', currentItems.length, 'temporaryOrder length:', state.temporaryOrder?.length || 0);
      
      if (dragSection && targetSection && dragSection !== targetSection) {
        // Cross-section reordering
        const dragSectionItems = currentItems.filter(item => item.type === dragSection);
        const targetSectionItems = currentItems.filter(item => item.type === targetSection);
        const otherItems = currentItems.filter(item => item.type !== dragSection && item.type !== targetSection);
        
        const draggedItem = dragSectionItems[dragIndex];
        const newDragSectionItems = [...dragSectionItems];
        newDragSectionItems.splice(dragIndex, 1);
        
        const newTargetSectionItems = [...targetSectionItems];
        newTargetSectionItems.splice(hoverIndex, 0, draggedItem);
        
        const newItems = [...otherItems, ...newDragSectionItems, ...newTargetSectionItems];
        state.temporaryOrder = newItems;
      } else {
        // Within-section reordering
        const sectionItems = currentItems.filter(item => item.type === dragSection);
        const otherItems = currentItems.filter(item => item.type !== dragSection);
        
        const draggedItem = sectionItems[dragIndex];
        const newSectionItems = [...sectionItems];
        newSectionItems.splice(dragIndex, 1);
        newSectionItems.splice(hoverIndex, 0, draggedItem);
        
        const newItems = [...otherItems, ...newSectionItems];
        state.temporaryOrder = newItems;
      }
      
      state.hasUnsavedChanges = true;
      state.lastUpdated = new Date().toISOString();
      
      console.log('✅ REORDER COMPLETE - hasUnsavedChanges:', state.hasUnsavedChanges, 'temporaryOrder length:', state.temporaryOrder.length);
      
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
    discardChanges: (state) => {
      state.temporaryOrder = [];
      state.hasUnsavedChanges = false;
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
        const newItems = action.payload.filter(
          newItem => !state.items.some(existingItem => existingItem.id === newItem.id)
        );
        state.items = [...state.items, ...newItems];
        state.hasInitialData = true;
        state.lastUpdated = new Date().toISOString();
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
        const newItems = action.payload.filter(
          newItem => !state.items.some(existingItem => existingItem.id === newItem.id)
        );
        state.items = [...state.items, ...newItems];
        state.hasInitialData = true;
        state.lastUpdated = new Date().toISOString();
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
        const newItems = action.payload.filter(
          newItem => !state.items.some(existingItem => existingItem.id === newItem.id)
        );
        state.items = [...state.items, ...newItems];
        state.hasInitialData = true;
        state.lastUpdated = new Date().toISOString();
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
        const newItems = action.payload.filter(
          newItem => !state.items.some(existingItem => existingItem.id === newItem.id)
        );
        state.items = [...state.items, ...newItems];
        state.hasInitialData = true;
        state.lastUpdated = new Date().toISOString();
      })
      .addCase(fetchSocialContent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch social posts';
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
} = feedSlice.actions;

export default feedSlice.reducer;
