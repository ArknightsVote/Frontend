# 明日方舟六星 强度投票箱前端

## 待完成

主要美化

- 下一组投票图片加载优化
  - 当前投票结束后，开启一段动效，延迟投票显示
  - 是否可以后台存储图片
  - api 是否支持提前获取下一组
- 数据页
 - 是否需要 canvas 绘制
 - 是否需要更改布局
- 主页交互
  - 可配置显示内容
- 主题

## 使用

安装依赖:

```bash
# pnpm
pnpm install

# npm
npm install
```

运行:

```bash
# pnpm
pnpm dev

# npm
npm run dev
```

## mocks

可以在 `vite.config.ts` 选择是否开启，更改 `enable` 的值

```ts
{
  plugins: [
    // ....

    viteMockServe({
      mockPath: './mock',
      // enable: idDev,
      enable: false,
    }),
  ]
}
```
