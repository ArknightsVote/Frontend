<script setup lang="ts">
import { useTopicInfo } from '@/composables/useTopicInfo'

const { topicInfo, votingPeriod, isVotingActive, isVotingOpen } = useTopicInfo()
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
        :class="[
          'px-4 py-3 rounded-lg shadow-md',
          !isVotingOpen 
            ? 'bg-blue-500/90 text-white'
            : isVotingActive 
              ? 'bg-green-500/90 text-white' 
              : 'bg-yellow-500/90 text-white'
        ]"
      >
        <p class="font-bold">
          <span v-if="!isVotingOpen">
            投票尚未开放，敬请期待！
          </span>
          <span v-else-if="isVotingActive">
            投票进行中，快来参与吧！
          </span>
          <span v-else>
            本次投票已结束，最终结果稍后公布。
          </span>
        </p>
      </div>
    </div>
  </Section>
</template>
