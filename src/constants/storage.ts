export enum STORAGE_KEYS {
  VOTE_TIMES = 'vote_times',
  VOTE_RESULT = 'local_vote_result', // 按 topic 命名空间化：local_vote_result:<topic_id>
  VOTE_CODE = 'compare_code', // 保持向后兼容，现在存储 ballot_id
  BALLOT_ID = 'ballot_id', // 新的 ballot_id 存储键
  LAST_TOPIC = 'last_topic', // 上次选择的投票主题 id
}
