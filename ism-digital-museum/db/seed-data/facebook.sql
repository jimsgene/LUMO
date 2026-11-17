-- ISM Дижитал музей: Facebook (Мэдээллийн систем хөтөлбөр) ба ufe.edu.mn-ээс авсан мэдээлэл
-- Supabase -> SQL Editor-т бүхэлд нь хуулж Run дарна. Зөвхөн НЭМНЭ, юу ч устгахгүй. Дахин ажиллуулбал давхардахгүй.
-- Үзмэрүүдийн "бүтээгч" нь сайтын анхны админ данс болно; оюутан/багийн нэр "authors" баганад хадгалагдана.

alter table public.exhibits add column if not exists authors text;

insert into public.exhibition_categories (name, description)
select 'Эрдэм шинжилгээ', 'Эрдэм шинжилгээний өгүүлэл, хурлын илтгэл, судалгааны бүтээл'
where not exists (select 1 from public.exhibition_categories where name = 'Эрдэм шинжилгээ');

alter table public.milestones add column if not exists image_url text;

-- 1. Үзмэр
insert into public.exhibits (title, description, category, technology_stack, year_created, authors, image_url, status, creator_id)
select 'Төрийн худалдан авалтын ил тод байдлыг блокчэйн ба Smart Contract-оор нэмэгдүүлэх', 'Ulaanbaatar Blockchain Week-ийн хүрээнд болсон "Блокчэйн ба түүний хэрэглээ" эрдэм шинжилгээний хуралд I байр эзэлсэн судалгаа. Төрийн худалдан авалтын ил тод байдлыг блокчэйн ба ухаалаг гэрээ (Smart Contract) ашиглан нэмэгдүүлэх боломжийг судалсан. МСМ тэнхимийн оюутан. Эх сурвалж: Мэдээллийн систем хөтөлбөрийн Facebook хуудас.', 'Эрдэм шинжилгээ', array['Blockchain', 'Smart Contract']::text[], 2025, 'М.Нармандах', null, 'approved',
  (select id from public.profiles where role = 'admin' order by created_at limit 1)
where not exists (select 1 from public.exhibits where title = 'Төрийн худалдан авалтын ил тод байдлыг блокчэйн ба Smart Contract-оор нэмэгдүүлэх');

insert into public.exhibits (title, description, category, technology_stack, year_created, authors, image_url, status, creator_id)
select 'Монгол Улсын бүртгэлийн нэгдсэн тогтолцоог блокчэйн технологиор төгөлдөржүүлэх нь', '"Блокчэйн ба түүний хэрэглээ" эрдэм шинжилгээний хуралд (Ulaanbaatar Blockchain Week) II байр эзэлсэн судалгаа. Мэдээллийн системийн магистрын оюутан. Эх сурвалж: Мэдээллийн систем хөтөлбөрийн Facebook хуудас.', 'Эрдэм шинжилгээ', array['Blockchain']::text[], 2025, 'Т.Ууганбаяр (магистрант)', null, 'approved',
  (select id from public.profiles where role = 'admin' order by created_at limit 1)
where not exists (select 1 from public.exhibits where title = 'Монгол Улсын бүртгэлийн нэгдсэн тогтолцоог блокчэйн технологиор төгөлдөржүүлэх нь');

insert into public.exhibits (title, description, category, technology_stack, year_created, authors, image_url, status, creator_id)
select 'CNN ашиглан агаарын зургаас бэлчээрийн малыг илрүүлэх, тоолох', '"Detection and Counting of Grazing Cattle from Aerial Images Using CNN" өгүүлэл Scopus-д бүртгэлтэй INMATEH - Agricultural Engineering сэтгүүлд (Vol. 75, No. 1/2025) хэвлэгдсэн. Эх сурвалж: Мэдээллийн систем хөтөлбөрийн Facebook хуудас.', 'Эрдэм шинжилгээ', array['CNN', 'Deep Learning', 'Computer Vision']::text[], 2025, 'Н.Хөгжилт (багш)', '/media/exhibits/cnn-cattle.jpg', 'approved',
  (select id from public.profiles where role = 'admin' order by created_at limit 1)
where not exists (select 1 from public.exhibits where title = 'CNN ашиглан агаарын зургаас бэлчээрийн малыг илрүүлэх, тоолох');
update public.exhibits set image_url = '/media/exhibits/cnn-cattle.jpg' where title = 'CNN ашиглан агаарын зургаас бэлчээрийн малыг илрүүлэх, тоолох' and image_url is null;

insert into public.exhibits (title, description, category, technology_stack, year_created, authors, image_url, status, creator_id)
select 'TaskFlow: Freelancing Platform', 'The Project Management Case Competition 2024-т 1-р байр, PMI Region 9 Project Management Case Competition 2024-т 1st runner-up (дэд байр) эзэлсэн чөлөөт ажлын платформын төсөл. Эх сурвалж: ufe.edu.mn, Мэдээллийн систем + AI хөтөлбөр.', 'Системийн шинжилгээ', '{}'::text[], 2024, 'TaskFlow баг', '/media/exhibits/taskflow.jpg', 'approved',
  (select id from public.profiles where role = 'admin' order by created_at limit 1)
where not exists (select 1 from public.exhibits where title = 'TaskFlow: Freelancing Platform');
update public.exhibits set image_url = '/media/exhibits/taskflow.jpg' where title = 'TaskFlow: Freelancing Platform' and image_url is null;

insert into public.exhibits (title, description, category, technology_stack, year_created, authors, image_url, status, creator_id)
select 'RE-LIVE', 'Student-Led 2024 тэмцээнд 2-р байр эзэлсэн төсөл. Эх сурвалж: ufe.edu.mn, Мэдээллийн систем + AI хөтөлбөр.', 'Системийн шинжилгээ', '{}'::text[], 2024, 'Task Flow баг', '/media/exhibits/re-live.jpg', 'approved',
  (select id from public.profiles where role = 'admin' order by created_at limit 1)
where not exists (select 1 from public.exhibits where title = 'RE-LIVE');
update public.exhibits set image_url = '/media/exhibits/re-live.jpg' where title = 'RE-LIVE' and image_url is null;

insert into public.exhibits (title, description, category, technology_stack, year_created, authors, image_url, status, creator_id)
select 'AID', 'Student-Led 2024 тэмцээнд 1-р байр эзэлсэн төсөл. Эх сурвалж: ufe.edu.mn, Мэдээллийн систем + AI хөтөлбөр.', 'Системийн шинжилгээ', '{}'::text[], 2024, 'Agile angels баг', '/media/exhibits/aid.jpg', 'approved',
  (select id from public.profiles where role = 'admin' order by created_at limit 1)
where not exists (select 1 from public.exhibits where title = 'AID');
update public.exhibits set image_url = '/media/exhibits/aid.jpg' where title = 'AID' and image_url is null;

insert into public.exhibits (title, description, category, technology_stack, year_created, authors, image_url, status, creator_id)
select 'Unaganuud: Education Platform Upgrade Project', 'The Project Management Case Competition 2024-т 3-р байр эзэлсэн боловсролын платформыг сайжруулах төсөл. Эх сурвалж: ufe.edu.mn, Мэдээллийн систем + AI хөтөлбөр.', 'Системийн шинжилгээ', '{}'::text[], 2024, 'Unaganuud баг', '/media/exhibits/unaganuud.jpg', 'approved',
  (select id from public.profiles where role = 'admin' order by created_at limit 1)
where not exists (select 1 from public.exhibits where title = 'Unaganuud: Education Platform Upgrade Project');
update public.exhibits set image_url = '/media/exhibits/unaganuud.jpg' where title = 'Unaganuud: Education Platform Upgrade Project' and image_url is null;

insert into public.exhibits (title, description, category, technology_stack, year_created, authors, image_url, status, creator_id)
select 'Бондоолой', 'Бага насны хүүхдийн цогц хүмүүжилд чиглэсэн бүтээл. Youth Speak Project 2024-т тэргүүн байр эзэлсэн. Эх сурвалж: ufe.edu.mn, Мэдээллийн систем + AI хөтөлбөр.', 'Програм хөгжүүлэлт', '{}'::text[], 2024, 'ASTRO баг', '/media/exhibits/bondooloi.jpg', 'approved',
  (select id from public.profiles where role = 'admin' order by created_at limit 1)
where not exists (select 1 from public.exhibits where title = 'Бондоолой');
update public.exhibits set image_url = '/media/exhibits/bondooloi.jpg' where title = 'Бондоолой' and image_url is null;

insert into public.exhibits (title, description, category, technology_stack, year_created, authors, image_url, status, creator_id)
select 'MINDTECH', 'Тариалан эрхлэх сонирхолтой хүмүүст зориулсан бүтээл. Youth Speak Project 2024-т гуравдугаар байр эзэлсэн. Эх сурвалж: ufe.edu.mn, Мэдээллийн систем + AI хөтөлбөр.', 'Програм хөгжүүлэлт', '{}'::text[], 2024, 'GREENTECH баг', '/media/exhibits/mindtech.jpg', 'approved',
  (select id from public.profiles where role = 'admin' order by created_at limit 1)
where not exists (select 1 from public.exhibits where title = 'MINDTECH');
update public.exhibits set image_url = '/media/exhibits/mindtech.jpg' where title = 'MINDTECH' and image_url is null;

insert into public.exhibits (title, description, category, technology_stack, year_created, authors, image_url, status, creator_id)
select 'Пирамид', 'МСМ тэнхимийн "Бүтээлийн уралдаан" (2026.03.26, СЭЗИС 4С, ерөнхий ивээн тэтгэгч М банк)-д 1-р байр эзэлсэн бүтээл. Багийн гишүүд: МСМТ-ийн 4-р курсын оюутан Б.Тамир, 3-р курсын оюутан Б.Энхжин, Г.Энхмэнд. Эх сурвалж: Мэдээллийн систем хөтөлбөрийн Facebook хуудас.', 'Програм хөгжүүлэлт', '{}'::text[], 2026, 'Waffle баг: Б.Тамир, Б.Энхжин, Г.Энхмэнд', '/media/exhibits/piramid.jpg', 'approved',
  (select id from public.profiles where role = 'admin' order by created_at limit 1)
where not exists (select 1 from public.exhibits where title = 'Пирамид');
update public.exhibits set image_url = '/media/exhibits/piramid.jpg' where title = 'Пирамид' and image_url is null;

insert into public.exhibits (title, description, category, technology_stack, year_created, authors, image_url, status, creator_id)
select 'Just a bit?', 'МСМ тэнхимийн "Бүтээлийн уралдаан" (2026.03.26, СЭЗИС 4С, ерөнхий ивээн тэтгэгч М банк)-д 2-р байр эзэлсэн бүтээл. IO институтын 2-р курсын оюутан Н.Мөнхпүрэв. Эх сурвалж: Мэдээллийн систем хөтөлбөрийн Facebook хуудас.', 'Програм хөгжүүлэлт', '{}'::text[], 2026, 'BIT баг: Н.Мөнхпүрэв', '/media/exhibits/just-a-bit.jpg', 'approved',
  (select id from public.profiles where role = 'admin' order by created_at limit 1)
where not exists (select 1 from public.exhibits where title = 'Just a bit?');
update public.exhibits set image_url = '/media/exhibits/just-a-bit.jpg' where title = 'Just a bit?' and image_url is null;

insert into public.exhibits (title, description, category, technology_stack, year_created, authors, image_url, status, creator_id)
select 'Mongol mind', 'МСМ тэнхимийн "Бүтээлийн уралдаан" (2026.03.26, СЭЗИС 4С, ерөнхий ивээн тэтгэгч М банк)-д 3-р байр эзэлсэн бүтээл. Багийн гишүүд: 2-р курсын оюутан А.Угтах-Эрин, Б.Цогт, Ч.Тамир. Эх сурвалж: Мэдээллийн систем хөтөлбөрийн Facebook хуудас.', 'Програм хөгжүүлэлт', '{}'::text[], 2026, 'Mongol mind баг: А.Угтах-Эрин, Б.Цогт, Ч.Тамир', '/media/exhibits/mongol-mind.jpg', 'approved',
  (select id from public.profiles where role = 'admin' order by created_at limit 1)
where not exists (select 1 from public.exhibits where title = 'Mongol mind');
update public.exhibits set image_url = '/media/exhibits/mongol-mind.jpg' where title = 'Mongol mind' and image_url is null;

-- 2. Арга хэмжээ
insert into public.events (title, event_date, description, cover_image_url)
select 'Хөгжлийн семинар: Кибер аюулгүй байдал', '2025-10-30', 'KPMG олон улсын аудитын компанитай хамтран 2 удаагийн хөгжлийн семинар зохион байгуулсан. KPMG-ийн Кибер багийн ахлах аудитор Г.Төрбат орчин үеийн кибер аюулгүй байдлын бодит кейс, сорилт, шийдлүүдийн талаар хуваалцсан. Огноо: Facebook-т нийтэлсэн өдөр. Эх сурвалж: Мэдээллийн систем хөтөлбөрийн Facebook хуудас.', '/media/events/cyber.jpg'
where not exists (select 1 from public.events where title = 'Хөгжлийн семинар: Кибер аюулгүй байдал');
update public.events set cover_image_url = '/media/events/cyber.jpg' where title = 'Хөгжлийн семинар: Кибер аюулгүй байдал' and cover_image_url is null;

insert into public.events (title, event_date, description, cover_image_url)
select 'Програмчлалын олимпиад 2026', '2026-03-20', 'МСМ тэнхимийн оюутнуудын програмчлалын олимпиад. Байршил: СЭЗИС, С байрны лаборатори (C204, C206), 14:00. Эх сурвалж: Мэдээллийн систем хөтөлбөрийн Facebook хуудас.', '/media/events/olympiad.jpg'
where not exists (select 1 from public.events where title = 'Програмчлалын олимпиад 2026');
update public.events set cover_image_url = '/media/events/olympiad.jpg' where title = 'Програмчлалын олимпиад 2026' and cover_image_url is null;

insert into public.events (title, event_date, description, cover_image_url)
select 'Бүтээлийн уралдаан 2026', '2026-03-26', 'МСМ тэнхимийн оюутнуудын бүтээлийн уралдаан, ерөнхий ивээн тэтгэгч М банк. 1-4-р курсын 50 оюутан 13 багаар веб, мобайл, хиймэл оюун ухаан, VR технологи ашигласан бүтээлээрээ өрсөлдсөн. 1-р байр: Waffle баг "Пирамид", 2-р байр: BIT баг "Just a bit?", 3-р байр: Mongol mind баг "Mongol mind". Байршил: СЭЗИС, 4С, 10:00. Эх сурвалж: Мэдээллийн систем хөтөлбөрийн Facebook хуудас.', '/media/events/creations.jpg'
where not exists (select 1 from public.events where title = 'Бүтээлийн уралдаан 2026');
update public.events set cover_image_url = '/media/events/creations.jpg' where title = 'Бүтээлийн уралдаан 2026' and cover_image_url is null;

insert into public.events (title, event_date, description, cover_image_url)
select 'Хөгжлийн семинар: Extended Reality ба ирээдүйн чиг хандлага', '2026-03-27', 'Илтгэгч: Н.Чимэд-Очир, UP Tech ХХК-ийн хамтран үүсгэн байгуулагч, технологи хариуцсан захирал. XR технологи, VR/AR/MR-ийн ирээдүй, бизнест нэвтрүүлэх талаар. Байршил: С байр, 302 танхим. Эх сурвалж: Мэдээллийн систем хөтөлбөрийн Facebook хуудас.', '/media/events/xr.jpg'
where not exists (select 1 from public.events where title = 'Хөгжлийн семинар: Extended Reality ба ирээдүйн чиг хандлага');
update public.events set cover_image_url = '/media/events/xr.jpg' where title = 'Хөгжлийн семинар: Extended Reality ба ирээдүйн чиг хандлага' and cover_image_url is null;

insert into public.events (title, event_date, description, cover_image_url)
select 'Password Day 2026', '2026-05-08', 'WhiteHats клубээс жил бүр зохион байгуулдаг кибер аюулгүй байдлын өдөрлөг: нууц үгийн аюулгүй байдал, account хамгаалалт, password менежер, кибер халдлагын талаарх илтгэл, хэлэлцүүлэг, password challenge, quiz. Байршил: СЭЗИС, 4C, 11:00. Эх сурвалж: Мэдээллийн систем хөтөлбөрийн Facebook хуудас.', '/media/events/password.jpg'
where not exists (select 1 from public.events where title = 'Password Day 2026');
update public.events set cover_image_url = '/media/events/password.jpg' where title = 'Password Day 2026' and cover_image_url is null;

insert into public.events (title, event_date, description, cover_image_url)
select 'Дипломын төслийн эцсийн хамгаалалт: Мэдээллийн систем 31 BSc', '2026-06-05', '31 оюутан явцын 4 үзлэг, урьдчилсан болон эцсийн хамгаалалтыг давж дипломын төслөө амжилттай хамгаалсан. Комисст Г.Нармандах (Интерактив ХХК), Э.Ууганбаяр (Шунхлай ХХК), О.Тулга (Смарт Софтвэйр Солюшн ХХК) ажил олгогчийн төлөөллөөр оролцсон. Эх сурвалж: Мэдээллийн систем хөтөлбөрийн Facebook хуудас.', null
where not exists (select 1 from public.events where title = 'Дипломын төслийн эцсийн хамгаалалт: Мэдээллийн систем 31 BSc');

update public.events set description = 'МСМ тэнхимийн оюутнуудын бүтээлийн уралдаан, ерөнхий ивээн тэтгэгч М банк. 1-4-р курсын 50 оюутан 13 багаар веб, мобайл, хиймэл оюун ухаан, VR технологи ашигласан бүтээлээрээ өрсөлдсөн. 1-р байр: Waffle баг "Пирамид", 2-р байр: BIT баг "Just a bit?", 3-р байр: Mongol mind баг "Mongol mind". Байршил: СЭЗИС, 4С, 10:00. Эх сурвалж: Мэдээллийн систем хөтөлбөрийн Facebook хуудас.' where title = 'Бүтээлийн уралдаан 2026' and description not like '%Пирамид%';
update public.events set description = 'WhiteHats клубээс жил бүр зохион байгуулдаг кибер аюулгүй байдлын өдөрлөг: нууц үгийн аюулгүй байдал, account хамгаалалт, password менежер, кибер халдлагын талаарх илтгэл, хэлэлцүүлэг, password challenge, quiz. Байршил: СЭЗИС, 4C, 11:00. Эх сурвалж: Мэдээллийн систем хөтөлбөрийн Facebook хуудас.' where title = 'Password Day 2026' and description like '%05/08/2026%';

-- 3. Тэнхимийн түүх
insert into public.milestones (year, title, description, image_url)
select 2005, 'Мэдээллийн систем хөтөлбөр мэргэжилтэн бэлтгэж эхэлсэн', 'Санхүү эдийн засгийн их сургуулийн Мэдээллийн систем хөтөлбөр 2005 оноос мэргэжилтэн бэлтгэж эхэлсэн бөгөөд бакалавр, магистр, олон улсын 2+2, олон улсын мэргэжлийн дипломтой хөтөлбөрүүдийг хэрэгжүүлж байна. Эх сурвалж: Мэдээллийн систем хөтөлбөрийн Facebook хуудас.', null
where not exists (select 1 from public.milestones where title = 'Мэдээллийн систем хөтөлбөр мэргэжилтэн бэлтгэж эхэлсэн');

insert into public.milestones (year, title, description, image_url)
select 2025, 'Class of 2025: 23 оюутан дипломын төслөө хамгаалсан', 'Мэдээллийн системийн бакалаврын хөтөлбөрийн 23 оюутан дипломын төслөө хамгаалж, 13 оюутан "Ажлын байранд суурилсан дадлагажих хөтөлбөр"-ийн дагуу Хаан банк, Голомт банк, МИАТ ТӨХК, Смарт ложик ХХК, Юнител ХХК, Интерактив ХХК-д дадлагажин төгссөн. Эх сурвалж: Мэдээллийн систем хөтөлбөрийн Facebook хуудас.', null
where not exists (select 1 from public.milestones where title = 'Class of 2025: 23 оюутан дипломын төслөө хамгаалсан');

insert into public.milestones (year, title, description, image_url)
select 2025, 'Н.Хөгжилт багшийн өгүүлэл Scopus-д бүртгэлтэй сэтгүүлд хэвлэгдсэн', '"CNN ашиглан агаарын зургаас бэлчээрийн малыг илрүүлэх, тоолох" өгүүлэл INMATEH - Agricultural Engineering (Vol. 75, No. 1/2025) сэтгүүлд хэвлэгдсэн. Эх сурвалж: Мэдээллийн систем хөтөлбөрийн Facebook хуудас.', null
where not exists (select 1 from public.milestones where title = 'Н.Хөгжилт багшийн өгүүлэл Scopus-д бүртгэлтэй сэтгүүлд хэвлэгдсэн');

insert into public.milestones (year, title, description, image_url)
select 2026, 'Дата аналист 2+2 хөтөлбөрийн анхны төгсөлт', 'Тайваний Азийн их сургуультай (Asia University) хамтарсан хөтөлбөрийн 14 оюутан анх удаа төгссөн. Б.Есүйжин Азийн их сургуулийн 2026 оны шилдэг 2 төгсөгчийн нэгээр шалгарч "Excellence award" хүртсэн. Эх сурвалж: Мэдээллийн систем хөтөлбөрийн Facebook хуудас.', '/media/history/grad22.jpg'
where not exists (select 1 from public.milestones where title = 'Дата аналист 2+2 хөтөлбөрийн анхны төгсөлт');
update public.milestones set image_url = '/media/history/grad22.jpg' where title = 'Дата аналист 2+2 хөтөлбөрийн анхны төгсөлт' and image_url is null;

insert into public.milestones (year, title, description, image_url)
select 2026, 'Д.Аминцэцэг чирлидингийн дэлхийн аваргаас алтан медаль', '2-р курсын оюутан Д.Аминцэцэг FISU-ийн Дэлхийн их сургуулийн чирлидингийн аварга шалгаруулах тэмцээнд (2026.06.05–07, Швед, Гётеборг) Монголын оюутны шигшээ багийн бүрэлдэхүүнд TEAM POM төрөлд алтан медаль хүртсэн. Эх сурвалж: Мэдээллийн систем хөтөлбөрийн Facebook хуудас.', '/media/history/cheer.jpg'
where not exists (select 1 from public.milestones where title = 'Д.Аминцэцэг чирлидингийн дэлхийн аваргаас алтан медаль');
update public.milestones set image_url = '/media/history/cheer.jpg' where title = 'Д.Аминцэцэг чирлидингийн дэлхийн аваргаас алтан медаль' and image_url is null;

insert into public.milestones (year, title, description, image_url)
select 2026, 'Б.Эрхэмбилэг волейболын улсын аваргаас мөнгөн медаль', 'BTEC хөтөлбөрийн I курсын оюутан Б.Эрхэмбилэг "18 насны Улсын аварга шалгаруулах тэмцээн-2026"-д дэд байр эзэлж, мөнгөн медаль хүртсэн. Эх сурвалж: Мэдээллийн систем хөтөлбөрийн Facebook хуудас.', '/media/history/volleyball.jpg'
where not exists (select 1 from public.milestones where title = 'Б.Эрхэмбилэг волейболын улсын аваргаас мөнгөн медаль');
update public.milestones set image_url = '/media/history/volleyball.jpg' where title = 'Б.Эрхэмбилэг волейболын улсын аваргаас мөнгөн медаль' and image_url is null;

insert into public.milestones (year, title, description, image_url)
select 2026, '46 төгсөгч: СЭЗИС-ийн 102 дахь хичээлийн жилийн төгсөлт', 'Бакалаврын зэрэг, диплом гардуулах ёслолоор Мэдээллийн системийн 46 төгсөгч төгссөн. Эх сурвалж: Мэдээллийн систем хөтөлбөрийн Facebook хуудас.', null
where not exists (select 1 from public.milestones where title = '46 төгсөгч: СЭЗИС-ийн 102 дахь хичээлийн жилийн төгсөлт');

insert into public.milestones (year, title, description, image_url)
select 2026, 'Б.Гэрэлтцолмон багш IIBA CBAP® сертификат авсан', 'Business Analysis-ийн дэлхийд хүлээн зөвшөөрөгдсөн хамгийн өндөр түвшний CBAP® (Certified Business Analysis Professional) сертификатыг амжилттай хамгаалсан. Эх сурвалж: Мэдээллийн систем хөтөлбөрийн Facebook хуудас.', '/media/history/cbap.jpg'
where not exists (select 1 from public.milestones where title = 'Б.Гэрэлтцолмон багш IIBA CBAP® сертификат авсан');
update public.milestones set image_url = '/media/history/cbap.jpg' where title = 'Б.Гэрэлтцолмон багш IIBA CBAP® сертификат авсан' and image_url is null;

notify pgrst, 'reload schema';

-- Шалгах
select (select count(*) from public.exhibits where authors is not null) as exhibits_with_authors,
       (select count(*) from public.events) as events, (select count(*) from public.milestones) as milestones;
