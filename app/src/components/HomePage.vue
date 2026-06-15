<script setup>
import { ref } from "vue";
import { login, logout, getAuthState } from "../stores/auth.js";

const { isLoggedIn, currentUser } = getAuthState();
const email = ref("");
const password = ref("");
const errorMessage = ref("");
const showPassword = ref(false);

const handleLogin = async () => {
  errorMessage.value = "";
  if (!email.value.trim()) {
    errorMessage.value = "請輸入帳號";
    return;
  }
  if (!password.value.trim()) {
    errorMessage.value = "請輸入密碼";
    return;
  }

  // if (login(password.value)) {
  //   password.value = "";
  // } else {
  //   errorMessage.value = "密碼錯誤，請重試";
  //   password.value = "";
  // }
  const result = await login(email.value, password.value);
  if (result.success) {
    email.value = "";
    password.value = "";
  } else {
    errorMessage.value = result.message;
  }
};

const handleLogout = () => {
  logout();
};

const handleKeyPress = (event) => {
  if (event.key === "Enter") {
    handleLogin();
  }
};
</script>

<template>
  <div class="home-page">
    <div class="home-container">
      <!-- 未登入狀態 - 登入表單 -->
      <div v-if="!isLoggedIn" class="login-form-wrapper">
        <h1 class="welcome-title">Welcome our Wedding</h1>
        <p class="welcome-subtitle">2026 Wedding</p>
        <div class="welcome-decoration">✨ 💍 ✨</div>

        <div class="login-form">
          <h2 class="login-title">請輸入帳號、密碼以繼續</h2>

          <div class="input-group">
            <input
              v-model="email"
              type="text"
              class="account-input"
              placeholder="輸入帳號"
              @keypress="handleKeyPress"
            />
          </div>

          <div class="input-group">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="password-input"
              placeholder="輸入密碼"
              @keypress="handleKeyPress"
            />
            <button
              class="toggle-password-btn"
              @click="showPassword = !showPassword"
              :title="showPassword ? '顯示密碼' : '隱藏密碼'"
            >
              <i :class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
            </button>
          </div>

          <div v-if="errorMessage" class="error-message">
            {{ errorMessage }}
          </div>

          <button class="login-button" @click="handleLogin">登入</button>

          <p class="login-hint">提示：密碼是 2026</p>
        </div>
      </div>

      <!-- 已登入狀態 - 歡迎頁面 -->
      <div v-if="isLoggedIn" class="welcome-wrapper">
        <h1 class="welcome-title">Welcome our Wedding</h1>
        <p class="welcome-subtitle">2026 Wedding</p>
        <div class="welcome-decoration">✨ 💍 ✨</div>
        <p class="user-greeting">Let's enjoy the wedding together !</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 32px;
  margin-bottom: 40px;
}

.home-container {
  text-align: center;
  animation: fadeIn 0.8s ease-in;
  width: 100%;
  max-width: 500px;
}

.welcome-title {
  font-size: 48px;
  font-weight: 700;
  margin: 0 0 16px 0;
  background: linear-gradient(
    135deg,
    var(--accent) 0%,
    rgba(192, 132, 252, 0.8) 100%
  );
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
}

.welcome-subtitle {
  font-size: 20px;
  color: var(--text);
  margin: 0 0 32px 0;
  font-weight: 300;
}

.welcome-decoration {
  font-size: 48px;
  letter-spacing: 8px;
  animation: float 3s ease-in-out infinite;
  margin-bottom: 32px;
}

/* 登入表單樣式 */
.login-form-wrapper {
  width: 100%;
}

.login-form {
  margin-top: 40px;
  padding: 32px;
  border: 1px solid rgba(192, 132, 252, 0.3);
  border-radius: 12px;
  background: rgba(192, 132, 252, 0.05);
  backdrop-filter: blur(10px);
}

.login-title {
  font-size: 18px;
  margin: 0 0 24px 0;
  color: var(--text);
  font-weight: 600;
}

.input-group {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.account-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid rgba(192, 132, 252, 0.4);
  border-radius: 8px;
  background: var(--bg-secondary);
  color: var(--text);
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.password-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid rgba(192, 132, 252, 0.4);
  border-radius: 8px;
  background: var(--bg-secondary);
  color: var(--text);
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.password-input:focus {
  outline: none;
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(192, 132, 252, 0.1);
}

.toggle-password-btn {
  padding: 12px 16px;
  border: 1px solid rgba(192, 132, 252, 0.4);
  border-radius: 8px;
  background: var(--bg-secondary);
  cursor: pointer;
  font-size: 18px;
  transition: all 0.3s ease;
}

.toggle-password-btn:hover {
  border-color: var(--accent);
  background: rgba(192, 132, 252, 0.1);
}

.error-message {
  color: #ef4444;
  font-size: 14px;
  margin-bottom: 16px;
  padding: 8px 12px;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 6px;
  border-left: 3px solid #ef4444;
}

.login-button {
  width: 100%;
  padding: 12px 24px;
  background: linear-gradient(
    135deg,
    var(--accent) 0%,
    rgba(192, 132, 252, 0.8) 100%
  );
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.login-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(192, 132, 252, 0.3);
}

.login-button:active {
  transform: translateY(0);
}

.login-hint {
  font-size: 12px;
  color: rgba(var(--text-rgb), 0.5);
  margin-top: 16px;
  margin-bottom: 0;
}

/* 歡迎頁面樣式 */
.welcome-wrapper {
  width: 100%;
}

.user-info {
  margin-top: 40px;
  padding: 32px;
  border: 1px solid rgba(192, 132, 252, 0.3);
  border-radius: 12px;
  background: rgba(192, 132, 252, 0.05);
}

.user-greeting {
  font-size: 18px;
  color: var(--text);
  margin-bottom: 16px;
  font-weight: 500;
}

.logout-button {
  padding: 10px 24px;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: 1px solid #ef4444;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-button:hover {
  background: #ef4444;
  color: white;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
}

@media (max-width: 768px) {
  .home-page {
    min-height: auto;
    padding: 20px;
  }

  .welcome-title {
    font-size: 32px;
  }

  .welcome-subtitle {
    font-size: 16px;
  }

  .welcome-decoration {
    font-size: 36px;
    letter-spacing: 4px;
  }

  .login-form {
    padding: 24px;
  }

  .input-group {
    flex-direction: column;
  }

  .toggle-password-btn {
    width: 100%;
  }
}
</style>
