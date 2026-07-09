import type { TopicInfoData } from '@/types/api'

export type TopicInfo = TopicInfoData

type TopicStatusInput =
  & Pick<TopicInfoData, 'open_time' | 'close_time'>
  & Partial<Pick<TopicInfoData, 'is_active'>>

/**
 * 主题当前是否可投票。优先使用后端权威 `is_active`，
 * 缺省时退回 open_time <= now <= close_time 判断。
 */
export function isTopicVotingActive(info?: TopicStatusInput | null): boolean {
  if (!info)
    return false

  if (typeof info.is_active === 'boolean')
    return info.is_active

  const now = Date.now()
  const open = new Date(info.open_time).getTime()
  const close = new Date(info.close_time).getTime()
  return now >= open && now <= close
}

/**
 * 主题状态文案：未开始 / 进行中 / 已结束
 */
export function topicStatusText(info?: TopicStatusInput | null): '未开始' | '进行中' | '已结束' | '' {
  if (!info)
    return ''

  const now = Date.now()
  const open = new Date(info.open_time).getTime()
  const close = new Date(info.close_time).getTime()

  // 有后端权威 is_active 时以其为准
  if (info.is_active === true)
    return '进行中'
  if (info.is_active === false)
    return now < open ? '未开始' : '已结束'

  // 未提供 is_active：退回纯时间窗口判断
  if (now < open)
    return '未开始'
  if (now > close)
    return '已结束'
  return '进行中'
}
