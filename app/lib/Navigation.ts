// lib/Navigation.ts
import { useRouter } from "next/navigation";

export type NavigationAction =
  | "signIn"
  | "signUp"
  | "dashboard"
  // ── Home sidebar routes ──────────────────────────────────────
  | "home"
  | "documents"
  | "flowGuide"
  | "updates"
  | "feedback"
  // ── Dashboard sidebar routes ─────────────────────────────────
  | "dashboardDocuments"
  | "dashboardAccess"
  | "dashboardFeedback"
  | "dashboardUsers"
  | "dashboardReports"
  | "dashboardSettings"
  | "dashboardAdminFunction" ;

const ROUTES: Record<NavigationAction, string> = {
  // ── Auth ────────────────────────────────────────────────────
  signIn:               "/src/auth/sign-in",
  signUp:               "/src/auth/sign-up",

  // ── Home sidebar ────────────────────────────────────────────
  home:                 "/src/homepage/home",
  documents:            "/src/homepage/document",
  flowGuide:            "/flow-guide",
  updates:              "/updates",
  feedback:             "/feedback",

  // ── Dashboard sidebar ────────────────────────────────────────
  dashboard:            "/src/admin-page/dashboard",
  dashboardDocuments:   "/src/admin-page/dashboard/document",
  dashboardAccess:      "/src/admin-page/dashboard/access",
  dashboardFeedback:    "/src/admin-page/dashboard/feedback",
  dashboardUsers:       "/src/admin-page/dashboard/users",
  dashboardReports:     "/src/admin-page/dashboard/reports",
  dashboardSettings:    "/src/admin-page/dashboard/settings",
  dashboardAdminFunction: "/src/admin-page/dashboard/admin-function",
};

// Routes that use replace() instead of push() — no Back button
const REPLACE_ACTIONS = new Set<NavigationAction>([
  "signIn", // after logout, user shouldn't be able to go Back
]);

export function useNavigation() {
  const router = useRouter();

  function navigate(
    action: NavigationAction,
    params?: Record<string, string>,
  ) {
    const route = ROUTES[action];
    const query = params
      ? `?${new URLSearchParams(params).toString()}`
      : "";
    const fullRoute = `${route}${query}`;

    if (REPLACE_ACTIONS.has(action)) {
      router.replace(fullRoute);
    } else {
      router.push(fullRoute);
    }
  }

  return { navigate };
}