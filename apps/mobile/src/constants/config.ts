// You should replace these values with your actual API configuration
export const API_BASE_URL = 'http://localhost:3000/api';
export const IMAGE_BASE_URL = `${API_BASE_URL}/images`;

export const CONFIG = {
  API: {
    TIMEOUT: 10000, // 10 seconds
    RETRY_ATTEMPTS: 3,
  },
  IMAGE: {
    CACHE_TIME: 300000, // 5 minutes
    DEFAULT_QUALITY: 'high',
  },
};
