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

    let user;

    try {
      user = JSON.parse(userStr);
    } catch {
      router.replace("/src/auth/sign-in");
      return;
    }

    if (requiredRole && user.role !== requiredRole) {
      if (user.role === "admin") {
        router.replace("/src/admin-page/dashboard");
      } else {
        router.replace("/src/homepage/home");
      }
      return;
    }

    setAuthorized(true);
  }, [router, requiredRole]);

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-sm">Checking access...</p>
      </div>
    );
  }

  return <>{children}</>;
}
