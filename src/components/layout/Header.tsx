'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/auth-provider';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { toggleDarkMode } from '@/store/slices/preferencesSlice';

// Components
import SearchBar from '../search/SearchBar';
import Icon from '../ui/Icon';

interface HeaderProps {
  onMenuToggle: () => void;
}

/**
 * Header component with search, theme toggle, notifications, and cache management
 */
export default function Header({ onMenuToggle }: HeaderProps) {
  const dispatch = useAppDispatch();
  const darkMode = useAppSelector((state) => state.preferences.darkMode);
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  // Apply dark mode class to document root
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (open && menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, [open]);

  // Toggle between light and dark themes
  const handleDarkModeToggle = () => {
    dispatch(toggleDarkMode());
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

            {/* User profile dropdown */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setOpen(v => !v)}
                className="flex items-center space-x-2"
                aria-haspopup="menu"
                aria-expanded={open}
              >
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">{(user?.displayName?.[0] || user?.email?.[0] || 'U').toUpperCase()}</span>
                </div>
                {user?.displayName && (
                  <span className="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-300 max-w-[140px] truncate">
                    {user.displayName}
                  </span>
                )}
              </button>
              {open && (
                <div className="absolute right-0 mt-2 w-56 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg p-2 z-50">
                  <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.displayName || 'User'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={async () => { setOpen(false); await logout(); router.replace('/login'); }}
                    className="w-full text-left px-3 py-2 text-sm rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
