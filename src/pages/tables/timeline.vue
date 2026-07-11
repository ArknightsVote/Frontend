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

const { data, isFetching, execute, error, aborted } = getOperatorTimeline(request)
const hasData = computed(() => (data.value?.data?.timeline?.length ?? 0) > 0)

// 15s 内最多请求一次（leading 立即、trailing 收尾），硬性限流减轻后端压力
const throttledFetch = useThrottleFn(() => {
  if (canQuery.value)
    execute()
}, 15000)

// 选择/范围变化：先 300ms 合并快速改动，再走 15s 节流
watchDebounced([operatorIds, timeRange], throttledFetch, { debounce: 300 })

// 失败检测：后端错误以 HTTP 200 + { status != 200 } 信封下发（含 429 限流），
// 传输层错误则走 error；两者都用手动「重试」按钮恢复，不自动重试
const failed = computed(() =>
  !isFetching.value
  && (!!error.value || aborted.value || (data.value?.status != null && data.value.status !== 200)))
const failMessage = computed(() => {
  if (error.value || aborted.value)
    return '请求超时或网络错误，请重试'
  const s = data.value?.status
  return s != null && s !== 200 ? (data.value?.message || `请求失败 (${s})`) : ''
})
function retry() {
  if (canQuery.value)
    execute() // 手动重试绕过 15s 节流
}

// ECharts（懒加载，仅本页加载）；dataviz 校验过的分类色板（浅色）
const PALETTE = ['#2a78d6', '#1baf7a', '#eda100', '#008300', '#4a3aa7', '#e34948', '#e87ba4', '#eb6834']
const chartEl = ref<HTMLElement>()
const chart = shallowRef<ReturnType<typeof import('echarts').init> | null>(null)

// 估算底部图例的实际换行行数：用 canvas 量文字宽度模拟 echarts plain 图例的排布，
// 比“干员数 / 每行固定值”准确，避免底部预留过多、图例与图表本体间空隙过大。
let legendMeasureCtx: CanvasRenderingContext2D | null = null
function countLegendRows(names: string[], width: number): number {
  if (!names.length)
    return 1
  legendMeasureCtx ??= document.createElement('canvas').getContext('2d')
  if (!legendMeasureCtx)
    return Math.max(1, Math.ceil(names.length / 7)) // 拿不到 canvas 时退回粗略估算
  legendMeasureCtx.font = '12px sans-serif'
  const ICON = 25 // legend.itemWidth 默认值
  const ICON_TEXT_GAP = 5 // 图标与文字间距（echarts 固定）
  const ITEM_GAP = 10 // legend.itemGap 默认值
  const avail = Math.max(1, width - 8 - 12) // 减去 legend.left 与内边距/安全余量
  let x = 0
  let rows = 1
  for (const name of names) {
    const w = ICON + ICON_TEXT_GAP + legendMeasureCtx.measureText(name).width
    if (x > 0 && x + w > avail) {
      rows++
      x = 0
    }
    x += w + ITEM_GAP
  }
  return rows
}

// 底部预留高度：每行约 21px + 一个固定小间距，随实际行数收紧
function legendGridBottom(names: string[]): number {
  const width = chart.value?.getWidth() ?? 720
  return 12 + countLegendRows(names, width) * 21
}

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

  // 图例移到底部（不翻页）：按实际换行行数收紧底部预留，避免与图表本体空隙过大
  const gridBottom = legendGridBottom(resp.operators.map(op => op.name))

  return {
    color: PALETTE,
    backgroundColor: 'transparent',
    grid: { left: 8, right: 20, top: 30, bottom: gridBottom, containLabel: true },
    tooltip: {
      trigger: 'axis',
      valueFormatter: (v: any) => (v == null ? '-' : `${v}%`),
    },
    // 底部左对齐，避免增删干员时图例整体左右漂移
    legend: { type: 'plain', bottom: 0, left: 8, textStyle: { color: '#52514e' } },
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
    throttledFetch()
})

watch(() => data.value, renderChart)

// 宽度变化会改变图例换行行数，需同步底部预留（否则空隙随窗口宽度错位）
let lastLegendBottom = -1
function syncLegendGrid() {
  const names = data.value?.data?.operators?.map(op => op.name)
  if (!chart.value || !names?.length)
    return
  const bottom = legendGridBottom(names)
  if (bottom === lastLegendBottom)
    return
  lastLegendBottom = bottom
  chart.value.setOption({ grid: { bottom } })
}
useResizeObserver(chartEl, () => {
  chart.value?.resize()
  syncLegendGrid()
})

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
          v-else-if="failed"
          class="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-white/85 backdrop-blur-sm"
        >
          <p text-slate-600>
            {{ failMessage }}
          </p>
          <button class="btn" @click="retry">
            重试
          </button>
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
