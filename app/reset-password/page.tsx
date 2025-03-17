// pages/reset-password.tsx

"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  // Get the token from the URL query parameters
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = urlParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate the password
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }), // Send token and new password
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Something went wrong.");
      } else {
        setSuccessMessage("Password reset successfully!");
        setTimeout(() => {
          router.push("/"); // Redirect to login page after successful reset
        }, 2000);
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px- py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-zinc-800">
          Reset Your Password
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-2">
          <div>
            <input
              type="password"
              name="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="block w-full rounded-md border-2 border-zinc-300 bg-zinc-200 px-3 py-2.5 text-base text-zinc-800 placeholder:text-zinc-400"
            />
          </div>

          <div>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="block w-full rounded-md border-2 border-zinc-300 bg-zinc-200 px-3 py-2.5 text-base text-zinc-800 placeholder:text-zinc-400"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}

          <div className="w-full flex justify-center">
            <button type="submit" className="mt-6 w-1/2 rounded-md bg-violet-600 px-3 py-1.5 text-sm font-bold text-white">
              Reset Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
