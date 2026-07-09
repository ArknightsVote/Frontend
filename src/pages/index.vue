<script setup lang="ts">
const { currentTopicId } = useCurrentTopic()
</script>

<template>
  <TopicSelect v-if="!currentTopicId" />
  <TopicVoteHome v-else />
</template>
