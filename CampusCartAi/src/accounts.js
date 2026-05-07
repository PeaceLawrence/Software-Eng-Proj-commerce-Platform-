const API = 'http://localhost:5001/api/auth';
const TOKEN_KEY = 'campuscart_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export const registerAccount = async ({ firstName, lastName, email, onecardId, password }) => {
  const res = await fetch(`${API}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ firstName, lastName, email, onecardId, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Registration failed');
  localStorage.setItem(TOKEN_KEY, data.token);
  return data.user;
};

export const loginAccount = async (email, password) => {
  const res = await fetch(`${API}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  localStorage.setItem(TOKEN_KEY, data.token);
  return data.user;
};

export const updateAccount = async (_currentEmail, updates) => {
  const res = await fetch(`${API}/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
    body: JSON.stringify(updates),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Update failed');
  return data.user;
};
