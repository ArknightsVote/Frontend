<script setup lang="ts">
const results = [
  { text: '第三次6星强度投票结果(截至艾拉)', to: 'https://github.com/SYadda/Arknights_6Star_Rank_Vote/blob/main/result_V1.3.jpeg' },
  { text: '6星厨力投票结果', to: 'https://nga.178.com/read.php?tid=39828466' },
  { text: '第二次6星强度投票结果(截至锏)', to: 'https://nga.178.com/read.php?tid=38662591' },
  { text: '第一次6星强度投票结果(截至涤火杰西卡)', to: 'https://nga.178.com/read.php?tid=38050985' },
  { text: '萨米收藏品投票结果(不含DLC)', to: 'https://nga.178.com/read.php?tid=38174026' },
]
</script>

<template>
  <Section title="历届结果">
    <ul class="space-y-2">
      <li v-for="(result, index) in results" :key="index" class="flex items-center">
        <span class="w-2 h-2 bg-blue-500 rounded-full mr-3 flex-shrink-0" />
        <AppLink
          :to="result.to"
          class="text-blue-600 hover:text-blue-800 underline hover:no-underline transition-all duration-200"
        >
          {{ result.text }}
        </AppLink>
      </li>
    </ul>
  </Section>
</template>
