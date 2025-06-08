import { ReactNode, useEffect, useRef } from "react";
import { useLocation, matchPath } from "react-router";
import { Side } from "../components/common/motion/SmoothMotion";
import { calcSides } from "../util/page-motion";
import { Route, routes } from "../routes";

const matrixes = [
  [
    ["settings", "settings", "settings"],
    ["history", "dialpad", "contacts"],
    ["admin", "admin", "admin"],
  ],
  [
    ["history", "account", "contacts"],
  ],
  [
    ["setting"],
    ["account"],
  ],
  [
    ["settings", "settings", "settings", "settings"],
    ["contacts", "contact", "contact-update", "contact-create"],
    ["admin", "admin", "admin", "admin"],
  ],
  [
    ["settings", "settings"],
    ["history", "contact"],
  ],
  [
    ["settings", "settings"],
    ["dialpad", "dialpad", "dialpad"],
    ["features", "admin", "accounts"],
  ],
  [
    ["settings", "settings", "settings", "settings"],
    ["accounts", "account", "account-update", "account-create"],
  ],
];

interface PageInfo {
  key: string;
  location: string;
  path: string;
  side: Side;
  page: ReactNode;
}

interface PageTransition {
  cur: PageInfo;
  prev?: PageInfo;
}

export function usePageTransition(): PageTransition {
  const { pathname } = useLocation();
  const prevPathRef = useRef<string>();

  useEffect(() => {
    prevPathRef.current = pathname;
  }, [pathname]);

  const curLocation = pathname;
  const prevLocation = prevPathRef.current;

  const curRoute = getRoute(curLocation);
  const prevRoute = prevLocation ? getRoute(prevLocation) : undefined;

  const sides = calcSides(matrixes, curRoute.key, prevRoute?.key);

  return {
    cur: {
      key: curRoute.key,
      path: curRoute.path,
      location: curLocation,
      side: sides[0],
      page: curRoute.page,
    },
    prev: (
      prevLocation && prevLocation !== curLocation && prevRoute
      ? {
        key: prevRoute.key,
        path: prevRoute.path,
        location: prevLocation,
        side: sides[1],
        page: prevRoute.page,
      }
      : undefined
    ),
  };
}

type MatchedRoute = Route & { path: string };

function getRoute(location: string): MatchedRoute {
  const route = findRoute(location);
  if (route) return route;
  console.error("Failed to match page of path:", location);
  return findRoute("")!;
}

function findRoute(location: string): MatchedRoute | undefined {
  for (const route of routes) {
    if (!route.page) continue;
    for (const path of route.paths) {
      if (matchPath(path, location)) {
        return { ...route, path };
      }
    }
  }
}


