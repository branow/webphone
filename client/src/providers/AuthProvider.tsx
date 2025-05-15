import { FC, ReactNode, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { Auth } from "../services/auth";

interface Props {
  children: ReactNode;
}

const AuthProvider: FC<Props> = ({ children }) => {
  const [authenticated, setAuthenticated] = useState<boolean | undefined>();
  const [error, setError] = useState<string | null>();

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
        setAuthenticated(auth);
        if (!auth) {
          setError("Login failed. Thired-party cookies might be blocked.");
        }
      })
      .catch(error => {
        console.error("Keycloak init error:", error);
        setAuthenticated(false);
        setError("Authentication initialization failed.");
      });
  }, [])

  if (error) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", width: "100vw", height: "100vh"  }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", gap: 15 }}>
          <h2>Authentication Error</h2>
          <div>{error}</div>
          <div>Make sure third-party cookies are enabled in your browser.</div>
          <button onClick={() => Auth().login()}>Retry Login</button>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return <></>;
  }

  return (
    <AuthContext.Provider value={{ authenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
