<template>
  <div class="max-w-3xl animate-fade-in selection:bg-parentPrimary/10 selection:text-parentPrimary px-3 md:px-0">
    <div class="mb-8">
      <h1 class="text-2xl font-bold text-gray-900 mb-1">My Profile</h1>
      <p class="text-sm text-gray-500">Manage your personal information and preferences.</p>
    </div>

    <!-- Main Profile Card -->
    <div class="bg-white rounded-3xl border border-gray-50 shadow-sm overflow-hidden mb-8">
      <!-- Header / Avatar Area -->
      <div class="p-5 border-b border-gray-50 flex flex-col md:flex-row items-center gap-8">
        <div class="relative group cursor-pointer" @click="triggerFileInput">
          <img v-if="formData.avatar" :src="formData.avatar" class="w-24 h-24 rounded-full object-cover shadow-sm border border-gray-50" alt="Avatar" />
          <div v-else class="w-24 h-24 rounded-full bg-gray-900 text-white flex items-center justify-center text-3xl font-bold uppercase shadow-sm border border-gray-50">
            {{ userInitials }}
          </div>
          <div class="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Camera class="w-6 h-6 text-white" />
          </div>
          <button type="button" class="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full border border-gray-25 shadow-sm flex items-center justify-center text-gray-600 hover:text-parentPrimary transition-colors z-10">
            <Loader2 v-if="uploading" class="w-4 h-4 animate-spin" />
            <Camera v-else class="w-4 h-4" />
          </button>
          <input 
            type="file" 
            ref="fileInput" 
            accept="image/*" 
            class="hidden" 
            @change="handleFileUpload"
          />
        </div>
        <div class="text-center md:text-left flex-1">
          <h2 class="text-xl font-bold text-gray-900">{{ fullName }}</h2>
          <p class="text-gray-500 mt-1">{{ user?.email }}</p>
        </div>
        <div>
          <button 
            @click="handleSave"
            :disabled="saving"
            class="px-4 py-2.5 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Loader2 v-if="saving" class="w-4 h-4 animate-spin" />
            <span>{{ saving ? 'Saving...' : 'Save Changes' }}</span>
          </button>
        </div>
      </div>

      <!-- Form Area -->
      <div class="p-5">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="text-sm font-bold text-gray-700">First name</label>
            <input 
              type="text" 
              v-model="formData.firstName"
              class="w-full px-4 py-3 bg-gray-50 border border-gray-25 rounded-xl focus:bg-white focus:border-parentPrimary focus:ring-4 focus:ring-parentPrimary/10 transition-all text-base outline-none"
            >
          </div>
          
          <div class="space-y-2">
            <label class="text-sm font-bold text-gray-700">Last name</label>
            <input 
              type="text" 
              v-model="formData.lastName"
              class="w-full px-4 py-3 bg-gray-50 border border-gray-25 rounded-xl focus:bg-white focus:border-parentPrimary focus:ring-4 focus:ring-parentPrimary/10 transition-all text-base outline-none"
            >
          </div>

          <div class="space-y-2">
            <label class="text-sm font-bold text-gray-700">Mobile number</label>
            <input 
              type="tel" 
              v-model="formData.phone"
              placeholder="+234"
              class="w-full px-4 py-3 bg-gray-50 border border-gray-25 rounded-xl focus:bg-white focus:border-parentPrimary focus:ring-4 focus:ring-parentPrimary/10 transition-all text-base outline-none"
            >
          </div>

          <div class="space-y-2">
            <label class="text-sm font-bold text-gray-700">Email</label>
            <input 
              type="email" 
              :value="user?.email"
              readonly
              class="w-full px-4 py-3 bg-gray-100 border border-gray-25 rounded-xl text-gray-500 text-base outline-none cursor-not-allowed"
            >
          </div>

          <div class="space-y-2">
            <label class="text-sm font-bold text-gray-700">Date of birth</label>
            <input 
              type="date" 
              v-model="formData.dateOfBirth"
              class="w-full px-4 py-3 bg-gray-50 border border-gray-25 rounded-xl focus:bg-white focus:border-parentPrimary focus:ring-4 focus:ring-parentPrimary/10 transition-all text-base outline-none"
            >
          </div>

          <div class="space-y-2">
            <label class="text-sm font-bold text-gray-700">Gender</label>
            <select 
              v-model="formData.gender"
              class="w-full px-4 py-3 bg-gray-50 border border-gray-25 rounded-xl focus:bg-white focus:border-parentPrimary focus:ring-4 focus:ring-parentPrimary/10 transition-all text-base outline-none appearance-none"
            >
              <option value="" disabled>Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Prefer not to say</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Addresses Section -->
    <div class="bg-white rounded-3xl border border-gray-50 shadow-sm overflow-hidden mb-8">
      <div class="p-4 border-b border-gray-50 flex items-center justify-between">
        <div>
          <h2 class="text-lg font-bold text-gray-900">My addresses</h2>
          <p class="text-sm text-gray-500 mt-0.5">Manage your saved locations</p>
        </div>
        <button class="w-10 h-10 rounded-xl bg-gray-50 border border-gray-50 flex items-center justify-center text-gray-900 hover:bg-gray-100 transition-colors">
          <Plus class="w-5 h-5" />
        </button>
      </div>
      
      <div class="p-4">
        <div class="flex flex-col gap-3">
          <label class="text-sm font-bold text-gray-700">Home Address</label>
          <div class="flex items-center gap-4 p-4 border border-gray-50 rounded-2xl hover:border-parentPrimary/30 transition-colors group relative bg-white">
            <div class="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-parentPrimary transition-colors shrink-0">
              <Home class="w-5 h-5" />
            </div>
            <div class="flex-1">
              <input 
                type="text" 
                v-model="formData.homeAddress"
                placeholder="Add a home address"
                class="w-full bg-transparent outline-none text-base font-bold text-gray-900 placeholder:text-gray-500 placeholder:font-normal"
              />
            </div>
          </div>
        </div>

        <div class="flex flex-col gap-3 mt-6">
          <label class="text-sm font-bold text-gray-700">Work Address</label>
          <div class="flex items-center gap-4 p-4 border border-gray-50 rounded-2xl hover:border-parentPrimary/30 transition-colors group relative bg-white">
            <div class="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 group-hover:text-parentPrimary transition-colors shrink-0">
              <Briefcase class="w-5 h-5" />
            </div>
            <div class="flex-1">
              <input 
                type="text" 
                v-model="formData.workAddress"
                placeholder="Add a work address"
                class="w-full bg-transparent outline-none text-base font-bold text-gray-900 placeholder:text-gray-500 placeholder:font-normal"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useUser } from '@/composables/modules/auth/user';
import { Camera, Plus, Home, Briefcase, ChevronRight, Loader2 } from 'lucide-vue-next';
import { users_api } from '@/api_factory/modules/users';
import { upload_api } from '@/api_factory/modules/upload';
import { useCustomToast } from '@/composables/core/useCustomToast';

const { user, fullName, setUser } = useUser();
const { showToast } = useCustomToast();

definePageMeta({
  layout: 'student',
});

useHead({ title: 'My Profile - Errandr' });

const userInitials = computed(() => {
  if (!user.value) return 'S';
  const first = user.value.firstName || '';
  const last = user.value.lastName || '';
  return (first[0] || last[0] || user.value.email?.[0] || 'S').toUpperCase();
});

const fileInput = ref<HTMLInputElement | null>(null);
const uploading = ref(false);
const saving = ref(false);

const formData = reactive({
  firstName: '',
  lastName: '',
  phone: '',
  dateOfBirth: '',
  gender: '',
  homeAddress: '',
  workAddress: '',
  avatar: ''
});

onMounted(() => {
  if (user.value) {
    formData.firstName = user.value.firstName || '';
    formData.lastName = user.value.lastName || '';
    formData.phone = user.value.phone || user.value.phoneNumber || '';
    formData.avatar = user.value.avatar || '';
    formData.gender = user.value.gender || '';
    formData.homeAddress = user.value.homeAddress || '';
    formData.workAddress = user.value.workAddress || '';
    
    if (user.value.dateOfBirth) {
      // Format to YYYY-MM-DD for the date input
      const date = new Date(user.value.dateOfBirth);
      if (!isNaN(date.getTime())) {
        formData.dateOfBirth = date.toISOString().split('T')[0];
      }
    }
  }
});

const triggerFileInput = () => {
  fileInput.value?.click();
};

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  uploading.value = true;
  try {
    const res = await upload_api.uploadFile(file, 'image');
    formData.avatar = res.data?.url || res.data?.secure_url || res.data;
    showToast({
      title: 'Success',
      message: 'Avatar uploaded successfully. Don\'t forget to save changes!',
      toastType: 'success'
    });
  } catch (err: any) {
    showToast({
      title: 'Error',
      message: err.response?.data?.message || 'Failed to upload avatar',
      toastType: 'error'
    });
  } finally {
    uploading.value = false;
    if (target) target.value = ''; // Reset input
  }
};

const handleSave = async () => {
  saving.value = true;
  try {
    // Only send the dob if it's set, otherwise omit it to prevent invalid date errors
    const payload = { ...formData };
    if (!payload.dateOfBirth) delete payload.dateOfBirth;

    const res = await users_api.updateProfile(payload);
    
    // Update local user state
    setUser(res.data?.user || res.data);
    
    showToast({
      title: 'Profile Updated',
      message: 'Your personal information has been saved successfully.',
      toastType: 'success'
    });
  } catch (err: any) {
    showToast({
      title: 'Update Failed',
      message: err.response?.data?.message || 'Failed to update profile',
      toastType: 'error'
    });
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
