import { useEffect, useState } from "react";
import type { RoutePath } from "./types";

const validRoutes: RoutePath[] = [
  "/login",
  "/signup",
  "/interview",
  "/dashboard",
  "/timeline",
  "/plan",
  "/biblioteca",
  "/chat"
];

function normalize(pathname: string): RoutePath {
  return validRoutes.includes(pathname as RoutePath) ? (pathname as RoutePath) : "/login";
}

export function goTo(path: RoutePath, replace = false) {
  const method = replace ? "replaceState" : "pushState";
  window.history[method](null, "", path);
  window.dispatchEvent(new PopStateEvent("popstate"));
}

export function useRoute() {
  const [route, setRoute] = useState<RoutePath>(() => normalize(window.location.pathname));

  useEffect(() => {
    if (window.location.pathname === "/") {
      goTo("/login", true);
      return;
    }

    const syncRoute = () => setRoute(normalize(window.location.pathname));
    window.addEventListener("popstate", syncRoute);
    syncRoute();
    return () => window.removeEventListener("popstate", syncRoute);
  }, []);

  return route;
}
