<script setup lang="ts">
import type { EChartsOption } from 'echarts'
import type { OperatorTimelineRequest, OperatorTimelineResponse, TimeGranularity } from '@/types/api'
import type { TimeRangeValue } from '@/utils/timeRange'
import { getOperatorTimeline } from '@/api'
import { getOperator } from '@/shared/operator'
import { autoGranularity, GRANULARITY_LABEL, resolveRange } from '@/utils/timeRange'

interface ListItem {
  name: OperatorName
  index: number
}

const { currentTopicId } = useCurrentTopic()

// 干员选择（复用矩阵页的穿梭选择器）；按主题持久化，刷新不丢
const selectedList = useStorage<ListItem[]>(`timeline:ops:${currentTopicId.value}`, [])
const operatorIds = computed(() =>
  selectedList.value
    .map(item => getOperator(item.name)?.id)
    .filter((id): id is number => typeof id === 'number'),
)

// 时间范围：Grafana 风格选择器（持久化）
const timeRange = useStorage<TimeRangeValue>('timeline:trange', {
  kind: 'relative',
  ms: 24 * 3600e3,
  label: '最近 24 小时',
})

// 粒度：由时间跨度自动推导（Grafana 风格，不手动选）
const granularity = computed<TimeGranularity>(() => {
  const { start, end } = resolveRange(timeRange.value)
  return autoGranularity(end.getTime() - start.getTime())
})

// 单次最多干员数：后端下发（超出后端直接报错），前端兜底 10 并提前拦截
const DEFAULT_MAX_OPERATORS = 20
const maxOperators = computed(() => data.value?.data?.max_operators ?? DEFAULT_MAX_OPERATORS)
const operatorOverflow = computed(() => operatorIds.value.length > maxOperators.value)
const canQuery = computed(() => operatorIds.value.length > 0 && !operatorOverflow.value)

const request = computed<OperatorTimelineRequest>(() => {
  const { start, end } = resolveRange(timeRange.value)
  return {
    topic_id: currentTopicId.value,
    start_time: start.toISOString(),
    end_time: end.toISOString(),
    operator_ids: operatorIds.value,
    granularity: granularity.value,
    limit: 2000,
  }
})

const { data, isFetching, execute } = getOperatorTimeline(request)
const hasData = computed(() => (data.value?.data?.timeline?.length ?? 0) > 0)

watchDebounced(
  [operatorIds, timeRange],
  () => {
    if (canQuery.value)
      execute()
  },
  { debounce: 300 },
)

// 类实时刷新：刷新间隔由后端按粒度下发（随每次响应携带），前端仅兜底
const DEFAULT_REFRESH_MS = 15_000
const refreshInterval = computed(() => data.value?.data?.refresh_ms ?? DEFAULT_REFRESH_MS)
const refreshLabel = computed(() => {
  const s = Math.round(refreshInterval.value / 1000)
  return s >= 60 ? `每 ${Math.round(s / 60)} 分钟` : `每 ${s} 秒`
})

const autoRefresh = useStorage('timeline:auto_refresh', false)
const { pause: pauseRefresh, resume: resumeRefresh } = useIntervalFn(
  () => {
    if (canQuery.value)
      execute()
  },
  refreshInterval,
  { immediate: false },
)
watch([autoRefresh, operatorIds], () => {
  if (autoRefresh.value && canQuery.value)
    resumeRefresh()
  else
    pauseRefresh()
}, { immediate: true })

// ECharts（懒加载，仅本页加载）；dataviz 校验过的分类色板（浅色）
const PALETTE = ['#2a78d6', '#1baf7a', '#eda100', '#008300', '#4a3aa7', '#e34948', '#e87ba4', '#eb6834']
const chartEl = ref<HTMLElement>()
const chart = shallowRef<ReturnType<typeof import('echarts').init> | null>(null)

function buildOption(resp: OperatorTimelineResponse['data']): EChartsOption {
  const series = resp.operators.map(op => ({
    name: op.name,
    type: 'line' as const,
    smooth: true,
    showSymbol: false,
    lineStyle: { width: 2 },
    emphasis: { focus: 'series' as const },
    data: resp.timeline.map((p) => {
      const found = p.data.find(d => d.operator_id === op.operator_id)
      return [new Date(p.timestamp).getTime(), found ? Number(found.rate.toFixed(2)) : null]
    }),
  }))

  // 图例分行展示（不翻页）：按干员数估算行数，给顶部留出足够空间
  const legendRows = Math.max(1, Math.ceil(resp.operators.length / 7))
  const gridTop = 24 + legendRows * 26

  return {
    color: PALETTE,
    backgroundColor: 'transparent',
    grid: { left: 8, right: 20, top: gridTop, bottom: 32, containLabel: true },
    tooltip: {
      trigger: 'axis',
      valueFormatter: (v: any) => (v == null ? '-' : `${v}%`),
    },
    // 左对齐，避免增删干员时图例整体左右漂移
    legend: { type: 'plain', top: 8, left: 8, textStyle: { color: '#52514e' } },
    xAxis: {
      type: 'time',
      // 固定到请求的时间窗，保证时间轴按真实比例展示（不随数据稀疏而压缩）
      min: new Date(request.value.start_time).getTime(),
      max: new Date(request.value.end_time).getTime(),
      axisLine: { lineStyle: { color: '#c3c2b7' } },
      axisLabel: { color: '#898781' },
      splitLine: { show: false },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      name: '胜率 %',
      nameTextStyle: { color: '#898781' },
      axisLabel: { color: '#898781', formatter: '{value}' },
      splitLine: { lineStyle: { color: '#e1e0d9' } },
    },
    series,
  }
}

function renderChart() {
  const resp = data.value?.data
  if (chart.value && resp)
    chart.value.setOption(buildOption(resp), { replaceMerge: ['series'] })
}

onMounted(async () => {
  const echarts = await import('echarts')
  if (chartEl.value) {
    chart.value = echarts.init(chartEl.value)
    renderChart()
  }
  // 恢复的选择：进入即拉一次
  if (canQuery.value)
    execute()
})

watch(() => data.value, renderChart)
useResizeObserver(chartEl, () => chart.value?.resize())

onUnmounted(() => {
  chart.value?.dispose()
  chart.value = null
})
</script>

<template>
  <div
    size-full
    flex
    flex-col
    md="flex-row"
    py-4
    gap-4
  >
    <MatrixTransfer
      v-model="selectedList"
      class="card grow-0"
    />

    <div
      md="flex-1 h-full"
      flex
      flex-col
      gap-3
    >
      <!-- 控件 -->
      <div flex items-center gap-4 flex-wrap text-sm>
        <label flex items-center gap-1.5>
          <span text-slate-500>范围</span>
          <TimeRangePicker v-model="timeRange" />
        </label>

        <span text-slate-400>
          粒度 {{ GRANULARITY_LABEL[granularity] }}（自动）
        </span>

        <span v-if="operatorOverflow" text-xs text-amber-600>
          最多选择 {{ maxOperators }} 个干员（当前 {{ operatorIds.length }}）
        </span>

        <label flex items-center gap-1.5 cursor-pointer select-none>
          <input v-model="autoRefresh" type="checkbox" class="accent-indigo-500">
          <span text-slate-500>自动刷新</span>
          <span v-if="autoRefresh" text-xs text-slate-400>{{ refreshLabel }}</span>
        </label>

        <span v-if="isFetching" text-slate-400>载入中…</span>
      </div>

      <!-- 图表区（容器常驻，空态用覆盖层，避免 echarts 在 display:none 上初始化） -->
      <div relative flex-1 min-h-96 class="card">
        <div ref="chartEl" class="w-full h-full min-h-96" />

        <div
          v-if="!operatorIds.length"
          absolute inset-0 flex flex-col items-center justify-center pointer-events-none
        >
          <p text="xl" font-bold>
            还未选择干员~
          </p>
          <p text="sm" text-slate-600>
            将干员名拖动到已选区域即可查看胜率趋势
          </p>
        </div>
        <div
          v-else-if="operatorOverflow"
          class="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/85 backdrop-blur-sm"
        >
          <div class="px-5 py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 font-bold text-lg shadow-sm">
            最多选择 {{ maxOperators }} 个干员
          </div>
          <p text-sm text-slate-500>
            当前已选 {{ operatorIds.length }} 个，请减少后再查看
          </p>
        </div>
        <div
          v-else-if="!hasData && !isFetching"
          absolute inset-0 flex items-center justify-center pointer-events-none
        >
          <p text="lg" text-slate-500>
            暂无趋势数据
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
