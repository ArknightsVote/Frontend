<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { TableProps } from './Table.vue'
import { getBestCluster } from '@/utils/getBestCluster'
import { getColors } from '@/utils/getColors'

interface Props {
  data: Record<string, any[]>
  labels: TableProps['labels']
  /**
   * data 的 key
   * @default 'rate'
   */
  clusterKey?: string
  tbodyStyle?: CSSProperties
}

const props = defineProps<Props>()
const clusterKey = computed(() => props.clusterKey || 'rate')
const cupLevels = ['超大杯上', '超大杯中', '超大杯下', '大杯上', '大杯中', '大杯下', '中杯上', '中杯中', '中杯下']

const GVF = ref(0)
const colors = shallowRef<string[]>([])
const showLables = shallowRef<TableProps['labels']>([])
const showData = shallowRef<Props['data']>({})

//
// order
// -----------------------------------------

const orderLabel = {
  text: '排名',
  transform: (i: number) => i + 1,
//   style: { width: '5em' },
}

//
// cup level
// -----------------------------------------

const cupLabel = {
  text: '杯级',
  key: 'cup',
//   style: {
//     width: '6em',
//   },
}

function buildCupData(clusterItems: any[]) {
  const data: any[] = []
  clusterItems.forEach((items, i) => {
    items.forEach(() => {
      data.push(cupLevels[i])
    })
  })

  return {
    cup: data,
  }
}

//
// -----------------------------------------
function updateLabels() {
  showLables.value = [
    cupLabel,
    orderLabel,
    ...props.labels,
  ]
}

function updateData(clusterItems: any[]) {
  showData.value = { ...buildCupData(clusterItems), ...props.data }
}

//
// -----------------------------------------

watchEffect(() => {
  const data = props.data
  if (!data?.[clusterKey.value])
    return

  const clusterList = data[clusterKey.value].map(r => Number.parseFloat(r))
  const { data: items, GVF: gvf } = getBestCluster(clusterList)

  colors.value = getColors(items.reverse())
  GVF.value = gvf

  updateLabels()
  updateData(items)
})

function getValueByPos(col: number, label: TableProps['labels'][number]) {
  if ('key' in label) {
    return showData.value[label.key][col]
  }
  else {
    return label.transform ? label.transform(col) : ''
  }
}
</script>

<template>
  <Table
    :data="showData"
    :labels="showLables"
    :tbody-style="tbodyStyle"
    bg-slate-100
  >
    <template #caption>
      <div flex justify-between text-left>
        <div flex-1 text-indigo-500 text-bold>
          <slot name="caption" />
        </div>
        <span inline-block ml-auto mr-0 bg-indigo-500 py-2 px-4 rounded-lg text-slate-50>
          区分度:
          {{ (GVF * 100).toFixed(2) }}%
        </span>
      </div>
    </template>
    <template #tbody>
      <tr
        v-for="(_, col) in showData[clusterKey]"
        :key="col"
        :style="{
          backgroundColor: `#${colors[col]}aa`,
        }"
      >
        <td
          v-for="(label, index) in showLables"
          :key="index"
          :style="label.style"
          py-2
        >
          {{ getValueByPos(col, label) }}
        </td>
      </tr>
    </template>
  </Table>
</template>
