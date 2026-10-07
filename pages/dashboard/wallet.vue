<template>
  <main class="min-h-screen pb-20">
    <div class="max-w-3xl mx-auto px-3 pt-6 md:pt-8 space-y-6">
      
      <!-- Header -->
      <div class="flex items-center gap-3">
        <button @click="goBack" class="w-9 h-9 bg-white rounded-xl border border-gray-50 flex items-center justify-center hover:bg-gray-50 transition-all active:scale-95">
          <ArrowLeft class="w-4 h-4 text-gray-900" />
        </button>
        <div>
          <h1 class="text-xl font-medium text-gray-900 tracking-tight">My Wallet</h1>
          <p class="text-sm font-bold text-gray-400">Manage your funds and transactions</p>
        </div>
      </div>

      <!-- Wallet Balance Card -->
      <div class="relative overflow-hidden bg-gray-900 rounded-2xl p-4 md:p-5 text-white">
        <div class="absolute top-0 right-0 w-48 h-48 bg-parentPrimary/15 rounded-full blur-[80px] -mr-20 -mt-20"></div>
        <div class="absolute bottom-0 left-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-[60px] -ml-16 -mb-16"></div>
        
        <div class="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <p class="text-sm font-medium text-white/40  mb-2">Available Balance</p>
            <div class="flex items-baseline gap-2">
              <span class="text-4xl md:text-5xl font-medium tracking-tighter">₦{{ (balance || 0).toLocaleString() }}</span>
              <button @click="handleFetchWallet" class="p-1.5 hover:bg-white/10 rounded-lg transition-colors">
                <RefreshCw :class="loading ? 'animate-spin' : ''" class="w-3.5 h-3.5 text-white/40" />
              </button>
            </div>
          </div>
          <button 
            @click="showTopup = true"
            class="px-4 py-3.5 bg-parentPrimary text-white rounded-xl text-sm font-medium tracking-wider hover:bg-parentPrimary/90 active:scale-95 transition-all shadow-sm border border-gray-50 shadow-parentPrimary/30 flex items-center gap-2 self-start md:self-center"
          >
            <Plus class="w-4 h-4" />
            Add Money
          </button>
        </div>
      </div>

      <!-- Instant Virtual Account -->
      <div v-if="wallet?.virtualAccount" class="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex items-start gap-4">
          <div class="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center shrink-0 border border-emerald-100/50">
            <Building2 class="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <div class="flex items-center gap-2 mb-1">
              <h3 class="text-gray-900 font-semibold tracking-tight">{{ wallet.virtualAccount.bankName }}</h3>
              <span class="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Instant Funding</span>
            </div>
            <p class="text-2xl font-bold tracking-tight text-gray-800 font-mono">{{ wallet.virtualAccount.accountNumber }}</p>
            <p class="text-sm font-medium text-emerald-600/80 mt-0.5">{{ wallet.virtualAccount.accountName }}</p>
          </div>
        </div>
        <div class="bg-white/60 p-3 rounded-xl border border-emerald-100/50">
          <p class="text-sm font-medium text-emerald-800 leading-relaxed max-w-xs">Transfer to this dedicated account number to automatically fund your wallet instantly. No card required.</p>
        </div>
      </div>

      <!-- Verification State -->
      <div v-if="verifying" class="bg-white rounded-2xl p-10 text-center border border-emerald-100">
        <div class="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Loader2 class="w-7 h-7 text-emerald-500 animate-spin" />
        </div>
        <h3 class="text-base font-medium text-gray-900 tracking-tight">Verifying Transaction...</h3>
        <p class="text-sm text-gray-400 mt-1.5 font-medium">Please wait while we confirm your top-up.</p>
      </div>

      <!-- Recent Transactions -->
      <div class="space-y-4">
        <div class="flex items-center justify-between px-1">
          <h2 class="text-sm font-medium text-gray-900 tracking-tight">Recent Activity</h2>
          <button class="text-sm font-medium text-parentPrimary hover:underline">View All</button>
        </div>

        <div v-if="loadingTransactions" class="space-y-3">
          <div v-for="i in 3" :key="i" class="h-16 bg-gray-50 rounded-xl animate-pulse"></div>
        </div>

        <div v-else-if="transactions.length" class="bg-white rounded-2xl border border-gray-50 overflow-hidden divide-y divide-gray-50">
          <div 
            v-for="tx in transactions" 
            :key="tx._id"
            @click="openDetails(tx)"
            class="flex items-center gap-3 p-4 hover:bg-gray-50/50 transition-colors cursor-pointer group"
          >
            <div 
              :class="tx.type === 'credit' ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'"
              class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform"
            >
              <ArrowUpRight v-if="tx.type === 'debit'" class="w-4 h-4" />
              <ArrowDownLeft v-else class="w-4 h-4" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium text-gray-900 truncate leading-tight">{{ tx.description }}</p>
              <p class="text-sm text-gray-400 font-medium mt-0.5">
                {{ new Date(tx.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) }}
              </p>
            </div>
            <div class="text-right shrink-0">
              <p :class="tx.type === 'credit' ? 'text-emerald-500' : 'text-gray-900'" class="font-medium text-sm tracking-tight">
                {{ tx.type === 'credit' ? '+' : '-' }}₦{{ tx.amount.toLocaleString() }}
              </p>
              <div class="flex items-center justify-end gap-1 text-[9px] font-bold mt-0.5" :class="tx.status === 'completed' ? 'text-emerald-400' : 'text-amber-400'">
                <div class="w-1 h-1 rounded-full bg-current"></div>
                {{ tx.status }}
              </div>
            </div>
          </div>
        </div>

        <div v-else class="bg-white p-10 rounded-2xl text-center border border-dashed border-gray-200">
          <div class="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <WalletIcon class="w-7 h-7 text-gray-300" />
          </div>
          <p class="text-sm font-medium text-gray-900 mb-0.5">No transactions yet</p>
          <p class="text-sm font-medium text-gray-400">Your activity will show up here</p>
        </div>
      </div>
    </div>

    <!-- ============================================ -->
    <!-- ADD FUNDS MODAL (Redesigned)                 -->
    <!-- ============================================ -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="showTopup" class="fixed inset-0 z-[110] bg-black/50 backdrop-blur-sm" @click="showTopup = false"></div>
      </Transition>
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="translate-y-full md:translate-y-0 md:scale-95 md:opacity-0"
        enter-to-class="translate-y-0 md:scale-100 md:opacity-100"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="translate-y-0 md:scale-100 md:opacity-100"
        leave-to-class="translate-y-full md:translate-y-0 md:scale-95 md:opacity-0"
      >
        <div v-if="showTopup" class="fixed inset-x-0 bottom-0 md:inset-0 md:flex md:items-center md:justify-center md:p-4 z-[111]">
          <div class="bg-white w-full md:max-w-md rounded-t-[2rem] md:rounded-2xl overflow-hidden shadow-sm border border-gray-50">
            <!-- Header with gradient accent -->
            <div class="relative bg-gray-900 px-4 py-4 md:py-5 text-center overflow-hidden">
              <div class="absolute top-0 right-0 w-40 h-40 bg-parentPrimary/20 rounded-full blur-[60px] -mr-16 -mt-16"></div>
              <div class="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-[40px] -ml-12 -mb-12"></div>
              
              <!-- Mobile handle -->
              <div class="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4 md:hidden"></div>
              
              <button @click="showTopup = false" class="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-xl transition-colors">
                <X class="w-4 h-4 text-white/60" />
              </button>
              
              <div class="relative z-10">
                <div class="w-14 h-14 bg-parentPrimary/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 border border-parentPrimary/20">
                  <WalletIcon class="w-7 h-7 text-parentPrimary" />
                </div>
                <h3 class="text-lg font-medium text-white tracking-tight mb-1">Add Funds</h3>
                <p class="text-sm font-bold text-white/40">Top up your Errandr wallet</p>
              </div>
            </div>

            <!-- Body -->
            <div class="p-4 space-y-5">
              <!-- Amount Input -->
              <div>
                <label class="text-sm font-medium text-gray-400 tracking-wider block mb-2 pl-1">Enter Amount</label>
                <div class="relative">
                  <span class="absolute left-5 top-1/2 -translate-y-1/2 text-xl font-medium text-gray-300">₦</span>
                  <input 
                    v-model="formattedAmount"
                    type="text"
                    placeholder="0"
                    class="w-full bg-gray-50 border border-transparent focus:border-parentPrimary/20 rounded-xl py-5 pl-11 pr-5 text-2xl font-medium text-gray-900 placeholder:text-gray-200 transition-all outline-none"
                  />
                </div>
              </div>

              <!-- Quick Amounts -->
              <div class="flex gap-2">
                <button 
                  v-for="a in [500, 1000, 2000, 5000]" 
                  :key="a"
                  @click="amount = a"
                  :class="amount === a ? 'bg-parentPrimary text-white border-parentPrimary shadow-sm border border-gray-50 shadow-parentPrimary/20' : 'bg-white text-gray-600 border-gray-100 hover:border-parentPrimary/30'"
                  class="flex-1 py-2.5 rounded-xl text-sm font-medium transition-all border active:scale-95"
                >
                  ₦{{ a >= 1000 ? (a / 1000) + 'k' : a }}
                </button>
              </div>

              <!-- Current Balance Indicator -->
              <div class="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                <span class="text-sm font-bold text-gray-400">Current balance</span>
                <span class="text-sm font-medium text-gray-900">₦{{ (balance || 0).toLocaleString() }}</span>
              </div>
              <div v-if="amount > 0" class="flex items-center justify-between bg-emerald-50 rounded-xl px-4 py-3 border border-emerald-100">
                <span class="text-sm font-bold text-emerald-600">New balance after funding</span>
                <span class="text-sm font-medium text-emerald-600">₦{{ ((balance || 0) + Number(amount)).toLocaleString() }}</span>
              </div>

              <!-- Continue Button -->
              <button 
                @click="initiateTopup"
                :disabled="loadingPayment || amount < 50"
                class="w-full py-4 bg-parentPrimary text-white rounded-xl text-sm font-medium tracking-wider hover:bg-parentPrimary/90 disabled:opacity-40 transition-all shadow-sm border border-gray-50 shadow-parentPrimary/20 flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <Loader2 v-if="loadingPayment" class="w-4 h-4 animate-spin" />
                <span v-else>Continue with Paystack</span>
                <ArrowRight v-if="!loadingPayment" class="w-4 h-4" />
              </button>

              <!-- Security Note -->
              <p class="text-[9px] font-medium text-gray-300 text-center">
                🔒 Secured by Paystack. Your card details are never stored.
              </p>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- ============================================ -->
    <!-- TRANSACTION DETAILS MODAL                    -->
    <!-- ============================================ -->
    <Teleport to="body">
      <Transition
        enter-active-class="transition-opacity duration-300"
        enter-from-class="opacity-0"
        enter-to-class="opacity-100"
        leave-active-class="transition-opacity duration-200"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
        <div v-if="selectedTx" class="fixed inset-0 z-[110] flex items-end md:items-center justify-center p-0 md:p-4 bg-black/50 backdrop-blur-sm" @click.self="selectedTx = null">
          <div class="bg-white w-full md:max-w-md rounded-t-[2rem] md:rounded-2xl overflow-hidden shadow-sm border border-gray-50 animate-slide-up-mobile md:animate-zoom-in receipt-content" id="receipt-print">
            <!-- Header -->
            <div class="bg-gray-900 p-4 md:p-5 text-center relative overflow-hidden">
              <div class="absolute inset-0 bg-emerald-500/5 blur-3xl rounded-full translate-y-12"></div>
              
              <!-- Mobile handle -->
              <div class="w-10 h-1 bg-white/20 rounded-full mx-auto mb-4 md:hidden"></div>
              
              <button @click="selectedTx = null" class="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-xl transition-colors print:hidden">
                <X class="w-4 h-4 text-white/50" />
              </button>
              
              <div 
                :class="selectedTx.type === 'credit' ? 'bg-emerald-500 shadow-emerald-500/20' : 'bg-parentPrimary shadow-parentPrimary/20'"
                class="w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-white shadow-sm border border-gray-50 mb-4 relative z-10"
              >
                <WalletIcon v-if="selectedTx.type === 'credit'" class="w-8 h-8" />
                <ShoppingBag v-else class="w-8 h-8" />
              </div>
              
              <p class="text-[9px] font-medium text-white/40  mb-1.5 relative z-10">Transaction Details</p>
              <p class="text-3xl font-medium text-white tracking-tighter relative z-10">
                {{ selectedTx.type === 'credit' ? '+' : '-' }}₦{{ selectedTx.amount.toLocaleString() }}
              </p>
            </div>

            <!-- Body -->
            <div class="p-5 md:p-4 space-y-5 max-h-[50vh] md:max-h-none overflow-y-auto">
              <div class="space-y-4 bg-gray-50 rounded-xl p-4 border border-gray-50">
                <div class="flex justify-between items-center">
                  <span class="text-sm font-bold text-gray-400 tracking-wider">Status</span>
                  <span :class="selectedTx.status === 'completed' ? 'text-emerald-500 bg-emerald-50 border-emerald-100' : 'text-amber-500 bg-amber-50 border-amber-100'" class="text-sm font-medium px-2.5 py-1 rounded-lg border">
                    {{ selectedTx.status }}
                  </span>
                </div>
                <div class="flex justify-between items-start">
                  <span class="text-sm font-bold text-gray-400 tracking-wider">Description</span>
                  <span class="text-sm font-medium text-gray-900 text-right max-w-[180px]">{{ selectedTx.description }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm font-bold text-gray-400 tracking-wider">Reference</span>
                  <span class="text-sm font-mono font-bold text-gray-900 bg-white px-2 py-1 rounded-md border border-gray-50">{{ selectedTx.reference || 'N/A' }}</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm font-bold text-gray-400 tracking-wider">Date</span>
                  <span class="text-sm font-bold text-gray-600">{{ new Date(selectedTx.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }) }}</span>
                </div>
              </div>

              <!-- Actions -->
              <div class="flex gap-3 print:hidden">
                <button 
                  @click="printReceipt"
                  class="flex-1 py-3.5 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-parentPrimary transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <Printer class="w-3.5 h-3.5" />
                  Print Receipt
                </button>
                <button 
                  @click="selectedTx = null"
                  class="flex-1 py-3.5 bg-gray-50 text-gray-500 rounded-xl text-sm font-medium hover:bg-gray-100 transition-all active:scale-[0.98]"
                >
                  Close
                </button>
              </div>
              
              <p class="text-[9px] font-medium text-gray-300 text-center pt-2 border-t border-gray-100">Errandr Campus Finance Hub</p>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </main>
</template>

<script setup lang="ts">
import { 
  ArrowLeft, RefreshCw, Plus, ArrowUpRight, ArrowDownLeft, 
  Wallet as WalletIcon, X, Loader2, ArrowRight, ChevronRight,
  Printer, ShoppingBag, Building2
} from 'lucide-vue-next';
import logoLight from '@/assets/img/logo-light.png';
import { useWallet } from '@/composables/modules/wallets';
import { usePayments } from '@/composables/modules/payments';
import { useCustomToast } from '@/composables/core/useCustomToast';
import { useUser } from '@/composables/modules/auth/user';
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from '#app';

definePageMeta({
  layout: 'student'
});

const route = useRoute();
const router = useRouter();
const { user } = useUser();
const { balance, wallet, fetchWallet } = useWallet();
const { loading: loadingPayment, initializePayment, verifyPayment } = usePayments();
const { showToast } = useCustomToast();

const loading = ref(false);
const showTopup = ref(false);
const amount = ref(0);
const formattedAmount = computed({
  get() {
    if (amount.value === 0 || amount.value === null || amount.value === undefined) return '';
    return amount.value.toLocaleString('en-US');
  },
  set(val) {
    const clean = val.replace(/[^0-9]/g, '');
    amount.value = clean ? Number(clean) : 0;
  }
});
const verifying = ref(false);
const loadingTransactions = ref(false);
const transactions = ref<any[]>([]);
const selectedTx = ref<any>(null);

const handleFetchWallet = async () => {
  loading.value = true;
  await fetchWallet();
  loading.value = false;
  fetchTransactions();
};

const fetchTransactions = async () => {
  loadingTransactions.value = true;
  try {
    const { wallets_api } = await import('@/api_factory/modules/wallets');
    const res = await wallets_api.getTransactions();
    transactions.value = (res.data?.data || res.data || []).slice(0, 10);
  } finally {
    loadingTransactions.value = false;
  }
};

const openDetails = (tx: any) => {
  selectedTx.value = tx;
};

const printReceipt = async () => {
  const tx = selectedTx.value;
  if (!tx) return;

  try {
    const { jsPDF } = await import('jspdf');
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a6', // Compact receipt layout size: 105mm x 148mm
    });

    // Helper to load image in the browser context
    const loadImage = (src: string): Promise<HTMLImageElement> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
        img.src = src;
      });
    };

    // Color Palette Definition
    const primaryColor = [255, 92, 26]; // Erranders Orange: #FF5C1A
    const darkGray = [17, 24, 39]; // Gray 900
    const lightGray = [243, 244, 246]; // Gray 100
    const textMuted = [156, 163, 175]; // Gray 400
    const emeraldColor = [16, 185, 129]; // Emerald 500
    const roseColor = [239, 68, 68]; // Rose 500

    // 1. Draw Receipt Background Frame & Top Bar
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, 105, 148, 'F');

    // Branded Top Accent Bar
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2]);
    doc.rect(0, 0, 105, 5, 'F');

    // 2. Brand Identity Header
    // Load and add the logo image
    try {
      const logoImg = await loadImage(logoLight);
      // center the logo: width = 38mm, aspect ratio is 4.4, height = 38 / 4.4 = 8.64mm
      doc.addImage(logoImg, 'PNG', 33.5, 12, 38, 8.64);
    } catch (e) {
      console.warn('Failed to load logo image, falling back to text:', e);
      // Fallback in case of any loading failure
      doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      doc.setFont('Helvetica', 'bold');
      doc.setFontSize(15);
      doc.text('Erranders.', 52.5, 18, { align: 'center' });
    }

    // Subtitle / Hub
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.setFontSize(7.5);
    doc.text('CAMPUS FINANCE HUB • OFFICIAL RECEIPT', 52.5, 26, { align: 'center' });

    // Decorative Separator Line
    doc.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.setLineWidth(0.3);
    doc.line(12, 31, 93, 31);

    // 3. Main Transaction Value & Title
    const isCredit = tx.type === 'credit';
    const amountVal = Number(tx.amount || 0);
    const amountStr = `${isCredit ? '+' : '-'} NGN ${amountVal.toLocaleString()}`;
    
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(isCredit ? emeraldColor[0] : darkGray[0], isCredit ? emeraldColor[1] : darkGray[1], isCredit ? emeraldColor[2] : darkGray[2]);
    doc.text(amountStr, 52.5, 43, { align: 'center' });

    // Transaction description (clean mixed-casing)
    doc.setFont('Helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(107, 114, 128); // Gray 500
    doc.text(tx.description, 52.5, 49, { align: 'center' });

    // 4. Detailed Data Card Background
    doc.setFillColor(249, 250, 251); // Gray 50
    doc.roundedRect(12, 55, 81, 58, 3.5, 3.5, 'F');

    // Helper function to draw key-value details rows
    const drawRow = (label: string, value: string, y: number, isBoldValue = false) => {
      doc.setFont('Helvetica', 'normal');
      doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
      doc.setFontSize(8);
      doc.text(label, 17, y);

      doc.setFont('Helvetica', isBoldValue ? 'bold' : 'normal');
      doc.setTextColor(darkGray[0], darkGray[1], darkGray[2]);
      doc.setFontSize(8);
      doc.text(value, 88, y, { align: 'right' });
    };

    // Draw detail rows
    drawRow('Transaction Type', isCredit ? 'wallet credit / top-up' : 'wallet debit / errand payment', 62.5, true);
    
    // Status (Beautifully styled padded status pill badge)
    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(textMuted[0], textMuted[1], textMuted[2]);
    doc.setFontSize(8);
    doc.text('Status', 17, 72);
    
    const isCompleted = tx.status === 'completed';
    // Draw status capsule/badge background
    doc.setFillColor(isCompleted ? 209 : 253, isCompleted ? 250 : 242, isCompleted ? 229 : 217); // bg-emerald-50 or bg-amber-50
    doc.roundedRect(69, 68.5, 19, 5, 1, 1, 'F');
    // Draw status badge label text
    doc.setFont('Helvetica', 'bold');
    doc.setFontSize(7);
    doc.setTextColor(isCompleted ? emeraldColor[0] : roseColor[0], isCompleted ? emeraldColor[1] : roseColor[1], isCompleted ? emeraldColor[2] : roseColor[2]);
    doc.text(tx.status, 78.5, 72, { align: 'center' });

    // Draw remaining details rows
    doc.setFont('Helvetica', 'normal');
    drawRow('Reference ID', tx.reference || 'N/A', 81.5, true);
    
    const timestampStr = new Date(tx.createdAt).toLocaleString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    drawRow('Transaction Date', timestampStr, 91);

    const customerName = user.value ? `${user.value.firstName} ${user.value.lastName}` : 'Student Member';
    drawRow('Account Holder', customerName, 100.5);

    // 5. Receipt Footer & Security Seal
    doc.setDrawColor(lightGray[0], lightGray[1], lightGray[2]);
    doc.setLineWidth(0.3);
    doc.line(12, 118, 93, 118);

    doc.setFont('Helvetica', 'normal');
    doc.setTextColor(156, 163, 175);
    doc.setFontSize(7.5);
    doc.text('secured transaction via Paystack gateway', 52.5, 124, { align: 'center' });
    doc.text('thank you for using erranders!', 52.5, 129, { align: 'center' });

    // Save the dynamically compiled branded vector PDF
    doc.save(`erranders-receipt-${tx.reference || 'transaction'}.pdf`);
  } catch (error) {
    console.error('Failed to generate receipt PDF:', error);
    showToast({
      title: 'Print Failed',
      message: 'Could not generate receipt PDF. Please try again.',
      toastType: 'error'
    });
  }
};

const initiateTopup = async () => {
  if (amount.value <= 10) {
    showToast({ title: 'Invalid Amount', message: 'Minimum funding amount is ₦10', toastType: 'error' });
    return;
  }
  try {
    const data = await initializePayment({
      amount: amount.value,
      email: user.value?.email,
      callback_url: window.location.origin + '/dashboard/wallet', 
      metadata: { 
        type: 'wallet_topup', 
        userId: user.value?._id,
        redirect: route.query.redirect 
      },
    });
    
    const authUrl = data?.data?.authorization_url || data?.authorization_url;
    if (authUrl) {
      localStorage.setItem('recent_topup_ref', data?.data?.reference || '');
      window.location.href = authUrl;
    }
  } catch (e: any) {
    showToast({ title: 'Error', message: e.message || 'Failed to initialize payment', toastType: 'error' });
  }
};

const verifyReturn = async () => {
  const reference = route.query.reference as string;
  if (!reference) return;

  verifying.value = true;
  try {
    const res = await verifyPayment(reference);
    const data = res?.data || res;
    
    const success = data?.status === 'success' || data?.data?.status === 'success';
    
    if (success) {
      showToast({ 
        title: 'Funding Successful!', 
        message: 'Your wallet has been credited and is ready for use.', 
        toastType: 'success' 
      });
      await handleFetchWallet();
      
      const redirectPath = route.query.redirect;
      if (redirectPath) {
        setTimeout(() => {
          router.push(redirectPath as string);
        }, 3000);
      }
    }
  } catch (e) {
    showToast({ title: 'Verification Error', message: 'Was not able to verify this topup yet. Please refresh in a moment.', toastType: 'error' });
  } finally {
    verifying.value = false;
    const url = new URL(window.location.href);
    url.searchParams.delete('reference');
    url.searchParams.delete('trs_id');
    window.history.replaceState({}, '', url.toString());
  }
};

const goBack = () => {
  if (route.query.redirect) {
    router.push(route.query.redirect as string);
  } else {
    router.push('/dashboard');
  }
};

onMounted(async () => {
  handleFetchWallet();
  if (route.query.topup) {
    amount.value = Number(route.query.topup);
    showTopup.value = true;
  }
  if (route.query.reference) {
    await verifyReturn();
  }
});
</script>

<style scoped>
.animate-slide-up-mobile {
  animation: slideUpMobile 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
@keyframes slideUpMobile {
  from { opacity: 0; transform: translateY(100%); }
  to { opacity: 1; transform: translateY(0); }
}

.animate-zoom-in { animation: zoomIn 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
@keyframes zoomIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }

@media print {
  body * { visibility: hidden; }
  .receipt-content, .receipt-content * { visibility: visible; }
  .receipt-content {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    margin: 0;
    padding: 0;
    box-shadow: none !important;
    border: none !important;
  }
  .print\:hidden { display: none !important; }
}
</style>
