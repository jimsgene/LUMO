import { useEffect, useState } from 'react';
import QRCode from 'qrcode';

// Renders a QR code for `value` as an <img>. Generated locally, nothing is sent to a QR service.
export default function QR({ value, size = 160, label, dark = '#0b0a3a', light = '#ffffff', className = 'qr' }) {
  const [made, setMade] = useState({ value: null, src: null });

  useEffect(() => {
    let alive = true;
    QRCode.toDataURL(value, { margin: 1, width: size * 2, errorCorrectionLevel: 'M', color: { dark, light } })
      .then((src) => alive && setMade({ value, src }))
      .catch(() => {});
    return () => { alive = false; };
  }, [value, size, dark, light]);

  const src = made.value === value ? made.src : null;
  return src
    ? <img className={className} src={src} width={size} height={size} alt={label || `QR код: ${value}`} />
    : <span className={className} style={{ width: size, height: size, display: 'inline-block' }} aria-hidden="true" />;
}

