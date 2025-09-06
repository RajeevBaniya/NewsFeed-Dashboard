import { createContext, useContext, useState, useCallback } from 'react';
import { ContentItem } from '@/store/slices/feedSlice';

interface DragDropContextType {
  draggedItem: ContentItem | null;
  draggedIndex: number | null;
  draggedSection: string | null;
  setDraggedItem: (item: ContentItem | null, index: number | null, section: string | null) => void;
  handleDrop: (targetIndex: number, targetSection: string, onReorder: (dragIndex: number, hoverIndex: number, dragSection: string, targetSection: string) => void) => void;
}

const DragDropContext = createContext<DragDropContextType | undefined>(undefined);

export function DragDropProvider({ children }: { children: React.ReactNode }) {
  const [draggedItem, setDraggedItemState] = useState<ContentItem | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [draggedSection, setDraggedSection] = useState<string | null>(null);

  const setDraggedItem = useCallback((item: ContentItem | null, index: number | null, section: string | null) => {
    setDraggedItemState(item);
    setDraggedIndex(index);
    setDraggedSection(section);
  }, []);

  const handleDrop = useCallback((
    targetIndex: number, 
    targetSection: string, 
    onReorder: (dragIndex: number, hoverIndex: number, dragSection: string, targetSection: string) => void
  ) => {
    if (draggedIndex !== null && draggedSection !== null) {
      onReorder(draggedIndex, targetIndex, draggedSection, targetSection);
    }
    setDraggedItem(null, null, null);
  }, [draggedIndex, draggedSection]);

  return (
    <DragDropContext.Provider value={{
      draggedItem,
      draggedIndex,
      draggedSection,
      setDraggedItem,
      handleDrop,
    }}>
      {children}
    </DragDropContext.Provider>
  );
}

export function useDragDrop() {
  const context = useContext(DragDropContext);
  if (context === undefined) {
    throw new Error('useDragDrop must be used within a DragDropProvider');
  }
  return context;
}
