import type {
  GetCandidatePoolRequest,
  GetCandidatePoolResponse,
  GetOperators1v1MatrixRequest,
  GetOperators1v1MatrixResponse,
  GetTopicInfoRequest,
  GetTopicInfoResponse,
  NewCompareRequest,
  NewCompareResponse,
  SaveScoreRequest,
  SaveScoreResponse,
  ViewFinalOrderRequest,
  ViewFinalOrderResponse,
} from '@/types/api'
import { TOPIC_ID, TOPIC_TYPE } from '@/constants/topic'

/**
 * 获取新的比较对局
 */
export function newCompare() {
  const requestData = computed(() => ({
    topic_id: TOPIC_ID,
  } satisfies NewCompareRequest))

  return useApi<NewCompareResponse>('/ballot/new', { immediate: false })
    .post(requestData)
    .json()
}

/**
 * 保存投票结果
 * @param data - 包含投票结果的参数
 */
export function saveScore(data: MaybeRefOrGetter<{ ballot_id: string, winner: number, loser: number }>) {
  const requestData = computed(() => {
    const inputData = toValue(data)
    return {
      ballot_id: inputData.ballot_id,
      loser: inputData.loser,
      topic_id: TOPIC_ID,
      winner: inputData.winner,
      topic_type: TOPIC_TYPE,
    } satisfies SaveScoreRequest
  })

  return useApi<SaveScoreResponse>('/ballot/save')
    .post(requestData)
    .json()
}

/**
 * 获取最终投票结果排序
 */
export function viewFinalOrder() {
  const requestData = computed(() => ({
    topic_id: TOPIC_ID,
  } satisfies ViewFinalOrderRequest))

  return useApi<ViewFinalOrderResponse>('/results/final_order')
    .post(requestData)
    .json()
}

/**
 * 获取候选人池数据
 */
export function getCandidatePool() {
  const requestData = computed(() => ({
    topic_id: TOPIC_ID,
  } satisfies GetCandidatePoolRequest))

  return useApi<GetCandidatePoolResponse>('/topic/candidate_pool')
    .post(requestData)
    .json()
}

/**
 * 获取 1v1 对战矩阵
 */
export function getOperators1v1Matrix() {
  const requestData = computed(() => ({
    topic_id: TOPIC_ID,
  } satisfies GetOperators1v1MatrixRequest))

  return useApi<GetOperators1v1MatrixResponse>('/results/1v1_matrix')
    .post(requestData)
    .json()
}

/**
 * 获取主题信息
 */
export function getTopicInfo() {
  const requestData = computed(() => ({
    topic_id: TOPIC_ID,
  } satisfies GetTopicInfoRequest))

  return useApi<GetTopicInfoResponse>('/topic/info')
    .post(requestData)
    .json()
}
