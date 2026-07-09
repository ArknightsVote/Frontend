/**
 * 当前投票主题（以 URL query `?topic=` 为真源）
 */
export function useCurrentTopic() {
  const route = useRoute()
  const router = useRouter()

  // 上次选择的主题，仅用于持久化/预选，不作为真源
  const lastTopic = useStorage(STORAGE_KEYS.LAST_TOPIC, '')

  const currentTopicId = computed(() => {
    const q = route.query.topic
    return typeof q === 'string' ? q : ''
  })

  /**
   * 选择/切换主题：写入 URL query 并持久化
   */
  function setTopic(id: string) {
    lastTopic.value = id
    router.push({ path: route.path, query: { ...route.query, topic: id } })
  }

  /**
   * 清除主题选择，回到落地选择页
   */
  function clearTopic() {
    router.push({ path: '/', query: {} })
  }

  return {
    currentTopicId,
    setTopic,
    clearTopic,
    lastTopic,
  }
}
