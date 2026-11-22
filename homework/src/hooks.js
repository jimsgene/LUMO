import { useEffect, useRef, useState } from 'react';

// Дэлгэц жижиг (гар утас) эсэхийг шалгана
export function useIsMobile(maxWidth = 700) {
  const query = `(max-width: ${maxWidth}px)`;
  const [isMobile, setIsMobile] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setIsMobile(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);
  return isMobile;
}

// Цаг — секунд тутам шинэчлэгдэнэ
export function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

// Konami код: ↑ ↑ ↓ ↓ ← → ← → B A  (easter egg)
const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

export function useKonami(callback) {
  const progress = useRef(0);
  const cb = useRef(callback);
  cb.current = callback;

  useEffect(() => {
    const onKey = (e) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (key === KONAMI[progress.current]) {
        progress.current += 1;
        if (progress.current === KONAMI.length) {
          progress.current = 0;
          cb.current();
        }
      } else {
        progress.current = key === KONAMI[0] ? 1 : 0;
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
}

// localStorage-ийг алдаагүй унших/бичих
export function loadPref(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    return v === null ? fallback : JSON.parse(v);
  } catch {
    return fallback;
  }
}

export function savePref(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode гэх мэт үед хадгалахгүй */
  }
}
