<template>
  <div
    w-full
    flex
    flex-col
    gap-6
    p="x-4 y-8"
    lg="items-center justify-center flex-wrap"
  >
    <div
      class="flex flex-col items-center"
    >
      <SiteTitle
        pb-2
        leading-tight
        text="5xl center"
        class="w-[6em]"
        mx-auto
      />
      <OperatorVote>
        <template #bottom>
          <Nav />
        </template>
      </OperatorVote>
    </div>

    <div
      flex flex-col gap-2 w-full
    >
      <SectionImportant />
      <SectionRule />
      <SectionWarning />
    </div>

    <div
      flex flex-col gap-2 w-full
    >
      <SectionAdditional />
      <SectionHistory />
      <SectionThanks />
    </div>
  </div>
</template>
