import { ref } from "vue";

// 創建認證狀態
const isLoggedIn = ref(localStorage.getItem("isLoggedIn") === "true");
const currentUser = ref(localStorage.getItem("currentUser") || null);

// 登入函數
export const login = (password) => {
  // 使用簡單的密碼驗證（可根據需要更改）
  const correctPassword = "2026IS2026"; // 預設密碼，可自定義

  if (password === correctPassword) {
    isLoggedIn.value = true;
    currentUser.value = "Guest User";
    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem("currentUser", "Guest User");
    return true;
  }
  return false;
};

// 登出函數
export const logout = () => {
  isLoggedIn.value = false;
  currentUser.value = null;
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("currentUser");
};

// 獲取登入狀態
export const getAuthState = () => ({
  isLoggedIn,
  currentUser,
});
