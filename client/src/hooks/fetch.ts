import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import AccountApi, { Account } from "services/accounts";
import ContactApi, { Contact, CreateContact } from "services/contacts";
import { Paths } from "routes";

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

export function useFetchActiveAccount(
  { user, enabled, initial }: Props<Account> & { user: string }
) {
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

export function useFetchContactByNumber(
  { user, number, enabled, initial }: Props<Contact> & { user: string, number: string }
) {
  const { data, isPending, error } = useQuery({
    queryKey: ContactApi.QueryKeys.contactByNumber(user, number),
    queryFn: () => ContactApi.getByNumber(user, number),
    enabled: enabled,
    initialData: initial,
  });

  return { contact: data, isPending, error };
}

export function useCreateContactsBatch({ user }: { user: string }) {
  const navigate = useNavigate();
  const client = useQueryClient();
  const { mutate, isPending, error } = useMutation({
    mutationFn: (contacts: CreateContact[]) => ContactApi.createBatch(user, contacts),
    onSuccess: () => {
      client.invalidateQueries({ predicate: ContactApi.QueryKeys.predicate });
      navigate(Paths.Contacts({ user }))
    },
  });
  return { create: mutate, isPending, error };
}
