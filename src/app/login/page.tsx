"use client";
import { jwtDecode } from "jwt-decode";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const res = await fetch("https://curls-api.onrender.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Login failed");
      setLoading(false);
      return;
    }

    const decoded: any = jwtDecode(data.access_token);

    if (decoded.role !== "admin") {
      setError("Only admins can access this system.");
      setLoading(false);
      return;
    }

    localStorage.setItem("token", data.access_token);
    router.push("/dashboard");

  } catch (err) {
    setError("Something went wrong.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen md:min-h-[100vh] bg-[#e7e0f1] flex items-center justify-center py-10 px-4">
      <div className="bg-white rounded-[40px] w-full max-w-5xl grid md:grid-cols-2 shadow-xl overflow-hidden">

        {/* IMAGE PANEL */}
        <div className="relative h-64 md:h-auto w-full">
          <Image
            src="/three.jpg" // replace with your image
            alt="Login Visual"
            fill
            className="object-cover"
          />
          <div className="absolute bottom-5 left-5 text-white">
            <h2 className="text-3xl font-semibold">Welcome Back</h2>
          </div>
        </div>

        {/* FORM PANEL */}
        <div className="p-8 sm:p-10 flex flex-col justify-center">
          {/* Logo */}
          <div className="flex justify-center mb-6">
            <Image
              src="/logo.png" // replace with your logo
              alt="Logo"
              width={70}
              height={70}
              className="rounded-full"
            />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2">
            Admin Login
          </h1>
          <p className="text-gray-600 text-center mb-6 text-sm sm:text-base">
            Sign in to access the dashboard.
          </p>

          {error && (
            <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div>
              <input
                type="email"
                placeholder="Email"
                className="w-full p-3 sm:p-4 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#594a61] transition"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password */}
            <div>
              <input
                type="password"
                placeholder="Password"
                className="w-full p-3 sm:p-4 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#594a61] transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#594a61] hover:bg-[#856e91] text-white py-3 sm:py-4 rounded-full transition text-sm sm:text-base"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
