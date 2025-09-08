import React, { PropsWithChildren } from 'react';
import { Provider } from 'react-redux';
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { render } from '@testing-library/react';
import preferences from '@/store/slices/preferencesSlice';
import feed from '@/store/slices/feedSlice';
import favorites from '@/store/slices/favoritesSlice';
import search from '@/store/slices/searchSlice';

export function renderWithStore(ui: React.ReactElement, preloadedState?: Record<string, unknown>) {
  const rootReducer = combineReducers({
    preferences,
    feed,
    favorites,
    search,
  });

  const store = configureStore({ reducer: rootReducer, preloadedState });

  function Wrapper({ children }: PropsWithChildren) {
    return <Provider store={store}>{children}</Provider>;
  }

  return { store, ...render(ui, { wrapper: Wrapper }) };
}


