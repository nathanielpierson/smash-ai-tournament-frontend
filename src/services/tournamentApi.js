/**
 * API service for fetching tournament data from the backend
 * Replace the base URL with your actual backend URL
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const fetchTournamentData = async () => {
  try {
    // Try to fetch both matchups and contestants
    const [matchupsResponse, contestantsResponse] = await Promise.allSettled([
      fetch(`${API_BASE_URL}/matchups`),
      fetch(`${API_BASE_URL}/contestants`).catch(() => null), // Try contestants endpoint, but don't fail if it doesn't exist
    ]);
    
    let data = null;
    let contestants = [];
    
    // Handle matchups response
    if (matchupsResponse.status === 'fulfilled' && matchupsResponse.value.ok) {
      data = await matchupsResponse.value.json();
      console.log('Matchups data received from backend:', data);
    } else {
      throw new Error('Failed to fetch matchups data');
    }
    
    // Handle contestants response (if endpoint exists)
    if (contestantsResponse.status === 'fulfilled' && contestantsResponse.value && contestantsResponse.value.ok) {
      contestants = await contestantsResponse.value.json();
      console.log('Contestants data received from backend:', contestants);
    } else {
      console.log('No separate contestants endpoint found, will try to extract from matchups');
    }
    
    // Normalize matchup data - ensure contestant_one_id and contestant_two_id are present
    // Rails might send nested objects or use different field names
    const normalizeMatchups = (matchups) => {
      return matchups.map(matchup => {
        const normalized = { ...matchup };
        
        // If contestant IDs are missing but nested objects exist, extract them
        if (!normalized.contestant_one_id && normalized.contestant_one) {
          normalized.contestant_one_id = normalized.contestant_one.id;
        }
        if (!normalized.contestant_two_id && normalized.contestant_two) {
          normalized.contestant_two_id = normalized.contestant_two.id;
        }
        
        // Handle camelCase if Rails serializer uses it
        if (!normalized.contestant_one_id && normalized.contestantOneId) {
          normalized.contestant_one_id = normalized.contestantOneId;
        }
        if (!normalized.contestant_two_id && normalized.contestantTwoId) {
          normalized.contestant_two_id = normalized.contestantTwoId;
        }
        
        return normalized;
      });
    };
    
    // Use contestants from separate endpoint if available, otherwise try to extract from data
    if (Array.isArray(contestants) && contestants.length > 0) {
      // We have contestants from a separate endpoint
      const matchups = Array.isArray(data) ? data : (data.matchups || []);
      const normalizedMatchups = normalizeMatchups(matchups);
      
      const formattedData = {
        matchups: normalizedMatchups,
        contestants: contestants,
      };
      console.log('Formatted data (with separate contestants):', formattedData);
      
      // Debug: Show sample matchup and contestant structures
      if (formattedData.matchups.length > 0) {
        const sampleMatchup = formattedData.matchups[0];
        console.log('Sample matchup (after normalization):', sampleMatchup);
        console.log('All matchup keys:', Object.keys(sampleMatchup));
        console.log('Matchup contestant_one_id:', sampleMatchup.contestant_one_id);
        console.log('Matchup contestant_two_id:', sampleMatchup.contestant_two_id);
      }
      if (contestants.length > 0) {
        console.log('Sample contestant:', contestants[0]);
        console.log('Contestant ID field:', contestants[0].id);
        console.log('Contestant name field:', contestants[0].name);
        console.log('First 5 contestant IDs:', contestants.slice(0, 5).map(c => c.id));
      }
      
      return formattedData;
    }
    
    // Handle different response structures
    // If the response is an array of matchups, we need to extract contestants
    if (Array.isArray(data)) {
      const normalizedMatchups = normalizeMatchups(data);
      
      // Extract unique contestants from matchups
      const contestantIds = new Set();
      normalizedMatchups.forEach(matchup => {
        if (matchup.contestant_one_id) contestantIds.add(matchup.contestant_one_id);
        if (matchup.contestant_two_id) contestantIds.add(matchup.contestant_two_id);
      });
      
      // If matchups have nested contestant data, extract it
      const extractedContestants = [];
      data.forEach(matchup => {
        if (matchup.contestant_one && !extractedContestants.find(c => c.id === matchup.contestant_one.id)) {
          extractedContestants.push(matchup.contestant_one);
        }
        if (matchup.contestant_two && !extractedContestants.find(c => c.id === matchup.contestant_two.id)) {
          extractedContestants.push(matchup.contestant_two);
        }
      });
      
      const formattedData = {
        matchups: normalizedMatchups,
        contestants: extractedContestants.length > 0 ? extractedContestants : [], // Will need to fetch separately if not in matchups
      };
      console.log('Formatted data (array response):', formattedData);
      console.log('Extracted contestants:', extractedContestants);
      console.log('Contestant IDs found:', Array.from(contestantIds));
      return formattedData;
    }
    
    // If it's an object but missing matchups/contestants, ensure they exist
    const matchups = data.matchups || [];
    const normalizedMatchups = normalizeMatchups(matchups);
    
    const formattedData = {
      matchups: normalizedMatchups,
      contestants: data.contestants || contestants || [],
      ...data, // Include any other properties
    };
    console.log('Formatted data (object response):', formattedData);
    console.log('Contestants count:', formattedData.contestants.length);
    console.log('Matchups count:', formattedData.matchups.length);
    if (formattedData.matchups.length > 0) {
      console.log('Sample matchup (after normalization):', formattedData.matchups[0]);
    }
    return formattedData;
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
