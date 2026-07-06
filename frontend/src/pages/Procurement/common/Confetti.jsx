import { useMemo } from 'react';
import { COLORS } from '../../../theme'; // Mapped: Go up 3 levels to reach src/theme.js

const colors = [COLORS.yellow, COLORS.info, COLORS.success, COLORS.danger, "#6366F1"];

const createPieces = () =>
  Array.from({ length: 26 }, () => ({
    id: Math.random(),
    left: Math.random() * 100,
    delay: Math.random() * 0.25,
    rotate: Math.random() * 360,
    color: colors[Math.floor(Math.random() * colors.length)],
    drift: (Math.random() - 0.5) * 120,
  }));

export const Confetti = ({ burstKey }) => {
  const pieces = useMemo(() => {
    if (!burstKey) return [];
    return createPieces();
  }, [burstKey]);

  if (!burstKey) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[80] overflow-hidden">
      {pieces.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            top: '-5%',
            left: `${p.left}%`,
            width: '8px',
            height: '12px',
            background: p.color,
            borderRadius: '2px',
            animation: `confetti-fall 1.4s ease-in ${p.delay}s forwards`,
            '--drift': `${p.drift}px`,
            transform: `rotate(${p.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
};