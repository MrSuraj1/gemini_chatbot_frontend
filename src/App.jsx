import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ChatWindow from "./component/chatwindow";
import AuthForm from "./component/LoginSignup"; 
import './App.css';

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Ye effect nazar rakhega ki token kab change ho raha hai
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(localStorage.getItem("token"));
    };

    // Listen for storage changes
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Login hone par ye function call karna
  const handleLoginSuccess = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  return (
    <Routes>
      {/* Agar token hai to ChatWindow, varna Login par bhej do */}
      <Route 
        path="/" 
        element={token ? <ChatWindow /> : <Navigate to="/login" replace />} 
      />

      {/* Agar login page par hai aur token mil gaya, to turant "/" par bhej do */}
      <Route 
        path="/login" 
        element={!token ? <AuthForm onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/" replace />} 
      />

      {/* Backup redirect */}
      <Route path="*" element={<Navigate to={token ? "/" : "/login"} replace />} />
    </Routes>
  );
}

export default App;