import API from "../services/api";
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

const TOKEN_KEY = "internhub_token";
const USER_KEY = "internhub_user";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const checkAuth = async () => {
    const storedToken = localStorage.getItem(TOKEN_KEY);

    if (!storedToken) {
      setLoading(false);
      return;
    }

    try {
      const response = await API.get("/auth/me");

      const loggedInUser = response.data.user;

      setUser(loggedInUser);
      setToken(storedToken);

      localStorage.setItem(USER_KEY, JSON.stringify(loggedInUser));
    } catch (error) {
      console.log("Session expired or invalid.");

      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);

      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  checkAuth();
}, []);

  const login = (newToken, newUser) => {
    localStorage.setItem(TOKEN_KEY, newToken);
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  const value = { user, token, login, logout, loading };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
