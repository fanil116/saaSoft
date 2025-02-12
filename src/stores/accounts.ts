import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import type { AccountsType } from '../types/accounts';

export const useAccountsStore = defineStore('accounts', () => {
  let accounts: Ref<AccountsType[] | null> = ref(null);

  return { accounts }
})
