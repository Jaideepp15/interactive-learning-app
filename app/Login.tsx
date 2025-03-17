"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Something went wrong");
        return;
      }

      const { token, role } = await response.json();
      localStorage.setItem("token", token);

      if (role === "student" || role === "parent") {
        router.push("/learning");
      } else if (role === "teacher") {
        router.push("/teacher");
      } else {
        setError("Invalid role detected");
      }
    } catch (err) {
      setError("Something went wrong, please try again.");
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px- py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col items-center">
        <h2 className="mt-10 text-center text-3xl/9 font-bold tracking-tight text-zinc-700">
          Log in
        </h2>
        <p className="text-md text-zinc-400 mt-2">Enter your details to continue your journey</p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-2">
          <div>
            <label htmlFor="username" className="text-xs text-zinc-600 font-semibold">Username</label>
            <input
              placeholder="Enter your username"
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="block w-full rounded-md border-2 border-zinc-300 px-3 py-2.5 text-base text-zinc-800 placeholder:text-zinc-400 placeholder:text-sm"
            />
          </div>

          <div>
            <label htmlFor="password" className="text-xs text-zinc-600 font-semibold">Password</label>
            <input
              placeholder="Enter your password"
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="block w-full rounded-md border-2 border-zinc-300 px-3 py-2.5 text-base text-zinc-800 placeholder:text-zinc-400 placeholder:text-sm"
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="w-full flex justify-center">
            <button type="submit" className="mt-6 w-1/2 rounded-md bg-violet-600 px-3 py-1.5 text-sm font-bold text-white">
              Sign in
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-zinc-400">
          Not a member?{" "}
          <button onClick={() => router.push("/signup")} className="font-semibold text-violet-600 hover:text-violet-500">
            Create your account today!
          </button>
        </p>

        <p className="mt-2 text-center text-xs font-semibold text-violet-600">
          <button onClick={() => router.push("./forgot-password")}>Forgot Password?</button>
        </p>
      </div>
    </div>
  );
}

export default Login;
