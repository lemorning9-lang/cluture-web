// ─── 中华文明探源工程 · 遗址与社区图片映射 ──────────────────────────────────────

// 探源社区帖子配图（3 篇帖子 → 仰韶/红山/良渚 三组本地图）
import communityLiangzhu1 from "../assets/community/良渚1.png";
import communityLiangzhu2 from "../assets/community/良渚2.png";
import communityLiangzhu3 from "../assets/community/良渚3.png";
import communityYangshao1 from "../assets/community/仰韶1.png";
import communityYangshao2 from "../assets/community/仰韶2.png";
import communityYangshao3 from "../assets/community/仰韶3.png";
import communityHongshan1 from "../assets/community/红山1.png";
import communityHongshan2 from "../assets/community/红山2.png";
import communityHongshan3 from "../assets/community/红山3.png";

// 批量导入本地资料库遗址图片（src/assets/images/ 按「流域/遗址名/文件名」组织）
const imageModules = import.meta.glob<{ default: string }>(
  "../assets/images/**/*.{png,jpg,jpeg,jfif}",
  { eager: true },
);

/** 按遗址名索引的图片 URL 数组，如 SITE_IMAGES["石峁遗址"] = ["/src/assets/...", ...] */
export const SITE_IMAGES: Record<string, string[]> = {};

for (const [filePath, mod] of Object.entries(imageModules)) {
  // 路径格式: ../assets/images/{流域}/{遗址目录}/{文件名}.{扩展名}
  const parts = filePath.split("/");
  const siteName = parts[parts.length - 2]; // 遗址目录名
  if (!SITE_IMAGES[siteName]) {
    SITE_IMAGES[siteName] = [];
  }
  SITE_IMAGES[siteName].push(mod.default);
}

/**
 * 获取某个遗址的主图（用于遗址介绍弹窗顶部）。
 * 优先返回文件名以遗址名（或其核心名）开头、且不含「相关文化」的图，
 * 避免把非遗/民俗文化图当成遗址本体图。
 */
export function getSiteMainImage(siteName: string): string | undefined {
  const imgs = SITE_IMAGES[siteName];
  if (!imgs || imgs.length === 0) return undefined;

  // 去掉「文化/城址/遗址群/遗址」等后缀，得到核心名，用于匹配文件名前缀
  const core = siteName.replace(/(文化|城址|遗址群|遗址)$/, "");
  const baseOf = (p: string) => p.split("/").pop() ?? "";

  // 1) 遗址本体图：文件名以遗址名/核心名开头，且不含「相关文化」
  const body = imgs.find(
    (p) =>
      !baseOf(p).includes("相关文化") &&
      (baseOf(p).startsWith(siteName) || baseOf(p).startsWith(core)),
  );
  if (body) return body;

  // 2) 任意非「相关文化」图
  const nonCulture = imgs.find((p) => !baseOf(p).includes("相关文化"));
  if (nonCulture) return nonCulture;

  return imgs[0];
}

// ─── 探源社区帖子配图 ────────────────────────────────────────────────────────────

/** 帖子 id → 配图数组（3 篇帖子各 3 张本地图） */
export const COMMUNITY_IMAGES: Record<number, string[]> = {
  1: [communityLiangzhu1, communityLiangzhu2, communityLiangzhu3], // 良渚遗址
  2: [communityYangshao1, communityYangshao2, communityYangshao3], // 仰韶村遗址
  3: [communityHongshan1, communityHongshan2, communityHongshan3], // 牛河梁遗址（红山文化）
};
