<script setup lang="ts">
const { user, logout, hasPermission } = useAuth()
const router = useRouter()

function handleLogout() {
  logout()
  router.push('/login')
}

const nav = [
  { to: '/', label: 'Dashboard', permission: null },
  { to: '/prices', label: 'Harga BBM', permission: 'price.view' },
  { to: '/contents', label: 'Konten', permission: 'content.view' },
  { to: '/users', label: 'Pengguna', permission: 'user.manage' },
  { to: '/roles', label: 'Role & Permission', permission: 'role.manage' },
]
</script>

<template>
  <div class="shell">
    <aside class="sidebar">
      <div class="brand">⛽ MyPertamina <span>CMS</span></div>
      <nav>
        <template v-for="item in nav" :key="item.to">
          <NuxtLink v-if="!item.permission || hasPermission(item.permission)" :to="item.to">
            {{ item.label }}
          </NuxtLink>
        </template>
      </nav>
      <div class="user-box">
        <p class="user-name">{{ user?.name }}</p>
        <p class="user-role">{{ user?.role }}</p>
        <button @click="handleLogout">Keluar</button>
      </div>
    </aside>
    <main class="content">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.shell {
  display: flex;
  min-height: 100vh;
}
.sidebar {
  width: 240px;
  background: #111827;
  color: #f9fafb;
  display: flex;
  flex-direction: column;
  padding: 1.5rem 1rem;
}
.brand {
  font-weight: 700;
  margin-bottom: 2rem;
}
.brand span {
  font-weight: 400;
  color: #9ca3af;
}
nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}
nav a {
  color: #d1d5db;
  text-decoration: none;
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
}
nav a:hover,
nav a.router-link-exact-active {
  background: #1f2937;
  color: #fff;
}
.user-box {
  border-top: 1px solid #1f2937;
  padding-top: 1rem;
}
.user-name {
  margin: 0;
  font-weight: 600;
}
.user-role {
  margin: 0 0 0.75rem;
  font-size: 0.8rem;
  color: #9ca3af;
}
.user-box button {
  width: 100%;
  padding: 0.5rem;
  background: #b91c1c;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
}
.content {
  flex: 1;
  padding: 2rem;
}
</style>
