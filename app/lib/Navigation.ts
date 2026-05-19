// lib/Navigation.ts
import { useRouter } from "next/navigation";

export type NavigationAction =
  | "signIn"
  | "signUp"
  | "dashboard";

const ROUTES: Record<NavigationAction, string> = {
  signIn: "/src/auth/sign-in",
  signUp: "/src/auth/sign-up",
  dashboard: "/src/dashboard"
};

const REPLACE_ACTIONS = new Set<NavigationAction>([]);

export function useNavigation() {
  const router = useRouter();

  function navigate(
    action: NavigationAction,
    params?: Record<string, string>,
  ) {
    const route = ROUTES[action];

    // Convert params to query string
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