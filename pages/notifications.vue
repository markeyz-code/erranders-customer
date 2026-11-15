<template>
  <div class="wrap">
    <header class="head">
      <div class="min-w-0">
        <h1>Notifications</h1>
        <p>What has changed on your orders and errands.</p>
      </div>
      <button
        v-if="notifications.length > 0 && unreadCount > 0"
        type="button"
        class="btn btn-quiet"
        @click="markAllAsRead"
      >
        Mark all as read
      </button>
    </header>

    <div v-if="loading" class="rows">
      <div v-for="i in 5" :key="i" class="skel" />
    </div>

    <div v-else-if="notifications.length === 0" class="empty">
      <Bell class="w-6 h-6" aria-hidden="true" />
      <p class="empty-title">Nothing yet</p>
      <p class="empty-body">We will tell you here, and on WhatsApp, when an order moves.</p>
      <NuxtLink to="/vendors" class="btn btn-dark">Browse stores</NuxtLink>
    </div>

    <div v-else class="rows">
      <article
        v-for="notif in notifications"
        :key="notif.id"
        class="row"
        :class="{ unread: !notif.read }"
        role="button"
        tabindex="0"
        @click="handleNotificationClick(notif)"
        @keydown.enter.prevent="handleNotificationClick(notif)"
      >
        <span class="dot" :class="tone(notif.type)" aria-hidden="true"></span>

        <div class="body">
          <div class="top">
            <p class="title">{{ notif.title }}</p>
            <span class="when">{{ formatTime(notif.createdAt) }}</span>
          </div>
          <p class="text">{{ notif.body }}</p>

          <NuxtLink
            v-if="notif.data?.orderId"
            :to="`/orders/${notif.data.orderId}`"
            class="link"
            @click.stop
          >
            View order <ArrowRight class="w-4 h-4" aria-hidden="true" />
          </NuxtLink>
        </div>

        <span v-if="!notif.read" class="unread-mark" aria-label="Unread"></span>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { ArrowRight, Bell } from 'lucide-vue-next';
import { useNotifications } from '@/composables/modules/notifications/useNotifications';

definePageMeta({ layout: 'student' });

const { notifications, loading, unreadCount, fetchNotifications, markAsRead, markAllAsRead } = useNotifications();

/** Colour carries the meaning; the emoji did not survive a small screen. */
const tone = (type: string) => {
  switch (type) {
    case 'ORDER_ACCEPTED':
      return 'ok';
    case 'ORDER_STATUS_UPDATE':
      return 'info';
    case 'NEW_ORDER_AVAILABLE':
      return 'live';
    default:
      return '';
  }
};

const formatTime = (date: string) => {
  if (!date) return '';
  const d = new Date(date);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);

  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'Yesterday';
  return d.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' });
};

const handleNotificationClick = async (notif: any) => {
  if (!notif.read) await markAsRead(notif.id);
  if (notif.data?.orderId) navigateTo(`/orders/${notif.data.orderId}`);
};

onMounted(() => {
  fetchNotifications();
});
</script>

<style scoped>
.wrap {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding-bottom: 96px;
}

.head {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
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

.rows {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.row {
  display: flex;
  gap: 14px;
  padding: 16px;
  border: 1px solid var(--dash-line);
  border-radius: var(--dash-radius);
  background: var(--dash-surface);
  cursor: pointer;
  transition: border-color 0.15s ease;
}

.row:hover {
  border-color: var(--dash-accent);
}

.row.unread {
  border-left: 3px solid var(--dash-accent);
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 999px;
  margin-top: 7px;
  flex: none;
  background: var(--dash-faint);
}

.dot.ok {
  background: #16a34a;
}

.dot.info {
  background: #2563eb;
}

.dot.live {
  background: var(--dash-accent);
}

.body {
  flex: 1;
  min-width: 0;
}

.top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.title {
  margin: 0;
  font-size: 15.5px;
  font-weight: 750;
  color: var(--dash-ink);
}

.when {
  flex: none;
  font-size: 13px;
  color: var(--dash-faint);
}

.text {
  margin: 3px 0 0;
  font-size: 15px;
  line-height: 1.5;
  color: var(--dash-muted);
}

.link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  font-size: 14.5px;
  font-weight: 750;
  color: var(--dash-accent);
  text-decoration: none;
}

.unread-mark {
  width: 8px;
  height: 8px;
  border-radius: 999px;
  background: var(--dash-accent);
  flex: none;
  margin-top: 8px;
}

.skel {
  height: 84px;
  border-radius: var(--dash-radius);
  background: var(--dash-surface);
  border: 1px solid var(--dash-line);
  animation: pulse 1.5s ease-in-out infinite;
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 46px 20px;
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
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 11px 16px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  border: 1px solid transparent;
  cursor: pointer;
  text-decoration: none;
}

.btn-dark {
  background: var(--dash-ink);
  color: var(--dash-page);
}

.btn-quiet {
  background: transparent;
  border-color: var(--dash-line);
  color: var(--dash-ink);
}
</style>
