import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, PersistMigrate } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from '@reduxjs/toolkit';

import preferencesReducer from './slices/preferencesSlice';
import feedReducer from './slices/feedSlice';
import favoritesReducer from './slices/favoritesSlice';
import searchReducer from './slices/searchSlice';

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['preferences', 'favorites', 'feed'],
  version: 6, // Increment version to clear old cache and ensure trending state is properly initialized
  migrate: ((state: unknown) => {
    // Guard: state may be undefined/null/primitive during hydration
    if (!state || typeof state !== 'object') {
      return Promise.resolve(state);
    }

    // Ensure root slice exists
    const root = state as { feed?: { trending?: unknown } };
    if (!root.feed) {
      root.feed = {} as { trending?: unknown };
    }

    // Ensure trending sub-slice exists
    if (!root.feed.trending) {
      (root.feed as { trending: unknown }).trending = {
        items: [],
        loading: false,
        error: null,
        lastUpdated: null,
      };
    }

    return Promise.resolve(state);
  }) as PersistMigrate,
};

const rootReducer = combineReducers({
  preferences: preferencesReducer,
  feed: feedReducer,
  favorites: favoritesReducer,
  search: searchReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
