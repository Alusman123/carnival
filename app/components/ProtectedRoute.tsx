"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  children: React.ReactNode;
  requiredRole?: "admin" | "user";
}

export default function ProtectedRoute({ children, requiredRole }: Props) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (!token || !userStr) {
      router.replace("/src/auth/sign-in");
      return;
    }

    try {
      const user = JSON.parse(userStr);

      if (requiredRole && user.role !== requiredRole) {
        // Wrong role — redirect accordingly
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