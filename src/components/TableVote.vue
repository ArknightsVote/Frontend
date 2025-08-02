<script setup lang="ts">
import type { CSSProperties } from 'vue'
import type { TableProps } from './Table.vue'
import { getBestCluster, getNClassesCluster } from '@/utils/getBestCluster'

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
// label: color
// -----------------------------------------

const colors = shallowRef<string[]>([])

const colorLabel: Label = {
  text: '区分度',
  transform(_row: number) {
    return ''
  },
  style(row: number) {
    return {
      backgroundColor: `#${colors.value[row]}`,
      width: '1rem',
    }
  },
}

//
// cluster list
// -----------------------------------------
const nclasses = ref<number | undefined>(undefined)

const clusterKey = computed(() => props.clusterKey || 'rate')

const GVF = ref(0)

function updateClusterData(data: Props['data'], clusterKey: string, nclses?: number) {
  if (!data?.[clusterKey]?.length) {
    if (import.meta.env.DEV) {
      console.error(
        `簇类分析时聚类的列表出错。`,
        `\nkey  : ${clusterKey}`,
        `\nvalue: ${JSON.stringify(data[clusterKey])}`,
      )
    }
  }

  const clusterList = data[clusterKey].map(r => Number.parseFloat(r))
  const res = nclses === undefined
    ? getBestCluster(clusterList)
    : getNClassesCluster(clusterList, nclses)

  colors.value = res.colors
  GVF.value = res.GVF
  nclasses.value = res.nclasses
}

watchOnce(
  () => [props.data],
  () => updateClusterData(props.data, clusterKey.value),
  { immediate: true },
)

const nclassesDebounced = useDebounce(nclasses, 500)
const nclassesRange = [1, 9]
const nclassesTip = ref<string | null>()
watch(nclassesDebounced, (value, oldval) => {
  if (oldval === undefined || value === undefined)
    return

  if (Number.isNaN(value)) {
    nclassesTip.value = '请输入数字'
    return
  }

  if (value < nclassesRange[0] || value > nclassesRange[1]) {
    nclassesTip.value = `范围 ${nclassesRange[0]} ~ ${nclassesRange[1]}`
    return
  }

  if (nclassesTip.value) {
    nclassesTip.value = null
  }
  updateClusterData(props.data, clusterKey.value, value)
})

//
// -----------------------------------------

const showLabels = computed(() => {
  const labels = [orderLabel, ...props.labels]
  if (cupLabel.value) {
    labels.unshift(colorLabel, cupLabel.value)
  }
  return labels
})
const showData = computed(() => props.data)
</script>

<template>
  <Table
    :idkey="idKey"
    :data="showData"
    :labels="showLabels"
    :tbody-style="tbodyStyle"
    :export-table="exportTable"
    :flex-row="true"
    class="text-sm md:text-lg"
  >
    <template #function>
      <div
        mt-4
        pt-6
        card
        space-y-3
      >
        <label for="nclasses" relative>
          分层数:
          <input
            id="nclasses"
            v-model="nclasses"
            type="number"
            min="1"
            max="9"
            un-border
            rounded
            px-2
            outline-none
            class=" in-range:border-green-500 out-of-range:border-red-500 invalid:border-red-500"
          >
          <p
            v-show="nclassesTip"
            class="absolute -translate-y-full right-0 top-0"
            text="red-500 sm"
            pb-1
          >
            {{ nclassesTip }}
          </p>
        </label>
        <p>
          区分度:
          {{ (GVF * 100).toFixed(2) }}%
        </p>
      </div>
    </template>
    <template #caption>
      <div font-bold text-left>
        <slot name="caption" />
      </div>
    </template>
  </Table>
</template>
