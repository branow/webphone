import { useState } from "react";
import { useNavigate } from "react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import AccountApi, { Account } from "services/accounts";
import { Paths } from "routes";

interface Props {
  initAccount: Account;
  saveAccount: (account: Account) => Promise<Account>
}

export function useSaveAccount({ initAccount, saveAccount }: Props) {
  const [account, setAccount] = useState<Account>(initAccount);

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { error, isPending, mutate } = useMutation({
    mutationFn: saveAccount,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ predicate: AccountApi.QueryKeys.predicate });
      navigate(Paths.AccountView({ id: data.id }));
      setAccount(data);
    }
  });

  const save = (account: Account) => {
    setAccount({ ...account });
    mutate({ ...account });
  };
 
  return {
    account,
    save,
    isPending,
    error,
  }
}
