import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { ContentItem } from './feedSlice';
import { RootState } from '../store';

export interface SearchState {
  query: string;
  results: ContentItem[];
  isSearching: boolean;
  searchHistory: string[];
  activeFilters: {
    type: string | null;
    sortBy: 'date' | 'title' | 'relevance';
  };
}

const initialState: SearchState = {
  query: '',
  results: [],
  isSearching: false,
  searchHistory: [],
  activeFilters: {
    type: null,
    sortBy: 'relevance',
  },
};

export const performSearch = createAsyncThunk(
  'search/performSearch',
  async (query: string, { getState }) => {
    const state = getState() as RootState;
    const { items } = state.feed;
    const { activeFilters } = state.search;

    if (!query.trim()) {
      return [];
    }

    const searchTerm = query.toLowerCase();
    let filteredItems = items.filter((item) => {
      const matchesQuery = 
        item.title.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.source.toLowerCase().includes(searchTerm) ||
        (item.author && item.author.toLowerCase().includes(searchTerm)) ||
        (item.artist && item.artist.toLowerCase().includes(searchTerm));

      const matchesType = !activeFilters.type || item.type === activeFilters.type;

      return matchesQuery && matchesType;
    });

    switch (activeFilters.sortBy) {
      case 'date':
        filteredItems.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
        break;
      case 'title':
        filteredItems.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'relevance':
      default:
        filteredItems.sort((a, b) => {
          const aRelevance = a.title.toLowerCase().includes(searchTerm) ? 2 : 1;
          const bRelevance = b.title.toLowerCase().includes(searchTerm) ? 2 : 1;
          return bRelevance - aRelevance;
        });
        break;
    }

    return filteredItems;
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.query = action.payload;
    },
    setSearchResults: (state, action: PayloadAction<ContentItem[]>) => {
      state.results = action.payload;
    },
    setIsSearching: (state, action: PayloadAction<boolean>) => {
      state.isSearching = action.payload;
    },
    addToSearchHistory: (state, action: PayloadAction<string>) => {
      const query = action.payload.trim();
      if (query && !state.searchHistory.includes(query)) {
        state.searchHistory.unshift(query);
        if (state.searchHistory.length > 10) {
          state.searchHistory = state.searchHistory.slice(0, 10);
        }
      }
    },
    clearSearchHistory: (state) => {
      state.searchHistory = [];
    },
    setActiveFilters: (state, action: PayloadAction<Partial<SearchState['activeFilters']>>) => {
      state.activeFilters = { ...state.activeFilters, ...action.payload };
    },
    clearSearch: (state) => {
      state.query = '';
      state.results = [];
      state.isSearching = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(performSearch.pending, (state) => {
        state.isSearching = true;
      })
      .addCase(performSearch.fulfilled, (state, action) => {
        state.isSearching = false;
        state.results = action.payload;
      })
      .addCase(performSearch.rejected, (state) => {
        state.isSearching = false;
        state.results = [];
      });
  },
});

export const {
  setSearchQuery,
  setSearchResults,
  setIsSearching,
  addToSearchHistory,
  clearSearchHistory,
  setActiveFilters,
  clearSearch,
} = searchSlice.actions;

export default searchSlice.reducer;
