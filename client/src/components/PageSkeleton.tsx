import React from 'react';

export const PageSkeleton: React.FC = () => {
  return (
    <div className="w-full bg-[#F6F4F0] min-h-[70vh] p-8 space-y-8 animate-pulse">
      <div className="max-w-[1360px] mx-auto space-y-6">
        <div className="h-6 w-48 bg-[#E8E4DD] rounded-none animate-shimmer" />
        <div className="h-12 w-2/3 max-w-xl bg-[#E8E4DD] rounded-none animate-shimmer" />
        <div className="h-4 w-full max-w-2xl bg-[#E8E4DD] rounded-none animate-shimmer" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
          <div className="h-64 bg-[#E8E4DD] rounded-none animate-shimmer" />
          <div className="h-64 bg-[#E8E4DD] rounded-none animate-shimmer" />
          <div className="h-64 bg-[#E8E4DD] rounded-none animate-shimmer" />
        </div>
      </div>
    </div>
  );
};
