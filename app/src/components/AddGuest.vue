<script setup>
import { ref } from "vue";
import { useGuests } from "../composables/useGuests";

const emit = defineEmits(["back"]);

const { addGuest } = useGuests();

const guestForm = ref({
  name: "",
  email: "",
  phoneLast3Code: "",
  mealPreference: "葷食",
  rsvpStatus: "等待確認",
  tableNumber: "",
  notes: "",
});

const guestLoading = ref(false);
const guestMessage = ref("");
const guestSuccess = ref(false);

function resetGuestForm() {
  guestForm.value = {
    name: "",
    email: "",
    phoneLast3Code: "",
    mealPreference: "葷食",
    rsvpStatus: "等待確認",
    tableNumber: "",
    notes: "",
  };
  guestMessage.value = "";
  guestSuccess.value = false;
}

const submitGuest = async () => {
  guestMessage.value = "";
  guestSuccess.value = false;

  if (!guestForm.value.name.trim()) {
    guestMessage.value = "請輸入姓名";
    return;
  }

  try {
    guestLoading.value = true;

    const result = await addGuest({
      name: guestForm.value.name.trim(),
      email: guestForm.value.email.trim(),
      phoneLast3Code: guestForm.value.phoneLast3Code.trim(),
      mealPreference: guestForm.value.mealPreference,
      rsvpStatus: guestForm.value.rsvpStatus,
      tableNumber: guestForm.value.tableNumber
        ? Number(guestForm.value.tableNumber)
        : null,
      notes: guestForm.value.notes.trim(),
    });

    if (result.success) {
      guestSuccess.value = true;
      guestMessage.value = "新增賓客成功";
      resetGuestForm();
    } else {
      guestSuccess.value = false;
      guestMessage.value = result.message || "新增失敗，請稍後再試";
    }
  } catch (err) {
    guestSuccess.value = false;
    guestMessage.value = "系統錯誤，請稍後再試";
  } finally {
    guestLoading.value = false;
  }
};
</script>

<template>
  <div class="card">
    <div class="card-header">
      <button class="back-btn" @click="emit('back')">‹ 返回</button>
      <h2>新增賓客</h2>
    </div>

    <div class="form-group">
      <label>姓名 *</label>
      <input
        id="name"
        v-model="guestForm.name"
        type="text"
        placeholder="請輸入姓名"
        required
      />
    </div>

    <div class="form-group">
      <label>Email</label>
      <input
        v-model="guestForm.email"
        type="email"
        placeholder="請輸入 Email"
      />
    </div>

    <div class="form-group">
      <label>手機末三碼</label>
      <input
        v-model="guestForm.phoneLast3Code"
        type="text"
        maxlength="3"
        placeholder="例如 123"
      />
    </div>

    <div class="form-group">
      <label>飲食偏好</label>
      <select v-model="guestForm.mealPreference">
        <option value="葷食">葷食</option>
        <option value="素食">素食</option>
      </select>
    </div>

    <div class="form-group">
      <label>出席狀態</label>
      <select v-model="guestForm.rsvpStatus">
        <option value="等待確認">等待確認</option>
        <option value="已出席">已出席</option>
        <option value="確認缺席">確認缺席</option>
      </select>
    </div>

    <div class="form-group">
      <label>桌號</label>
      <input
        v-model="guestForm.tableNumber"
        type="number"
        min="1"
        placeholder="請輸入桌號"
      />
    </div>

    <div class="form-group">
      <label>備註</label>
      <input v-model="guestForm.notes" type="text" placeholder="選填" />
    </div>

    <button class="save-btn" :disabled="guestLoading" @click="submitGuest">
      {{ guestLoading ? "新增中..." : "新增賓客" }}
    </button>

    <p
      v-if="guestMessage"
      :class="guestSuccess ? 'success-message' : 'error-message'"
    >
      {{ guestMessage }}
    </p>
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

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.card-header h2 {
  margin: 0;
}

.back-btn {
  background: none;
  border: 1px solid rgba(192, 132, 252, 0.4);
  border-radius: 8px;
  padding: 6px 12px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.back-btn:hover {
  border-color: var(--accent);
  background: rgba(192, 132, 252, 0.1);
}

.form-group {
  margin-bottom: 16px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

input,
select {
  width: 100%;
  padding: 12px;
  border: 1px solid rgba(192, 132, 252, 0.3);
  border-radius: 8px;
  box-sizing: border-box;
  background: rgba(192, 132, 252, 0.05);
  color: var(--text);
  font-size: 15px;
}

#name {
  color: purple;
}

input:focus,
select:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(192, 132, 252, 0.1);
}

.save-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(
    135deg,
    var(--accent) 0%,
    rgba(192, 132, 252, 0.8) 100%
  );
  color: white;
  cursor: pointer;
  font-size: 15px;
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.success-message {
  color: #22c55e;
  margin-top: 12px;
}

.error-message {
  color: #ef4444;
  margin-top: 12px;
}
</style>