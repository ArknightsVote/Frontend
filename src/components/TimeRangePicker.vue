<script setup lang="ts">
import type { TimeRangeValue } from '@/utils/timeRange'
import { QUICK_RANGES, rangeLabel, resolveRange, toLocalInput } from '@/utils/timeRange'

const model = defineModel<TimeRangeValue>({ required: true })

const open = ref(false)
const root = ref<HTMLElement>()
onClickOutside(root, () => (open.value = false))

// 绝对时间草稿；打开时用当前范围回填
const draftFrom = ref('')
const draftTo = ref('')
watch(open, (o) => {
  if (o) {
    const { start, end } = resolveRange(model.value)
    draftFrom.value = toLocalInput(start)
    draftTo.value = toLocalInput(end)
  }
})

function pickQuick(r: TimeRangeValue) {
  model.value = r
  open.value = false
}
function applyAbsolute() {
  if (!draftFrom.value || !draftTo.value)
    return
  model.value = { kind: 'absolute', from: draftFrom.value, to: draftTo.value }
  open.value = false
}
function isActiveQuick(r: { ms: number }) {
  return model.value.kind === 'relative' && model.value.ms === r.ms
}
</script>

<template>
  <div ref="root" class="relative">
    <!-- 触发按钮 -->
    <button
      class="flex items-center gap-2 pl-2.5 pr-2 py-1 rounded-md bg-white/80 hover:bg-white border shadow-sm text-sm text-gray-800 transition-colors"
      :class="open ? 'border-indigo-400' : 'border-gray-200 hover:border-gray-300'"
      @click="open = !open"
    >
      <svg class="w-4 h-4 text-gray-400 shrink-0" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .25.12.48.32.62l3 2a.75.75 0 10.86-1.24l-2.68-1.87V5z" clip-rule="evenodd" />
      </svg>
      <span class="max-w-64 truncate">{{ rangeLabel(model) }}</span>
      <svg
        class="w-4 h-4 text-gray-400 shrink-0 transition-transform" :class="{ 'rotate-180': open }"
        viewBox="0 0 20 20" fill="currentColor"
      >
        <path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.06l3.71-3.83a.75.75 0 111.08 1.04l-4.25 4.38a.75.75 0 01-1.08 0L5.21 8.27a.75.75 0 01.02-1.06z" clip-rule="evenodd" />
      </svg>
    </button>

    <!-- 弹层 -->
    <transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="opacity-0 -translate-y-1"
      leave-active-class="transition duration-100 ease-in"
      leave-to-class="opacity-0 -translate-y-1"
    >
      <div
        v-if="open"
        class="absolute left-0 mt-2 z-50 flex flex-col sm:flex-row rounded-xl border border-gray-200 bg-white shadow-xl ring-1 ring-black/5 overflow-hidden"
        style="width: min(92vw, 30rem)"
      >
        <!-- 绝对时间范围 -->
        <div class="p-3 sm:w-56 border-b sm:border-b-0 sm:border-r border-gray-100">
          <div class="text-xs font-semibold text-gray-500 mb-2">
            绝对时间范围
          </div>
          <label class="block text-xs text-gray-500 mb-1">从</label>
          <input
            v-model="draftFrom" type="datetime-local"
            class="w-full mb-2 border b-gray-300 rounded px-2 py-1 text-sm outline-none"
          >
          <label class="block text-xs text-gray-500 mb-1">到</label>
          <input
            v-model="draftTo" type="datetime-local"
            class="w-full mb-3 border b-gray-300 rounded px-2 py-1 text-sm outline-none"
          >
          <button
            class="w-full py-1.5 rounded-md bg-indigo-500 hover:bg-indigo-600 text-white text-sm transition-colors"
            @click="applyAbsolute"
          >
            应用
          </button>
        </div>

        <!-- 快捷范围 -->
        <div class="p-2 sm:flex-1 max-h-72 overflow-auto">
          <div class="px-1 pt-1 pb-1.5 text-xs font-semibold text-gray-500">
            快捷范围
          </div>
          <button
            v-for="r in QUICK_RANGES"
            :key="r.label"
            class="w-full text-left px-2.5 py-1.5 rounded-md text-sm transition-colors"
            :class="isActiveQuick(r) ? 'bg-indigo-50 text-indigo-600 font-medium' : 'bg-transparent text-gray-700 hover:bg-gray-100'"
            @click="pickQuick(r)"
          >
            {{ r.label }}
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>
