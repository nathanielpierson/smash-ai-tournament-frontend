/**
 * API service for fetching tournament data from the backend
 * Replace the base URL with your actual backend URL
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

/**
 * Fetches tournament data from the backend
 * Expected response structure:
 * {
 *   contenders: [{ id, name, ... }],
 *   matchups: [{ id, round, player1Id, player2Id, videoUrl, winnerId, ... }],
 *   results: [{ matchupId, winnerId, ... }]
 * }
 */
export const fetchTournamentData = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/tournament`);
    if (!response.ok) {
      throw new Error('Failed to fetch tournament data');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching tournament data:', error);
    // Return mock data for development
    return getMockTournamentData();
  }
};

/**
 * Mock tournament data for development/testing
 */
export const getMockTournamentData = () => {
  return {
    contenders: [
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
        round: 1,
        player1Id: 1,
        player2Id: 2,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        winnerId: 1,
      },
      {
        id: 2,
        round: 1,
        player1Id: 3,
        player2Id: 4,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        winnerId: 3,
      },
      {
        id: 3,
        round: 1,
        player1Id: 5,
        player2Id: 6,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        winnerId: 5,
      },
      {
        id: 4,
        round: 1,
        player1Id: 7,
        player2Id: 8,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        winnerId: 7,
      },
      {
        id: 5,
        round: 2,
        player1Id: 1,
        player2Id: 3,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        winnerId: 1,
      },
      {
        id: 6,
        round: 2,
        player1Id: 5,
        player2Id: 7,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        winnerId: 5,
      },
      {
        id: 7,
        round: 3,
        player1Id: 1,
        player2Id: 5,
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
        winnerId: 1,
      },
    ],
  };
};
