import React from 'react';
import { SearchSkeleton } from '../ui/LoadingSkeleton';
import FilterBar from '../ui/FilterBar';

interface SearchHeaderProps {
  query: string;
  isSearching: boolean;
}

/**
 * SearchHeader
 * Displays search title, stats, and either skeleton or filter bar.
 */
export default function SearchHeader({ query, isSearching }: SearchHeaderProps) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Search Results</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        {isSearching ? 'Searching...' : `Results for "${query}"`}
      </p>
      {isSearching ? <SearchSkeleton /> : <FilterBar />}
    </div>
  );
}


