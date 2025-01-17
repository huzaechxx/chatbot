import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage.jsx"; // Create this component
import SignupPage from "./components/SignupPage.jsx";
import ChatApp from "./components/ChatApp.jsx"; // Create this component

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token"); // Checks if the token exists in localStorage
  console.log(token);

  return token ? children : <Navigate to="/Login" replace />;
};

const App = () => {
  return (
    <Routes>
      <Route path="/Login" element={<LoginPage />} />
      <Route path="/Signup" element={<SignupPage />} />
      <Route
        path="/bot"
        element={
          <ProtectedRoute>
            <ChatApp />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<LoginPage />} /> {/* Catch-all route */}
      <Route path="/" element={<LoginPage />} />
    </Routes>
  );
};

export default App;
