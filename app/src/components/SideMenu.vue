<script setup>
import { ref } from 'vue'

const activeMenu = ref('home')

const menuItems = [
  { id: 'guests', label: '賓客列表', icon: '🔍' },
  { id: 'stats', label: '即時統計', icon: '📊' },
  { id: 'settings', label: '設定', icon: '⚙️' }
]

const handleMenuClick = (menuId) => {
  activeMenu.value = menuId
}

const handleTitleClick = () => {
  activeMenu.value = 'home'
}

defineExpose({
  activeMenu
})
</script>

<template>
  <aside class="side-menu">
    <div class="menu-header">
      <h1 class="menu-title" @click="handleTitleClick">婚禮選單</h1>
    </div>
    
    <nav class="menu-nav">
      <ul class="menu-list">
        <li 
          v-for="item in menuItems" 
          :key="item.id"
          class="menu-item"
          :class="{ active: activeMenu === item.id }"
          @click="handleMenuClick(item.id)"
        >
          <span class="menu-icon">{{ item.icon }}</span>
          <span class="menu-label">{{ item.label }}</span>
        </li>
      </ul>
    </nav>
    
    <div class="menu-footer">
      <p>2026 Wedding</p>
    </div>
  </aside>
</template>

<style scoped>
.side-menu {
  display: flex;
  flex-direction: column;
  width: 250px;
  height: 100vh;
  background: linear-gradient(135deg, rgba(170, 59, 255, 0.1) 0%, rgba(192, 132, 252, 0.05) 100%);
  border-right: 1px solid var(--border);
  padding: 24px 16px;
  box-sizing: border-box;
  position: sticky;
  top: 0;
}

.menu-header {
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border);
}

.menu-header h1 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: var(--accent);
  line-height: 1.3;
}

.menu-title {
  cursor: pointer;
  transition: opacity 0.3s ease;
}

.menu-title:hover {
  opacity: 0.8;
}

.menu-nav {
  flex: 1;
}

.menu-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid transparent;
  font-size: 15px;
  color: var(--text);
}

.menu-item:hover {
  background-color: var(--accent-bg);
  color: var(--accent);
  border-color: var(--accent-border);
}

.menu-item.active {
  background-color: var(--accent-bg);
  color: var(--accent);
  border-color: var(--accent-border);
  font-weight: 500;
}

.menu-icon {
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
}

.menu-label {
  flex: 1;
}

.menu-footer {
  padding-top: 16px;
  border-top: 1px solid var(--border);
  text-align: center;
}

.menu-footer p {
  margin: 0;
  font-size: 12px;
  color: var(--text);
}

@media (max-width: 1024px) {
  .side-menu {
    width: 200px;
    padding: 16px 12px;
  }
  
  .menu-header {
    margin-bottom: 20px;
  }
  
  .menu-header h1 {
    font-size: 16px;
  }
}

@media (max-width: 768px) {
  .side-menu {
    width: 100%;
    height: auto;
    padding: 12px;
    position: relative;
    border-right: none;
    border-bottom: 1px solid var(--border);
  }
  
  .menu-header {
    display: none;
  }
  
  .menu-list {
    flex-direction: row;
    gap: 4px;
    flex-wrap: wrap;
  }
  
  .menu-item {
    padding: 8px 12px;
    font-size: 13px;
  }
}
</style>
