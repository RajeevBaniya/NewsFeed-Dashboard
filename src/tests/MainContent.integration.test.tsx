import React from 'react';
import { screen } from '@testing-library/react';
import { renderWithStore } from './test-utils';
import MainContent from '@/components/content/MainContent';

const makeItem = (id: string) => ({
  id,
  title: `Title ${id}`,
  description: 'desc',
  source: 'Src',
  category: 'cat',
  publishedAt: new Date().toISOString(),
  url: `https://example.com/${id}`,
  type: 'news' as const,
  readTime: 2,
});

describe('MainContent integration', () => {
  it('renders empty state when no items and not loading', () => {
    renderWithStore(<MainContent activeSection="feed" />, {
      preferences: { categories: [], darkMode: false, language: 'en', notifications: true, viewMode: 'normal' },
      feed: {
        items: [], temporaryOrder: [], loading: false, error: null, lastUpdated: null,
        hasInitialData: false, hasCustomOrder: false, hasUnsavedChanges: false,
        pagination: {
          news: { currentPage: 1, hasMore: true, isLoading: false, totalLoaded: 0 },
          movie: { currentPage: 1, hasMore: true, isLoading: false, totalLoaded: 0 },
          music: { currentPage: 1, hasMore: true, isLoading: false, totalLoaded: 0 },
          social: { currentPage: 1, hasMore: true, isLoading: false, totalLoaded: 0 },
        },
        trending: { items: [], loading: false, error: null, lastUpdated: null },
      },
      favorites: { items: [], lastUpdated: null },
      search: { query: '', results: [], isSearching: false, searchHistory: [], activeFilters: { type: null, sortBy: 'relevance' } },
    });

    expect(screen.getByText(/Loading your personalized content/i)).toBeInTheDocument();
  });

  it('renders grid with items and shows infinite loader area', () => {
    renderWithStore(<MainContent activeSection="feed" />, {
      preferences: { categories: [], darkMode: false, language: 'en', notifications: true, viewMode: 'normal' },
      feed: {
        items: [makeItem('1'), makeItem('2')], temporaryOrder: [], loading: false, error: null, lastUpdated: null,
        hasInitialData: true, hasCustomOrder: false, hasUnsavedChanges: false,
        pagination: {
          news: { currentPage: 1, hasMore: true, isLoading: false, totalLoaded: 2 },
          movie: { currentPage: 1, hasMore: true, isLoading: false, totalLoaded: 0 },
          music: { currentPage: 1, hasMore: true, isLoading: false, totalLoaded: 0 },
          social: { currentPage: 1, hasMore: true, isLoading: false, totalLoaded: 0 },
        },
        trending: { items: [], loading: false, error: null, lastUpdated: null },
      },
      favorites: { items: [], lastUpdated: null },
      search: { query: '', results: [], isSearching: false, searchHistory: [], activeFilters: { type: null, sortBy: 'relevance' } },
    });

    expect(screen.getByText('Title 1')).toBeInTheDocument();
    expect(screen.getByText('Title 2')).toBeInTheDocument();
    expect(screen.getByText(/Scroll down for more content/i)).toBeInTheDocument();
  });

  it('renders error state with retry button', () => {
    renderWithStore(<MainContent activeSection="feed" />, {
      preferences: { categories: [], darkMode: false, language: 'en', notifications: true, viewMode: 'normal' },
      feed: {
        items: [], temporaryOrder: [], loading: false, error: 'Failed', lastUpdated: null,
        hasInitialData: false, hasCustomOrder: false, hasUnsavedChanges: false,
        pagination: {
          news: { currentPage: 1, hasMore: true, isLoading: false, totalLoaded: 0 },
          movie: { currentPage: 1, hasMore: true, isLoading: false, totalLoaded: 0 },
          music: { currentPage: 1, hasMore: true, isLoading: false, totalLoaded: 0 },
          social: { currentPage: 1, hasMore: true, isLoading: false, totalLoaded: 0 },
        },
        trending: { items: [], loading: false, error: null, lastUpdated: null },
      },
      favorites: { items: [], lastUpdated: null },
      search: { query: '', results: [], isSearching: false, searchHistory: [], activeFilters: { type: null, sortBy: 'relevance' } },
    });

    expect(screen.getByText(/Error: Failed/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Retry/i })).toBeInTheDocument();
  });
});


