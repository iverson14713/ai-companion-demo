import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
  glow?: boolean;
};

export function GlassCard({ children, className = '', glow = false }: Props) {
  return (
    <div
      className={`companion-glass rounded-3xl ${glow ? 'companion-glass-glow' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
