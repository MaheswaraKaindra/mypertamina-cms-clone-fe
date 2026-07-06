<script setup>
import { ref } from 'vue';

const formData = ref({
  uiType: '', // Diganti jadi uiType untuk menampung input gabungan
  title: '',
  slug: '',
  description: '',
  bodyHtml: '',
  isActive: true,
  startDate: '',
  endDate: ''
});

const selectedFile = ref(null);
const isLoading = ref(false);
const message = ref('');
const isError = ref(false);

const handleFileChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
  }
};

const submitForm = async () => {
  isLoading.value = true;
  message.value = '';
  isError.value = false;

  try {
    const dataToSend = new FormData();
    
    // MAGIC TRICK: Terjemahkan uiType untuk Backend
    let actualType = 'promo';
    let actualCategory = '';
    
    if (['banner', 'berita'].includes(formData.value.uiType)) {
      actualType = formData.value.uiType;
    } else {
      actualCategory = formData.value.uiType;
    }

    // Masukkan data ke FormData
    dataToSend.append('type', actualType);
    dataToSend.append('category', actualCategory);
    dataToSend.append('title', formData.value.title);
    dataToSend.append('slug', formData.value.slug);
    dataToSend.append('description', formData.value.description);
    dataToSend.append('bodyHtml', formData.value.bodyHtml);
    dataToSend.append('isActive', formData.value.isActive);
    
    if (formData.value.startDate) dataToSend.append('startDate', formData.value.startDate);
    if (formData.value.endDate) dataToSend.append('endDate', formData.value.endDate);

    if (selectedFile.value) {
      dataToSend.append('image', selectedFile.value);
    }

    const token = localStorage.getItem('token') || '';

    const response = await $fetch('http://localhost:3001/api/contents', {
      method: 'POST',
      body: dataToSend,
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    message.value = 'Konten berhasil disimpan!';
  } catch (error) {
    console.error("Error submit:", error);
    isError.value = true;
    message.value = error.data?.message || 'Gagal menyimpan konten. Coba lagi.';
  } finally {
    isLoading.value = false;
  }
};
</script>