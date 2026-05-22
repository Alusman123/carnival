// Admin Log in

"use client";

import React, { useState } from "react";
import { Button } from "@/app/components/ui/Button";
import { Input, PasswordInput } from "@/app/components/ui/Input";
import { Logo } from "@/app/components/ui/Misc";
import { useNavigation } from "@/app/lib/Navigation";

export default function AdminSignInPage() {
  const { navigate } = useNavigation();

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
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Invalid username or password.');

      if (data.user.role !== 'admin') {
        throw new Error('You are not authorized as admin.');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      navigate('dashboard');
    } catch (err: unknown) {
      setErrors({
        form: err instanceof Error ? err.message : 'Invalid username or password.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="min-h-screen bg-[#D72638] flex flex-col items-center justify-center px-4 font-[family-name:var(--font-sans)]">
      <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-xl px-8 py-10">
        <div className="flex justify-center mb-8">
          <Logo size="md" variant="full" />
        </div>

        {errors.form && (
          <div className="mb-5 rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
            {errors.form}
          </div>
        )}

        <div className="mb-4">
          <Input
            label="Username"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (errors.username) setErrors((p) => ({ ...p, username: undefined }));
            }}
            onKeyDown={handleKeyDown}
            error={errors.username}
            autoComplete="username"
            autoFocus
          />
        </div>

        <div className="mb-1">
          <PasswordInput
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password) setErrors((p) => ({ ...p, password: undefined }));
            }}
            onKeyDown={handleKeyDown}
            error={errors.password}
            autoComplete="current-password"
          />
        </div>

        <div className="flex justify-end mb-6 mt-2">
          <button
            type="button"
            onClick={() => {}}
            className="text-sm text-[#D72638] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D72638]/30 rounded"
          >
            Forgot password?
          </button>
        </div>

        <Button
          label="Login"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
          onClick={handleLogin}
        />
      </div>

      <p className="mt-8 text-xs text-white/50">
        © {new Date().getFullYear()} Sample. All rights reserved.
      </p>
    </div>
  );
}