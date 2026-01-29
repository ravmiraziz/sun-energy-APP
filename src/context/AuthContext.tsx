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

interface AuthContextType {
  user: User | null;
  access_token: string | null;
  refresh_token: string | null;
  login: (data: {
    user: User;
    access_token: string;
    refresh_token: string;
  }) => void;
  logout: () => void;
  getUser: (id: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [access_token, setAccessToken] = useState<string | null>(
    localStorage.getItem("access_token"),
  );
  const [refresh_token, setRefreshToken] = useState<string | null>(
    localStorage.getItem("refresh_token"),
  );

  const getUser = async (id: string) => {
    try {
      const { data } = await getOne<User>("admin", id);
      setUser(data);
    } catch (error) {
      return;
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    if (userId && access_token) {
      getUser(userId);
    }
  }, [access_token]);

  const login = (data: {
    user: User;
    access_token: string;
    refresh_token: string;
  }) => {
    setUser(data.user);
    setAccessToken(data.access_token);
    setRefreshToken(data.refresh_token);

    localStorage.setItem("user_id", String(data.user.id));
    localStorage.setItem("access_token", data.access_token);
    localStorage.setItem("refresh_token", data.refresh_token);
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);

    localStorage.clear();
    window.location.replace("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        access_token,
        refresh_token,
        login,
        logout,
        getUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};
