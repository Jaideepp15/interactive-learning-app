"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PhoneInputComponent from "../components/PhoneInput"; // Adjust the import path as needed

function ProfilePage() {
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
    role: "", // Add role field
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    async function fetchUserDetails() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("You need to log in to view and update your profile.");
          return;
        }

        const response = await fetch("/api/fetch-details", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (response.ok) {
          setUserDetails(data);
        } else {
          setError(data.message || "Unable to fetch user details.");
        }
      } catch (err) {
        setError("Error fetching user details.");
      }
    }

    fetchUserDetails();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setError("You need to log in to update your profile.");
      return;
    }

    try {
      const response = await fetch("/api/update-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userDetails),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage("Profile updated successfully!");
      } else {
        setError(data.message || "Something went wrong.");
      }
    } catch (err) {
      setError("Error updating profile.");
    }
  };

  const handleCancel = () => {
    if (userDetails.role === "student") {
      router.push("../learning");
    } else if (userDetails.role === "teacher") {
      router.push("../teacher");
    } else {
      router.push("../parent");
    }
  };

  return (
    <div className="min-h-screen p-8 mx-auto max-w-4xl bg-zinc-100 rounded-2xl shadow-lg">
      <h1 className="text-3xl font-semibold text-center text-zinc-800 mb-8">Edit Profile</h1>

      <div className="flex justify-center mb-8">
        <img
          src="/profile.png"
          alt="Profile Picture"
          className="w-32 h-32 rounded-full border-4 border-violet-500 object-cover"
        />
      </div>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {successMessage && <p className="text-green-500 text-center mb-4">{successMessage}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-lg font-medium text-zinc-800">
            Name
          </label>
          <input
            id="name"
            type="text"
            value={userDetails.name}
            onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
            required
            className="w-full px-4 py-3 mt-2 bg-white text-zinc-800 border border-zinc-100 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-lg font-medium text-zinc-800">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={userDetails.email}
            onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
            required
            className="w-full px-4 py-3 mt-2 bg-white text-zinc-800 border border-zinc-100 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        </div>

        {/* Phone Input Component */}
        <div>
          <label htmlFor="phone" className="block text-lg font-medium text-zinc-800">
            Phone
          </label>
          <div className="bg-zinc-100 p-3 rounded-md border border-zinc-100">
            <PhoneInputComponent
              value={userDetails.phone}
              onChange={(phone) => setUserDetails({ ...userDetails, phone })}
              showLabel={false}
            />
          </div>
        </div>

        <div className="flex justify-between gap-4 mt-6">
          <button
            type="submit"
            className="w-full px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="w-full px-6 py-3 bg-zinc-300 text-zinc-800 rounded-md hover:bg-zinc-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default ProfilePage;
