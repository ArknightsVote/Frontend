<script setup lang="ts">
import type { CSSProperties } from 'vue'

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
  tbodyStyle?: CSSProperties
}

const props = defineProps<TableProps>()

const trs = computed(() => props.idkey ? props.data[props.idkey] : props.data[Object.keys(props.data)[0]])

function isKeyLabel(label: KeyLabel | TransformLabel): label is KeyLabel {
  return Object.hasOwnProperty.call(label, 'key')
}
</script>

<template>
  <table
    w-full
    table-auto
    border-collapse
    text="center lg"
  >
    <caption caption-top p-4>
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
          py-2
          px-4
          break-keep
        >
          {{ label.text }}
        </th>
      </tr>
    </thead>
    <tbody :style="tbodyStyle">
      <slot name="tbody">
        <tr
          v-for="(k, col) in trs"
          :key="idkey ? k : col"
          odd="bg-slate-200/50"
          even="bg-slate-100/70"
        >
          <td
            v-for="(label, index) in labels"
            :key="index"
            py-2
            px-4
            break-keep
          >
            {{ isKeyLabel(label) ? data[label.key][col] : label.transform(col) }}
          </td>
        </tr>
      </slot>
    </tbody>
  </table>
</template>
