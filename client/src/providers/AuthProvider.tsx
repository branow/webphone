import { FC, ReactNode, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import keycloak, { login } from "../services/keycloak";

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

    login()
      .then(auth => {
        setAuthenticated(auth);
        if (!auth) {
          setError("Login failed. Thired-party cookies might be blocked.");
      }})
      .catch(error => {
        console.error("Keycloak init error:", error);
        setAuthenticated(false);
        setError("Authentication initialization failed.");
      });
  }, [])

  if (error) {
    return (
      <div>
        <h2>Authentication Error</h2>
        <p>{error}</p>
        <p>Make sure third-party cookies are enabled in your browser.</p>
        <button onClick={() => keycloak.login()}>Retry Login</button>
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
