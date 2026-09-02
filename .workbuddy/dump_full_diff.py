import difflib
import io
import sys

old_path = r'D:\codex\end\网页代码\src\app\App.tsx'
new_path = r'D:\codex\end\新版本\src\app\App.tsx'
out_path = r'D:\codex\end\.workbuddy\full_diff.txt'

with open(old_path, encoding='utf-8') as f:
    old_lines = f.readlines()
with open(new_path, encoding='utf-8') as f:
    new_lines = f.readlines()

sm = difflib.SequenceMatcher(None, old_lines, new_lines, autojunk=False)

buf = io.StringIO()
count = 0
for tag, i1, i2, j1, j2 in sm.get_opcodes():
    if tag == 'equal':
        continue
    count += 1
    buf.write(f'===== BLOCK {count} [{tag}] old {i1+1}-{i2} ({i2-i1}L) new {j1+1}-{j2} ({j2-j1}L) =====\n')
    buf.write('--- OLD ---\n')
    for l in old_lines[i1:i2]:
        buf.write(l.rstrip('\n') + '\n')
    buf.write('--- NEW ---\n')
    for l in new_lines[j1:j2]:
        buf.write(l.rstrip('\n') + '\n')
    buf.write('\n')

with open(out_path, 'w', encoding='utf-8') as f:
    f.write(buf.getvalue())
print(f'Total blocks: {count}, written to {out_path}')
print(f'Old total lines: {len(old_lines)}, New total lines: {len(new_lines)}')
