import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home.jsx";
import Login from "./pages/login.jsx";
import EmailVerify from "./pages/emailverify.jsx";
import ResetPassword from "./pages/resetpassword.jsx";
import { useContext } from "react";
import { AppContext } from "./context/AppContext";

const App = () => {
  const { loadingUser } = useContext(AppContext);

  if (loadingUser) {
    return null;
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Login />} />
      <Route path="/email-verify" element={<EmailVerify />} />
      <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  );
};

export default App;
