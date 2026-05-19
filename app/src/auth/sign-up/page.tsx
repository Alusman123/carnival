"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/app/components/ui/Button";
import { Input, PasswordInput, Checkbox } from "@/app/components/ui/Input";
import { cn } from "@/app/lib/utils";
import { useNavigation } from "@/app/lib/Navigation";

// ─────────────────────────────────────────────────────────────
// SignUpPage
//
// Layout:
//   Left panel  → Brand sidebar (red background, logo, welcome text)
//   Right panel → Registration form
//
// Fields:
//   Full Name · Email Address · Username · Password · Confirm Password
//   Terms & Privacy checkbox
//
// Behavior:
//   • "Create Account" → on success, router.push("/")
//   • "Sign In" link → navigates to /sign-in
//
// Styling:
//   Uses your existing Button, Input, PasswordInput, and Checkbox components.
//   Tailwind + CSS variables from globals.css.
// ─────────────────────────────────────────────────────────────

// ── Types ────────────────────────────────────────────────────
interface FormData {
  fullName: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  username?: string;
  password?: string;
  confirmPassword?: string;
  terms?: string;
  form?: string;
}

// ── Helpers ──────────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignUpPage() {
  const router = useRouter();
  const { navigate } = useNavigation();

  // ── Form state ──────────────────────────────────────────────
  const [form, setForm] = useState<FormData>({
    fullName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false); // checked by default (matches the image)
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  // ── Field updater helper ────────────────────────────────────
  // Usage: onChange={(e) => setField("fullName", e.target.value)}
  const setField = (key: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    // Clear the error for this field as the user types
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  // ── Validation ──────────────────────────────────────────────
  const validate = (): FormErrors => {
    const next: FormErrors = {};

    if (!form.fullName.trim()) next.fullName = "Full name is required.";

    if (!form.email.trim()) next.email = "Email address is required.";
    else if (!EMAIL_RE.test(form.email))
      next.email = "Please enter a valid email address.";

    if (!form.username.trim()) next.username = "Username is required.";
    else if (form.username.length < 3)
      next.username = "Username must be at least 3 characters.";

    if (!form.password) next.password = "Password is required.";
    else if (form.password.length < 8)
      next.password = "Password must be at least 8 characters.";

    if (!form.confirmPassword)
      next.confirmPassword = "Please confirm your password.";
    else if (form.password !== form.confirmPassword)
      next.confirmPassword = "Passwords do not match.";

    if (!agreedToTerms)
      next.terms = "You must agree to the Terms of Service and Privacy Policy.";

    return next;
  };

  // ── Submit handler ──────────────────────────────────────────
  // Replace the inside of this function with your real registration API call.
  const handleCreateAccount = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsLoading(true);

    try {
      // TODO: replace with your real API call, e.g.:
      // const res = await register({ ...form });
      // if (!res.ok) throw new Error(res.message);
      await new Promise((r) => setTimeout(r, 800)); // simulate network
      router.push("/");
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Registration failed. Please try again.";
      setErrors({ form: message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen font-[family-name:var(--font-sans)]">
      {/* ── LEFT: Brand sidebar ──────────────────────────────── */}
      {/* To change the sidebar width, edit the `w-[280px]` class below.
          The CSS variable --auth-sidebar-width is also set to 280px in your globals. */}
      <aside className="hidden md:flex flex-col w-[280px] shrink-0 bg-[#D72638] px-8 py-10 text-white">
        {/* Logo + app name */}
        {/* Replace the SVG below with your actual <Logo /> component once imported */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0">
            {/* Placeholder logo mark — swap with <Logo /> */}
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

        {/* Welcome copy — edit text here */}
        <div className="mt-16 mb-auto">
          <h1 className="text-3xl font-bold leading-tight mb-4">
            Create Your Account
          </h1>
          {/* Body text — change this to your actual tagline/description */}
          <p className="text-sm text-white/70 leading-relaxed">
            Join us and start managing your documents smarter.
          </p>

          {/* Optional extra line of text — remove if not needed */}
          <p className="text-xs text-white/40 mt-6">
            Already have an account?{" "}
            <button
              onClick={() => navigate("signIn")}
              className="text-white/70 underline hover:text-white transition-colors"
            >
              Sign in here.
            </button>
          </p>
        </div>

        {/* Footer */}
        <p className="text-xs text-white/40 mt-auto">
          © {new Date().getFullYear()} Sample. All rights reserved.
        </p>
      </aside>

      {/* ── RIGHT: Form panel ────────────────────────────────── */}
      <main className="flex flex-1 flex-col">
        {/* Mobile-only top bar (visible below md breakpoint) */}
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
          <span className="text-base font-semibold text-gray-900">Sample</span>
        </div>

        {/* Centered form */}
        <div className="flex flex-1 items-center justify-center px-6 py-10">
          <div className="w-full max-w-[360px]">
            {/* Heading */}
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              Create Account
            </h2>
            <p className="text-sm text-gray-500 mb-8">
              Fill in your details to get started.
            </p>

            {/* Form-level error — shown when API returns an error */}
            {errors.form && (
              <div className="mb-5 rounded-lg bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
                {errors.form}
              </div>
            )}

            {/* Full Name */}
            <div className="mb-4">
              <Input
                label="Full Name"
                placeholder="Enter your full name"
                value={form.fullName}
                onChange={(e) => setField("fullName", e.target.value)}
                error={errors.fullName}
                autoComplete="name"
              />
            </div>

            {/* Email Address */}
            <div className="mb-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                error={errors.email}
                autoComplete="email"
              />
            </div>

            {/* Username */}
            <div className="mb-4">
              <Input
                label="Username"
                placeholder="Choose a username"
                value={form.username}
                onChange={(e) => setField("username", e.target.value)}
                error={errors.username}
                autoComplete="username"
              />
            </div>

            {/* Password */}
            <div className="mb-4">
              <PasswordInput
                label="Password"
                placeholder="Create a password"
                value={form.password}
                onChange={(e) => setField("password", e.target.value)}
                error={errors.password}
                autoComplete="new-password"
                // Uncomment the line below to show a strength meter under the field:
                // showStrengthMeter
              />
            </div>

            {/* Confirm Password */}
            <div className="mb-5">
              <PasswordInput
                label="Confirm Password"
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChange={(e) => setField("confirmPassword", e.target.value)}
                error={errors.confirmPassword}
                autoComplete="new-password"
              />
            </div>

            {/* Terms & Privacy checkbox */}
            {/* Wire the href values below to your actual Terms and Privacy pages */}
            <div className="mb-6">
              <Checkbox
                label={
                  <span className="text-sm text-gray-600">
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="text-[#D72638] hover:underline focus:outline-none"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-[#D72638] hover:underline focus:outline-none"
                    >
                      Privacy Policy
                    </Link>
                  </span>
                }
                checked={agreedToTerms}
                onChange={(e) => {
                  setAgreedToTerms(e.target.checked);
                  if (errors.terms)
                    setErrors((prev) => ({ ...prev, terms: undefined }));
                }}
              />
              {/* Terms error message */}
              {errors.terms && (
                <p className="mt-1.5 text-xs text-[#D72638]">{errors.terms}</p>
              )}
            </div>

            {/* Create Account button */}
            <Button
              label="Create Account"
              variant="primary"
              size="lg"
              fullWidth
              isLoading={isLoading}
              onClick={handleCreateAccount}
              className="mb-4"
            />

            {/* Sign in link */}
            <div
              className={cn(
                "w-full flex items-center justify-center gap-1.5",
                "px-4 py-3 rounded-xl",
                "bg-gray-50 border border-gray-100",
                "text-sm text-gray-500",
              )}
            >
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("signIn")} // ← fix 2: signIn not signUp
                className="text-[#D72638] font-semibold hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D72638]/30 rounded"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>

        {/* Desktop footer */}
        <footer className="hidden md:block text-center text-xs text-gray-400 py-4 border-t border-gray-100">
          © {new Date().getFullYear()} Sample. All rights reserved.
        </footer>
      </main>
    </div>
  );
}
