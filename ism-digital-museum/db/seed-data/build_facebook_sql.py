"""Builds facebook.sql: exhibits, events and history taken from the department's public sources.
Sources: facebook.com/profile.php?id=61576135060864 (Мэдээллийн систем хөтөлбөр) and ufe.edu.mn (program page).
Run:  python build_facebook_sql.py
"""
from pathlib import Path

HERE = Path(__file__).parent
FB = 'Эх сурвалж: Мэдээллийн систем хөтөлбөрийн Facebook хуудас.'
UFE = 'Эх сурвалж: ufe.edu.mn, Мэдээллийн систем + AI хөтөлбөр.'

def q(v):
    if v is None or v == '':
        return 'null'
    if isinstance(v, int):
        return str(v)
    if isinstance(v, list):
        return 'array[' + ', '.join(q(x) for x in v) + ']::text[]' if v else "'{}'::text[]"
    return "'" + str(v).replace("'", "''") + "'"

# ---------- Exhibits (student and staff works) ----------
EXHIBITS = [
    dict(title='Төрийн худалдан авалтын ил тод байдлыг блокчэйн ба Smart Contract-оор нэмэгдүүлэх',
         authors='М.Нармандах', year=2025, category='Эрдэм шинжилгээ', tech=['Blockchain', 'Smart Contract'],
         description='Ulaanbaatar Blockchain Week-ийн хүрээнд болсон "Блокчэйн ба түүний хэрэглээ" эрдэм шинжилгээний хуралд I байр эзэлсэн судалгаа. Төрийн худалдан авалтын ил тод байдлыг блокчэйн ба ухаалаг гэрээ (Smart Contract) ашиглан нэмэгдүүлэх боломжийг судалсан. МСМ тэнхимийн оюутан. ' + FB),
    dict(title='Монгол Улсын бүртгэлийн нэгдсэн тогтолцоог блокчэйн технологиор төгөлдөржүүлэх нь',
         authors='Т.Ууганбаяр (магистрант)', year=2025, category='Эрдэм шинжилгээ', tech=['Blockchain'],
         description='"Блокчэйн ба түүний хэрэглээ" эрдэм шинжилгээний хуралд (Ulaanbaatar Blockchain Week) II байр эзэлсэн судалгаа. Мэдээллийн системийн магистрын оюутан. ' + FB),
    dict(title='CNN ашиглан агаарын зургаас бэлчээрийн малыг илрүүлэх, тоолох',
         authors='Н.Хөгжилт (багш)', year=2025, category='Эрдэм шинжилгээ', tech=['CNN', 'Deep Learning', 'Computer Vision'],
         description='"Detection and Counting of Grazing Cattle from Aerial Images Using CNN" өгүүлэл Scopus-д бүртгэлтэй INMATEH - Agricultural Engineering сэтгүүлд (Vol. 75, No. 1/2025) хэвлэгдсэн. ' + FB),
    dict(title='TaskFlow: Freelancing Platform', authors='TaskFlow баг', year=2024, category='Системийн шинжилгээ', tech=[],
         description='The Project Management Case Competition 2024-т 1-р байр, PMI Region 9 Project Management Case Competition 2024-т 1st runner-up (дэд байр) эзэлсэн чөлөөт ажлын платформын төсөл. ' + UFE),
    dict(title='RE-LIVE', authors='Task Flow баг', year=2024, category='Системийн шинжилгээ', tech=[],
         description='Student-Led 2024 тэмцээнд 2-р байр эзэлсэн төсөл. ' + UFE),
    dict(title='AID', authors='Agile angels баг', year=2024, category='Системийн шинжилгээ', tech=[],
         description='Student-Led 2024 тэмцээнд 1-р байр эзэлсэн төсөл. ' + UFE),
    dict(title='Unaganuud: Education Platform Upgrade Project', authors='Unaganuud баг', year=2024, category='Системийн шинжилгээ', tech=[],
         description='The Project Management Case Competition 2024-т 3-р байр эзэлсэн боловсролын платформыг сайжруулах төсөл. ' + UFE),
    dict(title='Бондоолой', authors='ASTRO баг', year=2024, category='Програм хөгжүүлэлт', tech=[],
         description='Бага насны хүүхдийн цогц хүмүүжилд чиглэсэн бүтээл. Youth Speak Project 2024-т тэргүүн байр эзэлсэн. ' + UFE),
    dict(title='MINDTECH', authors='GREENTECH баг', year=2024, category='Програм хөгжүүлэлт', tech=[],
         description='Тариалан эрхлэх сонирхолтой хүмүүст зориулсан бүтээл. Youth Speak Project 2024-т гуравдугаар байр эзэлсэн. ' + UFE),
]

# Winners of the department's "Бүтээлийн уралдаан" (2026-03-26), from the results post
CONTEST = 'МСМ тэнхимийн "Бүтээлийн уралдаан" (2026.03.26, СЭЗИС 4С, ерөнхий ивээн тэтгэгч М банк)'
EXHIBITS += [
    dict(title='Пирамид', authors='Waffle баг: Б.Тамир, Б.Энхжин, Г.Энхмэнд', year=2026, category='Програм хөгжүүлэлт', tech=[],
         description=CONTEST + '-д 1-р байр эзэлсэн бүтээл. Багийн гишүүд: МСМТ-ийн 4-р курсын оюутан Б.Тамир, 3-р курсын оюутан Б.Энхжин, Г.Энхмэнд. ' + FB),
    dict(title='Just a bit?', authors='BIT баг: Н.Мөнхпүрэв', year=2026, category='Програм хөгжүүлэлт', tech=[],
         description=CONTEST + '-д 2-р байр эзэлсэн бүтээл. IO институтын 2-р курсын оюутан Н.Мөнхпүрэв. ' + FB),
    dict(title='Mongol mind', authors='Mongol mind баг: А.Угтах-Эрин, Б.Цогт, Ч.Тамир', year=2026, category='Програм хөгжүүлэлт', tech=[],
         description=CONTEST + '-д 3-р байр эзэлсэн бүтээл. Багийн гишүүд: 2-р курсын оюутан А.Угтах-Эрин, Б.Цогт, Ч.Тамир. ' + FB),
]

# Photos in public/media (served at /media/...), keyed by exhibit title
IMAGES = {
    'TaskFlow: Freelancing Platform': '/media/exhibits/taskflow.jpg',
    'Unaganuud: Education Platform Upgrade Project': '/media/exhibits/unaganuud.jpg',
    'Бондоолой': '/media/exhibits/bondooloi.jpg',
    'MINDTECH': '/media/exhibits/mindtech.jpg',
    'AID': '/media/exhibits/aid.jpg',
    'RE-LIVE': '/media/exhibits/re-live.jpg',
    'Пирамид': '/media/exhibits/piramid.jpg',
    'Just a bit?': '/media/exhibits/just-a-bit.jpg',
    'Mongol mind': '/media/exhibits/mongol-mind.jpg',
    'CNN ашиглан агаарын зургаас бэлчээрийн малыг илрүүлэх, тоолох': '/media/exhibits/cnn-cattle.jpg',
}
EVENT_IMAGES = {
    'Хөгжлийн семинар: Кибер аюулгүй байдал': '/media/events/cyber.jpg',
    'Програмчлалын олимпиад 2026': '/media/events/olympiad.jpg',
    'Бүтээлийн уралдаан 2026': '/media/events/creations.jpg',
    'Хөгжлийн семинар: Extended Reality ба ирээдүйн чиг хандлага': '/media/events/xr.jpg',
    'Password Day 2026': '/media/events/password.jpg',
}
MILESTONE_IMAGES = {
    'Дата аналист 2+2 хөтөлбөрийн анхны төгсөлт': '/media/history/grad22.jpg',
    'Д.Аминцэцэг чирлидингийн дэлхийн аваргаас алтан медаль': '/media/history/cheer.jpg',
    'Б.Эрхэмбилэг волейболын улсын аваргаас мөнгөн медаль': '/media/history/volleyball.jpg',
    'Б.Гэрэлтцолмон багш IIBA CBAP® сертификат авсан': '/media/history/cbap.jpg',
}

# ---------- Events: only ones whose date is stated in the post (or confirmed on Facebook) ----------
EVENTS = [
    ('2025-10-30', 'Хөгжлийн семинар: Кибер аюулгүй байдал',
     'KPMG олон улсын аудитын компанитай хамтран 2 удаагийн хөгжлийн семинар зохион байгуулсан. KPMG-ийн Кибер багийн ахлах аудитор Г.Төрбат орчин үеийн кибер аюулгүй байдлын бодит кейс, сорилт, шийдлүүдийн талаар хуваалцсан. Огноо: Facebook-т нийтэлсэн өдөр. ' + FB),
    ('2026-03-20', 'Програмчлалын олимпиад 2026',
     'МСМ тэнхимийн оюутнуудын програмчлалын олимпиад. Байршил: СЭЗИС, С байрны лаборатори (C204, C206), 14:00. ' + FB),
    ('2026-03-26', 'Бүтээлийн уралдаан 2026',
     'МСМ тэнхимийн оюутнуудын бүтээлийн уралдаан, ерөнхий ивээн тэтгэгч М банк. 1-4-р курсын 50 оюутан 13 багаар веб, мобайл, хиймэл оюун ухаан, VR технологи ашигласан бүтээлээрээ өрсөлдсөн. 1-р байр: Waffle баг "Пирамид", 2-р байр: BIT баг "Just a bit?", 3-р байр: Mongol mind баг "Mongol mind". Байршил: СЭЗИС, 4С, 10:00. ' + FB),
    ('2026-03-27', 'Хөгжлийн семинар: Extended Reality ба ирээдүйн чиг хандлага',
     'Илтгэгч: Н.Чимэд-Очир, UP Tech ХХК-ийн хамтран үүсгэн байгуулагч, технологи хариуцсан захирал. XR технологи, VR/AR/MR-ийн ирээдүй, бизнест нэвтрүүлэх талаар. Байршил: С байр, 302 танхим. ' + FB),
    ('2026-05-08', 'Password Day 2026',
     'WhiteHats клубээс жил бүр зохион байгуулдаг кибер аюулгүй байдлын өдөрлөг: нууц үгийн аюулгүй байдал, account хамгаалалт, password менежер, кибер халдлагын талаарх илтгэл, хэлэлцүүлэг, password challenge, quiz. Байршил: СЭЗИС, 4C, 11:00. ' + FB),
    ('2026-06-05', 'Дипломын төслийн эцсийн хамгаалалт: Мэдээллийн систем 31 BSc',
     '31 оюутан явцын 4 үзлэг, урьдчилсан болон эцсийн хамгаалалтыг давж дипломын төслөө амжилттай хамгаалсан. Комисст Г.Нармандах (Интерактив ХХК), Э.Ууганбаяр (Шунхлай ХХК), О.Тулга (Смарт Софтвэйр Солюшн ХХК) ажил олгогчийн төлөөллөөр оролцсон. ' + FB),
]

# ---------- History (year is stated in the source) ----------
MILESTONES = [
    (2005, 'Мэдээллийн систем хөтөлбөр мэргэжилтэн бэлтгэж эхэлсэн',
     'Санхүү эдийн засгийн их сургуулийн Мэдээллийн систем хөтөлбөр 2005 оноос мэргэжилтэн бэлтгэж эхэлсэн бөгөөд бакалавр, магистр, олон улсын 2+2, олон улсын мэргэжлийн дипломтой хөтөлбөрүүдийг хэрэгжүүлж байна. ' + FB),
    (2025, 'Class of 2025: 23 оюутан дипломын төслөө хамгаалсан',
     'Мэдээллийн системийн бакалаврын хөтөлбөрийн 23 оюутан дипломын төслөө хамгаалж, 13 оюутан "Ажлын байранд суурилсан дадлагажих хөтөлбөр"-ийн дагуу Хаан банк, Голомт банк, МИАТ ТӨХК, Смарт ложик ХХК, Юнител ХХК, Интерактив ХХК-д дадлагажин төгссөн. ' + FB),
    (2025, 'Н.Хөгжилт багшийн өгүүлэл Scopus-д бүртгэлтэй сэтгүүлд хэвлэгдсэн',
     '"CNN ашиглан агаарын зургаас бэлчээрийн малыг илрүүлэх, тоолох" өгүүлэл INMATEH - Agricultural Engineering (Vol. 75, No. 1/2025) сэтгүүлд хэвлэгдсэн. ' + FB),
    (2026, 'Дата аналист 2+2 хөтөлбөрийн анхны төгсөлт',
     'Тайваний Азийн их сургуультай (Asia University) хамтарсан хөтөлбөрийн 14 оюутан анх удаа төгссөн. Б.Есүйжин Азийн их сургуулийн 2026 оны шилдэг 2 төгсөгчийн нэгээр шалгарч "Excellence award" хүртсэн. ' + FB),
    (2026, 'Д.Аминцэцэг чирлидингийн дэлхийн аваргаас алтан медаль',
     '2-р курсын оюутан Д.Аминцэцэг FISU-ийн Дэлхийн их сургуулийн чирлидингийн аварга шалгаруулах тэмцээнд (2026.06.05–07, Швед, Гётеборг) Монголын оюутны шигшээ багийн бүрэлдэхүүнд TEAM POM төрөлд алтан медаль хүртсэн. ' + FB),
    (2026, 'Б.Эрхэмбилэг волейболын улсын аваргаас мөнгөн медаль',
     'BTEC хөтөлбөрийн I курсын оюутан Б.Эрхэмбилэг "18 насны Улсын аварга шалгаруулах тэмцээн-2026"-д дэд байр эзэлж, мөнгөн медаль хүртсэн. ' + FB),
    (2026, '46 төгсөгч: СЭЗИС-ийн 102 дахь хичээлийн жилийн төгсөлт',
     'Бакалаврын зэрэг, диплом гардуулах ёслолоор Мэдээллийн системийн 46 төгсөгч төгссөн. ' + FB),
    (2026, 'Б.Гэрэлтцолмон багш IIBA CBAP® сертификат авсан',
     'Business Analysis-ийн дэлхийд хүлээн зөвшөөрөгдсөн хамгийн өндөр түвшний CBAP® (Certified Business Analysis Professional) сертификатыг амжилттай хамгаалсан. ' + FB),
]

out = [
    '-- ISM Дижитал музей: Facebook (Мэдээллийн систем хөтөлбөр) ба ufe.edu.mn-ээс авсан мэдээлэл',
    '-- Supabase -> SQL Editor-т бүхэлд нь хуулж Run дарна. Зөвхөн НЭМНЭ, юу ч устгахгүй. Дахин ажиллуулбал давхардахгүй.',
    '-- Үзмэрүүдийн "бүтээгч" нь сайтын анхны админ данс болно; оюутан/багийн нэр "authors" баганад хадгалагдана.',
    '',
    'alter table public.exhibits add column if not exists authors text;',
    '',
    "insert into public.exhibition_categories (name, description)",
    "select 'Эрдэм шинжилгээ', 'Эрдэм шинжилгээний өгүүлэл, хурлын илтгэл, судалгааны бүтээл'",
    "where not exists (select 1 from public.exhibition_categories where name = 'Эрдэм шинжилгээ');",
    '',
    'alter table public.milestones add column if not exists image_url text;',
    '',
    '-- 1. Үзмэр',
]
for e in EXHIBITS:
    out += [
        'insert into public.exhibits (title, description, category, technology_stack, year_created, authors, image_url, status, creator_id)',
        f"select {q(e['title'])}, {q(e['description'])}, {q(e['category'])}, {q(e['tech'])}, {e['year']}, {q(e['authors'])}, {q(IMAGES.get(e['title']))}, 'approved',",
        "  (select id from public.profiles where role = 'admin' order by created_at limit 1)",
        f"where not exists (select 1 from public.exhibits where title = {q(e['title'])});",
    ]
    if IMAGES.get(e['title']):  # also fills the photo if this file was run before photos existed
        out.append(f"update public.exhibits set image_url = {q(IMAGES[e['title']])} where title = {q(e['title'])} and image_url is null;")
    out.append('')
out.append('-- 2. Арга хэмжээ')
for d, t, desc in EVENTS:
    out += [
        'insert into public.events (title, event_date, description, cover_image_url)',
        f"select {q(t)}, {q(d)}, {q(desc)}, {q(EVENT_IMAGES.get(t))}",
        f"where not exists (select 1 from public.events where title = {q(t)});",
    ]
    if EVENT_IMAGES.get(t):
        out.append(f"update public.events set cover_image_url = {q(EVENT_IMAGES[t])} where title = {q(t)} and cover_image_url is null;")
    out.append('')
# Refresh texts that changed after this file was first published (only if still the old wording)
out.append("update public.events set description = " + q([e for e in EVENTS if e[1] == 'Бүтээлийн уралдаан 2026'][0][2]) + " where title = 'Бүтээлийн уралдаан 2026' and description not like '%Пирамид%';")
out.append("update public.events set description = " + q([e for e in EVENTS if e[1] == 'Password Day 2026'][0][2]) + " where title = 'Password Day 2026' and description like '%05/08/2026%';")
out.append('')
out.append('-- 3. Тэнхимийн түүх')
for y, t, desc in MILESTONES:
    out += [
        'insert into public.milestones (year, title, description, image_url)',
        f"select {y}, {q(t)}, {q(desc)}, {q(MILESTONE_IMAGES.get(t))}",
        f"where not exists (select 1 from public.milestones where title = {q(t)});",
    ]
    if MILESTONE_IMAGES.get(t):
        out.append(f"update public.milestones set image_url = {q(MILESTONE_IMAGES[t])} where title = {q(t)} and image_url is null;")
    out.append('')
out += [
    "notify pgrst, 'reload schema';",
    '',
    '-- Шалгах',
    "select (select count(*) from public.exhibits where authors is not null) as exhibits_with_authors,",
    "       (select count(*) from public.events) as events, (select count(*) from public.milestones) as milestones;",
    '',
]
(HERE / 'facebook.sql').write_text('\n'.join(out), encoding='utf-8')
print(f'facebook.sql: {len(EXHIBITS)} exhibits, {len(EVENTS)} events, {len(MILESTONES)} milestones')
