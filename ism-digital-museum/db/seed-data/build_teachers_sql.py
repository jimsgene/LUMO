"""Builds teachers.sql from teachers.json.  Run:  python build_teachers_sql.py"""
import json
from pathlib import Path

HERE = Path(__file__).parent
T = json.loads((HERE / 'teachers.json').read_text(encoding='utf-8'))

def q(v):
    if v is None or v == '' or v == []:
        return 'null'
    if isinstance(v, list):
        v = '\n'.join(v)
    if isinstance(v, int):
        return str(v)
    return "'" + str(v).replace("'", "''") + "'"

COLS = ['name', 'position', 'degree', 'email', 'office', 'education', 'certification', 'courses',
        'bio', 'research', 'publications', 'activities', 'awards', 'sort_order', 'photo_url']

out = [
    '-- ISM Дижитал музей: МСМ тэнхимийн багш нар (эх сурвалж: ufe.edu.mn багш нарын хуудас)',
    '-- Supabase -> SQL Editor-т бүхэлд нь хуулж Run дарна.',
    '-- Зөвхөн НЭМЭХ/ШИНЭЧЛЭХ: шинэ багана нэмж, багшийг нэрээр нь шинэчилнэ, байхгүй бол нэмнэ. Юу ч устгахгүй.',
    '',
    'alter table public.teachers',
    '  add column if not exists degree        text,',
    '  add column if not exists email         text,',
    '  add column if not exists office        text,',
    '  add column if not exists education     text,',
    '  add column if not exists certification text,',
    '  add column if not exists research      text,',
    '  add column if not exists publications  text,',
    '  add column if not exists activities    text,',
    '  add column if not exists awards        text,',
    '  add column if not exists sort_order    int;',
    '',
]
for t in T:
    row = dict(t)
    row['photo_url'] = None if t.get('photo') is False else f"/teachers/{t['slug']}.jpg"
    vals = {c: q(row.get(c)) for c in COLS}
    # Do not wipe a photo uploaded later through Admin: only set photo_url when we have one
    sets = ', '.join(f'{c} = {vals[c]}' for c in COLS if c != 'name' and not (c == 'photo_url' and vals[c] == 'null'))
    out += [
        f"-- {t['name']}",
        f"update public.teachers set {sets} where name = {vals['name']};",
        f"insert into public.teachers ({', '.join(COLS)})",
        f"select {', '.join(vals[c] for c in COLS)}",
        f"where not exists (select 1 from public.teachers where name = {vals['name']});",
        '',
    ]
out += ['notify pgrst, \'reload schema\';', '',
        "select name, position, degree, sort_order from public.teachers order by sort_order nulls last, name;", '']
(HERE / 'teachers.sql').write_text('\n'.join(out), encoding='utf-8')
print(f'teachers.sql: {len(T)} teachers')
