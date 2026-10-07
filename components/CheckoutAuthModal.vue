<template>
  <Transition name="fade">
    <div v-if="modelValue" class="fixed inset-0 z-[150] flex items-center justify-center sm:p-4">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" @click="$emit('update:modelValue', false)"></div>
      
      <!-- Modal Content -->
      <div class="relative bg-white w-full h-full sm:h-auto sm:max-w-md sm:rounded-[2rem] sm:border sm:border-gray-100 flex flex-col animate-zoom-in">
        <!-- Close Button -->
        <button 
          @click="$emit('update:modelValue', false)"
          class="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-full transition-all z-10"
        >
          <X class="w-6 h-6 sm:w-5 sm:h-5" />
        </button>

        <div class="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <!-- Header -->
          <div class="text-center mb-6">
            <div class="w-12 h-12 bg-parentPrimary/10 text-parentPrimary rounded-xl flex items-center justify-center mx-auto mb-4">
              <UserCheck v-if="view === 'login'" class="w-6 h-6" />
              <UserPlus v-else-if="view === 'register'" class="w-6 h-6" />
              <User v-else-if="view === 'guest'" class="w-6 h-6" />
              <ShieldCheck v-else-if="['verify', 'verify_reset'].includes(view)" class="w-6 h-6" />
              <KeyRound v-else-if="['forgot', 'reset'].includes(view)" class="w-6 h-6" />
              <Store v-else class="w-6 h-6" />
            </div>
            <h2 class="text-xl font-bold text-gray-900 tracking-tight leading-none mb-2">
              {{ view === 'options' ? 'Checkout' : view === 'login' ? 'Welcome Back!' : view === 'register' ? 'Join Errandr' : view === 'guest' ? 'Guest Checkout' : view === 'forgot' ? 'Reset Password' : view === 'verify_reset' ? 'Enter Code' : view === 'reset' ? 'New Password' : 'Verify Email' }}
            </h2>
            <p class="text-sm font-medium text-gray-500 leading-relaxed px-2">
              {{ view === 'options' ? 'How would you like to continue?' : view === 'login' ? 'Sign in to continue your checkout.' : view === 'register' ? 'Create an account to track your orders!' : view === 'guest' ? 'Enter details to continue as guest.' : view === 'forgot' ? 'Enter email for a reset code.' : view === 'verify_reset' ? `Code sent to ${forgotEmail}.` : view === 'reset' ? 'Choose a strong password.' : 'Enter the code sent to your email.' }}
            </p>
          </div>

          <!-- Back Button for inner flows -->
          <div v-if="view !== 'options' && view !== 'verify'" class="mb-4 text-left">
            <button 
              type="button" 
              @click="view = 'options'" 
              class="inline-flex items-center gap-1.5 text-sm font-bold text-gray-400 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft class="w-3 h-3" />
              <span>Back</span>
            </button>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="mb-4 p-3 bg-rose-50 rounded-xl flex items-start gap-2">
            <AlertCircle class="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
            <p class="text-[11px] font-bold text-rose-600 text-left">{{ error }}</p>
          </div>

          <!-- Initial Options View -->
          <div v-if="view === 'options'" class="space-y-3">
            <button type="button" @click="handleGoogleAuth" :disabled="googleLoading || loading" class="w-full py-4 border border-gray-50 rounded-2xl flex items-center justify-center gap-3 font-bold text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              <Loader2 v-if="googleLoading" class="animate-spin w-5 h-5" />
              <svg v-else class="w-5 h-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {{ googleLoading ? 'Connecting...' : 'Continue with Google' }}
            </button>
            <div class="relative py-2 flex items-center justify-center">
              <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-gray-100"></div></div>
              <span class="relative bg-white px-3 text-[10px] font-bold text-gray-400 uppercase ">or</span>
            </div>
            <button 
              @click="view = 'login'" 
              class="w-full py-3.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-all flex items-center justify-center gap-2"
            >
              Sign In to Account
            </button>
            <button 
              @click="view = 'register'" 
              class="w-full py-3.5 bg-gray-50 text-gray-900 border border-gray-50 hover:border-gray-200 hover:bg-gray-100 rounded-xl text-sm font-bold transition-all"
            >
              Create New Account
            </button>
            <!-- <div class="relative py-2 flex items-center justify-center">
              <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-gray-100"></div></div>
              <span class="relative bg-white px-3 text-[10px] font-bold text-gray-400 uppercase ">or</span>
            </div>
            <button 
              @click="view = 'guest'" 
              class="w-full py-3 bg-white text-gray-600 border border-gray-25 hover:border-gray-300 rounded-xl text-sm font-bold transition-all"
            >
              Continue as Guest
            </button> -->
          </div>

          <!-- Forms -->
          <form v-else @submit.prevent="handleSubmit" class="space-y-4">
            <!-- Login View -->
            <template v-if="view === 'login'">
              <div class="space-y-3">
                <button type="button" @click="handleGoogleAuth" :disabled="googleLoading || loading" class="w-full py-4 border border-gray-50 rounded-2xl flex items-center justify-center gap-3 font-bold text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-2">
                  <Loader2 v-if="googleLoading" class="animate-spin w-5 h-5" />
                  <svg v-else class="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  {{ googleLoading ? 'Connecting...' : 'Sign in with Google' }}
                </button>
                <div class="relative py-2 flex items-center justify-center mb-2">
                  <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-gray-100"></div></div>
                  <span class="relative bg-white px-3 text-[10px] font-bold text-gray-400 uppercase ">or sign in with email</span>
                </div>
                <input v-model="loginForm.email" type="email" placeholder="Email Address" required class="w-full px-4 py-3.5 bg-gray-50 rounded-xl text-base font-bold text-gray-900 outline-none focus:ring-2 focus:ring-parentPrimary/20 transition-all placeholder:text-gray-400" />
                <div class="relative">
                  <input v-model="loginForm.password" :type="showLoginPassword ? 'text' : 'password'" placeholder="Password" required class="w-full pl-4 pr-10 py-3.5 bg-gray-50 rounded-xl text-base font-bold text-gray-900 outline-none focus:ring-2 focus:ring-parentPrimary/20 transition-all placeholder:text-gray-400" />
                  <button type="button" @click="showLoginPassword = !showLoginPassword" class="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-900 transition-colors">
                    <Eye v-if="!showLoginPassword" class="w-4 h-4" />
                    <EyeOff v-else class="w-4 h-4" />
                  </button>
                </div>
                <div class="text-right">
                  <button type="button" @click="view = 'forgot'" class="text-sm font-bold text-parentPrimary hover:underline">Forgot Password?</button>
                </div>
              </div>
            </template>

            <!-- Guest View -->
            <template v-else-if="view === 'guest'">
              <div class="grid grid-cols-2 gap-3">
                <input v-model="guestForm.firstName" type="text" placeholder="First Name" required class="w-full px-4 py-3.5 bg-gray-50 rounded-xl text-base font-bold text-gray-900 outline-none focus:ring-2 focus:ring-parentPrimary/20 transition-all placeholder:text-gray-400" />
                <input v-model="guestForm.lastName" type="text" placeholder="Last Name" required class="w-full px-4 py-3.5 bg-gray-50 rounded-xl text-base font-bold text-gray-900 outline-none focus:ring-2 focus:ring-parentPrimary/20 transition-all placeholder:text-gray-400" />
              </div>
              <input v-model="guestForm.email" type="email" placeholder="Email Address" required class="w-full px-4 py-3.5 bg-gray-50 rounded-xl text-base font-bold text-gray-900 outline-none focus:ring-2 focus:ring-parentPrimary/20 transition-all placeholder:text-gray-400" />
              <input v-model="guestForm.phone" type="tel" placeholder="Phone Number" required class="w-full px-4 py-3.5 bg-gray-50 rounded-xl text-base font-bold text-gray-900 outline-none focus:ring-2 focus:ring-parentPrimary/20 transition-all placeholder:text-gray-400" />
            </template>

            <!-- Register View -->
            <template v-else-if="view === 'register'">
              <div class="space-y-3">
                <button type="button" @click="handleGoogleAuth" :disabled="googleLoading || loading" class="w-full py-4 border border-gray-50 rounded-2xl flex items-center justify-center gap-3 font-bold text-gray-700 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed mb-2">
                  <Loader2 v-if="googleLoading" class="animate-spin w-5 h-5" />
                  <svg v-else class="w-5 h-5" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  {{ googleLoading ? 'Connecting...' : 'Sign up with Google' }}
                </button>
                <div class="relative py-2 flex items-center justify-center mb-2">
                  <div class="absolute inset-0 flex items-center"><div class="w-full border-t border-gray-100"></div></div>
                  <span class="relative bg-white px-3 text-[10px] font-bold text-gray-400 uppercase ">or sign up with email</span>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-3 mt-3">
                <input v-model="registerForm.firstName" type="text" placeholder="First Name" required class="w-full px-4 py-3.5 bg-gray-50 rounded-xl text-base font-bold text-gray-900 outline-none focus:ring-2 focus:ring-parentPrimary/20 transition-all placeholder:text-gray-400" />
                <input v-model="registerForm.lastName" type="text" placeholder="Last Name" required class="w-full px-4 py-3.5 bg-gray-50 rounded-xl text-base font-bold text-gray-900 outline-none focus:ring-2 focus:ring-parentPrimary/20 transition-all placeholder:text-gray-400" />
              </div>
              <input v-model="registerForm.email" type="email" placeholder="Email Address" required class="w-full px-4 py-3.5 bg-gray-50 rounded-xl text-base font-bold text-gray-900 outline-none focus:ring-2 focus:ring-parentPrimary/20 transition-all placeholder:text-gray-400" />
              <div class="relative">
                <input v-model="registerForm.password" :type="showRegisterPassword ? 'text' : 'password'" placeholder="Create password" required class="w-full pl-4 pr-10 py-3.5 bg-gray-50 rounded-xl text-base font-bold text-gray-900 outline-none focus:ring-2 focus:ring-parentPrimary/20 transition-all placeholder:text-gray-400" />
                <button type="button" @click="showRegisterPassword = !showRegisterPassword" class="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-900 transition-colors">
                  <Eye v-if="!showRegisterPassword" class="w-4 h-4" />
                  <EyeOff v-else class="w-4 h-4" />
                </button>
              </div>
            </template>

            <!-- Forgot Password View -->
            <template v-else-if="view === 'forgot'">
              <input v-model="forgotEmail" type="email" placeholder="Email Address" required class="w-full px-4 py-3.5 bg-gray-50 rounded-xl text-base font-bold text-gray-900 outline-none focus:ring-2 focus:ring-parentPrimary/20 transition-all placeholder:text-gray-400" />
            </template>

            <!-- Verify OTP Views -->
            <template v-else-if="view === 'verify_reset' || view === 'verify'">
              <div class="space-y-4">
                <div class="flex justify-center gap-2">
                  <input v-for="i in 6" :key="i" :id="'otp-input-'+i" v-model="(view === 'verify_reset' ? resetOtpDigits : otpDigits)[i-1]" type="text" maxlength="1" @input="handleOtpInput($event, i)" @keydown.delete="handleOtpBackspace($event, i)" class="w-10 h-12 text-center text-lg font-bold bg-gray-50 rounded-xl outline-none focus:ring-2 focus:ring-parentPrimary/20 transition-all" />
                </div>
                <div class="text-center pt-2">
                  <button type="button" @click="handleResend" :disabled="resendLoading || resendTimer > 0" class="text-sm font-bold text-parentPrimary hover:underline disabled:text-gray-300">
                    {{ resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend Code' }}
                  </button>
                </div>
              </div>
            </template>

            <!-- Reset Password -->
            <template v-else-if="view === 'reset'">
              <div class="space-y-3">
                <div class="relative">
                  <input v-model="resetForm.password" :type="showResetPassword ? 'text' : 'password'" placeholder="New password" required class="w-full pl-4 pr-10 py-3.5 bg-gray-50 rounded-xl text-base font-bold text-gray-900 outline-none focus:ring-2 focus:ring-parentPrimary/20 transition-all" />
                  <button type="button" @click="showResetPassword = !showResetPassword" class="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400">
                    <Eye v-if="!showResetPassword" class="w-4 h-4" />
                    <EyeOff v-else class="w-4 h-4" />
                  </button>
                </div>
                <div class="relative">
                  <input v-model="resetForm.confirmPassword" :type="showConfirmPassword ? 'text' : 'password'" placeholder="Confirm new password" required class="w-full pl-4 pr-10 py-3.5 bg-gray-50 rounded-xl text-base font-bold text-gray-900 outline-none focus:ring-2 focus:ring-parentPrimary/20 transition-all" />
                  <button type="button" @click="showConfirmPassword = !showConfirmPassword" class="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400">
                    <Eye v-if="!showConfirmPassword" class="w-4 h-4" />
                    <EyeOff v-else class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </template>

            <!-- Submit Button -->
            <div class="pt-2">
              <button type="submit" :disabled="loading" class="w-full py-3 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                <template v-if="loading">
                  <Loader2 class="w-4 h-4 animate-spin text-white" />
                  <span>Processing...</span>
                </template>
                <template v-else>
                  <span>{{ view === 'login' ? 'Sign In' : view === 'register' ? 'Create Account' : view === 'guest' ? 'Continue' : view === 'forgot' ? 'Send Code' : view === 'verify_reset' ? 'Verify Code' : view === 'reset' ? 'Update Password' : 'Verify & Continue' }}</span>
                </template>
              </button>
            </div>
          </form>

          <p v-if="view === 'options'" class="mt-6 text-center text-sm font-bold text-gray-400">
            By continuing, you agree to Errandr's <span class="text-gray-900 hover:underline cursor-pointer">Terms</span> & <span class="text-gray-900 hover:underline cursor-pointer">Privacy</span>
          </p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue';
import { X, UserCheck, UserPlus, ShieldCheck, ArrowRight, Loader2, AlertCircle, KeyRound, ArrowLeft, Eye, EyeOff, User, Store } from 'lucide-vue-next';
import { useAuth } from '@/composables/modules/auth';
import { auth_api } from '@/api_factory/modules/auth';
import { useCustomToast } from '@/composables/core/useCustomToast';

const props = defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits(['update:modelValue', 'authenticated', 'guest-checkout']);

const { login, register, verifyOTP, firebaseLogin } = useAuth();
const { showToast } = useCustomToast();

const view = ref<'options' | 'login' | 'register' | 'verify' | 'forgot' | 'verify_reset' | 'reset' | 'guest'>('options');
const loading = ref(false);
const googleLoading = ref(false);
const error = ref('');

const loginForm = reactive({
  email: '',
  password: ''
});

const registerForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: ''
});

const guestForm = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: ''
});

// Forgot / Reset Password state variables
const forgotEmail = ref('');
const resetOtpDigits = ref(['', '', '', '', '', '']);
const resetForm = reactive({
  password: '',
  confirmPassword: ''
});

const otpDigits = ref(['', '', '', '', '', '']);
const resendTimer = ref(0);
const resendLoading = ref(false);

// Eye visibility states
const showLoginPassword = ref(false);
const showRegisterPassword = ref(false);
const showResetPassword = ref(false);
const showConfirmPassword = ref(false);

const startResendTimer = () => {
  resendTimer.value = 60;
  const interval = setInterval(() => {
    resendTimer.value--;
    if (resendTimer.value <= 0) clearInterval(interval);
  }, 1000);
};

const handleOtpInput = (e: any, index: number) => {
  const char = e.data;
  if (char && index < 6) {
    document.getElementById(`otp-input-${index + 1}`)?.focus();
  }
};

const handleOtpBackspace = (e: any, index: number) => {
  if (!otpDigits.value[index - 1] && index > 1) {
    document.getElementById(`otp-input-${index - 1}`)?.focus();
  }
};

const handleResetOtpInput = (e: any, index: number) => {
  const char = e.data;
  if (char && index < 6) {
    document.getElementById(`reset-otp-input-${index + 1}`)?.focus();
  }
};

const handleResetOtpBackspace = (e: any, index: number) => {
  if (!resetOtpDigits.value[index - 1] && index > 1) {
    document.getElementById(`reset-otp-input-${index - 1}`)?.focus();
  }
};

const handleResend = async () => {
  resendLoading.value = true;
  try {
    const email = registerForm.email || loginForm.email;
    if (email) {
      await auth_api.resendOtp(email);
      showToast({
        title: "Code Resent!",
        message: "We've sent a new verification code to your email.",
        toastType: "success",
      });
    }
    startResendTimer();
  } catch (e: any) {
    error.value = e.response?.data?.message || e.message || 'Failed to resend code.';
  } finally {
    resendLoading.value = false;
  }
};

const handleResendResetOtp = async () => {
  resendLoading.value = true;
  try {
    const res = await auth_api.forgotPassword(forgotEmail.value);
    showToast({
      title: "Code Resent!",
      message: res.data?.message || "We've resent the reset code to your email.",
      toastType: "success",
    });
    startResendTimer();
  } catch (e: any) {
    error.value = e.response?.data?.message || e.message || 'Failed to resend code.';
  } finally {
    resendLoading.value = false;
  }
};

const goBackToLogin = () => {
  view.value = 'login';
  error.value = '';
};

const handleGoogleAuth = async () => {
  error.value = '';
  googleLoading.value = true;
  try {
    await firebaseLogin({ redirect: false });
    emit('authenticated');
    emit('update:modelValue', false);
  } catch (e: any) {
    console.error('Google Auth action failed:', e);
    error.value = e.response?.data?.message || e.message || 'Something went wrong with Google authentication. Please try again.';
  } finally {
    googleLoading.value = false;
  }
};

const handleSubmit = async () => {
  error.value = '';
  loading.value = true;
  
  try {
    if (view.value === 'login') {
      await login(loginForm, { redirect: false });
      emit('authenticated');
      emit('update:modelValue', false);
    } else if (view.value === 'guest') {
      emit('guest-checkout', { ...guestForm });
      // We don't close the modal here because processGuestBooking in BookingFlow will handle loading and closing
    } else if (view.value === 'register') {
      await register(registerForm, { redirect: false });
      view.value = 'verify';
      loading.value = false;
    } else if (view.value === 'verify') {
      const otp = otpDigits.value.join('');
      if (otp.length < 6) {
        error.value = 'Please enter the full 6-digit code sent to your email.';
        loading.value = false;
        return;
      }
      await verifyOTP(registerForm.email || loginForm.email, otp, { redirect: false });
      emit('authenticated');
      emit('update:modelValue', false);
    } else if (view.value === 'forgot') {
      if (!forgotEmail.value.trim()) {
        error.value = 'Please enter your email address.';
        loading.value = false;
        return;
      }
      const res = await auth_api.forgotPassword(forgotEmail.value);
      showToast({
        title: "Code Sent!",
        message: res.data?.message || "Check your inbox for the reset code.",
        toastType: "success",
      });
      view.value = 'verify_reset';
      startResendTimer();
    } else if (view.value === 'verify_reset') {
      const otp = resetOtpDigits.value.join('');
      if (otp.length < 6) {
        error.value = 'Please enter the full 6-digit reset code.';
        loading.value = false;
        return;
      }
      const res = await auth_api.verifyResetOtp({ email: forgotEmail.value, otp });
      showToast({
        title: "Code Verified!",
        message: res.data?.message || "Perfect! Now set your new password.",
        toastType: "success",
      });
      view.value = 'reset';
    } else if (view.value === 'reset') {
      if (resetForm.password !== resetForm.confirmPassword) {
        error.value = 'Passwords do not match. Please try again.';
        loading.value = false;
        return;
      }
      const otp = resetOtpDigits.value.join('');
      await auth_api.resetPassword({
        email: forgotEmail.value,
        otp,
        newPassword: resetForm.password
      });
      showToast({
        title: "Password Changed!",
        message: "You can now log in securely.",
        toastType: "success",
      });
      // Navigate to login view
      view.value = 'login';
      loginForm.email = forgotEmail.value; // Prefill email
      loginForm.password = '';
      // Reset forms
      forgotEmail.value = '';
      resetOtpDigits.value = ['', '', '', '', '', ''];
      resetForm.password = '';
      resetForm.confirmPassword = '';
    }
  } catch (e: any) {
    console.error('Auth action failed:', e);
    error.value = e.response?.data?.message || e.message || 'Something went wrong. Please check your credentials and try again.';
  } finally {
    loading.value = false;
  }
};

watch(() => props.modelValue, (newVal) => {
  if (newVal) {
    view.value = 'login';
    error.value = '';
    // Clear forms
    loginForm.email = '';
    loginForm.password = '';
    otpDigits.value = ['', '', '', '', '', ''];
    forgotEmail.value = '';
    resetOtpDigits.value = ['', '', '', '', '', ''];
    resetForm.password = '';
    resetForm.confirmPassword = '';
    guestForm.firstName = '';
    guestForm.lastName = '';
    guestForm.email = '';
    guestForm.phone = '';
    // Reset eye visibility toggles
    showLoginPassword.value = false;
    showRegisterPassword.value = false;
    showResetPassword.value = false;
    showConfirmPassword.value = false;
  }
});
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.animate-zoom-in {
  animation: zoomIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes zoomIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

.animate-shake {
  animation: shake 0.3s ease-in-out;
}
</style>
