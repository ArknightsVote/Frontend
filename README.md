# 明日方舟六星 强度投票箱前端

## 待完成

- 首页布局
- 音乐控件
- 请求是否正确
  - 若不正确，调整 `src/api` 下的返回值

## 展示

<p >
  <img src="docs/imgs/1.jpg" width="400" height="250" style="border-radius: 8px; object-fit: cover;" />
  <!-- 电脑截图 - 大尺寸 -->
  <p style="display: flex; gap: 20px;">
    <img src="docs/imgs/2.jpg" width="300" height="200" style="border-radius: 8px; object-fit: cover;" />
    <img src="docs/imgs/3.jpg" width="300" height="200" style="border-radius: 8px; object-fit: cover;" />
    <!-- <img src="docs/imgs/4.jpg" width="300" height="200" style="border-radius: 8px; object-fit: cover;" /> -->
  </p>

  <!-- 手机截图 - 小尺寸 -->
  <p style="display: flex; gap: 20px;">
    <img src="docs/imgs/5.jpg" width="120" height="250" style="border-radius: 8px; object-fit: cover;" />
    <img src="docs/imgs/6.jpg" width="120" height="250" style="border-radius: 8px; object-fit: cover;" />
  </p>
</p>

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
