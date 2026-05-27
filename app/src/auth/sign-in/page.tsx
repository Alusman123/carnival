// User Log In

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/app/components/ui/Button";
import { Input, PasswordInput } from "@/app/components/ui/Input";
import { cn } from "@/app/lib/utils";
import { useNavigation } from "@/app/lib/Navigation";
import { usePathname } from "next/navigation";
import ProtectedRoute from "@/app/components/ProtectedRoute";

export default function SignInPage() {
  const router = useRouter();
  const { navigate } = useNavigation();
  const pathname = usePathname();

  useEffect(() => {
    console.log("Current route path:", pathname);
  }, [pathname]);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
    form?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const next: typeof errors = {};
    if (!username.trim()) next.username = "Username is required.";
    if (!password) next.password = "Password is required.";
    return next;
  };

  const handleLogin = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        },
      );

      const data = await res.json();

      if (!res.ok)
        throw new Error(data.error || "Invalid username or password.");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "admin") {
        navigate("dashboard");
      } else {
        navigate("home");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Invalid username or password.";
      setErrors({ form: message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleContinueAsAdmin = () => {
    navigate("signUp");
  };

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="flex min-h-screen font-[family-name:var(--font-sans)]">
        <aside className="hidden md:flex flex-col w-[280px] shrink-0 bg-[#D72638] px-8 py-10 text-white">
          <div className="flex items-center gap-3 mb-auto">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
              <svg
                className="w-6 h-6 text-[#D72638]"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
              </svg>
            </div>
            <span className="text-lg font-semibold tracking-tight">Sample</span>
          </div>

          <div className="mt-16 mb-auto">
            <h1 className="text-3xl font-bold leading-tight mb-4">Welcome!!</h1>
            <p className="text-sm text-white/70 leading-relaxed">
              Sign in to access your account and manage your documents.
            </p>
          </div>

          <p className="text-xs text-white/40 mt-auto">
            © {new Date().getFullYear()} Sample. All rights reserved.
          </p>
        </aside>

        <main className="flex flex-1 flex-col">
          <div className="flex md:hidden items-center gap-3 px-6 py-4 border-b border-gray-100">
            <div className="w-8 h-8 rounded-full bg-[#D72638] flex items-center justify-center shrink-0">
              <svg
                className="w-4 h-4 text-white"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z" />
              </svg>
            </div>
            <span className="text-base font-semibold text-gray-900">
              Sample
            </span>
          </div>

          <div className="flex flex-1 items-center justify-center px-6 py-10">
            <div className="w-full max-w-[360px]">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                Welcome!!
              </h2>
              <p className="text-sm text-gray-500 mb-8">
                Sign in to your account to continue.
              </p>

              {errors.form && (
                <div className="mb-5 rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
                  {errors.form}
                </div>
              )}

              <div className="mb-4">
                <Input
                  label="Username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  error={errors.username}
                  autoComplete="username"
                />
              </div>

              <div className="mb-1">
                <PasswordInput
                  label="Password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  error={errors.password}
                  autoComplete="current-password"
                />
              </div>

              <div className="flex justify-end mb-6">
                <Link
                  href="/"
                  className="text-xs text-[#D72638] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D72638]/30 rounded"
                >
                  Forgot password?
                </Link>
              </div>

              <Button
                label="Login"
                variant="primary"
                size="lg"
                fullWidth
                isLoading={isLoading}
                onClick={handleLogin}
                className="mb-4"
              />

              <div className="flex items-center gap-3 mb-4">
                <span className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400">or</span>
                <span className="flex-1 h-px bg-gray-200" />
              </div>

              <button
                type="button"
                onClick={handleContinueAsAdmin}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl",
                  "bg-gray-50 border border-gray-100",
                  "hover:bg-gray-100 hover:border-gray-200",
                  "transition-all duration-150 text-left group",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D72638]/30",
                )}
              >
                <div className="w-9 h-9 rounded-full bg-[#D72638] flex items-center justify-center shrink-0 text-white text-sm font-semibold">
                  AD
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">Admin</p>
                  <p className="text-xs text-gray-500">System Administrator</p>
                  <p className="text-xs text-[#D72638] mt-0.5 group-hover:underline">
                    Continue as Admin ›
                  </p>
                </div>
              </button>
            </div>
          </div>

          <footer className="hidden md:block text-center text-xs text-gray-400 py-4 border-t border-gray-100">
            © {new Date().getFullYear()} Sample. All rights reserved.
          </footer>
        </main>
      </div>
    </ProtectedRoute>
  );
}
