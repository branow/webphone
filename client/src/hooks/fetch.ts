import { useQuery } from "@tanstack/react-query";
import AccountApi, { Account } from "../services/accounts";

type Props<T> = {
  retry?: number;
  enabled?: boolean;
  initial?: T;
}

export function useFetchAccount({ id, enabled, initial }: Props<Account> & { id: string }) {
  const { data, isPending, error } = useQuery({
    queryKey: AccountApi.QueryKeys.account(id),
    queryFn: () => AccountApi.get(id),
    enabled: enabled,
    initialData: initial,
  });

  return { account: data, isPending, error };
}

export function useFetchActiveAccount({ user, enabled, initial }: Props<Account> & { user: string }) {
  const { data, isPending, error } = useQuery({
    queryKey: AccountApi.QueryKeys.accountActive(user),
    queryFn: () => AccountApi.getActive(user),
    enabled: enabled,
    initialData: initial,
  });

  return { account: data, isPending, error };
}

export function useFetchActiveDefaultAccount(props?: Props<Account>) {
  return useFetchActiveAccount({ ...props, user: "default" });
}
