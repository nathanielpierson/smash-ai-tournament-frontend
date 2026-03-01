/**
 * Utility functions for tournament bracket structure
 * Handles double elimination tournament with 64 participants
 */

/**
 * Determines the bracket type and round number based on matchup number
 * @param {number} matchupNumber - The matchup number from the backend
 * @returns {Object} { bracket: 'winners' | 'losers' | 'final', round: number, displayName: string }
 */
export function getBracketAndRound(matchupNumber) {
  if (!matchupNumber) {
    return { bracket: 'winners', round: 1, displayName: 'Unknown' };
  }

  // Winner's Bracket
  if (matchupNumber >= 1 && matchupNumber <= 32) {
    return { bracket: 'winners', round: 1, displayName: 'Round of 64' };
  }
  if (matchupNumber >= 49 && matchupNumber <= 64) {
    return { bracket: 'winners', round: 2, displayName: "Winner's Bracket Round 2" };
  }
  if (matchupNumber >= 89 && matchupNumber <= 96) {
    return { bracket: 'winners', round: 3, displayName: "Winner's Bracket Round 3" };
  }
  if ([109, 110, 111, 112].includes(matchupNumber)) {
    return { bracket: 'winners', round: 4, displayName: "Winner's Bracket Round 4" };
  }
  if ([119, 120].includes(matchupNumber)) {
    return { bracket: 'winners', round: 5, displayName: "Winner's Bracket Round 5" };
  }
  if (matchupNumber === 124) {
    return { bracket: 'winners', round: 6, displayName: "Winner's Bracket Round 6" };
  }

  // Loser's Bracket
  if (matchupNumber >= 33 && matchupNumber <= 48) {
    return { bracket: 'losers', round: 1, displayName: "Loser's Bracket Round 1" };
  }
  if (matchupNumber >= 65 && matchupNumber <= 80) {
    return { bracket: 'losers', round: 2, displayName: "Loser's Bracket Round 2" };
  }
  if (matchupNumber >= 81 && matchupNumber <= 88) {
    return { bracket: 'losers', round: 3, displayName: "Loser's Bracket Round 3" };
  }
  if (matchupNumber >= 97 && matchupNumber <= 104) {
    return { bracket: 'losers', round: 4, displayName: "Loser's Bracket Round 4" };
  }
  if (matchupNumber >= 105 && matchupNumber <= 108) {
    return { bracket: 'losers', round: 5, displayName: "Loser's Bracket Round 5" };
  }
  if ([113, 114, 115, 116].includes(matchupNumber)) {
    return { bracket: 'losers', round: 6, displayName: "Loser's Bracket Round 6" };
  }
  if ([117, 118].includes(matchupNumber)) {
    return { bracket: 'losers', round: 7, displayName: "Loser's Bracket Round 7" };
  }
  if ([121, 122].includes(matchupNumber)) {
    return { bracket: 'losers', round: 8, displayName: "Loser's Bracket Round 8" };
  }
  if (matchupNumber === 123) {
    return { bracket: 'losers', round: 9, displayName: "Loser's Bracket Round 9" };
  }
  if (matchupNumber === 125) {
    return { bracket: 'losers', round: 10, displayName: "Loser's Bracket Round 10" };
  }

  // Final
  if ([126, 127].includes(matchupNumber)) {
    return { bracket: 'final', round: 1, displayName: 'Final' };
  }

  // Fallback for unknown matchup numbers
  return { bracket: 'winners', round: 1, displayName: 'Unknown Round' };
}

/**
 * Creates a unique key for a bracket/round combination
 * @param {string} bracket - 'winners' | 'losers' | 'final'
 * @param {number} round - Round number
 * @returns {string} Unique key
 */
export function getRoundKey(bracket, round) {
  return `${bracket}-${round}`;
}

/**
 * Parses a round key back into bracket and round
 * @param {string} key - Round key (e.g., 'winners-1')
 * @returns {Object} { bracket: string, round: number }
 */
export function parseRoundKey(key) {
  const [bracket, round] = key.split('-');
  return { bracket, round: Number(round) };
}
