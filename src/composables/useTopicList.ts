import type { TopicInfo } from '@/utils/topicStatus'
import { getAllTopics } from '@/api'
import { topicStatusText } from '@/utils/topicStatus'

export type TopicStatus = ReturnType<typeof topicStatusText>

export interface TopicListItem extends TopicInfo {
  /** 展示用状态：进行中 / 未开始 / 已结束 */
  status: TopicStatus
  /** 是否可投票（后端权威 is_active） */
  isActive: boolean
}

// 展示排序：进行中 → 未开始 → 已结束
const STATUS_ORDER: Record<TopicStatus, number> = {
  '进行中': 0,
  '未开始': 1,
  '已结束': 2,
  '': 3,
}

// 模块级单例缓存：落地选择页与导航切换器共用
const topics = ref<TopicListItem[]>([])
const isLoading = ref(false)
const isLoaded = ref(false)

/**
 * 主题列表：一次性从后端 /topic/list_all 拉取全部主题（含往期/未开始），
 * 标注状态后按状态排序。
 */
export function useTopicList() {
  async function load(force = false) {
    if (isLoading.value)
      return
    if (isLoaded.value && !force)
      return

    isLoading.value = true
    try {
      const res = await getAllTopics()
      // 测试主题仅在 dev 前端展示（后端也仅在 debug 构建注入它）
      const list = (res.data.value?.data?.topics ?? [])
        .filter(info => import.meta.env.DEV || info.id !== TEST_TOPIC_ID)

      const items = list.map((info): TopicListItem => ({
        ...info,
        status: topicStatusText(info),
        isActive: info.is_active,
      }))

      items.sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status])
      topics.value = items
      isLoaded.value = true
    }
    finally {
      isLoading.value = false
    }
  }

  return {
    topics,
    isLoading,
    isLoaded,
    load,
  }
}
