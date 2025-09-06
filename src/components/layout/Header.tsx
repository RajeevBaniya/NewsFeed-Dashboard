'use client';

import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { toggleDarkMode } from '@/store/slices/preferencesSlice';
import { clearCache } from '@/store/slices/feedSlice';
import SearchBar from '../search/SearchBar';
import Icon from '../ui/Icon';

interface HeaderProps {
  onMenuToggle: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const dispatch = useAppDispatch();
  const darkMode = useAppSelector((state) => state.preferences.darkMode);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleDarkModeToggle = () => {
    dispatch(toggleDarkMode());
  };

  const handleClearCache = () => {
    dispatch(clearCache());
    // Reload the page to fetch fresh data
    window.location.reload();
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 
                      sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Mobile menu button */}
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 
                     transition-colors duration-200"
          >
            <Icon name="menu" size="lg" className="text-gray-600 dark:text-white" />
          </button>

          {/* Search bar */}
          <div className="flex-1 max-w-lg mx-4">
            <SearchBar />
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Dark mode toggle */}
            <button 
              onClick={handleDarkModeToggle}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 
                        transition-colors duration-200"
            >
              <Icon 
                name={darkMode ? "sun" : "moon"} 
                size="md" 
                className="text-gray-600 dark:text-white" 
              />
            </button>

            {/* Notifications */}
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 
                              transition-colors duration-200 relative">
              <Icon 
                name="notification" 
                size="md" 
                className="text-gray-600 dark:text-white" 
              />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            {/* Clear Cache Button - Temporary */}
            <button
              onClick={handleClearCache}
              className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              title="Clear cache and reload"
            >
              Clear Cache
            </button>

            {/* User profile */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 
                            rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">U</span>
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300">
                User
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
