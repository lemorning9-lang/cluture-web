/**
 * 高德地图 API 配置
 *
 * 使用说明：
 * 1. 前往 https://lbs.amap.com/ 注册并获取 Web端(JS API) Key
 * 2. 将 Key 填入下方 AMAP_CONFIG.key 字段
 * 3. 保存后重启开发服务器（npm run dev）即可看到真实高德地图
 *
 * 注意：key 为空时，时空探源页面会回退显示「示意地图」（石峁壁画 + 比例定位点），
 *      不影响其它功能正常使用。
 */
const AMAP_CONFIG = {
  /** ⚠️ 在此填入你的高德 Web 端 JS API Key */
  key: "",

  /** JS API 版本 */
  version: "2.0",

  /** 需要加载的高德插件 */
  plugins: [
    "AMap.Geocoder",       // 地理编码：地址↔坐标互转
    "AMap.AutoComplete",   // 地址自动补全
    "AMap.Driving",        // 驾车路线规划
    "AMap.Transit",        // 公交路线规划
    "AMap.Walking",        // 步行路线规划
    "AMap.PlaceSearch",    // POI 兴趣点检索
    "AMap.Geolocation",    // 用户定位
  ],

  /** 地图默认中心坐标（中原地区） */
  defaultCenter: [113.5, 34.5],

  /** 默认缩放级别 */
  defaultZoom: 5,

  /** POI 周边检索默认半径（米） */
  searchRadius: 5000,
};

export default AMAP_CONFIG;
