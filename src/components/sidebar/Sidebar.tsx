'use client';

import Link from 'next/link';
import Icon from '../ui/Icon';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

/**
 * Sidebar component for navigation between different content sections
 * Includes mobile overlay and responsive design
 */
export default function Sidebar({ isOpen, onToggle, activeSection, onSectionChange }: SidebarProps) {
  // Navigation menu items
  const menuItems = [
    { id: 'feed', label: 'Feed', icon: '📰' },
    { id: 'trending', label: 'Trending', icon: '🔥' },
    { id: 'favorites', label: 'Favorites', icon: '❤️' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-56 sm:w-64 bg-white dark:bg-gray-900 
        border-r border-gray-200 dark:border-gray-700 z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        <div className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
              PersonalFeed
            </h1>
            <button
              onClick={onToggle}
              className="lg:hidden p-1.5 sm:p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Icon name="close" size="sm" className="sm:w-5 sm:h-5" />
            </button>
          </div>
          
          <nav className="space-y-1 sm:space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                href={`/${item.id}`}
                onClick={onToggle}
                className={`w-full flex items-center space-x-2 sm:space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg 
                         text-left transition-colors duration-200 ${
                  activeSection === item.id
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                }`}
              >
                <span className="text-base sm:text-lg">{item.icon}</span>
                <span className="font-medium text-sm sm:text-base">
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
