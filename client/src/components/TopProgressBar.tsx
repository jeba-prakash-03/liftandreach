import React from 'react';
import { useAppStore } from '../store/useAppStore';

export const TopProgressBar: React.FC = () => {
  const isNavigating = useAppStore((state) => state.isNavigating);

  if (!isNavigating) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 h-[2px] z-[9999] pointer-events-none overflow-hidden bg-transparent"
      role="progressbar"
      aria-label="Loading page"
    >
      <div
        className="h-full bg-[#1F4E96] transition-all duration-300 animate-pulse w-full"
        style={{
          boxShadow: '0 0 8px #1F4E96'
        }}
      />
    </div>
  );
};
