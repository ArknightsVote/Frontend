<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { exportXLSX } from '@/utils/exportXlsx'

interface KeyLabel {
  text: string
  key: string
  style?: CSSProperties | ((row: number) => CSSProperties)
}

interface TransformLabel extends Omit<KeyLabel, 'key'> {
  transform: (col: number) => string | number
}

type Data = Record<KeyLabel['key'], any[]>

export interface TableProps {
  labels: (KeyLabel | TransformLabel)[]
  data: Data

  /**
   * 哪列作为唯一标识
   */
  idkey?: string

  /**
   * 是否锁定第一列
   */
  fixIndex?: boolean

  /**
   * 是否导出数据
   *
   * 如果是字符串，该字符串将作为文件名
   */
  exportTable?: boolean | string

  /**
   * 是否为 flex-row 布局
   */
  flexRow?: boolean
}

const props = defineProps<TableProps>()

// 用于检测是否需要横向滚动的 ref
const scrollContainer = ref<HTMLElement>()
const tableElement = ref<HTMLElement>()
const needsHorizontalScroll = ref(false)

// 检测是否需要横向滚动
const checkNeedsScroll = () => {
  if (scrollContainer.value && tableElement.value) {
    const containerWidth = scrollContainer.value.clientWidth
    const tableWidth = tableElement.value.scrollWidth
    needsHorizontalScroll.value = tableWidth > containerWidth
  }
}

// 监听窗口大小变化
const resizeObserver = new ResizeObserver(() => {
  checkNeedsScroll()
})

onMounted(() => {
  nextTick(() => {
    checkNeedsScroll()
    if (scrollContainer.value) {
      resizeObserver.observe(scrollContainer.value)
    }
  })
})

onUnmounted(() => {
  resizeObserver.disconnect()
})

// 监听数据变化，重新检测
watch(() => [props.labels, props.data], () => {
  nextTick(() => {
    checkNeedsScroll()
  })
}, { deep: true })

// 唯一标识列
const idColItems = computed(() => {
  const colKeys = Object.keys(props.data)

  if (!props.idkey && !colKeys.length) {
    return []
  }

  return props.idkey ? props.data[props.idkey] : props.data[colKeys[0]]
})

function isKeyLabel(label: KeyLabel | TransformLabel): label is KeyLabel {
  return Object.hasOwnProperty.call(label, 'key')
}

function getValue(row: number, col: number) {
  const label = props.labels[col]
  if (isKeyLabel(label)) {
    const val = props.data[label.key]?.[row]
    return val ?? 'null'
  }

  return label.transform(row)
}

function getStyle(label: KeyLabel | TransformLabel, row: number) {
  return typeof label.style === 'function' ? label.style(row) : label.style
}

//
// 导出
// ----------------------------------------

function exportData() {
  if (!props.exportTable)
    return

  const items: any[][] = []

  items.push(props.labels.map(label => label.text))

  idColItems.value.forEach((_, row) => {
    const item = props.labels.map((label) => {
      return isKeyLabel(label) ? props.data[label.key][row] : label.transform(row)
    })
    items.push(item)
  })

  const filename = typeof props.exportTable === 'string' ? props.exportTable : 'table.xlsx'
  exportXLSX(items, { filename })
}
</script>

<template>
  <div
    :class="flexRow ? 'md:flex md:flex-row gap-4' : ''"
  >
    <div
      v-if="$slots.function || exportTable"
      p-2
      :class="flexRow ? 'md:sticky md:top-0 md:h-full md:overflow-y-auto' : ''"
    >
      <button
        v-if="exportTable"
        ml-auto
        mr-0
        block
        btn
        class="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
        @click="exportData"
      >
        导出
      </button>
      <slot name="function" />
    </div>

    <div flex-1 my-2 class="bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-gray-200/60 overflow-hidden table-container">
      <!-- 移动端横向滑动提示 - 只在需要滚动时显示 -->
      <div 
        v-if="needsHorizontalScroll" 
        class="md:hidden bg-blue-50 border-b border-blue-200 px-4 py-2 text-center text-sm text-blue-600 font-medium"
      >
        📱 左右滑动查看更多内容
      </div>
      
      <!-- 横向滚动容器 -->
      <div ref="scrollContainer" class="overflow-x-auto">
        <table
          ref="tableElement"
          w-full
          table-auto
          border-collapse
          text="center"
          class="min-w-full"
        >
          <caption v-if="$slots.caption" caption-top px-2 py-2>
            <slot name="caption" />
          </caption>
          <thead sticky top-0>
            <tr class="bg-blue-100 text-blue-800 font-semibold">
              <th
                v-for="label in labels"
                :key="label.text"
                break-keep
                whitespace-nowrap
                class="px-4 py-3"
              >
                {{ label.text }}
              </th>
            </tr>
          </thead>
          <tbody>
            <slot name="tbody" :get-value="getValue" :id-col-items="idColItems">
              <tr
                v-for="(k, row) in idColItems"
                :key="idkey ? k : row"
                class="hover:bg-blue-50/60 transition-colors duration-200"
                :class="row % 2 === 0 ? 'bg-white/60' : 'bg-gray-50/60'"
              >
                <td
                  v-for="(label, col) in labels"
                  :key="label.text"
                  break-keep
                  whitespace-nowrap
                  :style="getStyle(label, row)"
                  class="px-4 py-3 text-gray-700 font-medium"
                  :class="fixIndex ? 'first:sticky first:left-0 z-1 first:bg-blue-100 first:text-blue-800 first:font-semibold' : ''"
                >
                  {{ getValue(row, col) }}
                </td>
              </tr>
            </slot>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<style>
/* 表格容器 - 需要相对定位 */
.table-container {
  position: relative;
  overflow: hidden; /* 防止水印溢出 */
  width: 100%;     /* 根据实际表格宽度调整 */
}

/* 横向滚动容器 */
.table-container .overflow-x-auto {
  /* 自定义滚动条样式 */
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
}

/* Webkit 浏览器滚动条样式 */
.table-container .overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}

.table-container .overflow-x-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.table-container .overflow-x-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.table-container .overflow-x-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* 水印样式 - 使用伪元素覆盖 */
.table-container::after {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none; /* 允许点击穿透 */
  opacity: 0.15;        /* 水印透明度 */
  
  /* SVG 水印背景 - 倾斜45度重复 */
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Ctext x='0' y='50%25' font-size='20' fill='black' transform='rotate(-45 100 100)' font-family='Arial'%3EArknightsVote%3C/text%3E%3C/svg%3E");
  
  background-repeat: repeat;
  z-index: 100; /* 确保在表格上方 */
}

/* 移动端提示样式 */
@media (max-width: 768px) {
  .table-container .overflow-x-auto {
    /* 在移动端增强滚动条可见性 */
    scrollbar-width: auto;
  }
  
  .table-container .overflow-x-auto::-webkit-scrollbar {
    height: 12px;
  }
}
</style>