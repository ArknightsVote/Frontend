export enum STORAGE_KEYS {
  VOTE_TIMES = 'vote_times',
  VOTE_RESULT = 'local_vote_result',
  VOTE_CODE = 'compare_code', // 保持向后兼容，现在存储 ballot_id
  BALLOT_ID = 'ballot_id', // 新的 ballot_id 存储键
}
