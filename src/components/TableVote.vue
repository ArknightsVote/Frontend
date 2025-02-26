<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { TableProps } from './Table.vue'
import { getBestCluster } from '@/utils/getBestCluster'
import { getColors } from '@/utils/getColors'

type Label = TableProps['labels'][number]

interface Props {
  data: Record<string, any[]>
  labels: TableProps['labels']
  /**
   * data 的 key
   * @default 'rate'
   */
  clusterKey?: string

  idKey: string
  tbodyStyle?: CSSProperties

  exportTable?: boolean | string
}

const props = defineProps<Props>()
//
// label: order
// -----------------------------------------

const orderLabel: Label = {
  text: '排名',
  transform: (row: number) => row + 1,
}

//
// label: cup level
// -----------------------------------------
const cupLevels = ['超大杯上', '超大杯中', '超大杯下', '大杯上', '大杯中', '大杯下', '中杯上', '中杯中', '中杯下']
const cupLabel = computed(() => {
  const dataLength = props.data[props.idKey]?.length
  if (!dataLength)
    return

  const count = Math.ceil(dataLength / cupLevels.length)

  return {
    text: '杯级',
    transform(row: number) {
      return cupLevels[Math.floor(row / count)]
    },
  }
})

//
// -----------------------------------------

const showLables = computed(() => {
  const labels = [orderLabel, ...props.labels]
  if (cupLabel.value) {
    labels.unshift(cupLabel.value)
  }
  return labels
})
const showData = computed(() => props.data)

//
// cluster list
// -----------------------------------------

const clusterKey = computed(() => props.clusterKey || 'rate')

const GVF = ref(0)
const colors = shallowRef<string[]>([])

function updateCluster(data: Props['data'], clusterKey: string) {
  if (!data?.[clusterKey]?.length) {
    if (__DEV__) {
      console.error(
        `簇类分析时聚类的列表出错。`,
        `\nkey  : ${clusterKey}`,
        `\nvalue: ${JSON.stringify(data[clusterKey])}`,
      )
    }
    return false
  }

  const clusterList = data[clusterKey].map(r => Number.parseFloat(r))
  const { data: items, GVF: gvf } = getBestCluster(clusterList)

  colors.value = getColors(items.reverse())
  GVF.value = gvf

  return true
}

watch(
  () => [props.data, clusterKey],
  () => updateCluster(props.data, clusterKey.value),
  { immediate: true },
)
</script>

<template>
  <Table
    :idkey="idKey"
    :data="showData"
    :labels="showLables"
    :tbody-style="tbodyStyle"
    :export-table="exportTable"
    class="text-lg"
  >
    <template #caption>
      <div flex justify-between text-left>
        <div flex-1 font-bold>
          <slot name="caption" />
        </div>
        <span inline-block ml-auto mr-0>
          区分度:
          {{ (GVF * 100).toFixed(2) }}%
        </span>
      </div>
    </template>
    <template #tbody="{ getValue, idColItems }">
      <tr
        v-for="(idkey, row) in idColItems"
        :key="idkey"
        :style="{
          backgroundColor: `#${colors[row]}aa`,
        }"
      >
        <td
          v-for="(label, col) in showLables"
          :key="label.text"
          py-2
        >
          {{ getValue(row, col) }}
        </td>
      </tr>
    </template>
  </Table>
</template>
