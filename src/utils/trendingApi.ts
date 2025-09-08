import { NewsArticle, Movie, Track, SocialPost } from './types';
import type { ContentItem } from '@/store/slices/feedSlice';
import { generateNewsId, generateMovieId, generateMusicId, generateSocialId } from './idGenerator';

/**
 * Trending API utilities for fetching trending content across different categories
 * Implements trending logic based on recency, popularity, and engagement metrics
 */

// Trending configuration - Real data only
const TRENDING_CONFIG = {
  NEWS: {
    timeWindow: 24 * 60 * 60 * 1000, // 24 hours
    categories: ['technology', 'business', 'entertainment', 'sports', 'health']
  },
  MOVIES: {
    timeWindow: 30 * 24 * 60 * 60 * 1000, // 30 days (more realistic for movies)
    minRating: 6.5, // Lower threshold for more results
    minVotes: 50 // Lower threshold for more results
  },
  MUSIC: {
    timeWindow: 7 * 24 * 60 * 60 * 1000, // 7 days
    minPopularity: 30 // Lower threshold
  },
  SOCIAL: {
    timeWindow: 24 * 60 * 60 * 1000, // 24 hours (more realistic)
    minLikes: 50, // Lower threshold for more results
    minEngagement: 0.02 // Lower threshold
  }
};

/**
 * Fetch trending news articles based on recency and category popularity
 */
export const fetchTrendingNews = async (): Promise<ContentItem[]> => {
  try {
    const trendingArticles: ContentItem[] = [];
    const now = Date.now();
    
    // Fetch from multiple trending categories
    for (const category of TRENDING_CONFIG.NEWS.categories) {
      try {
        const response = await fetch(`/api/news?category=${category}&page=1`);
        if (!response.ok) continue;
        
        const data = await response.json();
        if (data.articles && Array.isArray(data.articles)) {
          const categoryArticles = data.articles
            .filter((article: { title?: string; url?: string; publishedAt: string }) => {
              if (!article.title || !article.url) return false;
              
              // Filter by recency (within 24 hours)
              const publishedTime = new Date(article.publishedAt).getTime();
              const isRecent = (now - publishedTime) <= TRENDING_CONFIG.NEWS.timeWindow;
              
              return isRecent;
            })
            .slice(0, 3) // Top 3 from each category
            .map((article: { title: string; description?: string; url: string; urlToImage?: string; publishedAt: string; source?: { name?: string } }, index: number): ContentItem => ({
              id: generateNewsId(article.url, index, category),
              title: article.title,
              description: article.description || 'No description available',
              url: article.url,
              imageUrl: article.urlToImage,
              publishedAt: article.publishedAt,
              source: article.source?.name || 'Unknown',
              category,
              type: 'news',
              readTime: article.description ? Math.ceil(article.description.length / 200) : undefined,
            }));
          
          trendingArticles.push(...categoryArticles);
        }
      } catch (error) {
        console.warn(`Failed to fetch trending news for category ${category}:`, error);
      }
    }
    
    // Sort by recency and return top 12
    return trendingArticles
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 12);
      
  } catch (error) {
    console.error('Error fetching trending news:', error);
    return [];
  }
};

/**
 * Fetch trending movies based on rating and recent releases
 */
export const fetchTrendingMovies = async (): Promise<ContentItem[]> => {
  try {
    const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
    if (!TMDB_API_KEY) {
      console.warn('TMDB API key not found');
      return [];
    }

    const response = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&page=1&language=en-US`
    );
    
    if (!response.ok) {
      throw new Error(`TMDB API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.results || !Array.isArray(data.results)) {
      return [];
    }
    
    const now = Date.now();
    const thirtyDaysAgo = now - TRENDING_CONFIG.MOVIES.timeWindow;
    
    type RawMovie = { title: string; overview: string; vote_average: number; vote_count: number; release_date: string; poster_path?: string; id: number | string };
    const results: RawMovie[] = data.results as RawMovie[];
    return results
      .filter((movie: RawMovie) => {
        if (!movie.title || !movie.overview) return false;
        
        // Filter by rating and vote count
        const hasGoodRating = movie.vote_average >= TRENDING_CONFIG.MOVIES.minRating;
        const hasEnoughVotes = movie.vote_count >= TRENDING_CONFIG.MOVIES.minVotes;
        
        // Filter by recency (released within 30 days or upcoming)
        const releaseTime = new Date(movie.release_date).getTime();
        const isRecent = releaseTime >= thirtyDaysAgo || releaseTime > now;
        
        return hasGoodRating && hasEnoughVotes && isRecent;
      })
      .slice(0, 8)
      .map((movie: RawMovie): ContentItem => ({
        id: generateMovieId(Number(movie.id)),
        title: movie.title,
        description: movie.overview,
        imageUrl: movie.poster_path
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : undefined,
        publishedAt: String(movie.release_date),
        rating: Number(movie.vote_average),
        genre: 'Trending',
        source: 'TMDB',
        category: 'movies',
        url: `https://www.themoviedb.org/movie/${movie.id}`,
        type: 'movie',
      }));
      
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    return [];
  }
};

/**
 * Fetch trending music tracks based on popularity and recent releases
 */
export const fetchTrendingMusic = async (): Promise<ContentItem[]> => {
  try {
    // Use real Spotify API for trending music
    const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
    if (!SPOTIFY_CLIENT_ID) {
      console.warn('Spotify Client ID not found');
      return [];
    }

    // For now, return empty array since Spotify trending requires more complex setup
    // In a production app, you would implement Spotify's trending/popular endpoints
    // This could include: New Releases, Featured Playlists, or Popular Tracks
    return [];
    
  } catch (error) {
    console.error('Error fetching trending music:', error);
    return [];
  }
};

/**
 * Fetch trending social posts based on engagement and recency
 */
export const fetchTrendingSocial = async (): Promise<ContentItem[]> => {
  try {
    // For now, return empty array since we're removing mock data
    // In a production app, you would integrate with real social media APIs
    // This could include: Twitter API, Instagram API, or other social platforms
    return [];
      
  } catch (error) {
    console.error('Error fetching trending social posts:', error);
    return [];
  }
};

/**
 * Fetch all trending content across all categories
 */
export const fetchAllTrendingContent = async () => {
  try {
    const [trendingNews, trendingMovies, trendingMusic, trendingSocial]: [
      ContentItem[], ContentItem[], ContentItem[], ContentItem[]
    ] = await Promise.all([
      fetchTrendingNews(),
      fetchTrendingMovies(),
      fetchTrendingMusic(),
      fetchTrendingSocial()
    ]);
    
    return {
      news: trendingNews,
      movies: trendingMovies,
      music: trendingMusic,
      social: trendingSocial,
      all: [...trendingNews, ...trendingMovies, ...trendingMusic, ...trendingSocial]
    };
  } catch (error) {
    console.error('Error fetching all trending content:', error);
    return {
      news: [],
      movies: [],
      music: [],
      social: [],
      all: []
    };
  }
};
