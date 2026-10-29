<template>
  <div 
    class="relative rounded-[1.5rem] border p-5 sm:p-6 transition-all duration-300 min-h-[160px] flex flex-col justify-between"
    :class="[
      isPast 
        ? 'bg-gray-50/70 border-gray-200/80 opacity-90 cursor-default' 
        : order 
          ? 'bg-white border-parentPrimary/20 shadow-lg shadow-parentPrimary/5 hover:border-parentPrimary/50 cursor-pointer group' 
          : 'bg-gray-50/50 border-dashed border-gray-300 hover:border-parentPrimary/40 hover:bg-white cursor-pointer group'
    ]"
    @click="isPast ? null : (order ? $emit('edit', order) : $emit('add'))"
  >
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <Clock class="w-4 h-4" :class="order ? (isPast ? 'text-gray-400' : 'text-parentPrimary') : 'text-gray-400'" />
        <div>
          <h4 class="text-sm font-bold tracking-tight" :class="order ? (isPast ? 'text-gray-600' : 'text-gray-900') : 'text-gray-500'">{{ timeLabel }}</h4>
          <p v-if="order && getExactTime(order)" class="text-xs font-semibold mt-0.5" :class="isPast ? 'text-gray-400' : 'text-parentPrimary'">
            Initiates at {{ getExactTime(order) }}
          </p>
        </div>
      </div>
      
      <!-- Status Badge if order exists -->
      <span v-if="order" 
        class="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-full flex items-center gap-1"
        :class="isPast ? 'bg-gray-200 text-gray-700 border border-gray-300' : (order.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700')"
      >
        <Lock v-if="isPast" class="w-2.5 h-2.5 text-gray-600" />
        {{ isPast ? 'Kicked Off' : order.status }}
      </span>
    </div>

    <!-- Empty State -->
    <div v-if="!order" class="flex-1 flex flex-col items-center justify-center text-center mt-2">
      <div class="w-10 h-10 bg-gray-100 group-hover:bg-parentPrimary/10 rounded-full flex items-center justify-center transition-colors mb-3">
        <Plus class="w-5 h-5 text-gray-400 group-hover:text-parentPrimary transition-colors"/>
      </div>
      <p class="text-sm font-bold text-gray-500 group-hover:text-parentPrimary transition-colors">Add Meal</p>
    </div>

    <!-- Filled State -->
    <div v-else class="flex-1 flex flex-col justify-between">
      <div>
        <h5 class="font-bold text-gray-900 text-base leading-tight mb-1">{{ order.items[0]?.name || 'Meal Order' }}</h5>
        <p v-if="order.vendor?.storeName || order.vendor?.name" class="text-xs text-gray-500 font-medium flex items-center gap-1 mt-0.5">
          <Store class="w-3.5 h-3.5 text-[#FF5C1A] shrink-0" />
          <span class="truncate">{{ order.vendor?.storeName || order.vendor?.name }}</span>
        </p>
        <div class="flex items-center gap-1.5 flex-wrap mt-2">
          <div v-if="order.isSyncedFromMealDesk">
            <span class="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-[#FF5C1A] bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100">
              ⚡ Autopilot Synced
            </span>
          </div>
          <span v-if="getPortionsCount(order) > 1" class="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
            {{ getPortionsCount(order) }} Portions
          </span>
        </div>
        <p class="text-sm font-medium text-gray-500 mt-1" v-if="order.items.length > 1">+ {{ order.items.length - 1 }} more items</p>
      </div>
      
      <div class="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
        <div class="flex flex-col">
          <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Per Run</span>
          <span class="text-sm font-black text-gray-900">₦{{ order.total?.toLocaleString() || 0 }}</span>
        </div>
        
        <div class="flex items-center gap-2">
          <!-- If in past / kicked off: Locked, cannot edit or delete -->
          <div v-if="isPast" class="flex items-center gap-1 text-[11px] font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full border border-gray-200" title="Past orders that have kicked off cannot be edited">
            <Lock class="w-3 h-3 text-gray-400"/>
            <span>Locked</span>
          </div>
          <!-- If future / upcoming: editable -->
          <template v-else>
            <button @click.stop="$emit('edit', order)" class="w-10 h-10 rounded-full bg-gray-50 hover:bg-parentPrimary/10 text-gray-400 hover:text-parentPrimary flex items-center justify-center transition-colors border border-gray-50 hover:border-parentPrimary/20 shadow-sm" title="Edit Automation">
              <Edit2 class="w-4 h-4"/>
            </button>
            <button @click.stop="$emit('delete', order._id)" class="w-10 h-10 rounded-full bg-gray-50 hover:bg-rose-50 text-gray-400 hover:text-rose-500 flex items-center justify-center transition-colors border border-gray-50 hover:border-rose-100 shadow-sm" title="Delete Automation">
              <Trash2 class="w-4 h-4"/>
            </button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Clock, Plus, Trash2, Edit2, Store, Lock } from 'lucide-vue-next'

const props = defineProps({
  timeLabel: { type: String, required: true },
  slotKey: { type: String, required: true },
  day: { type: String, required: true },
  order: { type: Object, default: null },
  isPast: { type: Boolean, default: false }
})

defineEmits(['add', 'delete', 'edit'])

const getPortionsCount = (orderObj) => {
  if (!orderObj) return 1
  if (orderObj.portions && orderObj.portions > 1) return orderObj.portions
  if (orderObj.items && orderObj.items[0]?.quantity && orderObj.items[0].quantity > 1) {
    return orderObj.items[0].quantity
  }
  return 1
}

const getExactTime = (orderObj) => {
  if (!orderObj) return null
  if (orderObj.exactTime) {
    const timeStr = orderObj.exactTime
    const [hStr, mStr] = timeStr.split(':')
    let h = parseInt(hStr, 10)
    const ampm = h >= 12 ? 'PM' : 'AM'
    h = h % 12
    h = h ? h : 12
    const hDisplay = h < 10 ? '0' + h : h
    return `${hDisplay}:${mStr || '00'} ${ampm}`
  }
  if (!orderObj.schedules || !orderObj.schedules.length) return null
  const scheduleForDay = orderObj.schedules.find(s => s.day === props.day.toLowerCase())
  if (!scheduleForDay || !scheduleForDay.exactTime) return null
  const timeStr = scheduleForDay.exactTime
  const [hStr, mStr] = timeStr.split(':')
  let h = parseInt(hStr, 10)
  const ampm = h >= 12 ? 'PM' : 'AM'
  h = h % 12
  h = h ? h : 12
  const hDisplay = h < 10 ? '0' + h : h
  return `${hDisplay}:${mStr || '00'} ${ampm}`
}
</script>
