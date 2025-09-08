import { useRef, useCallback } from 'react';
import { useAppDispatch } from '@/store/hooks';
import {
  fetchNewsContent,
  fetchMovieContent,
  fetchMusicContent,
  fetchSocialContent,
  incrementPaginationPage,
} from '@/store/slices/feedSlice';

/**
 * useFeedPaging
 * Provides throttled loadMoreContent and returns a ref for cooldown tracking.
 */
export function useFeedPaging(
  options: {
    loading: boolean;
    pagination: {
      news?: { currentPage: number; hasMore: boolean };
      movie?: { currentPage: number; hasMore: boolean };
      music?: { currentPage: number; hasMore: boolean };
      social?: { currentPage: number; hasMore: boolean };
    };
    categories: string[];
  }
) {
  const { loading, pagination, categories } = options;
  const dispatch = useAppDispatch();

  const lastLoadTsRef = useRef<number>(0);
  const loadCounterRef = useRef<number>(0);

  const loadMoreContent = useCallback(async () => {
    const now = Date.now();
    const COOLDOWN_DURATION = 2500; // 2.5s

    if (loading || (now - lastLoadTsRef.current < COOLDOWN_DURATION)) return;

    lastLoadTsRef.current = now;
    loadCounterRef.current += 1;

    try {
      const tasks: Promise<unknown>[] = [];
      const newsApiCooldown = typeof window !== 'undefined' ? localStorage.getItem('newsApiCooldown') : null;
      const isNewsApiCoolingDown = newsApiCooldown && parseInt(newsApiCooldown) > now;

      if (!isNewsApiCoolingDown && pagination.news?.hasMore) {
        const nextNewsPage = (pagination.news.currentPage ?? 1) + 1;
        tasks.push(dispatch(fetchNewsContent({ category: categories[0] || 'technology', page: nextNewsPage })));
        dispatch(incrementPaginationPage('news'));
      }

      if (pagination.movie?.hasMore) {
        const nextMoviePage = (pagination.movie.currentPage ?? 1) + 1;
        tasks.push(dispatch(fetchMovieContent(nextMoviePage)));
        dispatch(incrementPaginationPage('movie'));
      }

      if (loadCounterRef.current % 3 === 0) {
        tasks.push(dispatch(fetchMusicContent()));
        tasks.push(dispatch(fetchSocialContent()));
      }

      await Promise.all(tasks);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Error loading more content:', err);
    }
  }, [loading, pagination, categories, dispatch]);

  return { loadMoreContent };
}


