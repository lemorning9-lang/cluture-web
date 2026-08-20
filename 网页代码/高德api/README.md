# 高德地图 API 接入

本文件夹包含高德地图 JS API 的集成配置，用于「中华文明探源工程」时空探源页面的地图渲染（29 处探源遗址标记点）。

## 接入步骤

### 1. 注册高德开放平台账号

访问 [https://lbs.amap.com/](https://lbs.amap.com/)，注册并完成开发者认证。

### 2. 创建应用并获取 API Key

1. 进入「应用管理」→「我的应用」
2. 点击「创建新应用」，填写应用名称（如：中华文明探源工程）
3. 添加 Key，「服务平台」选择 **Web端(JS API)**
4. 获取 Key 后，填入 `config.js` 的 `AMAP_CONFIG.key` 字段

### 3. 配置 API Key

```javascript
// config.js
const AMAP_CONFIG = {
  key: 'YOUR_AMAP_API_KEY',   // ← 填入你的 Key
  version: '2.0',
  // ...
};
export default AMAP_CONFIG;
```

### 4. 重启开发服务器

修改 `config.js` 后，重启 `npm run dev`，时空探源页面的地图会自动从「示意地图」切换为真实高德地图。

## 行为说明

- **key 为空**：时空探源地图显示示意地图（石峁壁画 + 比例定位点），其余功能不受影响。
- **key 有效**：动态加载高德 SDK，渲染真实地图，29 处遗址按真实经纬度标记（◆ 金色菱形），点击标记打开遗址介绍；时代/文化域筛选后标记实时过滤。

## 注意事项

- API Key 不要提交到 Git 仓库（`config.js` 应加入 `.gitignore`）
- 高德 Web 端 JS API 免费版有每日调用量限制（通常 5000 次/天），超出需认证企业开发者
- 生产环境建议通过后端代理调用，避免前端暴露 Key
