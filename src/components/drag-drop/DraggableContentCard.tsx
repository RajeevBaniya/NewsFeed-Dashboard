import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ContentItem } from '@/store/slices/feedSlice';
import { CONTENT_ICONS, ACTION_TEXTS } from '@/constants';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { toggleFavorite } from '@/store/slices/favoritesSlice';
import { useDragDrop } from './DragDropContext';
import Icon from '../ui/Icon';

interface DraggableContentCardProps {
  item: ContentItem;
  onAction: (url: string) => void;
  index: number;
  section: string;
  onReorder: (dragIndex: number, hoverIndex: number, dragSection: string, targetSection: string) => void;
  onDragStart?: () => void;
  onDragEnd?: (dragIndex: number, dropIndex: number) => void;
}

/**
 * DraggableContentCard component that displays content items with drag-and-drop functionality
 * Features:
 * - Framer Motion drag implementation
 * - Visual drag handle indicator
 * - Drop detection and reordering
 * - Favorites functionality
 * - Responsive design with consistent sizing
 */

export default function DraggableContentCard({ 
  item, 
  onAction, 
  index, 
  section,
  onReorder,
  onDragStart: externalOnDragStart,
  onDragEnd: externalOnDragEnd
}: DraggableContentCardProps) {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.items);
  const isFavorite = favorites.some(fav => fav.id === item.id);
  const [isDragging, setIsDragging] = useState(false);
  const [imageError, setImageError] = useState(false);
  const { setDraggedItem } = useDragDrop();
  const autoScrollRef = useRef<number | null>(null);

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(toggleFavorite(item));
  };

  /**
   * Get appropriate icon for content type
   */
  const getIcon = () => {
    switch (item.type) {
      case 'news':
        return CONTENT_ICONS.NEWS;
      case 'movie':
        return CONTENT_ICONS.MOVIE;
      case 'music':
        return CONTENT_ICONS.MUSIC;
      case 'social':
        return CONTENT_ICONS.SOCIAL;
      default:
        return '📄';
    }
  };

  /**
   * Get action button text based on content type
   */
  const getActionText = () => {
    switch (item.type) {
      case 'news':
        return ACTION_TEXTS.NEWS;
      case 'movie':
        return ACTION_TEXTS.MOVIE;
      case 'music':
        return ACTION_TEXTS.MUSIC;
      case 'social':
        return ACTION_TEXTS.SOCIAL;
      default:
        return 'View';
    }
  };

  /**
   * Format metadata string based on content type
   */
  const getMetadata = () => {
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

  /**
   * Auto-scroll functionality for drag and drop
   */
  const startAutoScroll = useCallback((clientY: number) => {
    const scrollThreshold = 100; // Distance from edge to trigger scroll
    const maxScrollSpeed = 20; // Maximum pixels per frame
    const viewportHeight = window.innerHeight;
    
    const shouldScrollUp = clientY < scrollThreshold;
    const shouldScrollDown = clientY > viewportHeight - scrollThreshold;
    
    if (shouldScrollUp || shouldScrollDown) {
      // Calculate scroll speed based on distance from edge (closer = faster)
      const distanceFromEdge = shouldScrollUp ? clientY : viewportHeight - clientY;
      const speedMultiplier = Math.max(0.5, 1 - (distanceFromEdge / scrollThreshold));
      const scrollSpeed = maxScrollSpeed * speedMultiplier;
      
      const scrollDirection = shouldScrollUp ? -1 : 1;
      const scrollAmount = scrollDirection * scrollSpeed;
      
      // Only start scrolling if not already scrolling
      if (!autoScrollRef.current) {
        const scroll = () => {
          window.scrollBy(0, scrollAmount);
          autoScrollRef.current = requestAnimationFrame(scroll);
        };
        
        scroll();
      }
    } else {
      // Stop scrolling if not near edges
      stopAutoScroll();
    }
  }, []);

  const stopAutoScroll = () => {
    if (autoScrollRef.current) {
      cancelAnimationFrame(autoScrollRef.current);
      autoScrollRef.current = null;
    }
  };

  // Clean up auto-scroll on unmount and add global drag listener
  useEffect(() => {
    const handleGlobalMouseMove = (event: MouseEvent) => {
      if (isDragging) {
        startAutoScroll(event.clientY);
      }
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
    }

    return () => {
      stopAutoScroll();
      document.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, [isDragging, startAutoScroll]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      drag
      dragConstraints={false}
      dragElastic={false}
      dragMomentum={false}
      onDragStart={() => {
        console.log('Drag started for card:', item.title, 'at index:', index);
        setIsDragging(true);
        setDraggedItem(item, index, section);
        externalOnDragStart?.();
        
        // Ensure the drag area is the entire document
        document.body.style.cursor = 'grabbing';
        document.body.style.userSelect = 'none';
        
        // Set the drag area to the entire document
        const dragArea = document.documentElement;
        dragArea.style.cursor = 'grabbing';
      }}
      onDrag={(event) => {
        // Auto-scroll when dragging near viewport edges
        if (event && 'clientY' in event && typeof event.clientY === 'number') {
          startAutoScroll(event.clientY);
        }
      }}
      onDragEnd={(event, info) => {
        console.log('Drag ended for card:', item.title);
        stopAutoScroll();
        setIsDragging(false);
        setDraggedItem(null, null, null);
        
        // Reset cursor and user select
        document.body.style.cursor = 'default';
        document.body.style.userSelect = 'auto';
        document.documentElement.style.cursor = 'default';
        
        // Find the drop target based on the final position
        const dropTarget = document.elementFromPoint(info.point.x, info.point.y);
        
        if (dropTarget) {
          // Look for the closest draggable card, but exclude the current dragging card
          const allCards = document.querySelectorAll('[data-drag-index]');
          let dropCard = null;
          let minDistance = Infinity;
          
          allCards.forEach(card => {
            const cardIndex = parseInt(card.getAttribute('data-drag-index') || '0');
            if (cardIndex !== index) {
              const rect = card.getBoundingClientRect();
              const cardCenterX = rect.left + rect.width / 2;
              const cardCenterY = rect.top + rect.height / 2;
              const distance = Math.sqrt(
                Math.pow(info.point.x - cardCenterX, 2) + 
                Math.pow(info.point.y - cardCenterY, 2)
              );
              
              if (distance < minDistance) {
                minDistance = distance;
                dropCard = card;
              }
            }
          });
          
          if (dropCard) {
            const targetIndex = parseInt((dropCard as Element).getAttribute('data-drag-index') || '0');
            
            // Only call externalOnDragEnd if we're dropping on a different card
            if (targetIndex !== index) {
              externalOnDragEnd?.(index, targetIndex);
            }
          }
        }
      }}
      style={{}}
      className={`bg-white dark:bg-gray-900 rounded-lg overflow-hidden relative cursor-grab active:cursor-grabbing h-80 flex flex-col select-none shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-700 ${
        isDragging ? 'scale-105 z-50' : ''
      }`}
      data-drag-index={index}
      data-drag-section={section}
    >

      <motion.button
        onClick={handleToggleFavorite}
        className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm hover:bg-white dark:hover:bg-gray-800 transition-colors z-10 shadow-sm"
        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onPointerDown={(e) => e.stopPropagation()}
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

      {/* Drag Handle */}
      <div className="absolute top-2 left-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center cursor-grab active:cursor-grabbing z-20">
        <div className="w-2 h-2 bg-white rounded-full"></div>
      </div>
      
      {/* Image Section */}
      <div className="w-full h-40 bg-gray-100 dark:bg-gray-800 overflow-hidden flex-shrink-0">
        {item.imageUrl && !imageError ? (
          <Image
            src={item.imageUrl}
            alt={item.title}
            width={400}
            height={192}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 pointer-events-none"
            onError={() => setImageError(true)}
            unoptimized={item.imageUrl.startsWith('http')}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500 text-4xl">
            {getIcon()}
          </div>
        )}
      </div>
      
      {/* Content Section */}
      <div className="p-4 flex flex-col flex-1 justify-between pointer-events-none bg-white dark:bg-gray-900">
        <h4 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight line-clamp-3 mb-3">
          {item.title}
        </h4>
        
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mt-auto">
          <span className="font-medium">
            {getMetadata()}
          </span>
          <span className="text-blue-600 dark:text-blue-400 font-semibold">
            {getActionText()}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
