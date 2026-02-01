"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import ClientLayout from "../../components/ClientLayout";

export default function RegisterPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
  });

  const [loading, setLoading] = useState(false);

  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      alert("Registration successful. Please login.");
      router.push("/login");
    } else {
      alert(data.message || "Registration failed");
    }
  }

  return (
    <ClientLayout >
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center mb-6">
          Create Account
        </h1>

        <form onSubmit={handleRegister} className="space-y-4">
          <input
            placeholder="Full Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border rounded-lg px-4 py-2.5"
          />

          <input
            type="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border rounded-lg px-4 py-2.5"
          />

          <input
            type="password"
            placeholder="Password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full border rounded-lg px-4 py-2.5"
          />

          {/* Role selection */}
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full border rounded-lg px-4 py-2.5"
          >
            <option value="user">Register as User</option>
            <option value="admin">Register as Admin</option>
          </select>

          <button
            disabled={loading}
            className="w-full bg-black text-white py-2.5 rounded-lg hover:bg-black/90 transition"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-500 mt-6">
          Already have an account?{" "}
          <span
            className="text-black font-semibold cursor-pointer"
            onClick={() => router.push("/login")}
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
    </ClientLayout>
  );
}
