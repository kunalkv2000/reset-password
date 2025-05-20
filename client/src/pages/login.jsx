import React, { useContext, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { backendUrl, setIsLoggedIn, setUserData, getUserData } =
    useContext(AppContext);

  const initialMode =
    searchParams.get("mode") === "signup" ? "Sign Up" : "Login";
  const [mode, setMode] = useState(initialMode);

  useEffect(() => {
    setMode(searchParams.get("mode") === "signup" ? "Sign Up" : "Login");
  }, [searchParams]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (mode === "Sign Up") {
        const { data } = await axios.post(
          `${backendUrl}/api/auth/register`,
          { name, email, password },
          { withCredentials: true },
        );
        if (data.success) {
          await getUserData();
          navigate("/");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(
          `${backendUrl}/api/auth/login`,
          { email, password },
          { withCredentials: true },
        );
        if (data.success) {
          setUserData(data.user);
          setIsLoggedIn(true);
          navigate("/");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-6 sm:px-0 bg-slate-200 ">
      <div className="bg-white p-10 rounded-lg shadow-lg w-full max-w-sm flex flex-col items-center gap-6">
        <h2 className="text-3xl font-semibold text-black text-center">
          {mode === "Sign Up" ? "Create Account" : "Login"}
        </h2>
        <p className="text-center text-sm text-black">
          {mode === "Sign Up" ? "Create your account" : "Login to your account"}
        </p>
        <form onSubmit={onSubmitHandler} className="w-full flex flex-col gap-4">
          {mode === "Sign Up" && (
            <input
              type="text"
              placeholder="Full Name"
              className="w-full px-4 py-2 rounded-full text-black placeholder-gray-400 focus:outline-none border border-gray-300"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 rounded-full text-black placeholder-gray-400 focus:outline-none border border-gray-300"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 rounded-full text-black placeholder-gray-400 focus:outline-none border border-gray-300"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {mode === "Login" && (
            <button
              type="button"
              className="text-sm text-blue-800 hover:underline text-left"
              onClick={() => navigate("/reset-password")}
            >
              Forgot Password?
            </button>
          )}

          <button
            type="submit"
            className="w-full py-2 rounded-full bg-black text-white font-medium transition"
          >
            {mode === "Sign Up" ? "Sign Up" : "Login"}
          </button>
        </form>
        <div className="text-black">
          {mode === "Sign Up" ? (
            <p>
              Already have an account?{" "}
              <button
                className="text-blue-800 hover:underline"
                onClick={() => navigate("/login?mode=login")}
              >
                Login here
              </button>
            </p>
          ) : (
            <p className="text-black">
              Don't have an account?{" "}
              <button
                className="text-blue-800 hover:underline"
                onClick={() => navigate("/login?mode=signup")}
              >
                Sign up here
              </button>
            </p>
          )}
        </div>
      </div>

      <button
        onClick={() => navigate("/")}
        className="  rounded-lg shadow-lg bg-black  fixed bottom-4 right-4 px-4 py-2 text-sm text-white"
      >
        {" "}
        Back to Home{" "}
      </button>
    </div>
  );
}
