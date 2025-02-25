<template>
  <div class="flex flex-col items-center justify-center size-full">
    <SiteTitle
      pb-8
      leading-tight
      text="5xl center"
      class="w-[6em]"
    />
    <OperatorVote>
      <template #bottom>
        <Nav />
      </template>
    </OperatorVote>
  </div>
</template>
