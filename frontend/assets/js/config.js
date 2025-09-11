/**
 * Configuration des URL pour éviter les hardcoding
 */
window.CONFIG = {
  API_URL: 'http://localhost:3000/api',
  
  // Configuration de production - décommenter pour la prod
  // API_URL: 'https://api.benichou-tcg.com/api',
  
  // Endpoints
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      FORGOT_PASSWORD: '/auth/forgot-password',
      RESET_PASSWORD: '/auth/reset-password',
      VERIFY_EMAIL: '/auth/verify-email',
      PROFILE: '/auth/profile'
    },
    PRODUCTS: '/products',
    CATEGORIES: '/categories',
    ORDERS: '/orders'
  }
};
