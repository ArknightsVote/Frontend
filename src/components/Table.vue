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

    <div flex-1 my-2 class="bg-white/90 backdrop-blur-sm rounded-lg shadow-md border border-gray-200/60 overflow-hidden">
      <table
        w-full
        table-auto
        border-collapse
        text="center"
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
</template>
