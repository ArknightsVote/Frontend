<script setup lang="ts">
import type { CSSProperties } from 'vue'
// import { exportXLSX } from '@/utils/exportXlsx' // 原有Excel导出功能（已注释）

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

// 检测是否需要横向滚动 - 添加节流
const checkNeedsScroll = useDebounceFn(() => {
  if (scrollContainer.value && tableElement.value) {
    const containerWidth = scrollContainer.value.clientWidth
    const tableWidth = tableElement.value.scrollWidth
    needsHorizontalScroll.value = tableWidth > containerWidth
  }
}, 100) // 100ms 防抖

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

// 优化数据变化监听 - 移除深度监听，只监听数据长度变化
watch(() => [props.labels.length, Object.keys(props.data).length], () => {
  nextTick(() => {
    checkNeedsScroll()
  })
}, { flush: 'post' }) // 使用 post 刷新时机，减少重复执行

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

  // 原有的Excel导出逻辑（已注释）
  // const items: any[][] = []
  // items.push(props.labels.map(label => label.text))
  // idColItems.value.forEach((_, row) => {
  //   const item = props.labels.map((label) => {
  //     return isKeyLabel(label) ? props.data[label.key][row] : label.transform(row)
  //   })
  //   items.push(item)
  // })
  // const filename = typeof props.exportTable === 'string' ? props.exportTable : 'table.xlsx'
  // exportXLSX(items, { filename })

  // 新的Canvas图片导出逻辑
  exportTableAsImage()
}

// Canvas渲染表格图片导出
function exportTableAsImage() {
  if (!tableElement.value) return

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // 设置高DPI支持
  const dpi = window.devicePixelRatio || 1
  const scaleFactor = 2 // 额外的缩放倍数，提高清晰度

  // 设置字体样式（基础尺寸）
  const baseFontSize = 14
  const baseHeaderFontSize = 16
  const baseCellPadding = 12
  const baseBorderWidth = 1

  // 根据缩放因子调整尺寸
  const fontSize = baseFontSize * scaleFactor
  const headerFontSize = baseHeaderFontSize * scaleFactor
  const cellPadding = baseCellPadding * scaleFactor
  const borderWidth = baseBorderWidth * scaleFactor
  const fontFamily = 'Arial, sans-serif'

  ctx.font = `${fontSize}px ${fontFamily}`

  // 计算每列的最大宽度
  const colWidths: number[] = []
  
  // 计算表头宽度
  props.labels.forEach((label, col) => {
    ctx.font = `bold ${headerFontSize}px ${fontFamily}`
    const headerWidth = ctx.measureText(label.text).width + cellPadding * 2
    colWidths[col] = headerWidth
  })

  // 计算数据行宽度
  ctx.font = `${fontSize}px ${fontFamily}`
  idColItems.value.forEach((_, row) => {
    props.labels.forEach((_, col) => {
      const value = String(getValue(row, col))
      const textWidth = ctx.measureText(value).width + cellPadding * 2
      colWidths[col] = Math.max(colWidths[col] || 0, textWidth)
    })
  })

  // 计算画布尺寸
  const totalWidth = colWidths.reduce((sum, width) => sum + width, 0) + borderWidth * (colWidths.length + 1)
  const headerHeight = headerFontSize + cellPadding * 2
  const dataRowHeight = fontSize + cellPadding * 2
  const totalHeight = headerHeight + idColItems.value.length * dataRowHeight + borderWidth * (idColItems.value.length + 2)

  // 设置画布大小（高DPI）
  canvas.width = totalWidth * dpi
  canvas.height = totalHeight * dpi
  
  // 设置CSS尺寸（显示尺寸）
  canvas.style.width = totalWidth + 'px'
  canvas.style.height = totalHeight + 'px'
  
  // 缩放画布内容以适应高DPI
  ctx.scale(dpi, dpi)

  // 设置背景色
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, totalWidth, totalHeight)

  // 绘制边框
  ctx.strokeStyle = '#d1d5db'
  ctx.lineWidth = borderWidth

  let currentX = 0
  let currentY = 0

  // 绘制表头
  currentX = borderWidth
  props.labels.forEach((label, col) => {
    // 绘制表头背景色 - 统一使用默认蓝色背景，不考虑首列特殊处理
    ctx.fillStyle = '#dbeafe' // 默认蓝色背景
    ctx.fillRect(currentX, 0, colWidths[col], headerHeight + borderWidth)

    // 设置表头文字样式 - 统一样式
    ctx.fillStyle = '#1e40af' // 蓝色文字
    ctx.font = `bold ${headerFontSize}px ${fontFamily}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    const centerX = currentX + colWidths[col] / 2
    const centerY = headerHeight / 2 + borderWidth
    ctx.fillText(label.text, centerX, centerY)

    // 绘制列分隔线
    if (col < props.labels.length - 1) {
      ctx.strokeStyle = '#d1d5db'
      ctx.beginPath()
      ctx.moveTo(currentX + colWidths[col], 0)
      ctx.lineTo(currentX + colWidths[col], headerHeight + borderWidth)
      ctx.stroke()
    }

    currentX += colWidths[col]
  })

  // 绘制表头底部边框
  ctx.beginPath()
  ctx.moveTo(0, headerHeight + borderWidth)
  ctx.lineTo(totalWidth, headerHeight + borderWidth)
  ctx.stroke()

  // 绘制数据行
  ctx.font = `${fontSize}px ${fontFamily}`

  idColItems.value.forEach((_, row) => {
    currentY = headerHeight + borderWidth + (row + 1) * dataRowHeight
    
    currentX = borderWidth

    props.labels.forEach((_, col) => {
      // 获取当前列的样式
      const label = props.labels[col]
      const cellStyle = getStyle(label, row)
      
      // 绘制单元格背景色
      let backgroundColor = '#ffffff' // 默认白色背景
      
      if (cellStyle?.backgroundColor) {
        // 如果label中定义了背景色，使用该背景色
        backgroundColor = cellStyle.backgroundColor as string
      } else if (col === 0 && props.fixIndex) {
        // 第一列特殊背景色 (bg-blue-100)
        backgroundColor = '#dbeafe'
      } else if (row % 2 === 1) {
        // 交替行背景色
        backgroundColor = '#f9fafb'
      }
      
      ctx.fillStyle = backgroundColor
      ctx.fillRect(currentX, currentY - dataRowHeight, colWidths[col], dataRowHeight)

      // 设置文字颜色 - 移除首列的特殊文字样式
      if (cellStyle?.backgroundColor) {
        // 如果有自定义背景色，使用深色文字确保可读性
        ctx.fillStyle = '#374151' // 深灰色文字
        ctx.font = `${fontSize}px ${fontFamily}` // 常规字体
      } else {
        ctx.fillStyle = '#374151' // 统一使用深灰色文字
        ctx.font = `${fontSize}px ${fontFamily}` // 统一使用常规字体
      }

      const value = String(getValue(row, col))
      const centerX = currentX + colWidths[col] / 2
      const centerY = currentY - dataRowHeight / 2
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(value, centerX, centerY)

      // 绘制列分隔线
      if (col < props.labels.length - 1) {
        ctx.strokeStyle = '#d1d5db'
        ctx.beginPath()
        ctx.moveTo(currentX + colWidths[col], currentY - dataRowHeight)
        ctx.lineTo(currentX + colWidths[col], currentY)
        ctx.stroke()
      }

      currentX += colWidths[col]
    })

    // 绘制行底部边框
    ctx.strokeStyle = '#d1d5db'
    ctx.beginPath()
    ctx.moveTo(0, currentY)
    ctx.lineTo(totalWidth, currentY)
    ctx.stroke()
  })

  // 绘制外边框
  ctx.strokeStyle = '#d1d5db'
  ctx.strokeRect(0, 0, totalWidth, totalHeight)

  // 绘制水印（密集平铺）- 在所有内容之后绘制
  ctx.save()
  ctx.fillStyle = 'rgba(0, 0, 0, 0.15)' // 增加透明度使水印更明显
  ctx.font = `${16 * scaleFactor}px Arial`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  
  const watermarkText = 'ArknightsVote'
  const watermarkSpacing = 150 * scaleFactor
  const rows = Math.ceil(totalHeight / watermarkSpacing) + 2
  const cols = Math.ceil(totalWidth / watermarkSpacing) + 2
  
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * watermarkSpacing - watermarkSpacing / 2
      const y = row * watermarkSpacing - watermarkSpacing / 2
      ctx.save()
      ctx.translate(x, y)
      ctx.rotate(-Math.PI / 6) // 30度倾斜
      ctx.fillText(watermarkText, 0, 0)
      ctx.restore()
    }
  }
  ctx.restore()

  // 导出图片
  canvas.toBlob((blob) => {
    if (!blob) return
    
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    const filename = typeof props.exportTable === 'string' ? `${props.exportTable}.png` : 'table.png'
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }, 'image/png')
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
        导出图片
      </button>
      <slot name="function" />
    </div>

    <div flex-1 my-2 class="rounded-lg shadow-md border border-gray-200/60 overflow-hidden table-container">
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