<template>
  <div class="jobs">
    <header class="head">
      <div>
        <h1>My jobs</h1>
        <p class="lede">Jobs a shop has given you, and what you have earned from them.</p>
      </div>
      <NuxtLink to="/dashboard/wallet" class="wallet-link">
        <Wallet class="w-4 h-4" aria-hidden="true" />
        Wallet
      </NuxtLink>
    </header>

    <div v-if="loading" class="empty">Loading…</div>

    <!-- No membership: this page is not for everyone, so it explains rather than showing nothing. -->
    <div v-else-if="!memberships.length" class="empty">
      <Users class="w-5 h-5" aria-hidden="true" />
      <p>You are not on a service team yet.</p>
      <p class="empty-note">A shop adds you by email, then gives you their invite code to accept here.</p>

      <form class="accept" @submit.prevent="accept">
        <input v-model="code" type="text" placeholder="Invite code" aria-label="Invite code" />
        <button type="submit" :disabled="accepting">{{ accepting ? 'Checking…' : 'Accept' }}</button>
      </form>
      <p v-if="error" class="error">{{ error }}</p>
    </div>

    <template v-else>
      <section class="teams">
        <div v-for="m in memberships" :key="m._id" class="card team">
          <div class="team-main">
            <div class="badge" aria-hidden="true">{{ (m.vendor?.storeName || 'S')[0] }}</div>
            <div>
              <p class="team-name">{{ m.vendor?.storeName }}</p>
              <p class="team-meta">
                {{ m.role === 'manager' ? 'Manager' : 'Team member' }} ·
                {{ m.payoutType === 'fixed' ? `₦${Number(m.payoutFixedAmount || 0).toLocaleString()} a job` : `${m.payoutSharePercent}% a job` }}
              </p>
            </div>
          </div>
          <span class="status" :class="m.status">{{ m.status }}</span>
        </div>
      </section>

      <!-- Earnings: what has landed, and where it can go. -->
      <section class="card earn">
        <div class="earn-top">
          <div>
            <p class="earn-label">Earned so far</p>
            <p class="earn-value">₦{{ earnings.toLocaleString() }}</p>
          </div>
          <button v-if="account.verified" type="button" class="btn-primary" :disabled="withdrawing" @click="withdraw">
            {{ withdrawing ? 'Sending…' : 'Withdraw' }}
          </button>
        </div>

        <p v-if="withdrawError" class="error">{{ withdrawError }}</p>

        <div v-if="account.verified" class="bank">
          <p class="bank-line">
            Money from this shop goes to
            <strong v-if="account.accountName">{{ account.accountName }}</strong>
            <strong v-else>your bank account</strong>
          </p>
          <p v-if="account.bankName || account.accountNumber" class="bank-name">
            {{ account.bankName || 'Your bank' }}
            <template v-if="account.accountNumber"> · {{ mask(account.accountNumber) }}</template>
          </p>
          <p v-else class="bank-name warn">
            The bank name and number are missing. Add the account again so your pay can be sent.
          </p>
          <button type="button" class="link" @click="editingBank = true">
            {{ account.accountNumber ? 'Change account' : 'Add account details' }}
          </button>
        </div>

        <div v-else-if="!editingBank" class="bank-missing">
          <p class="bank-line">Add a bank account so your pay can be sent to you.</p>
          <button type="button" class="btn-primary" @click="editingBank = true">Add bank account</button>
        </div>

        <form v-if="editingBank || !account.verified" class="bank-form" @submit.prevent="saveBank">
          <label class="field">
            <span class="flabel">Bank</span>
            <select v-model="bank.bankCode" required>
              <option value="">Choose your bank</option>
              <option v-for="b in banks" :key="b.code" :value="b.code">{{ b.name }}</option>
            </select>
          </label>

          <label class="field">
            <span class="flabel">Account number</span>
            <input v-model="bank.accountNumber" inputmode="numeric" maxlength="10" placeholder="0123456789" required />
          </label>

          <button type="submit" class="btn-primary" :disabled="savingBank">
            {{ savingBank ? 'Checking…' : 'Save account' }}
          </button>

          <p v-if="bankError" class="error">{{ bankError }}</p>
          <p v-if="bankSaved" class="ok">Saved. Payouts will go to {{ bankSaved }}.</p>
        </form>
      </section>

      <section class="list-wrap">
        <h2 class="section-title">Assigned to you</h2>

        <div v-if="!jobs.length" class="empty small">
          <Calendar class="w-5 h-5" aria-hidden="true" />
          <p>Nothing assigned yet. When a shop gives you a job it appears here.</p>
        </div>

        <ul v-else class="list">
          <li v-for="job in jobs" :key="job._id" class="card job">
            <div class="job-main">
              <p class="job-name">{{ job.serviceName || 'Service' }}</p>
              <p class="job-meta">
                {{ formatDate(job.scheduledAt || job.createdAt) }} · ₦{{ Number(job.commitmentFee || 0).toLocaleString() }}
              </p>
            </div>
            <span class="status" :class="job.status">{{ job.status }}</span>
          </li>
        </ul>
      </section>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Wallet, Users, Calendar } from 'lucide-vue-next';
import { GATEWAY_ENDPOINT_WITH_AUTH } from '@/api_factory/axios.config';

definePageMeta({ layout: 'student' });
useHead({ title: 'My jobs - Erranders' });

import { payout_api } from '@/api_factory/modules/payout';

const memberships = ref<any[]>([]);
const earnings = ref(0);
const banks = ref<any[]>([]);
const account = ref<any>({ verified: false });
const editingBank = ref(false);
const bank = ref({ bankCode: '', accountNumber: '' });
const savingBank = ref(false);
const bankError = ref('');
const bankSaved = ref('');
const withdrawing = ref(false);
const withdrawError = ref('');
const jobs = ref<any[]>([]);
const loading = ref(true);
const accepting = ref(false);
const code = ref('');
const error = ref('');

const formatDate = (value: string) => {
  if (!value) return 'No date';
  const d = new Date(value);
  return d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' });
};

const load = async () => {
  loading.value = true;
  try {
    const res: any = await GATEWAY_ENDPOINT_WITH_AUTH.get('/team/me');
    memberships.value = res?.data?.memberships || [];
    jobs.value = res?.data?.jobs || [];
  } catch {
    memberships.value = [];
    jobs.value = [];
  } finally {
    loading.value = false;
  }
};

const accept = async () => {
  accepting.value = true;
  error.value = '';
  try {
    await GATEWAY_ENDPOINT_WITH_AUTH.post('/team/accept', { code: code.value });
    code.value = '';
    await load();
  } catch (e: any) {
    error.value = e?.response?.data?.message || 'That code did not work';
  } finally {
    accepting.value = false;
  }
};

const mask = (n?: string) => (n ? `••••${n.slice(-4)}` : '');

const loadMoney = async () => {
  try {
    const [acc, list]: any = await Promise.all([payout_api.account(), payout_api.banks()]);
    const accData = acc?.data || {};
    account.value = accData;
    earnings.value = Number(accData.balance || 0);
    const bankData = list?.data?.data || list?.data || [];
    banks.value = Array.isArray(bankData) ? bankData : [];
  } catch {
    banks.value = [];
  }
};

const saveBank = async () => {
  savingBank.value = true;
  bankError.value = '';
  bankSaved.value = '';
  try {
    const chosen = banks.value.find((b) => b.code === bank.value.bankCode);
    const res: any = await payout_api.saveAccount({
      accountNumber: bank.value.accountNumber,
      bankCode: bank.value.bankCode,
      bankName: chosen?.name,
    });
    const saved = res?.data || {};
    account.value = { ...saved, verified: true };
    bankSaved.value = saved.accountName || 'that account';
    editingBank.value = false;
  } catch (e: any) {
    bankError.value = e?.response?.data?.message || 'That account could not be confirmed';
  } finally {
    savingBank.value = false;
  }
};

const withdraw = async () => {
  withdrawing.value = true;
  withdrawError.value = '';
  try {
    await payout_api.withdraw(earnings.value);
    await loadMoney();
  } catch (e: any) {
    withdrawError.value = e?.response?.data?.message || 'Could not start the withdrawal';
  } finally {
    withdrawing.value = false;
  }
};

onMounted(async () => {
  await load();
  await loadMoney();
});
</script>

<style scoped>
.jobs {
  max-width: 760px;
  margin: 0 auto;
  padding: 28px 20px 80px;
  color: var(--ink);
}

.head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

h1 {
  margin: 0;
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.lede {
  margin: 6px 0 0;
  font-size: 15px;
  line-height: 1.5;
  color: var(--mute);
}

.wallet-link {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 10px 14px;
  border-radius: 11px;
  border: 1px solid var(--line);
  background: var(--card);
  color: var(--ink);
  font-size: 14.5px;
  font-weight: 700;
  text-decoration: none;
}

.card {
  border: 1px solid var(--line);
  border-radius: 14px;
  background: var(--card);
  padding: 14px 16px;
}

.teams {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 26px;
}

.team {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.team-main {
  display: flex;
  align-items: center;
  gap: 12px;
}

.badge {
  width: 38px;
  height: 38px;
  border-radius: 11px;
  display: grid;
  place-items: center;
  background: var(--orsoft);
  color: var(--accent);
  font-weight: 800;
  flex: none;
}

.team-name {
  margin: 0;
  font-size: 16px;
  font-weight: 750;
}

.team-meta {
  margin: 2px 0 0;
  font-size: 13.5px;
  color: var(--mute);
}

.status {
  padding: 3px 9px;
  border-radius: 999px;
  font-size: 12.5px;
  font-weight: 750;
  text-transform: capitalize;
  background: var(--page);
  border: 1px solid var(--line);
  color: var(--mute);
}

.status.active,
.status.completed {
  background: var(--green-soft);
  color: #0f6b3d;
  border-color: transparent;
}

.status.invited,
.status.confirmed {
  background: var(--orsoft);
  color: #b3400b;
  border-color: transparent;
}

.section-title {
  margin: 0 0 12px;
  font-size: 17px;
  font-weight: 750;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.job {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.job-name {
  margin: 0;
  font-size: 15.5px;
  font-weight: 700;
}

.job-meta {
  margin: 3px 0 0;
  font-size: 13.5px;
  color: var(--mute);
}

.empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 40px 20px;
  border: 1px dashed var(--line);
  border-radius: 14px;
  color: var(--mute);
  text-align: center;
  font-size: 15px;
}

.empty.small {
  padding: 26px 20px;
}

.empty-note {
  margin: 0;
  font-size: 13.5px;
}

.accept {
  display: flex;
  gap: 8px;
  margin-top: 12px;
  width: 100%;
  max-width: 380px;
}

.accept input {
  flex: 1;
  min-width: 0;
  padding: 11px 12px;
  border-radius: 11px;
  border: 1px solid var(--line);
  background: var(--card);
  color: var(--ink);
  font-size: 15px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  outline: none;
}

.accept button {
  padding: 11px 18px;
  border-radius: 11px;
  border: 0;
  background: var(--accent);
  color: #fff;
  font-size: 15px;
  font-weight: 750;
  cursor: pointer;
}

.error {
  margin: 10px 0 0;
  font-size: 14px;
  font-weight: 650;
  color: #b91c1c;
}

.earn {
  margin-bottom: 24px;
}

.earn-top {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 14px;
  flex-wrap: wrap;
}

.earn-label {
  margin: 0;
  font-size: 13px;
  font-weight: 700;
  color: var(--mute);
}

.earn-value {
  margin: 4px 0 0;
  font-size: 30px;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.btn-primary {
  padding: 12px 18px;
  border: 0;
  border-radius: 11px;
  background: var(--accent);
  color: #fff;
  font-size: 15px;
  font-weight: 750;
  cursor: pointer;
}

.btn-primary:disabled {
  opacity: 0.6;
}

.bank {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid var(--line);
}

.bank-line {
  margin: 0;
  font-size: 14.5px;
  color: var(--ink);
}

.bank-name.warn {
  color: #b45309;
  font-weight: 650;
}

.bank-name {
  margin: 3px 0 0;
  font-size: 13.5px;
  color: var(--mute);
}

.bank-missing {
  margin-top: 14px;
  padding-top: 14px;
  border-top: 1px solid var(--line);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.link {
  margin-top: 8px;
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--accent);
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
}

.bank-form {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--line);
}

@media (min-width: 560px) {
  .bank-form {
    grid-template-columns: 1fr 1fr auto;
    align-items: end;
  }
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.flabel {
  font-size: 13px;
  font-weight: 700;
  color: var(--ink);
}

.bank-form select,
.bank-form input {
  width: 100%;
  padding: 11px 12px;
  border-radius: 11px;
  border: 1px solid var(--line);
  background: var(--card);
  color: var(--ink);
  font-size: 15px;
  outline: none;
}

.bank-form select:focus,
.bank-form input:focus {
  border-color: var(--accent);
}

.ok {
  grid-column: 1 / -1;
  margin: 0;
  font-size: 13.5px;
  font-weight: 650;
  color: #15803d;
}
</style>
