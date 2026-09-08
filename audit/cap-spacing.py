from pathlib import Path
import re
p=Path('src/styles.css');s=p.read_text(encoding='utf8')
# Cap only spacing declarations. Keep auto, percentages, calc(), and negative offsets intact.
pattern=re.compile(r'(?P<prop>\b(?:margin|padding)(?:-(?:top|right|bottom|left|block|inline|block-start|block-end|inline-start|inline-end))?\s*:\s*)(?P<value>[^;{}]+)(?P<end>;|\})',re.I)
num=re.compile(r'(?P<n>\d+(?:\.\d+)?)(?P<u>px|vh|vw|vmin|vmax|rem|em|ch)')
def decl(m):
 def cap(x):
  n=float(x.group('n'))
  if n<=30:return x.group(0)
  return '30px'
 return m.group('prop')+num.sub(cap,m.group('value'))+m.group('end')
s=pattern.sub(decl,s)
p.write_text(s,encoding='utf8')
