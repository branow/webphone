import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "../context/AuthContext";
import AccountApi from "../services/accounts";

export function useAccount() {
  const { user } = useContext(AuthContext);
  const fetching = useUserAccount(user, !!user);
  const fetchingDefault = useUserAccount("default", isAccessDenied(fetching.error));

  const account = fetching.account || fetchingDefault.account;
  const error = (!isAccessDenied(fetching.error) && fetching.error) || fetchingDefault.error;
  const isPending = !account && !error;

  return {
    account: account ? {
      ...account,
      isDefault: account.user === "default",
    } : undefined,
    error: error,
    isPending: isPending,
    refetch: fetching.refetch,
  };
}

function isAccessDenied(error: Error | null) {
  return error?.name === "error.access.denied";
}

function useUserAccount(userId: string, enabled: boolean) {
  const { data, isPending, error, refetch } = useQuery({
    queryKey: AccountApi.QueryKeys.account(userId!),
    queryFn: () => AccountApi.getActive(userId!),
    enabled: enabled,
    retry: 1,
  });
  return {
    account: data,
    error,
    isPending,
    refetch,
  };
}
