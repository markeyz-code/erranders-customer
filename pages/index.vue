<template>
  <div class="landing">
    <!-- Sticky header: four links, one action. Nothing else. -->
    <header class="nav">
      <NuxtLink to="/" class="brand" aria-label="Erranders home">
        <img src="@/assets/img/logo-light.png" alt="Erranders" class="brand-img" />
      </NuxtLink>

      <nav class="nav-links" aria-label="Main">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          class="nav-link"
          :class="{ current: isCurrent(link.to) }"
          :aria-current="isCurrent(link.to) ? 'page' : undefined"
        >
          {{ link.label }}
        </NuxtLink>
      </nav>

      <div class="nav-actions">
        <button
          type="button"
          class="icon-toggle"
          :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
          :title="isDark ? 'Light mode' : 'Dark mode'"
          @click="toggleTheme"
        >
          <Sun v-if="isDark" class="w-5 h-5" aria-hidden="true" />
          <Moon v-else class="w-5 h-5" aria-hidden="true" />
        </button>
        <NuxtLink v-if="!isLoggedIn" to="/auth/login" class="ghost">Log in</NuxtLink>
        <NuxtLink :to="isLoggedIn ? '/dashboard' : '/auth/signup'" class="primary">
          {{ isLoggedIn ? 'Dashboard' : 'Get started' }}
          <ArrowRight class="w-4 h-4" aria-hidden="true" />
        </NuxtLink>
      </div>
    </header>

    <main>
      <!-- Hero: one sentence, one field, one object that explains the product. -->
      <section
        class="hero"
        @mouseenter="pausedByPointer = true"
        @mouseleave="pausedByPointer = false"
        @focusin="pausedByFocus = true"
        @focusout="pausedByFocus = false"
        @touchstart.passive="onTouchStart"
        @touchend.passive="onTouchEnd"
      >
        <div class="hero-copy">
          <!-- Tabs. The line under the active one fills as the timer runs. -->
          <div class="tabs" role="tablist" aria-label="Services" @keydown="onTabKey">
            <button
              v-for="(sl, i) in slides"
              :key="sl.key"
              :id="`tab-${sl.key}`"
              type="button"
              role="tab"
              class="tab"
              :class="{ on: i === index }"
              :aria-selected="i === index"
              :aria-controls="`panel-${sl.key}`"
              :tabindex="i === index ? 0 : -1"
              @click="select(i)"
            >
              {{ sl.tab }}
              <span
                v-if="i === index"
                :key="`line-${index}-${runId}`"
                class="tab-line"
                :class="{ running: running }"
                aria-hidden="true"
              />
            </button>
          </div>

          <!-- Fixed height so the page does not jump between slides. -->
          <div
            :id="`panel-${current.key}`"
            class="panel"
            role="tabpanel"
            :aria-labelledby="`tab-${current.key}`"
            :aria-live="running ? 'off' : 'polite'"
          >
            <div :key="`c-${index}-${changeId}`" class="swap">
              <h1 class="headline">
                <span class="line">{{ current.line1 }}</span>
                <span class="line">{{ current.line2 }}</span>
              </h1>

              <p class="sub">{{ current.sub }}</p>

              <form v-if="current.placeholder" class="field" @submit.prevent="go">
                <input
                  v-model="q"
                  type="search"
                  class="field-input"
                  :placeholder="current.placeholder"
                  :aria-label="current.placeholder"
                />
                <button type="submit" class="field-go">{{ current.button }}</button>
              </form>

              <NuxtLink v-else :to="current.route" class="field-go solo">{{ current.button }}</NuxtLink>

              <p class="hint">
                <span v-if="current.key === 'food'" class="hint-dot" aria-hidden="true"></span>
                {{ hintText }}
              </p>
            </div>
          </div>

          <div class="controls">
            <button
              type="button"
              class="play-btn"
              :aria-label="running ? 'Pause slides' : 'Play slides'"
              @click="toggleRunning"
            >
              <span v-if="running" class="icon">II</span>
              <span v-else class="icon">▶</span>
              {{ running ? 'Pause' : 'Play' }}
            </button>
          </div>
        </div>

        <!-- The ticket. Same object each slide, different contents. -->
        <div class="ticket-wrap">
          <div :key="`t-${index}-${changeId}`" class="ticket" aria-hidden="true">
            <div class="ticket-top">
              <p class="ticket-status">{{ current.ticket.status }}</p>
              <p class="ticket-item">{{ current.ticket.title }}</p>
              <p class="ticket-vendor">{{ current.ticket.sub }}</p>

              <div class="progress">
                <span
                  v-for="(step, i) in current.ticket.steps"
                  :key="step"
                  class="prog"
                  :class="{ done: i <= current.ticket.at }"
                />
              </div>
              <div class="progress-labels">
                <span v-for="step in current.ticket.steps" :key="step">{{ step }}</span>
              </div>
            </div>

            <div class="ticket-stub">
              <p class="stub-label">{{ current.ticket.stubLabel }}</p>
              <p class="stub-value">{{ current.ticket.stubValue }}</p>
              <div class="perforation"></div>
              <p class="stub-note">{{ current.ticket.stubNote }}</p>
            </div>

            <span class="notch left" aria-hidden="true" />
            <span class="notch right" aria-hidden="true" />
          </div>
        </div>
      </section>

      <!-- Open right now -->
      <section class="open">
        <div class="sec-head">
          <h2>Open right now</h2>
          <div class="sec-tools">
            <button type="button" class="rail-btn" aria-label="Scroll left" @click="scrollRail(-1)">‹</button>
            <button type="button" class="rail-btn" aria-label="Scroll right" @click="scrollRail(1)">›</button>
            <NuxtLink to="/vendors" class="sec-link">All stores</NuxtLink>
          </div>
        </div>

        <div v-if="loading" class="rail">
          <div v-for="i in 3" :key="i" class="skel" />
        </div>

        <div v-else ref="rail" class="rail" role="list">
          <NuxtLink v-for="vendor in openVendors" :key="vendor._id" :to="`/vendors/${vendor._id}`" class="store" role="listitem">
            <div class="store-media">
              <img :src="vendor.banner || vendor.logo || '/placeholder-store.jpg'" class="store-img" alt="" loading="lazy" />
              <span v-if="vendor.preOrderOnly" class="pill">Pre-order</span>
            </div>
            <div class="store-body">
              <div class="store-row">
                <p class="store-name">{{ cleanName(vendor.storeName) }}</p>
                <span v-if="hasReviews(vendor)" class="rating">
                  <Star class="w-3.5 h-3.5" aria-hidden="true" />{{ vendor.rating?.toFixed(1) }}
                </span>
                <span v-else class="new">New</span>
              </div>
              <p class="store-meta">{{ vendor.category || 'Store' }} · {{ vendor.preparationTime || 20 }} min</p>
            </div>
          </NuxtLink>
        </div>

        <div v-if="closedCount" class="closed-box">
          <button v-if="!showClosed" type="button" class="closed-toggle" :aria-expanded="false" @click="showClosed = true">
            {{ closedCount }} closed {{ closedCount === 1 ? 'store' : 'stores' }}. Show them
          </button>

          <template v-else>
            <div class="closed-head">
              <p class="closed-title">Closed now</p>
              <button type="button" class="closed-toggle quiet" :aria-expanded="true" @click="showClosed = false">Hide</button>
            </div>
            <div class="rail">
              <NuxtLink v-for="vendor in closedVendors" :key="vendor._id" :to="`/vendors/${vendor._id}`" class="store closed-store">
                <div class="store-media">
                  <img :src="vendor.banner || vendor.logo || '/placeholder-store.jpg'" class="store-img dim" alt="" loading="lazy" />
                  <span class="pill closed">{{ opensAt(vendor) }}</span>
                </div>
                <div class="store-body">
                  <p class="store-name">{{ cleanName(vendor.storeName) }}</p>
                  <p class="store-meta">{{ vendor.category || 'Store' }} · Closed</p>
                </div>
              </NuxtLink>
            </div>
          </template>
        </div>
      </section>

      <!-- How it works: a real sequence, so numbers earn their place. -->
      <section class="how">
        <h2>How it works</h2>
        <ol class="steps">
          <li class="step">
            <span class="num">1</span>
            <p class="step-title">Pick</p>
            <p class="step-body">Food from a campus store, or describe the errand you need run.</p>
          </li>
          <li class="step">
            <span class="num">2</span>
            <p class="step-title">Pay</p>
            <p class="step-body">Card or wallet. For errands, your price is held until a rider takes it.</p>
          </li>
          <li class="step">
            <span class="num">3</span>
            <p class="step-title">Get it</p>
            <p class="step-body">A student rider brings it to your hostel and asks for your PIN.</p>
          </li>
        </ol>
      </section>

      <!-- More than food: one bento, three ways in. -->
      <section class="bento">
        <NuxtLink to="/errands/custom" class="tile tile-errand">
          <p class="tile-tag">Errands</p>
          <h3 class="tile-title">Set your price. A student runs it.</h3>
          <ul class="tile-list">
            <li>Your fee is held until a rider takes the job</li>
            <li>Chat with them while they are on the way</li>
            <li>Laundry, documents, groceries, anything legal</li>
          </ul>
          <span class="tile-cta">Request an errand <ArrowUpRight class="w-4 h-4" aria-hidden="true" /></span>
        </NuxtLink>

        <NuxtLink to="/dashboard/recurring-orders" class="tile tile-meals">
          <p class="tile-tag">Meal Autopilot</p>
          <h3 class="tile-title">Lunch, every day, without asking twice.</h3>
          <div class="sched">
            <div class="sched-row">
              <span class="sched-time">Tomorrow, 1:00 pm</span>
              <span class="sched-check" aria-hidden="true">✓</span>
            </div>
            <div class="sched-item">
              <p>Jollof rice and chicken</p>
              <span>Waris Kitchen</span>
            </div>
            <div class="sched-item">
              <p>Chilled zobo</p>
              <span>Drinks</span>
            </div>
          </div>
          <span class="tile-cta">Set it up <ArrowUpRight class="w-4 h-4" aria-hidden="true" /></span>
        </NuxtLink>

        <NuxtLink to="/market-pool" class="tile tile-swap">
          <p class="tile-tag">Swap</p>
          <h3 class="tile-title">Sell what you don't use</h3>
          <p class="tile-body">Fans, textbooks, mattresses. Cash or swap, escrow protected.</p>
          <span class="tile-cta">Explore swaps <ArrowUpRight class="w-4 h-4" aria-hidden="true" /></span>
        </NuxtLink>
      </section>

      <!-- One closing banner, not two. -->
      <section class="closer">
        <h2>Running late? Errand it.</h2>
        <NuxtLink :to="isLoggedIn ? '/dashboard' : '/auth/signup'" class="closer-btn">
          Get started <ArrowRight class="w-4 h-4" aria-hidden="true" />
        </NuxtLink>
      </section>
    </main>

    <footer class="foot">
      <div class="foot-inner">
        <div class="foot-brand">
          <NuxtLink to="/" aria-label="Erranders home">
            <img src="@/assets/img/logo-light.png" alt="Erranders" class="brand-img" />
          </NuxtLink>
          <p class="foot-line">Food, errands, meal plans and swaps for students on campus.</p>
          <NuxtLink to="/vendors" class="foot-cta">
            Order something
            <ArrowRight class="w-4 h-4" aria-hidden="true" />
          </NuxtLink>
        </div>

        <nav class="foot-cols" aria-label="Footer">
          <div class="foot-col">
            <p class="foot-title">Platform</p>
            <NuxtLink to="/vendors" class="foot-link">Food</NuxtLink>
            <NuxtLink to="/errands/custom" class="foot-link">Errands</NuxtLink>
            <NuxtLink to="/dashboard/recurring-orders" class="foot-link">Meal Autopilot</NuxtLink>
            <NuxtLink to="/market-pool" class="foot-link">Swap</NuxtLink>
          </div>
          <div class="foot-col">
            <p class="foot-title">Legal</p>
            <NuxtLink to="/terms" class="foot-link">Terms</NuxtLink>
            <NuxtLink to="/privacy" class="foot-link">Privacy</NuxtLink>
            <NuxtLink to="/refunds" class="foot-link">Refunds</NuxtLink>
          </div>
          <div class="foot-col">
            <p class="foot-title">Partners</p>
            <NuxtLink to="/vendor-signup" class="foot-link">Sell on Erranders</NuxtLink>
            <NuxtLink to="/dispatch" class="foot-link">Ride with us</NuxtLink>
          </div>
        </nav>
      </div>

      <div class="foot-base">
        <p class="foot-copy">© {{ year }} Erranders. All rights reserved.</p>
        <p class="foot-note">Built for campus life.</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { ArrowRight, ArrowUpRight, Moon, Star, Sun } from 'lucide-vue-next';
import { useLandingPage } from '@/composables/modules/landing';
import { useUser } from '@/composables/modules/auth/user';

definePageMeta({ layout: false });

const { loading, onlineVendors, fetchHomeData } = useLandingPage();
const { isLoggedIn } = useUser();

const AUTO_MS = 6500;

type Ticket = {
  status: string;
  title: string;
  sub: string;
  steps: string[];
  at: number;
  stubLabel: string;
  stubValue: string;
  stubNote: string;
};

type Slide = {
  key: string;
  tab: string;
  line1: string;
  line2: string;
  sub: string;
  placeholder: string | null;
  button: string;
  route: string;
  hint: string;
  ticket: Ticket;
};

const slides: Slide[] = [
  {
    key: 'food',
    tab: 'Food',
    line1: "Don't walk down.",
    line2: 'Order it.',
    sub: 'Hot food from campus vendors, brought to your hostel door.',
    placeholder: 'Jollof, suya, a cold drink',
    button: 'Order food',
    route: '/vendors',
    hint: '',
    ticket: {
      status: 'On the way',
      title: 'Jollof and chicken',
      sub: 'Waris Kitchen',
      steps: ['Placed', 'Picked up', 'On the way', 'Arrived'],
      at: 2,
      stubLabel: 'Delivery PIN',
      stubValue: '3 8 8 8',
      stubNote: 'Give it to your rider when they arrive',
    },
  },
  {
    key: 'errand',
    tab: 'Errand',
    line1: "Can't go?",
    line2: 'Errand it.',
    sub: 'Laundry, documents, groceries. A student runner picks it up. You set the fee.',
    placeholder: 'Pick up my laundry from Block B',
    button: 'Send errand',
    route: '/errands/custom',
    hint: 'Your fee is held until a runner accepts',
    ticket: {
      status: 'Runner accepted',
      title: 'Laundry pickup, Block B',
      sub: 'Chidi accepted your fee',
      steps: ['Posted', 'Accepted', 'Picked up', 'Done'],
      at: 1,
      stubLabel: 'Delivery PIN',
      stubValue: '5 2 1 4',
      stubNote: 'Give it to your runner when they arrive',
    },
  },
  {
    key: 'meals',
    tab: 'Meals',
    line1: 'Hungry later?',
    line2: 'Plan it.',
    sub: 'Pick your meals for the week once. We place each order and deliver it on time.',
    placeholder: null,
    button: 'Set up Meal Autopilot',
    route: '/dashboard/recurring-orders',
    hint: 'Orders are placed and delivered on schedule',
    ticket: {
      status: 'Scheduled',
      title: 'Jollof rice and chicken',
      sub: 'Waris Kitchen',
      steps: ['Planned', 'Ordered', 'On the way', 'Arrived'],
      at: 0,
      stubLabel: 'Next order',
      stubValue: 'Tue 1:00 pm',
      stubNote: 'Repeats every Tuesday',
    },
  },
  {
    key: 'swap',
    tab: 'Swap',
    line1: "Don't dump it.",
    line2: 'Swap it.',
    sub: 'Turn an old fan, textbooks or a mattress into cash, or trade with verified students.',
    placeholder: 'What do you want to sell or swap?',
    button: 'List an item',
    route: '/market-pool',
    hint: 'Payment is held safely. No listing fees',
    ticket: {
      status: 'Offer received',
      title: 'Standing fan, 18 inch',
      sub: 'Offer 12,000',
      steps: ['Listed', 'Offer', 'Agreed', 'Paid'],
      at: 1,
      stubLabel: 'Held safely',
      stubValue: '12,000',
      stubNote: 'Released when you both agree',
    },
  },
];

const index = ref(0);
const q = ref('');
const current = computed(() => slides[index.value]);

const openCount = computed(
  () => (onlineVendors.value || []).filter((v: any) => v?.isOpen !== false).length,
);
const hintText = computed(() =>
  current.value.key === 'food'
    ? `${openCount.value} ${openCount.value === 1 ? 'store' : 'stores'} open now`
    : current.value.hint,
);

const running = ref(false);
const runId = ref(0);
const changeId = ref(0);
const pausedByPointer = ref(false);
const pausedByFocus = ref(false);
const stoppedByPerson = ref(false);
let timer: ReturnType<typeof setInterval> | null = null;

const reduced = () =>
  typeof window !== 'undefined' &&
  Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches);

const clearTimer = () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
};

const advance = () => {
  index.value = (index.value + 1) % slides.length;
  changeId.value += 1;
  runId.value += 1;
};

const start = () => {
  if (reduced()) return;
  clearTimer();
  running.value = true;
  stoppedByPerson.value = false;
  runId.value += 1;
  timer = setInterval(advance, AUTO_MS);
};

const stop = (byPerson = false) => {
  clearTimer();
  running.value = false;
  if (byPerson) stoppedByPerson.value = true;
};

const toggleRunning = () => {
  if (running.value) stop(false);
  else start();
};

/** Any deliberate choice stops autoplay until Play is pressed again. */
const select = (i: number) => {
  index.value = i;
  changeId.value += 1;
  runId.value += 1;
  stop(true);
};

const go = () => {
  const slide = current.value;
  if (!slide.placeholder) return;
  if (slide.key === 'food') {
    navigateTo({ path: '/vendors', query: q.value ? { q: q.value } : {} });
    return;
  }
  navigateTo(slide.route);
};

// Swipe
let touchX = 0;
const onTouchStart = (e: TouchEvent) => {
  touchX = e.changedTouches[0]?.clientX ?? 0;
};
const onTouchEnd = (e: TouchEvent) => {
  const dx = (e.changedTouches[0]?.clientX ?? 0) - touchX;
  if (Math.abs(dx) < 48) return;
  const next = dx < 0 ? index.value + 1 : index.value - 1;
  select((next + slides.length) % slides.length);
};

const onTabKey = (e: KeyboardEvent) => {
  if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
  e.preventDefault();
  const next = e.key === 'ArrowRight' ? index.value + 1 : index.value - 1;
  const at = (next + slides.length) % slides.length;
  select(at);
  const el = document.getElementById(`tab-${slides[at].key}`);
  el?.focus();
};

// Light unless the student chose dark. Same key as the dashboard toggle, so the choice follows them.
const isDark = ref(false);
const applyTheme = (dark: boolean, persist = true) => {
  isDark.value = dark;
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.classList.toggle('light', !dark);
  }
  if (persist && typeof localStorage !== 'undefined') {
    localStorage.setItem('erranders-theme', dark ? 'dark' : 'light');
  }
};
const toggleTheme = () => applyTheme(!isDark.value);
const year = new Date().getFullYear();

const route = useRoute();

const navLinks = [
  { to: '/vendors', label: 'Food' },
  { to: '/errands/custom', label: 'Errands' },
  { to: '/dashboard/recurring-orders', label: 'Meal Autopilot' },
  { to: '/market-pool', label: 'Swap' },
];

const isCurrent = (path: string) => route.path === path || route.path.startsWith(path + '/');

const openVendors = computed(() =>
  (onlineVendors.value || []).filter((v: any) => v?.isOpen !== false),
);

const rail = ref<HTMLElement | null>(null);
const scrollRail = (dir: number) => {
  const el = rail.value;
  if (!el) return;
  el.scrollBy({ left: dir * Math.round(el.clientWidth * 0.8), behavior: 'smooth' });
};
const closedVendors = computed(() =>
  (onlineVendors.value || []).filter((v: any) => v?.isOpen === false),
);
const closedCount = computed(() => closedVendors.value.length);
const showClosed = ref(false);

/** Whatever the API calls it, show a time a student can act on. */
const opensAt = (vendor: any) => {
  const raw = vendor?.openingTime || vendor?.opensAt || vendor?.businessHours?.open || vendor?.openTime;
  return raw ? `Opens ${String(raw)}` : 'Opens later';
};

const cleanName = (name?: string) => String(name || 'Store').replace(/\s*\(demo\)\s*/i, '').trim();

const reviewCount = (vendor: any) =>
  Number(vendor?.reviewCount ?? vendor?.totalReviews ?? vendor?.reviewsCount ?? 0);
const hasReviews = (vendor: any) => reviewCount(vendor) > 0 && Number(vendor?.rating) > 0;

// Hovering or focusing the hero pauses the timer but keeps autoplay armed.
watch([pausedByPointer, pausedByFocus], ([pointer, focus]) => {
  if (stoppedByPerson.value) return;
  if (pointer || focus) clearTimer();
  else if (running.value) {
    clearTimer();
    timer = setInterval(advance, AUTO_MS);
  }
});

onBeforeUnmount(() => {
  clearTimer();
});

onMounted(() => {
  const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('erranders-theme') : null;
  applyTheme(saved === 'dark', false);
  start();
  fetchHomeData();
});

useHead({
  title: 'Erranders - food, errands and swaps on campus',
  meta: [{ name: 'description', content: 'Order food, send an errand, set up meal autopilot or swap what you do not use. Run by students on your campus.' }],
});
</script>

<style scoped>
.landing {
  /* Palette lives in assets/css/theme.css. */
  --muted: var(--mute);
  --faint: var(--mute);
  --surface: var(--card);
  --page: var(--bg);
  --dark: var(--ink);
  --soft-orange: var(--orsoft);
  --soft-green: var(--green-soft);

  background: var(--page);
  color: var(--ink);
  font-size: 15px;
  padding-bottom: 0;
}

/* Header: one line, tight, with the current section marked. */
.nav {
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  gap: 10px;
  height: 64px;
  padding: 0 20px;
  background: color-mix(in srgb, var(--page) 88%, transparent);
  backdrop-filter: saturate(1.2) blur(16px);
  border-bottom: 1px solid var(--line);
}

.brand {
  display: flex;
  align-items: center;
  flex: none;
  height: 40px;
}

.brand-img {
  height: 26px;
  width: auto;
}

.nav-links {
  display: none;
  gap: 2px;
  margin-left: 18px;
}

@media (min-width: 860px) {
  .nav-links {
    display: flex;
  }
}

.nav-link {
  position: relative;
  padding: 9px 13px;
  border-radius: 10px;
  color: var(--muted);
  font-size: 15px;
  font-weight: 600;
  letter-spacing: -0.01em;
  text-decoration: none;
  transition: color 0.15s ease, background 0.15s ease;
}

.nav-link:hover {
  color: var(--ink);
  background: var(--surface);
}

.nav-link.current {
  color: var(--ink);
  font-weight: 750;
}

/* A short orange rule under the section you are in. */
.nav-link.current::after {
  content: '';
  position: absolute;
  left: 13px;
  right: 13px;
  bottom: 2px;
  height: 2px;
  border-radius: 999px;
  background: var(--accent);
}

.nav-actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon-toggle {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--ink);
  display: grid;
  place-items: center;
  cursor: pointer;
}

.icon-toggle:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.ghost {
  display: none;
  padding: 9px 12px;
  border-radius: 10px;
  color: var(--ink);
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
}

.ghost:hover {
  background: var(--surface);
}

@media (min-width: 640px) {
  .ghost {
    display: inline-flex;
  }
}

.primary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border-radius: 11px;
  background: var(--accent);
  color: #fff;
  font-size: 15px;
  font-weight: 750;
  text-decoration: none;
  white-space: nowrap;
}

.primary:hover {
  filter: brightness(1.04);
}

@media (max-width: 420px) {
  .primary {
    padding: 10px 13px;
    font-size: 14px;
  }
}

/* Hero: fixed heights so switching slides never moves the page. */
.hero {
  display: grid;
  gap: 36px;
  max-width: 1120px;
  margin: 0 auto;
  padding: 44px 20px 20px;
}

@media (min-width: 960px) {
  .hero {
    grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
    align-items: start;
    padding: 64px 20px 36px;
  }
}

.tabs {
  display: flex;
  gap: 4px;
  overflow-x: auto;
  scrollbar-width: none;
  margin-bottom: 18px;
}

.tabs::-webkit-scrollbar {
  display: none;
}

.tab {
  position: relative;
  flex: none;
  padding: 10px 14px 12px;
  border: 0;
  background: transparent;
  color: var(--muted);
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
}

.tab.on {
  color: var(--ink);
}

.tab-line {
  position: absolute;
  left: 10px;
  right: 10px;
  bottom: 4px;
  height: 2px;
  border-radius: 999px;
  background: var(--accent);
  transform-origin: left center;
  transform: scaleX(0);
}

.tab-line.running {
  animation: fill 6.5s linear forwards;
}

@keyframes fill {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

/* Reserved space: the headline is two lines, the sub is three. */
.panel {
  min-height: 236px;
}

@media (min-width: 960px) {
  .panel {
    min-height: 262px;
  }
}

.swap {
  animation: rise 0.35s ease-out;
}

@keyframes rise {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.headline {
  margin: 0;
  font-size: clamp(34px, 6vw, 58px);
  font-weight: 800;
  letter-spacing: -0.045em;
  line-height: 0.98;
  color: var(--ink);
}

.headline .line {
  display: block;
}

.sub {
  margin: 14px 0 0;
  font-size: 17px;
  line-height: 1.5;
  color: var(--muted);
  max-width: 46ch;
  min-height: 52px;
}

.field {
  display: flex;
  gap: 8px;
  margin-top: 18px;
  padding: 6px 6px 6px 16px;
  border-radius: 16px;
  border: 1px solid var(--line);
  background: var(--card);
  max-width: 560px;
}

.field:focus-within {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(242, 106, 46, 0.16);
}

.field-input {
  flex: 1;
  min-width: 0;
  border: 0;
  background: transparent;
  color: var(--ink);
  font-size: 16px;
  padding: 12px 0;
  outline: none;
}

.field-input::placeholder {
  color: var(--muted);
}

.field-go {
  flex: none;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 12px 18px;
  border: 0;
  border-radius: 12px;
  background: var(--accent);
  color: #fff;
  font-size: 15px;
  font-weight: 750;
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;
}

.field-go.solo {
  margin-top: 18px;
}

.field-go:active {
  transform: scale(0.99);
}

.hint {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 12px 0 0;
  font-size: 14.5px;
  color: var(--muted);
  min-height: 22px;
}

.hint-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #16a34a;
}

.controls {
  margin-top: 10px;
}

.play-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid var(--line);
  background: var(--card);
  color: var(--muted);
  font-size: 13.5px;
  font-weight: 700;
  cursor: pointer;
}

.play-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.play-btn .icon {
  font-size: 10px;
  letter-spacing: 1px;
}

/* Ticket: the top and its text flip together, so one is never light on light. */
.ticket-wrap {
  display: flex;
  justify-content: center;
}

.ticket {
  position: relative;
  width: 100%;
  max-width: 380px;
  transform: rotate(-2deg);
  border-radius: 20px;
  box-shadow: 0 26px 60px rgba(23, 19, 15, 0.22);
  --ticket-top-bg: #17130f;
  --ticket-top-ink: #f5f1ea;
}

:global(html.dark) .ticket {
  --ticket-top-bg: #f5f1ea;
  --ticket-top-ink: #17130f;
}

.ticket-top {
  background: var(--ticket-top-bg);
  color: var(--ticket-top-ink);
  padding: 22px;
  border-radius: 20px 20px 0 0;
  min-height: 196px;
}

.ticket-status {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  color: #4ade80;
}

:global(html.dark) .ticket-status {
  color: #15803d;
}

.ticket-item {
  margin: 8px 0 0;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--ticket-top-ink);
}

.ticket-vendor {
  margin: 2px 0 0;
  font-size: 14.5px;
  opacity: 0.62;
  color: var(--ticket-top-ink);
}

.progress {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
  margin-top: 18px;
}

.prog {
  height: 3px;
  border-radius: 999px;
  background: color-mix(in srgb, var(--ticket-top-ink) 22%, transparent);
}

.prog.done {
  background: var(--accent);
}

.progress-labels {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
  margin-top: 8px;
  font-size: 11px;
  opacity: 0.55;
}

.ticket-stub {
  position: relative;
  background: var(--accent);
  color: #fff;
  padding: 22px 22px 24px;
  border-radius: 0 0 20px 20px;
  min-height: 168px;
}

.stub-label {
  margin: 0;
  font-size: 13px;
  font-weight: 650;
  opacity: 0.92;
}

.stub-value {
  margin: 8px 0 14px;
  font-size: clamp(30px, 5vw, 40px);
  font-weight: 800;
  letter-spacing: 0.12em;
  line-height: 1.05;
  font-variant-numeric: tabular-nums;
}

.perforation {
  border-top: 2px dashed rgba(0, 0, 0, 0.28);
}

.stub-note {
  margin: 12px 0 0;
  font-size: 13px;
  opacity: 0.92;
}

/* Notches are the page colour, not black, so they read as cut-outs in both modes. */
.notch {
  position: absolute;
  top: 196px;
  width: 22px;
  height: 22px;
  border-radius: 999px;
  background: var(--bg);
  margin-top: -11px;
}

.notch.left { left: -11px; }
.notch.right { right: -11px; }

@media (max-width: 959px) {
  .ticket {
    transform: none;
    max-width: 100%;
  }
}

/* Sections */
.open,
.how,
.bento,
.closer {
  max-width: 1120px;
  margin: 0 auto;
  padding: 44px 20px 0;
}

.sec-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.sec-head h2,
.how h2 {
  margin: 0;
  font-size: clamp(22px, 3.4vw, 30px);
  font-weight: 800;
  letter-spacing: -0.03em;
}

.sec-link {
  color: var(--accent);
  font-size: 14.5px;
  font-weight: 750;
  text-decoration: none;
}

.grid {
  display: grid;
  gap: 14px;
  grid-template-columns: 1fr;
}

@media (min-width: 700px) {
  .grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.store {
  border: 1px solid var(--line);
  border-radius: 16px;
  background: var(--surface);
  overflow: hidden;
  text-decoration: none;
  color: inherit;
}

.store:hover {
  border-color: var(--accent);
}

.store-media {
  position: relative;
  height: 150px;
  background: var(--page);
}

.store-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.pill {
  position: absolute;
  left: 10px;
  bottom: 10px;
  padding: 4px 10px;
  border-radius: 8px;
  background: #fff;
  color: #141110;
  font-size: 12.5px;
  font-weight: 750;
}

.store-body {
  padding: 12px 14px 14px;
}

.store-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 10px;
}

.store-name {
  margin: 0;
  font-size: 16px;
  font-weight: 750;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.store-meta {
  margin: 4px 0 0;
  font-size: 14px;
  color: var(--muted);
}

.rating {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex: none;
  font-size: 14px;
  font-weight: 750;
}

.new {
  flex: none;
  padding: 3px 9px;
  border-radius: 999px;
  background: rgba(242, 106, 46, 0.12);
  color: #b3400b;
  font-size: 12.5px;
  font-weight: 750;
}

.closed-line {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  margin: 16px 0 0;
  padding: 14px 16px;
  border: 1px dashed var(--line);
  border-radius: 14px;
  font-size: 14.5px;
  color: var(--muted);
}

.closed-chip {
  padding: 5px 11px;
  border-radius: 999px;
  border: 1px solid var(--line);
  font-size: 13.5px;
  font-weight: 650;
  color: var(--ink);
}

.skel {
  height: 220px;
  border-radius: 16px;
  background: var(--surface);
  border: 1px solid var(--line);
  animation: pulse 1.5s ease-in-out infinite;
}

/* How it works */
.steps {
  list-style: none;
  display: grid;
  gap: 20px;
  margin: 18px 0 0;
  padding: 0;
  grid-template-columns: 1fr;
}

@media (min-width: 760px) {
  .steps {
    grid-template-columns: repeat(3, 1fr);
  }
}

.step {
  position: relative;
  padding-top: 54px;
}

@media (min-width: 760px) {
  .step:not(:last-child)::after {
    content: '';
    position: absolute;
    top: 22px;
    left: 46px;
    right: 0;
    border-top: 2px dotted var(--line);
  }
}

.num {
  position: absolute;
  top: 0;
  left: 0;
  width: 42px;
  height: 42px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: var(--surface);
  border: 1px solid var(--line);
  font-size: 16px;
  font-weight: 800;
}

.step-title {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.step-body {
  margin: 6px 0 0;
  font-size: 15px;
  color: var(--muted);
  line-height: 1.5;
  max-width: 40ch;
}

/* Bento */
.bento {
  display: grid;
  gap: 12px;
  grid-template-columns: 1fr;
}

@media (min-width: 860px) {
  .bento {
    grid-template-columns: repeat(3, 1fr);
    grid-template-areas:
      'errand meals meals'
      'errand swap swap';
  }

  .tile-errand {
    grid-area: errand;
  }

  .tile-meals {
    grid-area: meals;
  }

  .tile-swap {
    grid-area: swap;
  }
}

.tile {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 22px;
  border-radius: 18px;
  border: 1px solid var(--line);
  background: var(--surface);
  text-decoration: none;
  color: inherit;
  transition: transform 0.15s ease, border-color 0.15s ease;
}

.tile:hover {
  transform: translateY(-1px);
  border-color: var(--accent);
}

.tile-tag {
  margin: 0;
  font-size: 13.5px;
  font-weight: 700;
  color: var(--muted);
}

.tile-title {
  margin: 0;
  font-size: clamp(19px, 2.6vw, 24px);
  font-weight: 800;
  letter-spacing: -0.025em;
  line-height: 1.15;
}

.tile-body {
  margin: 0;
  font-size: 15px;
  color: var(--muted);
  line-height: 1.5;
}

.tile-list {
  margin: 4px 0 0;
  padding-left: 18px;
  color: var(--muted);
  font-size: 14.5px;
  line-height: 1.6;
}

.tile-cta {
  margin-top: auto;
  padding-top: 12px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 15px;
  font-weight: 750;
  color: var(--accent);
}

.tile-errand {
  background: var(--dark);
  border-color: var(--dark);
  color: #fff;
}

.tile-errand .tile-tag,
.tile-errand .tile-body,
.tile-errand .tile-list {
  color: rgba(255, 255, 255, 0.7);
}

.sched {
  margin-top: 6px;
  border-radius: 14px;
  border: 1px solid var(--line);
  background: var(--page);
  padding: 14px;
}

.sched-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 13.5px;
  font-weight: 700;
  color: var(--muted);
}

.sched-check {
  color: #16a34a;
}

.sched-item {
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid var(--line);
}

.sched-item p {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
}

.sched-item span {
  font-size: 13.5px;
  color: var(--muted);
}

/* Closing banner */
.closer {
  margin-top: 44px;
  padding-bottom: 44px;
}

.closer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  max-width: 1080px;
  margin: 44px auto 0;
  padding: 28px;
  border-radius: 20px;
  background: var(--accent);
  color: #fff;
}

.closer h2 {
  margin: 0;
  font-size: clamp(24px, 4vw, 34px);
  font-weight: 800;
  letter-spacing: -0.035em;
}

.closer-btn {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 14px 22px;
  border-radius: 13px;
  background: var(--dark);
  color: #fff;
  font-size: 15px;
  font-weight: 750;
  text-decoration: none;
}

/* Footer: the page colour, not a white band bolted on the end. */
.foot {
  margin-top: 48px;
  border-top: 1px solid var(--line);
  background: var(--page);
  padding: 48px 20px 28px;
}

.foot-inner {
  display: grid;
  gap: 36px;
  max-width: 1120px;
  margin: 0 auto;
  grid-template-columns: 1fr;
}

@media (min-width: 860px) {
  .foot-inner {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1.05fr);
    align-items: start;
    gap: 48px;
  }
}

.foot-brand {
  min-width: 0;
}

.foot-line {
  margin: 14px 0 0;
  font-size: 15px;
  line-height: 1.55;
  color: var(--muted);
  max-width: 32ch;
}

.foot-cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 16px;
  padding: 11px 15px;
  border-radius: 11px;
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--ink);
  font-size: 14.5px;
  font-weight: 750;
  text-decoration: none;
}

.foot-cta:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.foot-cols {
  display: grid;
  gap: 28px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

@media (min-width: 560px) {
  .foot-cols {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

.foot-title {
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: 750;
  color: var(--ink);
}

.foot-link {
  display: block;
  margin-bottom: 10px;
  color: var(--muted);
  font-size: 15px;
  text-decoration: none;
  width: fit-content;
}

.foot-link:hover {
  color: var(--accent);
}

.foot-base {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  max-width: 1120px;
  margin: 36px auto 0;
  padding-top: 18px;
  border-top: 1px solid var(--line);
}

.foot-copy,
.foot-note {
  margin: 0;
  font-size: 14px;
  color: var(--mute);
}

.landing :where(a, button, input):focus-visible {
  outline: 3px solid var(--accent);
  outline-offset: 2px;
  border-radius: 10px;
}

@media (prefers-reduced-motion: reduce) {
  .landing * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }

  .ticket {
    transform: none;
  }
}

.icon-toggle {
  width: 40px;
  height: 40px;
  border-radius: 11px;
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--ink);
  display: grid;
  place-items: center;
  cursor: pointer;
}

.icon-toggle:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.closed-box {
  margin-top: 16px;
  border: 1px dashed var(--line);
  border-radius: 14px;
  padding: 14px 16px;
}

.closed-toggle {
  border: 0;
  background: transparent;
  color: var(--muted);
  font-size: 14.5px;
  font-weight: 650;
  cursor: pointer;
  padding: 0;
  text-align: left;
}

.closed-toggle:hover {
  color: var(--accent);
}

.closed-toggle.quiet {
  color: var(--accent);
  font-weight: 750;
}

.closed-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 10px;
}

.closed-title {
  margin: 0;
  font-size: 15px;
  font-weight: 750;
  color: var(--ink);
}


.sec-tools {
  display: flex;
  align-items: center;
  gap: 8px;
}

.rail-btn {
  width: 38px;
  height: 38px;
  border-radius: 11px;
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--ink);
  font-size: 20px;
  line-height: 1;
  cursor: pointer;
}

.rail-btn:hover {
  border-color: var(--accent);
  color: var(--accent);
}

/* Draggable rail: works with a trackpad, a mouse wheel and the arrow buttons. */
.rail {
  display: flex;
  gap: 14px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  padding-bottom: 6px;
  margin: 0 -20px;
  padding-left: 20px;
  padding-right: 20px;
  scrollbar-width: none;
}

.rail::-webkit-scrollbar {
  display: none;
}

.rail > * {
  scroll-snap-align: start;
  flex: 0 0 260px;
}

@media (min-width: 900px) {
  .rail > * {
    flex: 0 0 320px;
  }
}

.closed-store .store-img.dim {
  filter: grayscale(0.7);
  opacity: 0.62;
}

.pill.closed {
  background: var(--surface);
  color: var(--ink);
  border: 1px solid var(--line);
}

.sec-tools .sec-link {
  margin-left: 6px;
}
</style>
