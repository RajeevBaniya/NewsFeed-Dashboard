import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import SaveButton from '@/components/ui/SaveButton';
import { renderWithStore } from './test-utils';
import { saveChanges } from '@/store/slices/feedSlice';

describe('SaveButton', () => {
  it('is disabled when no unsaved changes', () => {
    renderWithStore(<SaveButton />);
    const btn = screen.getByRole('button', { name: /no changes/i });
    expect(btn).toBeDisabled();
  });

  it('dispatches saveChanges when there are unsaved changes', () => {
    const { store } = renderWithStore(<SaveButton />, {
      feed: {
        items: [],
        temporaryOrder: [{
          id: '1', title: 't', description: 'd', source: 's', category: 'c', publishedAt: new Date().toISOString(), url: 'u', type: 'news'
        }],
        loading: false,
        error: null,
        lastUpdated: null,
        hasInitialData: false,
        hasCustomOrder: false,
        hasUnsavedChanges: true,
        pagination: {
          news: { currentPage: 1, hasMore: true, isLoading: false, totalLoaded: 0 },
          movie: { currentPage: 1, hasMore: true, isLoading: false, totalLoaded: 0 },
          music: { currentPage: 1, hasMore: true, isLoading: false, totalLoaded: 0 },
          social: { currentPage: 1, hasMore: true, isLoading: false, totalLoaded: 0 },
        },
        trending: { items: [], loading: false, error: null, lastUpdated: null },
      },
      preferences: { categories: [], darkMode: false, language: 'en', notifications: true, viewMode: 'normal' },
      favorites: { items: [], lastUpdated: null },
    });
    const btn = screen.getByRole('button', { name: /save changes/i });
    fireEvent.click(btn);
    const actions = store.getState();
    // state should reflect saved changes (unsaved false)
    expect(actions.feed.hasUnsavedChanges).toBe(false);
  });
});


