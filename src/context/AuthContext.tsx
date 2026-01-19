import React, { createContext, useContext, useEffect, useState } from "react";

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  image_url: string;
  language: string;
  refresh_token: string;
  created_at: string;
  deleted_at: string;
}

interface AuthData {
  user: User | null;
  token: string | null;
}

interface AuthContextType extends AuthData {
  login: (data: AuthData) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  /* 🔁 Refresh’da tiklash */
  useEffect(() => {
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("access_token");
    if (user) {
      const parsed: AuthData = JSON.parse(user);
      setUser(parsed);
      setToken(token);
    }
  }, []);

  const login = (data: AuthData) => {
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("access_token", JSON.stringify(data.token));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    window.location.reload();
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
