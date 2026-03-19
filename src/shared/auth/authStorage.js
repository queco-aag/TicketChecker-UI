const TOKEN_KEY = 'ticketchecker.admin.token';
const USER_KEY = 'ticketchecker.admin.user';

export const saveSession = (token, user = null) => {
  localStorage.setItem(TOKEN_KEY, token);
  if (user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const getUser = () => {
  const stored = localStorage.getItem(USER_KEY);
  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
};

export const removeSession = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

