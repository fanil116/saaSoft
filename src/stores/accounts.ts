import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import type { AccountsType } from '../types/accounts';
export const useAccountsStore = defineStore('accounts', () => {
  let accounts: Ref<AccountsType[] | null> = ref(null);
  function setAccounts(item: AccountsType[]) {
   accounts.value =  [...item];
   localStorage.setItem("accounts", JSON.stringify(accounts.value));
  }
  function getAccountsFromLocal() {
    let localAccounts = JSON.parse(localStorage.getItem('accounts')!);
    if (localAccounts) {
      accounts.value = [...localAccounts]
    }
  }

  return { accounts, getAccountsFromLocal, setAccounts}
})
