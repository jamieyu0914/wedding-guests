<script setup>
import { ref } from "vue";
import { supabase } from "../lib/supabase.js";
import { getAuthState } from "../stores/auth.js";

const emit = defineEmits(["back"]);

const { currentUser } = getAuthState();

const passwordForm = ref({
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const passwordLoading = ref(false);
const passwordMessage = ref("");
const passwordSuccess = ref(false);

const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

const changePassword = async () => {
  passwordMessage.value = "";
  passwordSuccess.value = false;

  if (
    !passwordForm.value.currentPassword ||
    !passwordForm.value.newPassword ||
    !passwordForm.value.confirmPassword
  ) {
    passwordMessage.value = "請填寫所有欄位";
    return;
  }

  if (passwordForm.value.newPassword.length < 8) {
    passwordMessage.value = "新密碼至少 8 個字元";
    return;
  }

  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    passwordMessage.value = "確認密碼不一致";
    return;
  }

  try {
    passwordLoading.value = true;

    // 先用目前密碼重新驗證身份
    const email = currentUser.value?.email;
    if (!email) {
      passwordMessage.value = "無法取得使用者資訊，請重新登入";
      return;
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password: passwordForm.value.currentPassword,
    });

    if (signInError) {
      passwordMessage.value = "目前密碼錯誤，請重試";
      return;
    }

    // 驗證成功後更新密碼
    const { error: updateError } = await supabase.auth.updateUser({
      password: passwordForm.value.newPassword,
    });

    if (updateError) {
      passwordMessage.value = updateError.message;
      return;
    }

    passwordSuccess.value = true;
    passwordMessage.value = "密碼修改成功";
    passwordForm.value = {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    };
  } catch (err) {
    passwordMessage.value = "系統錯誤，請稍後再試";
  } finally {
    passwordLoading.value = false;
  }
};
</script>

<template>
  <div class="card">
    <div class="card-header">
      <button class="back-btn" @click="emit('back')">‹ 返回</button>
      <h2>變更密碼</h2>
    </div>

    <div class="form-group">
      <label>目前密碼</label>
      <div class="input-group">
        <input
          v-model="passwordForm.currentPassword"
          :type="showCurrentPassword ? 'text' : 'password'"
          placeholder="請輸入目前密碼"
        />
        <button
          type="button"
          class="toggle-password-btn"
          @click="showCurrentPassword = !showCurrentPassword"
          :title="showCurrentPassword ? '隱藏密碼' : '顯示密碼'"
        >
          <i :class="showCurrentPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
        </button>
      </div>
    </div>

    <div class="form-group">
      <label>新密碼</label>
      <div class="input-group">
        <input
          v-model="passwordForm.newPassword"
          :type="showNewPassword ? 'text' : 'password'"
          placeholder="至少 8 個字元"
        />
        <button
          type="button"
          class="toggle-password-btn"
          @click="showNewPassword = !showNewPassword"
          :title="showNewPassword ? '隱藏密碼' : '顯示密碼'"
        >
          <i :class="showNewPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
        </button>
      </div>
    </div>

    <div class="form-group">
      <label>確認新密碼</label>
      <div class="input-group">
        <input
          v-model="passwordForm.confirmPassword"
          :type="showConfirmPassword ? 'text' : 'password'"
          placeholder="再次輸入新密碼"
        />
        <button
          type="button"
          class="toggle-password-btn"
          @click="showConfirmPassword = !showConfirmPassword"
          :title="showConfirmPassword ? '隱藏密碼' : '顯示密碼'"
        >
          <i :class="showConfirmPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
        </button>
      </div>
    </div>

    <button
      class="save-btn"
      :disabled="passwordLoading"
      @click="changePassword"
    >
      {{ passwordLoading ? "更新中..." : "更新密碼" }}
    </button>

    <p
      v-if="passwordMessage"
      :class="passwordSuccess ? 'success-message' : 'error-message'"
    >
      {{ passwordMessage }}
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

input {
  width: 100%;
  padding: 12px;
  border: 1px solid rgba(192, 132, 252, 0.3);
  border-radius: 8px;
  box-sizing: border-box;
  background: rgba(192, 132, 252, 0.05);
  color: var(--text);
  font-size: 15px;
}

.input-group {
  display: flex;
  gap: 8px;
}

.input-group input {
  flex: 1;
}

.toggle-password-btn {
  padding: 12px 16px;
  border: 1px solid rgba(192, 132, 252, 0.4);
  border-radius: 8px;
  background: rgba(192, 132, 252, 0.05);
  cursor: pointer;
  font-size: 18px;
  color: var(--text);
  transition: all 0.3s ease;
}

.toggle-password-btn:hover {
  border-color: var(--accent);
  background: rgba(192, 132, 252, 0.1);
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
  background: rgba(168, 85, 247, 0.2);
  color: #9f54e5;
  cursor: pointer;
  font-size: 15px;
  transition: background 0.2s;

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