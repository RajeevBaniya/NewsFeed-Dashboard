import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { fetchTrendingContent } from '@/store/slices/feedSlice';

/**
 * useTrendingOnView
 * Fetch trending data when the Trending section becomes active.
 */
export function useTrendingOnView(params: {
  activeSection: string;
  isLoading: boolean;
  currentCount: number;
}) {
  const { activeSection, isLoading, currentCount } = params;
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (activeSection === 'trending' && !isLoading && currentCount === 0) {
      dispatch(fetchTrendingContent());
    }
  }, [activeSection, isLoading, currentCount, dispatch]);
}


