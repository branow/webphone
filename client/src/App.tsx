import { FC } from "react"
import { RouterProvider } from "react-router";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import PhoneContainer from "./components/phone/PhoneContainer";
import AccountProvider from "./providers/AccountProvider";
import AuthProvider from "./providers/AuthProvider";
import SipProvider from "./providers/SipProvider";
import ErrorProvider from "./providers/ErrorProvider";
import { router } from "./routes";

const queryClient = new QueryClient();

const App: FC = () => {
  return (
    <div className="app">
      <PhoneContainer>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <SipProvider>
              <AccountProvider>
                <ErrorProvider>
                  <RouterProvider router={router} />
                </ErrorProvider>
              </AccountProvider>
            </SipProvider>
          </AuthProvider>
        </QueryClientProvider>
      </PhoneContainer>
    </div>
  );
};

export default App;
