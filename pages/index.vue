<template>
  <div class="landing">
    <!-- Sticky header: four links, one action. Nothing else. -->
    <!-- Original landing navigation. -->
    <LandingNavbar />

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
          <!-- Tabs hidden: the hero shows one message. Restore by uncommenting.
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
          -->

          <!-- Fixed height so the page does not jump between slides. -->
          <div
            class="panel"
          >
            <div :key="`c-${index}-${changeId}`" class="swap">
              <!-- The eyebrow was part of every original message; it is back with them. -->
              <p :key="'e-' + phrase" class="eyebrow swap">
                <span class="eyebrow-dot" aria-hidden="true"></span>
                {{ phraseText.eyebrow }}
              </p>

              <h1 :key="phrase" class="headline swap">
                <span class="line">{{ phraseText.headlinePrefix }}</span>
                <span class="line highlight">{{ phraseText.headlineHighlight }}</span>
              </h1>

              <p :key="'s-' + phrase" class="sub swap">{{ phraseText.subtext }}</p>

              <!-- One field for both jobs: find a store, or describe something to run. -->
              <form class="field" @submit.prevent="go">
                <input
                  v-model="q"
                  type="search"
                  class="field-input"
                  placeholder="Jollof, a pharmacy, or pick up my laundry"
                  aria-label="Search stores, food, or describe an errand"
                />
                <button type="submit" class="field-go">Search</button>

                <!-- Results as you type, from the vendors already loaded on this page. -->
                <div v-if="suggestions.length" class="sug" role="listbox" aria-label="Matching stores">
                  <NuxtLink
                    v-for="vendor in suggestions"
                    :key="vendor._id"
                    :to="`/vendors/${vendor._id}`"
                    class="sug-item"
                    role="option"
                  >
                    <span class="sug-logo">
                      <img v-if="vendor.logo" :src="vendor.logo" alt="" loading="lazy" />
                    </span>
                    <span class="sug-text">
                      <span class="sug-name">{{ cleanName(vendor.storeName) }}</span>
                      <span class="sug-meta">{{ vendor.category || 'Store' }} · {{ vendor.preparationTime || 20 }} min</span>
                    </span>
                    <ArrowRight class="w-4 h-4" aria-hidden="true" />
                  </NuxtLink>

                  <NuxtLink :to="{ path: '/vendors', query: { q: q } }" class="sug-all">
                    See all results for "{{ q }}"
                  </NuxtLink>
                </div>
              </form>

              <!-- What the app actually does, one tap from the field. -->
              <div class="modes">
                <NuxtLink to="/vendors" class="mode">
                  <UtensilsCrossed class="w-4 h-4" aria-hidden="true" />
                  Order food
                </NuxtLink>
                <NuxtLink to="/errands/custom" class="mode">
                  <PackageSearch class="w-4 h-4" aria-hidden="true" />
                  Make a custom errand
                </NuxtLink>
                <NuxtLink to="/market-pool" class="mode">
                  <Tag class="w-4 h-4" aria-hidden="true" />
                  Declutter and sell
                </NuxtLink>
              </div>

              <p class="hint">
                <span class="hint-dot" aria-hidden="true"></span>
                {{ hintText }}
              </p>
            </div>
          </div>

          <!-- Play/pause hidden with the tabs; there is nothing to pause.
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
          -->
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
          <NuxtLink
            v-for="vendor in openVendors"
            :key="vendor._id"
            :to="`/vendors/${vendor._id}`"
            class="store"
            role="listitem"
          >
            <!-- A photo is cropped to fill; a logo is contained, so a wordmark is never cut in half. -->
            <div class="store-media" :class="vendor.banner ? 'filled' : 'logo'">
              <img
                :src="vendor.banner || vendor.logo || '/placeholder-store.jpg'"
                class="store-img"
                :class="vendor.banner ? 'cover' : 'contain'"
                alt=""
                loading="lazy"
              />
              <span v-if="vendor.preOrderOnly" class="pill">Pre-order</span>
            </div>

            <div class="store-body">
              <p class="store-name">{{ cleanName(vendor.storeName) }}</p>
              <p class="store-meta">{{ vendor.category || 'Store' }}</p>
              <div class="store-foot">
                <span class="store-time">
                  <Clock class="w-3.5 h-3.5" aria-hidden="true" />
                  {{ vendor.preparationTime || 20 }} min
                </span>
                <span v-if="hasReviews(vendor)" class="rating">
                  <Star class="w-3.5 h-3.5" aria-hidden="true" />
                  {{ Number(vendor.rating).toFixed(1) }}
                  <span class="rating-count">({{ reviewCount(vendor) }})</span>
                </span>
                <span v-else class="new">New</span>
              </div>
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
                <div class="store-media" :class="vendor.banner ? 'filled' : 'logo'">
                  <img
                    :src="vendor.banner || vendor.logo || '/placeholder-store.jpg'"
                    class="store-img dim"
                    :class="vendor.banner ? 'cover' : 'contain'"
                    alt=""
                    loading="lazy"
                  />
                  <span class="pill closed">{{ opensAt(vendor) }}</span>
                </div>
                <div class="store-body">
                  <p class="store-name">{{ cleanName(vendor.storeName) }}</p>
                  <p class="store-meta">{{ vendor.category || 'Store' }}</p>
                  <div class="store-foot">
                    <span class="store-time closed">Closed</span>
                  </div>
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
          <p class="foot-line">Food, errands, meal plans and a place to sell what you no longer need.</p>
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
            <NuxtLink to="/market-pool" class="foot-link">Declutter</NuxtLink>
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
import { ArrowRight, ArrowUpRight, Moon, PackageSearch, Star, Sun, Tag, UtensilsCrossed } from 'lucide-vue-next';
import LandingNavbar from '@/components/LandingNavbar.vue';
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
    line2: 'Errand it.',
    sub: 'Food, laundry, a document, a mattress you no longer need. Someone on campus handles it.',
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
    key: 'group',
    tab: 'Group',
    line1: 'Eating alone?',
    line2: 'Split it.',
    sub: 'One cart, many people. Everyone adds their own food and the host pays once.',
    placeholder: 'Start a group order',
    button: 'Start a group',
    route: '/dashboard/group-orders',
    hint: 'Everyone pays their own share',
    ticket: {
      status: 'Waiting on 2 people',
      title: 'Room 342 lunch',
      sub: '4 people, one cart',
      steps: ['Opened', 'Joined', 'Ready', 'Paid'],
      at: 1,
      stubLabel: 'Invite code',
      stubValue: '4 B 2 K',
      stubNote: 'Share it with your roommates',
    },
  },
  {
    key: 'pharmacy',
    tab: 'Pharmacy',
    line1: 'Not feeling well?',
    line2: 'We bring it.',
    sub: 'Upload a prescription. A pharmacist checks it before anything leaves the counter.',
    placeholder: 'Paracetamol, cough syrup, plasters',
    button: 'Order medicine',
    route: '/vendors?category=pharmacy',
    hint: 'A pharmacist reviews every order',
    ticket: {
      status: 'Pharmacist reviewing',
      title: 'Amoxicillin 500mg',
      sub: 'Prescription uploaded',
      steps: ['Sent', 'Reviewed', 'Packed', 'Delivered'],
      at: 1,
      stubLabel: 'Order',
      stubValue: 'RX 2401',
      stubNote: 'Checked before it is dispatched',
    },
  },
  {
    key: 'market',
    tab: 'Market',
    line1: 'Shopping for many?',
    line2: 'Buy in bulk.',
    sub: 'Pool an order with other students and pay wholesale prices on the staples you share.',
    placeholder: 'Rice, oil, beans',
    button: 'Start a pool',
    route: '/market-pool',
    hint: 'Pay your share when the pool closes',
    ticket: {
      status: 'Pool filling',
      title: 'Rice, 50kg bag',
      sub: '6 of 10 joining',
      steps: ['Opened', 'Filling', 'Ordered', 'Shared'],
      at: 1,
      stubLabel: 'Your share',
      stubValue: '4,200',
      stubNote: 'Charged when the pool closes',
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

/**
 * The hero copy from before the rebuild. Eight messages in the three campus languages plus the
 * plain one, rotating every five seconds, exactly as they were.
 */
type HeroMessage = { eyebrow: string; headlinePrefix: string; headlineHighlight: string; subtext: string };

const heroMessages: HeroMessage[] = [
  // 1. Pidgin (Campus Heat / Chill)
  {
    eyebrow: 'The sun is outside fighting everybody? 😭☀️ Omo, rest!',
    headlinePrefix: 'Sun dey bake everybody outside?',
    headlineHighlight: 'Omo, Rest & Just Errand It! 🛵💨',
    subtext: 'You stay cool in your hostel, we run the trek — hot food, cold drinks & packages delivered to your room! 🧡',
  },
  // 2. Campus Slang (Downstairs Trek / Urgent Items)
  {
    eyebrow: 'Why bother trekking downstairs to pick up anything? 📦🚪',
    headlinePrefix: 'Trek downstairs under this sun?',
    headlineHighlight: 'Just Errand It to Your Door! 🏃🏽‍♂️✨',
    subtext: 'Some errands can wait, but that urgent package or warm meal? Errand Ninjas deliver straight to your floor.',
  },
  // 3. Yorùbá (Comfort & Doorstep Service)
  {
    eyebrow: 'Oòrùn ń jó gbogbo èèyàn níta campus? ☀️',
    headlinePrefix: 'Kí ló dé tí wàá fi fìyà jẹ ara ẹ?',
    headlineHighlight: 'Jókòó, Kàn Errand It! 🛵💨',
    subtext: 'Má ṣe yọ ara ẹ lẹ́nu rárá. Ìwọ fọkàn balẹ̀ sínú hostel, àwọn Ninjas wa yóò gbé oúnjẹ dídùn dé bá ẹ!',
  },
  // 4. Campus Slang (8am Lecture Hunger / Meal Schedule)
  {
    eyebrow: 'Entering 8am class on an empty stomach? Never again! ⏰🍱',
    headlinePrefix: 'Hungry for 8am lecture?',
    headlineHighlight: 'Auto-pilot with Meal Schedule! ⚡😋',
    subtext: 'Schedule breakfast and lunch ahead of time. Hot meals arrive right on cue before your first lecture starts.',
  },
  // 5. Igbo (Rest & Rapid Errands)
  {
    eyebrow: 'Anwụ na-eti mmadụ niile na campus taa? ☀️',
    headlinePrefix: 'Gịnị mere ị ga-eji gbaa ọsọ n\'anwụ?',
    headlineHighlight: 'Nọrọ Hostel, Just Errand It! 🛵✨',
    subtext: 'Nwanne, zuru ike na hostel! Anyị ga-agbara gị ọsọ weta nri ụtọ na ngwugwu ọbụla bịarute gị aka.',
  },
  // 6. Pidgin (Roommates / Group Orders)
  {
    eyebrow: 'Delivery fee dey choke you and your roommates? 😩',
    headlinePrefix: 'Why pay solo delivery fee?',
    headlineHighlight: 'Split Am With Group Orders! 👥🍕',
    subtext: 'Team up with your roomies or course mates, order together from your favorite vendors, and divide the cost sharp-sharp!',
  },
  // 7. Hausa (Peace of Mind & Hot Meals)
  {
    eyebrow: 'Rana tana kona mutane a harabar makaranta? ☀️',
    headlinePrefix: 'Kada ka wahalar da kanka a waje,',
    headlineHighlight: 'Kawai Errand It! 🛵💨',
    subtext: 'Huta a daki lafiya! Ninjas zasu kawo maka abinci mai dumi da dukkan kayan bukata har kofar dakinka.',
  },
  // 8. Campus Relatable (The Classic Erranders Promise)
  {
    eyebrow: 'Why trek from New Hall to Gate under scorching sun? 🏃🏽‍♂️🔥',
    headlinePrefix: 'Why stress yourself on campus?',
    headlineHighlight: 'Just Errand It! 🛵💨',
    subtext: 'From cafeteria meals to boutique items, pharmacy runs, and market pickups — consider it handled with speed.',
  },
];

const phrase = ref(0);
let phraseTimer: ReturnType<typeof setInterval> | null = null;
const phraseText = computed(() => heroMessages[phrase.value % heroMessages.length]);

const startPhrases = () => {
  if (typeof window === 'undefined') return;
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
  phraseTimer = setInterval(() => {
    phrase.value = (phrase.value + 1) % heroMessages.length;
  }, 5000);
};

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

/**
 * One field, two destinations. Anything that reads like a task goes to the custom errand form with
 * the description prefilled; everything else is a store search.
 */
const suggestions = computed(() => {
  const term = q.value.trim().toLowerCase();
  if (term.length < 2) return [];
  return (onlineVendors.value || [])
    .filter((v: any) => {
      const hay = `${v.storeName || ''} ${v.category || ''}`.toLowerCase();
      return hay.includes(term);
    })
    .slice(0, 5);
});

const TASK_WORDS = /\b(pick up|drop off|deliver|buy|get me|laundry|print|photocopy|document|package|parcel|queue|stand in|repair|fix|clean|fetch)\b/i;

const go = () => {
  const term = q.value?.trim() ?? '';
  if (!term) {
    navigateTo('/vendors');
    return;
  }

  if (TASK_WORDS.test(term)) {
    navigateTo({ path: '/errands/custom', query: { describe: term } });
    return;
  }

  navigateTo({ path: '/vendors', query: { q: term } });
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


const year = new Date().getFullYear();

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
const showClosed = ref(true);

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
  if (phraseTimer) clearInterval(phraseTimer);
});

onMounted(() => {
  startPhrases();
  // The slide carousel stays off while its tabs and pause control are hidden.
  running.value = false;
  fetchHomeData();
});

useHead({
  title: 'Erranders - food, errands and swaps on campus',
  meta: [{ name: 'description', content: 'Order food, send an errand, set up meal autopilot or swap what you do not use. Run by students on your campus.' }],
});
</script>

<style scoped>
.landing {
  /* The navigation is pinned to the top edge, so the page starts below its height. */
  padding-top: 84px;

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

  /* Nothing on this page is wider than the viewport. The rails scroll inside themselves. */
  overflow-x: clip;
}

/* Header: a floating bar with margins, so it never touches the edges. */
.nav-shell {
  position: sticky;
  top: 0;
  z-index: 50;
  padding: 10px 16px;
  background: color-mix(in srgb, var(--page) 82%, transparent);
  backdrop-filter: saturate(1.2) blur(14px);
}

.nav {
  display: flex;
  align-items: center;
  gap: 10px;
  height: 60px;
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 10px 0 14px;
  border-radius: 14px;
  border: 1px solid var(--line);
  background: var(--surface);
}

@media (min-width: 960px) {
  .nav {
    padding: 0 12px 0 16px;
  }

  .nav-link {
    padding: 9px 13px;
  }
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

/* There is one logo asset and it is dark ink. On a dark bar it disappears, so in dark mode it is
   drawn as a white mark. A proper white logo file would be better than a filter; this is the
   fallback until one exists. */
:global(html.dark) .brand-img {
  filter: brightness(0) invert(1);
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
  padding: 9px 11px;
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
  padding: 32px 20px 32px;
  min-width: 0;
  /* The hero owns the first screen: it fills the viewport under the 84px bar. */
  min-height: calc(100vh - 84px);
  min-height: calc(100svh - 84px);
  align-content: center;
}

@media (min-width: 960px) {
  .hero {
    grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
    align-items: center;
    padding: 24px 20px 32px;
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
  min-width: 0;
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

.eyebrow {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin: 0 0 12px;
  font-size: 15px;
  line-height: 1.45;
  font-weight: 650;
  color: var(--muted);
  max-width: 46ch;
}

.eyebrow-dot {
  flex: none;
  width: 7px;
  height: 7px;
  margin-top: 8px;
  border-radius: 999px;
  background: var(--accent);
}

.headline {
  margin: 0;
  overflow-wrap: anywhere;
  font-size: clamp(34px, 6vw, 58px);
  font-weight: 800;
  letter-spacing: -0.045em;
  line-height: 0.98;
  color: var(--ink);
}

.headline .line {
  display: block;
}

/* The second half of the original headline carried the accent. */
.headline .highlight {
  color: var(--accent);
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
  position: relative;
  display: flex;
  min-width: 0;
  max-width: 100%;
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

/* The field draws its own ring on focus-within; a second outline on the input reads as a double box. */
.field-input:focus-visible {
  outline: none;
}

.field-input::placeholder {
  color: var(--muted);
}

.field-go {
  flex: 0 1 auto;
  min-width: 0;
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
  min-width: 0;
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
  padding: 56px 20px 0;
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
  display: flex;
  flex-direction: column;
  height: 100%;
  border: 1px solid var(--line);
  border-radius: 16px;
  background: var(--surface);
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition: border-color 0.15s ease, transform 0.15s ease;
}

.store:hover {
  border-color: var(--accent);
  transform: translateY(-1px);
}

/* The media is a fixed box that clips. Nothing inside it can spill onto the name. */
.store-media {
  position: relative;
  flex: none;
  width: 100%;
  aspect-ratio: 4 / 3;
  overflow: hidden;
  background: var(--page);
}

.store-media.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 18px;
}

.store-img {
  display: block;
  width: 100%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
}

.store-img.cover {
  object-fit: cover;
}

.store-img.contain {
  object-fit: contain;
}

.store-img.dim {
  filter: grayscale(0.6);
  opacity: 0.55;
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
  box-shadow: 0 2px 8px rgba(23, 19, 15, 0.12);
}

.pill.closed {
  background: var(--surface);
  color: var(--ink);
  border: 1px solid var(--line);
}

/* Body fills whatever height the tallest card in the row needs. */
.store-body {
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
  padding: 13px 14px 14px;
  min-width: 0;
}

.store-name {
  margin: 0;
  font-size: 15.5px;
  font-weight: 750;
  line-height: 1.25;
  color: var(--ink);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.store-meta {
  margin: 0;
  font-size: 13.5px;
  color: var(--mute);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.store-foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: auto;
  padding-top: 10px;
  border-top: 1px solid var(--line);
}

.store-time {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 13.5px;
  font-weight: 650;
  color: var(--mute);
}

.store-time.closed {
  color: var(--mute);
}

.rating {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13.5px;
  font-weight: 750;
  color: var(--ink);
}

.rating :global(svg) {
  color: #d97706;
  fill: #d97706;
}

.rating-count {
  color: var(--mute);
  font-weight: 650;
}

.new {
  padding: 3px 9px;
  border-radius: 999px;
  background: var(--orsoft);
  color: #b3400b;
  font-size: 12.5px;
  font-weight: 750;
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

/* Closing banner: a card with a small gutter from the screen edges, not a full-width band. */
.closer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  max-width: 1080px;
  /* 16px each side on a phone, centred with room to breathe on a wide screen. */
  margin: 40px 16px 44px;
  padding: 24px;
  border-radius: 18px;
  background: var(--accent);
  color: #fff;
}

@media (min-width: 720px) {
  .closer {
    margin: 44px auto;
    padding: 28px;
  }
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


/* Footer, phone first: one column, tight rows, and room for the floating buttons. */
.foot {
  margin-top: 40px;
  border-top: 1px solid var(--line);
  background: var(--page);
  padding: 32px 16px calc(96px + env(safe-area-inset-bottom));
}

.foot-inner {
  display: grid;
  gap: 28px;
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

  .foot {
    padding: 48px 20px 28px;
  }
}

.foot-line {
  margin: 12px 0 0;
  font-size: 15px;
  line-height: 1.5;
  color: var(--mute);
  max-width: 34ch;
}

.foot-cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 14px;
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

/* Two even columns on a phone, three from 560px, so no column is left in a wide empty row. */
.foot-cols {
  display: grid;
  gap: 24px 20px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.foot-col:last-child {
  grid-column: 1 / -1;
}

@media (min-width: 560px) {
  .foot-cols {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }

  .foot-col:last-child {
    grid-column: auto;
  }
}

.foot-title {
  margin: 0 0 10px;
  font-size: 14px;
  font-weight: 750;
  color: var(--ink);
}

.foot-link {
  display: block;
  margin-bottom: 8px;
  color: var(--mute);
  font-size: 15px;
  text-decoration: none;
  width: fit-content;
}

.foot-link:hover {
  color: var(--accent);
}

.foot-base {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-width: 1120px;
  margin: 28px auto 0;
  padding-top: 16px;
  border-top: 1px solid var(--line);
}

@media (min-width: 560px) {
  .foot-base {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
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
  align-items: stretch;
  gap: 14px;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  padding-bottom: 6px;
  max-width: 100%;
  scrollbar-width: none;
}

.rail::-webkit-scrollbar {
  display: none;
}

.rail > * {
  scroll-snap-align: start;
  flex: 0 0 min(240px, 76vw);
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

/* The three ways in, right under the field. */
.modes {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
}

.mode {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 10px 14px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: var(--surface);
  color: var(--ink);
  font-size: 14.5px;
  font-weight: 700;
  text-decoration: none;
}

.mode:hover {
  border-color: var(--accent);
  color: var(--accent);
}

/* Suggestions: a panel under the field, above the chips. */
.sug {
  position: absolute;
  left: 0;
  right: 0;
  top: calc(100% + 8px);
  z-index: 40;
  overflow: hidden;
  border-radius: 14px;
  border: 1px solid var(--line);
  background: var(--surface);
  box-shadow: 0 20px 44px rgba(23, 19, 15, 0.14);
}

.sug-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  text-decoration: none;
  color: var(--ink);
  border-bottom: 1px solid var(--line);
}

.sug-item:hover {
  background: var(--orsoft);
}

.sug-logo {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  overflow: hidden;
  flex: none;
  background: var(--page);
}

.sug-logo img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.sug-text {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.sug-name {
  font-size: 15px;
  font-weight: 750;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sug-meta {
  font-size: 13px;
  color: var(--mute);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sug-all {
  display: block;
  padding: 12px;
  text-align: center;
  font-size: 14px;
  font-weight: 750;
  color: var(--accent);
  text-decoration: none;
}

.sug-all:hover {
  background: var(--orsoft);
}

/* One ring only: the field draws it, the input never does. */
.field-input,
.field-input:focus,
.field-input:focus-visible,
.field-input:focus-within {
  outline: none !important;
  box-shadow: none !important;
  border: 0 !important;
  -webkit-appearance: none;
  appearance: none;
}
</style>
