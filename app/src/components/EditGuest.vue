<script setup>
import { ref, onMounted } from "vue";
import { useGuests } from "../composables/useGuests";

const props = defineProps({
  guestId: {
    type: [String, Number],
    required: true,
  },
});

const emit = defineEmits(["back"]);

const { fetchGuestById, updateGuest, deleteGuest, loading, error } =
  useGuests();

const form = ref({
  name: "",
  email: "",
  phone_last_3_code: "",
  meal_preference: "",
  rsvp_status: "",
  table_number: "",
  table_name: "",
  notes: "",
});

const saveSuccess = ref(false);
const saveError = ref("");
const showDeleteConfirm = ref(false);

onMounted(async () => {
  const guest = await fetchGuestById(props.guestId);
  if (guest) {
    form.value = {
      name: guest.name ?? "",
      email: guest.email ?? "",
      phone_last_3_code: guest.phone_last_3_code ?? "",
      meal_preference: guest.meal_preference ?? "",
      rsvp_status: guest.rsvp_status ?? "",
      table_number: guest.table_number ?? "",
      table_name: guest.table_name ?? "",
      notes: guest.notes ?? "",
    };
  }
});

async function handleSave() {
  saveSuccess.value = false;
  saveError.value = "";
  try {
    const response = await updateGuest(props.guestId, form.value);
    if (response.success) {
      saveSuccess.value = true;
      setTimeout(() => (saveSuccess.value = false), 3000);
    } else {
      saveError.value = response.error || "✗ 儲存失敗，請再試一次！";
    }
  } catch (e) {
    saveError.value = "✗ 儲存失敗，請再試一次！";
  }
}

async function handleDelete() {
  await deleteGuest(props.guestId);
  emit("back");
}

function goBack() {
  emit("back");
}
</script>

<template>
  <div class="edit-container">
    <div class="edit-header">
      <button class="back-btn" @click="goBack" aria-label="返回列表">
        ← 返回列表
      </button>
      <h1>編輯賓客</h1>
    </div>

    <p v-if="loading" class="loading-msg">載入中...</p>
    <p v-if="error" class="error-msg">{{ error }}</p>

    <form v-if="!loading" class="edit-form" @submit.prevent="handleSave">
      <div class="form-group">
        <label for="name">姓名</label>
        <input
          id="name"
          v-model="form.name"
          type="text"
          placeholder="請輸入姓名"
          required
        />
      </div>

      <div class="form-group">
        <label for="email">信箱</label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          placeholder="請輸入信箱"
        />
      </div>

      <div class="form-group">
        <label for="phone">手機後三碼</label>
        <input
          id="phone"
          v-model="form.phone_last_3_code"
          type="text"
          maxlength="3"
          placeholder="例：123"
        />
      </div>

      <div class="form-group">
        <label for="meal">餐點偏好</label>
        <select id="meal" v-model="form.meal_preference">
          <option value="">-- 請選擇 --</option>
          <option value="葷食">葷食</option>
          <option value="素食">素食</option>
        </select>
      </div>

      <div class="form-group">
        <label for="rsvp">出席狀態</label>
        <select id="rsvp" v-model="form.rsvp_status">
          <option value="">-- 請選擇 --</option>
          <option value="已出席">已出席</option>
          <option value="等待確認">等待確認</option>
          <option value="確認缺席">確認缺席</option>
        </select>
      </div>

      <div class="form-group">
        <label for="table_number">桌次</label>
        <input
          id="table_number"
          v-model="form.table_number"
          type="text"
          placeholder="例：A1"
        />
      </div>

      <div class="form-group">
        <label for="table_name">桌名</label>
        <input
          id="table_name"
          v-model="form.table_name"
          type="text"
          placeholder="例：玫瑰桌"
        />
      </div>

      <div class="form-group">
        <label for="notes">備註</label>
        <textarea
          id="notes"
          v-model="form.notes"
          rows="3"
          placeholder="任何備註..."
        ></textarea>
      </div>

      <p v-if="saveSuccess" class="success-msg">✓ 儲存成功！</p>
      <p v-if="saveError" class="error-msg">{{ saveError }}</p>

      <div class="form-actions">
        <button type="submit" class="btn-save" :disabled="loading">
          儲存變更
        </button>
        <button
          type="button"
          class="btn-delete"
          @click="showDeleteConfirm = true"
        >
          刪除賓客
        </button>
      </div>
    </form>

    <div v-if="showDeleteConfirm" class="modal-overlay">
      <div class="modal">
        <p>確定要刪除此賓客嗎？此操作無法復原。</p>
        <div class="modal-actions">
          <button class="btn-delete" @click="handleDelete">確定刪除</button>
          <button class="btn-cancel" @click="showDeleteConfirm = false">
            取消
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.edit-container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
}

.edit-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

h1 {
  color: var(--text-h);
  font-size: 1.8rem;
  margin: 0;
}

.back-btn {
  background: none;
  border: 2px solid var(--border);
  border-radius: 8px;
  padding: 0.4rem 0.9rem;
  cursor: pointer;
  color: var(--text);
  font-size: 0.9rem;
  transition: all 0.2s ease;
  white-space: nowrap;
}
.back-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.loading-msg {
  color: var(--text);
  text-align: center;
}
.error-msg {
  color: #ff6b6b;
  margin-bottom: 1rem;
}
.success-msg {
  color: #22c55e;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.edit-form {
  background: var(--code-bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  box-shadow: var(--shadow);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-group label {
  font-weight: 600;
  color: #9f54e5;
  font-size: 0.9rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.65rem 0.9rem;
  font-size: 1rem;
  border: 2px solid var(--border);
  border-radius: 8px;
  background: var(--bg);
  color: var(--text-h);
  transition: border-color 0.2s ease;
  font-family: inherit;
  resize: vertical;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #9f54e5;
  box-shadow: 0 0 0 3px rgba(159, 84, 229, 0.15);
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: var(--text);
  opacity: 0.6;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.btn-save {
  flex: 1;
  padding: 0.65rem 1.2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  background: rgba(168, 85, 247, 0.2);
  color: #9f54e5;
  transition: background 0.2s;
}
.btn-save:hover:not(:disabled) {
  background: rgba(168, 85, 247, 0.35);
}
.btn-save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-delete {
  padding: 0.65rem 1.2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  background: rgba(255, 107, 107, 0.15);
  color: #ff6b6b;
  transition: background 0.2s;
}
.btn-delete:hover {
  background: rgba(255, 107, 107, 0.3);
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal {
  background: var(--code-bg);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 2rem;
  max-width: 360px;
  width: 90%;
  text-align: center;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.modal p {
  color: var(--text-h);
  margin-bottom: 1.5rem;
  font-size: 1rem;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
}

.btn-cancel {
  padding: 0.6rem 1.2rem;
  border: 2px solid var(--border);
  border-radius: 8px;
  background: none;
  cursor: pointer;
  color: var(--text);
  font-size: 0.95rem;
  transition: all 0.2s;
}
.btn-cancel:hover {
  border-color: var(--accent);
  color: var(--accent);
}

@media (max-width: 768px) {
  .edit-container {
    padding: 1rem;
  }
  h1 {
    font-size: 1.4rem;
  }
  .edit-form {
    padding: 1.25rem;
  }
  .form-actions {
    flex-direction: column;
  }
}
</style>
