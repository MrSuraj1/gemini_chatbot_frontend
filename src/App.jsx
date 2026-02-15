import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AuthForm from "./component/LoginSignup";
import ChatWindow from "./component/chatwindow";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = JSON.parse(localStorage.getItem("user"));
    if (token && userData) setUser(userData);
  }, []);

  return (
    <Routes>
      <Route
        path="/"
        element={user ? <ChatWindow /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/login"
        element={
          <AuthForm
            mode="login"
            onLogin={(u) => {
              setUser(u);
              localStorage.setItem("user", JSON.stringify(u));
            }}
          />
        }
      />
      <Route
        path="/signup"
        element={
          <AuthForm
            mode="signup"
            onLogin={(u) => {
              setUser(u);
              localStorage.setItem("user", JSON.stringify(u));
            }}
          />
        }
      />
    </Routes>
  );
}

export default App;
