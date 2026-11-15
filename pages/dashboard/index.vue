<template>
  <div class="home">
    <!-- Header: greeting once, then chips. No second welcome banner. -->
    <header class="home-head">
      <div class="min-w-0">
        <p class="greet">{{ greeting }}</p>
        <h1 class="name">{{ user?.firstName || 'Student' }}.</h1>
      </div>

      <div class="chips">
        <NuxtLink to="/dashboard/leaderboard" class="chip">
          <Flame class="chip-icon" aria-hidden="true" />
          <span>{{ user?.streakCount || 0 }}-day streak</span>
        </NuxtLink>
        <NuxtLink to="/dashboard/leaderboard" class="chip">
          <BarChart3 class="chip-icon" aria-hidden="true" />
          <span>#{{ rank }} on campus</span>
        </NuxtLink>
        <button type="button" class="chip chip-accent" @click="isRedeemModalOpen = true">
          <Trophy class="chip-icon" aria-hidden="true" />
          <span>{{ user?.points || 0 }} pts</span>
        </button>
      </div>
    </header>

    <!-- Live order: the one dark surface that means act now. -->
    <section v-if="activeOrder" class="hero">
      <article class="live">
        <div class="live-top">
          <span class="live-dot" aria-hidden="true"></span>
          <p class="live-status">{{ statusLabel(activeOrder.status) }}</p>
          <span v-if="eta" class="live-eta">{{ eta }} min</span>
        </div>

        <p class="live-title">{{ activeOrder.vendor?.storeName || 'Your order' }}</p>
        <p class="live-sub">
          <template v-if="runnerName">Runner · {{ runnerName }}</template>
          <template v-else>Looking for a runner…</template>
        </p>

        <ol class="steps" aria-label="Delivery progress">
          <li
            v-for="(step, i) in STEPS"
            :key="step.key"
            class="step"
            :class="{ done: i < stepIndex, current: i === stepIndex }"
            :aria-current="i === stepIndex ? 'step' : undefined"
          >
            <span class="step-dot" aria-hidden="true"></span>
            <span class="step-label">{{ step.label }}</span>
          </li>
        </ol>

        <div class="live-actions">
          <NuxtLink :to="`/dashboard/orders/${activeOrder._id}`" class="btn btn-accent">
            Track order
            <ArrowRight class="w-4 h-4" aria-hidden="true" />
          </NuxtLink>
          <a v-if="runnerPhone" :href="`tel:${runnerPhone}`" class="btn btn-ghost">
            <Phone class="w-4 h-4" aria-hidden="true" />
            Call runner
          </a>
        </div>
      </article>

      <!-- Ticket stub: notched edges, perforation, PIN in display type. -->
      <aside class="ticket" aria-label="Delivery PIN">
        <p class="ticket-label">Give this PIN to your runner</p>
        <p class="ticket-pin">{{ activeOrder.deliveryPin }}</p>
        <div class="perforation" aria-hidden="true"></div>
        <button type="button" class="btn btn-ticket" @click="copyPin(activeOrder.deliveryPin)">
          <Copy class="w-4 h-4" aria-hidden="true" />
          Copy code
        </button>
      </aside>
    </section>

    <!-- Nothing live: one question, one field, four ways in. -->
    <section v-else class="hero-idle">
      <h2 class="ask">What do you need?</h2>
      <form class="ask-form" @submit.prevent="handleSearch">
        <Search class="ask-icon" aria-hidden="true" />
        <input
          v-model="searchQuery"
          type="search"
          class="ask-input"
          placeholder="Jollof, laundry pickup, an old fan to swap…"
          aria-label="Search stores and services"
        />
        <button type="submit" class="ask-go" aria-label="Search">
          <ArrowRight class="w-5 h-5" aria-hidden="true" />
        </button>
      </form>

      <div class="quick">
        <NuxtLink to="/vendors" class="quick-chip">
          <UtensilsCrossed class="w-4 h-4" aria-hidden="true" /> Food
        </NuxtLink>
        <NuxtLink to="/errands/custom" class="quick-chip">
          <PackageSearch class="w-4 h-4" aria-hidden="true" /> Run an errand
        </NuxtLink>
        <NuxtLink to="/market-pool" class="quick-chip">
          <Repeat class="w-4 h-4" aria-hidden="true" /> Swap something
        </NuxtLink>
        <NuxtLink to="/dashboard/group-orders" class="quick-chip">
          <Users class="w-4 h-4" aria-hidden="true" /> Group order
        </NuxtLink>
      </div>
    </section>

    <!-- Payment prompt sits above everything except a live order. -->
    <section v-if="unpaidOrder" class="pay">
      <div class="min-w-0">
        <p class="pay-title">Payment needed</p>
        <p class="pay-sub">
          Order #{{ unpaidOrder.orderNumber || unpaidOrder._id?.slice(-6) }} is waiting. A runner can't be sent until it's paid.
        </p>
      </div>
      <NuxtLink :to="`/dashboard/orders/${unpaidOrder._id}`" class="btn btn-dark shrink-0">
        Pay now
      </NuxtLink>
    </section>

    <!-- Bento: three ways in, one hierarchy. -->
    <section class="bento">
      <NuxtLink to="/errands/custom" class="tile tile-errand">
        <div class="tile-head">
          <PackageSearch class="w-6 h-6" aria-hidden="true" />
          <span class="tile-tag">Set your own price</span>
        </div>
        <h3 class="tile-title">Need an errand run?</h3>
        <p class="tile-body">Laundry, documents, groceries — a student runs it for you.</p>
        <span class="tile-cta">
          Request an errand
          <ArrowUpRight class="w-4 h-4" aria-hidden="true" />
        </span>
      </NuxtLink>

      <NuxtLink to="/market-pool" class="tile tile-barter">
        <div class="tile-head">
          <Repeat class="w-5 h-5" aria-hidden="true" />
          <span class="tile-tag">Campus market</span>
        </div>
        <h3 class="tile-title">Sell what you don't use</h3>
        <p class="tile-body">Fans, textbooks, mattresses. Cash or swap, escrow protected.</p>
        <span class="tile-cta">
          Explore barter
          <ArrowUpRight class="w-4 h-4" aria-hidden="true" />
        </span>
      </NuxtLink>

      <button type="button" class="tile tile-points" @click="isRedeemModalOpen = true">
        <div class="ring" role="img" :aria-label="`${user?.points || 0} of ${REDEEM_MIN} points`">
          <svg viewBox="0 0 44 44" class="ring-svg" aria-hidden="true">
            <circle cx="22" cy="22" r="18" class="ring-track" />
            <circle
              cx="22"
              cy="22"
              r="18"
              class="ring-fill"
              :style="{ strokeDashoffset: ringOffset }"
            />
          </svg>
          <span class="ring-text">{{ user?.points || 0 }}</span>
        </div>
        <div class="min-w-0 text-left">
          <p class="tile-title sm">Redeem points</p>
          <p class="tile-body sm">{{ pointsToGo }} to go</p>
        </div>
      </button>
    </section>

    <!-- Open now: live stores only. Closed ones collapse into one line. -->
    <section class="open">
      <div class="open-head">
        <h2 class="section-title">Open right now</h2>
        <NuxtLink to="/vendors" class="section-link">All stores</NuxtLink>
      </div>

      <div v-if="loading" class="store-grid">
        <div v-for="i in 3" :key="i" class="store-skel" />
      </div>

      <div v-else-if="openVendors.length === 0" class="quiet">
        <MoonStar class="w-6 h-6" aria-hidden="true" />
        <p>Campus is quiet — no store is open right now.</p>
        <button type="button" class="btn btn-ghost" @click="fetchHomeData">
          <RefreshCw class="w-4 h-4" aria-hidden="true" /> Check again
        </button>
      </div>

      <div v-else class="store-grid">
        <NuxtLink
          v-for="vendor in openVendors"
          :key="vendor._id"
          :to="`/vendors/${vendor._id}`"
          class="store"
        >
          <div class="store-media">
            <video
              v-if="isVideo(vendor.logo || vendor.banner)"
              :src="vendor.logo || vendor.banner"
              class="store-img"
              autoplay
              loop
              muted
              playsinline
            />
            <img v-else :src="vendor.logo || vendor.banner || '/placeholder-store.jpg'" class="store-img" alt="" />
          </div>
          <div class="store-body">
            <p class="store-name">{{ vendor.storeName }}</p>
            <p class="store-meta">
              {{ vendor.category || 'Store' }}
              <span aria-hidden="true">·</span>
              {{ vendor.preparationTime || 20 }} min
            </p>
          </div>
        </NuxtLink>
      </div>

      <NuxtLink v-if="closedCount > 0" to="/vendors" class="closed-line">
        <Lock class="w-4 h-4" aria-hidden="true" />
        <span>{{ closedCount }} more {{ closedCount === 1 ? 'place is' : 'places are' }} closed. See when they open.</span>
      </NuxtLink>

      <p v-if="fetchError === 'network'" class="offline">
        <WifiOff class="w-4 h-4" aria-hidden="true" /> No connection. Showing what we last had.
      </p>
    </section>

    <RedeemPointsModal
      :is-open="isRedeemModalOpen"
      :current-points="user?.points || 0"
      @close="isRedeemModalOpen = false"
      @redeemed="handlePointsRedeemed"
    />
  </div>
</template>

<script setup lang="ts">
import { useAuth } from '@/composables/modules/auth';
import { useLandingPage } from '@/composables/modules/landing';
import { useUser } from '@/composables/modules/auth/user';
import { useStudentOrders } from '@/composables/modules/orders';
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  Copy,
  Flame,
  Lock,
  MoonStar,
  PackageSearch,
  Phone,
  RefreshCw,
  Repeat,
  Search,
  Trophy,
  Users,
  UtensilsCrossed,
  WifiOff,
} from 'lucide-vue-next';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useCustomToast } from '@/composables/core/useCustomToast';
import RedeemPointsModal from '@/components/core/RedeemPointsModal.vue';

definePageMeta({ layout: 'student' });

const router = useRouter();
const { user } = useUser();
const { fetchProfile } = useAuth();
const { loading, onlineVendors, fetchError, fetchHomeData } = useLandingPage();
const { orders: studentOrders, fetchOrders } = useStudentOrders();
const { showToast } = useCustomToast();

const REDEEM_MIN = 500;

const searchQuery = ref('');
const isRedeemModalOpen = ref(false);

const STEPS = [
  { key: 'placed', label: 'Placed' },
  { key: 'picked_up', label: 'Picked up' },
  { key: 'on_the_way', label: 'On the way' },
  { key: 'arrived', label: 'Arrived' },
];

/** Positions a status on the four-step rail. Unknown statuses sit at step one. */
const STEP_INDEX: Record<string, number> = {
  confirmed: 0,
  preparing: 0,
  picked_up: 1,
  ready_for_pickup: 1,
  in_transit: 2,
  on_the_way: 2,
  interception_in_progress: 2,
  arrived: 3,
  delivered: 3,
};

const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning,';
  if (hour < 17) return 'Good afternoon,';
  return 'Good evening,';
});

const activeOrder = computed(() => {
  const live = ['picked_up', 'in_transit', 'ready_for_pickup', 'confirmed', 'preparing', 'interception_in_progress'];
  return (studentOrders.value || []).find((o: any) => live.includes(String(o.status || '').toLowerCase()) && o.deliveryPin) || null;
});

const unpaidOrder = computed(() => {
  const waiting = ['awaiting_payment', 'awaiting_payment_confirmation'];
  return (studentOrders.value || []).find((o: any) => waiting.includes(String(o.status || '').toLowerCase())) || null;
});

const stepIndex = computed(() => {
  const status = String(activeOrder.value?.status || '').toLowerCase();
  return STEP_INDEX[status] ?? 0;
});

const runnerName = computed(() => {
  const o: any = activeOrder.value;
  return o?.errander?.user?.firstName || o?.erranderName || o?.errander?.firstName || '';
});

const runnerPhone = computed(() => {
  const o: any = activeOrder.value;
  return o?.errander?.user?.phone || o?.errander?.phone || '';
});

const eta = computed(() => {
  const o: any = activeOrder.value;
  return o?.estimatedDeliveryTime || o?.eta || '';
});

const statusLabel = (status?: string) => {
  const map: Record<string, string> = {
    confirmed: 'Order confirmed',
    preparing: 'Vendor preparing',
    picked_up: 'Runner has it',
    ready_for_pickup: 'Ready for pickup',
    in_transit: 'On the way to you',
    interception_in_progress: 'Runner on the way',
  };
  return map[String(status || '').toLowerCase()] || 'In progress';
};

const rank = computed(() => ((user.value?.points || 0) > 1000 ? 1 : 42));

const ringOffset = computed(() => {
  const circumference = 2 * Math.PI * 18;
  const ratio = Math.min(1, (user.value?.points || 0) / REDEEM_MIN);
  return circumference * (1 - ratio);
});

const pointsToGo = computed(() => Math.max(0, REDEEM_MIN - (user.value?.points || 0)));

const openVendors = computed(() => (onlineVendors.value || []).filter((v: any) => v?.isOpen !== false).slice(0, 6));
const closedCount = computed(() => (onlineVendors.value || []).filter((v: any) => v?.isOpen === false).length);

const isVideo = (src?: string) => Boolean(src && String(src).match(/\.(mp4|webm|ogg|mov)$/i));

const copyPin = async (pin: string) => {
  if (!pin) return;
  try {
    await navigator.clipboard.writeText(pin);
    showToast({ title: 'Copied', message: 'Delivery PIN copied.', toastType: 'success' } as any);
  } catch {
    showToast({ title: 'Could not copy', message: 'Copy it by hand instead.', toastType: 'error' } as any);
  }
};

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ path: '/search', query: { q: searchQuery.value } });
  }
};

const handlePointsRedeemed = (newPoints: number) => {
  if (user.value) user.value.points = newPoints;
};

onMounted(async () => {
  await Promise.allSettled([fetchProfile(), fetchOrders(), fetchHomeData()]);
});

useHead({
  title: 'Home - Erranders',
  meta: [{ name: 'description', content: 'Order food, run errands, swap what you do not use — on campus.' }],
});
</script>

<style scoped>
/*
 * One page, two surfaces: warm off-white by day, near-black by night. Every colour below reads
 * from a variable so dark mode is a handful of overrides rather than a second set of classes.
 */
.home {
  --accent: #f26a2e;
  --accent-ink: #ffffff;
  --ink: #141110;
  --muted: #6b655d;
  --faint: #97908a;
  --line: #e8e2d9;
  --surface: #ffffff;
  --page: #faf8f5;
  --dark: #16120f;
  --radius: 18px;

  color: var(--ink);
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding-bottom: 96px;
  font-size: 15px;

  /* Page tint bleeds past the container padding without changing layout, so dark mode has a
     dark page rather than dark cards on a white sheet. */
  background: var(--page);
  box-shadow: 0 0 0 100vmax var(--page);
  clip-path: inset(0 -100vmax);
}

@media (prefers-color-scheme: dark) {
  .home {
    --ink: #f6f2ec;
    --muted: #b3aca3;
    --faint: #8b847c;
    --line: #2c2721;
    --surface: #1b1713;
    --page: #12100e;
    --dark: #0c0a09;
    --accent-ink: #171310;
  }
}

/* ─── Header ─── */
.home-head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  padding-top: 8px;
}

.greet {
  font-size: 15px;
  font-weight: 600;
  color: var(--muted);
  margin: 0;
}

.name {
  font-size: clamp(28px, 6vw, 40px);
  font-weight: 800;
  letter-spacing: -0.035em;
  line-height: 1.05;
  margin: 2px 0 0;
  color: var(--ink);
}

.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--ink);
  font-size: 13px;
  font-weight: 650;
  text-decoration: none;
  transition: border-color 0.15s ease, transform 0.15s ease;
}

.chip:hover {
  border-color: var(--accent);
}

.chip-accent {
  border-color: transparent;
  background: var(--accent);
  color: var(--accent-ink);
}

.chip-icon {
  width: 15px;
  height: 15px;
  opacity: 0.85;
}

/* ─── Live order ─── */
.hero {
  display: grid;
  gap: 14px;
  grid-template-columns: 1fr;
}

@media (min-width: 900px) {
  .hero {
    grid-template-columns: minmax(0, 1.55fr) minmax(240px, 0.75fr);
    align-items: stretch;
  }
}

.live {
  background: var(--dark);
  color: #fff;
  border-radius: var(--radius);
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.live-top {
  display: flex;
  align-items: center;
  gap: 10px;
}

.live-dot {
  width: 9px;
  height: 9px;
  border-radius: 999px;
  background: #4ade80;
  box-shadow: 0 0 0 4px rgba(74, 222, 128, 0.18);
}

.live-status {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
}

.live-eta {
  margin-left: auto;
  font-size: 13px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.12);
}

.live-title {
  margin: 0;
  font-size: clamp(22px, 4vw, 28px);
  font-weight: 800;
  letter-spacing: -0.03em;
  line-height: 1.1;
}

.live-sub {
  margin: 0;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.66);
}

.steps {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 6px;
  margin: 4px 0 0;
  padding: 0;
}

.step {
  position: relative;
  padding-top: 18px;
  font-size: 12.5px;
  font-weight: 650;
  color: rgba(255, 255, 255, 0.42);
}

.step::before {
  content: '';
  position: absolute;
  top: 5px;
  left: 0;
  right: 0;
  height: 2px;
  background: rgba(255, 255, 255, 0.16);
}

.step:first-child::before {
  border-radius: 999px 0 0 999px;
}

.step:last-child::before {
  border-radius: 0 999px 999px 0;
}

.step.done::before,
.step.current::before {
  background: var(--accent);
}

.step-dot {
  position: absolute;
  top: 0;
  left: 0;
  width: 12px;
  height: 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.22);
}

.step.done .step-dot {
  background: var(--accent);
}

.step.current .step-dot {
  background: var(--accent);
  box-shadow: 0 0 0 4px rgba(242, 106, 46, 0.22);
}

.step.done,
.step.current {
  color: #fff;
}

.live-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 2px;
}

/* ─── Ticket ─── */
.ticket {
  position: relative;
  background: var(--accent);
  color: var(--accent-ink);
  border-radius: var(--radius);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
  /* Notched edges read as a torn ticket stub. */
  -webkit-mask:
    radial-gradient(14px at 0 50%, transparent 98%, #000) left / 51% 100% no-repeat,
    radial-gradient(14px at 100% 50%, transparent 98%, #000) right / 51% 100% no-repeat;
  mask:
    radial-gradient(14px at 0 50%, transparent 98%, #000) left / 51% 100% no-repeat,
    radial-gradient(14px at 100% 50%, transparent 98%, #000) right / 51% 100% no-repeat;
}

.ticket-label {
  margin: 0;
  font-size: 14px;
  font-weight: 650;
  opacity: 0.9;
}

.ticket-pin {
  margin: 0;
  font-size: clamp(40px, 9vw, 56px);
  font-weight: 800;
  letter-spacing: 0.22em;
  line-height: 1;
  font-variant-numeric: tabular-nums;
}

.perforation {
  border-top: 2px dashed rgba(0, 0, 0, 0.28);
  opacity: 0.6;
  margin: 2px 0;
}

.btn-ticket {
  background: rgba(0, 0, 0, 0.82);
  color: #fff;
  border: 0;
}

/* ─── Buttons ─── */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
  cursor: pointer;
  border: 1px solid transparent;
  transition: transform 0.15s ease, background 0.15s ease, border-color 0.15s ease;
}

.btn:active {
  transform: scale(0.98);
}

.btn-accent {
  background: var(--accent);
  color: var(--accent-ink);
}

.btn-dark {
  background: var(--ink);
  color: var(--page);
}

.btn-ghost {
  background: transparent;
  color: inherit;
  border-color: currentColor;
  opacity: 0.85;
}

.live .btn-ghost {
  border-color: rgba(255, 255, 255, 0.32);
  opacity: 1;
}

/* ─── Idle hero ─── */
.hero-idle {
  background: var(--surface);
  border: 1px solid var(--line);
  border-radius: var(--radius);
  padding: 22px;
}

.ask {
  margin: 0 0 14px;
  font-size: clamp(22px, 4vw, 28px);
  font-weight: 800;
  letter-spacing: -0.03em;
}

.ask-form {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--page);
  border: 1px solid var(--line);
  border-radius: 14px;
  padding: 6px 6px 6px 14px;
}

.ask-form:focus-within {
  border-color: var(--accent);
  box-shadow: 0 0 0 3px rgba(242, 106, 46, 0.16);
}

.ask-icon {
  width: 18px;
  height: 18px;
  color: var(--faint);
  flex: none;
}

.ask-input {
  flex: 1;
  min-width: 0;
  border: 0;
  background: transparent;
  color: var(--ink);
  font-size: 15px;
  font-weight: 550;
  padding: 10px 0;
  outline: none;
}

.ask-input::placeholder {
  color: var(--faint);
}

.ask-go {
  flex: none;
  width: 44px;
  height: 44px;
  border-radius: 10px;
  border: 0;
  background: var(--accent);
  color: var(--accent-ink);
  display: grid;
  place-items: center;
  cursor: pointer;
}

.quick {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}

.quick-chip {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 10px 14px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--ink);
  font-size: 14px;
  font-weight: 650;
  text-decoration: none;
}

.quick-chip:hover {
  border-color: var(--accent);
  color: var(--accent);
}

/* ─── Payment prompt ─── */
.pay {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  border: 1px solid #f5c9a8;
  background: #fff4ec;
  border-radius: var(--radius);
  padding: 16px 18px;
}

@media (prefers-color-scheme: dark) {
  .pay {
    background: rgba(242, 106, 46, 0.1);
    border-color: rgba(242, 106, 46, 0.36);
  }
}

.pay-title {
  margin: 0;
  font-size: 16px;
  font-weight: 750;
}

.pay-sub {
  margin: 2px 0 0;
  font-size: 14px;
  color: var(--muted);
}

/* ─── Bento ─── */
.bento {
  display: grid;
  gap: 12px;
  grid-template-columns: 1fr;
}

@media (min-width: 760px) {
  .bento {
    grid-template-columns: repeat(4, 1fr);
  }

  .tile-errand {
    grid-column: span 2;
    grid-row: span 2;
  }

  .tile-barter {
    grid-column: span 2;
  }

  .tile-points {
    grid-column: span 2;
  }
}

.tile {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 20px;
  border-radius: var(--radius);
  text-decoration: none;
  color: inherit;
  border: 1px solid var(--line);
  background: var(--surface);
  cursor: pointer;
  text-align: left;
  transition: transform 0.15s ease, border-color 0.15s ease;
}

.tile:hover {
  transform: translateY(-1px);
  border-color: var(--accent);
}

.tile-head {
  display: flex;
  align-items: center;
  gap: 10px;
}

.tile-tag {
  font-size: 13px;
  font-weight: 650;
  opacity: 0.75;
}

.tile-title {
  margin: 0;
  font-size: clamp(19px, 3vw, 24px);
  font-weight: 800;
  letter-spacing: -0.025em;
  line-height: 1.15;
}

.tile-body {
  margin: 0;
  font-size: 14.5px;
  line-height: 1.5;
  opacity: 0.72;
}

.tile-cta {
  margin-top: auto;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14.5px;
  font-weight: 750;
  color: var(--accent);
}

.tile-errand {
  background: var(--dark);
  color: #fff;
  border-color: var(--dark);
  justify-content: space-between;
  min-height: 190px;
}

.tile-errand .tile-cta {
  color: var(--accent);
}

.tile-errand:hover {
  border-color: var(--accent);
}

.tile-points {
  flex-direction: row;
  align-items: center;
  gap: 14px;
}

.tile-title.sm {
  font-size: 16px;
}

.tile-body.sm {
  font-size: 13.5px;
}

/* Progress ring for the points tile. */
.ring {
  position: relative;
  width: 56px;
  height: 56px;
  flex: none;
}

.ring-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.ring-track,
.ring-fill {
  fill: none;
  stroke-width: 4;
}

.ring-track {
  stroke: var(--line);
}

.ring-fill {
  stroke: var(--accent);
  stroke-linecap: round;
  stroke-dasharray: 113;
  transition: stroke-dashoffset 0.4s ease;
}

.ring-text {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-size: 14px;
  font-weight: 800;
}

/* ─── Open now ─── */
.open-head {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.section-title {
  margin: 0;
  font-size: clamp(19px, 3vw, 22px);
  font-weight: 800;
  letter-spacing: -0.025em;
}

.section-link {
  font-size: 14px;
  font-weight: 700;
  color: var(--accent);
  text-decoration: none;
}

.store-grid {
  display: grid;
  gap: 12px;
  grid-template-columns: 1fr;
}

@media (min-width: 560px) {
  .store-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .store-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.store {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px;
  border-radius: var(--radius);
  border: 1px solid var(--line);
  background: var(--surface);
  text-decoration: none;
  color: inherit;
  transition: border-color 0.15s ease;
}

.store:hover {
  border-color: var(--accent);
}

.store-media {
  width: 64px;
  height: 64px;
  border-radius: 12px;
  overflow: hidden;
  flex: none;
  background: var(--page);
}

.store-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.store-body {
  min-width: 0;
}

.store-name {
  margin: 0;
  font-size: 15.5px;
  font-weight: 750;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.store-meta {
  margin: 3px 0 0;
  font-size: 13.5px;
  color: var(--muted);
}

.store-skel {
  height: 88px;
  border-radius: var(--radius);
  background: var(--surface);
  border: 1px solid var(--line);
  animation: pulse 1.6s ease-in-out infinite;
}

.closed-line {
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 16px;
  border-radius: 14px;
  border: 1px dashed var(--line);
  color: var(--muted);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
}

.closed-line:hover {
  border-color: var(--accent);
  color: var(--accent);
}

.quiet {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 32px 20px;
  border-radius: var(--radius);
  border: 1px dashed var(--line);
  background: var(--surface);
  color: var(--muted);
  text-align: center;
}

.quiet p {
  margin: 0;
  font-size: 14.5px;
}

.offline {
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13.5px;
  color: var(--muted);
}

/* Visible keyboard focus everywhere, including the ticket and tiles. */
.home :where(a, button, input):focus-visible {
  outline: 3px solid var(--accent);
  outline-offset: 2px;
  border-radius: 10px;
}

@media (prefers-reduced-motion: reduce) {
  .home *,
  .home *::before,
  .home *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
</style>
