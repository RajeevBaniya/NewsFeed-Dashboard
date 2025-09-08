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
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        {title}
      </h2>
      <div className="flex items-center gap-4">
        {showSave && <SaveButton />}
        <ViewToggle />
      </div>
    </div>
  );
}


