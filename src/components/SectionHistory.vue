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
    <ul>
      <li v-for="(result, index) in results" :key="index">
        <AppLink :to="result.to">
          {{ result.text }}
        </AppLink>
      </li>
    </ul>
  </Section>
</template>
