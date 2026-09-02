import difflib
import re

old_path = r'D:\codex\end\网页代码\src\app\App.tsx'
new_path = r'D:\codex\end\新版本\src\app\App.tsx'

with open(old_path, encoding='utf-8') as f:
    old_lines = f.readlines()
with open(new_path, encoding='utf-8') as f:
    new_lines = f.readlines()

sm = difflib.SequenceMatcher(None, old_lines, new_lines, autojunk=False)

target = set(int(x) for x in __import__('sys').argv[1].split(','))
count = 0
for tag, i1, i2, j1, j2 in sm.get_opcodes():
    if tag == 'equal':
        continue
    count += 1
    if count not in target:
        continue
    print(f'===== BLOCK {count} [{tag}] old {i1+1}-{i2} new {j1+1}-{j2} =====')
    print('--- OLD ---')
    for l in old_lines[i1:i2]:
        print(l.rstrip())
    print('--- NEW ---')
    for l in new_lines[j1:j2]:
        print(l.rstrip())
    print()
