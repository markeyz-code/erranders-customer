<template>
 <div class="min-h-screen bg-[#F8F9FA] pb-24">
 <!-- Header -->
 <div class="bg-white border-b border-gray-100 sticky top-0 z-30">
 <div class="max-w-5xl w-full mx-auto px-4 h-20 flex items-center justify-between">
 <div class="flex items-center gap-4">
 <NuxtLink to="/dashboard" class="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-50 hover:bg-gray-100 transition-all group">
 <ArrowLeft class="w-4 h-4 text-gray-900 group-hover:-translate-x-0.5 transition-transform" />
 </NuxtLink>
 <div>
 <h1 class="text-xl font-medium text-gray-900 tracking-tight">Purchase History</h1>
 <p class="text-sm font-bold text-gray-400 mt-0.5">Track and manage your orders</p>
 </div>
 </div>
 <div class="flex items-center gap-3">
 <div class="hidden sm:flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-50">
 <div class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
 <span class="text-sm font-medium text-gray-600 ">Live Tracking Active</span>
 </div>
 </div>
 </div>
 </div>

 <div class="max-w-5xl w-full mx-auto px-4 py-4 md:py-5">
 <!-- Stats Overview -->
 <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
 <div v-for="stat in stats" :key="stat.label" class="bg-white p-4 md:p-4 rounded-2xl border border-gray-50 ">
 <p class="text-sm font-medium text-gray-400 tracking-[0.2em] mb-2">{{ stat.label }}</p>
 <div class="flex items-end justify-between">
 <h3 class="text-2xl font-medium text-gray-900 tracking-tighter">{{ stat.value }}</h3>
 <div :class="`w-8 h-8 rounded-lg flex items-center justify-center bg-${stat.color}-50 text-${stat.color}-600`">
 <component :is="stat.icon" class="w-4 h-4" />
 </div>
 </div>
 </div>
 </div>

 <!-- Filters -->
 <div class="flex items-center gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
 <button 
 v-for="filter in filters" 
 :key="filter.value"
 @click="activeFilter = filter.value"
 :class="[
 'px-5 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap border',
 activeFilter === filter.value 
 ? 'bg-gray-900 text-white border-gray-25' 
 : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'
 ]"
 >
 {{ filter.label }}
 </button>
 </div>

 <!-- Orders List -->
 <div v-if="loading" class="space-y-4">
 <div v-for="i in 3" :key="i" class="h-32 bg-gray-100 rounded-2xl animate-pulse"></div>
 </div>

 <div v-else-if="filteredOrders.length === 0" class="flex flex-col items-center justify-center py-20 bg-white rounded-[2rem] border border-gray-50 border-dashed">
 <div class="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mb-6">
 <ShoppingBag class="w-8 h-8 text-gray-200" />
 </div>
 <h3 class="text-lg font-medium text-gray-900 tracking-tight">No orders found</h3>
 <p class="text-sm text-gray-400 font-medium mt-1">Looks like you haven't made any purchases yet.</p>
 <NuxtLink to="/vendors" class="mt-8 px-5 py-4 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-parentPrimary transition-all shadow-gray-100">Start Shopping</NuxtLink>
 </div>

 <div v-else class="space-y-4">
 <div 
 v-for="order in filteredOrders" 
 :key="order._id"
 class="bg-white rounded-[1.5rem] border border-gray-50 hover: transition-all overflow-hidden group"
 >
 <div class="p-5 md:p-4 md:p-4 flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
 <!-- Vendor Info -->
 <div class="flex items-center gap-4 min-w-[200px]">
 <div class="w-14 h-14 bg-gray-50 rounded-2xl border border-gray-50 overflow-hidden shrink-0">
 <img :src="order.vendor?.logo || '/placeholder-vendor.jpg'" class="w-full h-full object-cover" />
 </div>
 <div>
 <h4 class="font-medium text-gray-900 text-sm tracking-tight truncate max-w-[150px]">{{ order.vendor?.storeName }}</h4>
 <p class="text-sm font-bold text-gray-400 mt-0.5">#{{ order.orderNumber }}</p>
 </div>
 </div>

 <!-- Order Brief -->
 <div class="flex-1 grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
 <div>
 <p class="text-[8px] font-medium text-gray-400 mb-1">Items</p>
 <p class="text-sm font-bold text-gray-700">{{ order.items?.length || order.packs?.length || 0 }} items ordered</p>
 </div>
 <div>
 <p class="text-[8px] font-medium text-gray-400 mb-1">Total Paid</p>
 <p class="text-sm font-medium text-gray-900">₦{{ order.total?.toLocaleString() }}</p>
 </div>
 <div class="hidden md:block">
 <p class="text-[8px] font-medium text-gray-400 mb-1">Date</p>
 <p class="text-sm font-bold text-gray-700">{{ formatDate(order.createdAt) }}</p>
 </div>
 </div>

 <!-- Status & Action -->
 <div class="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 pt-4 md:pt-0">
 <div :class="[
 'px-4 py-1.5 rounded-full text-sm font-medium border',
 getStatusClass(order.status)
 ]">
 {{ order.status?.replace('_', ' ') }}
 </div>
 <NuxtLink 
 :to="`/orders/${order._id}`"
 class="w-10 h-10 bg-gray-50 text-gray-900 rounded-xl flex items-center justify-center border border-gray-50 hover:bg-gray-900 hover:text-white hover:border-gray-25transition-all"
 >
 <ChevronRight class="w-4 h-4" />
 </NuxtLink>
 </div>
 </div>
 </div>
 </div>
 </div>
 </div>
</template>

<script setup lang="ts">
import { 
 ArrowLeft, ShoppingBag, ChevronRight, Clock, 
 CheckCircle2, Package, Truck, AlertCircle 
} from 'lucide-vue-next';
import { useStudentOrders } from '@/composables/modules/orders';
import { ref, computed, onMounted } from 'vue';

const { orders, loading, fetchOrders } = useStudentOrders();
const activeFilter = ref('all');

onMounted(() => {
 fetchOrders();
});

const filters = [
 { label: 'All Orders', value: 'all' },
 { label: 'Active', value: 'active' },
 { label: 'Completed', value: 'delivered' },
 { label: 'Cancelled', value: 'cancelled' }
];

const stats = computed(() => {
 const all = orders.value.length;
 const activeCount = orders.value.filter(o => !['delivered', 'cancelled'].includes(o.status)).length;
 const completed = orders.value.filter(o => o.status === 'delivered').length;
 const totalSpent = orders.value.filter(o => o.status === 'delivered').reduce((acc, o) => acc + (o.total || 0), 0);

 return [
 { label: 'Total Orders', value: all, icon: ShoppingBag, color: 'gray' },
 { label: 'In Progress', value: activeCount, icon: Clock, color: 'blue' },
 { label: 'Completed', value: completed, icon: CheckCircle2, color: 'emerald' },
 { label: 'Total Spent', value: `₦${totalSpent.toLocaleString()}`, icon: Truck, color: 'indigo' }
 ];
});

const filteredOrders = computed(() => {
 if (activeFilter.value === 'all') return orders.value;
 if (activeFilter.value === 'active') {
 return orders.value.filter(o => !['delivered', 'cancelled'].includes(o.status));
 }
 return orders.value.filter(o => o.status === activeFilter.value);
});

const formatDate = (dateStr: string) => {
 if (!dateStr) return 'N/A';
 const date = new Date(dateStr);
 return date.toLocaleDateString('en-GB', { 
 day: '2-digit', 
 month: 'short', 
 year: 'numeric' 
 });
};

const getStatusClass = (status: string) => {
 switch (status?.toLowerCase()) {
 case 'pending': return 'bg-amber-50 text-amber-600 border-amber-100';
 case 'confirmed': return 'bg-blue-50 text-blue-600 border-blue-100';
 case 'preparing': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
 case 'picked_up':
 case 'in_transit': return 'bg-purple-50 text-purple-600 border-purple-100';
 case 'delivered': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
 case 'cancelled': return 'bg-rose-50 text-rose-600 border-rose-100';
 default: return 'bg-gray-50 text-gray-600 border-gray-100';
 }
};
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
 display: none;
}
.no-scrollbar {
 -ms-overflow-style: none;
 scrollbar-width: none;
}
</style>
