/**
 * 时间范围模型（Grafana 风格）：相对（now-ms → now，随时间滑动）或绝对（固定 from/to）。
 */
export interface RelativeRange {
  kind: 'relative'
  ms: number
  label: string
}
export interface AbsoluteRange {
  kind: 'absolute'
  /** datetime-local 字符串（本地时区），如 2026-07-09T10:30 */
  from: string
  to: string
}
export type TimeRangeValue = RelativeRange | AbsoluteRange

const MIN = 60e3
const HOUR = 3600e3
const DAY = 24 * HOUR

export const QUICK_RANGES: RelativeRange[] = [
  { kind: 'relative', ms: 5 * MIN, label: '最近 5 分钟' },
  { kind: 'relative', ms: 15 * MIN, label: '最近 15 分钟' },
  { kind: 'relative', ms: 30 * MIN, label: '最近 30 分钟' },
  { kind: 'relative', ms: HOUR, label: '最近 1 小时' },
  { kind: 'relative', ms: 3 * HOUR, label: '最近 3 小时' },
  { kind: 'relative', ms: 6 * HOUR, label: '最近 6 小时' },
  { kind: 'relative', ms: 12 * HOUR, label: '最近 12 小时' },
  { kind: 'relative', ms: DAY, label: '最近 24 小时' },
  { kind: 'relative', ms: 2 * DAY, label: '最近 2 天' },
  { kind: 'relative', ms: 7 * DAY, label: '最近 7 天' },
]

/** 解析为具体的起止时间。相对范围以“现在”为终点滑动。 */
export function resolveRange(v: TimeRangeValue): { start: Date, end: Date } {
  if (v.kind === 'relative')
    return { start: new Date(Date.now() - v.ms), end: new Date() }
  return { start: new Date(v.from), end: new Date(v.to) }
}

/**
 * 根据时间跨度自动推导粒度（Grafana 风格，无需手动选）。
 * 控制点数在合理范围内：秒仅用于 ≤30min。
 */
export function autoGranularity(spanMs: number): 'second' | 'minute' | 'hour' | 'day' {
  if (spanMs <= 30 * MIN)
    return 'second'
  if (spanMs <= 24 * HOUR)
    return 'minute'
  if (spanMs <= 30 * DAY)
    return 'hour'
  return 'day'
}

export const GRANULARITY_LABEL: Record<'second' | 'minute' | 'hour' | 'day', string> = {
  second: '秒',
  minute: '分钟',
  hour: '小时',
  day: '天',
}

/** 触发按钮上的展示文案。 */
export function rangeLabel(v: TimeRangeValue): string {
  if (v.kind === 'relative')
    return v.label
  return `${v.from.replace('T', ' ')} → ${v.to.replace('T', ' ')}`
}

/** Date → datetime-local 字符串（本地时区）。 */
export function toLocalInput(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`
}
