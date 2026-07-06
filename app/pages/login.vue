<script setup lang="ts">
definePageMeta({ layout: 'auth' })

const { login } = useAuth()
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const router = useRouter()

async function handleSubmit() {
  error.value = ''
  loading.value = true
  try {
    await login(email.value, password.value)
    router.push('/')
  } catch (err: any) {
    error.value = err?.data?.message || 'Login gagal. Periksa email dan password.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form class="login-card" @submit.prevent="handleSubmit">
    <h1>⛽ MyPertamina CMS</h1>
    <p class="subtitle">Masuk untuk mengelola konten dan harga BBM</p>

    <label>
      Email
      <input v-model="email" type="email" required autocomplete="email" />
    </label>
    <label>
      Password
      <input v-model="password" type="password" required autocomplete="current-password" />
    </label>

    <p v-if="error" class="error">{{ error }}</p>

    <button type="submit" :disabled="loading">{{ loading ? 'Memproses...' : 'Masuk' }}</button>
  </form>
</template>

<style scoped>
.login-card {
  background: #fff;
  padding: 2.5rem;
  border-radius: 1rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 360px;
}
h1 {
  margin: 0 0 0.25rem;
  font-size: 1.25rem;
  text-align: center;
}
.subtitle {
  margin: 0 0 1.5rem;
  text-align: center;
  color: #6b7280;
  font-size: 0.9rem;
}
label {
  display: block;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #374151;
}
input {
  width: 100%;
  margin-top: 0.35rem;
  padding: 0.6rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.95rem;
}
.error {
  color: #b91c1c;
  font-size: 0.85rem;
  margin: 0 0 1rem;
}
button {
  width: 100%;
  padding: 0.65rem;
  background: #b91c1c;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
}
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
