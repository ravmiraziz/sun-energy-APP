import React, { createContext, useContext, useEffect, useState } from "react";
import { getOne } from "../api/api";

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
  image_url: string;
  language: string;
  created_at: string;
}

interface AuthData {
  user: User | null;
  refresh_token: string;
  access_token: string;
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
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("access_token") || null,
  );

  /* 🔁 Refresh’da tiklash */
  const getUser = async (id: any) => {
    const storedToken = localStorage.getItem("access_token");
    try {
      const { data } = await getOne<User>("admin", String(id));
      setUser(data);
      setToken(storedToken);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("user_id");

    if (userId) {
      getUser(userId);
    }
  }, []);

  const login = (data: AuthData) => {
    setUser(data.user);
    setToken(data.access_token);
    localStorage.setItem("user_id", String(data?.user?.id));
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_id");
    window.location.replace("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, getUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
