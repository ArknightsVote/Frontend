import type {
  GetCandidatePoolRequest,
  GetCandidatePoolResponse,
  GetOperators1v1MatrixRequest,
  GetOperators1v1MatrixResponse,
  GetTopicInfoRequest,
  GetTopicInfoResponse,
  GetTopicListAllResponse,
  NewCompareRequest,
  NewCompareResponse,
  OperatorTimelineRequest,
  OperatorTimelineResponse,
  SaveScoreRequest,
  SaveScoreResponse,
  ViewFinalOrderRequest,
  ViewFinalOrderResponse,
} from '@/types/api'

/**
 * 获取全部主题（含往期/未开始），供选择器/切换器动态展示
 */
export function getAllTopics() {
  return useApi('/topic/list_all')
    .post({})
    .json<GetTopicListAllResponse>()
}

/**
 * 获取新的比较对局
 * @param topicId - 当前投票主题 id
 */
export function newCompare(topicId: MaybeRefOrGetter<string>) {
  const requestData = computed(() => ({
    topic_id: toValue(topicId),
  } satisfies NewCompareRequest))

  return useApi('/ballot/new', { immediate: false })
    .post(requestData)
    .json<NewCompareResponse>()
}

/**
 * 保存投票结果
 * @param data - 包含投票结果与主题信息的参数
 */
export function saveScore(
  data: MaybeRefOrGetter<{
    ballot_id: string
    winner: number
    loser: number
    topic_id: string
    topic_type: string
  }>,
) {
  const requestData = computed(() => {
    const inputData = toValue(data)
    return {
      ballot_id: inputData.ballot_id,
      loser: inputData.loser,
      topic_id: inputData.topic_id,
      winner: inputData.winner,
      topic_type: inputData.topic_type,
    } satisfies SaveScoreRequest
  })

  return useApi('/ballot/save')
    .post(requestData)
    .json<SaveScoreResponse>()
}

/**
 * 获取最终投票结果排序
 * @param topicId - 当前投票主题 id
 */
export function viewFinalOrder(topicId: MaybeRefOrGetter<string>) {
  const requestData = computed(() => ({
    topic_id: toValue(topicId),
  } satisfies ViewFinalOrderRequest))

  return useApi('/results/final_order')
    .post(requestData)
    .json<ViewFinalOrderResponse>()
}

/**
 * 获取候选人池数据
 * @param topicId - 当前投票主题 id
 */
export function getCandidatePool(topicId: MaybeRefOrGetter<string>) {
  const requestData = computed(() => ({
    topic_id: toValue(topicId),
  } satisfies GetCandidatePoolRequest))

  return useApi('/topic/candidate_pool')
    .post(requestData)
    .json<GetCandidatePoolResponse>()
}

/**
 * 获取 1v1 对战矩阵
 * @param topicId - 当前投票主题 id
 */
export function getOperators1v1Matrix(topicId: MaybeRefOrGetter<string>) {
  const requestData = computed(() => ({
    topic_id: toValue(topicId),
  } satisfies GetOperators1v1MatrixRequest))

  return useApi('/results/1v1_matrix')
    .post(requestData)
    .json<GetOperators1v1MatrixResponse>()
}

/**
 * 获取主题信息
 * @param topicId - 目标主题 id
 */
export function getTopicInfo(topicId: MaybeRefOrGetter<string>) {
  const requestData = computed(() => ({
    topic_id: toValue(topicId),
  } satisfies GetTopicInfoRequest))

  return useApi('/topic/info')
    .post(requestData)
    .json<GetTopicInfoResponse>()
}

/**
 * 获取干员胜率时序（趋势），按需 execute
 * @param query - 主题 / 时间范围 / 干员 / 粒度
 */
export function getOperatorTimeline(query: MaybeRefOrGetter<OperatorTimelineRequest>) {
  const requestData = computed(() => toValue(query))

  // timeout：避免后端聚合过慢/连接 stalled 时请求永远挂起（超时会 abort → 触发失败态 → 显示重试）
  return useApi('/results/operator_timeline', { immediate: false, timeout: 15000 })
    .post(requestData)
    .json<OperatorTimelineResponse>()
}
