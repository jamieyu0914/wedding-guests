<script setup>
import { ref, computed } from 'vue'
import SideMenu from './components/SideMenu.vue'
import HomePage from './components/HomePage.vue'
import SearchGuests from './components/SearchGuests.vue'

const sideMenuRef = ref(null)

const currentPage = computed(() => {
  return sideMenuRef.value?.activeMenu || 'guests'
})
</script>

<template>
  <div class="app-container">
    <SideMenu ref="sideMenuRef" />
    <main class="app-content">
      <HomePage v-if="currentPage === 'home'" />
      <SearchGuests v-if="currentPage === 'guests'" />
    </main>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  min-height: 100vh;
}

.app-content {
  flex: 1;
  padding: 32px;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .app-container {
    flex-direction: column;
  }
  
  .app-content {
    padding: 20px;
  }
}
</style>
