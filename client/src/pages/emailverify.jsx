import React, { useState, useRef, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

export default function OtpVerify() {
  const { backendUrl, getUserData, userData, loadingUser } =
    useContext(AppContext);
  const navigate = useNavigate();

  const [values, setValues] = useState(Array(6).fill(""));
  const inputsRef = useRef([]);

  useEffect(() => {
    if (!loadingUser && userData?.isAccountVerified) {
      navigate("/");
    }
  }, [loadingUser, userData, navigate]);

  const handleChange = (i, e) => {
    const val = e.target.value.replace(/[^0-9]/g, "");
    if (!val) return;
    const next = [...values];
    next[i] = val[0];
    setValues(next);
    if (i < 5) inputsRef.current[i + 1].focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(paste)) return;
    const next = paste.split("");
    setValues(next);
    inputsRef.current[5].focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const next = [...values];
      if (next[i]) {
        next[i] = "";
        setValues(next);
      } else if (i > 0) {
        inputsRef.current[i - 1]?.focus();
        next[i - 1] = "";
        setValues(next);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otp = values.join("");
    if (otp.length < 6) {
      return toast.error("Please enter all 6 digits");
    }

    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/verify-account`,
        { otp },
        { withCredentials: true },
      );
      if (data.success) {
        toast.success(data.message);
        await getUserData();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  if (loadingUser || userData?.isAccountVerified) {
    return null;
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-slate-200 ">
      <form
        onSubmit={handleSubmit}
        onPaste={handlePaste}
        className="bg-white p-10 rounded-lg shadow-lg w-full max-w-sm flex flex-col items-center gap-6"
      >
        <h1 className="text-4xl font-semibold text-center mb-4 text-black">
          Email Verify OTP
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
              className="w-12 h-12 text-center text-2xl font-semibold rounded-lg shadow-lg bg-[#ffffff] text-black border border-spacing-1 placeholder-gray-400 focus:outline-none"
              onKeyDown={(e) => handleKeyDown(i, e)}
            />
          ))}
        </div>
        <button
          type="submit"
          className="w-full py-2 rounded-full bg-black text-white font-medium transition"
        >
          Verify
        </button>
      </form>
    </div>
  );
}
