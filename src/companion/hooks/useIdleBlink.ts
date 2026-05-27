import { useEffect, useState } from 'react';

const BLINK_MS = 140;
const MIN_GAP_MS = 4000;
const MAX_GAP_MS = 6000;

function randomGap() {
  return MIN_GAP_MS + Math.random() * (MAX_GAP_MS - MIN_GAP_MS);
}

/** 約 4～6 秒隨機眨眼一次 */
export function useIdleBlink(enabled = true) {
  const [blinking, setBlinking] = useState(false);

  useEffect(() => {
    if (!enabled) return;

    let gapTimer: ReturnType<typeof setTimeout>;
    let blinkTimer: ReturnType<typeof setTimeout>;
    let cancelled = false;

    const schedule = () => {
      gapTimer = setTimeout(() => {
        if (cancelled) return;
        setBlinking(true);
        blinkTimer = setTimeout(() => {
          if (cancelled) return;
          setBlinking(false);
          schedule();
        }, BLINK_MS);
      }, randomGap());
    };

    schedule();

    return () => {
      cancelled = true;
      clearTimeout(gapTimer);
      clearTimeout(blinkTimer);
    };
  }, [enabled]);

  return blinking;
}
