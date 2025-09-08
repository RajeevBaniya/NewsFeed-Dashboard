import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { ContentItem } from '@/store/slices/feedSlice';
import { CONTENT_ICONS, ACTION_TEXTS } from '@/constants';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { toggleFavorite } from '@/store/slices/favoritesSlice';
import Icon from '../ui/Icon';

interface ContentCardProps {
  item: ContentItem;
  onAction?: (url: string) => void;
  onOpen?: (item: ContentItem) => void; // open Daily.dev-style modal
}

/**
 * ContentCard component displays individual content items with image, title, description,
 * and action button. Supports favorites functionality and different content types.
 */
export default function ContentCard({ item, onAction, onOpen }: ContentCardProps) {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.items);
  const isFavorite = favorites.some(fav => fav.id === item.id);
  const [imageError, setImageError] = useState(false);

  // Handle favorite toggle with event propagation prevention
  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleFavorite(item));
  };

  // Get appropriate icon for content type
  const getContentIcon = () => {
    const iconMap = {
      news: CONTENT_ICONS.NEWS,
      movie: CONTENT_ICONS.MOVIE,
      music: CONTENT_ICONS.MUSIC,
      social: CONTENT_ICONS.SOCIAL,
    };
    return iconMap[item.type] || '📄';
  };

  // Get action button text based on content type
  const getActionButtonText = () => {
    const actionMap = {
      news: ACTION_TEXTS.NEWS,
      movie: ACTION_TEXTS.MOVIE,
      music: ACTION_TEXTS.MUSIC,
      social: ACTION_TEXTS.SOCIAL,
    };
    return actionMap[item.type] || 'View';
  };

  // Format metadata string based on content type
  const formatMetadata = () => {
    switch (item.type) {
      case 'news':
        return `${item.source} • ${item.readTime ? `${item.readTime} min read` : 'Just now'}`;
      case 'movie':
        return `${item.source} • ${item.rating ? `⭐ ${item.rating}` : 'New Release'}`;
      case 'music':
        return `${item.artist} • ${item.album}`;
      case 'social':
        return `@${item.author} • ${item.platform} • ${item.likes} likes`;
      default:
        return item.source;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-900 rounded-lg overflow-hidden relative cursor-pointer h-80 flex flex-col shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700"
      onClick={() => (onOpen ? onOpen(item) : onAction?.(item.url))}
    >
      <motion.button
        onClick={handleToggleFavorite}
        className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-colors z-10 shadow-sm"
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <motion.div
          animate={{ scale: isFavorite ? [1, 1.2, 1] : 1 }}
          transition={{ duration: 0.3 }}
        >
          <Icon
            name="heart"
            size="sm"
            className={`transition-colors ${
              isFavorite 
                ? 'text-red-500 fill-current' 
                : 'text-gray-400 hover:text-red-500'
            }`}
            fill={isFavorite ? 'current' : 'none'}
          />
        </motion.div>
      </motion.button>
      
      {/* Image Section */}
      <div className="w-full h-40 bg-gray-100 dark:bg-gray-800 overflow-hidden flex-shrink-0">
        {item.imageUrl && !imageError ? (
          <Image
            src={item.imageUrl}
            alt={item.title}
            width={400}
            height={192}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
            unoptimized={item.imageUrl.startsWith('http')}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-4xl">
            {getContentIcon()}
          </div>
        )}
      </div>
      
      {/* Content Section */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-white dark:bg-gray-900">
        <h4 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight line-clamp-3 mb-3">
          {item.title}
        </h4>
        
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-auto">
          <span className="font-medium">
            {formatMetadata()}
          </span>
          <span className="text-blue-600 dark:text-blue-400 font-semibold">
            {getActionButtonText()}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
