// ============================================================
//  ХУВИЙН МЭДЭЭЛЭЛ — сайтын бүх агуулга энд байна.
//  Өөрчлөх бол зөвхөн энэ файлыг засахад хангалттай.
// ============================================================

export const owner = {
  name: 'Ганхуяг Анар',
  firstName: 'Анар',            // OS-ийн нэр болно → "АНАР/OS"
  initials: 'ГА',
  role: 'Full-stack хөгжүүлэгч · Мэдээллийн системийн оюутан',
  tagline: 'Санааг өгөгдлийн сангаас эхлээд дэлгэц дээрх сүүлийн пиксел хүртэл бүтээдэг.',
  location: 'Улаанбаатар, Монгол',
  university: 'Санхүү Эдийн Засгийн Их Сургууль (UFE)',
  email: 'B23FA1236@ufe.edu.mn',
  github: 'https://github.com/jimsgene',
  linkedin: '',
  facebook: '',
  instagram: '',
  status: 'Дадлагад нээлттэй',
};

// "Одоо" виджет — одоо юу хийж байгаа вэ
export const now = [
  'SWE334 — портфолио OS бүтээж байна',
  'KINET платформоо хөгжүүлж байна',
  'Зуны дадлага хайж байна',
];

// Товч намтар — догол мөр бүр тусдаа
export const bio = [
  'Сайн байна уу! Би UFE-ийн Мэдээллийн системийн оюутан, full-stack хөгжүүлэгч. Хэрэглэгчийн интерфэйсээс эхлээд өгөгдлийн сан, нэвтрэлт, эрхийн удирдлага хүртэл бүхэл системийг өөрөө бүтээх дуртай.',
  'React болон Supabase дээр бодит хэрэглээтэй вэб платформ, React Native-аар гар утасны апп хийсэн. Монгол хэрэглэгчдийн өдөр тутмын асуудлыг шийддэг бүтээгдэхүүн хийх нь миний зорилго.',
];

// Ур чадвар — level нь 0–100
export const skills = [
  {
    group: 'Frontend',
    items: [
      { name: 'React', level: 85 },
      { name: 'JavaScript', level: 85 },
      { name: 'Tailwind / CSS', level: 80 },
      { name: 'React Native', level: 65 },
    ],
  },
  {
    group: 'Backend & Өгөгдөл',
    items: [
      { name: 'Supabase', level: 80 },
      { name: 'PostgreSQL / SQL', level: 75 },
      { name: 'Node.js', level: 65 },
      { name: 'Python', level: 60 },
    ],
  },
  {
    group: 'Хэрэгсэл',
    items: [
      { name: 'Git / GitHub', level: 80 },
      { name: 'Vite', level: 80 },
      { name: 'Figma', level: 60 },
      { name: 'Vercel', level: 70 },
    ],
  },
];

// Замнал (он, үйл явдал)
export const timeline = [
  { year: '2023', text: 'UFE-д Мэдээллийн системийн мэргэжлээр элсэв' },
  { year: '2025', text: 'Expo дээр анхны гар утасны апп — WeatherApp' },
  { year: '2026', text: 'KINET спортын нийгэмлэгийн платформ (SWE334)' },
  { year: '2026', text: 'ISM Дижитал музей болон энэ Portfolio OS' },
];

// Бүтээлүүд — image нь public/projects/ доторх зураг (өөрийн screenshot-оор сольж болно)
// live: '' бол "Үзэх" товч харагдахгүй
export const projects = [
  {
    id: 'kinet',
    title: 'KINET',
    file: 'kinet.app',
    image: '/projects/kinet.svg',
    description:
      'Монголын спортын нийгэмлэгийн платформ. Гүйлт, трейл, явган аялал, дугуйн клубуудын эвент, мэдээ, гишүүнчлэлийг нэг дор цуглуулж, Instagram/Facebook дээр тарсан мэдээллийн асуудлыг шийднэ. Газрын зураг, realtime чат, Монгол/Англи хэлтэй.',
    tech: ['React 19', 'Tailwind 4', 'Supabase', 'Leaflet'],
    live: '',
    repo: 'https://github.com/jimsgene/LUMO/tree/main/store',
    year: '2026',
  },
  {
    id: 'museum',
    title: 'ISM Дижитал музей',
    file: 'ism-museum.app',
    image: '/projects/museum.svg',
    description:
      'Мэдээллийн Системийн Менежментийн Тэнхимийн оюутны бүтээл, багш нар, арга хэмжээ, түүхийн дижитал архив. Ctrl+K хурдан хайлт, TV/проектор дээр QR кодтой үзэсгэлэнгийн горим, хэвлэх шошго, статистикийн самбартай.',
    tech: ['React 19', 'React Router 7', 'Supabase', 'QR'],
    live: '',
    repo: 'https://github.com/jimsgene/LUMO/tree/main/ism-digital-museum',
    year: '2026',
  },
  {
    id: 'weather',
    title: 'WeatherApp',
    file: 'weather.app',
    image: '/projects/weather.svg',
    description:
      'Байршлаа автоматаар тодорхойлж цаг агаарын мэдээг харуулдаг гар утасны апп. Цаг агаараас хамааран өнгө нь солигддог градиент дэвсгэр, доод tab навигацтай.',
    tech: ['React Native', 'Expo', 'Expo Location'],
    live: '',
    repo: 'https://github.com/jimsgene',
    year: '2025',
  },
];
