import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ContentItem } from '@/store/slices/feedSlice';
import DraggableContentCard from './DraggableContentCard';

interface DraggableGridProps {
  items: ContentItem[];
  onReorder: (dragIndex: number, hoverIndex: number, dragSection: string, targetSection: string) => void;
  onItemAction: (url: string) => void;
  section: string;
}

/**
 * DraggableGrid component that renders a grid of draggable content cards
 * Features:
 * - 4-column responsive grid layout
 * - Drag and drop reordering
 * - Smooth animations with Framer Motion
 * - Visual feedback during drag operations
 */

export default function DraggableGrid({ items, onReorder, onItemAction, section }: DraggableGridProps) {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragEnd = (dragIndex: number, dropIndex: number) => {
    if (dragIndex !== dropIndex) {
      onReorder(dragIndex, dropIndex, section, section);
    }
    setDraggedIndex(null);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
      <AnimatePresence>
        {items.filter(item => item && item.id).map((item, index) => (
          <motion.div
            key={`${section}-${item.id}-${index}`}
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: 1, 
              scale: 1,
              zIndex: draggedIndex === index ? 1000 : 1
            }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <DraggableContentCard
              item={item}
              onAction={onItemAction}
              index={index}
              section={section}
              onReorder={onReorder}
              onDragStart={() => handleDragStart(index)}
              onDragEnd={(dragIndex, dropIndex) => handleDragEnd(dragIndex, dropIndex)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
