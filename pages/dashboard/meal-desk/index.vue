<template>
  <div class="min-h-screen bg-[#FDFCFB]">
    <!-- Top Nav -->
    <header class="bg-white border-b border-[#E7E2DA] sticky top-0 z-40">
      <div class="px-4 sm:px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <button @click="handleBack" type="button" class="p-2 hover:bg-gray-100 rounded-full transition-colors active:scale-95" title="Go Back">
            <ArrowLeft class="w-5 h-5 text-gray-900" />
          </button>
          <div>
            <div class="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              <span class="text-[#FF5C1A]">●</span> Route
              <span>·</span> Store
            </div>
            <h1 class="text-xl font-black text-gray-900 tracking-tight">Meal Desk</h1>
            <p class="text-[11px] text-gray-500 font-medium">Errandr Companion</p>
          </div>
        </div>
      </div>
    </header>

    <main class="container mx-auto px-4 py-6 sm:py-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
      <!-- Left Column: Controls & Intelligence -->
      <div class="lg:col-span-4 space-y-6">
        <!-- Input Card -->
        <div class="bg-white rounded-[24px] border border-[#E7E2DA] p-5 sm:p-6 shadow-sm relative overflow-hidden">
          <div class="flex items-center justify-between mb-5">
            <div>
              <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order Slip - Errandr</p>
              <h2 class="text-lg font-black text-gray-900">Meal Desk</h2>
            </div>
            <div class="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-[#FF5C1A] shadow-sm">
              <ChefHat class="w-5 h-5" />
            </div>
          </div>
          <div class="border-t border-dashed border-[#E7E2DA] mb-4 -mx-5 sm:-mx-6"></div>

          <!-- Student Wallet Balance Glance -->
          <div class="mb-5 p-3 rounded-2xl bg-orange-50/60 border border-orange-100/80 flex items-center justify-between">
            <div class="flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-xl bg-orange-100 text-[#FF5C1A] flex items-center justify-center shrink-0">
                <Wallet class="w-4 h-4" />
              </div>
              <div>
                <span class="text-[10px] font-bold text-gray-500 uppercase tracking-wider block leading-none">Wallet Balance</span>
                <span class="text-xs font-black text-gray-900 mt-0.5 block leading-tight">₦{{ (balance || 0).toLocaleString() }}</span>
              </div>
            </div>
            <button 
              type="button"
              @click="openFundWalletModal()"
              class="px-2.5 py-1 rounded-lg bg-white border border-[#E7E2DA] hover:border-[#FF5C1A] hover:bg-orange-50 text-[11px] font-bold text-[#FF5C1A] transition-all shadow-2xs active:scale-95"
            >
              + Fund
            </button>
          </div>

          <div class="space-y-5">
            <!-- Daily & Weekly Budget -->
            <div class="space-y-3">
              <div>
                <div class="flex items-center justify-between mb-1.5">
                  <label class="flex items-center gap-1.5 text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                    <Wallet class="w-3.5 h-3.5 text-[#FF5C1A]" /> Daily Meal Budget
                  </label>
                  <span class="text-[10px] font-semibold text-gray-400">Target per day</span>
                </div>
                <div class="relative">
                  <span class="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-gray-900 text-sm">₦</span>
                  <input 
                    type="text" 
                    v-model="formattedDailyBudget" 
                    placeholder="1,500"
                    class="w-full bg-[#FDFCFB] border border-[#E7E2DA] rounded-xl py-2.5 pl-8 pr-3 font-bold text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5C1A]/20 focus:border-[#FF5C1A] transition-all"
                  >
                </div>
              </div>

              <div>
                <div class="flex items-center justify-between mb-1.5">
                  <label class="flex items-center gap-1.5 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    Weekly Budget Total
                  </label>
                  <span class="text-[10px] font-semibold text-gray-400">7-day cycle</span>
                </div>
                <div class="relative">
                  <span class="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-gray-900 text-sm">₦</span>
                  <input 
                    type="text" 
                    v-model="formattedBudget" 
                    placeholder="10,000"
                    class="w-full bg-[#FDFCFB] border border-[#E7E2DA] rounded-xl py-2.5 pl-8 pr-3 font-bold text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5C1A]/20 focus:border-[#FF5C1A] transition-all"
                  >
                </div>
              </div>

              <!-- Budget Buffer Amount -->
              <div>
                <div class="flex items-center justify-between mb-1.5">
                  <label class="flex items-center gap-1.5 text-[11px] font-bold text-gray-700 uppercase tracking-wider">
                    <ShieldCheck class="w-3.5 h-3.5 text-emerald-600" /> Budget Buffer
                  </label>
                  <span class="text-[10px] font-semibold text-emerald-700">+₦{{ bufferAmount.toLocaleString() }} max</span>
                </div>
                <div class="grid grid-cols-4 gap-1.5">
                  <button 
                    v-for="amt in [0, 500, 1000, 2000]" 
                    :key="amt"
                    type="button"
                    @click="bufferAmount = amt"
                    :class="[
                      'py-1.5 px-1 rounded-lg text-xs font-bold transition-all border text-center active:scale-95',
                      bufferAmount === amt 
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-400 ring-1 ring-emerald-400' 
                        : 'bg-white text-gray-600 border-[#E7E2DA] hover:bg-gray-50'
                    ]"
                  >
                    {{ amt === 0 ? '₦0' : `+₦${amt.toLocaleString()}` }}
                  </button>
                </div>
                <p class="text-[10px] text-gray-400 mt-1 leading-tight">
                  Adds headroom if vendor combos exceed base budget by small variations.
                </p>
              </div>
            </div>

            <!-- Meals Per Day -->
            <div>
              <label class="flex items-center gap-2 text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                <Utensils class="w-3.5 h-3.5 text-[#FF5C1A]" /> Meals Per Day
              </label>
              <div class="grid grid-cols-3 gap-2">
                <button 
                  v-for="n in 3" :key="n"
                  @click="mealsPerDay = n"
                  :class="[
                    'py-2.5 rounded-xl text-sm font-bold transition-all border active:scale-95',
                    mealsPerDay === n 
                      ? 'bg-gray-900 text-white border-gray-900 shadow-md' 
                      : 'bg-white text-gray-600 border-[#E7E2DA] hover:bg-gray-50'
                  ]"
                >
                  {{ n }} {{ n === 1 ? 'meal' : 'meals' }}
                </button>
              </div>
            </div>

            <!-- Preferences & Constraints -->
            <div>
              <label class="flex items-center gap-2 text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                <Settings2 class="w-3.5 h-3.5 text-[#FF5C1A]" /> Preferences & Constraints
              </label>
              <div class="space-y-2.5">
                <!-- Medical & Diet Trigger -->
                <button 
                  @click="showMedicalModal = true" 
                  class="w-full flex items-center justify-between p-3.5 rounded-xl border border-[#E7E2DA] hover:border-gray-300 transition-all bg-white text-left group active:scale-[0.99]"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center text-rose-500 group-hover:scale-105 transition-transform">
                      <HeartPulse class="w-4 h-4" />
                    </div>
                    <div>
                      <span class="text-sm font-bold text-gray-800 block">Medical & Diet</span>
                      <span class="text-[11px] text-gray-400 font-medium">
                        {{ activeMedicalSummary }}
                      </span>
                    </div>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <span v-if="medicalConditions.length > 0 || dislikesList.length > 0" class="px-2 py-0.5 rounded-full text-[10px] font-black bg-orange-100 text-[#FF5C1A]">
                      {{ medicalConditions.length + dislikesList.length }}
                    </span>
                    <ChevronRight class="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>

                <!-- Preferred Vendors Trigger -->
                <button 
                  @click="showVendorsModal = true" 
                  class="w-full flex items-center justify-between p-3.5 rounded-xl border border-[#E7E2DA] hover:border-gray-300 transition-all bg-white text-left group active:scale-[0.99]"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-[#FF5C1A] group-hover:scale-105 transition-transform">
                      <Store class="w-4 h-4" />
                    </div>
                    <div>
                      <span class="text-sm font-bold text-gray-800 block">Preferred Vendors</span>
                      <span class="text-[11px] text-gray-400 font-medium">
                        {{ selectedVendors.length > 0 ? `${selectedVendors.length} selected` : 'All campus vendors' }}
                      </span>
                    </div>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <span v-if="selectedVendors.length > 0" class="px-2 py-0.5 rounded-full text-[10px] font-black bg-orange-100 text-[#FF5C1A]">
                      {{ selectedVendors.length }}
                    </span>
                    <ChevronRight class="w-4 h-4 text-gray-400 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>

                <!-- Custom Errands Suggestion Option Toggle -->
                <div class="flex items-center justify-between p-3.5 rounded-xl border border-[#E7E2DA] bg-white">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
                      <Sparkles class="w-4 h-4" />
                    </div>
                    <div>
                      <span class="text-xs font-bold text-gray-800 block">Allow Custom Errands</span>
                      <span class="text-[10px] text-gray-400 font-medium">Off-menu local mama-put fallback</span>
                    </div>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" v-model="allowCustomErrands" class="sr-only peer">
                    <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FF5C1A]"></div>
                  </label>
                </div>

                <!-- Include Drinks Toggle -->
                <div class="flex items-center justify-between p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <div class="flex items-center gap-2.5">
                    <div class="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                      <Coffee class="w-4 h-4" />
                    </div>
                    <div>
                      <span class="text-xs font-bold text-gray-800 block">Include Drinks</span>
                      <span class="text-[10px] text-gray-400 font-medium">Add chilled water/drink to meals</span>
                    </div>
                  </div>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" v-model="includeDrinks" class="sr-only peer">
                    <div class="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FF5C1A]"></div>
                  </label>
                </div>
              </div>
            </div>

            <!-- Optimize Button with Active Spinner -->
            <button 
              @click="generatePlan"
              :disabled="isGenerating || budget <= 0"
              class="w-full bg-[#FF5C1A] text-white font-black py-4 rounded-xl hover:bg-[#e6511a] active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 shadow-lg shadow-orange-500/25 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Loader2 v-if="isGenerating" class="w-5 h-5 animate-spin text-white" />
              <Zap v-else class="w-5 h-5 text-white" />
              <span class="text-base tracking-tight">
                {{ isGenerating ? 'Optimizing Your Plan...' : 'Optimize My Plan' }}
              </span>
            </button>
          </div>
        </div>

        <!-- Intelligence Report Card -->
        <div class="bg-[#171310] rounded-[24px] p-6 shadow-xl relative overflow-hidden text-white">
          <div class="flex items-center justify-between mb-4">
            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Intelligence Report</p>
            <div class="w-7 h-7 rounded-full bg-[#FF5C1A]/20 flex items-center justify-center text-[#FF5C1A]">
              <Brain class="w-3.5 h-3.5" />
            </div>
          </div>
          
          <p class="text-sm font-medium text-gray-300 leading-relaxed mb-6">
            Based on your budget, ordering cooked food from campus vendors is convenient and your <strong class="text-white">₦{{ budget.toLocaleString() }}</strong> budget covers roughly <strong class="text-[#00F0FF]">{{ calculatedDays }} days</strong> at {{ mealsPerDay }} meals/day.
          </p>

          <div class="border-t border-dashed border-gray-800 pt-4 flex items-end justify-between">
            <div>
              <p class="text-[10px] font-medium text-gray-500 mb-1">Potential Savings</p>
              <p class="text-2xl font-black text-[#00F0FF]">₦{{ potentialSavings.toLocaleString() }}</p>
            </div>
            <p class="text-[10px] text-gray-600 font-mono">stub no. 0000</p>
          </div>
          
          <!-- Decorative cutouts -->
          <div class="absolute top-1/2 -left-3 w-6 h-6 bg-[#FDFCFB] rounded-full -translate-y-1/2"></div>
          <div class="absolute top-1/2 -right-3 w-6 h-6 bg-[#FDFCFB] rounded-full -translate-y-1/2"></div>
        </div>
      </div>

      <!-- Right Column: Roadmap & Iterations -->
      <div class="lg:col-span-8">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2 class="text-2xl font-black text-gray-900 tracking-tight">Weekly Roadmap</h2>
            <p class="text-sm font-medium text-gray-500">Optimized for campus dining & nutrition</p>
          </div>
          <button 
            v-if="generatedPlan" 
            @click="downloadPlan"
            class="px-4 py-2 bg-white border border-[#E7E2DA] rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all flex items-center gap-2 active:scale-95 shadow-sm"
          >
            <Download class="w-4 h-4" /> Download PDF
          </button>
        </div>

        <!-- Banner -->
        <div class="bg-gradient-to-br from-[#FF5C1A] to-[#FF3B00] rounded-[28px] p-6 sm:p-8 text-white mb-8 shadow-xl shadow-orange-500/10 relative overflow-hidden">
          <div class="relative z-10">
            <p class="text-[10px] font-bold text-white/70 uppercase tracking-widest mb-2">Weekend Field Guide</p>
            <h3 class="text-2xl sm:text-3xl font-black mb-3">Campus Dining & Nutrition Planner</h3>
            <p class="text-white/90 text-sm font-medium leading-relaxed max-w-xl mb-6">
              Every meal is tailored from your preferred campus dining spots. Tap any meal to preview its ingredients & macro profile, or edit dishes to personalize each day.
            </p>
            
            <div class="flex flex-wrap gap-3">
              <div class="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2">
                <p class="text-[10px] font-medium text-white/70 uppercase mb-0.5">Meal Coverage</p>
                <p class="font-bold text-sm">{{ generatedPlan ? generatedPlan.days.length : 7 }} Days Active</p>
              </div>
              <div class="bg-white text-gray-900 rounded-xl px-4 py-2">
                <p class="text-[10px] font-medium text-gray-500 uppercase mb-0.5">Custom Errands</p>
                <p class="font-bold text-sm">{{ allowCustomErrands ? 'Enabled' : 'Disabled' }}</p>
              </div>
            </div>
          </div>
          <div class="absolute -right-8 -bottom-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        </div>

        <!-- LOADING STATE IN ROADMAP -->
        <div v-if="isGenerating" class="bg-white border border-[#E7E2DA] rounded-[24px] p-8 sm:p-12 text-center shadow-sm space-y-6">
          <div class="relative inline-flex items-center justify-center">
            <div class="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center text-[#FF5C1A] animate-pulse">
              <ChefHat class="w-10 h-10" />
            </div>
            <div class="absolute inset-0 rounded-full border-4 border-[#FF5C1A] border-t-transparent animate-spin"></div>
          </div>
          <div>
            <h3 class="text-xl font-black text-gray-900 mb-2">Optimizing Your Meal Roadmap...</h3>
            <p class="text-sm text-gray-500 max-w-md mx-auto">
              Analyzing campus vendor menus, verifying budget limits, and balancing nutrition according to your preferences.
            </p>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg mx-auto pt-2 opacity-60">
            <div class="h-20 bg-gray-100 rounded-xl animate-pulse"></div>
            <div class="h-20 bg-gray-100 rounded-xl animate-pulse"></div>
          </div>
        </div>

        <!-- Iterations Area (Mapped Plans) -->
        <div v-else-if="generatedPlan" class="space-y-6">
          <div class="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#E7E2DA] shadow-sm">
            <div>
              <div class="flex items-center gap-2">
                <span class="px-2.5 py-0.5 rounded-full text-xs font-black bg-orange-50 text-[#FF5C1A] border border-orange-200">
                  Option {{ currentIterationIndex + 1 }} of {{ iterations.length }}
                </span>
                <span class="text-xs text-gray-400 font-bold">Total: ₦{{ (generatedPlan.totalCost || 0).toLocaleString() }}</span>
              </div>
              <h4 class="text-lg font-black text-gray-900 mt-1">Iteration #{{ currentIterationIndex + 1 }}</h4>
            </div>

            <div class="flex items-center gap-2">
              <button 
                @click="prevIteration" 
                :disabled="currentIterationIndex === 0" 
                class="p-2.5 rounded-xl border border-[#E7E2DA] hover:bg-gray-50 active:scale-95 disabled:opacity-40 transition-all"
                title="Previous Option"
              >
                <ChevronLeft class="w-4 h-4 text-gray-700" />
              </button>
              <button 
                @click="nextIteration" 
                :disabled="currentIterationIndex === iterations.length - 1" 
                class="p-2.5 rounded-xl border border-[#E7E2DA] hover:bg-gray-50 active:scale-95 disabled:opacity-40 transition-all"
                title="Next Option"
              >
                <ChevronRight class="w-4 h-4 text-gray-700" />
              </button>
              <button 
                @click="spinAgain" 
                :disabled="isGenerating"
                class="flex items-center gap-2 px-3.5 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-gray-800 active:scale-95 transition-all shadow-sm disabled:opacity-60"
              >
                <RefreshCcw class="w-3.5 h-3.5" :class="{ 'animate-spin': isGenerating }" /> Spin Again
              </button>
            </div>
          </div>

          <!-- Financial Transparency Breakdown -->
          <div class="bg-white border border-[#E7E2DA] rounded-2xl p-4 shadow-sm">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-black text-gray-900 uppercase tracking-wider">Plan Cost Breakdown</span>
              <span class="text-xs font-semibold text-gray-400">All-Inclusive Campus Estimate</span>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div class="p-2.5 rounded-xl bg-orange-50/60 border border-orange-100">
                <span class="text-[10px] text-gray-500 font-medium block">🍲 Food Subtotal</span>
                <span class="text-sm font-black text-gray-900 mt-0.5 block">₦{{ Number(generatedPlan.foodSubtotal || (generatedPlan.totalCost ? generatedPlan.totalCost - (generatedPlan.days?.length || 7) * 400 - (generatedPlan.days?.length || 7) * (mealsPerDay || 2) * 150 : 0)).toLocaleString() }}</span>
              </div>
              <div class="p-2.5 rounded-xl bg-amber-50/60 border border-amber-100">
                <span class="text-[10px] text-gray-500 font-medium block">🥡 Takeaway Packs (₦150/ea)</span>
                <span class="text-sm font-black text-amber-900 mt-0.5 block">₦{{ Number(generatedPlan.packagingTotal || ((generatedPlan.days?.length || 7) * (mealsPerDay || 2) * 150)).toLocaleString() }}</span>
              </div>
              <div class="p-2.5 rounded-xl bg-emerald-50/60 border border-emerald-100">
                <span class="text-[10px] text-gray-500 font-medium block">🥷 Errand Ninja (₦350/day)</span>
                <span class="text-sm font-black text-emerald-900 mt-0.5 block">₦{{ Number(generatedPlan.deliveryTotal || ((generatedPlan.days?.length || 7) * 350)).toLocaleString() }}</span>
              </div>
              <div class="p-2.5 rounded-xl bg-indigo-50/60 border border-indigo-100">
                <span class="text-[10px] text-gray-500 font-medium block">⚡ Service Fee (₦50/day)</span>
                <span class="text-sm font-black text-indigo-900 mt-0.5 block">₦{{ Number(generatedPlan.serviceTotal || ((generatedPlan.days?.length || 7) * 50)).toLocaleString() }}</span>
              </div>
            </div>
          </div>

          <!-- Diet Balancer Warning / Insight -->
          <div v-if="healthNote" class="bg-indigo-50/80 border border-indigo-100 rounded-2xl p-4 sm:p-5 flex gap-3.5 shadow-sm">
            <div class="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 mt-0.5">
              <Activity class="w-5 h-5" />
            </div>
            <div>
              <p class="text-sm font-bold text-indigo-900 mb-0.5">Health & Nutrition Insight</p>
              <p class="text-xs sm:text-sm text-indigo-700 font-medium leading-relaxed">{{ healthNote }}</p>
            </div>
          </div>

          <!-- Budget Deficit Warning / Buffer Utilized Status -->
          <div v-if="budgetDeficit > 0 && budgetDeficit > bufferAmount" class="bg-rose-50 border border-rose-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
            <div class="flex gap-3.5">
              <div class="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 shrink-0 mt-0.5">
                <AlertTriangle class="w-5 h-5" />
              </div>
              <div>
                <p class="text-sm font-bold text-rose-900 mb-0.5">Budget Deficit Exceeds Buffer</p>
                <p class="text-xs sm:text-sm text-rose-700 font-medium">
                  This iteration costs <strong>₦{{ (generatedPlan.totalCost || 0).toLocaleString() }}</strong>, exceeding your base budget + safety buffer by <strong class="text-rose-900">₦{{ (budgetDeficit - bufferAmount).toLocaleString() }}</strong>.
                </p>
              </div>
            </div>
            <button 
              type="button"
              @click="openFundWalletModal(budgetDeficit > bufferAmount ? budgetDeficit - bufferAmount : budgetDeficit)"
              class="px-5 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 active:scale-95 transition-all whitespace-nowrap shadow-md shadow-rose-600/20 self-start sm:self-auto flex items-center gap-1.5"
            >
              <Wallet class="w-3.5 h-3.5" />
              Fund Wallet
            </button>
          </div>
          <div v-else-if="budgetDeficit > 0 && budgetDeficit <= bufferAmount" class="bg-emerald-50 border border-emerald-200 rounded-2xl p-3.5 sm:p-4 flex items-center justify-between gap-4 shadow-sm">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                <ShieldCheck class="w-4 h-4" />
              </div>
              <div>
                <p class="text-xs sm:text-sm font-bold text-emerald-950">Covered by Safety Buffer</p>
                <p class="text-[11px] sm:text-xs text-emerald-800 font-medium">
                  Utilizing <strong>₦{{ budgetDeficit.toLocaleString() }}</strong> of your <strong>₦{{ bufferAmount.toLocaleString() }}</strong> authorized buffer headroom.
                </p>
              </div>
            </div>
            <span class="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 shrink-0">
              Within Buffer
            </span>
          </div>

          <!-- Days List -->
          <div class="space-y-4">
            <div 
              v-for="(day, index) in (generatedPlan.days || [])" 
              :key="index" 
              class="bg-white border border-[#E7E2DA] rounded-2xl p-4 sm:p-6 shadow-sm hover:border-gray-300 transition-all"
            >
              <div class="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
                <div class="flex items-center gap-2.5">
                  <span class="w-7 h-7 rounded-lg bg-gray-900 text-white flex items-center justify-center text-xs font-bold">
                    {{ day.day || index + 1 }}
                  </span>
                  <h5 class="font-bold text-gray-900 text-base">Day {{ day.day || index + 1 }}</h5>
                </div>
                <div class="flex items-center gap-4">
                  <div class="text-right">
                    <span class="text-[10px] text-gray-400 font-medium uppercase tracking-wider block">Day Total</span>
                    <span class="text-sm font-black text-gray-900">₦{{ (day.totalCost || day.dailyCost || 0).toLocaleString() }}</span>
                  </div>
                  <button 
                    @click="openEditMeal(day, index, day.meals[0], 0)"
                    class="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-bold rounded-lg border border-gray-200 transition-colors flex items-center gap-1.5"
                  >
                    <Edit2 class="w-3.5 h-3.5 text-gray-500" />
                    <span>Edit Day</span>
                  </button>
                </div>
              </div>
              
              <div class="space-y-3">
                <div 
                  v-for="(meal, mIndex) in (day.meals || [])" 
                  :key="mIndex" 
                  @click="openMealBreakdown(meal, day.day || index + 1)"
                  class="flex items-center justify-between p-3.5 rounded-xl bg-gray-50/80 hover:bg-orange-50/30 hover:border-orange-200 border border-transparent transition-all cursor-pointer group"
                >
                  <div class="flex items-center gap-3.5 min-w-0">
                    <!-- Meal Type & Logo Badge -->
                    <div class="relative shrink-0">
                      <div 
                        v-if="meal.logo"
                        class="w-11 h-11 rounded-xl overflow-hidden border border-[#E7E2DA] bg-white shadow-sm flex items-center justify-center"
                      >
                        <img :src="meal.logo" class="w-full h-full object-cover" alt="Vendor" />
                      </div>
                      <div 
                        v-else
                        :class="[
                          'w-11 h-11 rounded-xl flex items-center justify-center text-xs font-black shadow-sm',
                          meal.isCustom ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-[#FF5C1A]'
                        ]"
                      >
                        <span v-if="meal.type === 'breakfast' || mIndex === 0">BF</span>
                        <span v-else-if="meal.type === 'lunch' || mIndex === 1">LU</span>
                        <span v-else>DI</span>
                      </div>

                      <span 
                        v-if="meal.isCustom" 
                        class="absolute -bottom-1 -right-1 w-4 h-4 bg-purple-600 text-white rounded-full flex items-center justify-center text-[9px] font-black"
                        title="Custom Errand fallback"
                      >
                        ★
                      </span>
                    </div>

                    <div class="min-w-0">
                      <div class="flex items-center gap-2">
                        <p class="text-sm font-bold text-gray-900 group-hover:text-[#FF5C1A] transition-colors truncate">
                          {{ meal.name }}
                        </p>
                        <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white border border-gray-200 text-gray-600 shrink-0">
                          {{ meal.type || (mIndex === 0 ? 'Breakfast' : mIndex === 1 ? 'Lunch' : 'Dinner') }}
                        </span>
                      </div>
                      <div class="flex items-center gap-2 text-xs font-medium text-gray-500 mt-0.5 flex-wrap">
                        <span class="flex items-center gap-1 truncate">
                          <Store class="w-3 h-3 text-gray-400 shrink-0" />
                          {{ meal.source }}
                        </span>
                        <span v-if="meal.isCustom" class="text-purple-600 font-bold">(Custom Request)</span>
                        <span class="text-gray-300">•</span>
                        <span class="text-[#FF5C1A] text-[11px] font-bold flex items-center gap-1 group-hover:underline">
                          <Eye class="w-3 h-3" /> View Breakdown
                        </span>
                      </div>
                    </div>
                  </div>

                  <div class="flex items-center gap-3 shrink-0 ml-3">
                    <span class="text-sm font-black text-gray-900">₦{{ (meal.price || 0).toLocaleString() }}</span>
                    <button 
                      @click.stop="openEditMeal(day, index, meal, mIndex)"
                      class="p-2 rounded-lg bg-white border border-gray-200 hover:border-orange-400 text-gray-400 hover:text-[#FF5C1A] transition-all shadow-sm"
                      title="Edit this meal"
                    >
                      <Edit2 class="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Action -->
          <div class="pt-4 flex flex-col sm:flex-row justify-end gap-3">
            <button 
              @click="pushToAutopilot" 
              class="w-full sm:w-auto bg-gray-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-gray-800 active:scale-95 transition-all shadow-xl flex items-center justify-center gap-2.5"
            >
              <Repeat class="w-5 h-5 text-orange-400" /> Push to Meal Autopilot
            </button>
          </div>
        </div>
        
        <!-- Empty State -->
        <div v-else class="h-80 border-2 border-dashed border-[#E7E2DA] rounded-3xl flex flex-col items-center justify-center text-center p-8 text-gray-400 bg-white/50">
          <div class="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center text-[#FF5C1A] mb-4">
            <ChefHat class="w-8 h-8" />
          </div>
          <h3 class="text-base font-bold text-gray-700 mb-1">Ready to optimize your campus meals?</h3>
          <p class="text-sm text-gray-400 max-w-sm mb-6">
            Enter your weekly budget on the left, pick your favorite vendors or diet constraints, and click <strong>Optimize My Plan</strong>.
          </p>
        </div>
      </div>
    </main>

    <!-- ========================================== -->
    <!-- PREFERRED VENDORS MODAL (FULL SCREEN MOBILE) -->
    <!-- ========================================== -->
    <div 
      v-if="showVendorsModal" 
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm sm:p-4"
    >
      <div class="bg-white w-full h-full sm:h-auto sm:max-h-[88vh] sm:max-w-2xl sm:rounded-[28px] rounded-none flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        <!-- Sticky Header -->
        <div class="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white">
          <div>
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center text-[#FF5C1A]">
                <Store class="w-4 h-4" />
              </div>
              <h3 class="text-xl font-black text-gray-900">Preferred Vendors</h3>
            </div>
            <p class="text-xs text-gray-500 font-medium mt-1">
              Select which campus dining spots to include in your meal plans
            </p>
          </div>
          <button 
            @click="showVendorsModal = false" 
            class="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors active:scale-95"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Search & Filter Controls -->
        <div class="px-5 sm:px-6 pt-4 pb-3 border-b border-gray-100 bg-[#FDFCFB] shrink-0 space-y-3">
          <div class="relative">
            <Search class="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              v-model="vendorSearchQuery"
              placeholder="Search vendors by name or category..." 
              class="w-full bg-white border border-[#E7E2DA] rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF5C1A]/20 focus:border-[#FF5C1A] transition-all"
            />
            <button 
              v-if="vendorSearchQuery" 
              @click="vendorSearchQuery = ''"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs"
            >
              Clear
            </button>
          </div>

          <div class="flex items-center justify-between text-xs">
            <div class="flex items-center gap-2">
              <span class="font-bold text-gray-600">
                {{ selectedVendors.length }} of {{ allVendors.length }} selected
              </span>
              <span v-if="selectedVendors.length === 0" class="text-gray-400 font-medium">
                (Default: All vendors)
              </span>
            </div>
            <div class="flex items-center gap-3">
              <button 
                @click="selectAllVendors" 
                class="font-bold text-[#FF5C1A] hover:text-[#e6511a] active:scale-95 transition-transform"
              >
                Select All
              </button>
              <span class="text-gray-300">|</span>
              <button 
                @click="clearAllVendors" 
                class="font-bold text-gray-500 hover:text-gray-700 active:scale-95 transition-transform"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>

        <!-- Scrollable Vendor Cards List -->
        <div class="flex-1 overflow-y-auto p-5 sm:p-6 space-y-3">
          <div v-if="filteredVendors.length === 0" class="text-center py-12 text-gray-400">
            <Store class="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p class="font-bold text-gray-600">No vendors found</p>
            <p class="text-xs text-gray-400">Try adjusting your search query</p>
          </div>

          <div 
            v-else 
            class="grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            <div 
              v-for="v in filteredVendors" 
              :key="v._id"
              @click="toggleVendor(v._id)"
              :class="[
                'p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 group select-none active:scale-[0.99]',
                isVendorSelected(v._id)
                  ? 'bg-orange-50/50 border-[#FF5C1A] shadow-sm ring-1 ring-[#FF5C1A]'
                  : 'bg-white border-[#E7E2DA] hover:border-gray-300 hover:bg-gray-50/50'
              ]"
            >
              <div class="flex items-center gap-3 min-w-0">
                <!-- Vendor Logo / Avatar -->
                <div class="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0 flex items-center justify-center relative">
                  <img 
                    v-if="v.logo || v.image || v.banner" 
                    :src="v.logo || v.image || v.banner" 
                    class="w-full h-full object-cover" 
                    :alt="v.storeName" 
                  />
                  <span 
                    v-else 
                    class="text-base font-black text-gray-500 uppercase"
                  >
                    {{ v.storeName?.slice(0, 2) || 'VN' }}
                  </span>
                </div>

                <div class="min-w-0">
                  <h4 class="text-sm font-bold text-gray-900 truncate group-hover:text-[#FF5C1A] transition-colors">
                    {{ v.storeName }}
                  </h4>
                  <div class="flex items-center gap-1.5 flex-wrap mt-0.5">
                    <span class="text-[10px] font-bold px-2 py-0.5 bg-gray-100 text-gray-600 rounded-md truncate max-w-[110px]">
                      {{ v.category || 'Food' }}
                    </span>
                    <span 
                      v-if="v.isInsideCampus" 
                      class="text-[9px] font-black px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded-md"
                    >
                      On Campus
                    </span>
                  </div>
                </div>
              </div>

              <!-- Selection Indicator (Brand Colored Tick) -->
              <div 
                :class="[
                  'w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all border',
                  isVendorSelected(v._id)
                    ? 'bg-[#FF5C1A] border-[#FF5C1A] text-white shadow-sm shadow-orange-500/25'
                    : 'border-gray-300 bg-white group-hover:border-gray-400'
                ]"
              >
                <Check v-if="isVendorSelected(v._id)" class="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </div>
          </div>
        </div>

        <!-- Sticky Footer -->
        <div class="p-4 sm:p-6 border-t border-gray-100 bg-white shrink-0 flex items-center justify-between gap-4 shadow-lg">
          <p class="text-xs text-gray-500 font-medium hidden sm:block">
            {{ selectedVendors.length ? `${selectedVendors.length} vendors prioritized` : 'Using all approved campus vendors' }}
          </p>
          <button 
            @click="showVendorsModal = false" 
            class="w-full sm:w-auto sm:min-w-[180px] bg-gray-900 text-white font-bold py-3.5 px-6 rounded-xl hover:bg-gray-800 active:scale-95 transition-all text-sm shadow-md"
          >
            Save Preferences ({{ selectedVendors.length }})
          </button>
        </div>
      </div>
    </div>

    <!-- ================================================== -->
    <!-- MEDICAL & DIET CONSTRAINTS MODAL (FULL SCREEN MOBILE) -->
    <!-- ================================================== -->
    <div 
      v-if="showMedicalModal" 
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm sm:p-4"
    >
      <div class="bg-white w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-2xl sm:rounded-[28px] rounded-none flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        <!-- Sticky Header -->
        <div class="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white">
          <div>
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
                <HeartPulse class="w-4 h-4" />
              </div>
              <h3 class="text-xl font-black text-gray-900">Medical & Diet Constraints</h3>
            </div>
            <p class="text-xs text-gray-500 font-medium mt-1">
              Personalize safety filters, dietary requirements, and foods to avoid
            </p>
          </div>
          <button 
            @click="showMedicalModal = false" 
            class="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors active:scale-95"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Scrollable Body -->
        <div class="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          <!-- Medical Conditions Section -->
          <div>
            <div class="flex items-center justify-between mb-3">
              <label class="text-xs font-black text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck class="w-4 h-4 text-rose-500" /> Medical Conditions
              </label>
              <span class="text-[11px] text-gray-400 font-medium">Select all that apply</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div 
                v-for="cond in medicalOptions" 
                :key="cond.id"
                @click="toggleCondition(cond.name)"
                :class="[
                  'p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 group select-none active:scale-[0.99]',
                  medicalConditions.includes(cond.name)
                    ? 'bg-orange-50/50 border-[#FF5C1A] shadow-sm ring-1 ring-[#FF5C1A]'
                    : 'bg-white border-[#E7E2DA] hover:border-gray-300 hover:bg-gray-50/50'
                ]"
              >
                <div class="flex items-center gap-3 min-w-0">
                  <div 
                    :class="[
                      'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors',
                      medicalConditions.includes(cond.name) ? 'bg-orange-100 text-[#FF5C1A]' : 'bg-gray-100 text-gray-500'
                    ]"
                  >
                    <component :is="cond.icon" class="w-4 h-4" />
                  </div>
                  <div class="min-w-0">
                    <p class="text-xs font-bold text-gray-900 truncate">{{ cond.name }}</p>
                    <p class="text-[10px] text-gray-500 font-medium mt-0.5">{{ cond.rule }}</p>
                  </div>
                </div>

                <div 
                  :class="[
                    'w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all border',
                    medicalConditions.includes(cond.name)
                      ? 'bg-[#FF5C1A] border-[#FF5C1A] text-white shadow-sm shadow-orange-500/25'
                      : 'border-gray-300 bg-white group-hover:border-gray-400'
                  ]"
                >
                  <Check v-if="medicalConditions.includes(cond.name)" class="w-3 h-3 stroke-[3]" />
                </div>
              </div>
            </div>
          </div>

          <!-- Dietary Lifestyles Section -->
          <div>
            <div class="flex items-center justify-between mb-3">
              <label class="text-xs font-black text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles class="w-4 h-4 text-orange-500" /> Dietary Goals & Lifestyles
              </label>
              <span class="text-[11px] text-gray-400 font-medium">Nutritional preferences</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div 
                v-for="goal in lifestyleOptions" 
                :key="goal.id"
                @click="toggleCondition(goal.name)"
                :class="[
                  'p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 group select-none active:scale-[0.99]',
                  medicalConditions.includes(goal.name)
                    ? 'bg-orange-50/50 border-orange-400 shadow-sm ring-1 ring-orange-400'
                    : 'bg-white border-[#E7E2DA] hover:border-gray-300 hover:bg-gray-50/50'
                ]"
              >
                <div class="flex items-center gap-3 min-w-0">
                  <div 
                    :class="[
                      'w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors',
                      medicalConditions.includes(goal.name) ? 'bg-orange-100 text-[#FF5C1A]' : 'bg-gray-100 text-gray-500'
                    ]"
                  >
                    <component :is="goal.icon" class="w-4 h-4" />
                  </div>
                  <div class="min-w-0">
                    <p class="text-xs font-bold text-gray-900 truncate">{{ goal.name }}</p>
                    <p class="text-[10px] text-gray-500 font-medium mt-0.5">{{ goal.rule }}</p>
                  </div>
                </div>

                <div 
                  :class="[
                    'w-5 h-5 rounded-full flex items-center justify-center shrink-0 transition-all border',
                    medicalConditions.includes(goal.name)
                      ? 'bg-[#FF5C1A] border-[#FF5C1A] text-white'
                      : 'border-gray-300 bg-white group-hover:border-gray-400'
                  ]"
                >
                  <Check v-if="medicalConditions.includes(goal.name)" class="w-3 h-3 stroke-[3]" />
                </div>
              </div>
            </div>
          </div>

          <!-- Common Dislikes & Allergens -->
          <div>
            <label class="text-xs font-black text-gray-900 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <AlertCircle class="w-4 h-4 text-amber-500" /> Dislikes & Foods to Avoid
            </label>
            <p class="text-xs text-gray-500 font-medium mb-3">
              Tap any common food aversion to exclude it from your iterations:
            </p>

            <div class="flex flex-wrap gap-2 mb-4">
              <button 
                v-for="chip in commonDislikeChips" 
                :key="chip"
                @click="toggleDislikeChip(chip)"
                :class="[
                  'px-3 py-1.5 rounded-full text-xs font-bold transition-all border flex items-center gap-1.5 active:scale-95',
                  dislikesList.includes(chip)
                    ? 'bg-[#FF5C1A] text-white border-[#FF5C1A] shadow-sm shadow-orange-500/20'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
                ]"
              >
                <span>{{ chip }}</span>
                <span v-if="dislikesList.includes(chip)" class="text-white/80 font-black">×</span>
              </button>
            </div>

            <!-- Custom text input for extra dislikes -->
            <div class="space-y-1.5">
              <span class="text-[11px] font-bold text-gray-500">Other custom dislikes (comma separated):</span>
              <input 
                type="text" 
                v-model="customDislikesText" 
                placeholder="e.g. Scent leaf, Snails, Bitter leaf"
                class="w-full bg-[#FDFCFB] border border-[#E7E2DA] rounded-xl p-3 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
              />
            </div>
          </div>

        </div>

        <!-- Sticky Footer -->
        <div class="p-4 sm:p-6 border-t border-gray-100 bg-white shrink-0 flex items-center justify-between gap-4 shadow-lg">
          <p class="text-xs text-gray-500 font-medium hidden sm:block">
            {{ medicalConditions.length }} constraints & {{ allDislikesCombined.length }} excluded foods
          </p>
          <button 
            @click="showMedicalModal = false" 
            class="w-full sm:w-auto sm:min-w-[180px] bg-gray-900 text-white font-bold py-3.5 px-6 rounded-xl hover:bg-gray-800 active:scale-95 transition-all text-sm shadow-md"
          >
            Save Preferences
          </button>
        </div>
      </div>
    </div>

    <!-- ================================================== -->
    <!-- MEAL BREAKDOWN PREVIEW MODAL (FULL SCREEN MOBILE) -->
    <!-- ================================================== -->
    <div 
      v-if="showBreakdownModal && selectedMealForBreakdown" 
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm sm:p-4"
    >
      <div class="bg-white w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-xl sm:rounded-[28px] rounded-none flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        <!-- Header -->
        <div class="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
          <div>
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-orange-50 text-[#FF5C1A] border border-orange-200">
                {{ selectedMealForBreakdown.type || 'Meal' }}
              </span>
              <span class="text-xs font-bold text-gray-400">Day {{ selectedDayForBreakdown }}</span>
            </div>
            <h3 class="text-xl font-black text-gray-900 mt-1 truncate max-w-sm">
              {{ selectedMealForBreakdown.name }}
            </h3>
          </div>
          <button 
            @click="showBreakdownModal = false" 
            class="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors active:scale-95"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Scrollable Breakdown Content -->
        <div class="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          <!-- Vendor & Pricing Header Pill -->
          <div class="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex items-center justify-between gap-4">
            <div class="flex items-center gap-3 min-w-0">
              <div class="w-12 h-12 rounded-xl overflow-hidden bg-white border border-gray-200 shrink-0 flex items-center justify-center">
                <img 
                  v-if="selectedMealForBreakdown.logo" 
                  :src="selectedMealForBreakdown.logo" 
                  class="w-full h-full object-cover" 
                  alt="Vendor" 
                />
                <Store v-else class="w-6 h-6 text-gray-400" />
              </div>
              <div class="min-w-0">
                <p class="text-sm font-black text-gray-900 truncate">{{ selectedMealForBreakdown.source }}</p>
                <p class="text-xs text-gray-500 font-medium">Campus Dining Vendor</p>
              </div>
            </div>
            <div class="text-right shrink-0">
              <span class="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Est. Cost</span>
              <span class="text-lg font-black text-gray-900">₦{{ (selectedMealForBreakdown.price || 0).toLocaleString() }}</span>
            </div>
          </div>

          <!-- What Makes Up This Meal -->
          <div>
            <div class="flex items-center justify-between mb-3">
              <h4 class="text-xs font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <Utensils class="w-4 h-4 text-[#FF5C1A]" /> What Makes Up This Meal
              </h4>
              <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                Portion & Price Breakdown
              </span>
            </div>

            <div class="space-y-2.5">
              <div 
                v-for="(item, idx) in mealBreakdownItems" 
                :key="idx" 
                class="flex items-center justify-between p-3.5 rounded-xl border border-gray-100 bg-[#FDFCFB] hover:border-gray-200 transition-all"
                :class="item.category === 'Packaging' ? 'bg-amber-50/50 border-amber-200/60' : ''"
              >
                <div class="flex items-center gap-3 min-w-0">
                  <div 
                    class="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black shrink-0"
                    :class="item.category === 'Packaging' ? 'bg-amber-100 text-amber-800' : 'bg-orange-100/60 text-[#FF5C1A]'"
                  >
                    {{ idx + 1 }}
                  </div>
                  <div class="min-w-0">
                    <div class="flex items-center gap-2 flex-wrap">
                      <p class="text-xs font-bold text-gray-900 truncate">{{ item.name }}</p>
                      <span v-if="item.category === 'Packaging'" class="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 uppercase">Packaging</span>
                      <span v-else-if="item.portion" class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-600">
                        {{ item.portion }}
                      </span>
                    </div>
                    <p class="text-[10px] text-gray-400 font-medium mt-0.5">
                      {{ item.category }} <span v-if="item.calories && item.calories > 0">• ~{{ item.calories }} kcal</span>
                    </p>
                  </div>
                </div>
                <div class="text-right shrink-0 ml-3">
                  <span class="text-xs font-black" :class="item.category === 'Packaging' ? 'text-amber-800' : 'text-gray-900'">
                    ₦{{ Number(item.price || 0).toLocaleString() }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Meal Price Composition Summary -->
            <div class="mt-3.5 p-3.5 rounded-xl bg-orange-50/50 border border-orange-100 flex items-center justify-between">
              <div>
                <p class="text-[11px] font-bold text-gray-900">Total Meal Price Composition</p>
                <p class="text-[10px] text-gray-500">Calculated directly from vendor portions + takeaway packaging</p>
              </div>
              <div class="text-right">
                <span class="text-base font-black text-[#FF5C1A]">₦{{ (selectedMealForBreakdown.price || 0).toLocaleString() }}</span>
              </div>
            </div>
          </div>

          <!-- Nutritional & Macro Profile -->
          <div>
            <div class="flex items-center justify-between mb-3">
              <h4 class="text-xs font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
                <Activity class="w-4 h-4 text-emerald-500" /> Macronutrient Profile
              </h4>
              <span class="text-xs font-black text-[#FF5C1A] bg-orange-50 px-2 py-0.5 rounded-full border border-orange-200">
                🔥 ~{{ mealNutrition.calories }} Total Calories
              </span>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              <div class="bg-blue-50/70 border border-blue-100 rounded-xl p-3 text-center">
                <p class="text-[10px] font-bold text-blue-600 uppercase">Protein</p>
                <p class="text-base font-black text-blue-900 mt-0.5">{{ mealNutrition.protein }}g</p>
              </div>
              <div class="bg-amber-50/70 border border-amber-100 rounded-xl p-3 text-center">
                <p class="text-[10px] font-bold text-amber-600 uppercase">Carbohydrates</p>
                <p class="text-base font-black text-amber-900 mt-0.5">{{ mealNutrition.carbs }}g</p>
              </div>
              <div class="bg-rose-50/70 border border-rose-100 rounded-xl p-3 text-center">
                <p class="text-[10px] font-bold text-rose-600 uppercase">Fats</p>
                <p class="text-base font-black text-rose-900 mt-0.5">{{ mealNutrition.fats }}g</p>
              </div>
              <div class="bg-emerald-50/70 border border-emerald-100 rounded-xl p-3 text-center">
                <p class="text-[10px] font-bold text-emerald-600 uppercase">Fiber</p>
                <p class="text-base font-black text-emerald-900 mt-0.5">{{ mealNutrition.fiber }}g</p>
              </div>
            </div>
          </div>

          <!-- Student Nutritional Benefit Insight -->
          <div class="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4">
            <div class="flex items-center gap-2 text-indigo-900 font-bold text-xs mb-1">
              <Sparkles class="w-3.5 h-3.5 text-indigo-600" /> Nutritional Benefit
            </div>
            <p class="text-xs text-indigo-800 font-medium leading-relaxed">
              {{ mealNutrition.benefit }}
            </p>
          </div>

        </div>

        <!-- Sticky Footer -->
        <div class="p-4 sm:p-6 border-t border-gray-100 bg-white shrink-0 flex items-center justify-between gap-3">
          <button 
            @click="triggerEditFromBreakdown" 
            class="flex-1 bg-gray-100 text-gray-800 font-bold py-3.5 px-4 rounded-xl hover:bg-gray-200 active:scale-95 transition-all text-xs flex items-center justify-center gap-2"
          >
            <Edit2 class="w-3.5 h-3.5" /> Edit This Meal
          </button>
          <button 
            @click="showBreakdownModal = false" 
            class="flex-1 bg-gray-900 text-white font-bold py-3.5 px-4 rounded-xl hover:bg-gray-800 active:scale-95 transition-all text-xs"
          >
            Done
          </button>
        </div>

      </div>
    </div>

    <!-- ================================================== -->
    <!-- EDIT MEAL / ITERATION MODAL (FULL SCREEN MOBILE)   -->
    <!-- ================================================== -->
    <div 
      v-if="showEditModal" 
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm sm:p-4"
    >
      <div class="bg-white w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-2xl sm:rounded-[28px] rounded-none flex flex-col overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        <!-- Sticky Header -->
        <div class="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
          <div>
            <div class="flex items-center gap-2">
              <span class="px-2.5 py-0.5 rounded-full text-[11px] font-black uppercase tracking-wider bg-orange-50 text-[#FF5C1A] border border-orange-200">
                Day {{ editingDayNumber }} • {{ editingMeal?.type || 'Meal' }}
              </span>
            </div>
            <h3 class="text-xl font-black text-gray-900 mt-1">
              Edit & Swap Meal
            </h3>
            <p class="text-xs text-gray-500 font-medium">
              Choose an alternative dish from your vendors or enter a custom request
            </p>
          </div>
          <button 
            @click="showEditModal = false" 
            class="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors active:scale-95"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Mode Tabs -->
        <div class="px-5 sm:px-6 pt-3 pb-2 border-b border-gray-100 bg-[#FDFCFB] flex gap-2 shrink-0">
          <button 
            @click="editingMode = 'swap'"
            :class="[
              'px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2',
              editingMode === 'swap' 
                ? 'bg-gray-900 text-white shadow-sm' 
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            ]"
          >
            <Store class="w-3.5 h-3.5" /> Swap Vendor Dishes
          </button>
          <button 
            @click="editingMode = 'custom'"
            :class="[
              'px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2',
              editingMode === 'custom' 
                ? 'bg-gray-900 text-white shadow-sm' 
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            ]"
          >
            <Edit2 class="w-3.5 h-3.5" /> Custom Dish Input
          </button>
        </div>

        <!-- Scrollable Body -->
        <div class="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4">
          
          <!-- Mode 1: Swap From Vendor Items -->
          <div v-if="editingMode === 'swap'" class="space-y-4">
            <div class="relative">
              <Search class="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                v-model="editItemSearchQuery"
                placeholder="Search vendor menu items..." 
                class="w-full bg-[#FDFCFB] border border-[#E7E2DA] rounded-xl py-2.5 pl-10 pr-4 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FF5C1A]/20 focus:border-[#FF5C1A] transition-all"
              />
            </div>

            <p class="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
              Tap a dish to swap into Day {{ editingDayNumber }}:
            </p>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
              <div 
                v-for="item in filteredAvailableItems" 
                :key="item._id"
                @click="selectSwapItem(item)"
                :class="[
                  'p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 group active:scale-[0.99]',
                  selectedSwapItem?._id === item._id 
                    ? 'bg-orange-50/50 border-[#FF5C1A] ring-1 ring-[#FF5C1A] shadow-sm' 
                    : 'bg-white border-gray-200 hover:border-gray-300 hover:bg-gray-50/50'
                ]"
              >
                <div class="flex items-center gap-3 min-w-0">
                  <div class="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shrink-0 flex items-center justify-center">
                    <img 
                      v-if="item.image || item.vendor?.logo" 
                      :src="item.image || item.vendor?.logo" 
                      class="w-full h-full object-cover" 
                      alt="dish" 
                    />
                    <Store v-else class="w-4 h-4 text-gray-400" />
                  </div>
                  <div class="min-w-0">
                    <p class="text-xs font-bold text-gray-900 truncate group-hover:text-[#FF5C1A] transition-colors">
                      {{ item.name }}
                    </p>
                    <p class="text-[10px] text-gray-500 font-medium truncate mt-0.5">
                      {{ item.vendor?.storeName || 'Campus Vendor' }}
                    </p>
                  </div>
                </div>

                <div class="text-right shrink-0">
                  <span class="text-xs font-black text-gray-900 block">₦{{ (item.price || 0).toLocaleString() }}</span>
                  <span 
                    v-if="selectedSwapItem?._id === item._id" 
                    class="text-[9px] font-bold text-[#FF5C1A]"
                  >
                    Selected
                  </span>
                </div>
              </div>
            </div>
          </div>

          <!-- Mode 2: Custom Dish Input -->
          <div v-else class="space-y-4">
            <div>
              <label class="text-xs font-bold text-gray-700 block mb-1.5">Meal / Dish Name</label>
              <input 
                type="text" 
                v-model="customEditName"
                placeholder="e.g. Asun Rice & Fried Plantain"
                class="w-full bg-[#FDFCFB] border border-[#E7E2DA] rounded-xl p-3 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF5C1A]/20 focus:border-[#FF5C1A]"
              />
            </div>

            <div>
              <label class="text-xs font-bold text-gray-700 block mb-1.5">Estimated Price (₦)</label>
              <input 
                type="number" 
                v-model.number="customEditPrice"
                placeholder="2000"
                class="w-full bg-[#FDFCFB] border border-[#E7E2DA] rounded-xl p-3 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF5C1A]/20 focus:border-[#FF5C1A]"
              />
            </div>

            <div>
              <label class="text-xs font-bold text-gray-700 block mb-1.5">Vendor or Request Source</label>
              <input 
                type="text" 
                v-model="customEditVendor"
                placeholder="e.g. Tasty Delight or Mama-put Special"
                class="w-full bg-[#FDFCFB] border border-[#E7E2DA] rounded-xl p-3 text-sm font-medium text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF5C1A]/20 focus:border-[#FF5C1A]"
              />
            </div>
          </div>

        </div>

        <!-- Sticky Footer -->
        <div class="p-4 sm:p-6 border-t border-gray-100 bg-white shrink-0 flex items-center justify-between gap-4 shadow-lg">
          <div>
            <p class="text-xs font-bold text-gray-900">
              New Meal Cost: 
              <span class="text-[#FF5C1A]">₦{{ (currentPreviewPrice || 0).toLocaleString() }}</span>
            </p>
            <p class="text-[10px] text-gray-400 font-medium">Budget and nutrition will re-evaluate on save</p>
          </div>
          <button 
            @click="saveMealEdit" 
            class="bg-gray-900 text-white font-bold py-3.5 px-6 rounded-xl hover:bg-gray-800 active:scale-95 transition-all text-xs shadow-md"
          >
            Save & Recalculate Roadmap
          </button>
        </div>

      </div>
    </div>

    <!-- ============================================ -->
    <!-- WALLET FUNDING MODAL (In-Page, No Redirection) -->
    <!-- ============================================ -->
    <div 
      v-if="showFundWalletModal" 
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      @click.self="showFundWalletModal = false"
    >
      <div class="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        <!-- Modal Header -->
        <div class="p-5 sm:p-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white relative">
          <button 
            @click="showFundWalletModal = false" 
            class="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all active:scale-95"
          >
            <X class="w-4 h-4" />
          </button>
          <div class="flex items-center gap-3 mb-2">
            <div class="w-10 h-10 rounded-2xl bg-[#FF5C1A] flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
              <Wallet class="w-5 h-5" />
            </div>
            <div>
              <h3 class="text-base sm:text-lg font-black tracking-tight">Fund Your Wallet</h3>
              <p class="text-xs text-gray-300 font-medium">Add funds directly without leaving Meal Desk</p>
            </div>
          </div>

          <!-- Quick Balance Bar -->
          <div class="mt-4 p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 flex items-center justify-between">
            <div>
              <span class="text-[10px] font-bold text-gray-300 uppercase tracking-wider block">Current Balance</span>
              <span class="text-base font-black text-white">₦{{ (balance || 0).toLocaleString() }}</span>
            </div>
            <div v-if="budgetDeficit > 0" class="text-right">
              <span class="text-[10px] font-bold text-rose-300 uppercase tracking-wider block">Plan Deficit</span>
              <span class="text-xs font-black text-rose-300">+₦{{ budgetDeficit.toLocaleString() }}</span>
            </div>
          </div>
        </div>

        <!-- Method Switcher Tabs -->
        <div class="grid grid-cols-2 p-1.5 m-5 bg-gray-100 rounded-2xl gap-1">
          <button 
            type="button"
            @click="activeFundMethod = 'paystack'"
            :class="[
              'py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5',
              activeFundMethod === 'paystack'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            ]"
          >
            <CreditCard class="w-3.5 h-3.5 text-[#FF5C1A]" />
            Paystack / Card
          </button>
          <button 
            type="button"
            @click="activeFundMethod = 'virtual_account'"
            :class="[
              'py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5',
              activeFundMethod === 'virtual_account'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-900'
            ]"
          >
            <Landmark class="w-3.5 h-3.5 text-emerald-600" />
            Bank Transfer
          </button>
        </div>

        <!-- Content Area -->
        <div class="px-5 pb-6">
          <!-- 1. PAYSTACK METHOD -->
          <div v-if="activeFundMethod === 'paystack'" class="space-y-4">
            <!-- Amount Input -->
            <div>
              <label class="text-[11px] font-bold text-gray-600 uppercase tracking-wider block mb-1.5">
                Funding Amount
              </label>
              <div class="relative">
                <span class="absolute left-4 top-1/2 -translate-y-1/2 font-black text-gray-900 text-base">₦</span>
                <input 
                  type="text" 
                  v-model="formattedFundAmount" 
                  placeholder="5,000"
                  class="w-full bg-[#FDFCFB] border border-[#E7E2DA] rounded-2xl py-3 pl-9 pr-4 font-black text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-[#FF5C1A]/20 focus:border-[#FF5C1A] transition-all"
                >
              </div>
            </div>

            <!-- Quick Amount Chips -->
            <div>
              <label class="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">Quick Presets</label>
              <div class="flex flex-wrap gap-1.5">
                <button 
                  v-if="budgetDeficit > 0"
                  type="button"
                  @click="fundAmount = budgetDeficit"
                  :class="[
                    'py-1.5 px-2.5 rounded-xl text-xs font-bold transition-all border active:scale-95 flex items-center gap-1',
                    fundAmount === budgetDeficit 
                      ? 'bg-rose-50 text-rose-700 border-rose-300 ring-1 ring-rose-300' 
                      : 'bg-rose-50/50 text-rose-600 border-rose-200 hover:bg-rose-50'
                  ]"
                >
                  <AlertCircle class="w-3 h-3" />
                  Exact Deficit (₦{{ budgetDeficit.toLocaleString() }})
                </button>
                <button 
                  v-for="amt in [2000, 5000, 10000, 20000]" 
                  :key="amt"
                  type="button"
                  @click="fundAmount = amt"
                  :class="[
                    'py-1.5 px-2.5 rounded-xl text-xs font-bold transition-all border active:scale-95',
                    fundAmount === amt 
                      ? 'bg-gray-900 text-white border-gray-900 shadow-sm' 
                      : 'bg-white text-gray-600 border-[#E7E2DA] hover:bg-gray-50'
                  ]"
                >
                  ₦{{ amt.toLocaleString() }}
                </button>
              </div>
            </div>

            <!-- Preview Balance -->
            <div class="p-3 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between text-xs">
              <span class="text-gray-500 font-medium">Balance After Funding:</span>
              <span class="font-black text-emerald-600 text-sm">
                ₦{{ ((balance || 0) + Number(fundAmount || 0)).toLocaleString() }}
              </span>
            </div>

            <!-- Pay Button -->
            <button 
              type="button"
              @click="initiatePaystackFunding"
              :disabled="isInitializingFunding || fundAmount < 100"
              class="w-full py-3.5 bg-[#FF5C1A] text-white rounded-2xl font-bold text-sm hover:bg-[#e04f14] active:scale-[0.99] disabled:opacity-50 transition-all shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2"
            >
              <Loader2 v-if="isInitializingFunding" class="w-4 h-4 animate-spin" />
              <span v-else>Pay with Paystack</span>
              <ArrowRight v-if="!isInitializingFunding" class="w-4 h-4" />
            </button>
            <p class="text-[10px] text-gray-400 text-center font-medium">
              🔒 256-bit encrypted via Paystack. Supports Debit Card, USSD & Apple Pay.
            </p>
          </div>

          <!-- 2. VIRTUAL ACCOUNT METHOD -->
          <div v-else class="space-y-4">
            <div class="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/80 relative">
              <div class="flex items-center justify-between mb-2.5">
                <span class="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                  Dedicated Account
                </span>
                <span class="text-xs font-bold text-emerald-700">
                  {{ wallet?.virtualAccount?.bankName || 'Wema Bank' }}
                </span>
              </div>

              <!-- Account Number & Copy -->
              <div class="flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-emerald-100 shadow-sm mb-2.5">
                <div>
                  <span class="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Account Number</span>
                  <span class="text-lg font-black text-gray-900 tracking-wider font-mono">
                    {{ wallet?.virtualAccount?.accountNumber || 'Generating account...' }}
                  </span>
                </div>
                <button 
                  type="button"
                  @click="copyAccountNumber"
                  class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
                >
                  <CheckCheck v-if="copiedAccount" class="w-3.5 h-3.5" />
                  <Copy v-else class="w-3.5 h-3.5" />
                  {{ copiedAccount ? 'Copied!' : 'Copy' }}
                </button>
              </div>

              <!-- Account Name -->
              <div>
                <span class="text-[9px] font-bold text-emerald-900/60 uppercase tracking-wider block">Account Name</span>
                <span class="text-xs font-bold text-emerald-950 truncate block">
                  {{ wallet?.virtualAccount?.accountName || (user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Errandr Customer') }}
                </span>
              </div>
            </div>

            <!-- Steps Info -->
            <div class="space-y-2 text-xs text-gray-600">
              <div class="flex items-start gap-2">
                <div class="w-4 h-4 rounded-full bg-orange-100 text-[#FF5C1A] flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">1</div>
                <p>Transfer the desired amount from your bank app (GTB, Kuda, PalmPay, OPay, Zenith, etc.) to the account above.</p>
              </div>
              <div class="flex items-start gap-2">
                <div class="w-4 h-4 rounded-full bg-orange-100 text-[#FF5C1A] flex items-center justify-center font-bold text-[9px] shrink-0 mt-0.5">2</div>
                <p>Your wallet is credited automatically. Click refresh below once you make the transfer.</p>
              </div>
            </div>

            <!-- Refresh / Check Balance Button -->
            <button 
              type="button"
              @click="checkWalletBalance"
              :disabled="isCheckingBalance"
              class="w-full py-3 bg-gray-900 text-white rounded-2xl font-bold text-xs hover:bg-gray-800 active:scale-95 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <RefreshCcw class="w-3.5 h-3.5" :class="isCheckingBalance ? 'animate-spin' : ''" />
              <span>{{ isCheckingBalance ? 'Checking Balance...' : 'I Have Sent The Money (Refresh)' }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { 
  ArrowLeft, ChefHat, Wallet, Utensils, Settings2, 
  HeartPulse, Store, ChevronRight, Zap, Brain, 
  Download, ChevronLeft, RefreshCcw, Activity, AlertTriangle, Repeat,
  X, Search, Check, ShieldCheck, Sparkles, AlertCircle, Loader2,
  Flame, Dumbbell, Apple, Heart, Coffee, Edit2, Eye,
  CreditCard, Landmark, Copy, CheckCheck, ArrowRight
} from 'lucide-vue-next';
import { meal_planner_api } from '@/api_factory/modules/meal-planner';
import { vendors_api } from '@/api_factory/modules/vendors';
import { useToast } from '@/composables/useToast';
import { useWallet } from '@/composables/modules/wallets';
import { usePayments } from '@/composables/modules/payments';
import { useUser } from '@/composables/modules/auth/user';

definePageMeta({
  layout: 'student'
});

const router = useRouter();
const route = useRoute();
const { user } = useUser();
const { balance, wallet, fetchWallet } = useWallet();
const { initializePayment, verifyPayment } = usePayments();

const handleBack = () => {
  if (typeof window !== 'undefined' && window.history.length > 1) {
    router.back();
  } else {
    navigateTo('/dashboard/recurring-orders');
  }
};

// Wallet In-Page Funding Modal States
const showFundWalletModal = ref(false);
const activeFundMethod = ref<'paystack' | 'virtual_account'>('paystack');
const fundAmount = ref(5000);
const copiedAccount = ref(false);
const isCheckingBalance = ref(false);
const isInitializingFunding = ref(false);

const formattedFundAmount = computed({
  get: () => fundAmount.value ? fundAmount.value.toLocaleString() : '',
  set: (val: string) => {
    const numeric = parseInt(val.replace(/[^\d]/g, ''), 10);
    fundAmount.value = isNaN(numeric) ? 0 : numeric;
  }
});

// Form States
const budget = ref(10000);
const dailyBudget = ref(Math.round(10000 / 7));
const bufferAmount = ref(1000);
const mealsPerDay = ref(2);
const allowCustomErrands = ref(false);
const includeDrinks = ref(false);
const showMedicalModal = ref(false);
const showVendorsModal = ref(false);
const isGenerating = ref(false);

const { showToast } = useToast();

// Constraints Data
const medicalConditions = ref<string[]>([]);
const dislikesList = ref<string[]>([]);
const customDislikesText = ref('');
const selectedVendors = ref<string[]>([]);
const allVendors = ref<any[]>([]);
const vendorSearchQuery = ref('');

// Breakdown Preview Modal States
const showBreakdownModal = ref(false);
const selectedMealForBreakdown = ref<any>(null);
const selectedDayForBreakdown = ref<number>(1);

// Edit Meal Modal States
const showEditModal = ref(false);
const editingDayIndex = ref(0);
const editingMealIndex = ref(0);
const editingDayNumber = ref(1);
const editingMeal = ref<any>(null);
const editingMode = ref<'swap' | 'custom'>('swap');
const editItemSearchQuery = ref('');
const selectedSwapItem = ref<any>(null);
const customEditName = ref('');
const customEditPrice = ref(1500);
const customEditVendor = ref('');
const availableVendorItems = ref<any[]>([]);

// Available Medical & Diet Options
const medicalOptions = [
  { id: 'ulcer', name: 'Ulcer (Low Spice)', rule: 'Avoids hot chili, heavy pepper & high acid', icon: Flame },
  { id: 'diabetes', name: 'Diabetes (Low Sugar)', rule: 'Complex carbs & low glycemic index', icon: ShieldCheck },
  { id: 'hypertension', name: 'Hypertension (Low Sodium)', rule: 'Heart-healthy, low salt & low MSG', icon: Heart },
  { id: 'gerd', name: 'GERD / Acid Reflux', rule: 'Mild spices, soothing & non-greasy', icon: Coffee },
  { id: 'lactose', name: 'Lactose Intolerance', rule: 'Strictly dairy-free and milk-free', icon: AlertCircle },
  { id: 'celiac', name: 'Celiac / Gluten Free', rule: 'No wheat, indomie or flour pastries', icon: Apple },
];

const lifestyleOptions = [
  { id: 'high_protein', name: 'High Protein / Bulking', rule: 'Eggs, chicken, fish & power protein', icon: Dumbbell },
  { id: 'weight_loss', name: 'Weight Loss / Calorie Deficit', rule: 'High fiber, light oils & controlled portions', icon: Apple },
  { id: 'vegetarian', name: 'Vegetarian', rule: '100% plant-rich, no animal meat/poultry', icon: Sparkles },
  { id: 'halal', name: 'Halal Certified', rule: 'Cleanly prepared halal ingredients', icon: ShieldCheck },
];

const commonDislikeChips = [
  'Beans', 'Egg', 'Fish', 'Pork', 'Groundnuts', 
  'Salty food', 'Spicy pepper', 'Okra / Ogbono', 'Yam', 'Garri / Swallow'
];

// Budget Money Formatting
const formattedBudget = computed({
  get: () => {
    return budget.value ? budget.value.toLocaleString() : '';
  },
  set: (val: string) => {
    const numeric = parseInt(val.replace(/[^\d]/g, ''), 10);
    budget.value = isNaN(numeric) ? 0 : numeric;
    dailyBudget.value = Math.round(budget.value / 7);
  }
});

const formattedDailyBudget = computed({
  get: () => {
    return dailyBudget.value ? dailyBudget.value.toLocaleString() : '';
  },
  set: (val: string) => {
    const numeric = parseInt(val.replace(/[^\d]/g, ''), 10);
    dailyBudget.value = isNaN(numeric) ? 0 : numeric;
    budget.value = dailyBudget.value * 7;
  }
});

const calculatedDays = computed(() => {
  const avgCostPerMeal = 1500; 
  return Math.max(1, Math.floor(budget.value / (avgCostPerMeal * mealsPerDay.value)));
});

const potentialSavings = computed(() => {
  return Math.floor(budget.value * 0.4);
});

// Active Summaries
const activeMedicalSummary = computed(() => {
  const total = medicalConditions.value.length + dislikesList.value.length;
  if (total === 0) return 'None set';
  if (medicalConditions.value.length > 0) return medicalConditions.value[0];
  return `${total} active constraint${total > 1 ? 's' : ''}`;
});

const allDislikesCombined = computed(() => {
  const extra = customDislikesText.value.split(',').map(s => s.trim()).filter(Boolean);
  return Array.from(new Set([...dislikesList.value, ...extra]));
});

// Vendor Filtering
const filteredVendors = computed(() => {
  if (!vendorSearchQuery.value.trim()) return allVendors.value;
  const q = vendorSearchQuery.value.toLowerCase();
  return allVendors.value.filter(v => 
    v.storeName?.toLowerCase().includes(q) || 
    v.category?.toLowerCase().includes(q)
  );
});

const isVendorSelected = (id: string) => selectedVendors.value.includes(id);

const toggleVendor = (id: string) => {
  if (selectedVendors.value.includes(id)) {
    selectedVendors.value = selectedVendors.value.filter(v => v !== id);
  } else {
    selectedVendors.value.push(id);
  }
};

const selectAllVendors = () => {
  selectedVendors.value = allVendors.value.map(v => v._id);
};

const clearAllVendors = () => {
  selectedVendors.value = [];
};

// Medical & Diet Toggles
const toggleCondition = (name: string) => {
  if (medicalConditions.value.includes(name)) {
    medicalConditions.value = medicalConditions.value.filter(c => c !== name);
  } else {
    medicalConditions.value.push(name);
  }
};

const toggleDislikeChip = (chip: string) => {
  if (dislikesList.value.includes(chip)) {
    dislikesList.value = dislikesList.value.filter(c => c !== chip);
  } else {
    dislikesList.value.push(chip);
  }
};

// Iteration State & Normalization
const iterations = ref<any[]>([]);
const currentIterationIndex = ref(0);

const generatedPlan = computed(() => {
  if (!iterations.value || iterations.value.length === 0) return null;
  return iterations.value[currentIterationIndex.value] || null;
});

const budgetDeficit = computed(() => {
  if (!generatedPlan.value) return 0;
  if (typeof generatedPlan.value.budgetDeficit === 'number') {
    return generatedPlan.value.budgetDeficit;
  }
  const total = generatedPlan.value.totalCost || 0;
  return Math.max(0, total - budget.value);
});

const healthNote = computed(() => {
  if (!generatedPlan.value) return "";
  return generatedPlan.value.healthNote || "This plan is balanced for sustained energy during study sessions.";
});

// Breakdown Computeds
const mealBreakdownItems = computed(() => {
  if (!selectedMealForBreakdown.value) return [];
  if (selectedMealForBreakdown.value.breakdown?.items && selectedMealForBreakdown.value.breakdown.items.length > 0) {
    return selectedMealForBreakdown.value.breakdown.items;
  }
  // Fallback breakdown
  const name = selectedMealForBreakdown.value.name || 'Local Meal';
  const price = selectedMealForBreakdown.value.price || 1000;
  const packagingFee = selectedMealForBreakdown.value.packagingFee || 150;
  const foodPrice = Math.max(0, price - packagingFee);
  return [
    { name: name, category: 'Main Portion', portion: '1 full serving', calories: 450, price: foodPrice },
    { name: 'Eco-grade Takeaway Pack', category: 'Packaging', portion: '1 container', calories: 0, price: packagingFee },
  ];
});

const mealNutrition = computed(() => {
  if (selectedMealForBreakdown.value?.breakdown?.nutrition) {
    return selectedMealForBreakdown.value.breakdown.nutrition;
  }
  return {
    calories: 650,
    protein: 28,
    carbs: 75,
    fats: 18,
    fiber: 6,
    benefit: "Rich in complex carbohydrates and high-quality protein to support long campus study sessions."
  };
});

// Edit Swap Computeds
const filteredAvailableItems = computed(() => {
  if (!editItemSearchQuery.value.trim()) return availableVendorItems.value;
  const q = editItemSearchQuery.value.toLowerCase();
  return availableVendorItems.value.filter(item => 
    item.name?.toLowerCase().includes(q) || 
    item.vendor?.storeName?.toLowerCase().includes(q)
  );
});

const currentPreviewPrice = computed(() => {
  if (editingMode.value === 'swap') {
    return selectedSwapItem.value?.price || editingMeal.value?.price || 1500;
  }
  return customEditPrice.value || 1500;
});

// Robust Data Normalization
const normalizeIteration = (iter: any) => {
  if (!iter) return null;

  const days = (iter.days || []).map((d: any, dayIdx: number) => {
    const foodSubtotal = Number(d.foodSubtotal ?? 0);
    const packagingFee = Number(d.packagingFee ?? 0);
    const deliveryFee = Number(d.deliveryFee ?? 350);
    const serviceFee = Number(d.serviceFee ?? 50);

    const meals = (d.meals || []).map((m: any, mIdx: number) => {
      const firstOpt = (m.options && m.options.length > 0) ? m.options[0] : {};
      const vendorName = firstOpt.vendor?.storeName || firstOpt.vendor?.name || m.vendor?.storeName || m.vendor?.name || m.vendorName || (m.isCustom ? 'Custom Request' : (m.source || 'Campus Vendor'));
      const vendorLogo = firstOpt.vendor?.logo || firstOpt.vendor?.image || m.vendor?.logo || m.logo || '';
      const mealName = m.name || m.mealName || firstOpt.product?.name || `Meal ${mIdx + 1}`;
      const price = Number(m.estimatedCost ?? m.price ?? m.mealPrice ?? firstOpt.price ?? 0);
      const isCustom = Boolean(m.isCustom || firstOpt.category === 'custom' || firstOpt.product?._id === 'custom');
      const mealType = m.type || m.mealType || (mIdx === 0 ? 'breakfast' : mIdx === 1 ? 'lunch' : 'dinner');

      return {
        ...m,
        name: mealName,
        type: mealType,
        source: vendorName,
        logo: vendorLogo,
        price,
        isCustom,
        packagingFee: m.packagingFee || 150,
        options: m.options || [],
        breakdown: m.breakdown || null
      };
    });

    const mealsSum = meals.reduce((sum: number, m: any) => sum + (m.price || 0), 0);
    const calculatedDailyCost = mealsSum + deliveryFee + serviceFee;
    const dailyCost = Number(d.dailyCost ?? d.totalCost ?? calculatedDailyCost);

    return {
      ...d,
      day: d.day || dayIdx + 1,
      totalCost: dailyCost,
      dailyCost,
      foodSubtotal,
      packagingFee,
      deliveryFee,
      serviceFee,
      meals
    };
  });

  const totalCost = Number(iter.totalCost ?? days.reduce((sum: number, d: any) => sum + d.dailyCost, 0));
  const foodSubtotal = Number(iter.foodSubtotal ?? days.reduce((sum: number, d: any) => sum + (d.foodSubtotal || 0), 0));
  const packagingTotal = Number(iter.packagingTotal ?? days.reduce((sum: number, d: any) => sum + (d.packagingFee || 0), 0));
  const deliveryTotal = Number(iter.deliveryTotal ?? days.reduce((sum: number, d: any) => sum + (d.deliveryFee || 0), 0));
  const serviceTotal = Number(iter.serviceTotal ?? days.reduce((sum: number, d: any) => sum + (d.serviceFee || 0), 0));
  const deficit = Number(iter.budgetDeficit ?? Math.max(0, totalCost - budget.value));

  return {
    ...iter,
    totalCost,
    foodSubtotal,
    packagingTotal,
    deliveryTotal,
    serviceTotal,
    budgetDeficit: deficit,
    healthNote: iter.healthNote || '',
    days
  };
};

const generatePlan = async () => {
  if (budget.value <= 0) {
    showToast('Please enter a valid budget amount', 'error', undefined, 'Budget Required');
    return;
  }

  isGenerating.value = true;
  try {
    const res = await meal_planner_api.generateIterations({
      budget: budget.value,
      dailyBudget: dailyBudget.value,
      bufferAmount: bufferAmount.value,
      mealsPerDay: mealsPerDay.value,
      vendors: selectedVendors.value,
      medicalConditions: medicalConditions.value,
      dislikes: allDislikesCombined.value,
      allowCustomErrands: allowCustomErrands.value,
      includeDrinks: includeDrinks.value,
      count: 3
    });
    
    const rawData = Array.isArray(res) 
      ? res 
      : (Array.isArray(res?.data) ? res.data : (res?.data?.data || []));

    if (!Array.isArray(rawData) || rawData.length === 0) {
      showToast('No meals could be generated with the current constraints. Try adjusting your preferences.', 'warning', undefined, 'No Options');
      return;
    }

    const iters = rawData.map(normalizeIteration).filter(Boolean);
    iterations.value = iters;
    currentIterationIndex.value = 0;
    showToast(`Generated ${iters.length} tailored plan iterations from onboarded vendors!`, 'success', undefined, 'Plan Ready');
  } catch (err: any) {
    const msg = err?.response?.data?.message || err?.message || 'Failed to generate plan';
    showToast(msg, 'error', undefined, 'Generation Error');
  } finally {
    isGenerating.value = false;
  }
};

const nextIteration = () => {
  if (currentIterationIndex.value < iterations.value.length - 1) {
    currentIterationIndex.value++;
  }
};

const prevIteration = () => {
  if (currentIterationIndex.value > 0) {
    currentIterationIndex.value--;
  }
};

const spinAgain = async () => {
  isGenerating.value = true;
  try {
    const res = await meal_planner_api.generateIterations({
      budget: budget.value,
      dailyBudget: dailyBudget.value,
      bufferAmount: bufferAmount.value,
      mealsPerDay: mealsPerDay.value,
      vendors: selectedVendors.value,
      medicalConditions: medicalConditions.value,
      dislikes: allDislikesCombined.value,
      allowCustomErrands: allowCustomErrands.value,
      includeDrinks: includeDrinks.value,
      count: 1
    });
    
    const rawData = Array.isArray(res) 
      ? res 
      : (Array.isArray(res?.data) ? res.data : (res?.data?.data || []));

    const newIter = rawData[0] ? normalizeIteration(rawData[0]) : null;
    if (newIter) {
      iterations.value.push(newIter);
      currentIterationIndex.value = iterations.value.length - 1;
      showToast('New iteration generated!', 'success', undefined, 'Updated');
    }
  } catch (err: any) {
    showToast(err?.response?.data?.message || 'Failed to spin again', 'error', undefined, 'Error');
  } finally {
    isGenerating.value = false;
  }
};

// Meal Breakdown Interaction
const openMealBreakdown = (meal: any, dayNumber: number) => {
  selectedMealForBreakdown.value = meal;
  selectedDayForBreakdown.value = dayNumber;
  showBreakdownModal.value = true;
};

// Edit Meal Interaction
const openEditMeal = (day: any, dayIndex: number, meal: any, mealIndex: number) => {
  editingDayIndex.value = dayIndex;
  editingMealIndex.value = mealIndex;
  editingDayNumber.value = day.day || dayIndex + 1;
  editingMeal.value = meal;
  editingMode.value = 'swap';
  selectedSwapItem.value = null;
  customEditName.value = meal.name;
  customEditPrice.value = meal.price;
  customEditVendor.value = meal.source;
  showEditModal.value = true;
};

const triggerEditFromBreakdown = () => {
  if (!generatedPlan.value || !selectedMealForBreakdown.value) return;
  const dayIdx = Math.max(0, selectedDayForBreakdown.value - 1);
  const day = generatedPlan.value.days[dayIdx];
  if (!day) return;
  const mealIdx = day.meals.findIndex((m: any) => m.name === selectedMealForBreakdown.value.name);
  showBreakdownModal.value = false;
  openEditMeal(day, dayIdx, selectedMealForBreakdown.value, Math.max(0, mealIdx));
};

const selectSwapItem = (item: any) => {
  selectedSwapItem.value = item;
};

// Save Meal Edit & Recalculate Everything in Real-Time
const saveMealEdit = () => {
  if (!generatedPlan.value) return;
  const day = generatedPlan.value.days[editingDayIndex.value];
  if (!day || !day.meals[editingMealIndex.value]) return;

  const currentMeal = day.meals[editingMealIndex.value];

  if (editingMode.value === 'swap' && selectedSwapItem.value) {
    const item = selectedSwapItem.value;
    currentMeal.name = item.name;
    currentMeal.price = item.price;
    currentMeal.source = item.vendor?.storeName || 'Campus Vendor';
    currentMeal.logo = item.vendor?.logo || '';
    currentMeal.isCustom = false;
    currentMeal.breakdown = {
      items: [
        { name: item.name, category: 'Main Portion', portion: '1 plate', calories: 420 },
        { name: 'Seasoned Protein / Stew', category: 'Protein', portion: '1 portion', calories: 230 },
        { name: 'Steamed Greens', category: 'Fiber & Micronutrients', portion: '1 side', calories: 50 }
      ],
      nutrition: {
        calories: 700,
        protein: 32,
        carbs: 80,
        fats: 16,
        fiber: 6,
        benefit: `Freshly prepared by ${item.vendor?.storeName || 'Campus Vendor'}, fueling campus stamina with high protein and clean energy.`
      }
    };
  } else if (editingMode.value === 'custom') {
    currentMeal.name = customEditName.value || currentMeal.name;
    currentMeal.price = Number(customEditPrice.value) || currentMeal.price;
    currentMeal.source = customEditVendor.value || 'Custom Request';
    currentMeal.isCustom = true;
  }

  // 1. Recalculate Day Total Cost
  const mealsSum = day.meals.reduce((sum: number, m: any) => sum + (Number(m.price) || 0), 0);
  const delivery = Number(day.deliveryFee ?? 350);
  const service = Number(day.serviceFee ?? 50);
  day.dailyCost = mealsSum + delivery + service;
  day.totalCost = day.dailyCost;

  // 2. Recalculate Iteration Total Cost & Totals
  const newIterationTotal = generatedPlan.value.days.reduce((sum: number, d: any) => sum + d.dailyCost, 0);
  generatedPlan.value.totalCost = newIterationTotal;
  generatedPlan.value.foodSubtotal = generatedPlan.value.days.reduce((sum: number, d: any) => {
    return sum + d.meals.reduce((mSum: number, m: any) => mSum + (Number(m.foodSubtotal ?? (m.price - 150)) || 0), 0);
  }, 0);
  generatedPlan.value.packagingTotal = generatedPlan.value.days.reduce((sum: number, d: any) => sum + (d.packagingFee || (d.meals.length * 150)), 0);
  generatedPlan.value.deliveryTotal = generatedPlan.value.days.reduce((sum: number, d: any) => sum + (d.deliveryFee || 350), 0);
  generatedPlan.value.serviceTotal = generatedPlan.value.days.reduce((sum: number, d: any) => sum + (d.serviceFee || 50), 0);

  // 3. Recalculate Budget Deficit
  generatedPlan.value.budgetDeficit = Math.max(0, newIterationTotal - budget.value);

  // 4. Update Nutrition Insight
  generatedPlan.value.healthNote = `Updated roadmap with customized meal selections. Provides balanced daily energy supporting your weekly goals.`;

  showEditModal.value = false;
  showToast(`Day ${editingDayNumber.value} updated! Total and nutrition re-evaluated.`, 'success', undefined, 'Meal Updated');
};

const pushToAutopilot = () => {
  if (!generatedPlan.value) {
    showToast('Please generate an optimized meal plan first before pushing to Autopilot.', 'warning', undefined, 'No Plan Found');
    return;
  }

  try {
    localStorage.setItem('errandr_autopilot_imported_plan', JSON.stringify({
      ...generatedPlan.value,
      budget: budget.value,
      mealsPerDay: mealsPerDay.value,
      selectedVendors: selectedVendors.value,
      medicalConditions: medicalConditions.value,
      importedAt: new Date().toISOString()
    }));
  } catch (err) {
    console.error('Failed to store plan for autopilot', err);
  }

  showToast('Meal Plan successfully pushed to Autopilot! Redirecting to your schedule...', 'success', undefined, 'Autopilot Activated');
  setTimeout(() => {
    navigateTo('/dashboard/recurring-orders');
  }, 500);
};

const downloadPlan = () => {
  showToast('Generating downloadable meal schedule PDF...', 'info', undefined, 'Download');
};

// Wallet In-Page Funding Methods
const openFundWalletModal = (preset?: number) => {
  if (preset && preset > 0) {
    fundAmount.value = preset;
  } else if (budgetDeficit.value > 0) {
    fundAmount.value = budgetDeficit.value;
  } else {
    fundAmount.value = 5000;
  }
  fetchWallet();
  showFundWalletModal.value = true;
};

const initiatePaystackFunding = async () => {
  if (fundAmount.value < 100) {
    showToast('Minimum funding amount is ₦100', 'warning', undefined, 'Invalid Amount');
    return;
  }
  isInitializingFunding.value = true;
  try {
    const callbackUrl = `${window.location.origin}${window.location.pathname}?funded=true`;
    const res = await initializePayment({
      amount: fundAmount.value,
      purpose: 'wallet_funding',
      callbackUrl,
      metadata: {
        userId: user.value?._id,
        purpose: 'wallet_funding',
      }
    });
    const authUrl = res?.data?.authorization_url || res?.authorization_url;
    const reference = res?.data?.reference || res?.reference;
    if (reference) {
      localStorage.setItem('recent_topup_ref', reference);
    }
    if (authUrl) {
      window.location.href = authUrl;
    } else {
      showToast('Unable to launch Paystack gateway. Please try bank transfer.', 'error', undefined, 'Gateway Error');
    }
  } catch (err: any) {
    const msg = err?.response?.data?.message || err?.message || 'Failed to initialize payment';
    showToast(msg, 'error', undefined, 'Payment Error');
  } finally {
    isInitializingFunding.value = false;
  }
};

const copyAccountNumber = async () => {
  const accNum = wallet.value?.virtualAccount?.accountNumber;
  if (!accNum) return;
  try {
    await navigator.clipboard.writeText(accNum);
    copiedAccount.value = true;
    showToast('Account number copied to clipboard!', 'success', undefined, 'Copied');
    setTimeout(() => { copiedAccount.value = false; }, 2500);
  } catch {
    showToast('Account number: ' + accNum, 'info', undefined, 'Account Number');
  }
};

const checkWalletBalance = async () => {
  isCheckingBalance.value = true;
  const oldBalance = balance.value;
  await fetchWallet();
  isCheckingBalance.value = false;
  if (balance.value > oldBalance) {
    showToast(`Payment received! New balance: ₦${balance.value.toLocaleString()}`, 'success', undefined, 'Wallet Funded');
  } else {
    showToast(`Current balance: ₦${balance.value.toLocaleString()}. Transfers typically reflect in 30-60 seconds.`, 'info', undefined, 'Balance Checked');
  }
};

onMounted(async () => {
  fetchWallet();

  // Restore saved meal plan from localStorage if user is returning or editing from Autopilot
  try {
    const savedPlan = localStorage.getItem('errandr_autopilot_imported_plan');
    if (savedPlan) {
      const parsed = JSON.parse(savedPlan);
      if (parsed) {
        if (parsed.budget) {
          budget.value = Number(parsed.budget);
          dailyBudget.value = parsed.dailyBudget ? Number(parsed.dailyBudget) : Math.round(Number(parsed.budget) / 7);
        }
        if (parsed.bufferAmount !== undefined) bufferAmount.value = Number(parsed.bufferAmount);
        if (parsed.mealsPerDay) mealsPerDay.value = Number(parsed.mealsPerDay);
        if (Array.isArray(parsed.selectedVendors) && parsed.selectedVendors.length > 0) {
          selectedVendors.value = parsed.selectedVendors;
        }
        if (Array.isArray(parsed.medicalConditions)) medicalConditions.value = parsed.medicalConditions;
        if (Array.isArray(parsed.dislikes)) dislikesList.value = parsed.dislikes;
        if (typeof parsed.allowCustomErrands === 'boolean') allowCustomErrands.value = parsed.allowCustomErrands;
        if (typeof parsed.includeDrinks === 'boolean') includeDrinks.value = parsed.includeDrinks;

        const normalized = normalizeIteration(parsed);
        if (normalized && normalized.days && normalized.days.length > 0) {
          iterations.value = [normalized];
          currentIterationIndex.value = 0;
        }
      }
    }
  } catch (err) {
    console.error('Failed to restore saved meal desk plan', err);
  }

  try {
    const res = await vendors_api.getAll();
    allVendors.value = res.data?.vendors || res.data || [];
  } catch (err) {
    console.error('Failed to load vendors', err);
  }

  // Preload available vendor items for instant swapping
  try {
    const itemsRes = await meal_planner_api.getMealItems();
    availableVendorItems.value = itemsRes.data || [];
  } catch (err) {
    console.error('Failed to load menu items', err);
  }

  // Check for return from Paystack verification
  const reference = (route.query.reference as string) || (route.query.trxref as string) || localStorage.getItem('recent_topup_ref');
  if (route.query.reference || route.query.funded || route.query.trxref) {
    if (reference) {
      try {
        const res = await verifyPayment(reference);
        const success = res?.status === 'success' || res?.data?.status === 'success';
        if (success) {
          showToast('Wallet funded successfully! Your balance has been updated.', 'success', undefined, 'Funding Complete');
          await fetchWallet();
        }
      } catch (e) {
        console.warn('Verification error:', e);
      } finally {
        localStorage.removeItem('recent_topup_ref');
        const url = new URL(window.location.href);
        url.searchParams.delete('reference');
        url.searchParams.delete('trxref');
        url.searchParams.delete('funded');
        window.history.replaceState({}, '', url.toString());
      }
    }
  }
});
</script>

<style scoped>
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
