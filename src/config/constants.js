export const ASPADIF_COLORS = {
  primary: '#2196F3',
  primaryDark: '#1976D2',
  secondary: '#64B5F6',
  accent: '#FFFFFF',
  text: '#333333',
  success: '#4CAF50',
  warning: '#FF9800',
  error: '#F44336',
};

export const APP_CONFIG = {
  title: import.meta.env.VITE_APP_TITLE || 'TicketChecker - ASPADIF',
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:8090/api/v1',
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedImageTypes: ['image/jpeg', 'image/png', 'image/jpg'],
};
