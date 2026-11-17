import { useEffect } from 'react';

export function useTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · ISM Дижитал музей` : 'ISM Дижитал музей';
  }, [title]);
}
