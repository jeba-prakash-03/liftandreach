// Motion tokens and helpers
export const MOTION_TOKENS = {
  durFast: 0.15, // 150ms
  durBase: 0.25, // 250ms
  durSlow: 0.45, // 450ms
  maxDuration: 0.6, // 600ms
  easeOut: [0.22, 1, 0.36, 1] as const,
  easeInOut: [0.65, 0, 0.35, 1] as const
};

export const isReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};
