<template>
  <Section title="规则">
    <p>
      每次投票，得票+1分，未得票-1分，最后统计所有干员的胜率和得分，以胜率排名。
    </p>

    <p>
      每个ip只能投100票，自第101票起，每票按0.01票计算权重。
    </p>

    <p>
      自己的投票结果，不受100票限制，但网页刷新/关闭时会清零。
    </p>
  </Section>
</template>