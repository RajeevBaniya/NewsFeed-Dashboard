import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserPreferences {
  categories: string[];
  darkMode: boolean;
  language: string;
  notifications: boolean;
}

const initialState: UserPreferences = {
  categories: ['technology', 'sports', 'business'],
  darkMode: false,
  language: 'en',
  notifications: true,
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
} = preferencesSlice.actions;

export default preferencesSlice.reducer;
