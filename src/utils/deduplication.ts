import { ContentItem } from '@/store/slices/feedSlice';

/**
 * Utility functions for content deduplication
 */

/**
 * Check if two content items are duplicates based on multiple criteria
 * @param item1 - First content item
 * @param item2 - Second content item
 * @returns True if items are duplicates
 */
export const areItemsDuplicates = (item1: ContentItem, item2: ContentItem): boolean => {
  // Same ID means definitely duplicate
  if (item1.id === item2.id) {
    return true;
  }
  
  // Same URL means duplicate (for news, movies, music)
  if (item1.url && item2.url && item1.url === item2.url && item1.url !== '#') {
    return true;
  }
  
  // Same title and type means likely duplicate
  if (item1.title === item2.title && item1.type === item2.type) {
    // Additional checks based on type
    switch (item1.type) {
      case 'news':
        // Same source and similar publish time (within 1 hour)
        if (item1.source === item2.source) {
          const time1 = new Date(item1.publishedAt).getTime();
          const time2 = new Date(item2.publishedAt).getTime();
          const timeDiff = Math.abs(time1 - time2);
          // If published within 1 hour of each other, consider duplicate
          if (timeDiff < 3600000) { // 1 hour in milliseconds
            return true;
          }
        }
        break;
      case 'movie':
        // Same rating and release date
        if (item1.rating === item2.rating && item1.publishedAt === item2.publishedAt) {
          return true;
        }
        break;
      case 'music':
        // Same artist and album and similar title
        if (item1.artist === item2.artist && item1.album === item2.album) {
          return true;
        }
        break;
      case 'social':
        // Same author and platform
        if (item1.author === item2.author && item1.platform === item2.platform) {
          return true;
        }
        break;
    }
  }
  
  return false;
};

/**
 * Remove duplicates from an array of content items
 * @param items - Array of content items
 * @returns Array with duplicates removed
 */
export const removeDuplicates = (items: ContentItem[]): ContentItem[] => {
  const seen = new Set<string>();
  const uniqueItems: ContentItem[] = [];
  
  for (const item of items) {
    // Check if we've seen this exact item
    if (seen.has(item.id)) {
      continue;
    }
    
    // Check if this item is a duplicate of any existing item
    const isDuplicate = uniqueItems.some(existingItem => 
      areItemsDuplicates(item, existingItem)
    );
    
    if (!isDuplicate) {
      seen.add(item.id);
      uniqueItems.push(item);
    }
  }
  
  return uniqueItems;
};

/**
 * Merge two arrays of content items, removing duplicates
 * @param existingItems - Existing items array
 * @param newItems - New items to add
 * @returns Merged array with duplicates removed
 */
export const mergeWithoutDuplicates = (existingItems: ContentItem[], newItems: ContentItem[]): ContentItem[] => {
  const allItems = [...existingItems, ...newItems];
  return removeDuplicates(allItems);
};

/**
 * Check if a new item already exists in the existing items array
 * @param existingItems - Array of existing items
 * @param newItem - New item to check
 * @returns True if item already exists
 */
export const itemExists = (existingItems: ContentItem[], newItem: ContentItem): boolean => {
  return existingItems.some(existingItem => areItemsDuplicates(existingItem, newItem));
};

/**
 * Filter out items that already exist in the existing array
 * @param existingItems - Array of existing items
 * @param newItems - Array of new items to filter
 * @returns Array of new items that don't exist in existing array
 */
export const filterNewItems = (existingItems: ContentItem[], newItems: ContentItem[]): ContentItem[] => {
  return newItems.filter(newItem => !itemExists(existingItems, newItem));
};
