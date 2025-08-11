interface LocalVoteItem {
  win_times: number
  lose_times: number
  scores: number
  vote_times: number
  win_rate: number
}

type LocalVoteData = Record<Operator['name'], LocalVoteItem>

export function useLocalVote() {
  const data = useStorage(STORAGE_KEYS.VOTE_RESULT, {} as LocalVoteData)

  /**
   * 创建数据项，确保类型一致
   */
  function createVoteItem(item: Partial<LocalVoteItem> = {}): LocalVoteItem {
    return { win_times: 0, lose_times: 0, scores: 0, vote_times: 0, win_rate: -1, ...item }
  }

  function getVoteItem(name: OperatorName) {
    return data.value[name] || createVoteItem()
  }

  function updateData(name: OperatorName, item: Partial<LocalVoteItem>) {
    const opter = data.value[name] || createVoteItem()
    data.value = { ...data.value, [name]: { ...opter, ...item } }
  }

  /**
   * 投票后，更新胜方数据
   */
  function assignWinner(name: OperatorName) {
    const opter = getVoteItem(name)
    updateData(name, {
      vote_times: opter.vote_times + 1,
      win_times: opter.win_times + 1,
      scores: opter.scores + 1,
      win_rate: Number.parseFloat((((opter.win_times + 1) / (opter.vote_times + 1)) * 100).toFixed(2)),
    })
  }

  /**
   * 投票后，更新败方数据
   */
  function assignLoser(name: OperatorName) {
    const opter = getVoteItem(name)
    updateData(name, {
      vote_times: opter.vote_times + 1,
      lose_times: opter.lose_times + 1,
      scores: opter.scores - 1,
      win_rate: Number.parseFloat(((opter.win_times / (opter.vote_times + 1)) * 100).toFixed(2)),
    })
  }

  return {
    data,
    assignWinner,
    assignLoser,
  }
}
