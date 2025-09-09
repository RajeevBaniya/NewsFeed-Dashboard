import React from 'react';
import { motion } from 'framer-motion';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { saveChanges } from '@/store/slices/feedSlice';
import Icon from './Icon';

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
        px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base font-medium transition-all duration-200
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
      <div className="flex items-center gap-1.5 sm:gap-2">
        <Icon name="save" size="sm" />
        <span className="hidden xs:inline">{hasUnsavedChanges ? 'Save Changes' : 'No Changes'}</span>
        <span className="xs:hidden">{hasUnsavedChanges ? 'Save' : 'Saved'}</span>
      </div>
    </motion.button>
  );
}
