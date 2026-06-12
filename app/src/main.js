import { createApp } from "vue";
import { initAuth } from "./stores/auth";
import "./style.css";
import App from "./App.vue";

const app = createApp(App);
initAuth();
app.mount("#app");
