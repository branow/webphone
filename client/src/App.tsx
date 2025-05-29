import { FC } from "react"
import { RouterProvider } from "react-router";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import AuthProvider from "./providers/AuthProvider";
import SipProvider from "./providers/SipProvider";
import { router } from "./routes";

const queryClient = new QueryClient();

const App: FC = () => {
  return (
    <div className="app">
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <SipProvider>
            <RouterProvider router={router} />
          </SipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </div>
  );
};

export default App;
