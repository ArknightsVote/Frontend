<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { exportXLSX } from '@/utils/exportXlsx'

interface KeyLabel {
  text: string
  key: string
  style?: CSSProperties
}

interface TransformLabel {
  text: string
  transform: (col: number) => string | number
  style?: CSSProperties
}

export interface TableProps {
/**
 * labels 中的 key 对应 data 中的 key
 *
 * @example
 *
 * ```ts
 * const data = { names: [] }
 * const labels = [ { key: 'names', text: '干员' } ]
 *
 * // 提供 transform 生成的数据列可以不在 data 中
 * const labels = [ { text: '序号', transform: (col) => col + 1 } ]
 * ```
 */
  data: Record<string, any[]>
  labels: (KeyLabel | TransformLabel)[]

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
   * 如果是字符串，该字符串作为文件名
   */
  exportTable?: boolean | string
}

const props = defineProps<TableProps>()

// 唯一标识列
const idColItems = computed(() => props.idkey ? props.data[props.idkey] : props.data[Object.keys(props.data)[0]])

function isKeyLabel(label: KeyLabel | TransformLabel): label is KeyLabel {
  return Object.hasOwnProperty.call(label, 'key')
}

function getValue(row: number, col: number) {
  const label = props.labels[col]
  return isKeyLabel(label) ? props.data[label.key][row] : label.transform(row)
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
  <div>
    <div v-if="exportTable" p-2 text-right>
      <button btn @click="exportData">
        导出
      </button>
    </div>

    <table
      w-full
      table-auto
      border-collapse
      text="center"
    >
      <caption v-if="$slots.caption" caption-top px-4 py-2>
        <slot name="caption" />
      </caption>
      <thead
        sticky
        top-0
      >
        <tr bg-indigo-500 text-white>
          <th
            v-for="label in labels"
            :key="label.text"
            p-2
            break-keep
            whitespace-nowrap
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
            odd="bg-indigo-100/60"
            even="bg-indigo-200/60"
          >
            <td
              v-for="(label, col) in labels"
              :key="label.text"
              p-2
              break-keep
              whitespace-nowrap
              :style="label.style"
              :class="fixIndex ? 'first:sticky first:left-0 z-1 first:bg-indigo-400 first:text-white' : ''"
            >
              {{ getValue(row, col) }}
            </td>
          </tr>
        </slot>
      </tbody>
    </table>
  </div>
</template>
