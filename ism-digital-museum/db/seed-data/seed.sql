-- ISM Дижитал музей: бодит өгөгдөл (эх сурвалж: ufe.edu.mn, Мэдээллийн систем + AI хөтөлбөр)
-- Supabase -> SQL Editor-т бүхэлд нь хуулж Run дарна. Зөвхөн НЭМНЭ, юу ч устгахгүй.
-- Дахин ажиллуулбал давхардахгүй (ижил гарчиг/нэртэй мөрийг алгасна).

-- 1. Тэнхимийн түүх: 2024 оны оюутны амжилтууд
insert into public.milestones (year, title, description)
select v.year, v.title, v.description from (values
  (2024, 'PMI Region 9 Project Management Case Competition 2024', 'Мэдээллийн систем хөтөлбөрийн оюутнуудын TASKFLOW баг 1st runner-up (Дэд байр) эзэлсэн. Эх сурвалж: ufe.edu.mn, Мэдээллийн систем + AI хөтөлбөр.'),
  (2024, 'Монголын Үндэсний Программчлалын XIV олимпиад', 'Д.Чингарал, Ч.Өнөбилиг нарын бүрэлдэхүүнтэй "МСМ" баг хүрэл медаль хүртсэн. Эх сурвалж: ufe.edu.mn, Мэдээллийн систем + AI хөтөлбөр.'),
  (2024, 'Youth Speak Project 2024', 'ASTRO баг бага насны хүүхдийн цогц хүмүүжилд чиглэсэн "Бондоолой" бүтээлээр тэргүүн байр, GREENTECH баг тариалан эрхлэгчдэд зориулсан MINDTECH бүтээлээр гуравдугаар байр эзэлсэн. Эх сурвалж: ufe.edu.mn, Мэдээллийн систем + AI хөтөлбөр.'),
  (2024, 'Dev Hackathon 2024', 'AXLETH баг гуравдугаар байр эзэлсэн. Эх сурвалж: ufe.edu.mn, Мэдээллийн систем + AI хөтөлбөр.'),
  (2024, 'СЭЗИС-ийн нэрэмжит Оюутны ЭШХ', 'А.Өсөхбаяр, У.Сумъяабазар нар тэргүүн байр эзэлсэн. Эх сурвалж: ufe.edu.mn, Мэдээллийн систем + AI хөтөлбөр.'),
  (2024, 'The Project Management Case Competition 2024', '1-р байр: TaskFlow (Freelancing Platform), 3-р байр: Unaganuud (Education Platform Upgrade Project). Эх сурвалж: ufe.edu.mn, Мэдээллийн систем + AI хөтөлбөр.'),
  (2024, 'DX CUP 2024', 'AXLETH баг 2-р байр эзэлсэн. Эх сурвалж: ufe.edu.mn, Мэдээллийн систем + AI хөтөлбөр.'),
  (2024, 'Student-Led 2024', 'Agile angels баг "AID" төслөөр 1-р байр, Task Flow баг "RE-LIVE" төслөөр 2-р байр эзэлсэн. Эх сурвалж: ufe.edu.mn, Мэдээллийн систем + AI хөтөлбөр.')
) as v(year, title, description)
where not exists (select 1 from public.milestones m where m.title = v.title);

-- 2. Үзмэрийн ангилал: хөтөлбөрийн мэргэших чиглэлүүд
insert into public.exhibition_categories (name, description)
select v.name, v.description from (values
  ('UX, UI хөгжүүлэлт', 'Мэргэших чиглэл: хэрэглэгчийн туршлага, интерфэйсийн дизайн ба хөгжүүлэлт.'),
  ('Дата аналист', 'Мэргэших чиглэл: өгөгдөл боловсруулах, шинжлэх, дүрслэх.'),
  ('Статистик + Мэдээллийн технологи', 'Мэргэших чиглэл: статистикийн арга ба мэдээллийн технологийн хослол.'),
  ('Системийн шинжилгээ', 'Мэргэших чиглэл: бизнесийн процесс, мэдээллийн системийн шинжилгээ, зохиомж.'),
  ('Програм хөгжүүлэлт', 'Мэргэших чиглэл: вэб, мобайл, системийн програм хангамж хөгжүүлэлт.')
) as v(name, description)
where not exists (select 1 from public.exhibition_categories c where c.name = v.name);

-- Шалгах: доорх 2 тоо 8 ба 5-аас багагүй байх ёстой
select (select count(*) from public.milestones) as milestones, (select count(*) from public.exhibition_categories) as categories;
