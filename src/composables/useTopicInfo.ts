import { getTopicInfo } from '@/api'
import { isTopicVotingActive } from '@/utils/topicStatus'

/**
 * 主题信息管理 composable
 * @param topicId - 目标主题 id
 */
export function useTopicInfo(topicId: MaybeRefOrGetter<string>) {
  const { data } = getTopicInfo(topicId)

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
  const isVotingActive = computed(() => isTopicVotingActive(topicInfo.value))

  return {
    topicInfo,
    votingPeriod,
    isVotingActive,
  }
}
