<template>
  <main>
    <div class="title">
      <p>Учетные записи</p>
      <button @click="addAccount" class="title__btn">+</button>
    </div>
    <div class="subtitle">? Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;</div>
    <div class="labels">
      <p class="labels__textarea">Метки</p>
      <p class="labels__select">Тип записи</p>
      <p class="label__input">Логин</p>
      <p class="label__input">Пароль</p>
    </div>
    <div v-for="(account, index) in accounts" :key="index" class="account">
      <textarea v-model="account.label" @blur="validateField(index, 'label')" placeholder="Метки" :class="{'error': errors[index]?.label}" class="account__textarea"/>
      <select v-model="account.type" @change="handleTypeChange(index)" class="account__select">
        <option value="local">Локальная</option>
        <option value="ldap">LDAP</option>
      </select>
      <input v-model="account.login" @blur="validateField(index, 'login')"  placeholder="Логин" :class="[
        account.type === 'ldap' ? 'account__input_full' : 'account__input',
        errors[index]?.login ? 'error' : ''
      ]">
      <div v-if="account.type === 'local'" class="password-container account__input" :class="{'error': errors[index]?.password}">
        <input v-model="account.password" @blur="validateField(index, 'password')" :type="account.showPassword ? 'text' : 'password'" placeholder="Пароль" />
        <div class="show-password" @click="togglePassword(index)">
          <ShowPasswordIcon v-if="account.showPassword"/> 
          <HidePasswordIcon v-else/>
        </div>
      </div>
      <button @click="removeAccount(index)"><BacketIcon /></button>
    </div>
  </main>
</template>
<script setup lang="ts">
import { ref, watch, onMounted, computed, type Ref } from 'vue';
import { useAccountsStore } from "./stores/counter";
import BacketIcon from './components/icons/IconBacket.vue';
import ShowPasswordIcon from './components/icons/IconShowPassword.vue';
import HidePasswordIcon from './components/icons/IconHidePassword.vue';
import type { AccountsType } from './types/accounts';
import type { ErrorsType } from './types/error';
const store = useAccountsStore();
const accounts: Ref<AccountsType[] | null> = ref(null);
const errors: Ref<ErrorsType[] | null> = ref(null);

onMounted(()=> {
  store.getAccountsFromLocal();

  accounts.value = store.accounts && store.accounts.length > 0 ? store.accounts : [{ label: '', labelObject: {}, type: 'local', login: '', password: '', showPassword: false }];

  errors.value = accounts.value.map(() => ({ label: false, login: false, password: false }));
})
  
const addAccount = () => {
  accounts.value.push({ label: '', type: 'local', login: '', password: '', showPassword: false });
  errors.value.push({ label: false, login: false, password: false });
};

const removeAccount = (index: number) => {
  accounts.value.splice(index, 1);
  errors.value.splice(index, 1);
  store.setAccounts(accounts.value);
  if (accounts.value.length == 0) {
    accounts.value = [{ label: '', labelObject: {}, type: 'local', login: '', password: '', showPassword: false }]
  }
};

const togglePassword = (index: number) => {
  accounts.value[index].showPassword = !accounts.value[index].showPassword;
};

const handleTypeChange = (index: number) => {
  if (accounts.value[index].type === 'ldap') {
    accounts.value[index].password = null;
  }
  validateField(index, 'password');
};
const validateField = (index: number, field: string) => {
  let validLabel = true;
  if (field === 'label') {
    accounts.value[index].label = accounts.value[index].label.trim();
    errors.value[index].label = accounts.value[index].label.length > 50;
    validLabel = !errors.value[index].label;
  }
  accounts.value[index].login = accounts.value[index].login.trim();
  errors.value[index].login = accounts.value[index].login.length < 1 || accounts.value[index].login.length > 100;
  let validLogin = !errors.value[index].login;

  errors.value[index].password = accounts.value[index].type === 'local' && (!accounts.value[index].password || accounts.value[index].password.length > 100);
  let validPassword = !errors.value[index].password;

  let valid = validLabel && validLogin && validPassword;
  if (valid) {
    store.setAccounts(accounts.value);
  }
};

watch(() => accounts.value ? accounts.value.map(acc => acc.label) : [],
  (newLabels: string[], oldLabels: string[]) => {
    newLabels.forEach((label, index) => {
      accounts.value[index].labelObject = label.split(';').map(text => ({ text: text.trim() })).filter(t => t.text);
    });
  },
  { deep: true }
);

</script>
<style>
.error {
  border: 1px solid red;
}
.title {
  display: flex;
}
.subtitle {
  background: silver;
  padding: 2px 5px;
}
.title__btn {
  border: 1px solid black;
  padding: 2px;
  margin-left: 20px;
  cursor: pointer;
}
.labels {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  align-items: center;
}

.labels__textarea {
  width: 165px;
}

.labels__select {
  width: 100px;
}

.label__input {
  width: 175px;
}

.account {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
  align-items: center;
}

.account__textarea {
  max-width: 160px;
}

.account__select {
  max-width: 100px;
}

.account__input {
  max-width: 175px;
}

.account__input_full {
  width: 100%;
}
.password-container {
  position: relative;
}
.show-password {
  position: absolute;
  top:0;
  right: 10px;
}
input, select {
  padding: 5px;
  flex: 1;
}
button {
  padding: 5px 10px;
  cursor: pointer;
}
</style>
