"use client";

import React, { useState } from "react";
import { Button } from "@/app/components/ui/Button";
import { Input, PasswordInput } from "@/app/components/ui/Input";
import { Logo } from "@/app/components/ui/Misc";
import { useNavigation } from "@/app/lib/Navigation";

// ─────────────────────────────────────────────────────────────
// AdminSignInPage
//
// Layout:
//   Full red background with a centered white card
//   Card contains: Logo, Email, Password, Forgot Password, Login button
//
// Behavior:
//   • "Login" → on success, navigate to "dashboard"
//   • "Forgot password?" → placeholder link (wire up as needed)
//
// DATA:
//   Replace the simulate network call in handleLogin with your real API.
// ─────────────────────────────────────────────────────────────

export default function AdminSignInPage() {
  const { navigate } = useNavigation();

  // ── Form state ───────────────────────────────────────────────
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    form?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  // ── Validation ───────────────────────────────────────────────
  const validate = () => {
    const next: typeof errors = {};
    if (!email.trim()) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      next.email = "Please enter a valid email.";
    if (!password) next.password = "Password is required.";
    return next;
  };

  // ── Submit ───────────────────────────────────────────────────
  // TODO: replace the simulated delay with your real auth API call.
  const handleLogin = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setIsLoading(true);
    try {
      // e.g. await signIn({ email, password });
      await new Promise((r) => setTimeout(r, 800)); // simulate network
      navigate("dashboard");
    } catch (err: unknown) {
      setErrors({
        form: err instanceof Error ? err.message : "Invalid email or password.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Allow submitting with Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    // Full-screen red background
    <div className="min-h-screen bg-[#D72638] flex flex-col items-center justify-center px-4 font-[family-name:var(--font-sans)]">
      {/* ── White card ─────────────────────────────────────── */}
      <div className="w-full max-w-[420px] bg-white rounded-2xl shadow-xl px-8 py-10">
        {/* Logo — uses your Logo component from Misc.tsx */}
        {/* variant="full" shows icon + "DocuKnow" text */}
        {/* To change the app name: <Logo appName="YourAppName" /> */}
        <div className="flex justify-center mb-8">
          <Logo size="md" variant="full" />
        </div>

        {/* Form-level error */}
        {errors.form && (
          <div className="mb-5 rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
            {errors.form}
          </div>
        )}

        {/* Email field */}
        <div className="mb-4">
          <Input
            label="Email"
            type="email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
            }}
            onKeyDown={handleKeyDown}
            error={errors.email}
            autoComplete="email"
            autoFocus
          />
        </div>

        {/* Password field */}
        <div className="mb-1">
          <PasswordInput
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (errors.password)
                setErrors((p) => ({ ...p, password: undefined }));
            }}
            onKeyDown={handleKeyDown}
            error={errors.password}
            autoComplete="current-password"
          />
        </div>

        {/* Forgot password */}
        {/* TODO: wire href to your password reset page/modal */}
        <div className="flex justify-end mb-6 mt-2">
          <button
            type="button"
            onClick={() => {
              /* TODO: navigate to forgot password */
            }}
            className="text-sm text-[#D72638] hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D72638]/30 rounded"
          >
            Forgot password?
          </button>
        </div>

        {/* Login button */}
        <Button
          label="Login"
          variant="primary"
          size="lg"
          fullWidth
          isLoading={isLoading}
          onClick={handleLogin}
        />
      </div>

      {/* Footer — outside the card, bottom of screen */}
      <p className="mt-8 text-xs text-white/50">
        © {new Date().getFullYear()} Sample. All rights reserved.
      </p>
    </div>
  );
}
