import { useEffect, useState } from "react";
import { User, Auth }  from "../services/auth";

export function useAuth() {
  const [authenticated, setAuthenticated] = useState(false);
  const [user, setUser] = useState<User>();
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith("#")) {
      const hashParams = new URLSearchParams(hash.substring(1));
      const error = hashParams.get("error");
      if (error) {
        setError(`Authentication error: ${error}`);
        setAuthenticated(false);
        return;
      }
    }

    Auth().login()
      .then(auth => {
        if (!auth) setError("Login failed");
        setAuthenticated(auth);
      })
      .catch(error => {
        console.warn("Authentication initialization failed", error)
        setError("Authentication initialization failed");
        setAuthenticated(false);
      });
  }, [])

  useEffect(() => {
    if (!authenticated) return;
    Auth().user()
      .then(user => setUser(user))
      .catch(error => {
        console.warn("Authentication failed", error)
        setError("Authenticationfailed");
      });
  }, [authenticated])

  return {
    authenticated,
    user,
    error,
  };
}
