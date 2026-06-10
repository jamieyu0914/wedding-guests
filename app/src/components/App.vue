<script setup>
import { ref } from "vue";
import HomePage from "./HomePage.vue";
import SearchGuests from "./SearchGuests.vue";
import SideMenu from "./SideMenu.vue";
import { getAuthState } from "../stores/auth.js";

const { isLoggedIn } = getAuthState();
const sideMenuRef = ref(null);
</script>

<template>
  <div class="app-layout">
    <SideMenu ref="sideMenuRef" />
    <main class="main-content">
      <!-- 首頁 -->
      <template v-if="!sideMenuRef || sideMenuRef.activeMenu === 'home'">
        <HomePage />
      </template>

      <!-- 賓客列表 - 未登入時不顯示 -->
      <template v-else-if="sideMenuRef.activeMenu === 'guests' && isLoggedIn">
        <SearchGuests />
      </template>

      <!-- 其他頁面未登入時顯示提示 -->
      <template v-else-if="!isLoggedIn">
        <div class="protected-page">
          <p>⚠️ 請先登入以存取此頁面</p>
        </div>
      </template>
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  height: 100vh;
}

.main-content {
  flex: 1;
  overflow-y: auto;
  background: var(--bg);
}

.protected-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 32px;
}

.protected-page p {
  font-size: 18px;
  color: var(--text);
  text-align: center;
}

@media (max-width: 768px) {
  .app-layout {
    flex-direction: column;
  }
}
</style>
