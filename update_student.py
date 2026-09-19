import re

with open("pages/dashboard/orders/[id].vue", "r") as f:
    content = f.read()

# Update UI
ui_search = r'<div v-if="showSubstituteReviewModal" class="fixed inset-0 z-\[100\].*?Accept Swap\n        </button>\n      </div>\n    </div>\n  </div>'
ui_replace = """<div v-if="showSubstituteReviewModal" class="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" @click="showSubstituteReviewModal = false"></div>
    <div class="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col p-6">
      <div class="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <RefreshCw class="w-8 h-8 text-[#FF5C1A]" />
      </div>
      
      <h3 class="text-xl font-black text-gray-900 mb-2 tracking-tight text-center">Review Substitutes</h3>
      <p class="text-sm font-medium text-gray-500 mb-6 leading-relaxed text-center">
        Your Errander noticed that <strong class="text-gray-900">{{ substituteData?.originalItemName }}</strong> is out of stock. Please select a substitute option below:
      </p>
      
      <div class="space-y-3 mb-6 max-h-[40vh] overflow-y-auto pr-2">
        <button 
          v-for="opt in substituteData?.substituteOptions || []" 
          :key="opt._id"
          @click="selectedSubstituteOptionId = opt._id"
          class="w-full flex flex-col p-4 bg-white border rounded-xl transition-all text-left"
          :class="selectedSubstituteOptionId === opt._id ? 'border-[#FF5C1A] bg-orange-50 ring-2 ring-orange-200' : 'border-gray-200 hover:border-gray-300'"
        >
          <div class="flex items-center justify-between w-full">
            <p class="text-sm font-bold text-gray-900">{{ opt.name }}</p>
            <div class="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full border"
                 :class="selectedSubstituteOptionId === opt._id ? 'bg-[#FF5C1A] border-[#FF5C1A] text-white' : 'border-gray-300 text-transparent'">
              <Check class="w-3 h-3" />
            </div>
          </div>
          <div class="mt-2 flex items-center gap-2">
            <span v-if="getSubstitutePriceDiff(opt.price) > 0" class="text-xs font-bold text-red-600 bg-red-100 px-2 py-1 rounded">
              Pay ₦{{ getSubstitutePriceDiff(opt.price).toLocaleString() }} Extra
            </span>
            <span v-else-if="getSubstitutePriceDiff(opt.price) < 0" class="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded">
              Refund ₦{{ Math.abs(getSubstitutePriceDiff(opt.price)).toLocaleString() }}
            </span>
            <span v-else class="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded">
              Same Price
            </span>
          </div>
        </button>
      </div>

      <div class="flex gap-3 mt-2">
        <button 
          @click="resolveSubstitute(false)" 
          :disabled="isResolvingSubstitute"
          class="flex-1 py-3.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-bold hover:bg-gray-200 transition-all disabled:opacity-50"
        >
          Decline All & Refund
        </button>
        <button 
          @click="resolveSubstitute(true)" 
          :disabled="isResolvingSubstitute || !selectedSubstituteOptionId"
          class="flex-1 py-3.5 bg-[#FF5C1A] text-white rounded-xl text-sm font-bold hover:bg-[#FF5C1A]/90 transition-all disabled:opacity-50 shadow-lg shadow-[#FF5C1A]/20"
        >
          {{ getSubstituteSubmitText() }}
        </button>
      </div>
    </div>
  </div>"""
content = re.sub(ui_search, ui_replace, content, flags=re.DOTALL)


# Update logic
logic_search = r'const showSubstituteReviewModal = ref\(false\);.*?const resolveSubstitute = async \(accept: boolean\) => \{.*?^\};'
logic_replace = """const showSubstituteReviewModal = ref(false);
const substituteData = ref<any>(null);
const isResolvingSubstitute = ref(false);
const selectedSubstituteOptionId = ref<string | null>(null);

const originalSubstituteItem = computed(() => {
  if (!substituteData.value || !order.value) return null;
  const id = substituteData.value.itemId;
  const matches = (i: any) => i._id === id || i.menuItem === id || i.product === id;
  let found = order.value.menuItems?.find(matches) || order.value.items?.find(matches);
  if (!found) {
    for (const pack of (order.value.packs || [])) {
      found = pack.items?.find(matches);
      if (found) break;
    }
  }
  return found;
});

const originalSubstituteItemPrice = computed(() => originalSubstituteItem.value?.price || 0);
const originalSubstituteItemQty = computed(() => originalSubstituteItem.value?.quantity || 1);

const getSubstitutePriceDiff = (optPrice: number) => {
  const originalSubtotal = originalSubstituteItemPrice.value * originalSubstituteItemQty.value;
  const newSubtotal = optPrice * originalSubstituteItemQty.value;
  return newSubtotal - originalSubtotal;
};

const getSubstituteSubmitText = () => {
  if (!selectedSubstituteOptionId.value) return 'Select an Option';
  const opt = substituteData.value?.substituteOptions?.find((o: any) => o._id === selectedSubstituteOptionId.value);
  if (!opt) return 'Accept Swap';
  const diff = getSubstitutePriceDiff(opt.price);
  if (diff > 0) {
    if (balance.value < diff) return 'Fund Wallet & Accept';
    return `Accept (Pay ₦${diff.toLocaleString()})`;
  }
  return 'Accept Swap';
};

const resolveSubstitute = async (accept: boolean) => {
  if (!substituteData.value) return;
  
  if (accept && !selectedSubstituteOptionId.value) {
    showToast({ title: 'Select an Option', message: 'Please select a substitute option to accept.', toastType: 'error' });
    return;
  }

  if (accept) {
    const opt = substituteData.value?.substituteOptions?.find((o: any) => o._id === selectedSubstituteOptionId.value);
    if (opt) {
      const diff = getSubstitutePriceDiff(opt.price);
      if (diff > 0 && balance.value < diff) {
        showToast({ title: 'Insufficient Funds', message: 'Redirecting to fund your wallet...', toastType: 'info' });
        fundAmountNeeded.value = diff - balance.value;
        showSubstituteReviewModal.value = false;
        initiateWalletTopup(); 
        return;
      }
    }
  }

  isResolvingSubstitute.value = true;
  try {
    await api.post(`/orders/${order.value._id}/substitute/resolve`, {
      itemId: substituteData.value.itemId,
      accept,
      substituteItemId: accept ? selectedSubstituteOptionId.value : ''
    });
    showToast({ 
      title: accept ? 'Substitute Accepted' : 'Substitute Declined', 
      message: accept ? 'The rider will pick up the new item.' : 'You will be refunded for this item.', 
      toastType: 'success' 
    });
    showSubstituteReviewModal.value = false;
    substituteData.value = null;
    selectedSubstituteOptionId.value = null;
    const res = await orders_api.getOrder(route.params.id as string);
    order.value = res.data;
  } catch (e: any) {
    showToast({ title: 'Error', message: e.response?.data?.message || 'Action failed', toastType: 'error' });
  } finally {
    isResolvingSubstitute.value = false;
  }
};"""
content = re.sub(logic_search, logic_replace, content, flags=re.DOTALL|re.MULTILINE)

with open("pages/dashboard/orders/[id].vue", "w") as f:
    f.write(content)
