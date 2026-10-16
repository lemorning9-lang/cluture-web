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
_SITE_SUFFIX = re.compile(r"(遗址群|古城遗址|遗址|城址|古城|墓地|遗迹)$")


def normalize(text):
    return _STRIP_CHARS.sub("", text)


def site_aliases(name):
    """遗址名及其可安全简写的形式（如「城头山遗址」→「城头山」）。"""
    out = {name}
    short = _SITE_SUFFIX.sub("", name)
    if short and len(short) >= 2 and short != name:
        out.add(short)
    return out


def clean_site(raw):
    """目录名 → 遗址名：去掉前导序号与结尾的「图片」。"""
    name = re.sub(r"^\d+", "", raw)
    name = re.sub(r"(相关图片|图片)$", "", name)
    return name.strip()


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
        name = cells[0].strip()
        out.append(
            {
                "region": region,
                "name": name,
                "location": cells[1],
                "core": cells[2],
                "relation": cells[3],
            }
        )
        site_names.update(site_aliases(name))
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
                name = re.split(r"[，,]", value)[0].strip()
                current = {"region": region, "name": name, "fields": []}
                site_names.update(site_aliases(name))
                for alias in re.split(r"[，,、]", value):
                    if len(alias.strip()) >= 3:
                        site_names.add(alias.strip())
                continue
            if current is not None:
                current["fields"].append({"label": label, "value": value})
    if current and current["fields"]:
        dossiers.append(current)
    return dossiers


def match_site_header(line, site_names):
    """把小节标题匹配到规范遗址名；不是小节标题就返回 None。

    小节标题长这样：「8. 陶寺遗址相关学习资料」「双槐树遗址 相关学习资料」。
    只认去序号、去固定后缀后的完全匹配——放宽成前缀匹配会把
    「牛河梁女神庙」这类标题也当成小节标题，反而更糟。
    """
    text = re.sub(r"^\s*\d+\s*[.、)）]?\s*", "", line).strip()
    norm = normalize(text)
    if norm.endswith(SECTION_SUFFIX):
        norm = norm[: -len(SECTION_SUFFIX)]
    if len(norm) < 2:
        return None
    for name in site_names:
        if norm == normalize(name):
            return name
    return None


def parse_links(loose, region, site_names):
    """视频链接文档是「遗址名 / 标题 / 链接」的循环，标题偶尔没有配套链接。"""
    links = []
    site = ""
    title = ""
    for line in loose:
        if line.startswith("http"):
            if title:
                links.append(
                    {"region": region, "site": site, "title": title, "url": line}
                )
            title = ""
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
    site_names = set()
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
        site_names.update(site_aliases(img["site"]))

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
