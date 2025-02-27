<template>
  <div
    w-full
    flex
    flex-col
    gap-6
    container
    mx-auto
    p="x-4 y-8"
    lg="flex-row items-center justify-center flex-wrap"
    xl="size-full py-0 flex-nowrap"
  >
    <div
      class="flex flex-col items-center"
      lg="order-1 flex-2/4"
      xl="order-2 flex-1"
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
      flex flex-col gap-2
      lg="order-2 flex-1/4"
      xl="order-3"
    >
      <SectionImportant />
      <SectionRule />
      <SectionWarning />
    </div>

    <div
      flex flex-col gap-2
      lg="order-3 shrink-0"
      xl="order-1 flex-1/4"
    >
      <SectionAdditional />
      <SectionHistory />
      <SectionThanks />
    </div>
  </div>
</template>
