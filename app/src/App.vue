<script setup>
import { ref, computed, watch } from "vue";
import SideMenu from "./components/SideMenu.vue";
import HomePage from "./components/HomePage.vue";
import SearchGuests from "./components/SearchGuests.vue";
import EditGuest from "./components/EditGuest.vue";
import GuestStats from "./components/GuestStats.vue";
import Settings from "./components/Settings.vue";

console.log("1 /src/App.vue mounted");
console.log(SearchGuests.__file);

const sideMenuRef = ref(null);
const editingGuestId = ref(null);

const currentPage = computed(() => {
  if (editingGuestId.value !== null) return "edit";
  return sideMenuRef.value?.activeMenu || "guests";
});

function openEditGuest(id) {
  editingGuestId.value = id;
}

function closeEditGuest() {
  editingGuestId.value = null;
}

watch(
  () => sideMenuRef.value?.activeMenu,
  () => {
    editingGuestId.value = null;
  },
);
</script>

<template>
  <div class="app-container">
    <SideMenu ref="sideMenuRef" />
    <main class="app-content">
      <HomePage v-if="currentPage === 'home'" />
      <SearchGuests
        v-if="currentPage === 'guests'"
        @edit-guest="openEditGuest"
      />
      <EditGuest
        v-if="currentPage === 'edit'"
        :guest-id="editingGuestId"
        @back="closeEditGuest"
        @saved="closeEditGuest"
      />
      <GuestStats v-if="currentPage === 'stats'" />
      <Settings v-if="currentPage === 'settings'" />
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