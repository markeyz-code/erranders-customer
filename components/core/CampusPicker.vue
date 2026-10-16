<template>
  <Transition name="campus-picker" appear>
    <div
      ref="dialogEl"
      class="fixed inset-0 z-[1500000] flex flex-col overflow-hidden bg-[#FAF8F5]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="campus-picker-title"
      tabindex="-1"
      @keydown="onKeydown"
    >
      <!-- Decorative brand wash -->
      <div class="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div class="absolute -right-24 -top-32 h-[28rem] w-[28rem] rounded-full bg-[#FF5C1A]/10 blur-3xl"></div>
        <div class="absolute -bottom-40 -left-24 h-[30rem] w-[30rem] rounded-full bg-[#FF5C1A]/5 blur-3xl"></div>
      </div>

      <!-- Brand row -->
      <header class="relative shrink-0 px-5 pt-6 sm:px-8 sm:pt-8">
        <div class="mx-auto flex w-full max-w-3xl items-center justify-between">
          <img
            src="@/assets/img/logo-light.png"
            alt="Erranders"
            class="h-8 w-auto rounded-lg border border-[#E7E2DA] bg-white px-2 py-1 sm:h-9"
          />
          <span class="ff-mono text-[10px] font-bold uppercase tracking-[0.22em] text-[#9C968E]">
            {{ institutions.length }} {{ institutions.length === 1 ? 'Campus' : 'Campuses' }}
          </span>
        </div>
      </header>

      <!-- Chooser -->
      <main class="relative flex-1 overflow-y-auto px-5 sm:px-8">
        <div class="mx-auto w-full max-w-3xl pb-6 pt-8 sm:pt-12">
          <h1
            id="campus-picker-title"
            class="max-w-2xl text-[27px] font-bold leading-[1.1] tracking-tight text-[#171310] sm:text-4xl"
          >
            Which campus are you on?
          </h1>
          <p class="mt-3 max-w-xl text-[14px] leading-relaxed text-[#6B655E] sm:text-[15px]">
            Choose your campus so Erranders only shows the vendors, meals and errands that serve you.
          </p>

          <!-- Search -->
          <div class="relative mt-7">
            <Search class="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9C968E]" aria-hidden="true" />
            <input
              ref="searchInput"
              v-model="query"
              type="search"
              autocomplete="off"
              class="h-12 w-full rounded-xl border border-[#E7E2DA] bg-white pl-11 pr-4 text-[14px] font-medium text-[#171310] placeholder:text-[#9C968E] focus:border-[#FF5C1A]/60 focus:outline-none focus:ring-2 focus:ring-[#FF5C1A]/20"
              placeholder="Search by campus, city, or state (e.g. Lagos, Ibadan, UNILAG)"
              aria-label="Search campuses"
            />
          </div>

          <!-- Category filter tabs -->
          <div class="mt-4 flex flex-wrap gap-2">
            <button
              v-for="cat in categoryTabs"
              :key="cat.id"
              type="button"
              class="rounded-lg px-3 py-1.5 text-[12px] font-bold transition-all"
              :class="activeCategory === cat.id
                ? 'bg-[#171310] text-white shadow-sm'
                : 'bg-white border border-[#E7E2DA] text-[#6B655E] hover:border-[#171310]/30 hover:text-[#171310]'"
              @click="activeCategory = cat.id"
            >
              {{ cat.label }}
            </button>
          </div>

          <!-- Campus count pill -->
          <div class="mt-4 flex items-center justify-between text-[12px] text-[#9C968E]">
            <span>Showing {{ filtered.length }} {{ filtered.length === 1 ? 'campus' : 'campuses' }}</span>
            <span v-if="selected" class="font-bold text-[#FF5C1A]">Selected: {{ selected.shortName || selected.name }}</span>
          </div>

          <!-- Campus list -->
          <div
            v-if="filtered.length"
            class="mt-4 grid gap-3 sm:grid-cols-2"
            role="radiogroup"
            aria-labelledby="campus-picker-title"
          >
            <button
              v-for="campus in filtered"
              :key="campusKey(campus)"
              type="button"
              role="radio"
              :aria-checked="isSelected(campus)"
              class="group relative w-full rounded-2xl border bg-white p-4 text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF5C1A]/40 sm:p-5"
              :class="isSelected(campus)
                ? 'border-[#FF5C1A] shadow-[0_14px_34px_-16px_rgba(255,92,26,0.55)]'
                : 'border-[#E7E2DA] hover:border-[#171310]/25 hover:shadow-[0_14px_34px_-22px_rgba(23,19,16,0.45)]'"
              @click="select(campus)"
            >
              <span
                class="absolute right-3.5 top-3.5 flex h-5 w-5 items-center justify-center rounded-full border transition-all"
                :class="isSelected(campus)
                  ? 'border-[#FF5C1A] bg-[#FF5C1A] text-white'
                  : 'border-[#E7E2DA] text-transparent group-hover:border-[#171310]/25'"
                aria-hidden="true"
              >
                <Check class="h-3 w-3" />
              </span>

              <div class="flex items-start gap-3">
                <span
                  class="flex h-10 min-w-[2.5rem] shrink-0 items-center justify-center rounded-lg px-2 text-[11px] font-bold uppercase tracking-wide text-white transition-colors"
                  :class="isSelected(campus) ? 'bg-[#FF5C1A]' : 'bg-[#171310]'"
                >
                  {{ campus.shortName || campus.slug }}
                </span>

                <div class="min-w-0 flex-1 pr-6">
                  <p class="text-[14px] font-bold leading-snug text-[#171310]">{{ campus.name }}</p>
                  <p v-if="locationLine(campus)" class="mt-1 truncate text-[12px] text-[#9C968E]">
                    {{ locationLine(campus) }}
                  </p>

                  <!-- Stats arrive progressively and may never arrive at all -->
                  <p class="mt-2.5 min-h-[16px] text-[11px] leading-4 text-[#9C968E]">
                    <template v-if="statsText(campus)">{{ statsText(campus) }}</template>
                    <span
                      v-else-if="statsPending(campus)"
                      class="inline-block h-2.5 w-24 animate-pulse rounded-full bg-[#EFEAE3] align-middle"
                    ></span>
                    <template v-else>{{ statsFallback(campus) }}</template>
                  </p>
                </div>
              </div>
            </button>
          </div>

          <!-- Nothing to show for this search -->
          <div
            v-else
            class="mt-6 rounded-2xl border border-dashed border-[#E7E2DA] bg-white/70 px-6 py-10 text-center"
          >
            <p class="text-[14px] font-bold text-[#171310]">No campus matches your search</p>
            <p class="mt-1.5 text-[12px] text-[#9C968E]">Try the campus name, its short name or the city.</p>
            <button
              type="button"
              class="mt-4 rounded-lg border border-[#E7E2DA] bg-white px-3.5 py-2 text-[12px] font-bold text-[#171310] transition-all hover:border-[#171310] hover:bg-[#171310] hover:text-white active:scale-95"
              @click="query = ''"
            >
              Clear search
            </button>
          </div>
        </div>
      </main>

      <!-- Continue -->
      <footer class="relative shrink-0 border-t border-[#E7E2DA] bg-white/90 backdrop-blur px-5 sm:px-8">
        <div
          class="mx-auto flex w-full max-w-3xl flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <p class="text-[12px] text-[#9C968E]">
            <template v-if="selected">
              Ready to explore
              <span class="font-bold text-[#171310]">{{ selected.shortName || selected.name }}</span>.
            </template>
            <template v-else>Pick a campus to continue. You can change it later from the menu.</template>
          </p>

          <div class="flex items-center gap-3">
            <button
              v-if="hasChosen"
              type="button"
              class="rounded-xl px-3 py-3 text-[13px] font-bold text-[#9C968E] transition-colors hover:text-[#171310]"
              :disabled="isSwitching"
              @click="emit('close')"
            >
              Cancel
            </button>
            <button
              type="button"
              class="h-12 flex-1 rounded-xl bg-[#FF5C1A] px-6 text-[14px] font-bold text-white shadow-[0_12px_28px_-14px_rgba(255,92,26,0.8)] transition-all hover:bg-[#F05214] active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-[#EFEAE3] disabled:text-[#9C968E] disabled:shadow-none sm:flex-none"
              :disabled="!selected || isSwitching"
              @click="onContinue"
            >
              {{ isSwitching ? 'Switching…' : 'Continue' }}
            </button>
          </div>
        </div>
      </footer>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Check, Search } from 'lucide-vue-next'
import {
  institutions_api,
  type Institution,
  type InstitutionStats,
} from '@/api_factory/modules/institutions'
import { useInstitution } from '@/composables/useInstitution'

/**
 * The first-visit campus chooser — a full-screen overlay listing the active
 * campuses, with the light vendor/service counts fetched progressively so the
 * cards never wait on the network.
 *
 * A campus is required the first time, so there is no close button and Escape
 * does not dismiss. When the visitor already has a campus (the drawer's "Change"
 * row re-opens this), cancelling is allowed: nothing is lost by walking away.
 */
const emit = defineEmits<{ (e: 'close'): void }>()

const { institution, institutions, hasChosen, switchInstitution } = useInstitution()

const dialogEl = ref<HTMLElement | null>(null)
const searchInput = ref<HTMLInputElement | null>(null)

const query = ref('')
const selected = ref<Institution | null>(null)
const isSwitching = ref(false)

const activeCategory = ref('all')
const categoryTabs = [
  { id: 'all', label: 'All Institutions' },
  { id: 'university', label: 'Universities' },
  { id: 'health_sciences', label: 'Health & Medical' },
  { id: 'polytechnic', label: 'Polytechnics' },
  { id: 'college_of_education', label: 'Colleges of Ed' },
]

/** Vendor/service counts per campus key, plus the keys that failed. */
const stats = ref<Record<string, InstitutionStats>>({})
const failedStats = ref<string[]>([])

/** The key used for storage, headers and stats: the id, falling back to slug. */
const campusKey = (campus: Institution): string => campus._id || campus.slug

const isSelected = (campus: Institution): boolean =>
  !!selected.value && campusKey(selected.value) === campusKey(campus)

const locationLine = (campus: Institution): string =>
  [campus.city, campus.state].filter(Boolean).join(', ') || campus.country || ''

const filtered = computed(() => {
  let list = institutions.value

  // Category filter
  if (activeCategory.value !== 'all') {
    list = list.filter((campus: any) => campus.category === activeCategory.value)
  }

  const term = query.value.trim().toLowerCase()
  if (!term) return list

  return list.filter((campus) =>
    [campus.name, campus.shortName, campus.city, campus.state]
      .filter(Boolean)
      .some((field) => String(field).toLowerCase().includes(term))
  )
})

const statsText = (campus: Institution): string => {
  const counts = stats.value[campusKey(campus)]
  if (!counts) return ''
  const parts: string[] = []
  if (counts.vendors > 0) parts.push(`${counts.vendors} ${counts.vendors === 1 ? 'vendor' : 'vendors'}`)
  if (counts.services > 0) parts.push(`${counts.services} ${counts.services === 1 ? 'service' : 'services'}`)
  return parts.join(' · ')
}

const statsPending = (campus: Institution): boolean => {
  const key = campusKey(campus)
  return !stats.value[key] && !failedStats.value.includes(key)
}

const statsFallback = (campus: Institution): string =>
  failedStats.value.includes(campusKey(campus)) ? '' : 'No vendors listed yet'

/** Fetch the light counts in one fast batch call across all campuses. */
const loadStats = async (): Promise<void> => {
  try {
    const res: any = await (institutions_api as any).allStats()
    if (res?.type === 'ERROR') throw new Error(String(res?.status ?? 'ERROR'))
    const payload = res?.data ?? res?.value
    if (payload && typeof payload === 'object') {
      stats.value = payload
      return
    }
  } catch {
    // If batch stats fails, gracefully fallback
  }
}

/**
 * Pre-select the obvious answer — the campus already in use, or the only one on
 * offer — without ever overriding a choice the visitor made on this screen.
 */
const maybeAutoSelect = (): void => {
  if (selected.value) return

  const current = institution.value
  if (current && institutions.value.some((campus) => campusKey(campus) === campusKey(current))) {
    selected.value = current
    return
  }
  if (institutions.value.length === 1) selected.value = institutions.value[0]
}

const select = (campus: Institution): void => {
  selected.value = campus
}

/** A campus is required: Escape is swallowed unless there is one to fall back on. */
const onKeydown = (event: KeyboardEvent): void => {
  if (event.key === 'Escape') {
    event.preventDefault()
    event.stopPropagation()
    // A campus is required the first time, so Escape only ever cancels a change
    // of an already-chosen campus — never a first visit.
    if (hasChosen.value && !isSwitching.value) emit('close')
    return
  }

  if (event.key !== 'Tab' || !dialogEl.value) return

  // Keep focus inside the overlay for as long as it is up.
  const focusables = Array.from(
    dialogEl.value.querySelectorAll<HTMLElement>(
      'button:not([disabled]), input:not([disabled]), [href], select, textarea, [tabindex]:not([tabindex="-1"])'
    )
  ).filter((el) => el.offsetParent !== null || el === document.activeElement)

  if (focusables.length === 0) return
  const first = focusables[0]
  const last = focusables[focusables.length - 1]

  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault()
    last.focus()
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault()
    first.focus()
  }
}

/** Escape must not reach anything else while the chooser owns the screen. */
const swallowEscape = (event: KeyboardEvent): void => {
  if (!hasChosen.value && event.key === 'Escape') {
    event.preventDefault()
    event.stopPropagation()
  }
}

const onContinue = async (): Promise<void> => {
  const campus = selected.value
  if (!campus || isSwitching.value) return

  isSwitching.value = true
  try {
    // Raises the global switching splash, pins the campus on the server when
    // signed in, and always persists it locally.
    await switchInstitution(campus)
  } finally {
    isSwitching.value = false
    emit('close')
  }
}

onMounted(() => {
  maybeAutoSelect()
  void loadStats()
  document.addEventListener('keydown', swallowEscape)
  nextTick(() => searchInput.value?.focus())
})

onBeforeUnmount(() => {
  document.removeEventListener('keydown', swallowEscape)
})

// The list can arrive (or refresh) after the overlay is already up.
watch(institutions, () => {
  maybeAutoSelect()
  void loadStats()
})
</script>

<style scoped>
.campus-picker-enter-active,
.campus-picker-leave-active {
  transition: opacity 0.35s cubic-bezier(0.16, 1, 0.3, 1), transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}

.campus-picker-enter-from,
.campus-picker-leave-to {
  opacity: 0;
  transform: translateY(12px) scale(0.995);
}

.ff-mono {
  font-family: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
}
</style>
