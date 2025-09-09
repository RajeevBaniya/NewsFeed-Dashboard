import { useState, useEffect, useRef } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setSearchQuery, setIsSearching, addToSearchHistory, clearSearch, performSearch } from '@/store/slices/searchSlice';
import Icon from '../ui/Icon';

export default function SearchBar() {
  const dispatch = useAppDispatch();
  const { query, isSearching, searchHistory, activeFilters } = useAppSelector((state) => state.search);
  const [localQuery, setLocalQuery] = useState(query);
  const [showHistory, setShowHistory] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      if (localQuery !== query) {
        dispatch(setSearchQuery(localQuery));
        if (localQuery.trim()) {
          dispatch(addToSearchHistory(localQuery.trim()));
          dispatch(performSearch(localQuery.trim()));
        } else {
          dispatch(clearSearch());
        }
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [localQuery, query, dispatch]);

  useEffect(() => {
    if (query && query.trim()) {
      dispatch(performSearch(query.trim()));
    }
  }, [activeFilters, dispatch, query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowHistory(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalQuery(e.target.value);
    setShowHistory(e.target.value === '');
  };

  const handleHistoryClick = (historyQuery: string) => {
    setLocalQuery(historyQuery);
    setShowHistory(false);
  };

  const handleClearSearch = () => {
    setLocalQuery('');
    dispatch(clearSearch());
    setShowHistory(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowHistory(false);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-2 sm:pl-3 flex items-center pointer-events-none">
          <Icon name="search" size="sm" className="text-gray-400 sm:w-4 sm:h-4" />
        </div>
        <input
          type="text"
          value={localQuery}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => setShowHistory(localQuery === '')}
          placeholder="Search content..."
          className="block w-full pl-8 sm:pl-10 pr-8 sm:pr-10 py-1.5 sm:py-2 text-sm sm:text-base border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {localQuery && (
          <button
            onClick={handleClearSearch}
            className="absolute inset-y-0 right-0 pr-2 sm:pr-3 flex items-center"
          >
            <Icon 
              name="clear" 
              size="sm" 
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 sm:w-4 sm:h-4" 
            />
          </button>
        )}
        {isSearching && (
          <div className="absolute inset-y-0 right-0 pr-2 sm:pr-3 flex items-center">
            <div className="animate-spin rounded-full h-3 w-3 sm:h-4 sm:w-4 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {showHistory && searchHistory.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
          <div className="py-1">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Recent Searches
            </div>
            {searchHistory.slice(0, 5).map((historyQuery, index) => (
              <button
                key={index}
                onClick={() => handleHistoryClick(historyQuery)}
                className="w-full px-3 py-2 text-left text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center"
              >
                <Icon 
                  name="history" 
                  size="sm" 
                  className="text-gray-400 mr-2" 
                />
                {historyQuery}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
