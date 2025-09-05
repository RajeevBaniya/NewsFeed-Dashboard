export interface NewsArticle {
  id: string;
  title: string;
  description: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  source: {
    name: string;
  };
  category: string;
}

export interface Movie {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  releaseDate: string;
  rating: number;
  genre: string;
  url: string;
  type: 'movie';
}

export interface Track {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  artist: string;
  album: string;
  duration: number;
  url: string;
  type: 'music';
}

export interface SocialPost {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  author: string;
  platform: string;
  publishedAt: string;
  likes: number;
  url: string;
  type: 'social';
  hashtags: string[];
}

// API Response Types
export interface NewsApiResponse {
  articles: NewsApiArticle[];
  status: string;
  totalResults: number;
}

export interface NewsApiArticle {
  title: string;
  description: string;
  url: string;
  urlToImage?: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

export interface TmdbApiResponse {
  results: TmdbMovie[];
  page: number;
  total_results: number;
  total_pages: number;
}

export interface TmdbMovie {
  id: number;
  title: string;
  overview: string;
  poster_path?: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

export interface SpotifyApiResponse {
  tracks: {
    items: SpotifyTrack[];
  };
}

export interface SpotifyTrack {
  id: string;
  name: string;
  album: {
    name: string;
    images: Array<{
      url: string;
    }>;
  };
  artists: Array<{
    name: string;
  }>;
  duration_ms: number;
  external_urls: {
    spotify: string;
  };
}

export interface SpotifyNewReleasesResponse {
  albums: {
    items: Array<{
      id: string;
      name: string;
      images: Array<{
        url: string;
      }>;
    }>;
  };
}

export interface SpotifyAlbumTracksResponse {
  items: Array<{
    id: string;
    name: string;
    artists: Array<{
      name: string;
    }>;
    duration_ms: number;
    external_urls: {
      spotify: string;
    };
  }>;
}
