<template>
  <div class="wrap">
    <header class="head">
      <h1>Search</h1>
      <p>Find anything on campus — meals, groceries, a service, a store.</p>
    </header>

    <form class="field" role="search" @submit.prevent="performSearch">
      <Search class="field-icon" aria-hidden="true" />
      <input
        v-model="query"
        type="search"
        class="field-input"
        placeholder="Jollof, laundry, textbooks…"
        aria-label="Search"
        autofocus
        @input="debouncedSearch"
      />
      <span v-if="searching" class="spinner" aria-label="Searching" />
    </form>

    <!-- Results -->
    <section v-if="query && results.length" class="results">
      <div class="results-head">
        <h2>{{ results.length }} result{{ results.length === 1 ? '' : 's' }} for "{{ query }}"</h2>
      </div>

      <div class="grid">
        <button
          v-for="item in results"
          :key="item._id"
          type="button"
          class="card"
          :class="{ closed: item.isOpen === false || item.vendor?.isOpen === false }"
          :disabled="item.isOpen === false || item.vendor?.isOpen === false"
          @click="handleItemClick(item)"
        >
          <div class="media">
            <img
              :src="item.image || item.logo || item.banner || '/placeholder-store.jpg'"
              class="media-img"
              alt=""
              loading="lazy"
            />
            <span v-if="item.price !== undefined" class="price">₦{{ item.price?.toLocaleString() }}</span>
            <span v-if="item.isOpen === false || item.vendor?.isOpen === false" class="closed-veil">
              <Lock class="w-4 h-4" aria-hidden="true" /> Closed
            </span>
          </div>
          <div class="card-body">
            <p class="card-name">{{ item.name || item.storeName }}</p>
            <p class="card-meta">{{ item.vendor?.storeName || item.category || 'Store' }}</p>
          </div>
        </button>
      </div>
    </section>

    <!-- Nothing found -->
    <section v-else-if="query && !searching" class="empty">
      <SearchX class="w-6 h-6" aria-hidden="true" />
      <p class="empty-title">Nothing matches "{{ query }}"</p>
      <p class="empty-body">Try a shorter word, or browse every store instead.</p>
      <NuxtLink to="/vendors" class="btn">Browse stores</NuxtLink>
    </section>

    <!-- Not searched yet -->
    <section v-else-if="!query" class="empty">
      <Search class="w-6 h-6" aria-hidden="true" />
      <p class="empty-title">Start typing</p>
      <p class="empty-body">Results appear as you type — no need to press enter.</p>
      <div class="suggestions">
        <NuxtLink to="/vendors" class="chip">Food</NuxtLink>
        <NuxtLink to="/errands/custom" class="chip">Errands</NuxtLink>
        <NuxtLink to="/market-pool" class="chip">Market</NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { Search, SearchX, Lock } from 'lucide-vue-next';
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { search_api } from '@/api_factory/modules/search';

definePageMeta({ layout: 'student' });

const router = useRouter();
const route = useRoute();
const query = ref('');
const results = ref<any[]>([]);
const searching = ref(false);

const performSearch = async () => {
  if (!query.value.trim()) {
    results.value = [];
    return;
  }
  searching.value = true;
  try {
    const res = await search_api.globalSearch({ q: query.value });
    const searchData = (res.data as any)?.data || res.data || {};
    results.value = [
      ...(searchData.products || []),
      ...(searchData.services || []),
      ...(searchData.menuItems || []),
      ...(searchData.vendors || []),
    ];
  } catch (e) {
    console.error(e);
  } finally {
    searching.value = false;
  }
};

let timeout: ReturnType<typeof setTimeout> | null = null;
const debouncedSearch = () => {
  if (timeout) clearTimeout(timeout);
  timeout = setTimeout(performSearch, 300);
};

onMounted(() => {
  if (route.query.q) {
    query.value = route.query.q as string;
    performSearch();
  }
});

const handleItemClick = (item: any) => {
  if (item.isOpen === false || item.vendor?.isOpen === false) return;
  router.push(`/vendors/${item.vendor?._id || item._id}`);
};

useHead({ title: 'Search - Erranders' });
</script>

<style scoped>
.wrap {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-bottom: 96px;
}

.head h1 {
  margin: 0;
  font-size: clamp(26px, 5vw, 34px);
  font-weight: 800;
  letter-spacing: -0.035em;
  color: var(--dash-ink);
}

.head p {
  margin: 4px 0 0;
  font-size: 15px;
  color: var(--dash-muted);
}

.field {
  display: flex;
  align-items: center;
  gap: 10px;
  background: var(--dash-surface);
  border: 1px solid var(--dash-line);
  border-radius: 16px;
  padding: 6px 6px 6px 16px;
  max-width: 720px;
}

.field:focus-within {
  border-color: var(--dash-accent);
  box-shadow: 0 0 0 3px rgba(242, 106, 46, 0.16);
}

.field-icon {
  width: 19px;
  height: 19px;
  color: var(--dash-faint);
  flex: none;
}

.field-input {
  flex: 1;
  min-width: 0;
  border: 0;
  background: transparent;
  color: var(--dash-ink);
  font-size: 16px;
  font-weight: 500;
  padding: 12px 0;
  outline: none;
}

.field-input::placeholder {
  color: var(--dash-faint);
}

.spinner {
  width: 18px;
  height: 18px;
  margin-right: 14px;
  border: 2px solid rgba(242, 106, 46, 0.25);
  border-top-color: var(--dash-accent);
  border-radius: 999px;
  animation: spin 0.7s linear infinite;
  flex: none;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.results-head h2 {
  margin: 0 0 12px;
  font-size: 15px;
  font-weight: 700;
  color: var(--dash-muted);
}

.grid {
  display: grid;
  gap: 12px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

@media (min-width: 720px) {
  .grid {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}

@media (min-width: 1100px) {
  .grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}

.card {
  display: flex;
  flex-direction: column;
  padding: 0;
  border: 1px solid var(--dash-line);
  border-radius: var(--dash-radius);
  background: var(--dash-surface);
  overflow: hidden;
  text-align: left;
  cursor: pointer;
  transition: border-color 0.15s ease, transform 0.15s ease;
}

.card:hover:not(.closed) {
  border-color: var(--dash-accent);
  transform: translateY(-1px);
}

.card.closed {
  cursor: not-allowed;
}

.media {
  position: relative;
  aspect-ratio: 1 / 1;
  background: var(--dash-page);
}

.media-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card.closed .media-img {
  opacity: 0.45;
}

.price {
  position: absolute;
  left: 8px;
  bottom: 8px;
  padding: 4px 9px;
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.94);
  color: #141110;
  font-size: 13px;
  font-weight: 800;
}

.closed-veil {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: rgba(20, 17, 16, 0.55);
  color: #fff;
  font-size: 13px;
  font-weight: 700;
}

.card-body {
  padding: 10px 12px 12px;
}

.card-name {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: var(--dash-ink);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-meta {
  margin: 2px 0 0;
  font-size: 13px;
  color: var(--dash-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 48px 20px;
  border: 1px dashed var(--dash-line);
  border-radius: var(--dash-radius);
  background: var(--dash-surface);
  color: var(--dash-muted);
  text-align: center;
}

.empty-title {
  margin: 4px 0 0;
  font-size: 17px;
  font-weight: 750;
  color: var(--dash-ink);
}

.empty-body {
  margin: 0;
  font-size: 15px;
  max-width: 34ch;
}

.btn {
  margin-top: 6px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 11px 16px;
  border-radius: 12px;
  background: var(--dash-ink);
  color: var(--dash-page);
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
}

.suggestions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 6px;
}

.chip {
  padding: 9px 14px;
  border-radius: 999px;
  border: 1px solid var(--dash-line);
  color: var(--dash-ink);
  font-size: 14px;
  font-weight: 650;
  text-decoration: none;
}

.chip:hover {
  border-color: var(--dash-accent);
  color: var(--dash-accent);
}
</style>
