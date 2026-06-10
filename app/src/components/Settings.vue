<script setup>
import { ref } from "vue";

const form = ref({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const loading = ref(false);
const message = ref("");
const success = ref(false);

const changePassword = async () => {
  message.value = "";
  success.value = false;

  if (
    !form.value.currentPassword ||
    !form.value.newPassword ||
    !form.value.confirmPassword
  ) {
    message.value = "請填寫所有欄位";
    return;
  }

  if (form.value.newPassword.length < 8) {
    message.value = "新密碼至少 8 個字元";
    return;
  }

  if (form.value.newPassword !== form.value.confirmPassword) {
    message.value = "確認密碼不一致";
    return;
  }

  // try {
  //   loading.value = true;

  //   const response = await fetch("/api/change-password", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     credentials: "include",
  //     body: JSON.stringify({
  //       currentPassword: form.value.currentPassword,
  //       newPassword: form.value.newPassword,
  //     }),
  //   });

  //   const result = await response.json();

  //   if (result.success) {
  //     success.value = true;
  //     message.value = "密碼修改成功";

  //     form.value = {
  //       currentPassword: "",
  //       newPassword: "",
  //       confirmPassword: "",
  //     };
  //   } else {
  //     message.value = result.message;
  //   }
  // } catch (error) {
  //   message.value = "系統錯誤";
  // } finally {
  //   loading.value = false;
  // }
};
</script>

<template>
  <div class="settings-container">
    <div class="card">
      <h2>變更密碼</h2>

      <div class="form-group">
        <label>目前密碼</label>
        <input
          v-model="form.currentPassword"
          type="password"
          placeholder="請輸入目前密碼"
        />
      </div>

      <div class="form-group">
        <label>新密碼</label>
        <input
          v-model="form.newPassword"
          type="password"
          placeholder="至少 8 個字元"
        />
      </div>

      <div class="form-group">
        <label>確認新密碼</label>
        <input
          v-model="form.confirmPassword"
          type="password"
          placeholder="再次輸入新密碼"
        />
      </div>

      <button class="save-btn" :disabled="loading" @click="changePassword">
        {{ loading ? "更新中..." : "更新密碼" }}
      </button>

      <p v-if="message" :class="success ? 'success-message' : 'error-message'">
        {{ message }}
      </p>
    </div>
  </div>
</template>

<style scoped>
.settings-container {
  padding: 24px;
}

.card {
  max-width: 500px;
  background: white;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid rgba(192, 132, 252, 0.3);
  border-radius: 12px;
  background: rgba(192, 132, 252, 0.05);
  backdrop-filter: blur(10px);
}

h2 {
  margin-top: 0;
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 16px;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid rgba(192, 132, 252, 0.3);
  border-radius: 8px;
  box-sizing: border-box;
  background: rgba(192, 132, 252, 0.05);
}

input:focus {
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
