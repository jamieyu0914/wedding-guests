<script setup>
const emit = defineEmits(["select"]);
</script>

<template>
  <div class="card menu-card">
    <h2>設定</h2>

    <button class="menu-item" @click="emit('select', 'addGuest')">
      <span class="menu-icon">➕</span>
      <span class="menu-text">
        <strong>新增賓客</strong>
        <small>手動新增一位賓客資料</small>
      </span>
      <span class="menu-arrow">›</span>
    </button>

    <button class="menu-item" @click="emit('select', 'changePassword')">
      <span class="menu-icon">🔒</span>
      <span class="menu-text">
        <strong>變更密碼</strong>
        <small>更新您的登入密碼</small>
      </span>
      <span class="menu-arrow">›</span>
    </button>
  </div>
</template>

<style scoped>
.card {
  max-width: 500px;
  background: white;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid rgba(192, 132, 252, 0.3);
  background: rgba(192, 132, 252, 0.05);
  backdrop-filter: blur(10px);
}

h2 {
  margin-top: 0;
  margin-bottom: 24px;
}

.menu-card {
  display: flex;
  flex-direction: column;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 16px;
  width: 100%;
  padding: 16px;
  margin-bottom: 12px;
  background: rgba(192, 132, 252, 0.05);
  border: 1px solid rgba(192, 132, 252, 0.3);
  border-radius: 10px;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
}

.menu-item:last-child {
  margin-bottom: 0;
}

.menu-item:hover {
  border-color: var(--accent);
  background: rgba(192, 132, 252, 0.12);
  transform: translateY(-1px);
}

.menu-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.menu-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.menu-text strong {
  font-size: 15px;
}

.menu-text small {
  font-size: 12px;
  opacity: 0.6;
}

.menu-arrow {
  font-size: 20px;
  opacity: 0.4;
  flex-shrink: 0;
}
</style>