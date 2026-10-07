<template>
  <div class="min-h-screen pb-24 sm:pb-32 font-sans text-[#17150F] text-sm selection:bg-parentPrimary/15 selection:text-parentPrimary">

    <main class="max-w-7xl mx-auto px-0 sm:px-4 pt-4 sm:pt-6 grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-start">

      <!-- ============ SIDEBAR: THE ORDER SLIP ============ -->
      <aside class="lg:col-span-4 w-full space-y-4 sm:space-y-6 print:hidden">
        <div class="bg-white rounded-none sm:rounded-[1.75rem] border-0 sm:border border-[#E7E2D4] shadow-none sm:shadow-[0_1px_0_#E7E2D4] overflow-hidden">

          <!-- slip header -->
          <div class="px-5 sm:px-5 pt-5 sm:pt-7 pb-4 sm:pb-5 flex items-center justify-between gap-3">
            <div class="min-w-0">
              <p class="text-[10px] tracking-wide text-[#9C9584] uppercase truncate">order slip · errandr</p>
              <h2 class="font-display text-xl font-medium mt-0.5">meal desk</h2>
            </div>
            <div class="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#E7E2D4] flex items-center justify-center shrink-0">
              <ChefHat class="w-4 h-4 text-parentPrimary" />
            </div>
          </div>

          <!-- tear line -->
          <div class="relative px-5 sm:px-5">
            <div class="border-t-2 border-dashed border-[#E7E2D4]"></div>
            <span class="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#F7F4EC]"></span>
            <span class="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#F7F4EC]"></span>
          </div>

          <div class="px-5 sm:px-5 py-5 sm:py-7 space-y-5 sm:space-y-7">
            <div class="space-y-2">
              <label class="text-sm text-[#9C9584] flex items-center gap-2">
                <Wallet class="w-3.5 h-3.5 text-parentPrimary shrink-0" /> weekly budget
              </label>
              <div class="relative group/field">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-sm text-[#9C9584] group-focus-within/field:text-parentPrimary transition-colors">₦</span>
                <input
                  v-model="formattedBudget"
                  type="text"
                  inputmode="numeric"
                  placeholder="0.00"
                  class="w-full pl-9 pr-4 py-3 sm:py-3.5 bg-[#FBFAF6] border border-[#E7E2D4] rounded-xl font-mono text-base focus:bg-white focus:border-parentPrimary outline-none transition-colors placeholder:text-[#C9C2AF]"
                />
              </div>
            </div>

            <div class="space-y-2">
              <label class="text-sm text-[#9C9584] flex items-center gap-2">
                <UtensilsCrossed class="w-3.5 h-3.5 text-parentPrimary shrink-0" /> meals per day
              </label>
              <div class="grid grid-cols-3 gap-1.5 sm:gap-2">
                <button
                  v-for="i in 3"
                  :key="i"
                  @click="mealsPerDay = i"
                  class="py-2.5 rounded-xl text-sm sm:text-sm font-medium border transition-colors"
                  :class="mealsPerDay === i
                    ? 'bg-[#17150F] text-white border-[#17150F]'
                    : 'bg-[#FBFAF6] text-[#6B6455] border-[#E7E2D4] hover:border-[#C9C2AF]'"
                >
                  {{ i }} meal{{ i > 1 ? 's' : '' }}
                </button>
              </div>
            </div>

            <button
              @click="generatePlan"
              :disabled="loading"
              class="w-full py-3.5 sm:py-4 bg-parentPrimary text-white rounded-xl text-sm font-semibold hover:bg-[#17150F] active:scale-[0.99] transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <Zap v-if="!loading" class="w-4 h-4 shrink-0" />
              <div v-else class="w-4 h-4 border border-white/30 border-t-white rounded-full animate-spin shrink-0" />
              <span class="truncate">{{ loading ? 'drawing up your plan…' : 'optimize my plan' }}</span>
            </button>
          </div>
        </div>

        <!-- ============ SAVINGS RECEIPT ============ -->
        <div v-if="plan" class="bg-[#17150F] rounded-none sm:rounded-[1.75rem] overflow-hidden">
          <div class="px-5 sm:px-5 pt-5 sm:pt-7 pb-4 sm:pb-5 flex items-center justify-between">
            <p class="text-[10px] tracking-wide text-white/40 uppercase">intelligence report</p>
            <Target class="w-4 h-4 text-parentPrimary shrink-0" />
          </div>
          <div class="px-5 sm:px-5 pb-4 sm:pb-5">
            <p class="font-display text-base sm:text-lg font-medium leading-snug text-white lowercase">{{ plan.recommendation }}</p>
          </div>
          <div class="relative px-5 sm:px-5">
            <div class="border-t-2 border-dashed border-white/15"></div>
            <span class="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#F7F4EC]"></span>
            <span class="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#F7F4EC]"></span>
          </div>
          <div class="px-5 sm:px-5 py-5 sm:py-7 flex items-end justify-between gap-3">
            <div class="min-w-0">
              <p class="text-sm text-white/40 mb-1">potential savings</p>
              <p class="font-mono text-xl sm:text-2xl text-[#5FAE85] truncate">₦{{ plan.savings.toLocaleString() }}</p>
            </div>
            <p class="text-[10px] font-mono text-white/30 shrink-0">stub no. {{ plan.savings.toString().slice(-4).padStart(4,'0') }}</p>
          </div>
        </div>
      </aside>

      <!-- ============ MAIN: THE STUB STACK ============ -->
      <section class="lg:col-span-8 w-full space-y-6 sm:space-y-8">

        <!-- Empty state -->
        <div v-if="!plan && !loading" class="bg-white rounded-none sm:rounded-[1.75rem] border-0 sm:border border-[#E7E2D4] p-5 sm:p-16 lg:p-24 text-center">
          <div class="max-w-sm mx-auto">
            <div class="w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-[#E7E2D4] bg-[#FBFAF6] flex items-center justify-center text-4xl sm:text-5xl mx-auto mb-6 sm:mb-8">🍛</div>
            <h3 class="font-display text-2xl sm:text-3xl font-medium mb-3 lowercase">your table is set.</h3>
            <p class="text-sm text-[#6B6455] leading-relaxed lowercase">generate a personalized meal plan tailored to your budget and favorite campus vendors.</p>
          </div>
        </div>

        <!-- Loading: printing stubs -->
        <div v-if="loading" class="space-y-4 sm:space-y-6">
          <div v-for="i in 3" :key="i" class="bg-white p-5 sm:p-5 rounded-none sm:rounded-[1.75rem] border-0 sm:border border-[#E7E2D4] space-y-4 sm:space-y-5">
            <div class="flex justify-between items-center">
              <div class="w-20 h-6 bg-[#F0EDE3] rounded-md animate-pulse"></div>
              <div class="w-14 h-6 bg-[#F0EDE3] rounded-md animate-pulse"></div>
            </div>
            <div class="space-y-3">
              <div v-for="j in 2" :key="j" class="w-full h-14 bg-[#F0EDE3] rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>

        <!-- Plan grid -->
        <div v-if="plan" class="space-y-8 sm:space-y-10">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 sm:px-1">
            <div>
              <h3 class="font-display text-xl sm:text-2xl font-medium lowercase">weekly roadmap</h3>
              <p class="text-sm sm:text-sm text-[#9C9584] lowercase">optimized for market &amp; campus dining</p>
            </div>
            <button @click="downloadPdf" class="print:hidden self-start sm:self-auto px-5 py-2.5 bg-white border border-[#E7E2D4] rounded-xl text-sm font-medium lowercase hover:border-[#17150F] transition-colors">
              download pdf
            </button>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <div
              v-for="dayPlan in plan.cookedMealPlan"
              :key="dayPlan.day"
              class="bg-white rounded-none sm:rounded-[1.75rem] border-0 sm:border border-[#E7E2D4] hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-12px_rgba(23,21,15,0.25)] transition-all duration-300 flex flex-col overflow-hidden"
            >
              <div class="px-5 sm:px-4 py-4 flex justify-between items-center">
                <span class="text-sm px-3 py-1.5 bg-[#17150F] text-white rounded-md">day {{ dayPlan.day }}</span>
                <span class="font-mono text-base sm:text-lg">₦{{ dayPlan.dailyCost.toLocaleString() }}</span>
              </div>

              <!-- tear line -->
              <div class="relative px-5 sm:px-4">
                <div class="border-t-2 border-dashed border-[#E7E2D4]"></div>
                <span class="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#F7F4EC]"></span>
                <span class="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#F7F4EC]"></span>
              </div>

              <div class="px-3 sm:px-5 py-3 sm:py-4 space-y-1 flex-1">
                <div
                  v-for="meal in dayPlan.meals"
                  :key="meal.type"
                  @click="handleMealClick(meal)"
                  class="group/item cursor-pointer flex items-center gap-3 sm:gap-4 p-2.5 sm:p-3 rounded-xl hover:bg-[#FBFAF6] transition-colors"
                >
                  <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#FBFAF6] border border-[#E7E2D4] flex items-center justify-center text-base sm:text-lg shrink-0">
                    <span v-if="meal.type === 'breakfast'">🍳</span>
                    <span v-else-if="meal.type === 'lunch'">🍛</span>
                    <span v-else>🍗</span>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm text-[#9C9584] mb-0.5 group-hover/item:text-parentPrimary">{{ meal.type }}</p>
                    <p class="text-sm font-medium truncate">{{ meal.options.map((o) => o.product.name).join(' + ') }}</p>
                  </div>
                  <ArrowUpRight class="w-4 h-4 text-[#C9C2AF] opacity-0 group-hover/item:opacity-100 group-hover/item:text-parentPrimary transition-all shrink-0 hidden sm:block" />
                </div>
              </div>

              <div class="px-5 sm:px-4 py-3 sm:py-4 border-t border-[#E7E2D4] flex flex-wrap items-center gap-1.5">
                <span
                  v-for="nutrient in getDayNutrients(dayPlan)"
                  :key="nutrient"
                  :class="getNutrientClass(nutrient)"
                  class="px-2.5 py-1 rounded-md text-sm lowercase border"
                >
                  {{ nutrient }}
                </span>
              </div>
            </div>
          </div>

          <!-- Market vs Mama-put CTA -->
          <div class="bg-parentPrimary rounded-none sm:rounded-[1.75rem] p-4 sm:p-12 lg:p-16 text-white relative overflow-hidden">
            <div class="relative z-10 max-w-lg space-y-4 sm:space-y-5">
              <p class="text-[10px] tracking-wide uppercase text-white/70">weekend field guide</p>
              <h3 class="font-display text-2xl sm:text-4xl font-medium lowercase leading-tight">market vs mama-put</h3>
              <p class="text-white/85 text-sm leading-relaxed lowercase">save up to 40% of your budget by sourcing raw materials for your cooked meals. we've mapped out the best spots for you.</p>
              <div class="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 pt-2">
                <div class="px-5 py-3 bg-white/10 rounded-xl border border-white/20">
                  <p class="text-[10px] uppercase text-white/60">shopping days</p>
                  <p class="font-mono text-sm mt-0.5">weekends</p>
                </div>
                <div class="px-5 py-3 bg-white text-parentPrimary rounded-xl">
                  <p class="text-[10px] uppercase text-parentPrimary/60">est. savings</p>
                  <p class="font-mono text-sm mt-0.5">40% total</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup lang="ts">
import { Wallet, UtensilsCrossed, Zap, ChefHat, Target, ArrowUpRight } from 'lucide-vue-next';
import { ref, computed } from 'vue';
import { meal_planner_api } from '@/api_factory/modules/meal-planner';
import { useCustomToast } from '@/composables/core/useCustomToast';

definePageMeta({
  layout: 'student'
})

const { showToast } = useCustomToast();
const budget = ref(5000);
const formattedBudget = computed({
  get() {
    if (!budget.value) return '';
    return budget.value.toLocaleString('en-US');
  },
  set(val: string) {
    const clean = val.replace(/[^0-9.]/g, '');
    budget.value = clean ? Number(clean) : 0;
  }
});
const mealsPerDay = ref(3);
const loading = ref(false);
const plan = ref<any>(null);
const router = useRouter();

const handleMealClick = (meal: any) => {
  const vendorId = meal.options?.[0]?.product?.vendor?._id || meal.options?.[0]?.product?.vendor;
  if (vendorId) {
    router.push(`/vendors/${vendorId}`);
  }
};

const generatePlan = async () => {
  if (budget.value < 500) {
    showToast({
      title: 'Insufficient Budget',
      message: 'Please enter a budget of at least ₦500',
      toastType: 'warning'
    });
    return;
  }

  loading.value = true;
  try {
    const res = await meal_planner_api.generatePlan({ budget: budget.value, mealsPerDay: mealsPerDay.value });
    plan.value = res.data;
  } catch (e) {
    console.error(e);
    showToast({
      title: 'Optimization Failed',
      message: 'Could not generate plan. Please try again.',
      toastType: 'error'
    });
  } finally {
    loading.value = false;
  }
};

const downloadPdf = () => {
  window.print();
};

const getDayNutrients = (dayPlan: any) => {
  const categories = new Set<string>();
  dayPlan.meals.forEach((meal: any) => {
    meal.options.forEach((opt: any) => {
      categories.add(opt.nutritionalCategory || 'others');
    });
  });
  return Array.from(categories);
};

const getNutrientClass = (nutrient: string) => {
  switch (nutrient) {
    case 'carbs': return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'protein': return 'bg-rose-50 text-rose-700 border-rose-200';
    case 'vegetables': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'drinks': return 'bg-sky-50 text-sky-700 border-sky-200';
    case 'snacks': return 'bg-violet-50 text-violet-700 border-violet-200';
    default: return 'bg-[#FBFAF6] text-[#6B6455] border-[#E7E2D4]';
  }
};

useHead({
  title: 'Meal Planner - Errandr',
  meta: [
    { name: 'description', content: 'Generate a personalized student meal plan based on your campus budget.' }
  ]
});
</script>

<style scoped>
.font-display {
  font-family: 'Space Grotesk', 'Plus Jakarta Sans', sans-serif;
}
.font-mono {
  font-family: 'JetBrains Mono', 'IBM Plex Mono', monospace;
}

@media print {
  aside, .print\:hidden { display: none !important; }
  main { padding: 0 !important; margin: 0 !important; max-width: 100% !important; display: block !important; }
  section { width: 100% !important; display: block !important; }
  .bg-white {
    border: 1px solid #E7E2D4 !important;
    box-shadow: none !important;
    border-radius: 1rem !important;
    padding: 1.25rem !important;
  }
}
</style>