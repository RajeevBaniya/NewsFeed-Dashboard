'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ContentItem } from '@/store/slices/feedSlice';
import Icon from '../ui/Icon';
import { useEffect } from 'react';

interface ContentModalProps {
  item: ContentItem | null;
  onClose: () => void;
}

export default function ContentModal({ item, onClose }: ContentModalProps) {
  useEffect(() => {
    if (!item) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, [item, onClose]);

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
          />

          {/* Modal card */}
          <motion.div
            className="relative z-10 w-full max-w-2xl bg-white dark:bg-gray-900 rounded-xl shadow-xl overflow-hidden"
            initial={{ scale: 0.95, y: 10, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.95, y: 10, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Header image */}
            {item.imageUrl && (
              <div className="w-full h-60 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                <Image
                  src={item.imageUrl}
                  alt={item.title}
                  width={800}
                  height={320}
                  className="w-full h-full object-cover"
                  unoptimized={item.imageUrl.startsWith('http')}
                />
              </div>
            )}

            <div className="p-5">
              <div className="flex items-start gap-3">
                <div className="text-2xl">
                  {item.type === 'news' ? '📰' : item.type === 'movie' ? '🎬' : item.type === 'music' ? '🎵' : '💬'}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {item.title}
                </h3>
              </div>

              {item.description && (
                <p className="mt-3 text-gray-700 dark:text-gray-300 whitespace-pre-line">
                  {item.description}
                </p>
              )}

              <div className="mt-5 flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {item.source}
                </span>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Icon name="external" size="sm" />
                  Read Post
                </a>
              </div>
            </div>

            {/* Close button */}
            <button
              aria-label="Close"
              onClick={onClose}
              className="absolute top-3 right-3 p-2 rounded-full bg-white/80 dark:bg-gray-900/80 hover:bg-white dark:hover:bg-gray-800 shadow"
            >
              <Icon name="close" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


