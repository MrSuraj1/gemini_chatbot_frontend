import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ChatWindow from "./component/chatwindow";
import AuthForm from "./component/LoginSignup";
import './App.css';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (token && storedUser) {
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  if (loading) return <div className="h-screen bg-[#131314]" />; // Loading Screen

  return (
    <Routes>
      <Route 
        path="/" 
        element={user ? <ChatWindow /> : <Navigate to="/login" replace />} 
      />
      <Route 
        path="/login" 
        element={!user ? <AuthForm mode="login" onLoginSuccess={(token, u) => setUser(u)} /> : <Navigate to="/" replace />} 
      />
      <Route 
        path="/signup" 
        element={!user ? <AuthForm mode="signup" onLoginSuccess={(token, u) => setUser(u)} /> : <Navigate to="/" replace />} 
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;