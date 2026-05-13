"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      console.log("LOGIN RESPONSE:", data);

      if (res.ok) {
        window.location.href = "/dashboard";
      } else {
        setError(data.error || "Login failed");
      }
    } catch (error) {
      console.log("LOGIN ERROR:", error);

      setError("Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#020617] text-white">
      <div className="w-[400px] p-8 rounded-2xl bg-white/5 backdrop-blur border border-white/10">
        <h1 className="text-2xl font-bold mb-6">
          Welcome Back
        </h1>

        <form
          onSubmit={handleLogin}
          className="space-y-4"
        >
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-black/40 border border-white/10 outline-none"
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            className="w-full p-3 rounded-lg bg-black/40 border border-white/10 outline-none"
            required
          />

          {error && (
            <p className="text-red-400 text-sm">
              {error}
            </p>
          )}

          <button className="w-full py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}