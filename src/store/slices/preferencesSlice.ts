import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserPreferences {
  categories: string[];
  darkMode: boolean;
  language: string;
  notifications: boolean;
  viewMode: 'normal' | 'draggable';
}

const initialState: UserPreferences = {
  categories: ['technology', 'sports', 'business'],
  darkMode: false,
  language: 'en',
  notifications: true,
  viewMode: 'normal',
};

const preferencesSlice = createSlice({
  name: 'preferences',
  initialState,
  reducers: {
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
    },
    setDarkMode: (state, action: PayloadAction<boolean>) => {
      state.darkMode = action.payload;
    },
    updateCategories: (state, action: PayloadAction<string[]>) => {
      state.categories = action.payload;
    },
    addCategory: (state, action: PayloadAction<string>) => {
      if (!state.categories.includes(action.payload)) {
        state.categories.push(action.payload);
      }
    },
    removeCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter(cat => cat !== action.payload);
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    toggleNotifications: (state) => {
      state.notifications = !state.notifications;
    },
    setViewMode: (state, action: PayloadAction<'normal' | 'draggable'>) => {
      state.viewMode = action.payload;
    },
  },
});

export const {
  toggleDarkMode,
  setDarkMode,
  updateCategories,
  addCategory,
  removeCategory,
  setLanguage,
  toggleNotifications,
  setViewMode,
} = preferencesSlice.actions;

export default preferencesSlice.reducer;
