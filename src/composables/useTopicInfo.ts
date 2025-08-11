import { getTopicInfo } from '@/api'

/**
 * 主题信息管理 composable
 */
export function useTopicInfo() {
  const { data } = getTopicInfo()

  const topicInfo = computed(() => data.value?.data)

  // 格式化时间显示
  const formatTime = (timeString: string) => {
    try {
      const date = new Date(timeString)
      return date.toLocaleDateString('zh-CN', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    }
    catch {
      return timeString
    }
  }

  // 投票时间范围文本
  const votingPeriod = computed(() => {
    if (!topicInfo.value)
      return ''

    const openTime = formatTime(topicInfo.value.open_time)
    const closeTime = formatTime(topicInfo.value.close_time)
    return `${openTime} ~ ${closeTime}`
  })

  // 判断投票是否进行中
  const isVotingActive = computed(() => {
    if (!topicInfo.value)
      return false

    const now = new Date()
    const openTime = new Date(topicInfo.value.open_time)
    const closeTime = new Date(topicInfo.value.close_time)

    return now >= openTime && now <= closeTime
  })

  return {
    topicInfo,
    votingPeriod,
    isVotingActive,
  }
}
