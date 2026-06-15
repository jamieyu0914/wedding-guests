<script setup>
import { ref } from "vue";
import SettingMenu from "./SettingMenu.vue";
import AddGuest from "./AddGuest.vue";
import ChangePassword from "./ChangePassword.vue";

// 目前顯示的子頁面: 'menu' | 'addGuest' | 'changePassword'
const view = ref("menu");

function goTo(target) {
  view.value = target;
}

function backToMenu() {
  view.value = "menu";
}
</script>

<template>
  <div class="settings-container">
    <SettingMenu v-if="view === 'menu'" @select="goTo" />
    <AddGuest v-else-if="view === 'addGuest'" @back="backToMenu" />
    <ChangePassword
      v-else-if="view === 'changePassword'"
      @back="backToMenu"
    />
  </div>
</template>

<style scoped>
.settings-container {
  padding: 24px;
}
</style>