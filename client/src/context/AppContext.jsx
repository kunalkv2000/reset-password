import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext({
  backendUrl: "",
  isLoggedin: false,
  setIsLoggedIn: () => {},
  userData: null,
  setUserData: () => {},
  getUserData: () => Promise.resolve(),
  loadingUser: true,
});

export function AppContextProvider({ children }) {
  useEffect(() => {
    axios.defaults.withCredentials = true;
  }, []);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedin, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const getUserData = async () => {
    setLoadingUser(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/auth/user`, {
        withCredentials: true,
      });
      if (data.success) {
        setUserData(data.user);
        setIsLoggedIn(true);
      } else {
        setUserData(null);
        setIsLoggedIn(false);
      }
    } catch (err) {
      if (err.response?.status === 401) {
        console.warn("Not logged in (401)");
        setUserData(null);
        setIsLoggedIn(false);
      } else {
        console.error("Error fetching user data:", err);
        toast.error(err.response?.data?.message || err.message);
        setUserData(null);
        setIsLoggedIn(false);
      }
    } finally {
      setLoadingUser(false);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  const value = {
    backendUrl,
    isLoggedin,
    setIsLoggedIn,
    userData,
    setUserData,
    getUserData,
    loadingUser,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
