import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    token: localStorage.getItem("token") || null,
    username: localStorage.getItem("username") || null,
  });

  const login = (token, username) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    setAuth({ token, username });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setAuth({ token: null, username: null });
  };

  return <AuthContext.Provider value={{ auth, login, logout }}>{children}</AuthContext.Provider>;
};
