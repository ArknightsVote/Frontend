/**
 * 投票相关的 API 类型定义
 */

// 新版本 new_compare 接口类型定义
export interface NewCompareRequest {
  ballot_id: string
  topic_id: string
}

export interface NewCompareResponse {
  data: {
    ballot_id: string
    left: number
    right: number
    topic_id: string
    topic_type: string
  }
  message: string
  status: number
}

// saveScore 接口类型定义
export interface SaveScoreRequest {
  ballot_id: string
  loser: number
  topic_id: string
  winner: number
  topic_type: string
}

export interface SaveScoreResponse {
  data: {
    code: number
  }
  message: string
  status: number
}

// viewFinalOrder 接口类型定义
export interface ViewFinalOrderRequest {
  topic_id: string
}

export interface ViewFinalOrderItem {
  name: string
  id: number
  win: number
  lose: number
  score: string
  rate: string
}

export interface ViewFinalOrderResponse {
  status: number
  data: {
    topic_id: string
    items: ViewFinalOrderItem[]
    count: number
  }
  message: string
}

// getCandidatePool 接口类型定义
export interface GetCandidatePoolRequest {
  topic_id: string
}

export interface CandidatePoolItem {
  avatar: string[]
  cn_name: string
  id: number
  name: string
}

export interface GetCandidatePoolResponse {
  data: {
    pool: CandidatePoolItem[]
    topic_id: string
  }
  message: string
  status: number
}

// GetOperators1v1Matrix 接口类型定义
export interface GetOperators1v1MatrixRequest {
  topic_id: string
}

export interface GetOperators1v1MatrixResponse {
  data: {
    [key: string]: number
  }
  message: string
  status: number
}

// GetTopicInfo 接口类型定义
export interface GetTopicInfoRequest {
  topic_id: string
}

export interface GetTopicInfoResponse {
  status: number
  data: {
    id: string
    name: string
    title: string
    description: string
    topic_type: string
    open_time: string
    close_time: string
  }
  message: string
}
