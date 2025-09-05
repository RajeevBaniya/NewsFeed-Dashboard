export const CONTENT_TYPES = {
  NEWS: 'news',
  MOVIE: 'movie',
  MUSIC: 'music',
  SOCIAL: 'social',
} as const;

export const CONTENT_ICONS = {
  NEWS: '📰',
  MOVIE: '🎬',
  MUSIC: '🎵',
  SOCIAL: '📱',
} as const;

export const ACTION_TEXTS = {
  NEWS: 'Read More',
  MOVIE: 'View Movie',
  MUSIC: 'Play Now',
  SOCIAL: 'View Post',
} as const;

export const DEFAULT_MAX_ITEMS = 5;
export const MUSIC_MAX_ITEMS = 10; // Show all music tracks
