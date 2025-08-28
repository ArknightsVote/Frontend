/**
 * @example
 *
 * ```js
 * // Basic
 * const { update, operator } = useOperator()
 * console.log(operator)                  // { name: undefined, id: undefined, avatar: undefined }
 *
 * // use name
 * update("荒芜拉普兰德")                 // { name: "荒芜拉普兰德", ... }
 *
 * // use id
 * update(4026)                           // { name: "忍冬", ... }
 *
 * // Initial data
 * const { update, operator } = useOperator("荒芜拉普兰德")
 * console.log(operator)                  // { name: "荒芜拉普兰德", ... }
 * ```
 */
export function useOperator(target?: string | number) {
  const nameRef = ref(ensureOperatorName(target))

  const operator = reactive<Partial<Operator>>({})

  async function update(name?: string) {
    if (name) {
      try {
        const data = await getOperator(name)
        if (data) {
          operator.name = data.name
          operator.id = data.id
          operator.avatar = data.avatar
        }
        else {
          // 清空数据
          operator.name = undefined
          operator.id = undefined
          operator.avatar = undefined
        }
      }
      catch (error) {
        console.warn('Failed to get operator:', error)
        // 清空数据
        operator.name = undefined
        operator.id = undefined
        operator.avatar = undefined
      }
    }
    else {
      // 清空数据
      operator.name = undefined
      operator.id = undefined
      operator.avatar = undefined
    }
  }

  watch(nameRef, update, { immediate: true })

  return {
    update: (target?: number | string) => (nameRef.value = ensureOperatorName(target)),
    operator: readonly(operator),
  }
}
