import { useState, useCallback } from 'react';
import type { ContentItem } from '@/store/slices/feedSlice';

/**
 * useModalState
 * Encapsulates modal item state and open/close helpers for content modal.
 */
export function useModalState() {
  const [modalItem, setModalItem] = useState<ContentItem | null>(null);

  const openModal = useCallback((item: ContentItem) => {
    setModalItem(item);
  }, []);

  const closeModal = useCallback(() => {
    setModalItem(null);
  }, []);

  return { modalItem, openModal, closeModal };
}


