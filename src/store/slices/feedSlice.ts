import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
