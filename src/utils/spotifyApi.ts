import { Track, SpotifyNewReleasesResponse, SpotifyAlbumTracksResponse, SpotifyApiResponse, SpotifyTrack } from './types';

const SPOTIFY_CLIENT_ID = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET;

const getAccessToken = async (): Promise<string> => {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    throw new Error('Spotify credentials not found');
  }

  const response = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`)}`
    },
    body: 'grant_type=client_credentials'
  });

  if (!response.ok) {
    throw new Error('Failed to get Spotify access token');
  }

  const data = await response.json();
  return data.access_token;
};

export const fetchFeaturedPlaylists = async (): Promise<Track[]> => {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    console.warn('Spotify credentials not found, returning empty array');
    return [];
  }

  try {
    const accessToken = await getAccessToken();

    // Use the correct endpoint for new releases
    const response = await fetch('https://api.spotify.com/v1/browse/new-releases?limit=20', {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`Spotify request failed: ${response.status}`);
    }

    const data: SpotifyNewReleasesResponse = await response.json();
    
    if (data.albums && data.albums.items && data.albums.items.length > 0) {
      // Get tracks from the first album
      const albumId = data.albums.items[0].id;
      const tracksResponse = await fetch(`https://api.spotify.com/v1/albums/${albumId}/tracks?limit=10`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });

      if (tracksResponse.ok) {
        const tracksData: SpotifyAlbumTracksResponse = await tracksResponse.json();
        return tracksData.items.map((track, index: number) => ({
          id: `track-${index}-${Date.now()}`,
          title: track.name || 'Unknown Track',
          description: `From ${data.albums.items[0].name || 'Unknown Album'}`,
          imageUrl: data.albums.items[0].images?.[0]?.url,
          artist: track.artists?.[0]?.name || 'Unknown Artist',
          album: data.albums.items[0].name || 'Unknown Album',
          duration: track.duration_ms || 0,
          url: track.external_urls?.spotify || '#',
          type: 'music' as const
        }));
      }
    }

    return [];
  } catch (error) {
    console.error('Error fetching Spotify tracks:', error);
    throw error;
  }
};

export const searchTracks = async (query: string): Promise<Track[]> => {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    console.warn('Spotify credentials not found, returning empty array');
    return [];
  }

  try {
    const accessToken = await getAccessToken();

    const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    if (!response.ok) {
      throw new Error(`Spotify search failed: ${response.status}`);
    }

    const data: SpotifyApiResponse = await response.json();
    
    return data.tracks.items.map((track: SpotifyTrack, index: number) => ({
      id: `search-track-${index}-${Date.now()}`,
      title: track.name || 'Unknown Track',
      description: `From ${track.album?.name || 'Unknown Album'}`,
      imageUrl: track.album?.images?.[0]?.url,
      artist: track.artists?.[0]?.name || 'Unknown Artist',
      album: track.album?.name || 'Unknown Album',
      duration: track.duration_ms || 0,
      url: track.external_urls?.spotify || '#',
      type: 'music' as const
    }));
  } catch (error) {
    console.error('Error searching Spotify tracks:', error);
    throw error;
  }
};