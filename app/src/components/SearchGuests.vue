<script setup>
import { ref, computed, onMounted } from "vue";
import { useGuests } from '../composables/useGuests'

const { guests, loading, error, fetchGuests, updateGuest, deleteGuest } = useGuests()

onMounted(() => fetchGuests())

// State
const searchQuery = ref("");

async function confirmRsvp(id) {
  await updateGuest(id, { rsvp_status: '已出席' })
}

// Computed properties
const filteredGuests = computed(() => {
  const trimmedQuery = searchQuery.value.trim();
  if (!trimmedQuery) return guests.value;

  const query = trimmedQuery.toLowerCase();
  return guests.value.filter((guest) => {
    const searchFields = [
      guest.name?.toLowerCase() ?? '',
      guest.email?.toLowerCase() ?? '',
      guest.phone_last_3_code ?? '',
      guest.meal_preference?.toLowerCase() ?? '',
      guest.rsvp_status?.toLowerCase() ?? '',
    ];
    return searchFields.some((field) => field.includes(query));
  });
});

// Methods
const getStatusClass = (status) => {
  switch (status) {
    case "已出席": return "status-confirmed";
    case "等待確認": return "status-pending";
    case "確認缺席": return "status-declined";
    default: return "";
  }
};

const getMealPreferenceClass = (preference) => {
  switch (preference) {
    case "葷食": return "meal-meat-based";
    case "素食": return "meal-vegetarian";
    default: return "";
  }
};

const clearSearch = () => {
  searchQuery.value = "";
};
</script>

<template>
  <div class="search-container">
    <h1>賓客列表</h1>

    <p v-if="loading">載入中...</p>
    <p v-if="error" class="error-msg">{{ error }}</p>

    <div class="search-bar">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="按姓名、信箱、手機或狀態搜尋..."
        class="search-input"
      />
      <button
        @click="clearSearch"
        v-show="searchQuery"
        class="clear-btn"
        aria-label="清除搜尋"
      >
        ✕
      </button>
      <button class="search-btn" aria-label="搜尋">🔍</button>
    </div>

    <div class="results-info">
      <p>共 {{ filteredGuests.length }} 位賓客</p>
    </div>

    <div v-if="filteredGuests.length > 0" class="guests-grid">
      <div v-for="guest in filteredGuests" :key="guest.id" class="guest-card">
        <div class="guest-header">
          <h3>{{ guest.name }}</h3>
          <span :class="['status-badge', getStatusClass(guest.rsvp_status)]">
            {{ guest.rsvp_status }}
          </span>
        </div>

        <div class="guest-info">
          <div class="info-item">
            <span class="label">信箱:</span>
            <a :href="`mailto:${guest.email}`">{{ guest.email }}</a>
          </div>

          <div class="info-item">
            <span class="label">手機:</span>
            <a :href="`tel:${guest.phone_last_3_code}`">09*******{{ guest.phone_last_3_code }}</a>
          </div>

          <div class="info-item">
            <span class="label">餐點偏好:</span>
            <span :class="['meal-preference', getMealPreferenceClass(guest.meal_preference)]">
              {{ guest.meal_preference }}
            </span>
          </div>

          <div v-if="guest.table_number" class="info-item">
            <span class="label table-label">桌次:</span>
            <span class="table-number">{{ guest.table_number }}</span>
          </div>

          <div v-if="guest.notes" class="info-item">
            <span class="label">備註:</span>
            <span>{{ guest.notes }}</span>
          </div>

          <div class="info-item actions">
            <button @click="confirmRsvp(guest.id)" class="btn-confirm">確認出席</button>
            <button @click="deleteGuest(guest.id)" class="btn-delete">刪除</button>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="!loading" class="no-results">
      <p>沒有找到符合搜尋條件的賓客。</p>
    </div>
  </div>
</template>

<style scoped>
.search-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  color: var(--text-h);
  margin-bottom: 2rem;
  text-align: center;
  font-size: 2rem;
}

.error-msg {
  color: #ff6b6b;
  text-align: center;
  margin-bottom: 1rem;
}

.search-bar {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  align-items: center;
}

.search-input {
  flex: 1;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 2px solid var(--border);
  border-radius: 8px;
  background: var(--bg);
  color: var(--text-h);
  transition: border-color 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px var(--accent-bg);
}

.search-input::placeholder {
  color: var(--text);
}

.clear-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text);
  font-size: 1.2rem;
  padding: 0.5rem;
  transition: color 0.2s ease;
  flex-shrink: 0;
}

.clear-btn:hover { color: var(--accent); }
.clear-btn:focus { outline: none; }

.search-btn {
  background: var(--bg);
  border: 2px solid var(--border);
  border-radius: 6px;
  cursor: pointer;
  color: var(--text);
  font-size: 1.2rem;
  padding: 0.5rem 0.8rem;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.search-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.search-btn:focus { outline: none; }

.results-info {
  text-align: right;
  margin-bottom: 1.5rem;
  color: var(--text);
  font-size: 0.9rem;
}

.guests-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.guest-card {
  background: var(--code-bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: var(--shadow);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.guest-card:hover {
  transform: translateY(-4px);
  box-shadow: rgba(170, 59, 255, 0.2) 0 10px 20px -5px;
}

.guest-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  border-bottom: 2px solid var(--border);
  padding-bottom: 0.75rem;
  gap: 1rem;
}

.guest-header h3 {
  margin: 0;
  color: #9f54e5;
  font-size: 1.1rem;
  flex: 1;
  word-break: break-word;
}

.status-badge {
  padding: 0.35rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  white-space: nowrap;
}

.status-confirmed { background: rgba(168, 85, 247, 0.2); color: #9f54e5; }
.status-pending   { background: rgba(212, 165, 116, 0.4); color: #d4a574; }
.status-declined  { background: rgba(255, 107, 107, 0.2); color: #ff6b6b; }

.meal-preference { font-weight: 600; }
.meal-preference.meal-meat-based { color: #d4a574; }
.meal-preference.meal-vegetarian { color: #22c55e; }

.table-number { color: #9f54e5; font-weight: 700; }

.guest-info {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.info-item {
  display: flex;
  gap: 0.75rem;
  align-items: flex-start;
}

.label {
  font-weight: 600;
  color: var(--text-h);
  flex-shrink: 0;
  min-width: 70px;
}

.table-label { color: #9f54e5 !important; }

.info-item span,
.info-item a { color: var(--text); word-break: break-word; }

.info-item .table-number { color: #9f54e5 !important; font-weight: 700 !important; }

.info-item a {
  text-decoration: none;
  color: var(--text);
  transition: opacity 0.2s ease;
}

.info-item a:hover { opacity: 0.8; text-decoration: underline; }

.actions { margin-top: 0.5rem; gap: 0.5rem; }

.btn-confirm {
  padding: 0.4rem 0.9rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 0.85rem;
  background: rgba(168, 85, 247, 0.2);
  color: #9f54e5;
  transition: background 0.2s;
}
.btn-confirm:hover { background: rgba(168, 85, 247, 0.35); }

.btn-delete {
  padding: 0.4rem 0.9rem;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-size: 0.85rem;
  background: rgba(255, 107, 107, 0.15);
  color: #ff6b6b;
  transition: background 0.2s;
}
.btn-delete:hover { background: rgba(255, 107, 107, 0.3); }

.no-results {
  text-align: center;
  padding: 3rem;
  color: var(--text);
  font-size: 1.1rem;
  background: var(--code-bg);
  border: 1px dashed var(--border);
  border-radius: 8px;
}

@media (max-width: 768px) {
  .search-container { padding: 1rem; }
  h1 { font-size: 1.5rem; margin-bottom: 1.5rem; }
  .guests-grid { grid-template-columns: 1fr; }
  .guest-header { flex-direction: column; align-items: flex-start; }
  .status-badge { align-self: flex-start; }
}
</style>