from pathlib import Path
import re
reverse={bytes([i]).decode('cp1252',errors='replace'):i for i in range(128,256)}
reverse.update({chr(i):i for i in range(128,160)})
def fix(m):
 s=m.group()
 for _ in range(12):
  try:t=bytes(reverse[c] if ord(c)>127 else ord(c) for c in s).decode('utf8')
  except (KeyError,UnicodeError):break
  if t==s:break
  s=t
 return s
for p in [*Path('src').rglob('*.jsx'),*Path('src').rglob('*.css'),Path('index.html')]:
 s=p.read_text(encoding='utf-8-sig');s=re.sub(r'[^\x00-\x7f]+',fix,s);p.write_text(s,encoding='utf-8')
