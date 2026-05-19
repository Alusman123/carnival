// lib/Navigation.ts
import { useRouter } from "next/navigation";

export type NavigationAction =
  | "signIn"
  | "signUp";

const ROUTES: Record<NavigationAction, string> = {
  signIn: "/SignInPage",
  signUp: "/SignUpPage",
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