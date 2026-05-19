"use client";

import Image from "next/image";
import { Button } from "@/app/components/ui/Button";
import SignInPage from "./src/auth/SignInPage";
import SignUpPage from "./src/auth/SignUpPage";

export default function Home() {
  return <SignInPage />;
}
