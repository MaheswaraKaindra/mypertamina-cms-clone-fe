<script setup lang="ts">
const { data: usersRes, refresh } = await useApi<{ data: any[] }>('/users')
const { data: rolesRes } = await useApi<{ data: any[] }>('/roles')

const showForm = ref(false)
const editingId = ref<number | null>(null)
const error = ref('')
const form = reactive({ name: '', email: '', password: '', roleId: '', isActive: true })

function resetForm() {
  form.name = ''
  form.email = ''
  form.password = ''
  form.roleId = rolesRes.value?.data?.[0]?.id ?? ''
  form.isActive = true
}

function openCreate() {
  editingId.value = null
  resetForm()
  showForm.value = true
}

function openEdit(item: any) {
  editingId.value = item.id
  form.name = item.name
  form.email = item.email
  form.password = ''
  form.roleId = item.role_id
  form.isActive = !!item.is_active
  showForm.value = true
}

async function handleSubmit() {
  error.value = ''
  try {
    if (editingId.value) {
      await apiFetch(`/users/${editingId.value}`, {
        method: 'PUT',
        body: { name: form.name, email: form.email, roleId: form.roleId, isActive: form.isActive },
      })
    } else {
      await apiFetch('/users', { method: 'POST', body: form })
    }
    showForm.value = false
    await refresh()
  } catch (err: any) {
    error.value = err?.data?.message || 'Gagal menyimpan pengguna'
  }
}

async function handleDelete(id: number) {
  if (!confirm('Hapus pengguna ini?')) return
  try {
    await apiFetch(`/users/${id}`, { method: 'DELETE' })
    await refresh()
  } catch (err: any) {
    alert(err?.data?.message || 'Gagal menghapus pengguna')
  }
}
</script>

<template>
  <div>
    <div class="page-header">
      <h1>Pengguna</h1>
      <button @click="openCreate">+ Tambah Pengguna</button>
    </div>

    <table class="data-table">
      <thead>
        <tr>
          <th>Nama</th>
          <th>Email</th>
          <th>Role</th>
          <th>Status</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in usersRes?.data ?? []" :key="item.id">
          <td>{{ item.name }}</td>
          <td>{{ item.email }}</td>
          <td><span class="badge">{{ item.role_name }}</span></td>
          <td>{{ item.is_active ? 'Aktif' : 'Nonaktif' }}</td>
          <td class="actions">
            <button class="link" @click="openEdit(item)">Ubah</button>
            <button class="link danger" @click="handleDelete(item.id)">Hapus</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="showForm" class="modal-backdrop" @click.self="showForm = false">
      <form class="modal" @submit.prevent="handleSubmit">
        <h2>{{ editingId ? 'Ubah Pengguna' : 'Tambah Pengguna' }}</h2>
        <label>
          Nama
          <input v-model="form.name" required />
        </label>
        <label>
          Email
          <input v-model="form.email" type="email" required />
        </label>
        <label v-if="!editingId">
          Password
          <input v-model="form.password" type="password" required minlength="6" />
        </label>
        <label>
          Role
          <select v-model="form.roleId" required>
            <option v-for="role in rolesRes?.data ?? []" :key="role.id" :value="role.id">{{ role.name }}</option>
          </select>
        </label>
        <label v-if="editingId">
          <input v-model="form.isActive" type="checkbox" style="width: auto; display: inline-block" />
          Aktif
        </label>
        <p v-if="error" class="error">{{ error }}</p>
        <div class="modal-actions">
          <button type="button" class="secondary" @click="showForm = false">Batal</button>
          <button type="submit">Simpan</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}
</style>
