/**
 * API service for fetching tournament data from the backend
 * Replace the base URL with your actual backend URL
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

/**
 * Fetches tournament data from the backend
 * Expected response structure:
 * {
 *   contestants: [{ id, name, ... }],
 *   matchups: [{ id, number, contestant_one_id, contestant_two_id, youtube_url, outcome, ... }],
 * }
 */
export const fetchTournamentData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/matchups`);
    if (!response.ok) {
      throw new Error('Failed to fetch tournament data');
    }
    const data = await response.json();
    
    // Handle different response structures
    // If the response is an array of matchups, wrap it in the expected structure
    if (Array.isArray(data)) {
      return {
        matchups: data,
        contestants: [], // Will need to fetch separately or extract from matchups
      };
    }
    
    // If it's an object but missing matchups/contestants, ensure they exist
    return {
      matchups: data.matchups || [],
      contestants: data.contestants || [],
      ...data, // Include any other properties
    };
  } catch (error) {
    // Silently fall back to mock data for development
    // Only log if you want to see when the API is unavailable
    if (import.meta.env.DEV) {
      console.log('Using mock tournament data (backend unavailable)');
    }
    // Return mock data for development
    return getMockTournamentData();
  }
};

/**
 * Mock tournament data for development/testing
 */
export const getMockTournamentData = () => {
  return {
    contestants: [
      { id: 1, name: 'Player 1' },
      { id: 2, name: 'Player 2' },
      { id: 3, name: 'Player 3' },
      { id: 4, name: 'Player 4' },
      { id: 5, name: 'Player 5' },
      { id: 6, name: 'Player 6' },
      { id: 7, name: 'Player 7' },
      { id: 8, name: 'Player 8' },
    ],
    matchups: [
      {
        id: 1,
        number: 1,
        contestant_one_id: 1,
        contestant_two_id: 2,
        youtube_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        outcome: '1',
      },
      {
        id: 2,
        number: 2,
        contestant_one_id: 3,
        contestant_two_id: 4,
        youtube_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        outcome: '3',
      },
      {
        id: 3,
        number: 3,
        contestant_one_id: 5,
        contestant_two_id: 6,
        youtube_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        outcome: '5',
      },
      {
        id: 4,
        number: 4,
        contestant_one_id: 7,
        contestant_two_id: 8,
        youtube_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        outcome: '7',
      },
      {
        id: 5,
        number: 5,
        contestant_one_id: 1,
        contestant_two_id: 3,
        youtube_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        outcome: '1',
      },
      {
        id: 6,
        number: 6,
        contestant_one_id: 5,
        contestant_two_id: 7,
        youtube_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        outcome: '5',
      },
      {
        id: 7,
        number: 7,
        contestant_one_id: 1,
        contestant_two_id: 5,
        youtube_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        outcome: '1',
      },
    ],
  };
};
