"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

function ForgotPassword() {
  const [email, setEmail] = useState("");  // Change username to email
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),  // Send email instead of username
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Something went wrong");
        return;
      }

      setSuccessMessage("A password reset link has been sent to your email.");
    } catch (err) {
      setError("Something went wrong, please try again.");
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px- py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-zinc-800">
          Forgot Password
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-2">
          <div>
            <input
              placeholder="Email"
              id="email"  // Change id to email
              name="email"  // Change name to email
              type="email"  // Ensure it's an email input
              value={email}  // Bind to the email state
              onChange={(e) => setEmail(e.target.value)}  // Handle input change for email
              required
              className="block w-full rounded-md border-2 border-zinc-300 bg-zinc-200 px-3 py-2.5 text-base text-zinc-800 placeholder:text-zinc-400"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
          {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}

          <div className="w-full flex justify-center">
            <button type="submit" className="mt-6 w-1/2 rounded-md bg-violet-600 px-3 py-1.5 text-sm font-bold text-white">
              Send Reset Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
