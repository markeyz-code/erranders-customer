<template>
  <div class="wrap">
    <header class="head">
      <div class="min-w-0">
        <h1>Campus Quests</h1>
        <p>Small missions, real rewards. Finish enough and the season badge is yours.</p>
      </div>
      <span class="season">Semester 1 · active</span>
    </header>

    <div class="layout">
      <div class="col-main">
        <RewardsQuestsView />

        <section class="legend">
          <h2>The Errandr Legend</h2>
          <p>
            Clear every quest this season to unlock the
            <strong>Legendary Errandr</strong> badge and a month of half-price delivery.
          </p>
          <div class="legend-foot">
            <div class="badges" aria-hidden="true">
              <span v-for="i in 4" :key="i">?</span>
            </div>
            <p class="legend-note">4 badges remaining</p>
          </div>
        </section>
      </div>

      <aside class="col-side">
        <section class="panel">
          <h3>How it works</h3>
          <ol class="steps">
            <li v-for="(step, i) in steps" :key="i">
              <span class="num">{{ i + 1 }}</span>
              <div>
                <p class="step-title">{{ step.title }}</p>
                <p class="step-desc">{{ step.desc }}</p>
              </div>
            </li>
          </ol>
        </section>

        <section class="panel">
          <div class="panel-icon"><Trophy class="w-5 h-5" aria-hidden="true" /></div>
          <h3>Climb the hall of fame</h3>
          <p class="panel-body">Top customers get perks every weekend — early slots, free delivery, extra points.</p>
          <NuxtLink to="/dashboard/leaderboard" class="panel-link">
            View rankings <ArrowRight class="w-4 h-4" aria-hidden="true" />
          </NuxtLink>
        </section>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Trophy, ArrowRight } from 'lucide-vue-next';

definePageMeta({ layout: 'student' });

const steps = [
  { title: 'Pick a quest', desc: 'Browse missions picked for your campus.' },
  { title: 'Complete it', desc: 'Order from particular stores, or hit a delivery streak.' },
  { title: 'Earn points', desc: 'Points land in your balance the moment it clears.' },
  { title: 'Redeem', desc: 'Swap points for airtime, discounts or merch.' },
];

useHead({
  title: 'Campus Quests - Erranders',
  meta: [{ name: 'description', content: 'Complete missions and earn rewards on campus.' }],
});
</script>

<style scoped>
.wrap {
  display: flex;
  flex-direction: column;
  gap: 22px;
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
  max-width: 52ch;
}

.season {
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid var(--dash-line);
  background: var(--dash-surface);
  color: var(--dash-muted);
  font-size: 13.5px;
  font-weight: 700;
}

.layout {
  display: grid;
  gap: 16px;
  grid-template-columns: 1fr;
}

@media (min-width: 1000px) {
  .layout {
    grid-template-columns: minmax(0, 1.6fr) minmax(280px, 1fr);
    align-items: start;
  }
}

.col-main,
.col-side {
  display: flex;
  flex-direction: column;
  gap: 16px;
  min-width: 0;
}

.legend {
  border: 1px solid var(--dash-line);
  border-radius: var(--dash-radius);
  background: var(--dash-surface);
  padding: 22px;
}

.legend h2 {
  margin: 0 0 8px;
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.025em;
  color: var(--dash-ink);
}

.legend p {
  margin: 0;
  font-size: 15px;
  line-height: 1.55;
  color: var(--dash-muted);
  max-width: 56ch;
}

.legend-foot {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 18px;
}

.badges {
  display: flex;
}

.badges span {
  width: 30px;
  height: 30px;
  margin-right: -8px;
  border-radius: 999px;
  display: grid;
  place-items: center;
  background: var(--dash-page);
  border: 2px solid var(--dash-surface);
  color: var(--dash-muted);
  font-size: 12px;
  font-weight: 800;
}

.legend-note {
  margin: 0 0 0 6px;
  font-size: 14px;
  font-weight: 700;
  color: var(--dash-accent);
}

.panel {
  border: 1px solid var(--dash-line);
  border-radius: var(--dash-radius);
  background: var(--dash-surface);
  padding: 20px;
}

.panel h3 {
  margin: 0 0 14px;
  font-size: 17px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: var(--dash-ink);
}

.steps {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.steps li {
  display: flex;
  gap: 12px;
}

.num {
  flex: none;
  width: 26px;
  height: 26px;
  border-radius: 9px;
  display: grid;
  place-items: center;
  background: var(--dash-page);
  border: 1px solid var(--dash-line);
  font-size: 13px;
  font-weight: 800;
  color: var(--dash-ink);
}

.step-title {
  margin: 0;
  font-size: 15px;
  font-weight: 700;
  color: var(--dash-ink);
}

.step-desc {
  margin: 2px 0 0;
  font-size: 14px;
  color: var(--dash-muted);
  line-height: 1.5;
}

.panel-icon {
  width: 38px;
  height: 38px;
  border-radius: 11px;
  display: grid;
  place-items: center;
  background: rgba(242, 106, 46, 0.12);
  color: var(--dash-accent);
  margin-bottom: 12px;
}

.panel-body {
  margin: 0 0 16px;
  font-size: 15px;
  color: var(--dash-muted);
  line-height: 1.55;
}

.panel-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 11px 15px;
  border-radius: 12px;
  border: 1px solid var(--dash-line);
  color: var(--dash-ink);
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
}

.panel-link:hover {
  border-color: var(--dash-accent);
  color: var(--dash-accent);
}
</style>
