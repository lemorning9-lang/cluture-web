import difflib
import re

old_path = r'D:\codex\end\网页代码\src\app\App.tsx'
new_path = r'D:\codex\end\新版本\src\app\App.tsx'

with open(old_path, encoding='utf-8') as f:
    old_lines = f.readlines()
with open(new_path, encoding='utf-8') as f:
    new_lines = f.readlines()

PROTECTED = [
    'getSiteMainImage', 'COMMUNITY_IMAGES', 'DRAWER_IMGS', 'POST_IMGS',
    'siteImages', 'imports.', 'AMap', 'amap', 'latitude', 'longitude',
    'lat:', 'lng:', '__AMAP_KEY__', 'window.AMap',
]

# 纯字号升级模式: 一行内只有 className 里 text-* 升级，其余不变
FONT_MAP = {
    'text-[9px]': 'text-xs', 'text-[11px]': 'text-xs',
    'text-xs': 'text-sm', 'text-sm': 'text-base', 'text-base': 'text-2xl',
    'text-xl': 'text-3xl', 'text-3xl': 'text-4xl',
}

def classify_block(tag, old, new):
    """返回类别: protected / pure-font / replace-review / delete / insert"""
    all_txt = ''.join(old) + ''.join(new)
    if any(p in all_txt for p in PROTECTED):
        return 'PROTECTED'
    if tag == 'delete':
        return 'DELETE(keep old)'
    if tag == 'insert':
        return 'INSERT(review)'
    # replace 块
    if len(old) == len(new):
        all_font = True
        for o, n in zip(old, new):
            if o == n:
                continue
            # 检查是否只是字号升级
            if not is_font_only_change(o, n):
                all_font = False
                break
        if all_font and len(old) > 0:
            return 'PURE-FONT'
    return 'REPLACE(review)'

def is_font_only_change(o, n):
    # 尝试: 将 o 中所有字号 token 按映射升级后是否等于 n
    # 需要按从大到小顺序替换避免连锁
    result = o
    for old_c, new_c in sorted(FONT_MAP.items(), key=lambda kv: -len(kv[0])):
        result = result.replace(old_c + ' ', new_c + ' ')
        # 行尾或引号前
        for q in ['"', "'", '`']:
            result = result.replace(old_c + q, new_c + q)
        if result.rstrip().endswith(old_c):
            result = result.rstrip()[: -len(old_c)] + new_c + '\n'
    return result == n

sm = difflib.SequenceMatcher(None, old_lines, new_lines, autojunk=False)

cats = {}
report = []
count = 0
for tag, i1, i2, j1, j2 in sm.get_opcodes():
    if tag == 'equal':
        continue
    count += 1
    cat = classify_block(tag, old_lines[i1:i2], new_lines[j1:j2])
    cats[cat] = cats.get(cat, 0) + 1
    report.append((count, tag, (i1+1, i2), (j1+1, j2), cat))

print('=== 分类统计 ===')
for k, v in sorted(cats.items()):
    print(f'  {k}: {v}')
print()
print('=== 需要人工审查的块 ===')
for num, tag, orange, nrange, cat in report:
    if cat != 'PURE-FONT':
        print(f'BLOCK {num} [{tag}] old {orange[0]}-{orange[1]} new {nrange[0]}-{nrange[1]} -> {cat}')
