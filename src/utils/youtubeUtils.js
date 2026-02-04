/**
 * Utility functions for YouTube URL handling
 */

/**
 * Converts various YouTube URL formats to embed format
 * Handles:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID (already correct)
 * - https://youtube.com/watch?v=VIDEO_ID
 * @param {string} url - YouTube URL in any format
 * @returns {string} - YouTube embed URL or original URL if not a YouTube URL
 */
export function convertToEmbedUrl(url) {
  if (!url) return null;
  
  // If it's already an embed URL, return as-is
  if (url.includes('youtube.com/embed/')) {
    return url;
  }
  
  let videoId = null;
  
  // Handle youtu.be short URLs: https://youtu.be/VIDEO_ID
  const youtuBeMatch = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([^&\s]+)/);
  if (youtuBeMatch) {
    videoId = youtuBeMatch[1];
  }
  
  // Handle youtube.com/watch?v=VIDEO_ID
  const watchMatch = url.match(/[?&]v=([^&\s]+)/);
  if (watchMatch) {
    videoId = watchMatch[1];
  }
  
  // If we found a video ID, convert to embed format
  if (videoId) {
    // Remove any additional parameters from video ID
    videoId = videoId.split('&')[0].split('?')[0];
    return `https://www.youtube.com/embed/${videoId}`;
  }
  
  // If we can't parse it, return the original URL
  return url;
}
