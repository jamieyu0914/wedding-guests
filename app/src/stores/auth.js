import { ref } from "vue";
import { supabase } from "../lib/supabase";

// 創建認證狀態
// const isLoggedIn = ref(localStorage.getItem("isLoggedIn") === "true");
// const currentUser = ref(localStorage.getItem("currentUser") || null);

const isLoggedIn = ref(localStorage.getItem("isLoggedIn") === "true");
const currentUser = ref(localStorage.getItem("currentUser") || null);

// 登入函數
export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return { success: false, message: "帳號或密碼錯誤，請重試" };

  isLoggedIn.value = true;
  currentUser.value = data.user;
  return { success: true };
}

// 登出函數
export async function logout() {
  await supabase.auth.signOut();
  isLoggedIn.value = false;
  currentUser.value = null;
}

export function getAuthState() {
  return { isLoggedIn, currentUser };
}

// 頁面重整後恢復登入狀態
export async function initAuth() {
  const { data } = await supabase.auth.getSession();
  if (data.session) {
    isLoggedIn.value = true;
    currentUser.value = data.session.user;
  }
}
