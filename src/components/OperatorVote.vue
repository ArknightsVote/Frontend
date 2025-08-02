<script setup lang='ts'>
import { newCompare as apiNewCompare, saveScore as apiSaveScore } from '@/api'

const { current: currentVote, voteFor, pushVote, popVote } = useVoteQueue<Operator>()

// resource
// -----------------------------------------------------------
const code = useStorage(STORAGE_KEYS.VOTE_CODE, '000')

const compareBody = computed(() => {
  return {
    code: code.value,
  }
})

const {
  data,
  isFetching: newCompareIsFetching,
  onFetchResponse,
  onFetchError,
  execute: loadVote,
} = apiNewCompare(compareBody)

/**
 * 切换对比的干员
 */
function skipCurrentVote() {
  popVote()
  loadVote()
}

onFetchResponse(() => {
  if (!data.value)
    return

  const opter1 = findOperator(data.value.left)
  const opter2 = findOperator(data.value.right)

  if (opter1 && opter2) {
    pushVote([opter1, opter2])
  }
  else {
    console.error(
      '未找到对应的干员',
      data.value.left,
      data.value.right,
    )
  }

  code.value = data.value.code
})

const errorTimes = ref(0)
onFetchError(() => {
  if (errorTimes.value > 0) {
    errorTimes.value = 0
    return
  }
  errorTimes.value++
  loadVote()
})

onMounted(() => {
  loadVote()
})

// vote local
// -----------------------------------------------------------

const { assignWinner, assignLoser } = useLocalVote()

const voteTimes = useStorage(STORAGE_KEYS.VOTE_TIMES, 0)
function updateLocalVote(winnerName: OperatorName, loserName: OperatorName) {
  assignWinner(winnerName)
  assignLoser(loserName)

  voteTimes.value++
}

// vote server
// -----------------------------------------------------------

async function upLoadVote(winnerId: number, loserId: number) {
  return apiSaveScore({
    code: code.value,
    win_id: winnerId,
    lose_id: loserId,
  })
}

// vote
// -----------------------------------------------------------

async function voteForWinner(winnerIndex: number) {
  if (!currentVote.value)
    return

  const opter1 = currentVote.value[0]
  const opter2 = currentVote.value[1]

  const [winner, loser] = winnerIndex === 0 ? [opter1, opter2] : [opter2, opter1]

  // FIXME: 暂忽略是否上传成功
  upLoadVote(winner.id, loser.id).finally(async () => {
    updateLocalVote(winner.name, loser.name)

    await loadVote()

    nextTick(() => {
      voteFor(winnerIndex)
    })
  })
}
</script>

<template>
  <div class="w-full">
    <slot name="top" />

    <!-- 投票区域 - 主要功能 -->
    <div class="flex flex-row gap-6 sm:gap-10 lg:gap-14 items-center justify-center mb-8 relative">
      <OperatorAvatar
        :target="currentVote?.[0].name"
        class="cursor-pointer transform transition-transform duration-200 touch-manipulation"
        @click="voteForWinner(0)"
      />

      <!-- 换一组按钮 - 放在两个角色之间 -->
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
        <button
          class="w-10 h-10 bg-white/80 hover:bg-white backdrop-blur-sm border border-gray-200 text-gray-600 hover:text-gray-800 rounded-full shadow-md hover:shadow-lg active:shadow-inner transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation transform hover:scale-110 active:scale-95 flex items-center justify-center"
          :disabled="newCompareIsFetching"
          @click="skipCurrentVote"
        >
          <svg v-if="newCompareIsFetching" class="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      <OperatorAvatar
        :target="currentVote?.[1].name"
        class="cursor-pointer transform transition-transform duration-200 touch-manipulation"
        @click="voteForWinner(1)"
      />
    </div>
  </div>
</template>
