import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { fetchNewsContent, fetchMovieContent, fetchMusicContent, fetchSocialContent } from '@/store/slices/feedSlice';

/**
 * useInitialContentLoad
 * Loads the first page of content for selected categories when the app boots.
 * Skips if initial data exists or user has a custom order.
 */
export function useInitialContentLoad(params: {
  categories: string[];
  hasInitialData: boolean;
  hasCustomOrder: boolean;
}) {
  const { categories, hasInitialData, hasCustomOrder } = params;
  const dispatch = useAppDispatch();

  useEffect(() => {
    const load = async () => {
      if (hasInitialData || hasCustomOrder) return;
      try {
        for (const category of categories) {
          await dispatch(fetchNewsContent({ category, page: 1 }));
        }
        await dispatch(fetchMovieContent(1));
        await dispatch(fetchMusicContent());
        await dispatch(fetchSocialContent());
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error loading content:', err);
      }
    };
    load();
  }, [dispatch, categories, hasInitialData, hasCustomOrder]);
}


