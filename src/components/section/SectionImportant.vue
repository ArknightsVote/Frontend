<script setup lang="ts">
import { useTopicInfo } from '@/composables/useTopicInfo'
import { topicStatusText } from '@/utils/topicStatus'

const { currentTopicId } = useCurrentTopic()
const { topicInfo, votingPeriod } = useTopicInfo(currentTopicId)

const status = computed(() => topicStatusText(topicInfo.value))

const banner = computed(() => {
  switch (status.value) {
    case '进行中':
      return { cls: 'bg-green-500/90 text-white', text: '投票进行中，快来参与吧！' }
    case '未开始':
      return { cls: 'bg-blue-500/90 text-white', text: '投票尚未开始，敬请期待！' }
    case '已结束':
      return { cls: 'bg-yellow-500/90 text-white', text: '本次投票已结束，最终结果稍后公布。' }
    default:
      return { cls: 'bg-gray-500/90 text-white', text: '' }
  }
})
</script>

<template>
  <Section>
    <div class="text-center space-y-3">
      <div class="bg-red-500/90 text-white px-4 py-3 rounded-lg shadow-md">
        <p class="font-bold text-lg">
          {{ topicInfo?.name || '投票活动' }}正式投票 {{ votingPeriod }}
        </p>
      </div>

      <div
        v-if="banner.text"
        class="px-4 py-3 rounded-lg shadow-md"
        :class="banner.cls"
      >
        <p class="font-bold">
          {{ banner.text }}
        </p>
      </div>
    </div>
  </Section>
</template>
