/**
 * 仅调试用测试主题的 id（前后端共用 sentinel）。
 *
 * 后端仅在 debug 构建把它注入内存缓存；前端仅在 `import.meta.env.DEV`
 * （vite dev）时展示它。二者同时成立才可见，绝不出现在线上。
 */
export const TEST_TOPIC_ID = 'test_topic'
