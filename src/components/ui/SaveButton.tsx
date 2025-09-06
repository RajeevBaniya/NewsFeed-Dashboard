import React from 'react';
import { motion } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { saveChanges } from '@/store/slices/feedSlice';

interface SaveButtonProps {
  className?: string;
}

/**
 * SaveButton component for persisting drag-and-drop changes
 * Only appears when user has made unsaved changes to content order
 */
export default function SaveButton({ className = '' }: SaveButtonProps) {
  const dispatch = useAppDispatch();
  const { hasUnsavedChanges } = useAppSelector((state) => state.feed);

  const handleSave = () => {
    dispatch(saveChanges());
  };

  return (
    <motion.button
      onClick={handleSave}
      disabled={!hasUnsavedChanges}
      className={`
        px-4 py-2 rounded-lg font-medium transition-all duration-200
        ${hasUnsavedChanges
          ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg cursor-pointer'
          : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
        }
        ${className}
      `}
      whileHover={hasUnsavedChanges ? { scale: 1.05 } : {}}
      whileTap={hasUnsavedChanges ? { scale: 0.95 } : {}}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center gap-2">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        {hasUnsavedChanges ? 'Save Changes' : 'No Changes'}
      </div>
    </motion.button>
  );
}
