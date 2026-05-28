"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  children: React.ReactNode;
  requiredRole?: "admin" | "user";
}

const DEV_ACCOUNTS = {
  admin: {
    token: "dev-token",
    user: { id: "dev-admin", username: "devadmin", role: "admin" },
  },
  user: {
    token: "dev-token",
    user: { id: "dev-user", username: "devuser", role: "user" },
  },
};

const isDev = process.env.NODE_ENV === "development";

export default function ProtectedRoute({ children, requiredRole }: Props) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // ── DEV BYPASS ──────────────────────────────────────────
    // Works only on localhost (development mode)
    // Automatically disabled on Vercel (production)
    if (isDev) {
      const devAccount = requiredRole
        ? DEV_ACCOUNTS[requiredRole]
        : DEV_ACCOUNTS["user"];

      localStorage.setItem("token", devAccount.token);
      localStorage.setItem("user", JSON.stringify(devAccount.user));
      setAuthorized(true);
      return;
    }
    // ────────────────────────────────────────────────────────

    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (!token || !userStr) {
      router.replace("/src/auth/sign-in");
      return;
    }

    try {
      const user = JSON.parse(userStr);

      if (requiredRole && user.role !== requiredRole) {
        if (user.role === "admin") {
          router.replace("/src/dashboard");
        } else {
          router.replace("/src/auth/sign-in");
        }
        return;
      }

      setAuthorized(true);
    } catch {
      router.replace("/src/auth/sign-in");
    }
  }, []);

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-sm">Checking access...</p>
      </div>
    );
  }

  return <>{children}</>;
}
