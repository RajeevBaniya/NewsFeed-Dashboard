import React from 'react';
import ViewToggle from '../ui/ViewToggle';
import SaveButton from '../ui/SaveButton';

interface FeedHeaderProps {
  title: string;
  showSave: boolean;
}

/**
 * FeedHeader
 * Displays the section title, optional Save button, and View toggle.
 */
export default function FeedHeader({ title, showSave }: FeedHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-4">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
        {title}
      </h2>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        {showSave && <SaveButton />}
        <ViewToggle />
      </div>
    </div>
  );
}


