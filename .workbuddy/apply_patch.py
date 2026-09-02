"""应用样式补丁：将新版本的亮度/字号/质感变更应用到旧版 App.tsx，
同时保留旧版的本地图片系统、AMAP 地图代码和经纬度数据。

策略（基于 difflib 行级 diff）：
- equal: 保留
- replace:
  * 含受保护标识符（图片/地图相关）→ 保留旧版
  * 地图结构块 83/84/85 → 保留旧版（AMAP 条件渲染结构）
  * 块 86 → 行级合并：第1行保留旧版（z-10 供图例浮于地图上方），第2行应用新版（字号）
  * 其余（纯样式变更，中文内容已验证一致）→ 应用新版
- delete: 保留旧版（删除的都是坐标/AMAP/图片相关内容）
- insert: 跳过
"""
import difflib

old_path = r'D:\codex\end\网页代码\src\app\App.tsx'
new_path = r'D:\codex\end\新版本\src\app\App.tsx'
out_path = r'D:\codex\end\网页代码\src\app\App.tsx'

with open(old_path, encoding='utf-8') as f:
    old_lines = f.readlines()
with open(new_path, encoding='utf-8') as f:
    new_lines = f.readlines()

PROTECTED = [
    'getSiteMainImage', 'COMMUNITY_IMAGES', 'DRAWER_IMGS', 'POST_IMGS',
    'siteImages', 'imports.', 'AMap', 'amap', 'latitude', 'longitude',
    'lat:', 'lng:', '__AMAP_KEY__', 'window.AMap',
]

# 地图结构块（保留旧版 AMAP 条件渲染）
KEEP_OLD_BLOCKS = {83, 84, 85}

sm = difflib.SequenceMatcher(None, old_lines, new_lines, autojunk=False)

result = []
stats = {'applied': 0, 'kept_old_protected': 0, 'kept_old_map': 0,
         'kept_old_delete': 0, 'insert_skipped': 0, 'line_merged': 0}

count = 0
for tag, i1, i2, j1, j2 in sm.get_opcodes():
    if tag == 'equal':
        result.extend(old_lines[i1:i2])
        continue
    count += 1
    old_blk = old_lines[i1:i2]
    new_blk = new_lines[j1:j2]
    block_txt = ''.join(old_blk) + ''.join(new_blk)

    if tag == 'delete':
        result.extend(old_blk)
        stats['kept_old_delete'] += 1
        continue
    if tag == 'insert':
        stats['insert_skipped'] += 1
        continue

    # replace 块
    if any(p in block_txt for p in PROTECTED):
        result.extend(old_blk)
        stats['kept_old_protected'] += 1
        continue
    if count in KEEP_OLD_BLOCKS:
        result.extend(old_blk)
        stats['kept_old_map'] += 1
        continue
    if count == 86 and len(old_blk) == len(new_blk) == 2:
        # 行级合并: 第1行保留旧版（z-10），第2行应用新版（字号升级）
        result.append(old_blk[0])
        result.append(new_blk[1])
        stats['line_merged'] += 1
        continue
    # 纯样式替换 → 应用新版
    result.extend(new_blk)
    stats['applied'] += 1

assert ''.join(result).count('\x00') == 0
with open(out_path, 'w', encoding='utf-8', newline='') as f:
    f.writelines(result)

print('补丁完成！统计:', stats)
print(f'总行数: {len(result)} (旧 {len(old_lines)}, 新 {len(new_lines)})')

# ── 验证 ──
with open(out_path, encoding='utf-8') as f:
    patched = f.read()

checks = {
    'siteImages 导入': "from '../data/siteImages'" in patched or 'siteImages' in patched,
    'getSiteMainImage 调用': 'getSiteMainImage(' in patched,
    'COMMUNITY_IMAGES 调用': 'COMMUNITY_IMAGES[' in patched,
    'AMAP ref': 'mapRef' in patched,
    'DRAWER_IMGS 未引入': 'DRAWER_IMGS' not in patched,
    'POST_IMGS 未引入': 'POST_IMGS' not in patched,
}
for k, v in checks.items():
    print(f'  [{"OK" if v else "FAIL"}] {k}')

# 中文内容完整性：与旧版对比
import re
def zh(s):
    return re.findall(r'[\u4e00-\u9fff]+', s)
old_zh, patched_zh = zh(open(old_path, encoding='utf-8').read()), zh(patched)
print(f'  [{"OK" if old_zh == patched_zh else "FAIL"}] 中文内容与旧版完全一致 (共 {len(old_zh)} 段)')
