"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e: any) => {
    e.preventDefault();

    const res = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push("/login");
      return;
    }

    const errorData = await res.json();
    alert(errorData.error || "Signup failed");
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-[400px] p-8 rounded-2xl bg-white/5 backdrop-blur border border-white/10">
        <h1 className="text-2xl font-bold mb-6">Create Account</h1>

        <form onSubmit={handleSignup} className="space-y-4">
          <input
            name="name"
            placeholder="Name"
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-black/40 border border-white/10"
          />

          <input
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-black/40 border border-white/10"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-black/40 border border-white/10"
          />

          <button className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}