/**
 * 投票相关的 API 类型定义
 */

// 新版本 new_compare 接口类型定义
export interface NewCompareRequest {
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

export interface Operators1v1MatrixItem {
  score: number
  count: number
}

export interface GetOperators1v1MatrixResponse {
  data: {
    [key: string]: Operators1v1MatrixItem
  }
  message: string
  status: number
}

// 主题信息数据结构（/topic/info 与 /topic/list_all 共用）
export interface TopicInfoData {
  id: string
  name: string
  title: string
  description: string
  topic_type: string
  open_time: string
  close_time: string
  /** 当前是否可投票（后端 is_active && open<=now<=close） */
  is_active: boolean
}

// GetTopicInfo 接口类型定义
export interface GetTopicInfoRequest {
  topic_id: string
}

export interface GetTopicInfoResponse {
  status: number
  data: TopicInfoData
  message: string
}

// GetTopicListAll 接口类型定义（获取全部主题，含往期/未开始）
export interface GetTopicListAllResponse {
  status: number
  data: {
    topics: TopicInfoData[]
  }
  message: string
}

// operator_timeline 接口类型定义（干员胜率时序）
export type TimeGranularity = 'second' | 'minute' | 'hour' | 'day'

export interface OperatorTimelineRequest {
  topic_id: string
  start_time: string // ISO
  end_time: string // ISO
  operator_ids: number[]
  limit?: number
  granularity?: TimeGranularity
}

export interface TimelinePoint {
  timestamp: string
  data: { operator_id: number, rate: number }[]
}

export interface OperatorTimelineResponse {
  status: number
  data: {
    timeline: TimelinePoint[]
    operators: { operator_id: number, name: string }[]
    summary: {
      total_points: number
      time_range: { start: string, end: string }
      operator_count: number
    }
    /** 后端按粒度下发的建议刷新间隔（毫秒） */
    refresh_ms: number
    /** 后端下发的单次最多干员数（后端也会强制截断） */
    max_operators: number
  }
  message: string
}
