<template>
  <div class="landing">
    <!-- Sticky header: four links, one action. Nothing else. -->
    <header class="nav">
      <NuxtLink to="/" class="brand" aria-label="Erranders home">
        <img src="@/assets/img/logo-light.png" alt="Erranders" class="brand-img" />
      </NuxtLink>

      <nav class="nav-links" aria-label="Main">
        <NuxtLink to="/vendors" class="nav-link">Food</NuxtLink>
        <NuxtLink to="/errands/custom" class="nav-link">Errands</NuxtLink>
        <NuxtLink to="/dashboard/recurring-orders" class="nav-link">Meal Autopilot</NuxtLink>
        <NuxtLink to="/market-pool" class="nav-link">Swap</NuxtLink>
      </nav>

      <div class="nav-actions">
        <NuxtLink v-if="!isLoggedIn" to="/auth/login" class="ghost">Log in</NuxtLink>
        <NuxtLink :to="isLoggedIn ? '/dashboard' : '/auth/signup'" class="primary">
          {{ isLoggedIn ? 'Dashboard' : 'Get started' }}
        </NuxtLink>
      </div>
    </header>

    <main>
      <!-- Hero: one sentence, one field, one object that explains the product. -->
      <section class="hero">
        <div class="hero-copy">
          <h1>Don't walk down.<br />Errand it.</h1>
          <p class="hero-sub">
            Food, laundry, a document, a mattress you no longer need. Someone on campus handles it.
          </p>

          <div class="switch" role="tablist" aria-label="What do you need">
            <button type="button" role="tab" :aria-selected="mode === 'food'" class="switch-btn" :class="{ on: mode === 'food' }" @click="mode = 'food'">Food</button>
            <button type="button" role="tab" :aria-selected="mode === 'errand'" class="switch-btn" :class="{ on: mode === 'errand' }" @click="mode = 'errand'">Errand</button>
          </div>

          <form class="hero-field" @submit.prevent="go">
            <input
              v-model="q"
              type="search"
              class="hero-input"
              :placeholder="mode === 'food' ? 'Jollof, suya, a cold drink' : 'Laundry, printing, a package'"
              :aria-label="mode === 'food' ? 'Search food' : 'Describe your errand'"
            />
            <button type="submit" class="hero-go">
              {{ mode === 'food' ? 'Order food' : 'Send errand' }}
              <ArrowRight class="w-4 h-4" aria-hidden="true" />
            </button>
          </form>

          <p class="live">
            <span class="live-dot" aria-hidden="true"></span>
            {{ openCount }} {{ openCount === 1 ? 'store' : 'stores' }} open now
          </p>
        </div>

        <!-- The ticket. One memorable thing; everything else stays quiet. -->
        <div class="ticket-wrap" aria-hidden="true">
          <div class="ticket">
            <div class="ticket-top">
              <p class="ticket-status">On the way</p>
              <p class="ticket-item">Jollof and chicken</p>
              <p class="ticket-vendor">Waris Kitchen</p>

              <div class="progress">
                <span class="prog done"></span>
                <span class="prog done"></span>
                <span class="prog now"></span>
                <span class="prog"></span>
              </div>
              <div class="progress-labels">
                <span>Placed</span><span>Picked up</span><span>On the way</span><span>Arrived</span>
              </div>
            </div>

            <div class="ticket-stub">
              <p class="stub-label">Delivery PIN</p>
              <p class="stub-pin">4 8 2 1</p>
              <div class="perforation"></div>
              <p class="stub-note">Give it to your rider when they arrive</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Open right now -->
      <section class="open">
        <div class="sec-head">
          <h2>Open right now</h2>
          <NuxtLink to="/vendors" class="sec-link">All stores</NuxtLink>
        </div>

        <div v-if="loading" class="grid">
          <div v-for="i in 3" :key="i" class="skel" />
        </div>

        <div v-else class="grid">
          <NuxtLink v-for="vendor in openVendors" :key="vendor._id" :to="`/vendors/${vendor._id}`" class="store">
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

        <p v-if="closedCount" class="closed-line">
          Closed now:
          <span v-for="vendor in closedVendors" :key="vendor._id" class="closed-chip">{{ cleanName(vendor.storeName) }}</span>
        </p>
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
      <div class="foot-top">
        <div class="foot-brand">
          <img src="@/assets/img/logo-light.png" alt="Erranders" class="brand-img" />
          <p class="foot-line">Campus delivery and errands, run by students.</p>
        </div>

        <div class="foot-cols">
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
        </div>
      </div>

      <p class="foot-copy">© {{ year }} Erranders. All rights reserved.</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { ArrowRight, ArrowUpRight, Star } from 'lucide-vue-next';
import { useLandingPage } from '@/composables/modules/landing';
import { useUser } from '@/composables/modules/auth/user';

definePageMeta({ layout: false });

const { loading, onlineVendors, fetchHomeData } = useLandingPage();
const { isLoggedIn } = useUser();

const mode = ref<'food' | 'errand'>('food');
const q = ref('');
const year = new Date().getFullYear();

const openVendors = computed(() =>
  (onlineVendors.value || []).filter((v: any) => v?.isOpen !== false).slice(0, 3),
);
const closedVendors = computed(() =>
  (onlineVendors.value || []).filter((v: any) => v?.isOpen === false),
);
const openCount = computed(() => (onlineVendors.value || []).filter((v: any) => v?.isOpen !== false).length);
const closedCount = computed(() => closedVendors.value.length);

const cleanName = (name?: string) => String(name || 'Store').replace(/\s*\(demo\)\s*/i, '').trim();

const reviewCount = (vendor: any) =>
  Number(vendor?.reviewCount ?? vendor?.totalReviews ?? vendor?.reviewsCount ?? 0);
const hasReviews = (vendor: any) => reviewCount(vendor) > 0 && Number(vendor?.rating) > 0;

const go = () => {
  if (mode.value === 'food') {
    navigateTo({ path: '/vendors', query: q.value ? { q: q.value } : {} });
  } else {
    navigateTo('/errands/custom');
  }
};

onMounted(() => {
  fetchHomeData();
});

useHead({
  title: 'Erranders - food, errands and swaps on campus',
  meta: [{ name: 'description', content: 'Order food, send an errand, set up meal autopilot or swap what you do not use. Run by students on your campus.' }],
});
</script>

<style scoped>
.landing {
  --accent: #f26a2e;
  --ink: #141110;
  --muted: #6b655d;
  --faint: #97908a;
  --line: #e8e2d9;
  --surface: #ffffff;
  --page: #faf8f5;
  --dark: #16120f;

  background: var(--page);
  color: var(--ink);
  font-size: 15px;
  padding-bottom: 0;
}

:global(html.dark) .landing {
  --ink: #f6f2ec;
  --muted: #b3aca3;
  --faint: #8b847c;
  --line: #2c2721;
  --surface: #1b1713;
  --page: #12100e;
  --dark: #0c0a09;
}

/* Header */
.nav {
  position: sticky;
  top: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  gap: 18px;
  padding: 12px 20px;
  background: color-mix(in srgb, var(--page) 92%, transparent);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--line);
}

.brand-img {
  height: 26px;
  width: auto;
}

:global(html.dark) .brand-img {
  filter: invert(1) hue-rotate(180deg);
}

.nav-links {
  display: none;
  gap: 4px;
  margin-left: 10px;
}

@media (min-width: 860px) {
  .nav-links {
    display: flex;
  }
}

.nav-link {
  padding: 9px 12px;
  border-radius: 10px;
  color: var(--muted);
  font-size: 15px;
  font-weight: 650;
  text-decoration: none;
}

.nav-link:hover {
  background: var(--surface);
  color: var(--ink);
}

.nav-actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
}

.ghost {
  display: none;
  padding: 10px 14px;
  border-radius: 11px;
  color: var(--ink);
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
}

@media (min-width: 640px) {
  .ghost {
    display: inline-flex;
  }
}

.primary {
  padding: 10px 16px;
  border-radius: 11px;
  background: var(--accent);
  color: #fff;
  font-size: 15px;
  font-weight: 750;
  text-decoration: none;
}

/* Hero */
.hero {
  display: grid;
  gap: 40px;
  max-width: 1120px;
  margin: 0 auto;
  padding: 48px 20px 24px;
}

@media (min-width: 960px) {
  .hero {
    grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
    align-items: center;
    padding: 72px 20px 40px;
  }
}

.hero-copy h1 {
  margin: 0;
  font-size: clamp(38px, 7vw, 64px);
  font-weight: 800;
  letter-spacing: -0.045em;
  line-height: 0.98;
}

.hero-sub {
  margin: 16px 0 0;
  font-size: 17px;
  line-height: 1.5;
  color: var(--muted);
  max-width: 46ch;
}

.switch {
  display: inline-flex;
  gap: 4px;
  margin-top: 26px;
  padding: 4px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: var(--surface);
}

.switch-btn {
  padding: 8px 18px;
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--muted);
  font-size: 14.5px;
  font-weight: 700;
  cursor: pointer;
}

.switch-btn.on {
  background: var(--ink);
  color: var(--page);
}

.hero-field {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  padding: 6px 6px 6px 16px;
  border-radius: 16px;
  border: 1px solid var(--line);
  background: var(--surface);
  max-width: 560px;
}

.hero-field:focus-within {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(242, 106, 46, 0.16);
}

.hero-input {
  flex: 1;
  min-width: 0;
  border: 0;
  background: transparent;
  color: var(--ink);
  font-size: 16px;
  padding: 12px 0;
  outline: none;
}

.hero-input::placeholder {
  color: var(--faint);
}

.hero-go {
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
}

.live {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 14px 0 0;
  font-size: 14.5px;
  color: var(--muted);
}

.live-dot {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: #16a34a;
}

/* Ticket */
.ticket-wrap {
  display: flex;
  justify-content: center;
}

.ticket {
  width: 100%;
  max-width: 380px;
  transform: rotate(-2deg);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 26px 60px rgba(20, 17, 16, 0.22);
}

.ticket-top {
  background: var(--dark);
  color: #fff;
  padding: 22px;
}

.ticket-status {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  color: #4ade80;
}

.ticket-item {
  margin: 8px 0 0;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.ticket-vendor {
  margin: 2px 0 0;
  font-size: 14.5px;
  color: rgba(255, 255, 255, 0.6);
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
  background: rgba(255, 255, 255, 0.2);
}

.prog.done,
.prog.now {
  background: var(--accent);
}

.progress-labels {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
  margin-top: 8px;
  font-size: 11px;
  color: rgba(255, 255, 255, 0.5);
}

.ticket-stub {
  position: relative;
  background: var(--accent);
  color: #fff;
  padding: 20px 22px 22px;
  -webkit-mask:
    radial-gradient(13px at 0 0, transparent 98%, #000) left top / 51% 51% no-repeat,
    radial-gradient(13px at 100% 0, transparent 98%, #000) right top / 51% 51% no-repeat;
  mask:
    radial-gradient(13px at 0 0, transparent 98%, #000) left top / 51% 51% no-repeat,
    radial-gradient(13px at 100% 0, transparent 98%, #000) right top / 51% 51% no-repeat;
}

.stub-label {
  margin: 0;
  font-size: 13px;
  font-weight: 650;
  opacity: 0.9;
}

.stub-pin {
  margin: 6px 0 14px;
  font-size: 40px;
  font-weight: 800;
  letter-spacing: 0.24em;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.perforation {
  border-top: 2px dashed rgba(0, 0, 0, 0.28);
}

.stub-note {
  margin: 12px 0 0;
  font-size: 13px;
  opacity: 0.9;
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

/* Footer */
.foot {
  border-top: 1px solid var(--line);
  background: var(--surface);
  padding: 40px 20px 28px;
}

.foot-top {
  display: flex;
  flex-wrap: wrap;
  gap: 32px;
  justify-content: space-between;
  max-width: 1120px;
  margin: 0 auto;
}

.foot-line {
  margin: 10px 0 0;
  font-size: 15px;
  color: var(--muted);
  max-width: 34ch;
}

.foot-cols {
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
}

.foot-title {
  margin: 0 0 10px;
  font-size: 14px;
  font-weight: 750;
}

.foot-link {
  display: block;
  margin-bottom: 8px;
  color: var(--muted);
  font-size: 14.5px;
  text-decoration: none;
}

.foot-link:hover {
  color: var(--accent);
}

.foot-copy {
  max-width: 1120px;
  margin: 28px auto 0;
  padding-top: 18px;
  border-top: 1px solid var(--line);
  font-size: 14px;
  color: var(--faint);
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
</style>
