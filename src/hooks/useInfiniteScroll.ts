import { useEffect, useRef, useCallback } from 'react';

interface UseInfiniteScrollOptions {
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  threshold?: number; // Distance from bottom to trigger loading (in pixels)
}

/**
 * Custom hook for implementing infinite scroll functionality
 * Provides clean, reusable infinite scroll logic with intersection observer
 */
export const useInfiniteScroll = ({
  hasMore,
  isLoading,
  onLoadMore,
  threshold = 100
}: UseInfiniteScrollOptions) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement | null>(null);

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasMore && !isLoading) {
        onLoadMore();
      }
    },
    [hasMore, isLoading, onLoadMore]
  );

  useEffect(() => {
    // Clean any previous observer
    if (observerRef.current) {
      try {
        observerRef.current.disconnect();
      } catch {}
      observerRef.current = null;
    }

    const el = loadingRef.current;
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: `${threshold}px`,
      threshold: 0.1,
    });
    observerRef.current = observer;

    if (el) {
      try {
        observer.observe(el);
      } catch {}
    }

    return () => {
      const currentObserver = observerRef.current;
      const currentEl = loadingRef.current;
      try {
        if (currentObserver && currentEl) {
          currentObserver.unobserve(currentEl);
        }
        if (currentObserver) {
          currentObserver.disconnect();
        }
      } catch {}
      observerRef.current = null;
    };
  }, [handleObserver, threshold]);

  return {
    loadingRef,
    isObserving: !!observerRef.current
  };
};
