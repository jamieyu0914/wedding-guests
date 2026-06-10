<script setup>
</script>

<template>
  <div class="home-page">
    <div class="home-container">
      <h1 class="welcome-title">Welcome our Wedding</h1>
      <p class="welcome-subtitle">2026 Wedding</p>
      <div class="welcome-decoration">✨ 💍 ✨</div>
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
}

.welcome-title {
  font-size: 48px;
  font-weight: 700;
  margin: 0 0 16px 0;
  background: linear-gradient(135deg, var(--accent) 0%, rgba(192, 132, 252, 0.8) 100%);
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
  0%, 100% {
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
}
</style>
