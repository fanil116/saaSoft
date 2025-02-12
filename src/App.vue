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
      <textarea v-model="account.label" placeholder="Метки"class="account__textarea"/>
      <select v-model="account.type" class="account__select">
        <option value="local">Локальная</option>
        <option value="ldap">LDAP</option>
      </select>
      <input v-model="account.login" placeholder="Логин" :class="[
        account.type === 'ldap' ? 'account__input_full' : 'account__input'
      ]">
      <div v-if="account.type === 'local'" class="password-container account__input">
        <input v-model="account.password" :type="account.showPassword ? 'text' : 'password'" placeholder="Пароль" />
        <div class="show-password" @click="togglePassword(index)">
          <ShowPasswordIcon v-if="account.showPassword"/> 
          <HidePasswordIcon v-else/>
        </div>
      </div>
      <button  @click="removeAccount(index)"><BacketIcon /></button>
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
const accounts: Ref<AccountsType[]> = ref([{ label: '', labelObject: {}, type: 'local', login: '', password: '', showPassword: false }]);
const errors: Ref<ErrorsType[]> = ref([{ label: false, login: false, password: false }]);

const addAccount = () => {
  accounts.value.push({ label: '', type: 'local', login: '', password: '', showPassword: false });
  errors.value.push({ label: false, login: false, password: false });
};

const removeAccount = (index: number) => {
  accounts.value.splice(index, 1);
  errors.value.splice(index, 1);
  if (accounts.value.length == 0) {
    accounts.value = [{ label: '', labelObject: {}, type: 'local', login: '', password: '', showPassword: false }]
  }
};

const togglePassword = (index: number) => {
  accounts.value[index].showPassword = !accounts.value[index].showPassword;
};

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
