// 高德地图 API 配置模板
// 请复制此文件为 config.js 并填入你的 API Key
// 注意：config.js 已加入 .gitignore，不会提交到 Git 仓库

const AMAP_CONFIG = {
  // 高德 JS API Key（Web端）
  // 获取地址：https://lbs.amap.com/ → 应用管理 → 创建新应用
  key: 'YOUR_AMAP_API_KEY_HERE',

  // API 版本
  version: '2.0',

  // 地图默认中心点
  defaultCenter: [104.1954, 35.8617],

  // 默认缩放级别
  defaultZoom: 5,

  // 加载的插件
  plugins: [
    'AMap.MarkerClusterer',
    'AMap.Geolocation',
  ],
};

export default AMAP_CONFIG;