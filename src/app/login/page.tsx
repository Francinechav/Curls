"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { jwtDecode } from "jwt-decode";

/**
 * Shape of JWT payload expected from backend
 * (adjust if your backend adds more fields)
 */
interface JwtPayload {
  role: string;
  exp: number;
}

interface LoginResponse {
  access_token: string;
}

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        "https://curls-api.onrender.com/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = (await res.json()) as LoginResponse;

      if (!res.ok) {
        setError("Invalid email or password.");
        return;
      }

      if (!data.access_token) {
        setError("Authentication failed.");
        return;
      }

      const decoded = jwtDecode<JwtPayload>(data.access_token);

      if (decoded.role !== "admin") {
        setError("Only admins can access this system.");
        return;
      }

      localStorage.setItem("token", data.access_token);
      router.push("/dashboard");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#e7e0f1] flex items-center justify-center py-10 px-4">
      <div className="bg-white rounded-[40px] w-full max-w-5xl grid md:grid-cols-2 shadow-xl overflow-hidden">
        
        {/* IMAGE PANEL */}
        <div className="relative h-64 md:h-auto w-full">
          <Image
            src="/three.jpg"
            alt="Login Visual"
            fill
            className="object-cover"
            priority
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
              src="/logo.png"
              alt="Logo"
              width={70}
              height={70}
              className="rounded-full"
              priority
            />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2">
            Admin Login
          </h1>

          <p className="text-gray-600 text-center mb-6 text-sm sm:text-base">
            Sign in to access the dashboard.
          </p>

          {error && (
            <p className="text-red-600 text-sm mb-4 text-center">
              {error}
            </p>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 sm:p-4 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#594a61] transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {/* Password */}
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 sm:p-4 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-[#594a61] transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#594a61] hover:bg-[#856e91] disabled:opacity-60 text-white py-3 sm:py-4 rounded-full transition text-sm sm:text-base"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
