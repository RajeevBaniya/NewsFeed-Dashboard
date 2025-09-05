import { Movie, TmdbApiResponse, TmdbMovie } from './types';

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

export const fetchPopularMovies = async (): Promise<Movie[]> => {
  if (!TMDB_API_KEY) {
    throw new Error('TMDB API key not found');
  }

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/popular?api_key=${TMDB_API_KEY}&language=en-US&page=1`
    );

    if (!response.ok) {
      throw new Error(`TMDB request failed: ${response.status}`);
    }

    const data: TmdbApiResponse = await response.json();
    
    return data.results.map((movie: TmdbMovie) => ({
      id: `movie-${movie.id}`,
      title: movie.title || 'No title available',
      description: movie.overview || 'No description available',
      imageUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : undefined,
      releaseDate: movie.release_date || new Date().toISOString(),
      rating: movie.vote_average || 0,
      genre: movie.genre_ids ? movie.genre_ids.join(', ') : 'Unknown',
      url: `https://www.themoviedb.org/movie/${movie.id}`,
      type: 'movie' as const
    }));
  } catch (error) {
    console.error('Error fetching movies:', error);
    throw error;
  }
};

export const searchMovies = async (query: string): Promise<Movie[]> => {
  if (!TMDB_API_KEY) {
    throw new Error('TMDB API key not found');
  }

  try {
    const response = await fetch(
      `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=en-US&page=1`
    );

    if (!response.ok) {
      throw new Error(`TMDB search failed: ${response.status}`);
    }

    const data: TmdbApiResponse = await response.json();
    
    return data.results.map((movie: TmdbMovie) => ({
      id: `search-movie-${movie.id}`,
      title: movie.title || 'No title available',
      description: movie.overview || 'No description available',
      imageUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : undefined,
      releaseDate: movie.release_date || new Date().toISOString(),
      rating: movie.vote_average || 0,
      genre: movie.genre_ids ? movie.genre_ids.join(', ') : 'Unknown',
      url: `https://www.themoviedb.org/movie/${movie.id}`,
      type: 'movie' as const
    }));
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};
