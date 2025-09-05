import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchNewsArticles } from '@/utils/newsApi';
import { fetchPopularMovies } from '@/utils/tmdbApi';
import { fetchFeaturedPlaylists } from '@/utils/spotifyApi';
import { fetchSocialPosts } from '@/utils/socialApi';
import { NewsArticle, Movie, Track, SocialPost } from '@/utils/types';

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
  // Additional fields for different content types
  author?: string;
  platform?: string;
  likes?: number;
  hashtags?: string[];
  rating?: number;
  genre?: string;
  artist?: string;
  album?: string;
  duration?: number;
}

export interface FeedState {
  items: ContentItem[];
  loading: boolean;
  error: string | null;
  lastUpdated: string | null;
}

const initialState: FeedState = {
  items: [],
  loading: false,
  error: null,
  lastUpdated: null,
};

// Async thunks for fetching content
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
        state.items = [...state.items, ...action.payload];
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
        state.items = [...state.items, ...action.payload];
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
        state.items = [...state.items, ...action.payload];
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
        state.items = [...state.items, ...action.payload];
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
} = feedSlice.actions;

export default feedSlice.reducer;
