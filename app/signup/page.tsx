"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "../components/InputField"; // Import InputField component
import PhoneInput from "../components/PhoneInput";

interface PageProps {
  setStep: (step: number) => void;
  setPhone: (phone: string) => void;
}

function Register({ setStep, setPhone }: { setStep: (step: number) => void; setPhone: (phone: string) => void }) {
  const [formData, setFormData] = useState({ name: "", email: "", role: "", username: "", password: "", phone: "" });
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false); // Track the submission state
  const [successMessage, setSuccessMessage] = useState(""); // For the success message
  const router = useRouter(); // Initialize the router

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setFormData({ ...formData, role: e.target.value });

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true); // Disable the button during submission

      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          phone: phoneNumber,
        }),
      });

      const data = await response.json();
      if (data.message === "User registered successfully") {
        setSuccessMessage("Successfully signed up!"); // Set the success message
        setTimeout(() => {
          router.push("/"); // Redirect to login after a short delay
        }, 2000); // 2 seconds delay before redirection (can adjust timing)
      } else {
        console.error("Error: ", data.message);
      }
    } catch (error) {
      console.error("Error: ", error);
      alert("An error occurred during registration. Please try again.");
    } finally {
      setIsSubmitting(false); // Re-enable the button after submission
    }
  };

  return (
    <div className="flex">
    <div className="h-screen w-1/2 bg-purple-100 flex">

    </div>
    <div className="flex items-center justify-center w-1/2">
    <div className="mx-auto flex min-h-full max-w-md flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-zinc-700">Sign up</h2>
        <p className="mt-2 text-lg text-gray-500">Let's get started</p>
      </div>

      <div className="mt-10">
        <form className="space-y-8">
          <div className="flex flex-col justify-center items-center">
            <p className="text-gray-400 text-sm mb-4">Enter your details to begin your journey</p>
            
            <InputField label="Name" id="name" placeholder="Enter your name" required value={formData.name} onChange={handleChange} />
            <InputField label="Email" id="email" placeholder="Enter your email" required value={formData.email} onChange={handleChange} />
            
            <div className="flex flex-col w-full">
              <label htmlFor="role" className="text-sm font-medium text-gray-700">Role</label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleRoleChange}
                required
                className="border rounded px-4 py-2 w-full"
              >
                <option value="" disabled className="text-gray-400">Select a role</option>
                <option value="student" className="text-gray-400">Student</option>
                <option value="teacher" className="text-gray-400">Teacher</option>
                <option value="parent" className="text-gray-400">Parent</option>
              </select>
            </div>

            <InputField label="Username" id="username" placeholder="Choose a username" required value={formData.username} onChange={handleChange} />
            <InputField label="Password" id="password" placeholder="Choose a password" type="password" required value={formData.password} onChange={handleChange} />
            
            <PhoneInput value={phoneNumber} onChange={setPhoneNumber} />

            <p className="mt-10 text-gray-400 whitespace-nowrap text-xs">
              By Signing Up, you agree to <a href="/privacy">terms of use</a> and <a href="">privacy <br />statements</a>.
            </p>

            <button
              type="button" 
              onClick={handleSubmit}
              disabled={isSubmitting} // Disable the button if submitting
              className="mt-6 w-1/2 rounded-md bg-violet-600 px-3 py-1.5 text-sm font-bold text-white"
            >
              {isSubmitting ? 'Submitting...' : 'Sign Up'}
            </button>

            <p className="mt-8 text-gray-400 whitespace-nowrap text-sm">
              Already have an account?{" "}
              <button onClick={() => router.push("/")} className="text-cyan-500 hover:underline">
                Log In
              </button>
            </p>
          </div>
        </form>

        {successMessage && (
          <div className="mt-4 p-4 bg-green-200 text-green-800 text-center rounded-md">
            {successMessage}
          </div>
        )}
      </div>
    </div>

    </div>

  </div>


    
  );

  
}

export default Register;
