export const TOKEN_KEY = "taskflow_token";
export const USER_KEY = "taskflow_user";

export function saveAuth(authResponse) {
  localStorage.setItem(TOKEN_KEY, authResponse.token);

  localStorage.setItem(
    USER_KEY,
    JSON.stringify({
      username: authResponse.username,
      email: authResponse.email,
      role: authResponse.role,
    })
  );
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUser() {
  const raw = localStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function isLoggedIn() {
  return !!getToken();
}