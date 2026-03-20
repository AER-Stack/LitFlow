import React from 'react';
import { motion } from 'motion/react';

export const QuoteCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-[40px] p-8 shadow-sm border border-ink/5 mb-6 overflow-hidden relative">
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-ink/5 to-transparent" />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-ink/5" />
          <div className="space-y-2">
            <div className="w-32 h-4 bg-ink/5 rounded-full" />
            <div className="w-24 h-3 bg-ink/5 rounded-full" />
          </div>
        </div>
        <div className="w-8 h-8 rounded-full bg-ink/5" />
      </div>

      {/* Content */}
      <div className="space-y-4 mb-8">
        <div className="w-full h-8 bg-ink/5 rounded-full" />
        <div className="w-5/6 h-8 bg-ink/5 rounded-full" />
        <div className="w-4/6 h-8 bg-ink/5 rounded-full" />
      </div>

      {/* Book Chip */}
      <div className="w-48 h-12 bg-ink/5 rounded-2xl mb-8" />

      {/* Footer */}
      <div className="flex items-center justify-between pt-6 border-t border-ink/5">
        <div className="flex space-x-6">
          <div className="w-16 h-6 bg-ink/5 rounded-full" />
          <div className="w-16 h-6 bg-ink/5 rounded-full" />
        </div>
        <div className="flex space-x-4">
          <div className="w-6 h-6 bg-ink/5 rounded-full" />
          <div className="w-6 h-6 bg-ink/5 rounded-full" />
        </div>
      </div>
    </div>
  );
};
