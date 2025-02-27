export function newCompare(data: MaybeRefOrGetter<{ code: string }>) {
  return useApi<{
    left: number
    right: number
    code: string
  }>('/new_compare', { immediate: false })
    .post(data)
    .json()
}

export function saveScore(data: MaybeRefOrGetter<{ code: string, win_id: number, lose_id: number }>) {
  return useApi('/save_score').post(data)
}

export function viewFinalOrder() {
  return useApi('/view_final_order').get().json()
}

export function getOperators1v1Matrix() {
  return useApi<number[][]>('/get_operators_1v1_matrix').post().json()
}
