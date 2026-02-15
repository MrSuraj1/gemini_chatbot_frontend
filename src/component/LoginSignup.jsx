import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthForm = ({ mode: initialMode = "signup", onLogin }) => {
  const [mode, setMode] = useState(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = `http://localhost:5000/api/auth/${mode}`;
      const res = await axios.post(url, { email, password });

      if (res.data?.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        onLogin(res.data.user);
        navigate("/"); // redirect to chat
      } else {
        setError("Invalid backend response");
      }
    } catch (err) {
      console.error(err.response || err);
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-[#131314] px-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-[#1e1f20] rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100">
          {mode === "signup" ? "Sign Up" : "Login"}
        </h2>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#131314] dark:border-gray-700 dark:text-gray-100"
            />
          </div>

          <div>
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 dark:bg-[#131314] dark:border-gray-700 dark:text-gray-100"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium shadow-md transition-transform active:scale-95"
          >
            {loading ? "⏳" : mode === "signup" ? "Sign Up" : "Login"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 dark:text-gray-400">
          {mode === "signup" ? "Already have an account?" : "New here?"}{" "}
          <button
            className="text-blue-600 dark:text-blue-400 font-medium hover:underline"
            onClick={() => setMode(mode === "signup" ? "login" : "signup")}
          >
            {mode === "signup" ? "Login" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;
