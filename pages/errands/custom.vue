<template>
  <div class="min-h-screen flex bg-[#F7F4EC] font-sans selection:bg-[#FF5C1A]/15 selection:text-[#FF5C1A]">

    <!-- Left Section: The Noticeboard -->
    <div class="hidden lg:flex w-2/5 fixed inset-y-0 left-0 flex-col justify-between overflow-hidden bg-[#0D0805]">
      <!-- Black-to-brand glow, mixing ink and brand -->
      <div class="absolute -top-[10%] -right-[10%] w-[70%] h-[70%] bg-[radial-gradient(circle,_#FF5C1A_0%,_transparent_70%)] opacity-[0.12] blur-2xl"></div>
      <div class="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[length:18px_18px]"></div>

      <div class="relative z-10 p-10">
        <NuxtLink to="/" class="inline-block">
          <img src="@/assets/img/erranders.png" alt="Erranders" class="h-7" />
        </NuxtLink>
      </div>

      <div class="relative z-10 px-10 max-w-md">
        <div class="inline-flex items-center gap-2 border-2 border-dashed border-[#FF5C1A] text-[#FF5C1A] rounded-full px-4 py-1.5 -rotate-[6deg] mb-8">
          <Stamp class="w-3.5 h-3.5" />
          <span class="font-sans text-sm font-bold  tracking-[0.15em]">You Set The Price</span>
        </div>

        <h1 class="font-sans font-bold text-4xl leading-[1.15] tracking-tight text-[#F7F4EC] mb-5">
          Write the job.<br />
          <span class="text-[#FF5C1A]">Name your fee.</span><br />
          Broadcast it.
        </h1>
        <p class="text-[15px] leading-relaxed text-[#F7F4EC]/55">
          A market run, a print job, a package picked up — fill the slip below and it goes out to every rider on campus at once. First to accept, runs.
        </p>

        <!-- Decorative waybill stubs -->
        <div class="mt-10 space-y-3">
          <div class="rotate-[-2deg] rounded-sm px-4 py-3 shadow-sm border border-gray-100 bg-[#F7F4EC]">
            <p class="font-sans text-sm  tracking-wider text-[#766A61]">Faculty of Medicine → Block hostel</p>
            <p class="font-sans text-sm font-bold mt-0.5 text-[#170D08]">Print 40pg thesis draft — ₦800</p>
          </div>
          <div class="rotate-[1.5deg] rounded-sm px-4 py-3 shadow-sm border border-gray-100 ml-6 bg-[#F3C9D2]">
            <p class="font-sans text-sm  tracking-wider text-[#766A61]">Yaba Market → OPH hostel</p>
            <p class="font-sans text-sm font-bold mt-0.5 text-[#170D08]">3 yards black velvet — ₦2,000</p>
          </div>
        </div>
      </div>

      <div class="relative z-10 p-10">
        <div class="border-2 border-dashed border-[#F7F4EC]/20 rounded-sm p-4 flex items-start gap-3">
          <ShieldCheck class="w-5 h-5 shrink-0 mt-0.5 text-[#FF5C1A]" />
          <div>
            <p class="font-sans text-sm font-bold  tracking-wider text-[#F7F4EC]">Escrow held, not spent</p>
            <p class="text-sm mt-1 leading-relaxed text-[#F7F4EC]/50">Your runner fee sits in escrow until you tap confirm. No confirm, no payout.</p>
          </div>
        </div>
      </div>

      <!-- Perforation seam -->
      <div class="absolute top-0 right-0 h-full w-px bg-[radial-gradient(circle,_rgba(247,244,236,0.25)_1.5px,transparent_2px)] bg-[length:100%_12px] bg-repeat-y"></div>
    </div>

    <!-- Right Section: The Waybill -->
    <div class="w-full lg:w-3/5 lg:ml-[40%] relative flex flex-col min-h-screen">

      <!-- Mobile Header -->
      <div class="lg:hidden px-5 py-4 flex items-center justify-between sticky top-0 z-10 bg-[#F7F4EC] border-b border-dashed border-[#170D08]/15">
        <NuxtLink to="/" class="inline-block">
          <img src="@/assets/img/logo-light.png" alt="Erranders" class="h-8" />
        </NuxtLink>
        <button @click="$router.back()" class="w-9 h-9 rounded-sm flex items-center justify-center border border-[#170D08]/15 text-[#766A61] hover:border-[#FF5C1A] hover:text-[#FF5C1A] transition-colors">
          <X class="w-4 h-4" />
        </button>
      </div>

      <div class="hidden lg:flex absolute top-7 right-7 z-10">
        <button @click="$router.back()" class="w-11 h-11 rounded-sm flex items-center justify-center border border-[#170D08]/15 text-[#766A61] transition-colors hover:text-[#FF5C1A] hover:border-[#FF5C1A]">
          <X class="w-4 h-4" />
        </button>
      </div>

      <div class="flex-1 overflow-y-auto pb-28 sm:px-5 sm:py-10 md:px-16 md:py-16 flex flex-col justify-center">
        <div class="max-w-xl w-full mx-auto">

          <!-- The waybill card, with duplicate/triplicate sheets peeking behind -->
          <div class="relative">
            <div class="hidden sm:block absolute inset-0 translate-x-2.5 translate-y-3.5 rotate-[2deg] rounded-sm shadow-sm border border-gray-100 bg-[#F6DE8C]"></div>
            <div class="hidden sm:block absolute inset-0 translate-x-1 translate-y-1.5 rotate-[1deg] rounded-sm shadow-sm border border-gray-100 bg-[#F3C9D2]"></div>

            <div class="relative sm:rounded-sm shadow-sm border border-gray-100 p-5 sm:p-10 bg-[#F7F4EC] sm:border border-[#170D08]/15">

              <!-- Waybill header -->
              <div class="flex justify-between items-start pb-5 border-b-2 border-dashed border-[#D8D2C4]">
                <div>
                  <p class="font-sans text-sm  tracking-[0.2em] text-[#766A61]">Erranders Dispatch</p>
                  <h2 class="font-sans text-xl font-bold tracking-tight text-[#170D08]">Errand Waybill</h2>
                </div>
                <div class="text-right">
                  <p class="font-sans text-sm  tracking-wider text-[#766A61]">Slip No.</p>
                  <p class="font-sans text-sm font-bold text-[#FF5C1A]">{{ waybillNumber || '——————' }}</p>
                </div>
              </div>

              <!-- Copy tabs (progress) -->
              <div class="flex gap-2 mt-6">
                <div
                  v-for="n in 3" :key="n"
                  class="flex-1 flex items-center justify-center gap-2 py-3 rounded-md font-sans transition-all"
                  :class="step === n ? 'bg-[#170D08] text-[#F7F4EC] shadow-sm' : 'bg-[#170D08]/5 text-[#766A61]'"
                >
                  <span class="text-sm font-bold">{{ n }}/3</span>
                  <span class="hidden sm:inline text-sm font-bold  tracking-wider">{{ n === 1 ? 'Details' : n === 2 ? 'Pricing' : 'Review' }}</span>
                </div>
              </div>

              <!-- Step 1: Details -->
              <div v-if="step === 1" class="animate-fade-in space-y-8 pt-8">
                <p class="text-sm text-[#766A61]">Fill in exactly what you need done, and where.</p>

                <!-- Errand type -->
                <div class="flex gap-3">
                  <button
                    @click="errandType = 'custom'"
                    class="flex-1 font-sans text-sm  tracking-wider py-3 rounded-sm border-[1.5px] transition-all"
                    :class="errandType === 'custom' ? 'bg-[#170D08] text-[#F7F4EC] border-[#170D08]' : 'bg-transparent text-[#766A61] border-[#D8D2C4]'"
                  >
                    Any Work?
                  </button>
                  <button
                    @click="errandType = 'market'"
                    class="flex-1 font-sans text-sm  tracking-wider py-3 rounded-sm border-[1.5px] transition-all"
                    :class="errandType === 'market' ? 'bg-[#170D08] text-[#F7F4EC] border-[#170D08]' : 'bg-transparent text-[#766A61] border-[#D8D2C4]'"
                  >
                    Market Run
                  </button>
                </div>

                <template v-if="errandType === 'custom'">
                  
                  <!-- Open Errand Pools Section -->
                  <div v-if="openPools.length > 0 && !fetchingPools" class="bg-[#FF5C1A]/10 border-2 border-dashed border-[#FF5C1A] rounded-sm p-4 relative overflow-hidden">
                    <div class="absolute -right-5 -top-5 opacity-10">
                      <Layers class="w-20 h-20 text-[#FF5C1A]" />
                    </div>
                    <h3 class="font-sans font-bold text-[#170D08] mb-1 flex items-center gap-2">
                      <Layers class="w-4 h-4 text-[#FF5C1A]" />
                      Join an Errand Pool (Split Fee)
                    </h3>
                    <p class="text-xs text-[#766A61] mb-4">Someone in your area is already requesting an errand. Join their pool to split the delivery fee!</p>
                    
                    <div class="space-y-2 relative z-10">
                      <div v-for="pool in openPools" :key="pool._id" 
                           @click="selectPool(pool)"
                           class="bg-white border cursor-pointer transition-all p-3 rounded-sm flex items-center justify-between"
                           :class="selectedPoolId === pool._id ? 'border-[#FF5C1A] ring-1 ring-[#FF5C1A]' : 'border-[#170D08]/15 hover:border-[#170D08]/30'">
                        <div>
                          <p class="font-sans font-bold text-sm text-[#170D08]">{{ pool.title }}</p>
                          <p class="text-xs text-[#766A61] mt-0.5">{{ pool.orders?.length || 1 }} of {{ pool.maxParticipants }} spots filled</p>
                        </div>
                        <div class="text-right">
                          <p class="text-xs text-[#766A61] line-through">₦{{ pool.baseDeliveryFee }}</p>
                          <p class="font-bold text-[#FF5C1A] text-sm">₦{{ Math.floor(pool.baseDeliveryFee / ((pool.orders?.length || 1) + 1)) }}</p>
                        </div>
                      </div>
                    </div>
                    
                    <button v-if="selectedPoolId" @click="selectedPoolId = null" class="mt-3 text-xs font-bold text-[#FF5C1A] hover:underline">
                      Cancel Pool Selection
                    </button>
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <button
                      v-for="tmpl in (showAllTemplates ? errandTemplates : errandTemplates.slice(0, 4))" :key="tmpl" @click="applyTemplate(tmpl)"
                      class="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-sm font-semibold rounded-full transition-colors flex items-center gap-2 shadow-sm"
                    >
                      <ListChecks class="w-4 h-4 text-gray-400" />
                      {{ tmpl }}
                    </button>
                    
                    <button
                      v-if="!showAllTemplates && errandTemplates.length > 4"
                      @click="showAllTemplates = true"
                      class="px-4 py-2 bg-[#FF5C1A]/10 hover:bg-[#FF5C1A]/20 border border-transparent text-[#FF5C1A] text-sm font-semibold rounded-full transition-colors flex items-center gap-2 shadow-sm"
                    >
                      + {{ errandTemplates.length - 4 }} more ideas
                    </button>
                    
                    <button
                      v-if="showAllTemplates && errandTemplates.length > 4"
                      @click="showAllTemplates = false"
                      class="px-4 py-2 bg-gray-100 hover:bg-gray-200 border border-transparent text-gray-600 text-sm font-semibold rounded-full transition-colors flex items-center gap-2 shadow-sm"
                    >
                      Show less
                    </button>
                  </div>

                  <div class="space-y-2.5">
                    <label class="block font-sans text-sm tracking-[0.15em] text-[#766A61]">What do you need done?</label>
                    <div class="space-y-2 mt-2">
                      <TransitionGroup name="list" tag="div" class="space-y-2">
                        <div v-for="(item, idx) in checklistItems" :key="idx" class="flex items-start gap-2 relative group">
                          <div class="mt-2 shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-[#170D08]/5 border border-[#170D08]/15 text-[#766A61] text-[10px] font-bold">
                            {{ idx + 1 }}
                          </div>
                          <div class="flex-1 relative">
                            <input
                              v-model="checklistItems[idx]"
                              type="text"
                              :placeholder="idx === checklistItems.length - 1 ? 'e.g. 2 portions of Jollof rice' : ''"
                              class="checklist-input w-full bg-transparent outline-none py-2 text-base font-medium border-b-2 border-dashed border-[#D8D2C4] focus:border-b-[3px] focus:border-b-[#FF5C1A] focus:border-solid text-[#170D08] placeholder:font-normal placeholder:text-[#766A61]/80 transition-colors"
                              @keydown="handleItemKeydown($event, idx)"
                            />
                          </div>
                          <button
                            v-if="checklistItems.length > 1"
                            @click="removeItem(idx)"
                            class="absolute right-0 top-2 opacity-0 group-hover:opacity-100 p-1 text-[#766A61] hover:text-[#FF5C1A] transition-all bg-white rounded-md border border-[#170D08]/15 shadow-sm"
                            title="Remove item"
                          >
                            <X class="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </TransitionGroup>
                    </div>

                    <div v-if="attachedVoiceNoteBase64" class="rounded-sm pr-1 pl-2 py-1 flex items-center gap-2 w-full justify-between bg-[#170D08]/5">
                      <audio :src="attachedVoiceNoteBase64" controls class="h-8 max-w-[220px]" />
                      <button @click="removeVoiceNote" class="w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-white bg-[#FF5C1A] hover:bg-[#C7460F] transition-colors">
                        <X class="w-3 h-3" />
                      </button>
                    </div>

                    <div class="flex items-center gap-2 pt-1">
                      <span v-if="isRecording" class="font-sans text-sm font-bold animate-pulse rounded-sm px-2 py-1 text-[#FF5C1A] bg-[#FF5C1A]/8">
                        REC {{ Math.floor(recordingTime / 60) }}:{{ (recordingTime % 60).toString().padStart(2, '0') }} / 2:00
                      </span>
                      <button
                        @click="toggleRecording"
                        class="w-8 h-8 rounded-sm flex items-center justify-center transition-colors relative border"
                        :class="isRecording ? 'bg-[#FF5C1A]/10 border-transparent text-[#FF5C1A]' : 'border-[#170D08]/15 text-[#766A61]'"
                        title="Record Voice Note"
                      >
                        <span v-if="isRecording" class="absolute inset-0 rounded-sm animate-ping opacity-60 border-2 border-[#FF5C1A]"></span>
                        <Mic class="w-4 h-4 z-10" />
                      </button>
                      <label class="w-8 h-8 rounded-sm flex items-center justify-center cursor-pointer transition-colors border border-[#170D08]/15 text-[#766A61] hover:border-[#FF5C1A] hover:text-[#FF5C1A]" title="Attach Photo">
                        <input type="file" accept="image/*" class="hidden" multiple @change="handleImageUpload" />
                        <ImageIcon class="w-4 h-4" />
                      </label>
                      <span class="font-sans text-sm  tracking-wide text-[#766A61]">attach evidence (optional)</span>
                    </div>

                    <div v-if="attachedImagesBase64.length > 0" class="flex flex-wrap gap-2 mt-2">
                      <div v-for="(img, idx) in attachedImagesBase64" :key="idx" class="relative inline-block">
                        <img :src="img" class="h-16 w-16 object-cover rounded-sm border border-[#170D08]/15" />
                        <button @click="removeImage(idx)" class="absolute -top-2 -right-2 w-5 h-5 rounded-full flex items-center justify-center text-white bg-[#FF5C1A] hover:bg-[#C7460F] transition-colors">
                          <X class="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div class="space-y-2.5">
                    <label class="block font-sans text-sm  tracking-[0.15em] text-[#766A61]">Task location (optional)</label>
                    <div class="relative flex items-center gap-2">
                      <MapPin class="w-4 h-4 shrink-0 text-[#766A61]" />
                      <input
                        v-model="form.pickupLocation"
                        type="text"
                        placeholder="e.g. College Library — leave blank if not applicable"
                        class="w-full bg-transparent outline-none py-3 text-base font-medium border-b-2 border-dashed border-[#D8D2C4] focus:border-b-[3px] focus:border-b-[#FF5C1A] focus:border-solid text-[#170D08] placeholder:font-normal placeholder:text-[#766A61]/80 transition-colors"
                      />
                    </div>
                  </div>
                </template>

                <template v-else>
                  <div class="space-y-5 rounded-sm p-4 bg-[#170D08]/5">
                    <div class="space-y-2.5">
                      <label class="block font-sans text-sm  tracking-[0.15em] text-[#766A61]">Which market?</label>
                      <div class="flex items-center gap-2">
                        <MapPin class="w-4 h-4 shrink-0 text-[#766A61]" />
                        <input
                          v-model="marketForm.marketName"
                          type="text"
                          placeholder="e.g. Yaba Market, Tejuosho"
                          class="w-full bg-transparent outline-none py-3 text-base font-medium border-b-2 border-dashed border-[#D8D2C4] focus:border-b-[3px] focus:border-b-[#FF5C1A] focus:border-solid text-[#170D08] placeholder:font-normal placeholder:text-[#766A61]/80 transition-colors"
                        />
                      </div>
                    </div>
                    <div class="space-y-2.5">
                      <label class="block font-sans text-sm  tracking-[0.15em] text-[#766A61]">Shopping list</label>
                      <div class="space-y-2 mt-2">
                        <TransitionGroup name="list" tag="div" class="space-y-2">
                          <div v-for="(item, idx) in marketChecklistItems" :key="idx" class="flex items-start gap-2 relative group">
                            <div class="mt-2 shrink-0 flex items-center justify-center w-5 h-5 rounded-full bg-[#170D08]/5 border border-[#170D08]/15 text-[#766A61] text-[10px] font-bold">
                              {{ idx + 1 }}
                            </div>
                            <div class="flex-1 relative">
                              <input
                                v-model="marketChecklistItems[idx]"
                                type="text"
                                :placeholder="idx === 0 ? 'e.g. 3 yards of black velvet material' : ''"
                                class="market-checklist-input w-full bg-transparent outline-none py-2 text-base font-medium border-b-2 border-dashed border-[#D8D2C4] focus:border-b-[3px] focus:border-b-[#FF5C1A] focus:border-solid text-[#170D08] placeholder:font-normal placeholder:text-[#766A61]/80 transition-colors"
                                @keydown="handleMarketItemKeydown($event, idx)"
                              />
                            </div>
                            <button
                              v-if="marketChecklistItems.length > 1"
                              @click="removeMarketItem(idx)"
                              class="absolute right-0 top-2 opacity-0 group-hover:opacity-100 p-1 text-[#766A61] hover:text-[#FF5C1A] transition-all bg-white rounded-md border border-[#170D08]/15 shadow-sm"
                              title="Remove item"
                            >
                              <X class="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </TransitionGroup>
                      </div>
                    </div>
                  </div>
                </template>

                <div class="space-y-2">
                  <div class="flex justify-between items-end">
                    <label class="block font-sans text-sm  tracking-[0.15em] text-[#766A61]">Drop-off location</label>
                    <div v-if="recentDropoffs.length > 0" class="flex gap-1.5">
                      <button
                        v-for="loc in recentDropoffs" :key="loc" @click="form.dropoffLocation = loc"
                        class="font-sans text-xs  px-1.5 py-0.5 rounded-sm bg-[#170D08]/5 text-[#766A61] hover:bg-[#FF5C1A]/10 hover:text-[#FF5C1A] transition-colors"
                      >{{ loc }}</button>
                    </div>
                  </div>
                  <div class="flex items-center gap-2">
                    <Navigation class="w-4 h-4 shrink-0 text-[#766A61]" />
                    <input
                      v-model="form.dropoffLocation"
                      type="text"
                      list="locations-list"
                      placeholder="e.g. Block hostel or Coorporative hostel"
                      class="w-full bg-transparent outline-none py-3 text-base font-medium border-b-2 border-dashed border-[#D8D2C4] focus:border-b-[3px] focus:border-b-[#FF5C1A] focus:border-solid text-[#170D08] transition-colors"
                    />
                    <datalist id="locations-list">
                      <option v-for="loc in predefinedLocations" :key="loc" :value="loc"></option>
                    </datalist>
                  </div>
                </div>

                <button
                  @click="step = 2"
                  :disabled="!isStep1Valid"
                  class="w-full font-sans  tracking-wider text-[13px] font-bold py-4 px-4 rounded-sm transition-colors flex justify-between items-center group bg-[#170D08] text-[#F7F4EC] hover:bg-[#FF5C1A] disabled:opacity-25 disabled:hover:bg-[#170D08]"
                >
                  <span>Continue → Pricing</span>
                  <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              <!-- Step 2: Financials -->
              <div v-if="step === 2" class="animate-fade-in space-y-8 pt-8">
                <p class="text-sm text-[#766A61]">You're in control. A fair fee gets picked up faster.</p>

                <div class="rounded-sm p-4 flex gap-3 bg-[#FF5C1A]/5 border border-dashed border-[#FF5C1A]/30">
                  <CircleDollarSign class="w-4 h-4 shrink-0 mt-0.5 text-[#FF5C1A]" />
                  <p class="text-[13px] leading-relaxed text-[#170D08]">
                    <span class="font-bold">How it works —</span> set the item cost if the rider is buying something for you, and a labor fee for their trouble. The labor fee sits in escrow until the job's done.
                  </p>
                </div>

                <div class="space-y-6">
                  <div class="space-y-1.5">
                    <div class="flex justify-between items-baseline">
                      <label class="block font-sans text-sm  tracking-[0.15em] text-[#766A61]">Estimated item cost</label>
                      <span class="font-sans text-sm text-[#766A61]">0 if just a pickup</span>
                    </div>
                    <div class="flex items-center gap-2">
                      <span class="font-sans text-lg font-bold text-[#766A61]">₦</span>
                      <input
                        v-model="formattedItemCost"
                        type="text"
                        placeholder="0"
                        class="w-full bg-transparent outline-none py-2 text-xl font-sans font-bold border-b-2 border-dashed border-[#D8D2C4] focus:border-b-[3px] focus:border-b-[#FF5C1A] focus:border-solid text-[#170D08] transition-colors"
                      />
                    </div>
                  </div>

                  <div class="space-y-1.5">
                    <div class="flex justify-between items-baseline">
                      <label class="block font-sans text-sm  tracking-[0.15em] text-[#766A61]">Runner fee (labor)</label>
                      <span v-if="!selectedPoolId" class="font-sans text-sm text-[#766A61]">min ₦{{ minRunnerFee.toLocaleString() }}</span>
                    </div>
                    
                    <div v-if="selectedPoolId" class="bg-[#FF5C1A]/10 border border-dashed border-[#FF5C1A] p-4 rounded-sm flex items-center justify-between">
                      <div>
                        <p class="font-bold text-sm text-[#170D08]">Locked to Pool Split Fee</p>
                        <p class="text-xs text-[#766A61]">You are joining an existing pool.</p>
                      </div>
                      <span class="font-sans text-xl font-bold text-[#FF5C1A]">₦{{ formatMoney(form.runnerFee) }}</span>
                    </div>

                    <template v-else>
                      <div class="flex items-center gap-2">
                        <span class="font-sans text-lg font-bold text-[#766A61]">₦</span>
                        <input
                          v-model="formattedRunnerFee"
                          type="text"
                          placeholder="1,000"
                          class="w-full bg-transparent outline-none py-2 text-xl font-sans font-bold border-b-2 border-dashed border-[#D8D2C4] focus:border-b-[3px] focus:border-b-[#FF5C1A] focus:border-solid text-[#170D08] transition-colors"
                        />
                      </div>
                      <p v-if="form.runnerFee > 0 && form.runnerFee < minRunnerFee" class="font-sans text-sm font-bold text-[#FF5C1A]">Minimum runner fee is ₦{{ minRunnerFee.toLocaleString() }}</p>

                      <div class="flex flex-wrap gap-1.5 pt-2">
                        <button v-for="amt in [500,1000,2000,3500]" :key="amt" @click="form.runnerFee = amt"
                          class="font-sans text-sm font-bold px-4 py-2 rounded-sm border border-[#170D08]/15 text-[#766A61] hover:border-[#170D08] hover:text-[#170D08] transition-colors"
                        >₦{{ amt.toLocaleString('en-NG') }}</button>
                      </div>

                      <div class="mt-6 pt-4 border-t-2 border-dashed border-[#D8D2C4]">
                        <label class="flex items-start gap-3 cursor-pointer group">
                          <div class="mt-0.5 relative flex items-center justify-center w-5 h-5 rounded border-2 transition-colors"
                               :class="allowPoolJoin ? 'bg-[#FF5C1A] border-[#FF5C1A]' : 'border-[#170D08]/30 group-hover:border-[#FF5C1A]'">
                            <input type="checkbox" v-model="allowPoolJoin" class="sr-only" />
                            <svg v-if="allowPoolJoin" class="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>
                            <p class="font-sans font-bold text-sm text-[#170D08]">Turn this into an Errand Pool</p>
                            <p class="text-[13px] text-[#766A61] mt-0.5 leading-relaxed">Allow others to join this errand. If someone joins, you'll split the runner fee and receive a refund for their portion.</p>
                          </div>
                        </label>
                      </div>
                    </template>
                  </div>
                </div>

                <div class="flex gap-3">
                  <button @click="step = 1" class="px-5 py-4 rounded-sm font-sans text-sm font-bold  tracking-wider shrink-0 border-[1.5px] border-[#170D08]/15 text-[#766A61] hover:border-[#170D08] hover:text-[#170D08] transition-colors">
                    Back
                  </button>
                  <button
                    @click="step = 3"
                    :disabled="!isStep2Valid"
                    class="flex-1 font-sans  tracking-wider text-[13px] font-bold py-4 px-4 rounded-sm transition-colors flex justify-between items-center group bg-[#170D08] text-[#F7F4EC] hover:bg-[#FF5C1A] disabled:opacity-25 disabled:hover:bg-[#170D08]"
                  >
                    <span>Review Slip</span>
                    <ArrowRight class="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              <!-- Step 3: Summary -->
              <div v-if="step === 3" class="animate-fade-in space-y-7 pt-8">
                <p class="text-sm text-[#766A61]">Card charges once. Item cost lands straight in the rider's bank.</p>

                <div class="space-y-3 font-sans text-sm">
                  <div v-if="form.estimatedItemCost > 0" class="flex justify-between items-baseline">
                    <span class="flex items-center gap-2 text-[#766A61]"><Package class="w-3.5 h-3.5" /> Item Cost</span>
                    <span class="flex-1 mx-2 border-b border-dashed border-[#D8D2C4]"></span>
                    <span class="font-bold text-[#170D08]">₦{{ formatMoney(form.estimatedItemCost) }}</span>
                  </div>
                  <div class="flex justify-between items-baseline">
                    <span class="flex items-center gap-2 text-[#766A61]"><Target class="w-3.5 h-3.5" /> Runner Fee</span>
                    <span class="flex-1 mx-2 border-b border-dashed border-[#D8D2C4]"></span>
                    <span class="font-bold text-[#170D08]">₦{{ formatMoney(form.runnerFee) }}</span>
                  </div>
                  <div v-if="transferFee > 0" class="flex justify-between items-baseline">
                    <span class="flex items-center gap-2 text-[#766A61]"><ArrowRight class="w-3.5 h-3.5" /> Transfer Fee</span>
                    <span class="flex-1 mx-2 border-b border-dashed border-[#D8D2C4]"></span>
                    <span class="font-bold text-[#170D08]">₦{{ transferFee }}</span>
                  </div>
                  <div class="flex justify-between items-baseline pb-3 border-b-2 border-dashed border-[#D8D2C4]">
                    <span class="flex items-center gap-2 text-[#766A61]"><Layers class="w-3.5 h-3.5" /> Platform Fee</span>
                    <span class="flex-1 mx-2 border-b border-dashed border-[#D8D2C4]"></span>
                    <span class="font-bold text-[#170D08]">₦50</span>
                  </div>
                </div>

                <div class="rounded-sm p-4 flex justify-between items-center -rotate-[0.6deg] border-[3px] border-[#FF5C1A]">
                  <div>
                    <p class="font-sans text-sm font-bold  tracking-widest text-[#FF5C1A]">Amount Due</p>
                    <p class="text-sm mt-0.5 text-[#766A61]">Paid securely via Paystack</p>
                  </div>
                  <span class="font-sans text-3xl font-bold tracking-tight text-[#FF5C1A]">₦{{ formatMoney(grandTotal) }}</span>
                </div>

                <div class="rounded-sm p-4 flex gap-3 text-[13px] leading-relaxed bg-[#3E6B52]/6 border border-dashed border-[#3E6B52]/35 text-[#170D08]">
                  <ShieldCheck class="w-4 h-4 shrink-0 mt-0.5 text-[#3E6B52]" />
                  <p>You'll be redirected to Paystack to pay. The moment it clears, this slip goes live and riders can accept it.</p>
                </div>

                <div v-if="justAuthenticated" class="rounded-sm p-4 flex items-start gap-3 bg-[#3E6B52]/8 border border-dashed border-[#3E6B52]">
                  <ShieldCheck class="w-4 h-4 mt-0.5 shrink-0 text-[#3E6B52]" />
                  <div>
                    <p class="font-sans text-sm font-bold  tracking-wide text-[#3E6B52]">Verified</p>
                    <p class="text-[13px] mt-0.5 text-[#170D08]">Your details are saved. Pay below to broadcast the errand.</p>
                  </div>
                </div>

                <div class="flex flex-col gap-2.5">
                  <button
                    @click="submitErrand"
                    :disabled="isSubmitting"
                    class="w-full font-sans text-[13px] font-bold  tracking-wider py-4 px-4 rounded-sm transition-all flex justify-center items-center gap-3 bg-[#FF5C1A] text-[#F7F4EC] hover:bg-[#C7460F] disabled:opacity-60 active:scale-[0.98]"
                  >
                    <Loader2 v-if="isSubmitting" class="animate-spin w-4 h-4" />
                    <CreditCard v-else class="w-4 h-4" />
                    <span>{{ isSubmitting ? 'Processing…' : (failedPaymentReference ? 'Retry Publishing Errand' : `Pay ₦${formatMoney(grandTotal)} & Broadcast`) }}</span>
                  </button>
                  <button @click="step = 2" :disabled="isSubmitting" class="w-full font-sans text-sm font-bold  tracking-wider py-2.5 text-[#766A61] hover:text-[#170D08] transition-colors">
                    ← Go back and edit
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
    <CoreAuthModal :is-open="isAuthModalOpen" @update:is-open="isAuthModalOpen = $event" @success="handleAuthSuccess" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { useCustomToast } from '@/composables/core/useCustomToast'
import { useRouter, useRoute } from '#imports'
import { GATEWAY_ENDPOINT_WITH_AUTH as api } from '@/api_factory/axios.config'
import { useUser } from '@/composables/modules/auth/user'
import { usePayments } from '@/composables/modules/payments'
import {
  ShieldCheck, MapPin, Navigation, CreditCard,
  ArrowRight, X, CircleDollarSign, Package, Target, Layers, Loader2,
  Mic, ImageIcon, Stamp, ListChecks
} from 'lucide-vue-next'

definePageMeta({ layout: false })
useSeoMeta({
  title: 'Request Custom Errand | Erranders',
  description: 'Need something specific? Request a custom errand and let us get it delivered right to your hostel.',
  ogTitle: 'Request Custom Errand | Erranders',
  ogDescription: 'Need something specific? Request a custom errand and let us get it delivered right to your hostel.',
  ogImage: 'https://res.cloudinary.com/marquis/image/upload/v1784062203/logo-light_pyjwmn-removebg-preview_y3jvvg.png',
  ogUrl: 'https://www.erranders.org/errands/custom',
  twitterTitle: 'Request Custom Errand | Erranders',
  twitterDescription: 'Need something specific? Request a custom errand and let us get it delivered right to your hostel.',
  twitterImage: 'https://res.cloudinary.com/marquis/image/upload/v1784062203/logo-light_pyjwmn-removebg-preview_y3jvvg.png',
  twitterCard: 'summary_large_image'
})

const router = useRouter()
const route = useRoute()
const { showToast } = useCustomToast()
const { isLoggedIn, user } = useUser()
const { initializePayment, verifyPayment } = usePayments()

const step = ref(1)
const isSubmitting = ref(false)
const isAuthModalOpen = ref(false)
const justAuthenticated = ref(false)
const failedPaymentReference = ref('')
const minRunnerFee = ref(400)
const enableTransferFee = ref(false)

const errandType = ref<'custom' | 'market'>('custom')
const isRecording = ref(false)
const recentDropoffs = ref<string[]>([])
const attachedImagesBase64 = ref<string[]>([])
const waybillNumber = ref('')

// Pooling feature state
import { orders_api } from '@/api_factory/modules/orders'
const openPools = ref<any[]>([])
const selectedPoolId = ref<string | null>(null)
const allowPoolJoin = ref(false)
const fetchingPools = ref(true)

const showAllTemplates = ref(false)

const fetchPools = async () => {
  fetchingPools.value = true
  try {
    const res = await orders_api.getOpenPools()
    openPools.value = res.data || []
  } catch (error) {
    console.error('Failed to fetch open pools:', error)
  } finally {
    fetchingPools.value = false
  }
}

const selectPool = (pool: any) => {
  if (selectedPoolId.value === pool._id) {
    selectedPoolId.value = null
    form.value.runnerFee = 0 // reset so user can enter a fee again
  } else {
    selectedPoolId.value = pool._id
    allowPoolJoin.value = false
    // Lock the runner fee to the split fee calculated
    const newCount = (pool.orders?.length || 1) + 1
    form.value.runnerFee = Math.floor(pool.baseDeliveryFee / newCount)
  }
}

const fetchInitialData = async () => {
  fetchPools()
  // Fetch admin-configurable minimum runner fee
  try {
    const settingsRes = await orders_api.getCustomErrandSettings()
    const settings = settingsRes?.data || settingsRes
    if (settings?.minCustomErrandFee) {
      minRunnerFee.value = settings.minCustomErrandFee
    }
    if (settings?.enableTransferFee !== undefined) {
      enableTransferFee.value = settings.enableTransferFee
    }
  } catch (e) {
    console.error('Failed to fetch custom errand settings:', e)
  }
}

watch(isLoggedIn, (newVal) => {
  if (newVal) {
    fetchInitialData()
  }
})

onMounted(() => {
  if (!isLoggedIn.value) {
    isAuthModalOpen.value = true
  } else {
    fetchInitialData()
  }
})

const form = ref({
  description: '',
  pickupLocation: '',
  dropoffLocation: '',
  estimatedItemCost: 0,
  runnerFee: 0,
})

const formattedItemCost = computed({
  get: () => {
    if (!form.value.estimatedItemCost) return ''
    return form.value.estimatedItemCost.toLocaleString('en-NG')
  },
  set: (val) => {
    if (!val) {
      form.value.estimatedItemCost = 0
      return
    }
    const numStr = val.toString().replace(/[^0-9]/g, '')
    form.value.estimatedItemCost = numStr ? parseInt(numStr, 10) : 0
  }
})

const formattedRunnerFee = computed({
  get: () => {
    if (!form.value.runnerFee) return ''
    return form.value.runnerFee.toLocaleString('en-NG')
  },
  set: (val) => {
    if (!val) {
      form.value.runnerFee = 0
      return
    }
    const numStr = val.toString().replace(/[^0-9]/g, '')
    form.value.runnerFee = numStr ? parseInt(numStr, 10) : 0
  }
})

const marketForm = ref({
  marketName: '',
  itemsList: ''
})

const checklistItems = ref<string[]>([''])
const marketChecklistItems = ref<string[]>([''])

const predefinedLocations = [
  'Block hostel', 'OPH hostel', 'Coorporative hostel', 'Faculty of Medicine',
  'College Library', 'Senate Building', 'Amphitheatre'
]

// Restore draft state from sessionStorage
const restoreDraft = () => {
  try {
    const draftStr = sessionStorage.getItem('customErrandDraft')
    if (draftStr) {
      const draft = JSON.parse(draftStr)
      if (draft.errandType) errandType.value = draft.errandType
      if (draft.form) {
        form.value.description = draft.form.description || ''
        form.value.pickupLocation = draft.form.pickupLocation || ''
        form.value.dropoffLocation = draft.form.dropoffLocation || ''
        form.value.estimatedItemCost = draft.form.estimatedItemCost || 0
        form.value.runnerFee = draft.form.runnerFee || 0
      }
      if (draft.marketForm) {
        marketForm.value.marketName = draft.marketForm.marketName || ''
        marketForm.value.itemsList = draft.marketForm.itemsList || ''
      }
      if (draft.checklistItems) checklistItems.value = draft.checklistItems
      if (draft.marketChecklistItems) marketChecklistItems.value = draft.marketChecklistItems
      if (draft.step) step.value = draft.step
    }
  } catch (e) {
    console.error('Failed to restore custom errand draft', e)
  }
}

// Watch for changes and save draft
watch([errandType, form, marketForm, checklistItems, marketChecklistItems, step], () => {
  sessionStorage.setItem('customErrandDraft', JSON.stringify({
    errandType: errandType.value,
    form: form.value,
    marketForm: marketForm.value,
    checklistItems: checklistItems.value,
    marketChecklistItems: marketChecklistItems.value,
    step: step.value
  }))
}, { deep: true })


const errandTemplates = [
  "Get drugs from the pharmacy",
  "Buy energy drinks/snacks",
  "Buy groceries from",
  "Print documents at",
  "Pick up a package from",
  "Get food from",
  "Pay a bill at",
  "Drop off a parcel at",
  "Buy textbooks from"
]

onMounted(() => {
  // Client-only slip number, generated after mount to avoid SSR hydration mismatch
  waybillNumber.value = 'ND-' + Math.floor(100000 + Math.random() * 900000)
})

onMounted(async () => {
  restoreDraft()
  // Settings fetch moved to fetchInitialData

  const saved = localStorage.getItem('recentDropoffs')
  if (saved) {
    try {
      recentDropoffs.value = JSON.parse(saved)
    } catch(e){}
  }

  // Handle Paystack callback: verify payment and redirect to order
  if (route.query.reference) {
    isSubmitting.value = true
    step.value = 3
    const refStr = route.query.reference as string

    try {
      const verification = await verifyPayment(refStr)
      const vData = verification?.data || verification
      if (vData?.status === 'success') {
        // Extract orderId from the metadata that was passed during initialization
        const orderId = vData?.metadata?.orderId || vData?.data?.metadata?.orderId;
        
        if (orderId) {
          showToast({ title: 'Success!', message: 'Your errand is now live!', toastType: 'success' })
          sessionStorage.removeItem('customErrandDraft')
          router.push(`/dashboard/orders/${orderId}`)
          return
        } else {
          showToast({ title: 'Error', message: 'Could not find order reference. Please contact support.', toastType: 'error' })
        }
      } else {
        showToast({ title: 'Payment Failed', message: 'Your payment could not be verified. Please try again.', toastType: 'error' })
      }
    } catch (e: any) {
      console.error('Payment verification or order creation failed:', e)
      showToast({ title: 'Error', message: e.response?.data?.message || 'Failed to complete errand request.', toastType: 'error' })
    } finally {
      isSubmitting.value = false
      // Clean URL
      const url = new URL(window.location.href)
      url.searchParams.delete('reference')
      url.searchParams.delete('trxref')
      window.history.replaceState({}, '', url.toString())
    }
  }
})
// Removed duplicate checklistItems declaration
const addItem = (index: number) => {
  checklistItems.value.splice(index + 1, 0, '')
  nextTick(() => {
    const inputs = document.querySelectorAll('.checklist-input')
    if (inputs[index + 1]) (inputs[index + 1] as HTMLInputElement).focus()
  })
}

const removeItem = (index: number) => {
  if (checklistItems.value.length > 1) {
    checklistItems.value.splice(index, 1)
    nextTick(() => {
      const inputs = document.querySelectorAll('.checklist-input')
      if (inputs[Math.max(0, index - 1)]) (inputs[Math.max(0, index - 1)] as HTMLInputElement).focus()
    })
  } else {
    checklistItems.value[0] = ''
  }
}

const handleItemKeydown = (e: KeyboardEvent, index: number) => {
  if (e.key === 'Enter') {
    e.preventDefault()
    addItem(index)
  } else if (e.key === 'Backspace' && checklistItems.value[index] === '') {
    e.preventDefault()
    removeItem(index)
  }
}

watch(checklistItems, (newItems) => {
  form.value.description = newItems.filter(i => i.trim() !== '').join('\n')
}, { deep: true })
// Removed duplicate marketChecklistItems declaration
const addMarketItem = (index: number) => {
  marketChecklistItems.value.splice(index + 1, 0, '')
  nextTick(() => {
    const inputs = document.querySelectorAll('.market-checklist-input')
    if (inputs[index + 1]) (inputs[index + 1] as HTMLInputElement).focus()
  })
}

const removeMarketItem = (index: number) => {
  if (marketChecklistItems.value.length > 1) {
    marketChecklistItems.value.splice(index, 1)
    nextTick(() => {
      const inputs = document.querySelectorAll('.market-checklist-input')
      if (inputs[Math.max(0, index - 1)]) (inputs[Math.max(0, index - 1)] as HTMLInputElement).focus()
    })
  } else {
    marketChecklistItems.value[0] = ''
  }
}

const handleMarketItemKeydown = (e: KeyboardEvent, index: number) => {
  if (e.key === 'Enter') {
    e.preventDefault()
    addMarketItem(index)
  } else if (e.key === 'Backspace' && marketChecklistItems.value[index] === '') {
    e.preventDefault()
    removeMarketItem(index)
  }
}

watch(marketChecklistItems, (newItems) => {
  marketForm.value.itemsList = newItems.filter(i => i.trim() !== '').join('\n')
}, { deep: true })

const applyTemplate = (tmpl: string) => {
  if (checklistItems.value.length === 1 && !checklistItems.value[0]) {
    checklistItems.value[0] = `${tmpl} `
  } else {
    checklistItems.value.push(`${tmpl} `)
  }
  nextTick(() => {
    const inputs = document.querySelectorAll('.checklist-input')
    if (inputs[inputs.length - 1]) (inputs[inputs.length - 1] as HTMLInputElement).focus()
  })
}

const attachedVoiceNoteBase64 = ref('')
const recordingTime = ref(0)
let mediaRecorder: MediaRecorder | null = null
let audioChunks: Blob[] = []
let timerInterval: any = null
let recordedAudioBlob: Blob | null = null
let selectedImageFiles: File[] = []

const startRecording = async () => {
  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      showToast({ title: 'Not Supported', message: 'Microphone requires a secure connection (HTTPS/localhost).', toastType: 'error' })
      return
    }
    
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    mediaRecorder = new MediaRecorder(stream)
    audioChunks = []

    mediaRecorder.addEventListener('dataavailable', event => {
      audioChunks.push(event.data)
    })

    mediaRecorder.addEventListener('stop', () => {
      let mimeType = mediaRecorder?.mimeType;
      if (!mimeType) {
        mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4';
      }
      recordedAudioBlob = new Blob(audioChunks, { type: mimeType })
      const reader = new FileReader()
      reader.readAsDataURL(recordedAudioBlob)
      reader.onloadend = () => {
        attachedVoiceNoteBase64.value = reader.result as string
      }
      stream.getTracks().forEach(track => track.stop())
    })

    mediaRecorder.start()
    isRecording.value = true
    recordingTime.value = 0

    timerInterval = setInterval(() => {
      recordingTime.value += 1
      if (recordingTime.value >= 120) {
        stopRecording()
      }
    }, 1000)
  } catch (error: any) {
    console.error('Mic error:', error)
    if (error.name === 'NotAllowedError' || error.name === 'SecurityError') {
      showToast({ title: 'Error', message: 'Microphone access denied by browser.', toastType: 'error' })
    } else {
      showToast({ title: 'Error', message: 'Could not access microphone.', toastType: 'error' })
    }
  }
}

const stopRecording = () => {
  if (mediaRecorder && isRecording.value) {
    mediaRecorder.stop()
    isRecording.value = false
    if (timerInterval) clearInterval(timerInterval)
  }
}

const toggleRecording = () => {
  if (isRecording.value) {
    stopRecording()
  } else {
    startRecording()
  }
}

const removeVoiceNote = () => {
  attachedVoiceNoteBase64.value = ''
  recordedAudioBlob = null
}

const handleImageUpload = (event: Event) => {
  const files = Array.from((event.target as HTMLInputElement).files || [])
  if (!files.length) return
  
  files.forEach(file => {
    selectedImageFiles.push(file)
    const reader = new FileReader()
    reader.onload = (e) => {
      attachedImagesBase64.value.push(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  })
  // reset input value so the same file can be selected again if removed
  ;(event.target as HTMLInputElement).value = ''
}

const removeImage = (index: number) => {
  attachedImagesBase64.value.splice(index, 1)
  selectedImageFiles.splice(index, 1)
}

const isStep1Valid = computed(() => {
  if (errandType.value === 'custom') {
    return (form.value.description.trim().length > 5 || attachedVoiceNoteBase64.value) &&
           form.value.dropoffLocation.trim().length > 2
  } else {
    return marketForm.value.marketName.trim().length > 2 &&
           marketForm.value.itemsList.trim().length > 2 &&
           form.value.dropoffLocation.trim().length > 2
  }
})

const isStep2Valid = computed(() => {
  return form.value.runnerFee >= minRunnerFee.value
})

const transferFee = computed(() => {
  if (!enableTransferFee.value) return 0
  const amountToTransfer = (form.value.estimatedItemCost || 0) + (form.value.runnerFee || 0)
  if (amountToTransfer === 0) return 0
  if (amountToTransfer <= 5000) return 10
  if (amountToTransfer <= 50000) return 25
  return 50
})

const grandTotal = computed(() => {
  return (form.value.estimatedItemCost || 0) + 
         (form.value.runnerFee || 0) + 
         transferFee.value + 50 // 50 NGN flat platform fee
})

const formatMoney = (amount: number) => {
  return (amount || 0).toLocaleString('en-NG')
}

// Helper: upload files and build payload
const buildErrandPayload = async () => {
  let finalDescription = form.value.description
  let finalPickup = form.value.pickupLocation

  if (errandType.value === 'market') {
    finalDescription = `Market Run items:\n${marketForm.value.itemsList}`
    finalPickup = marketForm.value.marketName
  }

  if (form.value.dropoffLocation && !recentDropoffs.value.includes(form.value.dropoffLocation)) {
    const updated = [form.value.dropoffLocation, ...recentDropoffs.value].slice(0, 3)
    recentDropoffs.value = updated
    localStorage.setItem('recentDropoffs', JSON.stringify(updated))
  }

  let uploadedImageUrls: string[] = []
  let uploadedVoiceNoteUrl = ''

  if (selectedImageFiles.length > 0) {
    for (const file of selectedImageFiles) {
      const formData = new FormData()
      formData.append('file', file)
      const uploadRes = await api.post('/upload?resourceType=image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      uploadedImageUrls.push(uploadRes.data.url)
    }
  }

  if (recordedAudioBlob) {
    const formData = new FormData()
    const ext = recordedAudioBlob.type.includes('mp4') ? 'mp4' : (recordedAudioBlob.type.includes('ogg') ? 'ogg' : 'webm')
    formData.append('file', recordedAudioBlob, `voicenote.${ext}`)
    const uploadRes = await api.post('/upload?resourceType=video', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    let finalUrl = uploadRes.data.url
    if (finalUrl.endsWith('.webm')) {
      finalUrl = finalUrl.replace(/\.webm$/i, '.mp4')
    }
    uploadedVoiceNoteUrl = finalUrl
  }

  return {
    type: 'custom_errand',
    pickupLocation: finalPickup,
    dropoffLocation: form.value.dropoffLocation,
    description: finalDescription,
    attachedImage: uploadedImageUrls.length > 0 ? uploadedImageUrls[0] : undefined,
    attachedImages: uploadedImageUrls.length > 0 ? uploadedImageUrls : undefined,
    attachedVoiceNote: uploadedVoiceNoteUrl || undefined,
    estimatedItemCost: form.value.estimatedItemCost || 0,
    runnerFee: form.value.runnerFee,
    urgency: 'standard',
    intendedPoolId: selectedPoolId.value || undefined,
    intendsToCreatePool: allowPoolJoin.value || false
  }
}

const submitErrand = async () => {
  if (!isLoggedIn.value) {
    isAuthModalOpen.value = true
    return
  }

  isSubmitting.value = true

  try {
    const payload = await buildErrandPayload()

    // 1. Create the order FIRST (will be created as PENDING since no payment reference is provided yet)
    const response = await api.post('/orders', payload)
    const orderId = response.data._id || response.data.id


    // Clear draft state after successfully creating order
    sessionStorage.removeItem('customErrandDraft')

    // 2. Redirect to Negotiation Gateway to allow erranders to submit counter-bids
    navigateTo(`/negotiation?orderIds=${orderId}`)
  } catch (error: any) {
    console.error(error)
    showToast({ title: 'Error', message: error.response?.data?.message || 'Failed to process errand.', toastType: 'error' })
  } finally {
    isSubmitting.value = false
  }
}

const handleAuthSuccess = () => {
  justAuthenticated.value = true
  fetchInitialData()
}
</script>

<style scoped>
/* Remove custom font to let standard Tailwind sans handle text */

.animate-fade-in {
  animation: slideFadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slideFadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

input[type=number]::-webkit-inner-spin-button,
input[type=number]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type=number] {
  -moz-appearance: textfield;
}

@media (prefers-reduced-motion: reduce) {
  .animate-fade-in, .animate-pulse, .animate-ping { animation: none !important; }
}
</style>