import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";

export default function Header() {
  const { userData } = useContext(AppContext);

  return (
    <header className="flex flex-col items-center justify-center h-screen px-4 bg-transparent text-black">
      {userData ? (
        <div className="text-center text-4xl">
          <div>
            <span className="font-bold">Hi</span>, {userData.name}!
          </div>
          <div>
            {" "}
            Your account is{" "}
            <span
              className={`font-bold ${userData.isAccountVerified ? "text-green-600" : "text-red-600"}`}
            >
              {" "}
              {userData.isAccountVerified ? "verified" : "not verified"}
            </span>
          </div>
        </div>
      ) : (
        <h2 className="text-center text-4xl">
          Create an account to display a message
        </h2>
      )}
    </header>
  );
}
