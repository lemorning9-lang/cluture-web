import difflib
import re

old_path = r'D:\codex\end\网页代码\src\app\App.tsx'
new_path = r'D:\codex\end\新版本\src\app\App.tsx'

with open(old_path, encoding='utf-8') as f:
    old_lines = f.readlines()
with open(new_path, encoding='utf-8') as f:
    new_lines = f.readlines()

sm = difflib.SequenceMatcher(None, old_lines, new_lines, autojunk=False)

changes = []
for tag, i1, i2, j1, j2 in sm.get_opcodes():
    if tag == 'equal':
        continue
    changes.append({
        'tag': tag,
        'old_range': (i1+1, i2),
        'new_range': (j1+1, j2),
        'old': old_lines[i1:i2],
        'new': new_lines[j1:j2],
    })

print(f'共 {len(changes)} 个差异块\n')

for idx, c in enumerate(changes):
    old_txt = ''.join(c['old']).strip()
    new_txt = ''.join(c['new']).strip()
    # 只显示精简信息
    old_first = old_txt.split('\n')[0][:100] if old_txt else '(无)'
    new_first = new_txt.split('\n')[0][:100] if new_txt else '(无)'
    print(f'--- 差异块 {idx+1} [{c["tag"]}] ---')
    print(f'  旧行 {c["old_range"][0]}-{c["old_range"][1]} ({len(c["old"])}行): {old_first}')
    print(f'  新行 {c["new_range"][0]}-{c["new_range"][1]} ({len(c["new"])}行): {new_first}')
