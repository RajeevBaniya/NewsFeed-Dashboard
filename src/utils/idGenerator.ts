/**
 * Utility functions for generating unique IDs to prevent duplicates
 */

let idCounter = 0;

/**
 * Generate a unique ID with timestamp and counter
 * @param prefix - Prefix for the ID (e.g., 'news', 'movie')
 * @returns Unique ID string
 */
export const generateUniqueId = (prefix: string): string => {
  idCounter++;
  return `${prefix}-${Date.now()}-${idCounter}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Generate a content-based unique ID using URL or title hash
 * @param content - Content to generate ID from (URL, title, etc.)
 * @param prefix - Prefix for the ID
 * @returns Unique ID string based on content
 */
export const generateContentBasedId = (content: string, prefix: string): string => {
  // Create a simple hash from the content
  let hash = 0;
  for (let i = 0; i < content.length; i++) {
    const char = content.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  // Use absolute value and convert to base36 for shorter ID
  const contentHash = Math.abs(hash).toString(36);
  return `${prefix}-${contentHash}`;
};

/**
 * Generate ID for news articles using URL as base
 * @param url - Article URL
 * @param index - Index in the array
 * @param category - News category (optional)
 * @returns Unique ID for news article
 */
export const generateNewsId = (url: string, index: number, category?: string): string => {
  if (url && url !== '#') {
    // Use URL as primary identifier, but include category to make it unique across categories
    const baseId = generateContentBasedId(url, 'news');
    return category ? `${baseId}-${category}` : baseId;
  }
  return generateUniqueId(`news-${index}`);
};

/**
 * Generate ID for movies using TMDB ID
 * @param tmdbId - TMDB movie ID
 * @returns Unique ID for movie
 */
export const generateMovieId = (tmdbId: number): string => {
  return `movie-${tmdbId}`;
};

/**
 * Generate ID for music tracks using Spotify ID or content hash
 * @param spotifyId - Spotify track ID (if available)
 * @param title - Track title
 * @param artist - Artist name
 * @returns Unique ID for music track
 */
export const generateMusicId = (spotifyId?: string, title?: string, artist?: string): string => {
  if (spotifyId) {
    return `music-${spotifyId}`;
  }
  
  if (title && artist) {
    return generateContentBasedId(`${title}-${artist}`, 'music');
  }
  
  return generateUniqueId('music');
};

/**
 * Generate ID for social posts using existing ID or content hash
 * @param existingId - Existing ID from JSON
 * @param title - Post title
 * @param author - Post author
 * @returns Unique ID for social post
 */
export const generateSocialId = (existingId?: string, title?: string, author?: string): string => {
  if (existingId) {
    return existingId;
  }
  
  if (title && author) {
    return generateContentBasedId(`${title}-${author}`, 'social');
  }
  
  return generateUniqueId('social');
};
