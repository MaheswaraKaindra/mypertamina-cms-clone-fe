<script setup lang="ts">
const { data: rolesRes, refresh } = await useApi<{ data: any[] }>('/roles')
const { data: permissionsRes } = await useApi<{ data: any[] }>('/roles/permissions')

const showForm = ref(false)
const editingId = ref<number | null>(null)
const error = ref('')
const form = reactive({ name: '', description: '', permissionIds: [] as number[] })

function resetForm() {
  form.name = ''
  form.description = ''
  form.permissionIds = []
}

function openCreate() {
  editingId.value = null
  resetForm()
  showForm.value = true
}

function openEdit(role: any) {
  editingId.value = role.id
  form.name = role.name
  form.description = role.description ?? ''
  const idsByCode = new Map((permissionsRes.value?.data ?? []).map((p: any) => [p.code, p.id]))
  form.permissionIds = role.permissions.map((code: string) => idsByCode.get(code)).filter(Boolean)
  showForm.value = true
}

async function handleSubmit() {
  error.value = ''
  try {
    if (editingId.value) {
      await apiFetch(`/roles/${editingId.value}`, { method: 'PUT', body: form })
    } else {
      await apiFetch('/roles', { method: 'POST', body: form })
    }
    showForm.value = false
    await refresh()
  } catch (err: any) {
    error.value = err?.data?.message || 'Gagal menyimpan role'
  }
}

async function handleDelete(id: number) {
  if (!confirm('Hapus role ini?')) return
  try {
    await apiFetch(`/roles/${id}`, { method: 'DELETE' })
    await refresh()
  } catch (err: any) {
    alert(err?.data?.message || 'Gagal menghapus role')
  }
}
</script>

<template>
  <div>
    <div class="page-header">
      <h1>Role &amp; Permission</h1>
      <button @click="openCreate">+ Tambah Role</button>
    </div>
    <p class="hint">Role bebas ditambahkan sesuai kebutuhan &mdash; centang permission yang boleh diakses role tersebut.</p>

    <table class="data-table">
      <thead>
        <tr>
          <th>Role</th>
          <th>Permission</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="role in rolesRes?.data ?? []" :key="role.id">
          <td>{{ role.name }}</td>
          <td>
            <span v-for="code in role.permissions" :key="code" class="badge">{{ code }}</span>
            <span v-if="!role.permissions.length" class="muted">Belum ada permission</span>
          </td>
          <td class="actions">
            <button class="link" @click="openEdit(role)">Ubah</button>
            <button class="link danger" @click="handleDelete(role.id)">Hapus</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="showForm" class="modal-backdrop" @click.self="showForm = false">
      <form class="modal" @submit.prevent="handleSubmit">
        <h2>{{ editingId ? 'Ubah Role' : 'Tambah Role' }}</h2>
        <label>
          Nama Role
          <input v-model="form.name" required placeholder="mis. Marketing Staff" />
        </label>
        <label>
          Deskripsi
          <input v-model="form.description" />
        </label>
        <label>
          Permission
          <div class="checkbox-list">
            <label v-for="perm in permissionsRes?.data ?? []" :key="perm.id">
              <input type="checkbox" :value="perm.id" v-model="form.permissionIds" />
              {{ perm.code }} <span class="muted">&mdash; {{ perm.description }}</span>
            </label>
          </div>
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
  margin-bottom: 0.5rem;
}
.hint {
  color: #6b7280;
  font-size: 0.85rem;
  margin: 0 0 1.5rem;
}
.muted {
  color: #9ca3af;
  font-size: 0.8rem;
}
</style>
