// src/services/jamendoService.ts

import axios from 'axios';

/**
 * Interface representing a Genre object fetched from Jamendo API.
 */
export interface Genre {
  id: number;
  name: string;
  slug: string;
}

/**
 * Interface representing a Song object fetched from Jamendo API.
 */
export interface Song {
  id: number;
  name: string; // Title of the song
  artist_name: string;
  album_name: string;
  image: string; // URL to album art
  audio: string; // URL to full audio stream
}

const CLIENT_ID = 'b532c8ee'; // Replace with your actual Jamendo Client ID

/**
 * Fetches a list of genres from Jamendo API.
 * @returns A promise that resolves to an array of Genre objects.
 */
export const fetchGenres = async (): Promise<Genre[]> => {
  try {
    const response = await axios.get('https://api.jamendo.com/v3.0/genres/', {
      params: {
        client_id: CLIENT_ID,
        format: 'json',
        groupby: 'parent_id',
      },
    });

    if (response.data && response.data.results) {
      const genres: Genre[] = response.data.results.map((item: any) => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
      }));

      return genres;
    } else {
      console.warn('Unexpected response structure for genres:', response.data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching genres from Jamendo:', error);
    return [];
  }
};

/**
 * Fetches a list of songs from Jamendo API based on selected genres.
 * @param genres - Array of genre IDs to filter songs.
 * @returns A promise that resolves to an array of Song objects.
 */
export const fetchSongsByGenres = async (genres: number[]): Promise<Song[]> => {
  try {
    const response = await axios.get('https://api.jamendo.com/v3.0/tracks/', {
      params: {
        client_id: CLIENT_ID,
        format: 'json',
        limit: 50,
        audioformat: 'mp32', // For MP3 320kbps
        include: 'musicinfo',
        genres: genres.join(','), // Comma-separated list of genre IDs
      },
    });

    if (response.data && response.data.results) {
      const songs: Song[] = response.data.results.map((item: any) => ({
        id: item.id,
        name: item.name,
        artist_name: item.artist_name,
        album_name: item.album_name,
        image: item.album_image,
        audio: item.audio, // Ensure this is the full-length audio URL
      }));

      return songs;
    } else {
      console.warn('Unexpected response structure for songs:', response.data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching songs from Jamendo:', error);
    return [];
  }
};
