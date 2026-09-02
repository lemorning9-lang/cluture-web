import difflib
import re

old_path = r'D:\codex\end\网页代码\src\app\App.tsx'
new_path = r'D:\codex\end\新版本\src\app\App.tsx'

with open(old_path, encoding='utf-8') as f:
    old_lines = f.readlines()
with open(new_path, encoding='utf-8') as f:
    new_lines = f.readlines()

sm = difflib.SequenceMatcher(None, old_lines, new_lines, autojunk=False)

PROTECTED = [
    'getSiteMainImage', 'COMMUNITY_IMAGES', 'DRAWER_IMGS', 'POST_IMGS',
    'siteImages', 'imports.', 'AMap', 'amap', 'latitude', 'longitude',
    'lat:', 'lng:', '__AMAP_KEY__', 'window.AMap',
]

def chinese_texts(s):
    return re.findall(r'[\u4e00-\u9fff][\u4e00-\u9fff·、，。：；（）！？「」\u3000-\u303F\w]*[\u4e00-\u9fff]', s)

count = 0
flagged = []
for tag, i1, i2, j1, j2 in sm.get_opcodes():
    if tag == 'equal':
        continue
    count += 1
    old_blk = ''.join(old_lines[i1:i2])
    new_blk = ''.join(new_lines[j1:j2])
    if any(p in old_blk + new_blk for p in PROTECTED):
        continue  # already keeping old
    if tag == 'delete':
        continue  # keeping old
    if tag == 'insert':
        continue  # skipping
    # replace: check Chinese text preservation
    o_zh = chinese_texts(old_blk)
    n_zh = chinese_texts(new_blk)
    if o_zh != n_zh:
        flagged.append((count, o_zh, n_zh))

print('=== 中文内容有变化的替换块（需人工确认）===')
if not flagged:
    print('(无)')
for num, o, n in flagged:
    print(f'BLOCK {num}:')
    print(f'  旧: {o}')
    print(f'  新: {n}')
