import React, { useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

export default function ResetPassword() {
  const { backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);

  const [values, setValues] = useState(Array(6).fill(""));
  const inputsRef = useRef([]);
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

  const [newPassword, setNewPassword] = useState("");

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/send-reset-otp`,
        { email },
        { withCredentials: true },
      );
      if (data.success) {
        toast.success(data.message);
        setIsEmailSent(true);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    const otp = values.join("");
    if (otp.length < 6) {
      toast.error("Please enter all 6 digits");
      return;
    }
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/verify-reset-otp`,
        { email, otp },
        { withCredentials: true },
      );
      if (data.success) {
        toast.success(data.message);
        setIsOtpSubmitted(true);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/reset-password`,
        { email, otp: values.join(""), password: newPassword },
        { withCredentials: true },
      );
      if (data.success) {
        toast.success("Password reset successful");
        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const handleChange = (i, e) => {
    const input = e.target.value.replace(/[^0-9]/g, "");
    const next = [...values];
    if (!input) {
      next[i] = "";
      setValues(next);
      return;
    }
    next[i] = input[0];
    setValues(next);
    if (i < 5) inputsRef.current[i + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(paste)) return;
    const next = paste.split("");
    setValues(next);
    inputsRef.current[5]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const next = [...values];
      if (next[i]) {
        // clear current
        next[i] = "";
        setValues(next);
      } else if (i > 0) {
        // clears previous
        inputsRef.current[i - 1]?.focus();
        next[i - 1] = "";
        setValues(next);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-slate-200 ">
      {/*Email Form */}
      {!isEmailSent && (
        <form
          onSubmit={handleEmailSubmit}
          className="bg-white p-10 rounded-lg shadow-lg w-full max-w-sm flex flex-col items-center gap-6"
        >
          <h1 className="text-4xl font-semibold text-center mb-4 text-black">
            Reset Password
          </h1>
          <p className="text-center mb-6 text-black">Enter registered email</p>
          <div className="w-full px-4 py-2 rounded-full text-black placeholder-gray-400 focus:outline-none border border-gray-300">
            <input
              type="email"
              placeholder="Email ID"
              className="bg-transparent outline-none text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 rounded-full bg-black text-white font-medium"
          >
            Submit
          </button>
        </form>
      )}

      {/*OTP Form */}
      {isEmailSent && !isOtpSubmitted && (
        <form
          onSubmit={handleOtpSubmit}
          onPaste={handlePaste}
          className="bg-white p-10 rounded-lg shadow-lg w-full max-w-sm flex flex-col items-center gap-6"
        >
          <h1 className="text-4xl font-semibold text-center mb-4 text-black">
            Reset Password OTP
          </h1>
          <p className="text-center mb-6 text-black">
            Enter the 6-digit code sent to your email address.
          </p>
          <div className="flex justify-between mb-8">
            {values.map((v, i) => (
              <input
                key={i}
                ref={(el) => (inputsRef.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={v}
                onChange={(e) => handleChange(i, e)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-12 h-12 text-center text-2xl font-semibold rounded-lg shadow-lg bg-[#ffffff] text-black border border-spacing-1 placeholder-gray-400 focus:outline-none"
              />
            ))}
          </div>
          <button
            type="submit"
            className="w-full py-2 rounded-full bg-black text-white font-medium"
          >
            Verify
          </button>
        </form>
      )}

      {/*New Password Form */}
      {isEmailSent && isOtpSubmitted && (
        <form
          onSubmit={handlePasswordSubmit}
          className="bg-white p-10 rounded-lg shadow-lg w-full max-w-sm flex flex-col items-center gap-6"
        >
          <h1 className="text-4xl font-semibold text-center mb-4 text-black">
            Set New Password
          </h1>
          <p className="text-center mb-6 text-black">
            Enter your new password below
          </p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full ">
            <input
              type="password"
              placeholder="New Password"
              className="w-full px-4 py-2 rounded-full text-black placeholder-gray-400 focus:outline-none border border-gray-300"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 rounded-full bg-black text-white font-medium"
          >
            Submit
          </button>
        </form>
      )}
    </div>
  );
}
