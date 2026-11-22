import { useEffect, useRef } from 'react';

// ============================================================
//  Интерактив дэвсгэр (Canvas).
//  Дэлгэцийг цэгэн сүлжээгээр дүүргэж, хулганы ойролцоох цэгүүдийг
//  түлхэж, улбар шар өнгөөр гэрэлтүүлнэ. Дарахад долгион тархана.
//  mode: 'dots' | 'needles' (луужингийн зүү) | 'crosses' (+ тэмдэг)
// ============================================================

export const FIELD_MODES = ['dots', 'needles', 'crosses'];

const GAP = 30;      // цэг хоорондын зай (px)
const RADIUS = 170;  // хулганы нөлөөллийн радиус
const ACCENT = '#ff5b14';

export default function Field({ mode, theme }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const base = theme === 'dark' ? 'rgba(241,239,233,0.2)' : 'rgba(17,17,16,0.24)';

    let w = 0;
    let h = 0;
    let points = [];
    const mouse = { x: -9999, y: -9999, tx: -9999, ty: -9999 };
    const ripples = [];

    // Дэлгэцийн хэмжээгээр цэгүүдийг байрлуулна
    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      points = [];
      for (let y = GAP / 2; y < h; y += GAP) {
        for (let x = GAP / 2; x < w; x += GAP) points.push({ x, y });
      }
    };

    const onMove = (e) => {
      mouse.tx = e.clientX;
      mouse.ty = e.clientY;
    };
    const onLeave = () => {
      mouse.tx = mouse.ty = -9999;
    };
    const onDown = (e) => {
      // Зөвхөн хоосон ширээн дээр дарахад долгион үүснэ
      if (e.target.closest('.window, .dock, .topbar, .palette, .widgets, button, a, input')) return;
      ripples.push({ x: e.clientX, y: e.clientY, r: 0 });
    };

    let raf;
    const draw = (t) => {
      // Хулганыг зөөлөн дагуулах (lerp)
      if (mouse.tx < -1000 || mouse.x < -1000) {
        mouse.x = mouse.tx;
        mouse.y = mouse.ty;
      } else {
        mouse.x += (mouse.tx - mouse.x) * 0.14;
        mouse.y += (mouse.ty - mouse.y) * 0.14;
      }

      for (let i = ripples.length - 1; i >= 0; i--) {
        ripples[i].r += 7;
        if (ripples[i].r > Math.max(w, h) * 1.2) ripples.splice(i, 1);
      }

      ctx.clearRect(0, 0, w, h);

      for (const p of points) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const d = Math.hypot(dx, dy) || 1;
        let k = Math.max(0, 1 - d / RADIUS); // 0..1 — хулганаас хэр ойр
        let ox = (dx / d) * k * k * 22;
        let oy = (dy / d) * k * k * 22;

        // Долгионы цагираг цэгүүдийг гадагш түлхэнэ
        for (const r of ripples) {
          const rx = p.x - r.x;
          const ry = p.y - r.y;
          const rd = Math.hypot(rx, ry) || 1;
          const band = 1 - Math.abs(rd - r.r) / 50;
          if (band > 0) {
            const fade = Math.max(0, 1 - r.r / (Math.max(w, h) * 1.2));
            ox += (rx / rd) * band * 10 * fade;
            oy += (ry / rd) * band * 10 * fade;
            k = Math.max(k, band * fade * 0.9);
          }
        }

        // Тайван "амьсгалах" хөдөлгөөн
        const wave = Math.sin(p.x * 0.012 + t * 0.0007) * Math.cos(p.y * 0.014 + t * 0.0005);
        const x = p.x + ox;
        const y = p.y + oy;
        const hot = k > 0.12;

        ctx.globalAlpha = hot ? 0.35 + k * 0.65 : 1;
        ctx.fillStyle = ctx.strokeStyle = hot ? ACCENT : base;

        if (mode === 'needles') {
          const angle = mouse.x > -1000 ? Math.atan2(-dy, -dx) : wave * Math.PI;
          const len = 5 + k * 9;
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(x - Math.cos(angle) * len, y - Math.sin(angle) * len);
          ctx.lineTo(x + Math.cos(angle) * len, y + Math.sin(angle) * len);
          ctx.stroke();
        } else if (mode === 'crosses') {
          const s = 2.5 + k * 5;
          const a = k * Math.PI * 0.5;
          ctx.lineWidth = 1.2;
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(a);
          ctx.beginPath();
          ctx.moveTo(-s, 0);
          ctx.lineTo(s, 0);
          ctx.moveTo(0, -s);
          ctx.lineTo(0, s);
          ctx.stroke();
          ctx.restore();
        } else {
          const size = 1.1 + k * 2.6 + wave * 0.35;
          ctx.beginPath();
          ctx.arc(x, y, Math.max(0.4, size), 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };

    build();
    raf = requestAnimationFrame(draw);
    window.addEventListener('resize', build);
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerdown', onDown);
    document.addEventListener('pointerleave', onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', build);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      document.removeEventListener('pointerleave', onLeave);
    };
  }, [mode, theme]);

  return <canvas ref={canvasRef} className="field" aria-hidden="true" />;
}
