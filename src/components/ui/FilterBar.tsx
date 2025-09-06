import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { setActiveFilters } from '@/store/slices/searchSlice';

export default function FilterBar() {
  const dispatch = useAppDispatch();
  const { activeFilters } = useAppSelector((state) => state.search);

  const contentTypes = [
    { value: null, label: 'All Types' },
    { value: 'news', label: 'News' },
    { value: 'movie', label: 'Movies' },
    { value: 'music', label: 'Music' },
    { value: 'social', label: 'Social' },
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'date', label: 'Date' },
    { value: 'title', label: 'Title' },
  ];

  const handleTypeFilter = (type: string | null) => {
    dispatch(setActiveFilters({ type }));
  };

  const handleSortChange = (sortBy: 'date' | 'title' | 'relevance') => {
    dispatch(setActiveFilters({ sortBy }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Filter:
          </span>
          <div className="flex space-x-1">
            {contentTypes.map((type) => (
              <button
                key={type.value || 'all'}
                onClick={() => handleTypeFilter(type.value)}
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  activeFilters.type === type.value
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Sort:
          </span>
          <select
            value={activeFilters.sortBy}
            onChange={(e) => handleSortChange(e.target.value as 'date' | 'title' | 'relevance')}
            className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {(activeFilters.type || activeFilters.sortBy !== 'relevance') && (
          <button
            onClick={() => dispatch(setActiveFilters({ type: null, sortBy: 'relevance' }))}
            className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}
