<template>
  <Transition name="toast-slide">
    <aside
      v-if="status?.isActive && !isDismissed"
      class="batch-toast-wrapper"
      :class="{ 'is-dismissing': isDismissing }"
      role="region"
      aria-label="Batch Delivery Window"
    >
      <div class="batch-toast-card">
        <!-- Ambient top radiant accent -->
        <div class="toast-shimmer-top" />

        <div class="toast-content" @click="handleCardClick">
          <!-- Left: Rocket Icon Pod -->
          <div class="toast-icon-pod" title="Fast Batch Delivery">
            <Rocket class="toast-rocket" />
            <span class="icon-pulse-ring" />
          </div>

          <!-- Middle: Status & Message -->
          <div class="toast-details">
            <div class="toast-badge-row">
              <span class="live-indicator">
                <span class="live-dot" />
                <span class="live-label">LIVE</span>
              </span>
              <span class="time-chip">
                <Clock class="time-chip-icon" />
                <span>Until {{ displayTime }}</span>
              </span>
              <span class="dispatch-chip">Priority Dispatch</span>
            </div>

            <div class="toast-text-row">
              <span class="toast-title">{{ displayTitle }}</span>
              <span class="toast-subtext">· Fast campus delivery</span>
            </div>
          </div>

          <!-- Right: Actions (CTA + Dismiss) -->
          <div class="toast-actions">
            <button
              type="button"
              class="toast-cta-button"
              @click.stop="scrollToVendors"
              aria-label="Plan My Day"
            >
              <span>Plan Day</span>
              <ArrowRight class="cta-arrow-icon" />
            </button>

            <button
              type="button"
              class="toast-close-button"
              @click.stop="dismiss"
              aria-label="Close notification and do not show again"
              title="Don't show again"
            >
              <X class="close-x-icon" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Rocket, X, ArrowRight, Clock } from 'lucide-vue-next';
import { orders_api } from '@/api_factory/modules/orders';

const DISMISS_KEY = 'errandr_morning_batch_toast_closed_v1';

const status = ref<any>(null);
const isDismissed = ref(false);
const isDismissing = ref(false);
let intervalId: any = null;

const displayTitle = computed(() => {
  if (status.value?.type === 'morning') return 'Morning Batch Delivery';
  if (status.value?.type === 'afternoon') return 'Afternoon Batch Delivery';
  return 'Batch Delivery Active';
});

const displayTime = computed(() => {
  const endTime = status.value?.end;
  if (!endTime) return '10:00 AM';
  const parts = endTime.split(':');
  if (parts.length >= 2) {
    const hour = parseInt(parts[0], 10);
    const minute = parts[1];
    if (!isNaN(hour)) {
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const displayHour = hour % 12 || 12;
      return `${displayHour}:${minute} ${ampm}`;
    }
  }
  return endTime;
});

const isAlreadyDismissed = (): boolean => {
  try {
    if (typeof window !== 'undefined') {
      // Secret developer reset param (?reset_batch=1) to clear dismissal if needed during testing
      if (new URLSearchParams(window.location.search).has('reset_batch')) {
        localStorage.removeItem(DISMISS_KEY);
        return false;
      }
      return localStorage.getItem(DISMISS_KEY) === 'true';
    }
  } catch (e) {
    return false;
  }
  return false;
};

const checkStatus = async () => {
  if (isDismissed.value || isAlreadyDismissed()) {
    isDismissed.value = true;
    return;
  }

  try {
    const res = await orders_api.getBatchStatus();
    if (res?.data) {
      status.value = res.data;
    }
  } catch (e) {
    console.error('Failed to fetch batch status', e);
  }
};

const dismiss = () => {
  isDismissing.value = true;
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(DISMISS_KEY, 'true');
    }
  } catch (e) {
    console.warn('Unable to persist batch toast dismissal', e);
  }

  setTimeout(() => {
    isDismissed.value = true;
    if (status.value) {
      status.value.isActive = false;
    }
    isDismissing.value = false;
  }, 320);
};

const scrollToVendors = () => {
  navigateTo('/vendors');
};

const handleCardClick = () => {
  scrollToVendors();
};

onMounted(() => {
  if (isAlreadyDismissed()) {
    isDismissed.value = true;
    return;
  }

  checkStatus();
  intervalId = setInterval(checkStatus, 5 * 60 * 1000);
});

onUnmounted(() => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
});
</script>

<style scoped>
/* ─── Floating Toast Wrapper ─────────────────────────────── */
.batch-toast-wrapper {
  position: fixed;
  top: max(14px, env(safe-area-inset-top, 14px));
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 12px;
  z-index: 9999;
  pointer-events: none;
}

/* ─── Card Design ────────────────────────────────────────── */
.batch-toast-card {
  position: relative;
  width: 100%;
  max-width: 540px;
  pointer-events: auto;
  border-radius: 18px;
  background: rgba(14, 16, 22, 0.92);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 
    0 16px 36px -8px rgba(0, 0, 0, 0.55),
    0 0 20px -2px rgba(249, 115, 22, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
  overflow: hidden;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease, border-color 0.25s ease;
}

.batch-toast-card:hover {
  border-color: rgba(249, 115, 22, 0.35);
  box-shadow: 
    0 20px 42px -8px rgba(0, 0, 0, 0.65),
    0 0 28px -2px rgba(249, 115, 22, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

/* ─── Top Glow Accent ────────────────────────────────────── */
.toast-shimmer-top {
  position: absolute;
  top: 0;
  left: 10%;
  right: 10%;
  height: 1.5px;
  background: linear-gradient(90deg, transparent 0%, rgba(249, 115, 22, 0.8) 50%, rgba(251, 146, 60, 0.9) 70%, transparent 100%);
  pointer-events: none;
}

/* ─── Inner Content ──────────────────────────────────────── */
.toast-content {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 9px 12px;
  cursor: pointer;
  user-select: none;
}

/* ─── Icon Pod ───────────────────────────────────────────── */
.toast-icon-pod {
  position: relative;
  width: 38px;
  height: 38px;
  border-radius: 12px;
  background: #FF5C1A;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.35);
}

.toast-rocket {
  width: 19px;
  height: 19px;
  color: #ffffff;
  animation: rocket-sway 3s ease-in-out infinite;
}

.icon-pulse-ring {
  position: absolute;
  inset: -3px;
  border-radius: 15px;
  border: 1px solid rgba(249, 115, 22, 0.4);
  animation: pulse-grow 2.5s ease-in-out infinite;
  pointer-events: none;
}

@keyframes rocket-sway {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-2px) rotate(-6deg); }
}

@keyframes pulse-grow {
  0%, 100% { opacity: 0.8; transform: scale(1); }
  50% { opacity: 0.2; transform: scale(1.14); }
}

/* ─── Details Section ────────────────────────────────────── */
.toast-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1;
}

.toast-badge-row {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: nowrap;
}

.live-indicator {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: rgba(16, 185, 129, 0.16);
  border: 1px solid rgba(16, 185, 129, 0.35);
  border-radius: 100px;
  padding: 1.5px 6px;
  color: #34d399;
  font-size: 9.5px;
  font-weight: 800;
  letter-spacing: 0.08em;
  line-height: 1;
}

.live-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 6px #10b981;
  animation: dot-glow 1.5s ease-in-out infinite;
  flex-shrink: 0;
}

@keyframes dot-glow {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.3; transform: scale(0.85); }
}

.time-chip {
  display: inline-flex;
  align-items: center;
  gap: 3.5px;
  font-size: 11px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  white-space: nowrap;
  line-height: 1;
}

.time-chip-icon {
  width: 12px;
  height: 12px;
  color: rgba(255, 255, 255, 0.5);
  flex-shrink: 0;
}

.dispatch-chip {
  display: inline-flex;
  font-size: 9.5px;
  font-weight: 700;
  color: #ff8a4c;
  background: rgba(255, 92, 26, 0.12);
  border: 1px solid rgba(255, 92, 26, 0.25);
  padding: 1.5px 6px;
  border-radius: 100px;
  white-space: nowrap;
  line-height: 1;
}

.toast-text-row {
  display: flex;
  align-items: baseline;
  gap: 6px;
  min-width: 0;
}

.toast-title {
  font-size: 13px;
  font-weight: 700;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  letter-spacing: -0.01em;
  line-height: 1.3;
}

.toast-subtext {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.45);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  line-height: 1.3;
}

/* ─── Actions ────────────────────────────────────────────── */
.toast-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.toast-cta-button {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 7px 12px;
  border-radius: 11px;
  background: #FF5C1A;
  border: 1px solid rgba(255, 255, 255, 0.18);
  color: #ffffff;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.01em;
  cursor: pointer;
  white-space: nowrap;
  box-shadow: 0 4px 12px -2px rgba(249, 115, 22, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.3);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.toast-cta-button:hover {
  transform: scale(1.03);
  box-shadow: 0 6px 16px -2px rgba(249, 115, 22, 0.65);
}

.toast-cta-button:active {
  transform: scale(0.97);
}

.cta-arrow-icon {
  width: 13px;
  height: 13px;
  transition: transform 0.2s ease;
}

.toast-cta-button:hover .cta-arrow-icon {
  transform: translateX(2px);
}

.toast-close-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 9px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.04);
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  transition: all 0.15s ease;
  flex-shrink: 0;
}

.toast-close-button:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.2);
}

.close-x-icon {
  width: 13px;
  height: 13px;
}

/* ─── Responsive Adjustments ─────────────────────────────── */
@media (max-width: 480px) {
  .batch-toast-wrapper {
    padding: 0 10px;
  }

  .toast-content {
    gap: 10px;
    padding: 8px 10px;
  }

  .toast-icon-pod {
    width: 34px;
    height: 34px;
    border-radius: 10px;
  }

  .toast-rocket {
    width: 17px;
    height: 17px;
  }

  .toast-title {
    font-size: 12.5px;
  }

  .toast-subtext {
    display: none;
  }

  .dispatch-chip {
    display: none;
  }

  .toast-cta-button {
    padding: 6px 10px;
    font-size: 11.5px;
    border-radius: 9px;
  }

  .toast-close-button {
    width: 26px;
    height: 26px;
    border-radius: 8px;
  }
}

@media (max-width: 350px) {
  .time-chip {
    font-size: 10px;
  }
  
  .toast-cta-button span {
    display: none;
  }
  
  .toast-cta-button {
    padding: 6px 8px;
  }
}

/* ─── Transitions ────────────────────────────────────────── */
.toast-slide-enter-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-slide-leave-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 1, 1);
}

.toast-slide-enter-from {
  opacity: 0;
  transform: translateY(-28px) scale(0.95);
  filter: blur(4px);
}

.toast-slide-leave-to {
  opacity: 0;
  transform: translateY(-24px) scale(0.96);
  filter: blur(2px);
}

.batch-toast-wrapper.is-dismissing .batch-toast-card {
  opacity: 0;
  transform: scale(0.92) translateY(-10px);
  transition: all 0.32s cubic-bezier(0.4, 0, 1, 1);
}
</style>