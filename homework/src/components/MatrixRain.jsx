import { useEffect, useRef } from 'react';
import { owner } from '../data';

// Easter egg: Canvas дээр кирилл үсгүүд бороо шиг унана
export default function MatrixRain({ onDone }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const chars = ('АБВГДЕЁЖЗИЙКЛМНОӨПРСТУҮФХЦЧШЭЮЯ01' + owner.firstName).split('');
    const size = 18;
    let drops = Array(Math.ceil(canvas.width / size)).fill(0).map(() => Math.random() * -50);

    const draw = () => {
      ctx.fillStyle = 'rgba(11, 11, 12, 0.14)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${size}px "JetBrains Mono", monospace`;
      drops.forEach((y, i) => {
        ctx.fillStyle = Math.random() > 0.97 ? '#ffffff' : '#ff5b14';
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], i * size, y * size);
        drops[i] = y * size > canvas.height && Math.random() > 0.975 ? 0 : y + 1;
      });
    };
    const id = setInterval(draw, 50);
    const end = setTimeout(onDone, 7000);
    return () => {
      clearInterval(id);
      clearTimeout(end);
      window.removeEventListener('resize', resize);
    };
  }, [onDone]);

  return (
    <div className="matrix" onClick={onDone}>
      <canvas ref={canvasRef} />
      <div className="matrix-msg">
        Чи нууцыг олчихлоо 🕶️
        <small>Дарж гарна уу</small>
      </div>
    </div>
  );
}
