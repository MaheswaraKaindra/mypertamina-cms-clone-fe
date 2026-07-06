<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

const { hasPermission } = useAuth()
const { data: pricesRes, refresh } = await useApi<{ data: any[] }>('/prices')

const showForm = ref(false)
const editingId = ref<number | null>(null)
const form = reactive({ province: '', fuelType: '', price: 0, unit: 'liter' })
const error = ref('')

// State untuk pencarian teks dan filter dropdown
const searchQuery = ref('')
const selectedFuelType = ref('') // State baru untuk filter jenis BBM

// Mengambil daftar jenis BBM unik secara otomatis dari data API
const fuelTypesList = computed(() => {
  if (!pricesRes.value?.data) return []
  const types = pricesRes.value.data.map((item: any) => item.fuel_type)
  return [...new Set(types)].sort() // Menghilangkan duplikat dan mengurutkan sesuai abjad
})

// Logika filter gabungan (Pencarian Teks + Dropdown Jenis BBM)
const filteredPrices = computed(() => {
  if (!pricesRes.value?.data) return []

  return pricesRes.value.data.filter((item: any) => {
    const query = searchQuery.value.toLowerCase().trim()
    
    // Cek kecocokan teks pencarian (provinsi atau nama BBM)
    const matchSearch = query === '' || 
      item.province.toLowerCase().includes(query) ||
      item.fuel_type.toLowerCase().includes(query)
      
    // Cek kecocokan opsi dropdown jenis BBM
    const matchFuelType = selectedFuelType.value === '' || item.fuel_type === selectedFuelType.value

    // Baris akan ditampilkan jika lolos kedua filter (Teks & Dropdown)
    return matchSearch && matchFuelType
  })
})

const provincesList = [
  'Aceh', 'Sumatera Utara', 'Sumatera Barat', 'Riau', 'Kepulauan Riau', 'Jambi',
  'Sumatera Selatan', 'Bengkulu', 'Lampung', 'Kepulauan Bangka Belitung',
  'DKI Jakarta', 'Jawa Barat', 'Jawa Tengah', 'DI Yogyakarta', 'Jawa Timur', 'Banten',
  'Bali', 'Nusa Tenggara Barat', 'Nusa Tenggara Timur', 'Kalimantan Barat',
  'Kalimantan Tengah', 'Kalimantan Selatan', 'Kalimantan Timur', 'Kalimantan Utara',
  'Sulawesi Utara', 'Sulawesi Tengah', 'Sulawesi Selatan', 'Sulawesi Tenggara',
  'Gorontalo', 'Sulawesi Barat', 'Maluku', 'Maluku Utara', 'Papua', 'Papua Barat',
  'Papua Selatan', 'Papua Tengah', 'Papua Pegunungan', 'Papua Barat Daya'
]

function openCreate() {
  editingId.value = null
  form.province = ''
  form.fuelType = ''
  form.price = 0
  form.unit = 'liter'
  showForm.value = true
}

function openEdit(item: any) {
  editingId.value = item.id
  form.province = item.province
  form.fuelType = item.fuel_type
  form.price = item.price
  form.unit = item.unit
  showForm.value = true
}

async function handleSubmit() {
  error.value = ''
  try {
    if (editingId.value) {
      await apiFetch(`/prices/${editingId.value}`, { method: 'PUT', body: { price: form.price, unit: form.unit } })
    } else {
      await apiFetch('/prices', { method: 'POST', body: form })
    }
    showForm.value = false
    await refresh()
  } catch (err: any) {
    error.value = err?.data?.message || 'Gagal menyimpan harga BBM'
  }
}

async function handleDelete(id: number) {
  if (!confirm('Hapus jenis BBM ini?')) return
  await apiFetch(`/prices/${id}`, { method: 'DELETE' })
  await refresh()
}

function formatRupiah(value: number) {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value)
}
</script>

<template>
  <div>
    <div class="page-header">
      <h1>Harga BBM</h1>
      
      <div class="header-actions">
        <select v-model="selectedFuelType" class="filter-select">
          <option value="">Semua Jenis BBM</option>
          <option v-for="type in fuelTypesList" :key="type" :value="type">
            {{ type }}
          </option>
        </select>

        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Cari provinsi atau BBM..." 
          class="search-input"
        />
        <button v-if="hasPermission('price.update')" @click="openCreate">+ Tambah Jenis BBM</button>
      </div>
    </div>

    <table class="data-table">
      <thead>
        <tr>
          <th>Provinsi</th>
          <th>Jenis BBM</th>
          <th>Harga</th>
          <th>Satuan</th>
          <th>Diperbarui</th>
          <th v-if="hasPermission('price.update')"></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in filteredPrices" :key="item.id">
          <td>{{ item.province }}</td>
          <td>{{ item.fuel_type }}</td>
          <td>{{ formatRupiah(item.price) }}</td>
          <td>{{ item.unit }}</td>
          <td>{{ new Date(item.updated_at).toLocaleString('id-ID') }}</td>
          <td v-if="hasPermission('price.update')" class="actions">
            <button class="link" @click="openEdit(item)">Ubah</button>
            <button class="link danger" @click="handleDelete(item.id)">Hapus</button>
          </td>
        </tr>
        
        <tr v-if="filteredPrices.length === 0">
          <td colspan="6" class="empty-search">Data tidak ditemukan.</td>
        </tr>
      </tbody>
    </table>

    <div v-if="showForm" class="modal-backdrop" @click.self="showForm = false">
      <form class="modal" @submit.prevent="handleSubmit">
        <h2>{{ editingId ? 'Ubah Harga' : 'Tambah Jenis BBM' }}</h2>
        
        <label>
          Provinsi
          <select v-model="form.province" required :disabled="!!editingId">
            <option value="" disabled>Pilih Provinsi</option>
            <option v-for="prov in provincesList" :key="prov" :value="prov">
              {{ prov }}
            </option>
          </select>
        </label>

        <label>
          Jenis BBM
          <input v-model="form.fuelType" required :disabled="!!editingId" placeholder="Cth: Pertamax" />
        </label>
        
        <label>
          Harga (Rp)
          <input v-model.number="form.price" type="number" min="0" required />
        </label>
        
        <label>
          Satuan
          <input v-model="form.unit" required />
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
.header-actions {
  display: flex;
  gap: 15px;
  align-items: center;
}
.search-input {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  min-width: 250px;
  font-size: 14px;
}
.filter-select {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  background-color: #fff;
  cursor: pointer;
}
.empty-search {
  text-align: center;
  padding: 2rem;
  color: #666;
  font-style: italic;
}
.modal select {
  width: 100%;
  padding: 8px;
  margin-top: 4px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.modal select:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}
</style>