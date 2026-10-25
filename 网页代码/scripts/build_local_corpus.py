#!/usr/bin/env python
"""从 本地资料数据库/ 生成站内悬浮窗可检索的语料 JSON。

资料来源（全部离线，无需联网、无第三方依赖）：
  - 整体介绍.docx：一张遗址概览表（遗址 / 位置和年代 / 核心表达 / 探源工程），
    外加每处遗址的完整档案表（地理位置 / 年代 / 遗址性质 / 遗址规模 /
    发现与发掘 / 主要单位 / 探源身份 / 考古证据 / 探源意义 / 博物馆 …）
  - 图片文件名：每个遗址目录下的文件名本身就是一句说明
    （如「陶寺遗址彩绘蟠龙纹陶盘」）
  - 相关视频链接.docx：已整理好的「标题 + 链接」来源清单

用法：python scripts/build_local_corpus.py
输出：src/data/localCorpus.json
"""

import html
import json
import os
import re
import sys
import zipfile

HERE = os.path.dirname(os.path.abspath(__file__))
DB_ROOT = os.path.normpath(os.path.join(HERE, "..", "..", "本地资料数据库"))
OUT_PATH = os.path.normpath(os.path.join(HERE, "..", "src", "data", "localCorpus.json"))

IMAGE_EXT = {".png", ".jpg", ".jpeg", ".jfif", ".webp", ".gif"}
SITE_HEADER_FIELD = "遗址名称"
SECTION_SUFFIX = "相关学习资料"
OVERVIEW_HEADER = "遗址"

_STRIP_CHARS = re.compile(r"[\s（）()、，,·—\-－:：]")

# ── 遗址名称规范（来源：仓库根目录《遗址名称+时间轴.docx》）─────────────────
# 资料库 docx / 图片目录名 / 视频链接小节标题存在多种写法
# （如「铸鼎塬」「石家河古城遗址」「偃师二里头」「良渚」），
# 一律归一到下列 29 个规范名，保证 AI 检索与出处标注和站内 SITES 一致。

CANONICAL_SITES = [
    "铸鼎原遗址群", "城头山遗址", "东山村遗址",
    "双槐树遗址", "大地湾遗址", "南佐遗址", "大汶口文化遗址", "焦家遗址", "岗上遗址",
    "牛河梁遗址", "鸡叫城遗址", "城河遗址", "黄山遗址", "凌家滩遗址",
    "赵陵山遗址", "草鞋山遗址", "良渚遗址", "石家河遗址", "宝墩遗址",
    "城子崖遗址", "陶寺遗址", "石峁遗址", "碧村遗址", "柳湾遗址",
    "二里头遗址", "郑州商城遗址", "殷墟遗址", "三星堆遗址", "新干遗址群",
]
_CANONICAL_SET = set(CANONICAL_SITES)

# 核心词（去掉地名前缀与「遗址/城址/古城」等后缀后的专名）→ 规范名
_SITE_CORES = {
    "铸鼎原": "铸鼎原遗址群", "铸鼎塬": "铸鼎原遗址群",
    "城头山": "城头山遗址", "东山村": "东山村遗址", "鸡叫城": "鸡叫城遗址",
    "城河": "城河遗址", "黄山": "黄山遗址", "凌家滩": "凌家滩遗址",
    "赵陵山": "赵陵山遗址", "草鞋山": "草鞋山遗址", "良渚": "良渚遗址",
    "石家河": "石家河遗址", "宝墩": "宝墩遗址", "双槐树": "双槐树遗址",
    "大地湾": "大地湾遗址", "南佐": "南佐遗址", "大汶口": "大汶口文化遗址",
    "焦家": "焦家遗址", "岗上": "岗上遗址", "城子崖": "城子崖遗址",
    "陶寺": "陶寺遗址", "石峁": "石峁遗址", "碧村": "碧村遗址", "柳湾": "柳湾遗址",
    "二里头": "二里头遗址", "郑州商城": "郑州商城遗址", "殷墟": "殷墟遗址",
    "三星堆": "三星堆遗址", "新干": "新干遗址群", "牛河梁": "牛河梁遗址",
}

# 资料里出现过的地名前缀，长词在前（避免「郑州商城」被「郑州」误剥）
_LOCATION_PREFIXES = [
    "河南灵宝", "湖南澧县", "江苏张家港", "河南巩义", "甘肃庆阳", "甘肃秦安",
    "山东泰安", "山东章丘", "山东济南", "山东滕州", "辽宁朝阳", "湖北沙洋",
    "河南南阳", "安徽含山", "江苏昆山", "江苏苏州", "浙江余杭", "湖北天门",
    "四川成都", "山西临汾", "陕西神木", "山西兴县", "青海乐都", "河南偃师",
    "河南郑州", "河南安阳", "四川广汉", "江西新干",
    "河南", "湖南", "江苏", "甘肃", "庆阳", "山东", "山西", "陕西", "青海",
    "辽宁", "湖北", "安徽", "浙江", "四川", "江西", "偃师", "安阳", "广汉",
]


def normalize(text):
    return _STRIP_CHARS.sub("", text)


def _strip_site_suffixes(name):
    """反复剥掉结尾的「遗址群/文化遗址/遗址/城址/古城」等后缀。"""
    prev = None
    while prev != name:
        prev = name
        name = re.sub(r"(遗址群|文化遗址|遗址|城址|古城|墓地|遗迹)$", "", name)
    return name


def _resolve(name):
    """单个候选串 → 规范名；不成则 None。"""
    if name in _CANONICAL_SET:
        return name
    if name in _SITE_CORES:
        return _SITE_CORES[name]
    core = _strip_site_suffixes(name)
    if core in _SITE_CORES:
        return _SITE_CORES[core]
    if core in _CANONICAL_SET:
        return core
    return None


def canonical_site(raw, quiet=False):
    """把各种写法归一成规范遗址名；归一失败时原样返回并在 stderr 告警。

    顺序：原串 → 去后缀 → 剥一个地名前缀再试。
    前缀逐个独立尝试（不叠加修改），这样「江西新干遗址」既能命中
    前缀「江西」得到「新干遗址」，也不会被「江西新干」剥得只剩「遗址」。
    """
    name = re.sub(r"（[^）]*）", "", str(raw or "")).strip()
    name = re.sub(r"\s+", "", name)
    if not name:
        return str(raw or "").strip()

    hit = _resolve(name)
    if hit:
        return hit
    for prefix in _LOCATION_PREFIXES:
        if name.startswith(prefix) and len(name) > len(prefix):
            hit = _resolve(name[len(prefix):])
            if hit:
                return hit

    if not quiet:
        print(f"  ! 未能归一遗址名：{raw!r}", file=sys.stderr)
    return str(raw or "").strip()


def clean_site(raw):
    """目录名 → 遗址名：去掉前导序号与结尾的「图片」，再归一到规范名。"""
    name = re.sub(r"^\d+", "", raw)
    name = re.sub(r"(相关图片|图片)$", "", name)
    return canonical_site(name)


def docx_tables(path):
    """返回 (表格列表, 表格外段落)。每个表格是「行 → 单元格文本」的列表。"""
    with zipfile.ZipFile(path) as z:
        xml = z.read("word/document.xml").decode("utf-8")

    def text_of(fragment):
        joined = "".join(re.findall(r"<w:t[^>]*>(.*?)</w:t>", fragment, re.S))
        plain = re.sub(r"<[^>]+>", "", joined)
        return re.sub(r"\s+", " ", html.unescape(plain)).strip()

    tables = []
    for tbl in re.findall(r"<w:tbl>.*?</w:tbl>", xml, re.S):
        rows = []
        for tr in re.findall(r"<w:tr[ >].*?</w:tr>", tbl, re.S):
            cells = [text_of(tc) for tc in re.findall(r"<w:tc>.*?</w:tc>", tr, re.S)]
            cells = [c for c in cells if c]
            if cells:
                rows.append(cells)
        if rows:
            tables.append(rows)

    loose = []
    outside = re.sub(r"<w:tbl>.*?</w:tbl>", "", xml, flags=re.S)
    for p in re.findall(r"<w:p[ >].*?</w:p>", outside, re.S):
        text = text_of(p)
        if text:
            loose.append(text)
    return tables, loose


def parse_overview(table, region, site_names):
    """概览表：遗址 / 位置和年代 / 核心表达 / 探源工程（个别行会缺列）。"""
    out = []
    for row in table:
        if row[0] in (OVERVIEW_HEADER, "") or len(row) < 3:
            continue
        cells = row + [""] * (4 - len(row))
        name = canonical_site(cells[0])
        out.append(
            {
                "region": region,
                "name": name,
                "location": cells[1],
                "core": cells[2],
                "relation": cells[3],
            }
        )
        site_names.add(name)
    return out


def collect_dossiers(tables, region, site_names):
    """档案表：以「遗址名称」开启一处新遗址，其后每行是一个字段。

    同一份文档里档案常被拆成多张表格（分页），所以 current 要跨表格保持，
    否则后半段的字段会被丢掉。
    """
    dossiers = []
    current = None
    for table in tables:
        header = table[0] if table else []
        if header and header[0] == OVERVIEW_HEADER and len(header) >= 3:
            continue
        for row in table:
            if len(row) != 2:
                continue
            label, value = row
            if label == SITE_HEADER_FIELD:
                if current and current["fields"]:
                    dossiers.append(current)
                name = canonical_site(re.split(r"[，,]", value)[0])
                current = {"region": region, "name": name, "fields": []}
                site_names.add(name)
                continue
            if current is not None:
                current["fields"].append({"label": label, "value": value})
    if current and current["fields"]:
        dossiers.append(current)
    return dossiers


def match_site_header(line, site_names):
    """把小节标题匹配到规范遗址名；不是小节标题就返回 None。

    小节标题长这样：「8. 陶寺遗址相关学习资料」「双槐树遗址 相关学习资料」
    「9. 石峁遗址、相关学习资料」。先去序号与固定后缀，再归一到规范名。
    只认归一后的完全匹配——放宽成前缀匹配会把
    「牛河梁女神庙」这类标题也当成小节标题，反而更糟。
    """
    text = re.sub(r"^\s*\d+\s*[.、)）]?\s*", "", line).strip()
    # 两种文档的小节后缀不同：黄河/其他用「相关学习资料」，长江用「视频资料」
    text = re.sub(r"[、,，\s]*(相关学习资料|视频资料|学习资料)$", "", text).strip()
    text = re.sub(r"[、,，\s]+$", "", text)
    if len(text) < 2:
        return None
    # quiet：视频标题等普通行也会走到这里，不匹配是常态，不该刷告警
    matched = canonical_site(text, quiet=True)
    if matched in site_names:
        return matched
    return None


_URL_RE = re.compile(r"https?://\S+")
_TITLE_NUM = re.compile(r"^\s*\d+\s*[.、)）]?\s*")


def parse_links(loose, region, site_names):
    """链接文档解析。

    两种排布都要支持：
    · 独立行链接：标题行 + 整行以 http 开头的 URL（黄河/其他文档）
    · 行内链接：URL 嵌在标题末尾，如「1. 《中国考古大会》http://…」（长江文档）
    「可用内容：…」行是上一条链接的内容说明，并入标题以提升检索命中。
    """
    links = []
    site = ""
    title = ""

    def emit(url, t):
        url = url.rstrip("。，、；）)")
        t = _TITLE_NUM.sub("", (t or "").strip()).strip()
        if t and site and url:
            links.append(
                {"region": region, "site": site, "title": t, "url": url}
            )

    for line in loose:
        urls = _URL_RE.findall(line)
        if urls:
            for url in urls:
                head = line[: line.find(url)]
                emit(url, head if head.strip() else title)
            title = ""
            continue

        if line.startswith("可用内容"):
            desc = re.split(r"[：:]", line, 1)[-1].strip()
            if links and links[-1]["site"] == site and desc:
                links[-1]["title"] += f"（{desc}）"
            continue

        matched = match_site_header(line, site_names)
        if matched:
            site = matched
            title = ""
            continue

        title = line

    return links


def main():
    if not os.path.isdir(DB_ROOT):
        sys.exit(f"找不到资料库目录：{DB_ROOT}")

    images = []
    overview = []
    dossiers = []
    links = []
    site_names = set(CANONICAL_SITES)
    intro_docs = []
    link_docs = []

    for dirpath, _dirnames, filenames in os.walk(DB_ROOT):
        rel = os.path.relpath(dirpath, DB_ROOT)
        parts = [] if rel == "." else rel.split(os.sep)
        region = parts[0] if parts else ""
        site = clean_site(parts[-1]) if len(parts) >= 2 else ""

        for filename in filenames:
            stem, ext = os.path.splitext(filename)
            ext = ext.lower()
            if ext in IMAGE_EXT and site:
                item = re.sub(r"^\d+", "", stem).strip()
                if item:
                    images.append({"region": region, "site": site, "item": item})
            elif ext == ".docx":
                (intro_docs if "整体介绍" in filename else link_docs).append(
                    (region, os.path.join(dirpath, filename), filename)
                )

    # 先把图片目录名收作遗址名，供档案/链接里的简称对齐
    for img in images:
        site_names.add(img["site"])

    for region, path, filename in intro_docs:
        try:
            tables, _loose = docx_tables(path)
        except Exception as exc:
            print(f"  ! 跳过 {filename}：{exc}", file=sys.stderr)
            continue
        for table in tables:
            header = table[0]
            if header and header[0] == OVERVIEW_HEADER and len(header) >= 3:
                overview.extend(parse_overview(table, region, site_names))
        dossiers.extend(collect_dossiers(tables, region, site_names))

    for region, path, filename in link_docs:
        try:
            _tables, loose = docx_tables(path)
        except Exception as exc:
            print(f"  ! 跳过 {filename}：{exc}", file=sys.stderr)
            continue
        links.extend(parse_links(loose, region, site_names))

    seen = set()
    unique_links = []
    for link in links:
        if link["url"] in seen:
            continue
        seen.add(link["url"])
        unique_links.append(link)

    # 链接文档里的小节标题有时认不出来，退一步拿标题里出现的遗址名补归属
    by_length = sorted((n for n in site_names if len(n) >= 2), key=len, reverse=True)
    for link in unique_links:
        if link["site"]:
            continue
        for name in by_length:
            if name in link["title"]:
                link["site"] = name
                break

    corpus = {
        "overview": overview,
        "dossiers": dossiers,
        "images": images,
        "links": unique_links,
    }
    os.makedirs(os.path.dirname(OUT_PATH), exist_ok=True)
    with open(OUT_PATH, "w", encoding="utf-8") as fh:
        json.dump(corpus, fh, ensure_ascii=False, separators=(",", ":"))

    fields_total = sum(len(d["fields"]) for d in dossiers)
    print(f"遗址概览 {len(overview)} 条")
    print(f"遗址档案 {len(dossiers)} 份 / {fields_total} 个字段")
    print(f"图片条目 {len(images)} 条")
    print(f"来源链接 {len(unique_links)} 条")
    print(f"已写入 {OUT_PATH}（{os.path.getsize(OUT_PATH) / 1024:.1f} KB）")

    unlabeled = sum(1 for link in unique_links if not link["site"])
    print(f"其中未归属遗址的链接 {unlabeled} 条")


if __name__ == "__main__":
    main()
