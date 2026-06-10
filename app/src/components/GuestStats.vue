<script setup>
import { ref, computed, watch } from "vue";
import { guestsData } from "../data/guests.js";

const guests = ref([...guestsData]);
const TOTAL_TABLES = 27;

// 計算統計數據
const stats = computed(() => {
  const attended = guests.value.filter((g) => g.rsvpStatus === "已出席").length;
  const notAttended = guests.value.filter(
    (g) => g.rsvpStatus === "確認缺席",
  ).length;
  const vegetarian = guests.value.filter(
    (g) => g.mealPreference === "素食" && g.rsvpStatus === "已出席",
  ).length;
  const meatEater = guests.value.filter(
    (g) => g.mealPreference === "葷食" && g.rsvpStatus === "已出席",
  ).length;

  return {
    attended,
    notAttended,
    vegetarian,
    meatEater,
    total: guests.value.length,
    pending: guests.value.filter((g) => g.rsvpStatus === "等待確認").length,
  };
});

// 計算每桌的人數
const tableStats = computed(() => {
  const tables = {};

  // 初始化桌次
  for (let i = 1; i <= TOTAL_TABLES; i++) {
    tables[i] = {
      table: i,
      count: 0,
      guests: [],
    };
  }

  // 統計已出席的客人
  guests.value.forEach((guest) => {
    if (guest.table && guest.rsvpStatus === "已出席") {
      if (tables[guest.table]) {
        tables[guest.table].count += 1;
        tables[guest.table].guests.push(guest.name);
      }
    }
  });

  return Object.values(tables);
});

// 監聽數據變化
watch(
  () => guestsData,
  (newData) => {
    guests.value = [...newData];
  },
  { deep: true },
);
</script>

<template>
  <div class="guest-stats">
    <div class="stats-container">
      <h1 class="stats-title">即時統計</h1>

      <!-- 統計卡片網格 -->
      <div class="stats-grid">
        <!-- 已出席人數卡片 -->
        <div class="stat-card attended">
          <div class="stat-icon">✓</div>
          <div class="stat-content">
            <p class="stat-label">出席人數</p>
            <p class="stat-number">{{ stats.attended }}</p>
            <p class="stat-sublabel">人</p>
          </div>
        </div>

        <div class="stats-stack">
          <!-- 待確認人數卡片 -->
          <div class="stat-card pending">
            <div class="stat-icon">⏳</div>
            <div class="stat-content">
              <p class="stat-label">待確認人數</p>
              <p class="stat-number">{{ stats.pending }}</p>
              <p class="stat-sublabel">人</p>
            </div>
          </div>

          <!-- 未到人數卡片 -->
          <div class="stat-card not-attended">
            <div class="stat-icon">✗</div>
            <div class="stat-content">
              <p class="stat-label">缺席人數</p>
              <p class="stat-number">{{ stats.notAttended }}</p>
              <p class="stat-sublabel">人</p>
            </div>
          </div>
        </div>

        <!-- 分隔線 -->
        <hr class="divider" />

        <!-- 素食人數卡片 -->
        <div class="stat-card vegetarian">
          <div class="stat-icon">🥗</div>
          <div class="stat-content">
            <p class="stat-label">素食人數</p>
            <p class="stat-number">{{ stats.vegetarian }}</p>
            <p class="stat-sublabel">人</p>
          </div>
        </div>

        <!-- 葷食人數卡片 -->
        <div class="stat-card meat-eater">
          <div class="stat-icon">🍖</div>
          <div class="stat-content">
            <p class="stat-label">葷食人數</p>
            <p class="stat-number">{{ stats.meatEater }}</p>
            <p class="stat-sublabel">人</p>
          </div>
        </div>
      </div>

      <!-- 分隔線 -->
      <hr class="divider" />

      <!-- 進度條 -->
      <div class="progress-section">
        <div class="progress-header">
          <h2 class="progress-title">出席比例</h2>
          <span class="progress-percentage"
            >{{ Math.round((stats.attended / stats.total) * 100) }}%</span
          >
        </div>
        <div class="progress-bar">
          <div
            class="progress-fill attended-fill"
            :style="{ width: (stats.attended / stats.total) * 100 + '%' }"
          ></div>
          <div
            class="progress-fill pending-fill"
            :style="{ width: (stats.pending / stats.total) * 100 + '%' }"
          ></div>
          <div
            class="progress-fill not-attended-fill"
            :style="{ width: (stats.notAttended / stats.total) * 100 + '%' }"
          ></div>
        </div>
        <div class="progress-legend">
          <div class="legend-item">
            <span class="legend-color attended"></span>
            <span class="legend-label">已出席 ({{ stats.attended }})</span>
          </div>
          <div class="legend-item">
            <span class="legend-color pending"></span>
            <span class="legend-label">等待確認 ({{ stats.pending }})</span>
          </div>
          <div class="legend-item">
            <span class="legend-color not-attended"></span>
            <span class="legend-label">確認缺席 ({{ stats.notAttended }})</span>
          </div>
        </div>
      </div>

      <!-- 飲食比例 -->
      <div class="meal-section">
        <h2 class="meal-title">飲食偏好分布（已出席）</h2>
        <div class="meal-chart">
          <div class="meal-bar">
            <div class="meal-segment vegetarian">
              <span class="meal-percentage" v-if="stats.attended > 0">
                {{ Math.round((stats.vegetarian / stats.attended) * 100) }}%
              </span>
            </div>
            <div class="meal-segment meat-eater">
              <span class="meal-percentage" v-if="stats.attended > 0">
                {{ Math.round((stats.meatEater / stats.attended) * 100) }}%
              </span>
            </div>
          </div>
          <div class="meal-legend">
            <div class="meal-item">
              <span class="meal-color vegetarian"></span>
              <span class="meal-label">素食 ({{ stats.vegetarian }})</span>
            </div>
            <div class="meal-item">
              <span class="meal-color meat-eater"></span>
              <span class="meal-label">葷食 ({{ stats.meatEater }})</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 桌次分布 -->
      <div class="tables-section">
        <h2 class="tables-title">{{ TOTAL_TABLES }}桌 - 每桌人數（已出席）</h2>
        <div class="tables-grid">
          <div
            v-for="table in tableStats"
            :key="table.table"
            class="table-card"
            :class="{ 'has-guests': table.count > 0 }"
          >
            <div class="table-number">第{{ table.table }}桌</div>
            <div class="table-count">{{ table.count }}</div>
            <div class="table-label">人</div>
            <div v-if="table.count > 0" class="table-guests-tooltip">
              {{ table.guests.join(", ") }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.guest-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 32px;
  background: var(--bg);
}

.stats-container {
  width: 100%;
  max-width: 1000px;
  animation: fadeIn 0.8s ease-in;
}

.stats-title {
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 32px 0;
  line-height: 1.4;
  background: linear-gradient(
    135deg,
    var(--accent) 0%,
    rgba(192, 132, 252, 0.8) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* 統計卡片網格 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.stats-stack {
  display: grid;
  gap: 16px;
}

.stat-card {
  display: flex;
  align-items: center;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid rgba(192, 132, 252, 0.3);
  background: rgba(192, 132, 252, 0.05);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  gap: 16px;
}

.stat-card:hover {
  transform: translateY(-4px);
  border-color: var(--accent);
  background: rgba(192, 132, 252, 0.1);
  box-shadow: 0 8px 24px rgba(192, 132, 252, 0.2);
}

.stat-icon {
  font-size: 32px;
  min-width: 48px;
  text-align: center;
}

.stat-card.attended .stat-icon {
  color: #8b5cf6;
}

.stat-card.not-attended .stat-icon {
  color: #ef4444;
}

.stat-card.vegetarian .stat-icon {
  color: #8b5cf6;
}

.stat-card.meat-eater .stat-icon {
  color: #f59e0b;
}

.stat-card.pending .stat-icon {
  color: #f59e0b;
}

.stat-content {
  flex: 1;
  text-align: left;
}

.stat-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 8px 0;
  font-weight: 500;
}

.stat-number {
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 4px 0;
  color: var(--text);
}

.stat-sublabel {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  margin: 0;
}

/* 額外統計信息 */
.additional-stats {
  margin-bottom: 40px;
}

.info-box {
  padding: 24px;
  border-radius: 12px;
  border: 1px solid rgba(192, 132, 252, 0.3);
  background: rgba(192, 132, 252, 0.05);
  backdrop-filter: blur(10px);
}

.info-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: var(--text);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--text);
}

.info-value.pending {
  color: #f59e0b;
}

/* 分隔線 */
.divider {
  grid-column: 1 / -1;
  border: none;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(192, 132, 252, 0.5),
    transparent
  );
  margin: 32px 0;
}

/* 出席比例進度條 */
.progress-section {
  margin-bottom: 40px;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid rgba(192, 132, 252, 0.3);
  background: rgba(192, 132, 252, 0.05);
  backdrop-filter: blur(10px);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.progress-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  color: var(--text);
}

.progress-percentage {
  font-size: 18px;
  font-weight: 600;
  color: var(--accent);
}

.progress-bar {
  display: flex;
  height: 32px;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 16px;
  border: 1px solid rgba(192, 132, 252, 0.3);
}

.progress-fill {
  transition: width 0.6s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
}

.attended-fill {
  background: linear-gradient(90deg, #8b5cf6 0%, #7c3aed 100%);
}

.not-attended-fill {
  background: linear-gradient(90deg, #ef4444 0%, #dc2626 100%);
}

.pending-fill {
  background: linear-gradient(90deg, #ca9d6e 0%, #b8935a 100%);
}

.progress-legend {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.legend-color.attended {
  background: #8b5cf6;
}

.legend-color.not-attended {
  background: #ef4444;
}

.legend-color.pending {
  background: #d4a574;
}

.legend-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

/* 飲食比例 */
.meal-section {
  padding: 24px;
  border-radius: 12px;
  border: 1px solid rgba(192, 132, 252, 0.3);
  background: rgba(192, 132, 252, 0.05);
  backdrop-filter: blur(10px);
}

.meal-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: var(--text);
}

.meal-chart {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.meal-bar {
  display: flex;
  height: 40px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(192, 132, 252, 0.3);
}

.meal-segment {
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  transition: flex 0.6s ease;
  min-width: 0;
}

.meal-segment.vegetarian {
  background: linear-gradient(90deg, #22c55e 0%, #16a34a 100%);
}

.meal-segment.meat-eater {
  background: linear-gradient(90deg, #d4a574 0%, #b8935a 100%);
}

.meal-percentage {
  font-size: 14px;
  white-space: nowrap;
  padding: 0 8px;
}

.meal-legend {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.meal-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.meal-color {
  width: 16px;
  height: 16px;
  border-radius: 4px;
}

.meal-color.vegetarian {
  background: #22c55e;
}

.meal-color.meat-eater {
  background: #d4a574;
}

.meal-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

/* 桌次分布 */
.tables-section {
  margin-top: 40px;
  padding: 24px;
  border-radius: 12px;
  border: 1px solid rgba(192, 132, 252, 0.3);
  background: rgba(192, 132, 252, 0.05);
  backdrop-filter: blur(10px);
}

.tables-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 16px 0;
  color: var(--text);
}

.tables-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
}

.table-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid rgba(192, 132, 252, 0.2);
  background: rgba(192, 132, 252, 0.03);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  min-height: 100px;
}

.table-card:hover {
  border-color: var(--accent);
  background: rgba(192, 132, 252, 0.08);
  transform: translateY(-2px);
}

.table-card.has-guests {
  background: rgba(192, 132, 252, 0.15);
  border-color: var(--accent);
  box-shadow: 0 4px 12px rgba(192, 132, 252, 0.15);
}

.table-card.has-guests:hover {
  box-shadow: 0 6px 16px rgba(192, 132, 252, 0.25);
}

.table-number {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.table-count {
  font-size: 32px;
  font-weight: 700;
  color: var(--accent);
  line-height: 1;
  margin-bottom: 4px;
}

.table-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 500;
}

.table-guests-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.9);
  color: rgba(255, 255, 255, 0.9);
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 11px;
  white-space: normal;
  max-width: 200px;
  margin-bottom: 8px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
  z-index: 10;
  text-align: center;
  line-height: 1.3;
}

.table-card.has-guests:hover .table-guests-tooltip {
  opacity: 1;
  pointer-events: auto;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .stats-container {
    padding: 16px;
  }

  .stats-title {
    font-size: 28px;
    margin-bottom: 24px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: 16px;
    margin-bottom: 32px;
  }

  .stat-card {
    flex-direction: column;
    text-align: center;
  }

  .stat-content {
    text-align: center;
  }

  .progress-legend {
    grid-template-columns: 1fr;
  }

  .meal-legend {
    flex-direction: column;
  }
}
</style>
