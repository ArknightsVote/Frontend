import type { CandidatePoolItem } from '@/types/api'
import { getCandidatePool } from '@/api'

// 静态备用数据导入（降级策略）
import operatorsOriginData from '@/shared/data/operators.json'

// 全局状态管理候选人池数据
const operatorPoolData = ref<Map<string, Operator> | null>(null)
const idToNameCache = ref<Map<string, string> | null>(null)
export interface Operator {
  name: string
  id: number
  avatar: string
  index: number
}

export type OperatorName = string
export type OperatorTarget = OperatorName | number

// 处理API数据，转换为内部格式
function processPoolData(pool: CandidatePoolItem[]) {
  const operators = new Map<string, Operator>()
  const idToName = new Map<string, string>()

  pool.forEach((item, index) => {
    // 使用中文名作为key，保持与原有逻辑一致
    const name = item.cn_name

    // 选择包含 "1" 的头像URL，如果没有则使用第一个
    const avatarUrl = item.avatar.find((url: string) => /_1\.png$/.test(url)) || item.avatar[0] || ''
    const operator: Operator = {
      name,
      id: item.id,
      avatar: avatarUrl,
      index, // 按API返回顺序作为索引
    }

    operators.set(name, operator)
    idToName.set(`id${item.id}`, name)
  })

  return {
    operators,
    idToName,
  }
}

// 处理静态JSON数据作为备用方案
function processStaticData() {
  const operators = new Map<string, Operator>()
  const idToName = new Map<string, string>()

  Object.entries(operatorsOriginData as Record<string, any>).forEach(([name, data], index) => {
    const operator: Operator = {
      name,
      id: data.id,
      avatar: data.avatar,
      index: data.index !== undefined ? data.index : index,
    }

    operators.set(name, operator)
    idToName.set(`id${data.id}`, name)
  })

  return {
    operators,
    idToName,
  }
}

/**
 * 使用候选人池数据的 composable
 */
export function useOperatorPool() {
  // 初始化数据加载
  const { data } = getCandidatePool()

  watch(
    () => data.value,
    () => {
      try {
        if (data.value.data.pool && data.value.data.pool.length > 0) {
          // 使用API数据
          const { operators, idToName } = processPoolData(data.value.data.pool)
          operatorPoolData.value = operators
          idToNameCache.value = idToName
        }
        else {
          console.warn('⚠️ API返回数据格式异常:', data)
          throw new Error('API返回的候选人池数据为空')
        }
      }
      catch (error) {
        // 降级到静态数据
        console.warn('⚠️ API加载失败，使用静态数据作为备用方案:', error)
        const { operators, idToName } = processStaticData()
        operatorPoolData.value = operators
        idToNameCache.value = idToName
        // 使用静态数据作为备用方案
      }
    },
    { deep: true },
  )
}

/**
 * 获取所有干员数据
 */
export function getOperators() {
  return operatorPoolData.value || new Map()
}

/**
 * 获取干员总数
 */
export function getOperatorsTotal() {
  return operatorPoolData.value?.size || 0
}

/**
 * 根据参数获取存在的干员名
 */
export function ensureOperatorName(target: any): OperatorName | undefined {
  if (!operatorPoolData.value || !idToNameCache.value)
    return undefined

  const argType = typeof target

  if (argType !== 'string' && argType !== 'number')
    return undefined

  if (argType === 'number') {
    const name = idToNameCache.value.get(`id${target}`)
    return name || undefined
  }

  return operatorPoolData.value.has(target) ? target : undefined
}

/**
 * 根据 name 或 id 判断干员是否存在
 */
export function exisitsOperator(target: string | number): boolean {
  const name = ensureOperatorName(target)
  return name ? (operatorPoolData.value?.has(name) || false) : false
}

/**
 * 根据 name 或 id 获取干员
 */
export const getOperator = findOperator

/**
 * 根据 name 或 id 获取干员
 */
export function findOperator(target: string | number): Operator | undefined {
  if (!operatorPoolData.value)
    return undefined

  const name = ensureOperatorName(target)
  return name ? operatorPoolData.value.get(name) : undefined
}

/**
 * 检查干员数据是否合法
 */
export function isOperatorType(data: any, ignore: Array<'name' | 'id' | 'avatar' | 'index'> = []): data is Operator {
  const validKeys = (['name', 'id', 'avatar', 'index'] as const).filter(k => !ignore.includes(k))
  return validKeys.every(k => data[k])
}
