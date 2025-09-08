import React from 'react';

type LoadingRef = React.MutableRefObject<HTMLDivElement | null> | ((node: HTMLDivElement) => void) | null;

interface InfiniteLoaderProps {
  loadingRef: LoadingRef;
  isLoading: boolean;
}

/**
 * InfiniteLoader
 * Visual block placed at the end of a list to trigger intersection observer
 * and show loading/idle hints.
 */
export default function InfiniteLoader({ loadingRef, isLoading }: InfiniteLoaderProps) {
  return (
    <div ref={loadingRef as unknown as React.RefObject<HTMLDivElement>} className="flex justify-center py-8">
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span className="text-gray-600 dark:text-gray-400 text-sm">Loading more content...</span>
        </div>
      ) : (
        <div className="text-gray-400 text-sm">Scroll down for more content</div>
      )}
    </div>
  );
}


