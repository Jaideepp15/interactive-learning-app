"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "../components/InputField";
import PhoneInput from "../components/PhoneInput";

interface RegisterProps {
  setStep: (step: number) => void;
  setPhone: (phone: string) => void;
}

function Register({ setStep, setPhone }: RegisterProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "",
    username: "",
    password: "",
    phone: "",
    subject: "",
    children: [""],
  });
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setFormData({ ...formData, role: e.target.value, subject: "", children: [""] });

  const handleChildChange = (index: number, value: string) => {
    const updatedChildren = [...formData.children];
    updatedChildren[index] = value;
    setFormData({ ...formData, children: updatedChildren });
  };

  const addChild = () => {
    setFormData({ ...formData, children: [...formData.children, ""] });
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Ensure all child usernames are filled before submission
      const validChildren = formData.children.filter((child) => child.trim() !== "");

      const response = await fetch("/api/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          role: formData.role,
          username: formData.username,
          password: formData.password,
          phone: phoneNumber,
          subject: formData.role === "teacher" ? formData.subject : undefined,
          children: formData.role === "parent" ? validChildren : undefined, // Only pass non-empty child usernames
        }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccessMessage("Successfully signed up!");
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        alert(data.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred during registration. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex">
      <div className="h-screen w-1/2 bg-purple-100 flex"></div>
      <div className="flex items-center justify-center w-1/2">
        <div className="mx-auto flex min-h-full max-w-md flex-col justify-center px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-zinc-700">Sign up</h2>
            <p className="mt-2 text-lg text-gray-500">Let's get started</p>
          </div>

          <form className="mt-10 space-y-8">
            <InputField label="Name" id="name" placeholder="Enter your name" required value={formData.name} onChange={handleChange} />
            <InputField label="Email" id="email" placeholder="Enter your email" required value={formData.email} onChange={handleChange} />

            <div className="flex flex-col w-full">
              <label htmlFor="role" className="text-sm font-medium text-gray-700">Role</label>
              <select id="role" value={formData.role} onChange={handleRoleChange} required className="border rounded px-4 py-2 w-full">
                <option value="" disabled>Select a role</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="parent">Parent</option>
              </select>
            </div>

            {formData.role === "teacher" && (
              <div className="flex flex-col w-full">
                <label htmlFor="subject" className="text-sm font-medium text-gray-700">Subject</label>
                <select
                  id="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="border rounded px-4 py-2 w-full"
                >
                  <option value="" disabled>Select a subject</option>
                  <option value="Math">Math</option>
                  <option value="Science">Science</option>
                  <option value="History">History</option>
                </select>
              </div>
            )}

            {formData.role === "parent" && (
              <div className="flex flex-col w-full">
                {formData.children.map((child, index) => (
                  <InputField label='Child Username' key={index} id={`child-${index}`} placeholder="Enter child's username" required value={child} onChange={(e) => handleChildChange(index, e.target.value)} />
                ))}
                <button type="button" onClick={addChild} className="mt-2 text-sm text-blue-500 hover:underline">+ Add another child</button>
              </div>
            )}

            <InputField label="Username" id="username" placeholder="Choose a username" required value={formData.username} onChange={handleChange} />
            <InputField label="Password" id="password" placeholder="Choose a password" type="password" required value={formData.password} onChange={handleChange} />
            <PhoneInput value={phoneNumber} onChange={setPhoneNumber} />

            <p className="mt-10 text-gray-400 text-xs">
              By Signing Up, you agree to <a href="/privacy">terms of use</a> and <a href="">privacy statements</a>.
            </p>

            <button type="button" onClick={handleSubmit} disabled={isSubmitting} className="mt-6 w-1/2 rounded-md bg-violet-600 px-3 py-1.5 text-sm font-bold text-white">
              {isSubmitting ? 'Submitting...' : 'Sign Up'}
            </button>

            <p className="mt-8 text-gray-400 text-sm">
              Already have an account? <button onClick={() => router.push("/")} className="text-cyan-500 hover:underline">Log In</button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;
