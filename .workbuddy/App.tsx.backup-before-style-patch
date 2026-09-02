import { useState, useRef, useEffect } from "react";
import {
  MapPin,
  Sparkles,
  Send,
  X,
  ChevronRight,
  Star,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  CheckCircle,
  Lock,
  Menu,
  Search,
  Bell,
  User,
  Play,
  Navigation,
  Coffee,
  Hotel,
  Bus,
  Filter,
  ArrowRight,
  ChevronDown,
  ExternalLink,
} from "lucide-react";

// 遗址/社区图片映射 + 高德地图配置
import { getSiteMainImage, COMMUNITY_IMAGES } from "../data/siteImages";
import AMAP_CONFIG from "../../高德api/config.js";

// 石峁博物馆壁画 — used as cinematic prologue backgrounds
import mural1 from "../imports/____-1.jpg";
import mural2 from "../imports/____-2.jpg";
import mural3 from "../imports/____-3.jpg";
import pottery from "../imports/___________.png";
import liangzhuFace from "../imports/__________.png";
import taosiArtifact from "../imports/________________.png";
import liangzhuArtifact from "../imports/_______.png";
import yinxuArtifact from "../imports/_______-1.png";
import sanxingduiArtifact from "../imports/________.png";
// 文化遗珍 activity images
import actLiangzhuYu from "../imports/______-1.png";
import actYangshaoTao from "../imports/____.png";
import actBianzhong from "../imports/____-1.png";
import actHanfu from "../imports/____-2.png";
import actGuShu from "../imports/______-2.png";
import actHongshan from "../imports/____-3.png";
import actLongshan from "../imports/____-4.png";
import actYangshaoCan from "../imports/______-3.png";
import actChuWu from "../imports/__.png";

// ─── Typography ──────────────────────────────────────────────────────────────
// H1 display: 演示春风楷 (LXGW WenKai is the closest free web equivalent)
const FD =
  "'Zhi Mang Xing', 'LXGW WenKai', 'KaiTi', 'STKaiti', serif";
// H2 section: 楷体/宋体
const FH = "'KaiTi', 'STKaiti', 'Noto Serif SC', serif";
// Body: 仿宋/楷体
const FB =
  "'FangSong', 'STFangsong', 'KaiTi', 'Noto Serif SC', serif";
// English labels: Times New Roman
const FE = "'Times New Roman', Times, serif";

// ─── Image Assets ─────────────────────────────────────────────────────────────

const IMGS = {
  heroMountain:
    "https://images.unsplash.com/photo-1770637112710-40b2e3c2d333?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920",
  inkWash:
    "https://images.unsplash.com/photo-1762114974502-551aeb189066?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920",
  mistyRiver:
    "https://images.unsplash.com/photo-1779437651154-b08971da294f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1920",
  bronzeVessel:
    "https://images.unsplash.com/photo-1758092320137-e9dcf38c8672?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
  terracottaJar:
    "https://images.unsplash.com/photo-1758092320133-cd36eea79f46?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
  paintedPottery:
    "https://images.unsplash.com/photo-1761724794595-44562ceac80c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
  ceramicVessel:
    "https://images.unsplash.com/photo-1758092320158-1d12b7dfea4b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
  stoneStructure:
    "https://images.unsplash.com/photo-1726372060171-ab2314c4fd8f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
  stoneCarvings:
    "https://images.unsplash.com/photo-1769888913161-ec40418b7c07?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
  digTools:
    "https://images.unsplash.com/photo-1632821405254-a8166e7c201d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
  chineseTemple:
    "https://images.unsplash.com/photo-1507868162883-6b769c1a88c1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
  greenBowl:
    "https://images.unsplash.com/photo-1778215251269-dbf83abca50b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800",
};

// ordered list for cycling through activity cards
const ACTIVITY_IMGS = [
  IMGS.bronzeVessel,
  IMGS.terracottaJar,
  IMGS.paintedPottery,
  IMGS.ceramicVessel,
  IMGS.chineseTemple,
  IMGS.stoneStructure,
  IMGS.stoneCarvings,
  IMGS.digTools,
  IMGS.mistyRiver,
];

const SITE_CARD_IMGS = [
  liangzhuArtifact,
  taosiArtifact,
  yinxuArtifact,
  sanxingduiArtifact,
];
const DRAWER_IMGS = [
  IMGS.ceramicVessel,
  IMGS.bronzeVessel,
  IMGS.paintedPottery,
];
const POST_IMGS = [
  IMGS.mistyRiver,
  IMGS.stoneStructure,
  IMGS.inkWash,
  IMGS.chineseTemple,
];

// ─── Types ────────────────────────────────────────────────────────────────────

type Tab = "探源" | "遗珍" | "社区" | "个人";
type SiteStatus = "实地打卡" | "线上打卡" | "未打卡";

interface Site {
  id: number;
  name: string;
  culture: string;
  period: string;
  domain: string;
  location: string;
  brief: string;
  status: SiteStatus;
  x: number;
  y: number;
  /** 纬度（高德地图坐标） */
  lat: number;
  /** 经度（高德地图坐标） */
  lng: number;
}

interface Post {
  id: number;
  author: string;
  avatar: string;
  time: string;
  content: string;
  site: string;
  likes: number;
  comments: number;
  imageCount: number;
}

interface Activity {
  id: number;
  name: string;
  culture: string;
  category: string;
  rating: number;
  description: string;
  location: string;
  height: "tall" | "medium" | "short";
  img: string;
}

interface ChatMessage {
  role: "user" | "ai";
  content: string;
  typing?: boolean;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const SITES: Site[] = [
  // ── 社会分化·文明曙光 (距今5800–5500年) ── 3处
  {
    id: 1,
    name: "铸鼎原遗址群",
    culture: "仰韶文化",
    period: "曙光",
    domain: "其他",
    location: "河南灵宝",
    brief:
      "大型宫殿式建筑、大型墓葬、板瓦与彩陶共存，中原地区文明社会化进程的最早见证",
    status: "未打卡",
    x: 39,
    y: 41,
    lat: 34.52,
    lng: 110.86,
  },
  {
    id: 2,
    name: "城头山遗址",
    culture: "大溪文化至石家河文化",
    period: "曙光",
    domain: "长江",
    location: "湖南澧县",
    brief:
      "中国最早完整古城，水稻田与祭坛并存，是长江中游文明曙光阶段社会复杂化的典型代表",
    status: "未打卡",
    x: 47,
    y: 55,
    lat: 29.66,
    lng: 111.76,
  },
  {
    id: 3,
    name: "东山村遗址",
    culture: "崧泽文化",
    period: "曙光",
    domain: "长江",
    location: "江苏张家港",
    brief:
      "崧泽文化晚期，早期高等级大墓，出土大量玉器，揭示长江下游在良渚之前已出现明显社会分化",
    status: "未打卡",
    x: 68,
    y: 49,
    lat: 31.87,
    lng: 120.55,
  },

  // ── 古国四起·文明初成 (距今5500–5000年) ── 11处
  {
    id: 4,
    name: "双槐树遗址",
    culture: "仰韶文化",
    period: "初成",
    domain: "黄河",
    location: "河南巩义",
    brief:
      "北斗星图、蚕茧、宫室建筑群三位一体，是黄河中游仰韶文化达到鼎盛的核心圣地",
    status: "未打卡",
    x: 44,
    y: 42,
    lat: 34.75,
    lng: 113,
  },
  {
    id: 5,
    name: "大地湾遗址",
    culture: "大地湾文化",
    period: "初成",
    domain: "黄河",
    location: "甘肃秦安",
    brief:
      "跨度距今8000–4800年，宫殿式建筑与彩绘地画并存，黄河上游最完整的史前文化序列",
    status: "未打卡",
    x: 27,
    y: 38,
    lat: 34.98,
    lng: 105.67,
  },
  {
    id: 6,
    name: "南佐遗址",
    culture: "仰韶文化",
    period: "初成",
    domain: "黄河",
    location: "甘肃庆阳",
    brief:
      "九座宫殿式大型建筑围绕中心广场，超大型仰韶文化聚落，揭示黄河中游文明的西部根脉",
    status: "未打卡",
    x: 33,
    y: 35,
    lat: 35.73,
    lng: 107.64,
  },
  {
    id: 7,
    name: "大汶口文化遗址",
    culture: "大汶口文化",
    period: "初成",
    domain: "黄河",
    location: "山东泰安",
    brief:
      "黄河下游史前文化枢纽，刻划符号与等级化墓葬制度揭示早期社会分层的全面形成",
    status: "未打卡",
    x: 55,
    y: 40,
    lat: 36,
    lng: 117.1,
  },
  {
    id: 8,
    name: "焦家遗址",
    culture: "大汶口文化",
    period: "初成",
    domain: "黄河",
    location: "山东章丘",
    brief:
      "高等级大型墓葬出土玉钺与象牙梳，是黄河下游大汶口文化社会分层加剧的重要见证",
    status: "未打卡",
    x: 53,
    y: 39,
    lat: 36.72,
    lng: 117.53,
  },
  {
    id: 9,
    name: "岗上遗址",
    culture: "大汶口文化",
    period: "初成",
    domain: "黄河",
    location: "山东滕州",
    brief:
      "大型玉钺与象牙器随葬，是黄河下游大汶口文化晚期高度分层社会结构的有力佐证",
    status: "未打卡",
    x: 54,
    y: 43,
    lat: 35.08,
    lng: 117.15,
  },
  {
    id: 10,
    name: "牛河梁遗址",
    culture: "红山文化",
    period: "初成",
    domain: "其他",
    location: "辽宁朝阳",
    brief:
      "女神庙、积石冢与祭坛构成大型礼仪中心，以玉器为核心的红山神权文明体系的集中体现",
    status: "线上打卡",
    x: 62,
    y: 18,
    lat: 41.33,
    lng: 119.5,
  },
  {
    id: 11,
    name: "鸡叫城遗址",
    culture: "汤家岗文化",
    period: "初成",
    domain: "长江",
    location: "湖南澧县",
    brief:
      "大型环壕城址与精密水利设施并存，长江中游古国初成阶段最重要的聚落中心",
    status: "未打卡",
    x: 46,
    y: 56,
    lat: 29.68,
    lng: 111.74,
  },
  {
    id: 12,
    name: "城河遗址",
    culture: "屈家岭文化",
    period: "初成",
    domain: "长江",
    location: "湖北沙洋",
    brief:
      "长江中游，发现大型墓葬、城垣、水利设施，填补长江中游史前大型墓的空白，城垣、居址、墓葬三位一体的发现，为长江中游文明的演化提供了更全面的信息。",
    status: "未打卡",
    x: 50,
    y: 53,
    lat: 30.93,
    lng: 113.58,
  },
  {
    id: 13,
    name: "黄山遗址",
    culture: "仰韶文化",
    period: "初成",
    domain: "长江",
    location: "河南南阳",
    brief:
      "南阳盆地仰韶至屈家岭文化交汇地，祭祀建筑与玉器出土，是中原与长江两大文明区的交流枢纽",
    status: "未打卡",
    x: 43,
    y: 48,
    lat: 33.05,
    lng: 112.6,
  },
  {
    id: 14,
    name: "凌家滩遗址",
    culture: "凌家滩文化",
    period: "初成",
    domain: "长江",
    location: "安徽含山",
    brief:
      "长江下游新石器晚期最重要中心聚落，发现大型祭坛、高等级墓葬、精美玉器，其玉器工艺和宇宙观对良渚文化产生直接影响",
    status: "实地打卡",
    x: 61,
    y: 48,
    lat: 31.55,
    lng: 118.05,
  },

  // ── 古国文明·高潮迭起 (距今5000–4000年) ── 10处
  {
    id: 15,
    name: "赵陵山遗址",
    culture: "崧泽文化",
    period: "高潮",
    domain: "长江",
    location: "江苏昆山",
    brief:
      "崧泽至良渚文化过渡期关键遗址，揭示太湖流域史前社会由平等走向分层的演变脉络",
    status: "未打卡",
    x: 69,
    y: 52,
    lat: 31.38,
    lng: 120.98,
  },
  {
    id: 16,
    name: "草鞋山遗址",
    culture: "马家浜文化",
    period: "高潮",
    domain: "长江",
    location: "江苏苏州",
    brief:
      "出土中国已知最早纺织品实物，保存于长江下游史前文化完整的发展序列，再现长江下游史前人类历史的发展史",
    status: "未打卡",
    x: 70,
    y: 53,
    lat: 31.32,
    lng: 120.75,
  },
  {
    id: 17,
    name: "良渚遗址",
    culture: "良渚文化",
    period: "高潮",
    domain: "长江",
    location: "浙江余杭",
    brief:
      "实证中华五千年文明的核心地标，完善水坝系统与玉器礼制，2019年列入世界遗产名录",
    status: "实地打卡",
    x: 68,
    y: 55,
    lat: 30.38,
    lng: 120.03,
  },
  {
    id: 18,
    name: "石家河遗址",
    culture: "石家河文化",
    period: "高潮",
    domain: "长江",
    location: "湖北天门",
    brief:
      "有规模宏大的城址、祭祀遗迹、玉器，是长江中游地区文明进程的顶峰",
    status: "未打卡",
    x: 48,
    y: 52,
    lat: 30.78,
    lng: 113.18,
  },
  {
    id: 19,
    name: "宝墩遗址",
    culture: "宝墩文化",
    period: "高潮",
    domain: "长江",
    location: "四川成都",
    brief:
      "成都平原最早史前城址群之一，揭示长江上游古蜀文明独立起源于本土的完整脉络",
    status: "未打卡",
    x: 30,
    y: 52,
    lat: 30.57,
    lng: 103.82,
  },
  {
    id: 20,
    name: "城子崖遗址",
    culture: "龙山文化",
    period: "高潮",
    domain: "黄河",
    location: "山东章丘",
    brief:
      "中国最早发现的龙山文化遗址，蛋壳黑陶代表新石器时代制陶工艺绝顶水平",
    status: "未打卡",
    x: 54,
    y: 38,
    lat: 36.74,
    lng: 117.55,
  },
  {
    id: 21,
    name: "陶寺遗址",
    culture: "龙山文化",
    period: "高潮",
    domain: "黄河",
    location: "山西临汾",
    brief:
      "疑为尧帝都城，出土中国最早天文观测台与朱书符号，宫城格局宏大，礼制已臻成熟",
    status: "线上打卡",
    x: 43,
    y: 36,
    lat: 35.88,
    lng: 111.52,
  },
  {
    id: 22,
    name: "石峁遗址",
    culture: "龙山文化",
    period: "高潮",
    domain: "黄河",
    location: "陕西神木",
    brief:
      "黄土高原规模最大史前石砌城址，皇城台宫殿建筑群彰显超强的社会动员与组织能力",
    status: "未打卡",
    x: 38,
    y: 34,
    lat: 38.82,
    lng: 110.33,
  },
  {
    id: 23,
    name: "碧村遗址",
    culture: "龙山文化",
    period: "高潮",
    domain: "黄河",
    location: "山西兴县",
    brief:
      "黄河晋陕峡谷关键节点城址，入口门塾建筑揭示龙山时期黄河中游防御与文化交流体系",
    status: "未打卡",
    x: 40,
    y: 32,
    lat: 38.55,
    lng: 111.12,
  },
  {
    id: 24,
    name: "柳湾遗址",
    culture: "马家窑文化",
    period: "高潮",
    domain: "黄河",
    location: "青海乐都",
    brief:
      "黄河上游最大规模史前公共墓地，彩陶随葬数量惊人，是西北地区社会复杂化程度的重要标尺",
    status: "未打卡",
    x: 22,
    y: 39,
    lat: 36.45,
    lng: 102.42,
  },

  // ── 文明转型·王朝建立 (距今4000–3000年) ── 5处
  {
    id: 25,
    name: "二里头遗址",
    culture: "二里头文化",
    period: "王朝",
    domain: "其他",
    location: "河南偃师",
    brief:
      "夏代晚期广域王权核心都邑，中国最早宫殿建筑群与青铜礼器体系，绿松石龙形器为最高王权象征",
    status: "线上打卡",
    x: 44,
    y: 43,
    lat: 34.69,
    lng: 112.72,
  },
  {
    id: 26,
    name: "郑州商城遗址",
    culture: "商文化",
    period: "王朝",
    domain: "其他",
    location: "河南郑州",
    brief:
      "商代早中期王国核心都城，城垣周长近7公里，青铜铸造规模彰显王朝强大统治力",
    status: "未打卡",
    x: 45,
    y: 41,
    lat: 34.75,
    lng: 113.68,
  },
  {
    id: 27,
    name: "殷墟遗址",
    culture: "商文化",
    period: "王朝",
    domain: "其他",
    location: "河南安阳",
    brief:
      "商代后期都城，甲骨文出土地，宏大宫殿与王陵体系并立，世界文化遗产",
    status: "实地打卡",
    x: 46,
    y: 38,
    lat: 36.12,
    lng: 114.32,
  },
  {
    id: 28,
    name: "三星堆遗址",
    culture: "古蜀文化",
    period: "王朝",
    domain: "其他",
    location: "四川广汉",
    brief:
      "神秘古蜀文明核心，青铜纵目人像与黄金权杖展现多元一体格局中南方方国的独特辉煌",
    status: "线上打卡",
    x: 31,
    y: 51,
    lat: 30.99,
    lng: 104.2,
  },
  {
    id: 29,
    name: "新干遗址群",
    culture: "商代方国",
    period: "王朝",
    domain: "其他",
    location: "江西新干",
    brief:
      "赣江流域大型商代墓葬群，出土青铜器、玉器逾千件，揭示南方方国文明独立发展的高度成就",
    status: "未打卡",
    x: 60,
    y: 60,
    lat: 27.78,
    lng: 115.4,
  },
];

const DOMAINS = ["全部", "黄河流域", "长江流域", "其他地区"];

// ─── 遗址纪录片视频索引 ────────────────────────────────────────────────────────
const SITE_VIDEOS: Record<
  number,
  {
    title: string;
    source: string;
    duration: string;
    url: string;
    desc: string;
  }
> = {
  1: {
    title: "《寻古中国》古国时代铸鼎原",
    source: "CCTV纪录",
    duration: "",
    url: "https://tv.cctv.com/2025/08/10/VIDEh03MIV79Nk6xKCSDaVMx250810.shtml",
    desc: "仰韶古国雏形初显，铸鼎原聚落群与黄帝传说",
  },
  2: {
    title: "《文化中国行》城头山遗址",
    source: "CCTV",
    duration: "",
    url: "http://baike.baidu.com/l/YlhyvLPH",
    desc: "城头山稻作农业走向成熟和城的诞生",
  },
  3: {
    title: "考古公开课·解谜崧泽王",
    source: "考古公开课",
    duration: "",
    url: "http://baike.baidu.com/l/JuFGhOCR",
    desc: "东山村遗址：良渚文明之前的崧泽古国形态",
  },
  4: {
    title: "《寻古中国》河洛记·聚落成邑",
    source: "CCTV纪录",
    duration: "",
    url: "https://tv.cctv.com/2023/11/16/VIDE0YAkTjSqpA2yeLKo8O8k231116.shtml",
    desc: "仰韶鼎盛时代的宫室聚落与黄河圣地",
  },
  5: {
    title: "央视专题《大地湾之谜》",
    source: "CCTV新闻",
    duration: "",
    url: "http://news.cctv.com/society/20071130/107931.shtml",
    desc: "黄河上游最完整史前文化序列，八千年文明基因库",
  },
  6: {
    title: "《探索·发现》南佐遗址",
    source: "CCTV纪录",
    duration: "",
    url: "https://tv.cctv.cn/2023/02/27/VIDEDV1fKfvxGTSxYpqopuna230227.shtml",
    desc: "超大型仰韶文化聚落，黄河中游文明西部根脉",
  },
  7: {
    title: "纪录片《大汶口》系列",
    source: "CCTV纪录",
    duration: "",
    url: "https://tv.cctv.com/2023/12/16/VIDE0i9wFfeONiwtXipZLWYo231216.shtml",
    desc: "黄河下游刻划符号与等级化墓葬制度",
  },
  8: {
    title: "《走遍中国》焦家遗址",
    source: "CCTV",
    duration: "",
    url: "https://tv.cctv.com/2024/01/30/VIDEqpCRqeBWsDoHKaNKeWiw240130.shtml",
    desc: "玉钺与象牙梳揭示的大汶口文化权力阶层",
  },
  9: {
    title: "《走遍中国》岗上遗址",
    source: "CCTV",
    duration: "",
    url: "https://news.cctv.com/2025/04/20/ARTIHi7GBycPCC559nN348nu250420.shtml",
    desc: "随葬玉器折射的大汶口文化晚期社会分层",
  },
  10: {
    title: "《探索·发现》文明曙光——牛河梁遗址",
    source: "CCTV纪录",
    duration: "",
    url: "https://www.bilibili.com/video/BV1hzP3eDED8/",
    desc: "女神庙与积石冢的神权文明体系",
  },
  11: {
    title: "2021年度全国十大考古新发现",
    source: "国家文物局",
    duration: "",
    url: "http://baike.baidu.com/l/O9kbeB2U",
    desc: "鸡叫城遗址：长江中游古国的大型环壕城址",
  },
  12: {
    title: "《探索·发现》城河遗址",
    source: "CCTV纪录",
    duration: "",
    url: "http://baike.baidu.com/l/cmKDGNxz",
    desc: "城垣、居址、墓葬三位一体的屈家岭文化古城",
  },
  13: {
    title: "《探索·发现》奥秘·南阳黄山遗址",
    source: "CCTV纪录",
    duration: "",
    url: "https://tv.cctv.com/2025/12/10/VIDEJd0dk6rIOd79VoU4Qryl251210.shtml",
    desc: "南阳黄山遗址玉器制作技艺与史前玉都",
  },
  14: {
    title: "《文化中国行》凌家滩遗址简介",
    source: "今日头条",
    duration: "",
    url: "https://www.toutiao.com/video/7575900535354688035/",
    desc: "长江下游最高等级玉器与史前礼制中心",
  },
  15: {
    title: "《苏从何处来》系列短视频",
    source: "百度百科",
    duration: "",
    url: "http://baike.baidu.com/l/CmzM6Ypw",
    desc: "崧泽至良渚：太湖流域从平等走向分层的演变",
  },
  16: {
    title: "长江流域文明曙光——苏州草鞋山遗址寻踪",
    source: "学习强国",
    duration: "",
    url: "https://www.xuexi.cn/local/normalTemplate.html?itemId=1928792812661975839",
    desc: "中国最早纺织品实物出土地，江南史前文化标尺",
  },
  17: {
    title: "探源中华文明｜浙江良渚遗址：实证中华五千年文明史的圣地",
    source: "百度百科",
    duration: "",
    url: "http://baike.baidu.com/l/MmAB0vt1",
    desc: "良渚古城与水利系统，实证中华五千年文明史",
  },
  18: {
    title: "《探索·发现》世纪考古大发现：石家河遗址",
    source: "CCTV纪录",
    duration: "",
    url: "http://baike.baidu.com/l/c0eGZQY5",
    desc: "长江中游史前城址聚落，距今5900-3800年新石器时代文明顶峰",
  },
  19: {
    title: "天府之源（3）——宝墩遗址",
    source: "百度百科",
    duration: "",
    url: "http://baike.baidu.com/l/XPlwEWK7",
    desc: "成都平原最早史前城址群，开启古蜀文明进程",
  },
  20: {
    title: "纪录片《城子崖》",
    source: "CCTV纪录",
    duration: "",
    url: "https://tv.cctv.com/2022/11/25/VIDE1lSSKMH02c9xaXPTZfvr221125.shtml",
    desc: "蛋壳黑陶与中国最早龙山文化城址",
  },
  21: {
    title: "文化中国行｜陶寺遗址博物馆",
    source: "CCTV新闻",
    duration: "",
    url: "https://big5.cctv.com/gate/big5/news.cctv.com/2024/11/11/ARTIG7hec4AG5cZfACWTjR2y241111.shtml",
    desc: "最早天文台与朱书符号的文明内核",
  },
  22: {
    title: "《探索·发现》石峁遗址（上）",
    source: "CCTV纪录",
    duration: "",
    url: "https://tv.cctv.cn/2020/07/13/VIDEl2SGEnvKlXqJvtQbQ7F5200713.shtml",
    desc: "皇城台宫殿与黄土高原史前最大石砌城址",
  },
  23: {
    title: "山西兴县碧村遗址",
    source: "CCTV",
    duration: "",
    url: "http://tv.cctv.com/2022/12/27/VIDErWfS4X1IKLHaGZGvYUk8221227.shtml",
    desc: "晋陕峡谷关键节点的龙山文化防御城址",
  },
  24: {
    title: "《探索·发现》柳湾遗址",
    source: "CCTV纪录",
    duration: "",
    url: "https://tv.cctv.com/2021/01/09/VIDEoUWEUCX02gE1G9ydTmpW210109.shtml",
    desc: "史前最大公共墓地与马家窑彩陶随葬",
  },
  25: {
    title: "《寻古中国》寻夏记·夏都何在",
    source: "CCTV纪录",
    duration: "",
    url: "https://tv.cctv.com/2023/12/22/VIDEWrluxuRGTlz5TfzsPbEv231222.shtml",
    desc: "夏朝宫殿与绿松石龙的王权象征，最早的中国",
  },
  26: {
    title: "《寻古中国》寻商记·商从何来",
    source: "CCTV纪录",
    duration: "",
    url: "https://tv.cctv.com/2025/03/03/VIDEPA7sOYE64LRQBb79B4D8250303.shtml",
    desc: "商代早商都城亳都的发现与确认",
  },
  27: {
    title: "探寻中华文脉｜在殷墟，听见三千年文明回响",
    source: "哔哩哔哩",
    duration: "",
    url: "https://m.bilibili.com/video/BV1ry411Y7Qr",
    desc: "商代后期都城与甲骨文，中华文明探源的原点",
  },
  28: {
    title: "《探秘三星堆》大型考古纪录片（10集）",
    source: "CCTV纪录",
    duration: "",
    url: "https://m.bilibili.com/video/av829521070",
    desc: "青铜纵目人像与黄金权杖的神秘古蜀文明",
  },
  29: {
    title: "新干大洋洲商代遗址 改写江南文明史",
    source: "CCTV纪录",
    duration: "",
    url: "https://tv.cctv.com/2018/05/02/VIDED7HkFlY96OrGZLh82zFf180502.shtml",
    desc: "南方方国高度发达的区域青铜文明",
  },
};

const ERA_NODES = [
  {
    key: "全部",
    top: "",
    label: "全部时代",
    keyword: "总览",
    glyph: "◆",
  },
  {
    key: "曙光",
    top: "社会分化",
    label: "文明曙光",
    keyword: "距今5800–5500年",
  },
  {
    key: "初成",
    top: "古国四起",
    label: "文明初成",
    keyword: "距今5500–5000年",
  },
  {
    key: "高潮",
    top: "古国文明",
    label: "高潮迭起",
    keyword: "距今5000–4000年",
  },
  {
    key: "王朝",
    top: "文明转型",
    label: "王朝建立",
    keyword: "距今4000–3000年",
  },
];

const ACTIVITIES: Activity[] = [
  {
    id: 1,
    name: "良渚琢玉体验",
    culture: "良渚文化",
    category: "手工技艺",
    rating: 5,
    description:
      "在专业匠人指导下，亲身体验新石器时代的玉器雕琢技艺，感受五千年前的神圣器物。",
    location: "浙江杭州良渚博物院",
    height: "tall",
    img: actLiangzhuYu,
  },
  {
    id: 2,
    name: "仰韶彩陶绘制",
    culture: "仰韶文化",
    category: "手工技艺",
    rating: 5,
    description:
      "用矿物颜料在素陶上绘制鱼纹与花瓣纹，复原七千年前的彩陶艺术精髓。",
    location: "河南三门峡仰韶村",
    height: "medium",
    img: actYangshaoTao,
  },
  {
    id: 5,
    name: "古蜀青铜铸造",
    culture: "古蜀文化",
    category: "手工技艺",
    rating: 5,
    description:
      "了解三星堆青铜器的神秘铸造工艺，体验失蜡法铸造微型青铜纵目人像。",
    location: "四川广汉三星堆博物馆",
    height: "tall",
    img: actGuShu,
  },
  {
    id: 7,
    name: "龙山黑陶制作",
    culture: "龙山文化",
    category: "手工技艺",
    rating: 5,
    description:
      "体验蛋壳陶薄如纸张的制作奇迹，用轮制技术拉坯成型，感受匠心极致。",
    location: "山东济南城子崖遗址",
    height: "medium",
    img: actLongshan,
  },
  {
    id: 9,
    name: "楚舞飞天表演",
    culture: "楚文化",
    category: "舞蹈",
    rating: 5,
    description:
      "楚地巫舞再现，宽袖长裙飘逸，感受南方文明的浪漫与神秘气息。",
    location: "湖北荆州楚文化博物馆",
    height: "short",
    img: actChuWu,
  },
  {
    id: 3,
    name: "编钟乐舞演出",
    culture: "商周文化",
    category: "音乐",
    rating: 5,
    description:
      "宫廷雅乐重现，聆听曾侯乙编钟的千古绝响，感受礼乐文明的宏大气象。",
    location: "湖北武汉湖北省博物馆",
    height: "tall",
    img: actBianzhong,
  },
  {
    id: 4,
    name: "汉服礼仪体验",
    culture: "汉文化",
    category: "汉服体验",
    rating: 4,
    description:
      "穿着复原汉代深衣，在古礼师带领下行冠礼、射礼，体验华夏礼仪之邦。",
    location: "陕西西安汉长安城",
    height: "medium",
    img: actHanfu,
  },
  {
    id: 6,
    name: "红山玉雕研习",
    culture: "红山文化",
    category: "手工技艺",
    rating: 4,
    description:
      "学习红山文化玉猪龙的造型设计理念，体验北方玉器的独特风格与审美意境。",
    location: "内蒙古赤峰博物馆",
    height: "short",
    img: actHongshan,
  },
  {
    id: 8,
    name: "仰韶民俗餐宴",
    culture: "仰韶文化",
    category: "美食",
    rating: 4,
    description:
      "品尝以新石器时代食谱为灵感的创意菜肴，粟米、黍饭与野猪肉的史前盛宴。",
    location: "河南三门峡",
    height: "short",
    img: actYangshaoCan,
  },
];

const ACTIVITY_CATEGORIES = [
  "全部",
  "手工技艺",
  "音乐",
  "舞蹈",
  "美食",
  "汉服体验",
];

const POSTS: Post[] = [
  {
    id: 1,
    author: "文化行者·墨痕",
    avatar: "墨",
    time: "3小时前",
    content:
      "今日踏访良渚遗址，站在五千年前的城墙之上，遥想当年先民营建这座古城的壮阔画面。导览员告诉我们，良渚的水坝系统足以证明这里存在着高度组织化的社会。此行收获颇丰，强烈推荐！",
    site: "良渚遗址",
    likes: 284,
    comments: 47,
    imageCount: 4,
  },
  {
    id: 2,
    author: "探源者·青瓷",
    avatar: "青",
    time: "昨天",
    content:
      "仰韶村遗址博物馆新展厅开放！全新复原的彩陶村落场景非常震撼，七千年前的先民生活跃然眼前。馆内的彩陶复制工坊可以亲手体验绘制，带孩子来研学的绝佳选择。",
    site: "仰韶村遗址",
    likes: 156,
    comments: 23,
    imageCount: 6,
  },
  {
    id: 3,
    author: "史迹寻踪·玄黄",
    avatar: "玄",
    time: "2天前",
    content:
      "红山文化牛河梁遗址的女神庙复原模型令人动容。五千五百年前，辽河流域的先民们便已构建起系统性的祭祀礼仪体系，玉猪龙作为最高神圣器物贯穿整个红山文明。",
    site: "牛河梁遗址",
    likes: 203,
    comments: 31,
    imageCount: 3,
  },
];

const TRENDING = [
  { tag: "#良渚文明5000年#", count: "2.3万" },
  { tag: "#仰韶彩陶之美#", count: "1.8万" },
  { tag: "#三星堆新发现#", count: "4.1万" },
  { tag: "#探源工程成果#", count: "8900" },
  { tag: "#殷墟甲骨文#", count: "1.2万" },
];

const EXPERTS = [
  {
    name: "苏秉琦",
    title: "中国考古学泰斗",
    specialty: "区系类型学",
  },
  {
    name: "张光直",
    title: "哈佛大学荣休教授",
    specialty: "中国青铜时代",
  },
  {
    name: "严文明",
    title: "北京大学教授",
    specialty: "新石器时代考古",
  },
];

const QUICK_QUESTIONS = [
  "什么是中华文明探源工程？",
  "良渚文明为何被称为五千年文明？",
  "红山文化的玉猪龙有什么寓意？",
  "如何规划一条三天长江文化路线？",
  "二里头遗址和夏朝有什么关系？",
];

const AI_ANSWERS: Record<string, string> = {
  ["什么是中华文明探源工程？"]:
    "中华文明探源工程是2002年启动的国家重大科研项目，旨在通过考古发掘与多学科综合研究，揭示中华文明起源、形成与早期发展的历史脉络。工程确认了以良渚、陶寺、石峁、二里头为代表的四大都邑性遗址，将中华文明史实证至距今5000年。",
  ["良渚文明为何被称为五千年文明？"]:
    "良渚古城遗址位于浙江杭州，距今约5300-4300年。遗址发现了规模宏大的宫殿区、手工业作坊、完善的水坝系统以及高度复杂的玉器礼制体系。2019年正式列入世界遗产名录，成为实证中华五千年文明史的重要坐标。",
  ["红山文化的玉猪龙有什么寓意？"]:
    "玉猪龙是红山文化的标志性器物，出土于内蒙古、辽宁一带，距今约6000-5000年。其形态为猪首蛇身的卷曲造型，代表先民对自然力量的崇拜与驯化的猪图腾信仰。同时，玉猪龙作为随葬品出现于高等级墓葬，是权贵身份与神圣力量的象征。",
  ["如何规划一条三天长江文化路线？"]:
    "Day 1 — 良渚古城（杭州）\n探访良渚博物院与遗址公园，重点参观反山王陵与瑶山祭坛。\n\nDay 2 — 凌家滩（安徽含山）\n参观凌家滩遗址博物馆，了解长江下游玉器文明的起源。\n\nDay 3 — 三星堆（四川广汉）\n深度游览三星堆博物馆新馆，探索神秘的古蜀青铜文明。\n\n如需规划此路线，可继续告诉我出发城市与天数。",
  ["二里头遗址和夏朝有什么关系？"]:
    "二里头遗址位于河南洛阳偃师，年代约为公元前1750-1500年。遗址发现了中国最早的宫殿建筑群、青铜礼器铸造作坊和绿松石镶嵌工艺，其规模与等级符合文献记载中夏代晚期都城斟鄩的条件。多数学者认为二里头是夏代都城的有力候选地。",
};

// ─── Shared UI Atoms ──────────────────────────────────────────────────────────

function Divider() {
  return (
    <div className="h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent my-8" />
  );
}

function GoldDiamond() {
  return <span className="text-primary text-xs">◆</span>;
}

function CornerBrackets() {
  return (
    <>
      <span className="absolute top-0 left-0 w-4 h-4 border-t border-l border-primary/60 pointer-events-none" />
      <span className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-primary/60 pointer-events-none" />
    </>
  );
}

function SectionLabel({ en }: { en: string }) {
  return (
    <div className="flex items-center gap-3 mb-2">
      <GoldDiamond />
      <span
        className="text-primary/70 text-sm tracking-[0.25em] uppercase"
        style={{ fontFamily: FE }}
      >
        {en}
      </span>
      <GoldDiamond />
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={10}
          className={
            i < rating
              ? "fill-primary text-primary"
              : "text-muted-foreground"
          }
        />
      ))}
    </div>
  );
}

// ─── Chapter Divider ─────────────────────────────────────────────────────────

function ChapterDivider({ phrase }: { phrase: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 bg-[#0E0604]">
      <div className="h-px w-48 bg-gradient-to-r from-transparent via-primary/70 to-transparent" />
      <div
        className="my-3 text-primary/80 text-xl"
        style={{ fontFamily: "'Zhi Mang Xing', serif" }}
      >
        ◆
      </div>
      <p
        className="text-primary/45 text-xs tracking-[0.35em]"
        style={{ fontFamily: "'KaiTi', 'STKaiti', serif" }}
      >
        {phrase}
      </p>
      <div className="h-px w-48 bg-gradient-to-r from-transparent via-primary/70 to-transparent mt-3" />
    </div>
  );
}

// ─── Cinematic Prologue ───────────────────────────────────────────────────────

function CinematicPrologue({
  onEnterMap,
}: {
  onEnterMap: () => void;
}) {
  const mapRef = useRef<HTMLDivElement>(null);

  const scrollToMap = () => {
    mapRef.current?.scrollIntoView({ behavior: "smooth" });
    onEnterMap();
  };

  return (
    <div>
      {/* Section 1 — Grand Opening */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <img
          src={mural1}
          alt="石峁博物馆壁画 — 农耕文明"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/25 to-background" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
        {/* Edge feather vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 85% 80% at 50% 50%, transparent 35%, rgba(30,12,8,0.75) 100%)",
          }}
        />
        {/* Film grain */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.055]"
          style={{ mixBlendMode: "overlay" }}
        >
          <filter id="grain-s1">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.72"
              numOctaves="4"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect
            width="100%"
            height="100%"
            filter="url(#grain-s1)"
          />
        </svg>
        {/* Shimmer sweep */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(108deg, transparent 38%, rgba(255,210,140,0.055) 50%, transparent 62%)",
              animation:
                "shimmer-sweep 12s ease-in-out infinite",
              animationDelay: "1s",
            }}
          />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <p
            className="text-primary/80 text-sm tracking-[0.4em] uppercase mb-8"
            style={{ fontFamily: FE }}
          >
            ORIGINS OF CHINESE CIVILIZATION
          </p>
          <h1
            className="text-foreground leading-none mb-6 tracking-wider"
            style={{
              fontSize: "clamp(4rem, 11vw, 8.5rem)",
              fontFamily: FD,
            }}
          >
            中华文明探源
          </h1>
          <div className="h-px w-24 bg-primary/60 mx-auto mb-6" />
          <div className="space-y-2 text-primary/60 text-sm tracking-widest">
            <p>
              社会分化·文明曙光 &ensp;·&ensp; 古国四起·文明初成
            </p>
            <p>
              古国文明·高潮迭起 &ensp;·&ensp; 文明转型·王朝建立
            </p>
            <p>二十九处遗址，见证中华文明五千年破晓时刻</p>
          </div>
        </div>

        <button
          onClick={scrollToMap}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-primary/50 hover:text-primary transition-colors group"
        >
          <span className="text-xs tracking-widest">
            向下探索
          </span>
          <ChevronDown size={20} className="animate-bounce" />
        </button>
      </section>

      {/* Section 2 — 源 (Origin chapter) */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
        <img
          src={mural2}
          alt="石峁博物馆壁画 — 狩猎图"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/75 via-background/45 to-background/25" />
        {/* Top & bottom dissolve into background */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none" />
        {/* Edge feather vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 90% 85% at 60% 50%, transparent 30%, rgba(30,12,8,0.8) 100%)",
          }}
        />
        {/* Film grain */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.05]"
          style={{ mixBlendMode: "overlay" }}
        >
          <filter id="grain-s2">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.68"
              numOctaves="4"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect
            width="100%"
            height="100%"
            filter="url(#grain-s2)"
          />
        </svg>
        {/* Shimmer sweep */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(112deg, transparent 38%, rgba(255,210,140,0.05) 50%, transparent 62%)",
              animation:
                "shimmer-sweep 14s ease-in-out infinite",
              animationDelay: "4s",
            }}
          />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-8 py-24 w-full">
          {/* Chapter header */}
          <div className="flex items-start gap-8 mb-16">
            <div className="flex-1 pt-4">
              <p
                className="text-primary/60 text-sm tracking-[0.3em] uppercase mb-4"
                style={{ fontFamily: FE }}
              >
                CHAPTER ONE · ORIGIN
              </p>
              <p
                className="text-foreground/85 text-xl leading-relaxed mb-4"
                style={{ fontFamily: FD }}
              >
                源，聚多源之水，奔涌成流。
              </p>
              <p
                className="text-foreground/70 leading-relaxed mb-4"
                style={{ fontFamily: FD }}
              >
                数万年前，中华先民在黄河、长江、辽河等流域繁衍生息。他们以石为器，以土为陶，在广袤大地上书写最初的文明篇章；历经不断繁衍，逐渐由原始聚落演变为定居的农耕社会，表现为社会分工日趋复杂，礼仪制度初步显现，权力阶层悄然形成。
              </p>
              <p
                className="text-foreground/70 leading-relaxed"
                style={{ fontFamily: FD }}
              >
                中华文明的特质——多元一体、连绵不断、兼容并蓄——在这一时期已见雏形。探源，正是寻找这一切的起点，亦是理解当下中华文化生命力的必由之路。
              </p>
            </div>
            <div
              className="text-primary/75 leading-none flex-shrink-0 select-none"
              style={{
                fontSize: "clamp(9rem, 22vw, 16rem)",
                fontFamily: FD,
                textShadow:
                  "0 0 60px rgba(200,150,64,0.55), 0 0 120px rgba(200,150,64,0.28), 0 0 200px rgba(200,150,64,0.12)",
              }}
            >
              源
            </div>
          </div>

          {/* Chapter-block subdivisions — four phases */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4">
            {[
              {
                era: "社会分化",
                title: "文明曙光",
                text: "铸鼎原、城头山、东山村等遗址出现完整的建筑、稻田、墓葬等遗迹，文明开始起源。",
              },
              {
                era: "古国四起",
                title: "文明初成",
                text: "双槐树、鸡叫城、凌家滩等遗址开始出现祭坛、玉器以及高等级墓葬，文明开始多中心发展，古国初步形成。",
              },
              {
                era: "古国文明",
                title: "高潮迭起",
                text: "良渚、陶寺、石峁等遗址出现规模宏大的城址，各区域古国文明竞相繁荣，多元文化加速碰撞与整合。",
              },
              {
                era: "文明转型",
                title: "王朝建立",
                text: "二里头，三星堆、殷墟等遗址出土了青铜礼器、甲骨文使商代成为信史，王朝开始建立。",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="relative px-7 py-5 cursor-default"
                style={{
                  background: "rgba(200,165,110,0.13)",
                  border: "1px solid rgba(200,150,64,0.28)",
                }}
              >
                {/* 回字纹四角边框 */}
                {/* Top-left */}
                <svg
                  className="absolute top-0 left-0"
                  width="26"
                  height="26"
                  viewBox="0 0 26 26"
                  fill="none"
                >
                  <path
                    d="M0 26 L0 0 L26 0"
                    stroke="rgba(200,150,64,0.55)"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M4 22 L4 4 L22 4"
                    stroke="rgba(200,150,64,0.32)"
                    strokeWidth="0.9"
                  />
                  <path
                    d="M8 18 L8 8 L18 8"
                    stroke="rgba(200,150,64,0.20)"
                    strokeWidth="0.7"
                  />
                </svg>
                {/* Top-right */}
                <svg
                  className="absolute top-0 right-0"
                  width="26"
                  height="26"
                  viewBox="0 0 26 26"
                  fill="none"
                >
                  <path
                    d="M26 26 L26 0 L0 0"
                    stroke="rgba(200,150,64,0.55)"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M22 22 L22 4 L4 4"
                    stroke="rgba(200,150,64,0.32)"
                    strokeWidth="0.9"
                  />
                  <path
                    d="M18 18 L18 8 L8 8"
                    stroke="rgba(200,150,64,0.20)"
                    strokeWidth="0.7"
                  />
                </svg>
                {/* Bottom-left */}
                <svg
                  className="absolute bottom-0 left-0"
                  width="26"
                  height="26"
                  viewBox="0 0 26 26"
                  fill="none"
                >
                  <path
                    d="M0 0 L0 26 L26 26"
                    stroke="rgba(200,150,64,0.55)"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M4 4 L4 22 L22 22"
                    stroke="rgba(200,150,64,0.32)"
                    strokeWidth="0.9"
                  />
                  <path
                    d="M8 8 L8 18 L18 18"
                    stroke="rgba(200,150,64,0.20)"
                    strokeWidth="0.7"
                  />
                </svg>
                {/* Bottom-right */}
                <svg
                  className="absolute bottom-0 right-0"
                  width="26"
                  height="26"
                  viewBox="0 0 26 26"
                  fill="none"
                >
                  <path
                    d="M26 0 L26 26 L0 26"
                    stroke="rgba(200,150,64,0.55)"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M22 4 L22 22 L4 22"
                    stroke="rgba(200,150,64,0.32)"
                    strokeWidth="0.9"
                  />
                  <path
                    d="M18 8 L18 18 L8 18"
                    stroke="rgba(200,150,64,0.20)"
                    strokeWidth="0.7"
                  />
                </svg>
                {/* Connecting lines */}
                <div
                  className="absolute top-0 left-[26px] right-[26px] h-px"
                  style={{
                    background: "rgba(200,150,64,0.35)",
                  }}
                />
                <div
                  className="absolute bottom-0 left-[26px] right-[26px] h-px"
                  style={{
                    background: "rgba(200,150,64,0.35)",
                  }}
                />
                <div
                  className="absolute left-0 top-[26px] bottom-[26px] w-px"
                  style={{
                    background: "rgba(200,150,64,0.35)",
                  }}
                />
                <div
                  className="absolute right-0 top-[26px] bottom-[26px] w-px"
                  style={{
                    background: "rgba(200,150,64,0.35)",
                  }}
                />
                {/* Content */}
                <div
                  className="text-xs tracking-[0.32em] mb-2 text-primary/50"
                  style={{ fontFamily: FH }}
                >
                  {card.era}
                </div>
                <h3
                  className="text-2xl mb-3 leading-snug text-primary"
                  style={{
                    fontFamily: FD,
                    textShadow:
                      "0 0 20px rgba(200,150,64,0.40)",
                  }}
                >
                  {card.title}
                </h3>
                <p className="text-sm leading-relaxed text-foreground/75">
                  {card.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3 — 流 (Civilizational flow) */}
      <section className="relative flex items-center overflow-hidden">
        <img
          src={mural3}
          alt="石峁博物馆壁画 — 玉首骑马图"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/75 via-background/45 to-background/20" />
        {/* Top & bottom dissolve into background */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none" />
        {/* Edge feather vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 90% 85% at 40% 50%, transparent 30%, rgba(30,12,8,0.8) 100%)",
          }}
        />
        {/* Film grain */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.05]"
          style={{ mixBlendMode: "overlay" }}
        >
          <filter id="grain-s3">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.70"
              numOctaves="4"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect
            width="100%"
            height="100%"
            filter="url(#grain-s3)"
          />
        </svg>
        {/* Shimmer sweep */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(105deg, transparent 38%, rgba(255,210,140,0.05) 50%, transparent 62%)",
              animation:
                "shimmer-sweep 11s ease-in-out infinite",
              animationDelay: "7s",
            }}
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-8 py-14 w-full">
          <div className="flex items-start gap-8">
            {/* Left: monumental character + water decoration */}
            <div className="hidden lg:flex flex-col items-start gap-6 flex-shrink-0">
              <div
                className="text-primary/70 leading-none select-none"
                style={{
                  fontSize: "clamp(8rem, 16vw, 14rem)",
                  fontFamily: FD,
                  textShadow:
                    "0 0 50px rgba(200,150,64,0.50), 0 0 100px rgba(200,150,64,0.25), 0 0 180px rgba(200,150,64,0.10)",
                }}
              >
                流
              </div>
              {/* Water wave SVG decoration */}
              <svg
                width="260"
                height="80"
                viewBox="0 0 260 80"
                className="opacity-25"
              >
                <defs>
                  <linearGradient
                    id="waveGrad"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="transparent" />
                    <stop offset="50%" stopColor="#c9a227" />
                    <stop
                      offset="100%"
                      stopColor="transparent"
                    />
                  </linearGradient>
                </defs>
                <path
                  d="M0 40 Q32 20 65 40 Q98 60 130 40 Q162 20 195 40 Q228 60 260 40"
                  fill="none"
                  stroke="url(#waveGrad)"
                  strokeWidth="1.5"
                />
                <path
                  d="M0 55 Q32 35 65 55 Q98 75 130 55 Q162 35 195 55 Q228 75 260 55"
                  fill="none"
                  stroke="url(#waveGrad)"
                  strokeWidth="1"
                  opacity="0.6"
                />
                <path
                  d="M0 25 Q32 10 65 25 Q98 40 130 25 Q162 10 195 25 Q228 40 260 25"
                  fill="none"
                  stroke="url(#waveGrad)"
                  strokeWidth="0.7"
                  opacity="0.4"
                />
              </svg>
              {/* Classic water poetry */}
              <div className="text-left space-y-1">
                <p className="text-primary/30 text-xs tracking-[0.3em]">
                  上善若水
                </p>
                <p className="text-primary/20 text-xs tracking-[0.3em]">
                  水善利萬物而不爭
                </p>
                <p className="text-muted-foreground/20 text-xs tracking-widest">
                  ——《道德经》
                </p>
              </div>
            </div>
            {/* Right: theme chapters */}
            <div className="flex-1">
              <p
                className="text-primary/60 text-sm tracking-[0.3em] uppercase mb-8"
                style={{ fontFamily: FE }}
              >
                CHAPTER TWO · CONTINUITY
              </p>
              <div className="relative pl-6">
                <div className="absolute left-0 top-2 bottom-2 w-px bg-primary/30" />
                {[
                  {
                    zh: "血脉相依",
                    en: "Bound by Blood",
                    desc: "中华民族由多民族凝聚而成，血肉相连，唇齿相依。在共同的历史长河中，各民族共同开辟了辽阔疆域，共同书写了悠久历史。",
                  },
                  {
                    zh: "和衷共济",
                    en: "United in Purpose",
                    desc: "面对洪水、旱灾与外部挑战，中华先民学会了协同作战。大型水利工程与防御城垣，是集体意志凝聚的最好见证。",
                  },
                  {
                    zh: "休戚与共",
                    en: "Sharing Weal & Woe",
                    desc: "文明的传递从未中断。每一次朝代更迭，文化积淀非但没有消失，反而在碰撞与融合中愈加丰厚。",
                  },
                ].map((item, i) => (
                  <div key={item.zh} className="mb-10 group">
                    <div
                      className="absolute left-0 w-2 h-2 rounded-full bg-primary/40 -translate-x-1/2 mt-2.5"
                      style={{ top: `${i * 152 + 8}px` }}
                    />
                    <div
                      className="text-primary/50 text-sm tracking-widest mb-1"
                      style={{ fontFamily: FE }}
                    >
                      {item.en}
                    </div>
                    <h3
                      className="text-foreground/90 text-3xl mb-3"
                      style={{ fontFamily: FD }}
                    >
                      {item.zh}
                    </h3>
                    <p
                      className="text-muted-foreground text-base leading-relaxed"
                      style={{ fontFamily: FD }}
                    >
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4 — 汇 (Convergence) */}
      <section className="relative flex flex-col justify-center overflow-hidden">
        <img
          src={mural1}
          alt="石峁博物馆壁画 — 先民生活"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-l from-background/75 via-background/50 to-background/30" />
        {/* Top & bottom dissolve into background */}
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background pointer-events-none" />
        {/* Edge feather vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 88% 82% at 50% 55%, transparent 32%, rgba(30,12,8,0.82) 100%)",
          }}
        />
        {/* Film grain */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.05]"
          style={{ mixBlendMode: "overlay" }}
        >
          <filter id="grain-s4">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.74"
              numOctaves="4"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect
            width="100%"
            height="100%"
            filter="url(#grain-s4)"
          />
        </svg>
        {/* Shimmer sweep */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(100deg, transparent 38%, rgba(255,210,140,0.05) 50%, transparent 62%)",
              animation:
                "shimmer-sweep 13s ease-in-out infinite",
              animationDelay: "10s",
            }}
          />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-8 py-14 w-full">
          <div className="flex items-start gap-8">
            {/* Left: theme chapters — mirrored from 流, text right-aligned */}
            <div className="flex-1">
              <p
                className="text-primary/60 text-sm tracking-[0.3em] uppercase mb-8 text-right"
                style={{ fontFamily: FE }}
              >
                CHAPTER THREE · CONFLUENCE
              </p>
              <div className="relative pr-6">
                <div className="absolute right-0 top-2 bottom-2 w-px bg-primary/30" />
                {[
                  {
                    zh: "万川归海",
                    en: "All Rivers to the Sea",
                    desc: "黄河、长江、辽河流域的各支文明，在数千年的碰撞与交融中，汇聚成中华文明多元一体的宏大格局。",
                  },
                  {
                    zh: "礼制一统",
                    en: "Unified Ritual Order",
                    desc: "玉器礼制、鼎食文化、宫室制度——多元起源的礼仪要素在二里头时代整合为统一体系，奠定华夏文明的精神内核。",
                  },
                  {
                    zh: "文脉绵延",
                    en: "Unbroken Cultural Thread",
                    desc: "中华文明是世界上唯一从未中断的古老文明。每一次历史的转折，都在传承中积累，在融汇中升华。",
                  },
                ].map((item, i) => (
                  <div
                    key={item.zh}
                    className="mb-10 text-right"
                  >
                    <div
                      className="absolute right-0 w-2 h-2 rounded-full bg-primary/40 translate-x-1/2 mt-2.5"
                      style={{ top: `${i * 152 + 8}px` }}
                    />
                    <div
                      className="text-primary/50 text-sm tracking-widest mb-1"
                      style={{ fontFamily: FE }}
                    >
                      {item.en}
                    </div>
                    <h3
                      className="text-foreground/90 text-3xl mb-3"
                      style={{ fontFamily: FD }}
                    >
                      {item.zh}
                    </h3>
                    <p
                      className="text-muted-foreground text-base leading-relaxed"
                      style={{ fontFamily: FD }}
                    >
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            {/* Right: monumental character + decoration — mirrored from 流's left */}
            <div className="hidden lg:flex flex-col items-end gap-6 flex-shrink-0">
              <div
                className="text-primary/70 leading-none select-none"
                style={{
                  fontSize: "clamp(8rem, 16vw, 14rem)",
                  fontFamily: FD,
                  textShadow:
                    "0 0 50px rgba(200,150,64,0.50), 0 0 100px rgba(200,150,64,0.25), 0 0 180px rgba(200,150,64,0.10)",
                }}
              >
                汇
              </div>
              {/* Decorative SVG — mirrored wave */}
              <svg
                width="260"
                height="80"
                viewBox="0 0 260 80"
                className="opacity-25"
              >
                <defs>
                  <linearGradient
                    id="waveGrad2"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="transparent" />
                    <stop offset="50%" stopColor="#c9a227" />
                    <stop
                      offset="100%"
                      stopColor="transparent"
                    />
                  </linearGradient>
                </defs>
                <path
                  d="M0 40 Q32 20 65 40 Q98 60 130 40 Q162 20 195 40 Q228 60 260 40"
                  fill="none"
                  stroke="url(#waveGrad2)"
                  strokeWidth="1.5"
                />
                <path
                  d="M0 55 Q32 35 65 55 Q98 75 130 55 Q162 35 195 55 Q228 75 260 55"
                  fill="none"
                  stroke="url(#waveGrad2)"
                  strokeWidth="1"
                  opacity="0.6"
                />
                <path
                  d="M0 25 Q32 10 65 25 Q98 40 130 25 Q162 10 195 25 Q228 40 260 25"
                  fill="none"
                  stroke="url(#waveGrad2)"
                  strokeWidth="0.7"
                  opacity="0.4"
                />
              </svg>
              <div className="text-right space-y-1">
                <p className="text-primary/30 text-xs tracking-[0.3em]">
                  殊途同归
                </p>
                <p className="text-primary/20 text-xs tracking-[0.3em]">
                  天下大同·华夏一统
                </p>
                <p className="text-muted-foreground/20 text-xs tracking-widest">
                  ——《礼记·礼运》
                </p>
              </div>
            </div>
          </div>

          {/* Bottom convergence grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {[
              {
                title: "玉帛交流",
                sub: "Jade & Silk Exchange",
                text: "玉器礼制自辽河向南传播，丝绸纺织由太湖流域向北扩散，物质文化的交换网络串联起史前中国各区域。",
              },
              {
                title: "礼制共融",
                sub: "Convergence of Ritual Forms",
                text: "良渚的玉琮、红山的玉猪龙、仰韶的彩陶纹样，诸多文明符号在中原汇流整合，化为华夏共同的文化基因。",
              },
              {
                title: "文字同源",
                sub: "Common Origins of Script",
                text: "从大汶口刻划符号到良渚刻文，文字的雏形在多地同步萌芽，历经商周甲骨金文，最终汇流为华夏共同语言。",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="relative px-7 py-3 transition-transform duration-300 hover:-translate-y-2 cursor-default"
                style={{
                  background: "rgba(200,165,110,0.13)",
                  border: "1px solid rgba(200,150,64,0.28)",
                }}
              >
                {/* 回字纹四角边框 */}
                {/* Top-left */}
                <svg
                  className="absolute top-0 left-0"
                  width="26"
                  height="26"
                  viewBox="0 0 26 26"
                  fill="none"
                >
                  <path
                    d="M0 26 L0 0 L26 0"
                    stroke="rgba(200,150,64,0.55)"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M4 22 L4 4 L22 4"
                    stroke="rgba(200,150,64,0.32)"
                    strokeWidth="0.9"
                  />
                  <path
                    d="M8 18 L8 8 L18 8"
                    stroke="rgba(200,150,64,0.20)"
                    strokeWidth="0.7"
                  />
                </svg>
                {/* Top-right */}
                <svg
                  className="absolute top-0 right-0"
                  width="26"
                  height="26"
                  viewBox="0 0 26 26"
                  fill="none"
                >
                  <path
                    d="M26 26 L26 0 L0 0"
                    stroke="rgba(200,150,64,0.55)"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M22 22 L22 4 L4 4"
                    stroke="rgba(200,150,64,0.32)"
                    strokeWidth="0.9"
                  />
                  <path
                    d="M18 18 L18 8 L8 8"
                    stroke="rgba(200,150,64,0.20)"
                    strokeWidth="0.7"
                  />
                </svg>
                {/* Bottom-left */}
                <svg
                  className="absolute bottom-0 left-0"
                  width="26"
                  height="26"
                  viewBox="0 0 26 26"
                  fill="none"
                >
                  <path
                    d="M0 0 L0 26 L26 26"
                    stroke="rgba(200,150,64,0.55)"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M4 4 L4 22 L22 22"
                    stroke="rgba(200,150,64,0.32)"
                    strokeWidth="0.9"
                  />
                  <path
                    d="M8 8 L8 18 L18 18"
                    stroke="rgba(200,150,64,0.20)"
                    strokeWidth="0.7"
                  />
                </svg>
                {/* Bottom-right */}
                <svg
                  className="absolute bottom-0 right-0"
                  width="26"
                  height="26"
                  viewBox="0 0 26 26"
                  fill="none"
                >
                  <path
                    d="M26 0 L26 26 L0 26"
                    stroke="rgba(200,150,64,0.55)"
                    strokeWidth="1.2"
                  />
                  <path
                    d="M22 4 L22 22 L4 22"
                    stroke="rgba(200,150,64,0.32)"
                    strokeWidth="0.9"
                  />
                  <path
                    d="M18 8 L18 18 L8 18"
                    stroke="rgba(200,150,64,0.20)"
                    strokeWidth="0.7"
                  />
                </svg>
                {/* Connecting lines */}
                <div
                  className="absolute top-0 left-[26px] right-[26px] h-px"
                  style={{
                    background: "rgba(200,150,64,0.35)",
                  }}
                />
                <div
                  className="absolute bottom-0 left-[26px] right-[26px] h-px"
                  style={{
                    background: "rgba(200,150,64,0.35)",
                  }}
                />
                <div
                  className="absolute left-0 top-[26px] bottom-[26px] w-px"
                  style={{
                    background: "rgba(200,150,64,0.35)",
                  }}
                />
                <div
                  className="absolute right-0 top-[26px] bottom-[26px] w-px"
                  style={{
                    background: "rgba(200,150,64,0.35)",
                  }}
                />
                {/* Content */}
                <div
                  className="text-xs tracking-[0.2em] uppercase mb-2 text-primary/50"
                  style={{ fontFamily: FE }}
                >
                  {card.sub}
                </div>
                <h3
                  className="text-2xl mb-3 leading-snug text-primary"
                  style={{
                    fontFamily: FD,
                    textShadow:
                      "0 0 20px rgba(200,150,64,0.40)",
                  }}
                >
                  {card.title}
                </h3>
                <p className="text-sm leading-relaxed text-foreground/75">
                  {card.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transition bridge */}
      <div
        ref={mapRef}
        className="relative py-16 flex flex-col items-center gap-4 overflow-hidden"
      >
        <img
          src={mural1}
          alt="石峁壁画·劳作图"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/60 to-background" />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <div className="h-px w-64 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
          <GoldDiamond />
          <p className="text-foreground/60 text-sm tracking-[0.3em]">
            探索二十九处文明遗址
          </p>
          <p className="text-muted-foreground text-xs tracking-wider">
            选择时代或文化域，在地图上定位遗址坐标
          </p>
          <div className="h-px w-64 bg-gradient-to-r from-transparent via-primary/60 to-transparent mt-2" />
        </div>
      </div>
    </div>
  );
}

// ─── Horizontal Timeline ──────────────────────────────────────────────────────

function HorizontalTimeline({
  active,
  onChange,
}: {
  active: string;
  onChange: (key: string) => void;
}) {
  return (
    <div className="relative w-full py-6 overflow-x-auto">
      {/* Background ruler line */}
      <div className="absolute top-1/2 left-8 right-8 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent -translate-y-3" />

      <div
        className="flex items-center justify-between min-w-max px-8 gap-12 mx-auto"
        style={{ maxWidth: "900px" }}
      >
        {ERA_NODES.map((era) => {
          const isActive = active === era.key;
          return (
            <button
              key={era.key}
              onClick={() => onChange(era.key)}
              className="flex flex-col items-center gap-1.5 group relative"
            >
              {/* Phase first-name above */}
              <span
                className={`text-xs tracking-wider transition-colors whitespace-nowrap ${isActive ? "text-primary/80" : "text-muted-foreground/50"}`}
                style={{ fontFamily: FH }}
              >
                {era.top}
              </span>

              {/* Node dot */}
              <div className="relative flex items-center justify-center my-1">
                {isActive && (
                  <span className="absolute w-5 h-5 rounded-full bg-primary/30 animate-ping" />
                )}
                {era.glyph ? (
                  <span
                    className={`text-sm transition-colors ${isActive ? "text-primary" : "text-muted-foreground/40 group-hover:text-primary/60"}`}
                  >
                    {era.glyph}
                  </span>
                ) : (
                  <span
                    className={`block w-3 h-3 rounded-full border-2 transition-all duration-200 ${
                      isActive
                        ? "border-primary bg-primary scale-125"
                        : "border-muted-foreground/40 bg-background group-hover:border-primary/60"
                    }`}
                  />
                )}
              </div>

              {/* Era label below */}
              <span
                className={`text-sm tracking-wider transition-colors whitespace-nowrap ${isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground/70"}`}
                style={{ fontFamily: FH }}
              >
                {era.label}
              </span>

              {/* Date / keyword */}
              <span
                className={`text-xs tracking-widest transition-colors ${isActive ? "text-primary/70" : "text-muted-foreground/30"}`}
                style={{ fontFamily: FE }}
              >
                {era.keyword}
              </span>

              {/* Active underline */}
              {isActive && (
                <span className="absolute -bottom-1 left-0 right-0 h-px bg-primary" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Module 1: 时空探源 ───────────────────────────────────────────────────────

function ModuleTimeSpace() {
  const [timePeriod, setTimePeriod] = useState("全部");
  const [domain, setDomain] = useState("全部");
  const [selectedSite, setSelectedSite] = useState<Site | null>(
    null,
  );
  const [drawerTab, setDrawerTab] = useState<
    "介绍" | "导航" | "周边"
  >("介绍");
  const [showPrologue, setShowPrologue] = useState(true);
  const [watchedVideos, setWatchedVideos] = useState<
    Set<number>
  >(new Set());
  const [onlineCheckedIn, setOnlineCheckedIn] = useState<
    Set<number>
  >(new Set());
  // 高德地图相关状态
  const mapRef = useRef<HTMLDivElement>(null);
  const amapRef = useRef<any>(null);
  const [amapReady, setAmapReady] = useState(false);

  const filtered = SITES.filter((s) => {
    const timeOk =
      timePeriod === "全部" || s.period === timePeriod;
    const domainOk =
      domain === "全部" ||
      (domain === "黄河流域" && s.domain === "黄河") ||
      (domain === "长江流域" && s.domain === "长江") ||
      (domain === "其他地区" && s.domain === "其他");
    return timeOk && domainOk;
  });

  // ─── 高德地图初始化（动态加载 SDK） ──────────────────────────────
  useEffect(() => {
    if (!mapRef.current || amapRef.current) return;
    const Win = window as any;

    const createMapAndMarkers = () => {
      if (!mapRef.current) return;
      const map = new Win.AMap.Map(mapRef.current, {
        center: AMAP_CONFIG.defaultCenter,
        zoom: AMAP_CONFIG.defaultZoom,
        mapStyle: "amap://styles/dark",
      });
      amapRef.current = map;

      const markers: any[] = [];
      SITES.forEach((site) => {
        const marker = new Win.AMap.Marker({
          position: [site.lng, site.lat],
          title: site.name,
          label: {
            content:
              '<div style="color:#c9a227;font-size:10px;font-weight:bold;text-shadow:0 0 6px rgba(200,150,64,0.6)">◆</div>',
            offset: new Win.AMap.Pixel(0, -8),
          },
        });
        marker.on("click", () => {
          setSelectedSite(site);
          setDrawerTab("介绍");
        });
        markers.push(marker);
      });
      map.add(markers);
      map.setFitView(null, false, [60, 60, 60, 60]);
      setAmapReady(true);
    };

    // 若 AMap 已加载，直接初始化
    if (Win.AMap) {
      createMapAndMarkers();
      return;
    }

    // key 为空 → 保留示意地图，不加载 SDK
    const key = AMAP_CONFIG.key;
    if (!key || key === "YOUR_AMAP_API_KEY_HERE") {
      console.warn("[地图] 待填入高德 API Key（高德api/config.js → AMAP_CONFIG.key）");
      return;
    }

    const script = document.createElement("script");
    script.src = `https://webapi.amap.com/maps?v=${AMAP_CONFIG.version}&key=${key}&plugin=${AMAP_CONFIG.plugins.join(",")}`;
    script.onload = () => createMapAndMarkers();
    script.onerror = () =>
      console.error("[地图] 高德 SDK 加载失败，请检查 API Key 和网络");
    document.head.appendChild(script);

    return () => {
      if (amapRef.current) {
        amapRef.current.destroy();
        amapRef.current = null;
      }
    };
  }, []);

  // ─── 筛选变化时更新地图标记 ──────────────────────────────────────
  useEffect(() => {
    if (!amapRef.current || !(window as any).AMap) return;
    const map = amapRef.current;
    map.clearMap();

    const markers: any[] = [];
    filtered.forEach((site) => {
      const marker = new (window as any).AMap.Marker({
        position: [site.lng, site.lat],
        title: site.name,
        label: {
          content:
            '<div style="color:#c9a227;font-size:10px;font-weight:bold;text-shadow:0 0 6px rgba(200,150,64,0.6)">◆</div>',
          offset: new (window as any).AMap.Pixel(0, -8),
        },
      });
      marker.on("click", () => {
        setSelectedSite(site);
        setDrawerTab("介绍");
      });
      markers.push(marker);
    });
    map.add(markers);
  }, [filtered]);

  return (
    <div className="min-h-screen">
      {showPrologue && (
        <CinematicPrologue onEnterMap={() => {}} />
      )}

      {/* Sticky filter bar */}
      <div className="sticky top-16 z-30 bg-background/95 backdrop-blur-md border-b border-border px-6">
        <div className="max-w-7xl mx-auto">
          {/* Timeline */}
          <HorizontalTimeline
            active={timePeriod}
            onChange={setTimePeriod}
          />

          {/* Domain filter + site count */}
          <div className="flex items-center gap-3 pb-3 flex-wrap">
            <span className="text-muted-foreground text-xs tracking-widest">
              文化域
            </span>
            {DOMAINS.map((d) => (
              <button
                key={d}
                onClick={() => setDomain(d)}
                className={`px-4 py-1 text-xs tracking-widest border transition-all duration-200 ${
                  domain === d
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                {d}
              </button>
            ))}
            <span className="ml-auto text-muted-foreground text-xs">
              显示{" "}
              <span className="text-primary">
                {filtered.length}
              </span>{" "}
              / 29 处遗址
            </span>
          </div>
        </div>
      </div>

      {/* Map + Drawer */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex gap-4">
          {/* Map */}
          <div
            ref={mapRef}
            className="flex-1 relative border border-border overflow-hidden"
            style={{ height: "520px" }}
          >
            {/* 未配置高德 Key 时的示意地图（石峁壁画 + 比例定位点） */}
            {!amapReady && (
              <>
                {/* Map background — mural tinted */}
                <img
                  src={mural2}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover opacity-8"
                />
                <div className="absolute inset-0 bg-background/70" />

                {/* Grid lines */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(201,162,39,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(201,162,39,0.3) 1px, transparent 1px)",
                    backgroundSize: "60px 60px",
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-primary/15 text-sm tracking-[0.3em]">
                    示意地图 · 在高德api/config.js 填入 Key 后切换真实地图
                  </span>
                </div>

                {/* Markers */}
                {filtered.map((site) => (
                  <button
                    key={site.id}
                    onClick={() => {
                      setSelectedSite(site);
                      setDrawerTab("介绍");
                    }}
                    style={{
                      left: `${site.x}%`,
                      top: `${site.y}%`,
                    }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group z-10"
                    title={site.name}
                  >
                    <div
                      className={`relative transition-all duration-200 ${selectedSite?.id === site.id ? "scale-150" : "hover:scale-125"}`}
                    >
                      {site.status === "实地打卡" && (
                        <>
                          <div className="absolute inset-0 w-4 h-4 rounded-full bg-primary animate-ping opacity-25" />
                          <div className="w-4 h-4 rounded-full bg-primary border-2 border-primary-foreground shadow-lg shadow-primary/40" />
                        </>
                      )}
                      {site.status === "线上打卡" && (
                        <div className="w-3.5 h-3.5 rounded-full bg-secondary border border-secondary/60" />
                      )}
                      {site.status === "未打卡" && (
                        <div
                          className="w-3 h-3 border border-muted-foreground/40 bg-muted/50"
                          style={{
                            clipPath:
                              "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                          }}
                        />
                      )}
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                        <div className="bg-card border border-border px-2 py-1 text-xs text-foreground shadow-lg">
                          {site.name}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </>
            )}

            {/* Legend */}
            <div className="absolute bottom-3 left-3 z-10 bg-background/85 backdrop-blur-sm border border-border p-3 space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-3 h-3 rounded-full bg-primary" />
                实地打卡
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-3 h-3 rounded-full bg-secondary" />
                线上打卡
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div
                  className="w-3 h-3 border border-muted-foreground/40"
                  style={{
                    clipPath:
                      "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                  }}
                />
                未打卡
              </div>
            </div>
          </div>

          {/* Drawer — 展柜纵幅 */}
          <div
            className={`overflow-hidden transition-all duration-300 flex-shrink-0 ${selectedSite ? "w-80 opacity-100" : "w-0 opacity-0"}`}
            style={{ height: "520px" }}
          >
            {selectedSite && (
              <div
                className="w-80 h-full flex flex-col relative"
                style={{
                  background:
                    "linear-gradient(160deg, rgba(72,30,12,0.98) 0%, rgba(48,18,6,1) 60%, rgba(88,36,14,0.96) 100%)",
                  border: "1px solid rgba(200,150,64,0.25)",
                }}
              >
                {/* 回字纹四角 — 整个抽屉 */}
                {(
                  [
                    [
                      "top-0 left-0",
                      "M0 22 L0 0 L22 0",
                      "M3 19 L3 3 L19 3",
                    ],
                    [
                      "top-0 right-0",
                      "M22 22 L22 0 L0 0",
                      "M19 19 L19 3 L3 3",
                    ],
                    [
                      "bottom-0 left-0",
                      "M0 0 L0 22 L22 22",
                      "M3 3 L3 19 L19 19",
                    ],
                    [
                      "bottom-0 right-0",
                      "M22 0 L22 22 L0 22",
                      "M19 3 L19 19 L3 19",
                    ],
                  ] as const
                ).map(([pos, p1, p2]) => (
                  <svg
                    key={pos}
                    className={`absolute ${pos} pointer-events-none z-20`}
                    width="22"
                    height="22"
                    viewBox="0 0 22 22"
                    fill="none"
                  >
                    <path
                      d={p1}
                      stroke="rgba(200,150,64,0.55)"
                      strokeWidth="1"
                    />
                    <path
                      d={p2}
                      stroke="rgba(200,150,64,0.25)"
                      strokeWidth="0.7"
                    />
                  </svg>
                ))}

                {/* Image floats above card body — same as 方案三 */}
                <div
                  className="flex-shrink-0 relative z-10 mx-3 mt-3 overflow-hidden"
                  style={{
                    height: "162px",
                    boxShadow:
                      "0 8px 32px rgba(0,0,0,0.65), 0 0 0 1px rgba(200,150,64,0.22)",
                  }}
                >
                  <img
                    src={
                      selectedSite.id === 17
                        ? liangzhuArtifact
                        : selectedSite.id === 21
                          ? taosiArtifact
                          : selectedSite.id === 27
                            ? yinxuArtifact
                            : selectedSite.id === 28
                              ? sanxingduiArtifact
                              : getSiteMainImage(selectedSite.name) ??
                                DRAWER_IMGS[selectedSite.id % 3]
                    }
                    alt={selectedSite.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    style={{
                      filter: "brightness(0.82) contrast(1.06)",
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  {/* Display-case bottom spotlight */}
                  <div
                    className="absolute bottom-0 left-0 right-0 h-10"
                    style={{
                      background:
                        "radial-gradient(ellipse 80% 100% at 50% 100%, rgba(200,150,64,0.26), transparent)",
                    }}
                  />
                  {/* Culture tag */}
                  <div
                    className="absolute top-2 right-2 px-1.5 py-0.5"
                    style={{
                      background: "rgba(40,16,6,0.85)",
                      border: "1px solid rgba(200,150,64,0.30)",
                    }}
                  >
                    <span
                      className="text-[9px] tracking-[0.2em]"
                      style={{
                        color: "rgba(200,150,64,0.75)",
                        fontFamily: FH,
                      }}
                    >
                      {selectedSite.culture}
                    </span>
                  </div>
                  {/* Close button */}
                  <button
                    onClick={() => setSelectedSite(null)}
                    className="absolute top-2 left-2 w-5 h-5 flex items-center justify-center transition-opacity hover:opacity-60"
                    style={{
                      background: "rgba(40,16,6,0.75)",
                      border: "1px solid rgba(200,150,64,0.22)",
                      color: "rgba(200,150,64,0.65)",
                    }}
                  >
                    <X size={10} />
                  </button>
                </div>

                {/* Card body — overlap image by 8px */}
                <div
                  className="relative flex flex-col flex-1 -mt-2 overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(160deg, rgba(72,30,12,0.97) 0%, rgba(48,18,6,1) 60%, rgba(88,36,14,0.95) 100%)",
                    borderTop:
                      "1px solid rgba(200,150,64,0.18)",
                  }}
                >
                  {/* Spotlight glow at top of card body */}
                  <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-10 pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(ellipse at 50% 0%, rgba(200,150,64,0.22), transparent 70%)",
                    }}
                  />

                  {/* Site name */}
                  <div className="px-4 pt-4 pb-2 text-center flex-shrink-0">
                    <h3
                      className="text-2xl leading-tight"
                      style={{
                        fontFamily: FD,
                        color: "rgba(240,215,165,0.95)",
                        textShadow:
                          "0 0 24px rgba(200,150,64,0.45)",
                      }}
                    >
                      {selectedSite.name}
                    </h3>
                    <div
                      className="h-px mt-2"
                      style={{
                        background:
                          "linear-gradient(to right, transparent, rgba(200,150,64,0.40), transparent)",
                      }}
                    />
                  </div>

                  {/* Tab bar */}
                  <div className="flex flex-shrink-0 px-4 pb-1">
                    {(["介绍", "导航", "周边"] as const).map(
                      (t) => (
                        <button
                          key={t}
                          onClick={() => setDrawerTab(t)}
                          className="flex-1 py-1.5 text-[10px] tracking-[0.3em] transition-colors"
                          style={{
                            fontFamily: FH,
                            color:
                              drawerTab === t
                                ? "rgba(200,150,64,0.90)"
                                : "rgba(200,150,64,0.30)",
                            borderBottom:
                              drawerTab === t
                                ? "1px solid rgba(200,150,64,0.65)"
                                : "1px solid rgba(200,150,64,0.10)",
                          }}
                        >
                          {t === "介绍"
                            ? "遗址介绍"
                            : t === "导航"
                              ? "路线导航"
                              : "周边配套"}
                        </button>
                      ),
                    )}
                  </div>

                  {/* Scrollable content */}
                  <div
                    className="flex-1 overflow-y-auto"
                    style={{ scrollbarWidth: "none" }}
                  >
                    {drawerTab === "介绍" &&
                      (() => {
                        const video =
                          SITE_VIDEOS[selectedSite.id];
                        const hasWatched = watchedVideos.has(
                          selectedSite.id,
                        );
                        const hasCheckedIn =
                          onlineCheckedIn.has(
                            selectedSite.id,
                          ) || selectedSite.status !== "未打卡";
                        return (
                          <div className="px-4 pt-3 pb-5 space-y-3">
                            {/* Meta fields */}
                            <div
                              className="space-y-2 pb-3"
                              style={{
                                borderBottom:
                                  "1px solid rgba(200,150,64,0.12)",
                              }}
                            >
                              {[
                                {
                                  label: "地　点",
                                  value: selectedSite.location,
                                },
                                {
                                  label: "文化域",
                                  value: selectedSite.domain,
                                },
                              ].map((row) => (
                                <div
                                  key={row.label}
                                  className="flex items-baseline justify-between"
                                >
                                  <span
                                    className="text-[10px] tracking-[0.2em] flex-shrink-0"
                                    style={{
                                      color:
                                        "rgba(200,150,64,0.65)",
                                      fontFamily: FH,
                                    }}
                                  >
                                    {row.label}
                                  </span>
                                  <div
                                    className="flex-1 mx-2 border-b border-dotted"
                                    style={{
                                      borderColor:
                                        "rgba(200,150,64,0.18)",
                                    }}
                                  />
                                  <span
                                    className="text-xs tracking-wide"
                                    style={{
                                      color:
                                        "rgba(240,215,165,0.82)",
                                    }}
                                  >
                                    {row.value}
                                  </span>
                                </div>
                              ))}
                            </div>

                            {/* Brief */}
                            <p
                              className="text-xs leading-relaxed"
                              style={{
                                color: "rgba(220,195,150,0.78)",
                                fontFamily: FH,
                              }}
                            >
                              {selectedSite.brief}
                            </p>

                            {/* 相关纪录片 */}
                            {video && (
                              <div
                                className="pt-2.5 space-y-2"
                                style={{
                                  borderTop:
                                    "1px solid rgba(200,150,64,0.12)",
                                }}
                              >
                                <div
                                  className="flex items-center gap-1.5 text-[10px] tracking-[0.3em]"
                                  style={{
                                    color:
                                      "rgba(200,150,64,0.68)",
                                    fontFamily: FH,
                                  }}
                                >
                                  <svg
                                    width="9"
                                    height="9"
                                    viewBox="0 0 12 12"
                                    fill="none"
                                  >
                                    <rect
                                      x="1"
                                      y="2"
                                      width="10"
                                      height="8"
                                      rx="1"
                                      stroke="currentColor"
                                      strokeWidth="1.2"
                                    />
                                    <path
                                      d="M4.5 4.5L8 6L4.5 7.5V4.5Z"
                                      fill="currentColor"
                                    />
                                  </svg>
                                  相关纪录片
                                </div>
                                <p
                                  className="text-xs leading-snug"
                                  style={{
                                    color:
                                      "rgba(240,215,165,0.88)",
                                    fontFamily: FH,
                                  }}
                                >
                                  {video.title}
                                </p>
                                <div className="flex items-center gap-2">
                                  <span
                                    className="text-[10px] px-1.5 py-0.5 tracking-wide"
                                    style={{
                                      background:
                                        "rgba(200,150,64,0.10)",
                                      color:
                                        "rgba(200,150,64,0.82)",
                                      border:
                                        "1px solid rgba(200,150,64,0.28)",
                                      fontFamily: FH,
                                    }}
                                  >
                                    {video.source}
                                  </span>
                                  <span
                                    className="text-[10px]"
                                    style={{
                                      color:
                                        "rgba(200,150,64,0.48)",
                                      fontFamily: FH,
                                    }}
                                  >
                                    {video.duration}
                                  </span>
                                </div>
                                <a
                                  href={video.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() =>
                                    setWatchedVideos((prev) =>
                                      new Set(prev).add(
                                        selectedSite.id,
                                      ),
                                    )
                                  }
                                  className="flex items-center justify-center gap-2 w-full py-2 text-[10px] tracking-widest transition-all hover:opacity-80"
                                  style={{
                                    background:
                                      "rgba(200,150,64,0.10)",
                                    border:
                                      "1px solid rgba(200,150,64,0.32)",
                                    color:
                                      "rgba(200,150,64,0.82)",
                                    fontFamily: FH,
                                  }}
                                >
                                  <svg
                                    width="9"
                                    height="9"
                                    viewBox="0 0 11 11"
                                    fill="none"
                                  >
                                    <path
                                      d="M2 1.5L9.5 5.5L2 9.5V1.5Z"
                                      fill="currentColor"
                                    />
                                  </svg>
                                  观看视频
                                </a>
                              </div>
                            )}

                            {/* 打卡印章 */}
                            <div
                              className="pt-2.5"
                              style={{
                                borderTop:
                                  "1px solid rgba(200,150,64,0.12)",
                              }}
                            >
                              {selectedSite.status !==
                              "实地打卡" ? (
                                <button
                                  disabled={
                                    !hasWatched && !hasCheckedIn
                                  }
                                  onClick={() => {
                                    if (hasWatched)
                                      setOnlineCheckedIn(
                                        (prev) =>
                                          new Set(prev).add(
                                            selectedSite.id,
                                          ),
                                      );
                                  }}
                                  className="w-full flex items-center justify-center gap-4 py-3 transition-all"
                                  style={{
                                    background: hasCheckedIn
                                      ? "rgba(200,150,64,0.08)"
                                      : hasWatched
                                        ? "rgba(200,150,64,0.10)"
                                        : "rgba(200,150,64,0.03)",
                                    border: `1px solid ${hasCheckedIn ? "rgba(200,150,64,0.40)" : hasWatched ? "rgba(200,150,64,0.38)" : "rgba(200,150,64,0.12)"}`,
                                    cursor: hasCheckedIn
                                      ? "default"
                                      : hasWatched
                                        ? "pointer"
                                        : "not-allowed",
                                  }}
                                >
                                  <div
                                    className="w-11 h-11 flex flex-col items-center justify-center flex-shrink-0"
                                    style={{
                                      border: `1.5px solid ${hasCheckedIn ? "rgba(200,150,64,0.70)" : hasWatched ? "rgba(200,150,64,0.55)" : "rgba(200,150,64,0.18)"}`,
                                      transform:
                                        "rotate(-7deg)",
                                      color: hasCheckedIn
                                        ? "rgba(200,150,64,0.85)"
                                        : hasWatched
                                          ? "rgba(200,150,64,0.65)"
                                          : "rgba(200,150,64,0.22)",
                                    }}
                                  >
                                    <span
                                      className="text-[6px] tracking-wider leading-none"
                                      style={{ fontFamily: FH }}
                                    >
                                      探源
                                    </span>
                                    <span
                                      className="text-sm leading-none"
                                      style={{ fontFamily: FD }}
                                    >
                                      {hasCheckedIn
                                        ? "✓"
                                        : "印"}
                                    </span>
                                    <span
                                      className="text-[6px] tracking-wider leading-none"
                                      style={{ fontFamily: FH }}
                                    >
                                      线上
                                    </span>
                                  </div>
                                  <span
                                    className="text-[9px] tracking-[0.2em]"
                                    style={{
                                      fontFamily: FH,
                                      color: hasCheckedIn
                                        ? "rgba(200,150,64,0.72)"
                                        : hasWatched
                                          ? "rgba(200,150,64,0.55)"
                                          : "rgba(200,150,64,0.25)",
                                    }}
                                  >
                                    {hasCheckedIn
                                      ? "已加盖线上印章"
                                      : hasWatched
                                        ? "点击加盖印章"
                                        : "观看视频后解锁"}
                                  </span>
                                </button>
                              ) : (
                                <div className="flex items-center justify-center py-2 gap-2">
                                  <div
                                    className="w-12 h-12 flex flex-col items-center justify-center"
                                    style={{
                                      border:
                                        "1.5px solid rgba(200,150,64,0.68)",
                                      transform:
                                        "rotate(-8deg)",
                                      color:
                                        "rgba(200,150,64,0.78)",
                                    }}
                                  >
                                    <span
                                      className="text-[6px] tracking-wider"
                                      style={{ fontFamily: FH }}
                                    >
                                      实地
                                    </span>
                                    <span
                                      className="text-base leading-none"
                                      style={{ fontFamily: FD }}
                                    >
                                      ✓
                                    </span>
                                    <span
                                      className="text-[6px] tracking-wider"
                                      style={{ fontFamily: FH }}
                                    >
                                      到访
                                    </span>
                                  </div>
                                  <span
                                    className="text-[9px] tracking-[0.25em]"
                                    style={{
                                      color:
                                        "rgba(200,150,64,0.55)",
                                      fontFamily: FH,
                                    }}
                                  >
                                    实地打卡已记录
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })()}
                    {drawerTab === "导航" && (
                      <div className="px-4 pt-3 pb-5 space-y-3">
                        <p
                          className="text-[11px] leading-relaxed"
                          style={{
                            color: "rgba(200,150,64,0.38)",
                            fontFamily: FH,
                          }}
                        >
                          选择出行方式，实时规划前往路线（需开启位置权限）
                        </p>
                        {[
                          {
                            icon: <Navigation size={13} />,
                            label: "驾车",
                          },
                          {
                            icon: <Bus size={13} />,
                            label: "公交",
                          },
                          {
                            icon: <User size={13} />,
                            label: "步行",
                          },
                        ].map((m) => (
                          <button
                            key={m.label}
                            className="w-full flex items-center gap-3 py-2.5 px-3 text-[11px] tracking-widest transition-all hover:opacity-70"
                            style={{
                              border:
                                "1px solid rgba(200,150,64,0.18)",
                              color: "rgba(220,195,150,0.60)",
                              fontFamily: FH,
                            }}
                          >
                            <span
                              style={{
                                color: "rgba(200,150,64,0.60)",
                              }}
                            >
                              {m.icon}
                            </span>
                            {m.label}前往 {selectedSite.name}
                            <ChevronRight
                              size={10}
                              className="ml-auto"
                              style={{
                                color: "rgba(200,150,64,0.35)",
                              }}
                            />
                          </button>
                        ))}
                      </div>
                    )}
                    {drawerTab === "周边" && (
                      <div className="px-4 pt-3 pb-5 space-y-3">
                        <p
                          className="text-[9px] tracking-[0.35em]"
                          style={{
                            color: "rgba(200,150,64,0.45)",
                            fontFamily: FH,
                          }}
                        >
                          5公里内配套服务
                        </p>
                        {[
                          {
                            icon: <Coffee size={12} />,
                            label: "餐饮",
                            items: [
                              "遗址文创餐厅",
                              "当地民俗食府",
                              "考古主题茶馆",
                            ],
                          },
                          {
                            icon: <Hotel size={12} />,
                            label: "住宿",
                            items: [
                              "遗址旁民宿",
                              "文旅精品酒店",
                            ],
                          },
                          {
                            icon: <Bus size={12} />,
                            label: "交通",
                            items: ["景区停车场", "公交总站"],
                          },
                        ].map((cat) => (
                          <div key={cat.label}>
                            <div
                              className="flex items-center gap-2 mb-1.5 text-[9px] tracking-[0.3em]"
                              style={{
                                color: "rgba(200,150,64,0.58)",
                                fontFamily: FH,
                              }}
                            >
                              {cat.icon}
                              <span>{cat.label}</span>
                            </div>
                            {cat.items.map((item) => (
                              <div
                                key={item}
                                className="flex items-center justify-between py-1.5 text-[11px] cursor-pointer hover:opacity-70 transition-opacity"
                                style={{
                                  borderBottom:
                                    "1px dashed rgba(200,150,64,0.12)",
                                  color:
                                    "rgba(220,195,150,0.52)",
                                  fontFamily: FH,
                                }}
                              >
                                {item}
                                <ChevronRight
                                  size={9}
                                  style={{
                                    color:
                                      "rgba(200,150,64,0.35)",
                                  }}
                                />
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Divider />

      {/* Featured sites */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <SectionLabel en="FEATURED HERITAGE SITES" />
        <h2
          className="text-4xl text-foreground tracking-wider mb-8"
          style={{ fontFamily: FD }}
        >
          精选探源遗址
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
          {[
            SITES.find((s) => s.name === "良渚遗址")!,
            SITES.find((s) => s.name === "陶寺遗址")!,
            SITES.find((s) => s.name === "殷墟遗址")!,
            SITES.find((s) => s.name === "三星堆遗址")!,
          ].map((site, i) => (
            <div
              key={site.id}
              className="relative cursor-pointer group flex flex-col"
              onClick={() => {
                setSelectedSite(site);
                setDrawerTab("介绍");
                window.scrollTo({
                  top: 800,
                  behavior: "smooth",
                });
              }}
            >
              {/* Image floats up out of card */}
              <div
                className="relative z-10 mx-3 overflow-hidden transition-transform duration-500 group-hover:-translate-y-2"
                style={{
                  height: "180px",
                  boxShadow:
                    "0 8px 32px rgba(0,0,0,0.55), 0 0 0 1px rgba(200,150,64,0.20)",
                }}
              >
                <img
                  src={SITE_CARD_IMGS[i]}
                  alt={site.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  style={{
                    filter: "brightness(0.85) contrast(1.05)",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                {/* Display-case bottom spotlight */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-8 transition-opacity duration-500 opacity-60 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(ellipse 80% 100% at 50% 100%, rgba(200,150,64,0.22), transparent)",
                  }}
                />
                {/* Culture tag */}
                <div
                  className="absolute top-2 right-2 px-1.5 py-0.5"
                  style={{
                    background: "rgba(40,16,6,0.82)",
                    border: "1px solid rgba(200,150,64,0.30)",
                  }}
                >
                  <span
                    className="text-[9px] text-primary/70 tracking-[0.2em]"
                    style={{ fontFamily: FH }}
                  >
                    {site.culture}
                  </span>
                </div>
              </div>

              {/* Card body */}
              <div
                className="relative -mt-6 pt-10 px-4 pb-4 flex flex-col flex-1"
                style={{
                  background:
                    "linear-gradient(160deg, rgba(72,30,12,0.92) 0%, rgba(48,18,6,0.95) 60%, rgba(88,36,14,0.90) 100%)",
                  border: "1px solid rgba(200,150,64,0.25)",
                }}
              >
                {/* 回字纹四角 */}
                {(
                  [
                    [
                      "top-0 left-0",
                      "M0 20 L0 0 L20 0",
                      "M3 17 L3 3 L17 3",
                    ],
                    [
                      "top-0 right-0",
                      "M20 20 L20 0 L0 0",
                      "M17 17 L17 3 L3 3",
                    ],
                    [
                      "bottom-0 left-0",
                      "M0 0 L0 20 L20 20",
                      "M3 3 L3 17 L17 17",
                    ],
                    [
                      "bottom-0 right-0",
                      "M20 0 L20 20 L0 20",
                      "M17 3 L17 17 L3 17",
                    ],
                  ] as const
                ).map(([pos, p1, p2]) => (
                  <svg
                    key={pos}
                    className={`absolute ${pos}`}
                    width="18"
                    height="18"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d={p1}
                      stroke="rgba(200,150,64,0.52)"
                      strokeWidth="1"
                    />
                    <path
                      d={p2}
                      stroke="rgba(200,150,64,0.24)"
                      strokeWidth="0.7"
                    />
                  </svg>
                ))}

                {/* Spotlight glow at top of card body */}
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-8 pointer-events-none opacity-50 group-hover:opacity-90 transition-opacity duration-500"
                  style={{
                    background:
                      "radial-gradient(ellipse at 50% 0%, rgba(200,150,64,0.20), transparent 70%)",
                  }}
                />

                <h3
                  className="text-xl leading-tight mb-2 text-center"
                  style={{
                    fontFamily: FD,
                    color: "rgba(240,215,165,0.93)",
                    textShadow:
                      "0 0 20px rgba(200,150,64,0.40)",
                  }}
                >
                  {site.name}
                </h3>

                <div
                  className="h-px mb-2"
                  style={{
                    background:
                      "linear-gradient(to right, transparent, rgba(200,150,64,0.38), transparent)",
                  }}
                />

                <div
                  className="flex justify-center gap-3 mb-3 text-[9px] tracking-[0.25em] text-primary/45"
                  style={{ fontFamily: FH }}
                >
                  <span>{site.period}时期</span>
                  <span className="text-primary/22">·</span>
                  <span>{site.location}</span>
                </div>

                <p className="text-foreground/50 text-[11px] leading-relaxed line-clamp-2 text-center flex-1">
                  {site.brief}
                </p>

                <div className="mt-3 flex items-center justify-between">
                  <span
                    className={`text-[9px] tracking-widest flex items-center gap-1 ${site.status === "实地打卡" ? "text-primary/72" : site.status === "线上打卡" ? "text-secondary/72" : "text-muted-foreground/38"}`}
                  >
                    <span
                      className={`w-1 h-1 rounded-full ${site.status === "实地打卡" ? "bg-primary" : site.status === "线上打卡" ? "bg-secondary" : "bg-muted-foreground/28"}`}
                    />
                    {site.status}
                  </span>
                  <span className="text-[9px] tracking-widest text-primary/32 group-hover:text-primary/68 transition-colors flex items-center gap-0.5">
                    查看
                    <ArrowRight
                      size={8}
                      className="group-hover:translate-x-0.5 transition-transform"
                    />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Module 2: 文化遗珍 ───────────────────────────────────────────────────────

function ModuleCulturalTreasures() {
  const [activeCategory, setActiveCategory] = useState("全部");
  const [selectedActivity, setSelectedActivity] =
    useState<Activity | null>(null);

  const filtered =
    activeCategory === "全部"
      ? ACTIVITIES
      : ACTIVITIES.filter((a) => a.category === activeCategory);

  return (
    <div className="min-h-screen">
      <div className="relative h-52 flex items-end overflow-hidden">
        <img
          src={IMGS.bronzeVessel}
          alt=""
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="relative z-10 px-8 pb-8 max-w-7xl mx-auto w-full">
          <SectionLabel en="CULTURAL TREASURES" />
          <h1
            className="text-5xl text-foreground tracking-wider"
            style={{ fontFamily: FD }}
          >
            文化遗珍
          </h1>
          <p className="text-muted-foreground text-sm mt-1 tracking-wider">
            探索各域文化衍生的沉浸式体验活动
          </p>
        </div>
      </div>

      <div className="sticky top-16 z-30 bg-background/90 backdrop-blur-md border-b border-border px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-3 flex-wrap">
          <Filter size={13} className="text-muted-foreground" />
          {ACTIVITY_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1 text-xs tracking-widest border transition-all duration-200 ${
                activeCategory === cat
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5">
          {filtered.map((act, i) => (
            <div
              key={act.id}
              className="relative cursor-pointer group flex flex-col break-inside-avoid mb-5"
              onClick={() => setSelectedActivity(act)}
            >
              {/* Image — floats above card */}
              <div
                className="relative z-10 mx-3 overflow-hidden transition-transform duration-500 group-hover:-translate-y-2"
                style={{
                  height:
                    act.height === "tall"
                      ? "220px"
                      : act.height === "medium"
                        ? "170px"
                        : "130px",
                  boxShadow:
                    "0 8px 32px rgba(0,0,0,0.55), 0 0 0 1px rgba(200,150,64,0.18)",
                }}
              >
                <img
                  src={act.img}
                  alt={act.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  style={{
                    filter: "brightness(0.85) contrast(1.05)",
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                {/* Category tag */}
                <div
                  className="absolute top-2 right-2 px-1.5 py-0.5"
                  style={{
                    background: "rgba(40,16,6,0.82)",
                    border: "1px solid rgba(200,150,64,0.30)",
                  }}
                >
                  <span
                    className="text-[9px] text-primary/70 tracking-[0.2em]"
                    style={{ fontFamily: FH }}
                  >
                    {act.category}
                  </span>
                </div>
                {/* Bottom spotlight */}
                <div
                  className="absolute bottom-0 left-0 right-0 h-8 opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background:
                      "radial-gradient(ellipse 80% 100% at 50% 100%, rgba(200,150,64,0.22), transparent)",
                  }}
                />
              </div>

              {/* Card body */}
              <div
                className="relative -mt-6 pt-9 px-4 pb-4 flex flex-col flex-1"
                style={{
                  background:
                    "linear-gradient(160deg, rgba(72,30,12,0.92) 0%, rgba(48,18,6,0.95) 60%, rgba(88,36,14,0.90) 100%)",
                  border: "1px solid rgba(200,150,64,0.25)",
                }}
              >
                {/* 回字纹四角 */}
                {(
                  [
                    [
                      "top-0 left-0",
                      "M0 20 L0 0 L20 0",
                      "M3 17 L3 3 L17 3",
                    ],
                    [
                      "top-0 right-0",
                      "M20 20 L20 0 L0 0",
                      "M17 17 L17 3 L3 3",
                    ],
                    [
                      "bottom-0 left-0",
                      "M0 0 L0 20 L20 20",
                      "M3 3 L3 17 L17 17",
                    ],
                    [
                      "bottom-0 right-0",
                      "M20 0 L20 20 L0 20",
                      "M17 3 L17 17 L3 17",
                    ],
                  ] as const
                ).map(([pos, p1, p2]) => (
                  <svg
                    key={pos}
                    className={`absolute ${pos}`}
                    width="18"
                    height="18"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d={p1}
                      stroke="rgba(200,150,64,0.52)"
                      strokeWidth="1"
                    />
                    <path
                      d={p2}
                      stroke="rgba(200,150,64,0.24)"
                      strokeWidth="0.7"
                    />
                  </svg>
                ))}
                {/* Spotlight glow */}
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-8 pointer-events-none opacity-50 group-hover:opacity-90 transition-opacity duration-500"
                  style={{
                    background:
                      "radial-gradient(ellipse at 50% 0%, rgba(200,150,64,0.20), transparent 70%)",
                  }}
                />
                <div className="flex items-start justify-between mb-2">
                  <span
                    className="text-primary/55 text-[10px] tracking-widest"
                    style={{ fontFamily: FH }}
                  >
                    {act.culture}
                  </span>
                  <StarRating rating={act.rating} />
                </div>
                <h3
                  className="text-lg leading-snug mb-1"
                  style={{
                    fontFamily: FD,
                    color: "rgba(240,215,165,0.93)",
                    textShadow:
                      "0 0 18px rgba(200,150,64,0.38)",
                  }}
                >
                  {act.name}
                </h3>
                <div
                  className="h-px mb-2"
                  style={{
                    background:
                      "linear-gradient(to right, transparent, rgba(200,150,64,0.35), transparent)",
                  }}
                />
                <p className="text-foreground/50 text-[11px] leading-relaxed line-clamp-2 flex-1">
                  {act.description}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground/55">
                    <MapPin
                      size={9}
                      className="text-primary/45"
                    />
                    {act.location}
                  </div>
                  <span className="text-[9px] tracking-widest text-primary/32 group-hover:text-primary/68 transition-colors flex items-center gap-0.5">
                    详情
                    <ArrowRight
                      size={8}
                      className="group-hover:translate-x-0.5 transition-transform"
                    />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-black/75 backdrop-blur-sm"
            onClick={() => setSelectedActivity(null)}
          />
          <div
            className="relative z-10 w-full max-w-sm flex flex-col"
            style={{
              background:
                "linear-gradient(160deg, rgba(72,30,12,0.98) 0%, rgba(48,18,6,1) 60%, rgba(88,36,14,0.96) 100%)",
              border: "1px solid rgba(200,150,64,0.25)",
              maxHeight: "88vh",
            }}
          >
            {/* 回字纹四角 */}
            {(
              [
                [
                  "top-0 left-0",
                  "M0 22 L0 0 L22 0",
                  "M3 19 L3 3 L19 3",
                ],
                [
                  "top-0 right-0",
                  "M22 22 L22 0 L0 0",
                  "M19 19 L19 3 L3 3",
                ],
                [
                  "bottom-0 left-0",
                  "M0 0 L0 22 L22 22",
                  "M3 3 L3 19 L19 19",
                ],
                [
                  "bottom-0 right-0",
                  "M22 0 L22 22 L0 22",
                  "M19 3 L19 19 L3 19",
                ],
              ] as const
            ).map(([pos, p1, p2]) => (
              <svg
                key={pos}
                className={`absolute ${pos} pointer-events-none z-20`}
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
              >
                <path
                  d={p1}
                  stroke="rgba(200,150,64,0.55)"
                  strokeWidth="1"
                />
                <path
                  d={p2}
                  stroke="rgba(200,150,64,0.25)"
                  strokeWidth="0.7"
                />
              </svg>
            ))}

            {/* Image floats above card body */}
            <div
              className="flex-shrink-0 relative z-10 mx-3 mt-3 overflow-hidden"
              style={{
                height: "200px",
                boxShadow:
                  "0 8px 32px rgba(0,0,0,0.65), 0 0 0 1px rgba(200,150,64,0.22)",
              }}
            >
              <img
                src={selectedActivity.img}
                alt={selectedActivity.name}
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  filter: "brightness(0.82) contrast(1.06)",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div
                className="absolute bottom-0 left-0 right-0 h-10"
                style={{
                  background:
                    "radial-gradient(ellipse 80% 100% at 50% 100%, rgba(200,150,64,0.26), transparent)",
                }}
              />
              {/* Category + culture tags */}
              <div className="absolute top-2 left-2 flex gap-1.5">
                <div
                  className="px-1.5 py-0.5"
                  style={{
                    background: "rgba(40,16,6,0.85)",
                    border: "1px solid rgba(200,150,64,0.30)",
                  }}
                >
                  <span
                    className="text-[9px] tracking-[0.2em]"
                    style={{
                      color: "rgba(200,150,64,0.75)",
                      fontFamily: FH,
                    }}
                  >
                    {selectedActivity.culture}
                  </span>
                </div>
                <div
                  className="px-1.5 py-0.5"
                  style={{
                    background: "rgba(40,16,6,0.85)",
                    border: "1px solid rgba(200,150,64,0.18)",
                  }}
                >
                  <span
                    className="text-[9px] tracking-[0.2em]"
                    style={{
                      color: "rgba(200,150,64,0.50)",
                      fontFamily: FH,
                    }}
                  >
                    {selectedActivity.category}
                  </span>
                </div>
              </div>
              {/* Close button */}
              <button
                onClick={() => setSelectedActivity(null)}
                className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center transition-opacity hover:opacity-60"
                style={{
                  background: "rgba(40,16,6,0.75)",
                  border: "1px solid rgba(200,150,64,0.22)",
                  color: "rgba(200,150,64,0.65)",
                }}
              >
                <X size={10} />
              </button>
            </div>

            {/* Card body */}
            <div
              className="relative flex flex-col flex-1 -mt-2 overflow-y-auto"
              style={{
                borderTop: "1px solid rgba(200,150,64,0.18)",
                scrollbarWidth: "none",
              }}
            >
              {/* Spotlight glow */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-10 pointer-events-none flex-shrink-0"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 0%, rgba(200,150,64,0.22), transparent 70%)",
                }}
              />

              <div className="px-5 pt-5 pb-6 space-y-4">
                {/* Name */}
                <div className="text-center">
                  <h2
                    className="text-2xl leading-tight"
                    style={{
                      fontFamily: FD,
                      color: "rgba(240,215,165,0.95)",
                      textShadow:
                        "0 0 24px rgba(200,150,64,0.45)",
                    }}
                  >
                    {selectedActivity.name}
                  </h2>
                  <div
                    className="h-px mt-2.5"
                    style={{
                      background:
                        "linear-gradient(to right, transparent, rgba(200,150,64,0.40), transparent)",
                    }}
                  />
                </div>

                {/* Rating */}
                <div className="flex items-center justify-center gap-1">
                  <StarRating
                    rating={selectedActivity.rating}
                  />
                </div>

                {/* Meta fields */}
                <div className="space-y-2">
                  {[
                    {
                      label: "地　点",
                      value: selectedActivity.location,
                    },
                    {
                      label: "文化域",
                      value: selectedActivity.culture,
                    },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex items-baseline justify-between"
                    >
                      <span
                        className="text-[10px] tracking-[0.2em] flex-shrink-0"
                        style={{
                          color: "rgba(200,150,64,0.65)",
                          fontFamily: FH,
                        }}
                      >
                        {row.label}
                      </span>
                      <div
                        className="flex-1 mx-2 border-b border-dotted"
                        style={{
                          borderColor: "rgba(200,150,64,0.18)",
                        }}
                      />
                      <span
                        className="text-xs tracking-wide"
                        style={{
                          color: "rgba(240,215,165,0.82)",
                        }}
                      >
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div
                  className="h-px"
                  style={{
                    background:
                      "linear-gradient(to right, transparent, rgba(200,150,64,0.20), transparent)",
                  }}
                />

                {/* Description */}
                <p
                  className="text-xs leading-relaxed"
                  style={{
                    color: "rgba(220,195,150,0.78)",
                    fontFamily: FH,
                  }}
                >
                  {selectedActivity.description}
                </p>

                {/* Action buttons */}
                <div className="flex gap-3 pt-1">
                  <button
                    className="flex-1 py-2.5 text-[10px] tracking-[0.3em] transition-all hover:opacity-80"
                    style={{
                      background: "rgba(200,150,64,0.14)",
                      border: "1px solid rgba(200,150,64,0.38)",
                      color: "rgba(200,150,64,0.85)",
                      fontFamily: FH,
                    }}
                  >
                    立即预约
                  </button>
                  <button
                    className="flex-1 py-2.5 text-[10px] tracking-[0.3em] transition-all hover:opacity-80"
                    style={{
                      background: "rgba(200,150,64,0.05)",
                      border: "1px solid rgba(200,150,64,0.22)",
                      color: "rgba(200,150,64,0.55)",
                      fontFamily: FH,
                    }}
                  >
                    一键导航
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Module 3: 探源社区 ───────────────────────────────────────────────────────

function ModuleCommunity() {
  const [likedPosts, setLikedPosts] = useState<Set<number>>(
    new Set(),
  );
  const [savedPosts, setSavedPosts] = useState<Set<number>>(
    new Set(),
  );

  const toggleLike = (id: number) =>
    setLikedPosts((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  const toggleSave = (id: number) =>
    setSavedPosts((prev) => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });

  return (
    <div className="min-h-screen">
      <div className="relative h-44 flex items-end overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1758762906230-1ff96b9abf9a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080"
          alt="古代壁画·流纹人物"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="relative z-10 px-8 pb-8 max-w-7xl mx-auto w-full">
          <SectionLabel en="EXPLORER COMMUNITY" />
          <h1
            className="text-5xl text-foreground tracking-wider"
            style={{ fontFamily: FD }}
          >
            探源社区
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Feed */}
          <div className="flex-1 space-y-6 min-w-0">
            <div
              className="relative p-4"
              style={{
                background:
                  "linear-gradient(160deg, rgba(52,20,8,0.96) 0%, rgba(36,13,4,0.97) 60%, rgba(62,24,8,0.95) 100%)",
                border: "1px solid rgba(200,150,64,0.32)",
              }}
            >
              {(
                [
                  [
                    "top-0 left-0",
                    "M0 18 L0 0 L18 0",
                    "M3 15 L3 3 L15 3",
                  ],
                  [
                    "top-0 right-0",
                    "M18 18 L18 0 L0 0",
                    "M15 15 L15 3 L3 3",
                  ],
                  [
                    "bottom-0 left-0",
                    "M0 0 L0 18 L18 18",
                    "M3 3 L3 15 L15 15",
                  ],
                  [
                    "bottom-0 right-0",
                    "M18 0 L18 18 L0 18",
                    "M15 3 L15 15 L3 15",
                  ],
                ] as const
              ).map(([pos, p1, p2]) => (
                <svg
                  key={pos}
                  className={`absolute ${pos} pointer-events-none`}
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                >
                  <path
                    d={p1}
                    stroke="rgba(200,150,64,0.52)"
                    strokeWidth="1"
                  />
                  <path
                    d={p2}
                    stroke="rgba(200,150,64,0.24)"
                    strokeWidth="0.7"
                  />
                </svg>
              ))}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-6 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 0%, rgba(200,150,64,0.15), transparent 70%)",
                }}
              />
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 flex-shrink-0 flex items-center justify-center"
                  style={{
                    border: "1px solid rgba(200,150,64,0.40)",
                    background: "rgba(200,150,64,0.08)",
                    color: "rgba(240,215,165,0.88)",
                    fontFamily: FD,
                  }}
                >
                  我
                </div>
                <input
                  type="text"
                  placeholder="分享您的探源见闻…"
                  className="flex-1 bg-transparent outline-none py-1 text-base"
                  style={{
                    color: "rgba(200,188,168,0.82)",
                    fontFamily: FH,
                    borderBottom:
                      "1px solid rgba(200,150,64,0.22)",
                  }}
                />
                <button
                  className="px-4 py-1.5 text-xs tracking-[0.3em] transition-all hover:opacity-80 flex-shrink-0"
                  style={{
                    background: "rgba(200,150,64,0.10)",
                    border: "1px solid rgba(200,150,64,0.32)",
                    color: "rgba(200,150,64,0.75)",
                    fontFamily: FH,
                  }}
                >
                  发布
                </button>
              </div>
            </div>

            {POSTS.map((post) => (
              <div
                key={post.id}
                className="relative flex overflow-visible"
                style={{
                  background:
                    "linear-gradient(160deg, rgba(52,20,8,0.96) 0%, rgba(36,13,4,0.97) 60%, rgba(62,24,8,0.95) 100%)",
                  border: "1px solid rgba(200,150,64,0.32)",
                }}
              >
                {/* 回字纹四角 */}
                {(
                  [
                    [
                      "top-0 left-0",
                      "M0 20 L0 0 L20 0",
                      "M3 17 L3 3 L17 3",
                    ],
                    [
                      "top-0 right-0",
                      "M20 20 L20 0 L0 0",
                      "M17 17 L17 3 L3 3",
                    ],
                    [
                      "bottom-0 left-0",
                      "M0 0 L0 20 L20 20",
                      "M3 3 L3 17 L17 17",
                    ],
                    [
                      "bottom-0 right-0",
                      "M20 0 L20 20 L0 20",
                      "M17 3 L17 17 L3 17",
                    ],
                  ] as const
                ).map(([pos, p1, p2]) => (
                  <svg
                    key={pos}
                    className={`absolute ${pos} pointer-events-none z-10`}
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                  >
                    <path
                      d={p1}
                      stroke="rgba(200,150,64,0.48)"
                      strokeWidth="1"
                    />
                    <path
                      d={p2}
                      stroke="rgba(200,150,64,0.22)"
                      strokeWidth="0.7"
                    />
                  </svg>
                ))}

                {/* 左侧：文字区 */}
                <div className="flex-1 min-w-0 px-5 pt-5 pb-4 flex flex-col gap-3">
                  {/* 作者行 */}
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 flex-shrink-0 flex items-center justify-center"
                      style={{
                        border:
                          "1px solid rgba(200,150,64,0.38)",
                        background: "rgba(200,150,64,0.08)",
                      }}
                    >
                      <span
                        className="text-xl leading-none font-bold"
                        style={{
                          color: "rgba(215,205,188,0.90)",
                          fontFamily:
                            "'KaiTi', 'STKaiti', serif",
                          textShadow:
                            "0 1px 4px rgba(0,0,0,0.60), 1px 1px 0 rgba(0,0,0,0.40)",
                          letterSpacing: "-0.02em",
                        }}
                      >
                        {post.avatar}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <span
                          className="text-base"
                          style={{
                            color: "rgba(215,205,188,0.90)",
                            fontFamily: FD,
                          }}
                        >
                          {post.author}
                        </span>
                        <span
                          className="text-xs"
                          style={{
                            color: "rgba(200,150,64,0.48)",
                            fontFamily: FH,
                          }}
                        >
                          {post.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <MapPin
                          size={10}
                          style={{
                            color: "rgba(200,150,64,0.50)",
                          }}
                        />
                        <span
                          className="text-xs tracking-[0.15em]"
                          style={{
                            color: "rgba(200,150,64,0.55)",
                            fontFamily: FH,
                          }}
                        >
                          {post.site}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 金线分隔 */}
                  <div
                    className="h-px"
                    style={{
                      background:
                        "linear-gradient(to right, rgba(200,150,64,0.22), transparent)",
                    }}
                  />

                  {/* 正文 */}
                  <p
                    className="text-base leading-relaxed flex-1"
                    style={{
                      color: "rgba(200,188,168,0.78)",
                      fontFamily: FH,
                      display: "-webkit-box",
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {post.content}
                  </p>

                  {/* 操作栏 */}
                  <div
                    className="flex items-center gap-5 pt-1"
                    style={{
                      borderTop:
                        "1px solid rgba(200,150,64,0.12)",
                    }}
                  >
                    <button
                      onClick={() => toggleLike(post.id)}
                      className="flex items-center gap-1.5 transition-opacity hover:opacity-80"
                      style={{
                        color: likedPosts.has(post.id)
                          ? "rgba(200,150,64,0.85)"
                          : "rgba(200,150,64,0.40)",
                      }}
                    >
                      <Heart
                        size={14}
                        className={
                          likedPosts.has(post.id)
                            ? "fill-current"
                            : ""
                        }
                      />
                      <span
                        className="text-xs"
                        style={{ fontFamily: FH }}
                      >
                        {post.likes +
                          (likedPosts.has(post.id) ? 1 : 0)}
                      </span>
                    </button>
                    <button
                      className="flex items-center gap-1.5 transition-opacity hover:opacity-80"
                      style={{ color: "rgba(200,150,64,0.40)" }}
                    >
                      <MessageCircle size={14} />
                      <span
                        className="text-xs"
                        style={{ fontFamily: FH }}
                      >
                        {post.comments}
                      </span>
                    </button>
                    <button
                      onClick={() => toggleSave(post.id)}
                      className="flex items-center gap-1.5 transition-opacity hover:opacity-80"
                      style={{
                        color: savedPosts.has(post.id)
                          ? "rgba(200,150,64,0.85)"
                          : "rgba(200,150,64,0.40)",
                      }}
                    >
                      <Bookmark
                        size={14}
                        className={
                          savedPosts.has(post.id)
                            ? "fill-current"
                            : ""
                        }
                      />
                    </button>
                    <button
                      className="flex items-center gap-1.5 transition-opacity hover:opacity-80 ml-auto"
                      style={{ color: "rgba(200,150,64,0.40)" }}
                    >
                      <Share2 size={14} />
                    </button>
                  </div>
                </div>

                {/* 右侧：最多3张 114×148px 横向排列，浮出卡体顶部 */}
                {post.imageCount > 0 && (
                  <div
                    className="flex-shrink-0 flex items-start gap-1 pr-3 pb-4"
                    style={{ marginTop: "-12px" }}
                  >
                    {Array.from({
                      length: Math.min(post.imageCount, 3),
                    }).map((_, i) => (
                      <div
                        key={i}
                        className="relative group/img cursor-pointer overflow-hidden flex-shrink-0"
                        style={{
                          width: "114px",
                          height: "148px",
                          boxShadow:
                            "0 8px 28px rgba(0,0,0,0.60), 0 0 0 1px rgba(200,150,64,0.22)",
                        }}
                      >
                        <img
                          src={
                            COMMUNITY_IMAGES[post.id]?.[i] ??
                            POST_IMGS[i % POST_IMGS.length]
                          }
                          alt=""
                          className="w-full h-full object-cover transition-transform duration-500 group-hover/img:scale-105"
                          style={{
                            filter:
                              "brightness(0.82) contrast(1.05) saturate(0.82)",
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
                        <div
                          className="absolute bottom-0 left-0 right-0 h-8"
                          style={{
                            background:
                              "radial-gradient(ellipse 80% 100% at 50% 100%, rgba(200,150,64,0.20), transparent)",
                          }}
                        />
                        {i === 2 && post.imageCount > 3 && (
                          <div
                            className="absolute inset-0 flex items-center justify-center"
                            style={{
                              background: "rgba(36,13,4,0.65)",
                            }}
                          >
                            <span
                              className="text-xs"
                              style={{
                                color: "rgba(200,150,64,0.82)",
                                fontFamily: FH,
                              }}
                            >
                              +{post.imageCount - 2}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Sidebar */}
          <div className="w-64 flex-shrink-0 hidden lg:block space-y-5">
            {/* 热门话题 */}
            <div
              className="relative p-5"
              style={{
                background:
                  "linear-gradient(160deg, rgba(52,20,8,0.96) 0%, rgba(36,13,4,0.97) 60%, rgba(62,24,8,0.95) 100%)",
                border: "1px solid rgba(200,150,64,0.32)",
              }}
            >
              {(
                [
                  [
                    "top-0 left-0",
                    "M0 18 L0 0 L18 0",
                    "M3 15 L3 3 L15 3",
                  ],
                  [
                    "top-0 right-0",
                    "M18 18 L18 0 L0 0",
                    "M15 15 L15 3 L3 3",
                  ],
                  [
                    "bottom-0 left-0",
                    "M0 0 L0 18 L18 18",
                    "M3 3 L3 15 L15 15",
                  ],
                  [
                    "bottom-0 right-0",
                    "M18 0 L18 18 L0 18",
                    "M15 3 L15 15 L3 15",
                  ],
                ] as const
              ).map(([pos, p1, p2]) => (
                <svg
                  key={pos}
                  className={`absolute ${pos} pointer-events-none`}
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                >
                  <path
                    d={p1}
                    stroke="rgba(200,150,64,0.52)"
                    strokeWidth="1"
                  />
                  <path
                    d={p2}
                    stroke="rgba(200,150,64,0.24)"
                    strokeWidth="0.7"
                  />
                </svg>
              ))}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-6 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 0%, rgba(200,150,64,0.18), transparent 70%)",
                }}
              />
              <div
                className="text-xs tracking-[0.35em] mb-4 flex items-center gap-2"
                style={{
                  color: "rgba(200,150,64,0.68)",
                  fontFamily: FH,
                }}
              >
                <GoldDiamond />
                热门话题
              </div>
              <div
                className="h-px mb-4"
                style={{
                  background:
                    "linear-gradient(to right, transparent, rgba(200,150,64,0.30), transparent)",
                }}
              />
              <div className="space-y-3">
                {TRENDING.map((t, i) => (
                  <div
                    key={t.tag}
                    className="flex items-center justify-between group cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs w-4"
                        style={{
                          color: "rgba(200,150,64,0.35)",
                          fontFamily: FH,
                        }}
                      >
                        {i + 1}
                      </span>
                      <span
                        className="text-sm transition-colors"
                        style={{
                          color: "rgba(200,188,168,0.72)",
                          fontFamily: FH,
                        }}
                      >
                        {t.tag}
                      </span>
                    </div>
                    <span
                      className="text-xs"
                      style={{
                        color: "rgba(200,150,64,0.42)",
                        fontFamily: FH,
                      }}
                    >
                      {t.count}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 专家顾问 */}
            <div
              className="relative p-5"
              style={{
                background:
                  "linear-gradient(160deg, rgba(52,20,8,0.96) 0%, rgba(36,13,4,0.97) 60%, rgba(62,24,8,0.95) 100%)",
                border: "1px solid rgba(200,150,64,0.32)",
              }}
            >
              {(
                [
                  [
                    "top-0 left-0",
                    "M0 18 L0 0 L18 0",
                    "M3 15 L3 3 L15 3",
                  ],
                  [
                    "top-0 right-0",
                    "M18 18 L18 0 L0 0",
                    "M15 15 L15 3 L3 3",
                  ],
                  [
                    "bottom-0 left-0",
                    "M0 0 L0 18 L18 18",
                    "M3 3 L3 15 L15 15",
                  ],
                  [
                    "bottom-0 right-0",
                    "M18 0 L18 18 L0 18",
                    "M15 3 L15 15 L3 15",
                  ],
                ] as const
              ).map(([pos, p1, p2]) => (
                <svg
                  key={pos}
                  className={`absolute ${pos} pointer-events-none`}
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                >
                  <path
                    d={p1}
                    stroke="rgba(200,150,64,0.52)"
                    strokeWidth="1"
                  />
                  <path
                    d={p2}
                    stroke="rgba(200,150,64,0.24)"
                    strokeWidth="0.7"
                  />
                </svg>
              ))}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-6 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 0%, rgba(200,150,64,0.18), transparent 70%)",
                }}
              />
              <div
                className="text-xs tracking-[0.35em] mb-4 flex items-center gap-2"
                style={{
                  color: "rgba(200,150,64,0.68)",
                  fontFamily: FH,
                }}
              >
                <GoldDiamond />
                专家顾问
              </div>
              <div
                className="h-px mb-4"
                style={{
                  background:
                    "linear-gradient(to right, transparent, rgba(200,150,64,0.30), transparent)",
                }}
              />
              <div className="space-y-4">
                {EXPERTS.map((exp) => (
                  <div
                    key={exp.name}
                    className="flex items-start gap-3"
                  >
                    <div
                      className="w-9 h-9 flex-shrink-0 flex items-center justify-center text-base"
                      style={{
                        border:
                          "1px solid rgba(200,150,64,0.32)",
                        background: "rgba(200,150,64,0.06)",
                        color: "rgba(200,150,64,0.65)",
                        fontFamily: FD,
                      }}
                    >
                      {exp.name[0]}
                    </div>
                    <div>
                      <div
                        className="text-base"
                        style={{
                          color: "rgba(215,205,188,0.88)",
                          fontFamily: FH,
                        }}
                      >
                        {exp.name}
                      </div>
                      <div
                        className="text-sm mt-0.5"
                        style={{
                          color: "rgba(200,188,168,0.58)",
                          fontFamily: FH,
                        }}
                      >
                        {exp.title}
                      </div>
                      <div
                        className="text-xs mt-0.5"
                        style={{
                          color: "rgba(200,150,64,0.55)",
                          fontFamily: FH,
                        }}
                      >
                        {exp.specialty}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 关于探源工程 */}
            <div
              className="relative p-5"
              style={{
                background:
                  "linear-gradient(160deg, rgba(52,20,8,0.96) 0%, rgba(36,13,4,0.97) 60%, rgba(62,24,8,0.95) 100%)",
                border: "1px solid rgba(200,150,64,0.32)",
              }}
            >
              {(
                [
                  [
                    "top-0 left-0",
                    "M0 18 L0 0 L18 0",
                    "M3 15 L3 3 L15 3",
                  ],
                  [
                    "top-0 right-0",
                    "M18 18 L18 0 L0 0",
                    "M15 15 L15 3 L3 3",
                  ],
                  [
                    "bottom-0 left-0",
                    "M0 0 L0 18 L18 18",
                    "M3 3 L3 15 L15 15",
                  ],
                  [
                    "bottom-0 right-0",
                    "M18 0 L18 18 L0 18",
                    "M15 3 L15 15 L3 15",
                  ],
                ] as const
              ).map(([pos, p1, p2]) => (
                <svg
                  key={pos}
                  className={`absolute ${pos} pointer-events-none`}
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                >
                  <path
                    d={p1}
                    stroke="rgba(200,150,64,0.52)"
                    strokeWidth="1"
                  />
                  <path
                    d={p2}
                    stroke="rgba(200,150,64,0.24)"
                    strokeWidth="0.7"
                  />
                </svg>
              ))}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-6 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 0%, rgba(200,150,64,0.18), transparent 70%)",
                }}
              />
              <div
                className="text-xs tracking-[0.35em] mb-4 flex items-center gap-2"
                style={{
                  color: "rgba(200,150,64,0.68)",
                  fontFamily: FH,
                }}
              >
                <GoldDiamond />
                关于探源工程
              </div>
              <div
                className="h-px mb-4"
                style={{
                  background:
                    "linear-gradient(to right, transparent, rgba(200,150,64,0.30), transparent)",
                }}
              />
              <p
                className="text-sm leading-relaxed mb-4"
                style={{
                  color: "rgba(200,188,168,0.72)",
                  fontFamily: FH,
                }}
              >
                中华文明探源工程由国家文物局主导，汇聚考古、历史、自然科学等多学科力量，已持续研究逾二十年。
              </p>
              <a
                href="#"
                className="flex items-center gap-1.5 text-xs tracking-widest transition-opacity hover:opacity-70"
                style={{
                  color: "rgba(200,150,64,0.62)",
                  fontFamily: FH,
                }}
              >
                了解更多
                <ExternalLink size={10} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Module 4: 个人中心 ───────────────────────────────────────────────────────

function ModulePersonal() {
  const [personalTab, setPersonalTab] = useState<
    "足迹" | "游记" | "收藏"
  >("足迹");

  const visited = SITES.filter((s) => s.status !== "未打卡");
  const onsite = SITES.filter((s) => s.status === "实地打卡");

  return (
    <div className="min-h-screen">
      <div className="relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1758091235715-5352f0130ef0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080"
          alt="古代壁画·神话题材"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 to-background" />
        <div className="relative z-10 max-w-7xl mx-auto px-8 pt-16 pb-8">
          <div className="flex items-end gap-6">
            <div
              className="w-20 h-20 border border-primary/50 flex-shrink-0 overflow-hidden"
              style={{
                boxShadow: "0 0 16px rgba(200,150,64,0.30)",
              }}
            >
              <img
                src={liangzhuFace}
                alt="良渚兽面纹"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2
                className="text-2xl text-foreground tracking-wider"
                style={{ fontFamily: FD }}
              >
                文化行者·源
              </h2>
              <p className="text-muted-foreground text-sm mt-1">
                探源达人 · 已加入238天
              </p>
              <div className="flex items-center gap-6 mt-3">
                {[
                  { v: visited.length, l: "已探访" },
                  { v: 29, l: "总遗址" },
                  { v: onsite.length, l: "实地打卡" },
                  { v: 142, l: "关注者" },
                ].map((stat, i, arr) => (
                  <div
                    key={stat.l}
                    className="flex items-center gap-6"
                  >
                    <div className="text-center">
                      <div
                        className={`text-lg ${i === 0 ? "text-primary" : "text-foreground"}`}
                      >
                        {stat.v}
                      </div>
                      <div className="text-muted-foreground text-xs tracking-wider">
                        {stat.l}
                      </div>
                    </div>
                    {i < arr.length - 1 && (
                      <div className="w-px h-8 bg-border" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 pb-16">
        {/* Achievement badges */}
        <div className="flex gap-3 mb-8 overflow-x-auto pb-2">
          {[
            {
              label: "文明启蒙者",
              desc: "完成首次打卡",
              unlocked: true,
            },
            {
              label: "黄河之子",
              desc: "打卡5处黄河文化遗址",
              unlocked: true,
            },
            {
              label: "玉见良渚",
              desc: "完成良渚遗址打卡",
              unlocked: true,
            },
            {
              label: "探源先锋",
              desc: "打卡10处遗址",
              unlocked: false,
            },
            {
              label: "时空旅人",
              desc: "打卡全部29处遗址",
              unlocked: false,
            },
          ].map((badge) => (
            <div
              key={badge.label}
              className={`flex-shrink-0 border p-3 text-center w-28 ${badge.unlocked ? "border-primary/40 bg-primary/5" : "border-border/30 opacity-40"}`}
            >
              <div
                className={`text-xl mb-1 ${badge.unlocked ? "text-primary" : "text-muted-foreground"}`}
              >
                {badge.unlocked ? "◆" : "◇"}
              </div>
              <div
                className={`text-xs leading-tight ${badge.unlocked ? "text-foreground" : "text-muted-foreground"}`}
              >
                {badge.label}
              </div>
              <div className="text-muted-foreground/50 text-xs mt-0.5 leading-tight">
                {badge.desc}
              </div>
            </div>
          ))}
        </div>

        <Divider />

        <div className="flex border-b border-border mb-8">
          {(["足迹", "游记", "收藏"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setPersonalTab(t)}
              className={`px-6 py-3 text-sm tracking-widest transition-colors ${personalTab === t ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"}`}
            >
              {t === "足迹"
                ? "我的探源足迹"
                : t === "游记"
                  ? "我的游记"
                  : "我的收藏"}
            </button>
          ))}
        </div>

        {personalTab === "足迹" && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <SectionLabel en="MY HERITAGE FOOTPRINT" />
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-primary" />
                  实地打卡
                </span>
                <span className="flex items-center gap-1.5">
                  <div className="w-2 h-2 bg-secondary" />
                  线上打卡
                </span>
                <span className="flex items-center gap-1.5">
                  <div className="w-2 h-2 border border-muted-foreground/30" />
                  未打卡
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
              {SITES.map((site) => (
                <div
                  key={site.id}
                  className={`relative border p-3 transition-all duration-200 ${
                    site.status === "实地打卡"
                      ? "border-primary/40 bg-primary/5 hover:bg-primary/10 cursor-pointer"
                      : site.status === "线上打卡"
                        ? "border-secondary/30 bg-secondary/5 hover:bg-secondary/10 cursor-pointer"
                        : "border-border/30 opacity-40"
                  }`}
                >
                  <div
                    className={`text-xs tracking-wide mb-1 leading-tight ${site.status !== "未打卡" ? "text-foreground" : "text-muted-foreground/50"}`}
                  >
                    {site.name}
                  </div>
                  <div
                    className={`text-xs leading-tight ${site.status !== "未打卡" ? "text-muted-foreground" : "text-muted-foreground/30"}`}
                  >
                    {site.culture}
                  </div>
                  {site.status === "实地打卡" && (
                    <CheckCircle
                      size={10}
                      className="text-primary absolute top-2 right-2"
                    />
                  )}
                  {site.status === "线上打卡" && (
                    <Play
                      size={10}
                      className="text-secondary absolute top-2 right-2"
                    />
                  )}
                  {site.status === "未打卡" && (
                    <Lock
                      size={10}
                      className="text-muted-foreground/30 absolute top-2 right-2"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 border border-border bg-card flex items-center gap-6">
              <span className="text-sm text-muted-foreground whitespace-nowrap">
                探源进度：
                <span className="text-primary">
                  {visited.length}
                </span>{" "}
                / 29
              </span>
              <div className="flex-1 h-1 bg-muted overflow-hidden">
                <div
                  className="h-full bg-primary transition-all duration-500"
                  style={{
                    width: `${(visited.length / 29) * 100}%`,
                  }}
                />
              </div>
              <span className="text-primary text-sm whitespace-nowrap">
                {Math.round((visited.length / 29) * 100)}%
              </span>
            </div>
          </div>
        )}
        {personalTab === "游记" && (
          <div className="text-center py-16 text-muted-foreground">
            <div className="text-5xl mb-4 opacity-20">✍</div>
            <p className="text-sm tracking-widest">
              暂无游记，探访遗址后分享您的见闻吧
            </p>
            <button className="mt-6 px-6 py-2.5 border border-primary text-primary text-xs tracking-widest hover:bg-primary/10 transition-colors">
              写游记
            </button>
          </div>
        )}
        {personalTab === "收藏" && (
          <div className="text-center py-16 text-muted-foreground">
            <div className="text-5xl mb-4 opacity-20">◇</div>
            <p className="text-sm tracking-widest">
              暂无收藏内容
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Floating AI Assistant ────────────────────────────────────────────────────

function AIAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "ai",
      content:
        "您好，我是探源AI导游。我可以为您介绍中华文明探源工程的29处核心遗址，解答文化问题，或为您规划定制行程。",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim() || typing) return;
    setMessages((prev) => [
      ...prev,
      { role: "user", content: text },
    ]);
    setInput("");
    setTyping(true);
    const answer =
      AI_ANSWERS[text] ||
      "这是一个很好的问题。关于中华文明探源，我建议您深入探访29处核心遗址，每一处都记录着华夏先民的智慧与创造力。如需了解特定遗址或文化，请随时告诉我。";
    let i = 0;
    const aiMsg: ChatMessage = {
      role: "ai",
      content: "",
      typing: true,
    };
    setMessages((prev) => [...prev, aiMsg]);
    const interval = setInterval(() => {
      i += 3;
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          role: "ai",
          content: answer.slice(0, i),
          typing: i < answer.length,
        };
        return next;
      });
      if (i >= answer.length) {
        clearInterval(interval);
        setTyping(false);
      }
    }, 18);
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
      >
        {open ? <X size={20} /> : <Sparkles size={20} />}
      </button>

      {open && (
        <div
          className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 bg-card border border-border shadow-2xl flex flex-col"
          style={{ height: "520px" }}
        >
          <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-background/50 backdrop-blur-sm flex-shrink-0">
            <div className="w-7 h-7 bg-primary/20 rounded-full flex items-center justify-center">
              <Sparkles size={14} className="text-primary" />
            </div>
            <div>
              <div className="text-foreground text-sm tracking-wide">
                探源AI导游
              </div>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <span className="text-muted-foreground text-xs">
                在线
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "ai" && (
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                    <Sparkles
                      size={10}
                      className="text-primary"
                    />
                  </div>
                )}
                <div
                  className={`max-w-[80%] px-3 py-2 text-xs leading-relaxed whitespace-pre-wrap ${msg.role === "user" ? "bg-primary/15 text-foreground border border-primary/20" : "bg-muted text-muted-foreground"}`}
                >
                  {msg.content}
                  {msg.typing && (
                    <span className="inline-block w-1 h-3 bg-primary/60 ml-0.5 animate-pulse" />
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex-shrink-0">
              <div className="text-muted-foreground text-xs tracking-wider mb-2">
                快捷提问
              </div>
              <div className="space-y-1.5">
                {QUICK_QUESTIONS.slice(0, 3).map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="w-full text-left px-3 py-2 border border-border text-xs text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center gap-2 px-4 py-3 border-t border-border flex-shrink-0">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && sendMessage(input)
              }
              placeholder="输入您的问题…"
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={typing || !input.trim()}
              className="w-8 h-8 bg-primary/90 text-primary-foreground flex items-center justify-center hover:bg-primary disabled:opacity-40 transition-colors flex-shrink-0"
            >
              <Send size={13} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("探源");
  const [menuOpen, setMenuOpen] = useState(false);

  const tabs: { key: Tab; label: string; sub: string }[] = [
    { key: "探源", label: "时空探源", sub: "TIME ORIGIN" },
    { key: "遗珍", label: "文化遗珍", sub: "TREASURES" },
    { key: "社区", label: "探源社区", sub: "COMMUNITY" },
    { key: "个人", label: "个人中心", sub: "PROFILE" },
  ];

  return (
    <div
      className="min-h-screen bg-background text-foreground"
      style={{ fontFamily: FB }}
    >
      {/* Navigation */}
      <header className="sticky top-0 z-40 bg-background/85 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-8">
          <div className="flex items-center gap-3 flex-shrink-0">
            <div
              className="w-9 h-9 rounded-full border border-primary/60 overflow-hidden flex-shrink-0"
              style={{
                boxShadow: "0 0 10px rgba(200,150,64,0.25)",
              }}
            >
              <img
                src={pottery}
                alt="仰韶彩陶"
                className="w-full h-full object-cover"
                style={{
                  filter: "brightness(1.05) contrast(1.05)",
                }}
              />
            </div>
            <div
              className="text-primary text-sm tracking-widest leading-none"
              style={{ fontFamily: FH }}
            >
              中华文明探源工程
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1 flex-1">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative px-4 py-2 text-sm tracking-wider transition-colors ${activeTab === tab.key ? "text-primary" : "text-muted-foreground hover:text-foreground"}`}
              >
                {tab.label}
                {activeTab === tab.key && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <Search size={16} />
            </button>
            <button className="text-muted-foreground hover:text-foreground transition-colors">
              <Bell size={16} />
            </button>
            <div
              className="w-8 h-8 bg-primary/20 border border-primary/30 flex items-center justify-center text-primary text-sm"
              style={{ fontFamily: FD }}
            >
              源
            </div>
            <button
              className="md:hidden text-muted-foreground hover:text-foreground"
              onClick={() => setMenuOpen((o) => !o)}
            >
              <Menu size={18} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden border-t border-border bg-background/95">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setMenuOpen(false);
                }}
                className={`w-full px-6 py-3 text-left text-sm tracking-wider flex items-center gap-3 ${activeTab === tab.key ? "text-primary bg-primary/5" : "text-muted-foreground"}`}
              >
                {tab.label}
                <span
                  className="text-xs text-muted-foreground/40 tracking-[0.2em]"
                  style={{ fontFamily: FE }}
                >
                  {tab.sub}
                </span>
              </button>
            ))}
          </div>
        )}
      </header>

      <div className="h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

      <main>
        {activeTab === "探源" && <ModuleTimeSpace />}
        {activeTab === "遗珍" && <ModuleCulturalTreasures />}
        {activeTab === "社区" && <ModuleCommunity />}
        {activeTab === "个人" && <ModulePersonal />}
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-12 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 border border-primary/40 flex items-center justify-center text-primary text-xs">
                  源
                </div>
                <span className="text-foreground text-sm tracking-widest">
                  中华文明探源工程
                </span>
              </div>
              <p className="text-muted-foreground text-xs leading-relaxed">
                以科技之力，还原五千年文明脉络。汇考古学、历史学、自然科学于一体，探寻华夏文明之根。
              </p>
            </div>
            <div>
              <div className="text-primary/60 text-xs tracking-[0.25em] uppercase mb-4">
                快速导航
              </div>
              <div className="space-y-2">
                {[
                  "时空探源地图",
                  "文化活动体验",
                  "探源社区广场",
                  "个人打卡足迹",
                  "AI智能导游",
                ].map((link) => (
                  <div
                    key={link}
                    className="text-muted-foreground text-xs hover:text-primary transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <ChevronRight
                      size={10}
                      className="text-primary/40"
                    />
                    {link}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-primary/60 text-xs tracking-[0.25em] uppercase mb-4">
                支持机构
              </div>
              <div className="space-y-1.5 text-muted-foreground text-xs leading-relaxed">
                <p>国家文物局</p>
                <p>中国社会科学院考古研究所</p>
                <p>北京大学考古文博学院</p>
                <p>中国国家博物馆</p>
              </div>
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent mb-6" />
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground/50 text-xs tracking-wider">
              © 2026 中华文明探源工程文旅数字化平台
            </span>
            <div className="flex items-center gap-2 text-muted-foreground/40 text-xs">
              <GoldDiamond />
              <span>探索文明之源 · 传承华夏文脉</span>
              <GoldDiamond />
            </div>
          </div>
        </div>
      </footer>

      <AIAssistant />
    </div>
  );
}