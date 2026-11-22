# АНАР/OS — үйлдлийн систем хэлбэрийн портфолио

> SWE334 Internet Programming · Бие даалт 2 · Ганхуяг Анар
> Live: **https://jimsgene.vercel.app**

Энгийн "scroll хийдэг" портфолиогийн оронд зочин миний **өөрийн үйлдлийн систем** рүү нэвтэрнэ.
Ширээ нь өөрөө постер маягийн танилцуулга, бусад бүх зүйл цонх, dock, ⌘K командын самбараар нээгдэнэ.

## Бүтээлч санаа

| Онцлог | Тайлбар |
|---|---|
| **Интерактив цэгэн талбар** | Canvas дээр ~2500 цэг. Хулганы ойролцоох цэгүүд түлхэгдэж улбар шар өнгөөр гэрэлтэнэ. Хоосон газар дарахад долгион тархана. 3 хэв маяг: цэг / луужингийн зүү / + тэмдэг (баруун товч → "Дэвсгэр солих") |
| **Variable font нэр** | Нэрийн үсэг бүр дээр хулгана аваачихад Unbounded фонтын жин 300 → 900 болж, хөрш үсгүүд нь бага зэрэг тодорно (`font-variation-settings` + CSS `:has()`) |
| **Ачаалах дэлгэц** | 000 → 100 тоолуур, нэр үсэг үсгээр гарч ирэх, дуусахад хөшиг дээшээ гулсана |
| **⌘K командын самбар** | Ctrl+K / ⌘K — апп нээх, горим солих, имэйл хуулах, GitHub... ↑↓ Enter-ээр удирдана. Нууц команд бий |
| **Цонхны систем** | Чирэх, давхар дарж томруулах, жижигрүүлэх, z-index-ээр урдаа гаргах |
| **Dock** | Hover хийхэд томорч, хөршүүд нь бага зэрэг томорно (macOS шиг, цэвэр CSS) |
| **Виджетүүд** | Локал цаг, "Одоо юу хийж байна", шилдэг стек |
| **Бичил харилцан үйлдэл** | Курсорын цагираг (`mix-blend-mode: difference`), төслийн картын 3D tilt + гэрлийн тусгал, 10 нүдтэй ур чадварын хэмжүүр, ширхэгт (grain) бүтэц |
| **Дуу** | Web Audio API-аар кодоор үүсгэсэн дуунууд (файл ашиглаагүй) |
| **Easter egg-үүд** | Konami код (↑↑↓↓←→←→BA) → Matrix бороо; терминалд `sudo`, `coffee`, `rm`, `matrix`; Хогийн сав |
| **Dark / Light** | Хар цаас ↔ цайвар цаас. Нэг улбар шар өнгө (#ff5b14) хоёр горимд |
| **Responsive** | ≤700px дээр цонхнууд доороос гарч ирэх "sheet" болж, dock утасны апп мөр болно |

## Дизайн систем

- **Фонт:** Unbounded (гарчиг, variable 200–900) · Onest (текст) · JetBrains Mono (шошго) — гурвуулаа Монгол кирилл (Ө, Ү) дэмждэг
- **Өнгө:** `--bg #0b0b0c`, `--fg #f1efe9`, `--accent #ff5b14` — бүгд CSS хувьсагч, `[data-theme]`-ээр солигдоно
- **Хэв маяг:** редакцийн / дизайн студийн хэв маяг — нимгэн 1px шугам, дугаарлагдсан хэсгүүд (01 —), mono шошго

## Технологи

React 18 · Vite 5 · цэвэр CSS · Canvas API · Web Audio API · SVG.
Гадны UI сан, icon сан, бэлэн загвар ашиглаагүй.

## Бүтэц

```
src/
├── data.js                ← Хувийн мэдээлэл — ЗӨВХӨН ҮҮНИЙГ ЗАСНА
├── App.jsx                ← Цонхны менежер, ⌘K командууд, товчлол
├── hooks.js               ← useIsMobile, useClock, useKonami, localStorage
├── sound.js               ← Web Audio дуу
├── components/
│   ├── Field.jsx          ← Интерактив цэгэн талбар (Canvas)
│   ├── Hero.jsx           ← Постер маягийн нэр + variable font hover
│   ├── Window.jsx         ← Чирэгддэг цонх (pointer events)
│   ├── CommandPalette.jsx ← ⌘K самбар
│   ├── Dock.jsx, TopBar.jsx, Widgets.jsx, BootScreen.jsx
│   ├── Cursor.jsx         ← Дагадаг цагираг
│   ├── MatrixRain.jsx     ← Easter egg
│   └── Icons.jsx          ← SVG icon-ууд
└── apps/                  ← About, Projects, Contact, Terminal, Trash
```

### Гол хэсгүүд хэрхэн ажилладаг вэ?

- **Цэгэн талбар (`Field.jsx`)**: Цэг бүрийн хулганаас зайг `Math.hypot`-оор олно. `k = 1 - зай/170` нь 0–1 хооронд
  нөлөөллийн хэмжээ. Цэгийг хулганаас холдох чиглэлд `k²·22px` хөдөлгөнө. `requestAnimationFrame` дотор секундэд ~60 удаа зурна.
  Хулганы байрлалыг `mouse.x += (target - mouse.x) * 0.14` (lerp)-ээр зөөлөн дагуулна.
- **Цонхны төлөв (`App.jsx`)**: `{ about: { open, minimized, maximized, z, x, y }, ... }`. Цонх дээр дарахад
  `zRef` тоолуурыг нэмж тэр цонхны `z`-д онооно → хамгийн дээр гарна.
- **Чирэх (`Window.jsx`)**: `pointerdown` дээр хулгана ба цонхны зайг тооцоолж, `pointermove` бүрт шинэ `x, y`-г state-д бичнэ.
- **⌘K (`CommandPalette.jsx`)**: `actions` массивыг бичсэн текстээр `filter` хийж, `index` state-ээр сонгосон мөрийг тэмдэглэнэ.

## Ажиллуулах

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/ хавтас үүснэ
```

## Байршуулах (Vercel)

1. GitHub-д repo үүсгэж push хийнэ.
2. [vercel.com](https://vercel.com) → **Add New Project** → repo-гоо сонгоно.
3. Framework: **Vite** (автоматаар танина) → **Deploy**.

Netlify: Build command `npm run build`, Publish directory `dist`.

## Эх сурвалж

- Фонт: [Unbounded](https://fonts.google.com/specimen/Unbounded), [Onest](https://fonts.google.com/specimen/Onest), [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) — Google Fonts (OFL лиценз)
- Санаа: SWE334 даалгаврын "Үйлдлийн систем загвар" жишээ
- Кодын зарим хэсгийг бичихэд AI туслах (Claude) ашигласан; бүх кодыг ойлгож, өөрийн болгосон.
