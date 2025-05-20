import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

export default function Navbar() {
  const navigate = useNavigate();

  const { userData, setUserData, setIsLoggedIn, backendUrl } =
    useContext(AppContext);

  const sendVerificationOtp = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-verify-otp`,
        {},
        { withCredentials: true },
      );
      if (data.success) {
        navigate("/email-verify");
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        `${backendUrl}/api/auth/logout`,
        {},
        { withCredentials: true },
      );

      if (data.success) {
        setIsLoggedIn(false);
        setUserData(null);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <nav className="w-full flex justify-between p-4 sm:p-6 sm:px-24 absolute top-0 bg-transparent">
      <div></div>
      {userData ? (
        <div className="flex items-center gap-4">
          {!userData.isAccountVerified && (
            <button
              onClick={sendVerificationOtp}
              className="border border-gray-500 rounded-md px-4 py-2 text-gray-800 hover:bg-gray-100 transition-all"
            >
              Verify Email
            </button>
          )}
          <button
            onClick={logout}
            className="border border-gray-500 rounded-md px-4 py-2 text-gray-800 hover:bg-gray-100 transition-all"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/login?mode=login")}
            className="border border-gray-500 rounded-md px-4 py-2 text-gray-800 bg-white hover:bg-gray-50 transition-all"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup?mode=signup")}
            className="border border-gray-500 rounded-md px-4 py-2 bg-black text-white hover:bg-slate-800 transition-all"
          >
            Signup
          </button>
        </div>
      )}
    </nav>
  );
}
