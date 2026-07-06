<script setup lang="ts">
const { user } = useAuth()
</script>

<template>
  <div>
    <div class="page-header">
      <h1>Dashboard CMS</h1>
      <p class="welcome-text">Selamat datang kembali, {{ user?.name || 'Admin' }}!</p>
    </div>

    <div class="dashboard-grid">
      <NuxtLink to="/prices" class="dashboard-card">
        <div class="card-icon">⛽</div>
        <h3>Harga BBM</h3>
        <p>Kelola dan perbarui harga BBM berdasarkan provinsi secara real-time.</p>
      </NuxtLink>

      <NuxtLink to="/contents" class="dashboard-card">
        <div class="card-icon">📰</div>
        <h3>Konten & Promo</h3>
        <p>Atur banner, berita, dan program promosi yang tampil di halaman utama.</p>
      </NuxtLink>

      <NuxtLink to="/users" class="dashboard-card">
        <div class="card-icon">👥</div>
        <h3>Pengguna</h3>
        <p>Kelola akses admin, peran (roles), dan izin (permissions) sistem CMS.</p>
      </NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.page-header {
  margin-bottom: 2rem;
}
.welcome-text {
  color: #6b7280;
  margin-top: 0.5rem;
}
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}
.dashboard-card {
  display: block;
  padding: 1.5rem;
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 0.75rem;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
}
.dashboard-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border-color: #3b82f6;
}
.card-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}
.dashboard-card h3 {
  margin: 0 0 0.5rem 0;
  color: #111827;
}
.dashboard-card p {
  margin: 0;
  color: #6b7280;
  font-size: 0.9rem;
  line-height: 1.4;
}
</style>