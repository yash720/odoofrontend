// API Configuration
// Environment-based API URL configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.DEV ? 'https://odoobackend-fdgh.onrender.com' : 'http://localhost:5000/api');

export const API_ENDPOINTS = {
  // Auth endpoints
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  ME: `${API_BASE_URL}/auth/me`,
  PROFILE: `${API_BASE_URL}/auth/profile`,
  
  // Items endpoints
  ITEMS: `${API_BASE_URL}/items`,
  PENDING_ITEMS: `${API_BASE_URL}/items/pending`,
  APPROVE_ITEM: (id: string) => `${API_BASE_URL}/items/${id}/approve`,
  REJECT_ITEM: (id: string) => `${API_BASE_URL}/items/${id}/reject`,
  DELETE_ITEM: (id: string) => `${API_BASE_URL}/items/${id}`,
  
  // Swaps endpoints
  SWAPS: `${API_BASE_URL}/swaps`,
  REQUEST_SWAP: `${API_BASE_URL}/swaps/request`,
  ACCEPT_SWAP: (id: string) => `${API_BASE_URL}/swaps/${id}/accept`,
  REJECT_SWAP: (id: string) => `${API_BASE_URL}/swaps/${id}/reject`,
  
  // User endpoints
  USERS: `${API_BASE_URL}/users`,
  USER_PROFILE: (id: string) => `${API_BASE_URL}/users/${id}`,
  
  // Favorites endpoints
  FAVORITES: `${API_BASE_URL}/favorites`,
  ADD_FAVORITE: (itemId: string) => `${API_BASE_URL}/favorites/${itemId}`,
  REMOVE_FAVORITE: (itemId: string) => `${API_BASE_URL}/favorites/${itemId}`,
};

export default API_BASE_URL; 
