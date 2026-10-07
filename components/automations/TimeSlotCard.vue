<template>
  <div 
    class="relative rounded-[1.5rem] border p-5 sm:p-6 transition-all duration-300 min-h-[160px] flex flex-col justify-between"
    :class="order ? 'bg-white border-parentPrimary/20 shadow-lg shadow-parentPrimary/5 hover:border-parentPrimary/50 cursor-pointer group' : 'bg-gray-50/50 border-dashed border-gray-300 hover:border-parentPrimary/40 hover:bg-white cursor-pointer group'"
    @click="order ? $emit('edit', order) : $emit('add')"
  >
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <Clock class="w-4 h-4" :class="order ? 'text-parentPrimary' : 'text-gray-400'" />
        <div>
          <h4 class="text-sm font-bold tracking-tight" :class="order ? 'text-gray-900' : 'text-gray-500'">{{ timeLabel }}</h4>
          <p v-if="order && getExactTime(order)" class="text-sm font-semibold text-parentPrimary mt-0.5">
            Initiates at {{ getExactTime(order) }}
          </p>
        </div>
      </div>
      
      <!-- Status Badge if order exists -->
      <span v-if="order" 
        class="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-full"
        :class="order.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'"
      >
        {{ order.status }}
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
        <p class="text-sm font-medium text-gray-500" v-if="order.items.length > 1">+ {{ order.items.length - 1 }} more items</p>
      </div>
      
      <div class="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
        <div class="flex flex-col">
          <span class="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Per Run</span>
          <span class="text-sm font-black text-gray-900">₦{{ order.total?.toLocaleString() || 0 }}</span>
        </div>
        
        <div class="flex items-center gap-2">
          <button @click.stop="$emit('edit', order)" class="w-8 h-8 rounded-full bg-gray-50 hover:bg-parentPrimary/10 text-gray-400 hover:text-parentPrimary flex items-center justify-center transition-colors border border-gray-50 hover:border-parentPrimary/20 shadow-sm" title="Edit Automation">
            <Edit2 class="w-4 h-4"/>
          </button>
          <button @click.stop="$emit('delete', order._id)" class="w-8 h-8 rounded-full bg-gray-50 hover:bg-rose-50 text-gray-400 hover:text-rose-500 flex items-center justify-center transition-colors border border-gray-50 hover:border-rose-100 shadow-sm" title="Delete Automation">
            <Trash2 class="w-4 h-4"/>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Clock, Plus, Trash2, Edit2 } from 'lucide-vue-next'

const props = defineProps({
  timeLabel: { type: String, required: true },
  slotKey: { type: String, required: true },
  day: { type: String, required: true },
  order: { type: Object, default: null }
})

defineEmits(['add', 'delete', 'edit'])

const getExactTime = (orderObj) => {
  if (!orderObj || !orderObj.schedules || !orderObj.schedules.length) return null
  const scheduleForDay = orderObj.schedules.find(s => s.day === props.day.toLowerCase())
  if (!scheduleForDay || !scheduleForDay.exactTime) return null
  // format 14:30 to 02:30 PM
  const timeStr = scheduleForDay.exactTime
  const [hStr, mStr] = timeStr.split(':')
  let h = parseInt(hStr, 10)
  const ampm = h >= 12 ? 'PM' : 'AM'
  h = h % 12
  h = h ? h : 12 // the hour '0' should be '12'
  const hDisplay = h < 10 ? '0'+h : h
  return `${hDisplay}:${mStr} ${ampm}`
}
</script>
