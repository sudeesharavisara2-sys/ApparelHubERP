// src/hooks/useCountUp.js
import { useEffect, useState } from 'react';

export function useCountUp(target, duration = 900) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    let start = null;
    let raf;

    const step = (t) => {
      if (!start) start = t;
      const p = Math.min((t - start) / duration, 1);
      setVal(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return val;
}