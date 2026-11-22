// Web Audio API ашиглан жижиг дуу (micro-interaction) гаргана.
// Гаднаас дууны файл татахгүй — бүх дуу кодоор үүсдэг.

let ctx = null;
let enabled = true;

export function setSoundEnabled(value) {
  enabled = value;
}

// Нэг богино "бийп" тоглуулна
function beep(freq, endFreq, duration = 0.12, delay = 0, volume = 0.05) {
  if (!enabled) return;
  try {
    ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
    const t = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, t);
    osc.frequency.exponentialRampToValueAtTime(endFreq, t + duration);
    gain.gain.setValueAtTime(volume, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start(t);
    osc.stop(t + duration + 0.02);
  } catch {
    // Хөтөч дуу дэмжихгүй бол чимээгүй өнгөрнө
  }
}

export function playSound(type) {
  switch (type) {
    case 'open':
      return beep(520, 880, 0.1);
    case 'close':
      return beep(700, 380, 0.1);
    case 'error':
      return beep(220, 160, 0.2, 0, 0.07);
    case 'boot': // жижиг аялгуу
      [523, 659, 784, 1047].forEach((f, i) => beep(f, f, 0.18, i * 0.12, 0.04));
      return;
    default:
      return beep(900, 900, 0.04, 0, 0.03);
  }
}
