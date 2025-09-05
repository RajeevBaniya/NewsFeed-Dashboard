import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ContentItem } from './feedSlice';

export interface FavoritesState {
  items: ContentItem[];
  lastUpdated: string | null;
}

const initialState: FavoritesState = {
  items: [],
  lastUpdated: null,
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    addToFavorites: (state, action: PayloadAction<ContentItem>) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if (!existingItem) {
        state.items.push(action.payload);
        state.lastUpdated = new Date().toISOString();
      }
    },
    removeFromFavorites: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      state.lastUpdated = new Date().toISOString();
    },
    toggleFavorite: (state, action: PayloadAction<ContentItem>) => {
      const existingIndex = state.items.findIndex(item => item.id === action.payload.id);
      if (existingIndex >= 0) {
        state.items.splice(existingIndex, 1);
      } else {
        state.items.push(action.payload);
      }
      state.lastUpdated = new Date().toISOString();
    },
    clearFavorites: (state) => {
      state.items = [];
      state.lastUpdated = null;
    },
    setFavorites: (state, action: PayloadAction<ContentItem[]>) => {
      state.items = action.payload;
      state.lastUpdated = new Date().toISOString();
    },
  },
});

export const {
  addToFavorites,
  removeFromFavorites,
  toggleFavorite,
  clearFavorites,
  setFavorites,
} = favoritesSlice.actions;

export default favoritesSlice.reducer;
