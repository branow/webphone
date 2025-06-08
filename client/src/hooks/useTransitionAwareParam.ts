import { useContext } from "react";
import { matchPath, useParams } from "react-router";
import { PageSwitcherContext } from "context/PageSwitcherContext";

export function useTransitionAwareParam(param: string): string | undefined {
  const params = useParams<Record<string, string>>();
  const { previous } = useContext(PageSwitcherContext);
  const value = params[param];

  if (value || !previous) {
    return value;
  }

  const match = matchPath({ path: previous.path }, previous.location);
  return match?.params?.[param];
}
