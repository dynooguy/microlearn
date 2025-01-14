import React from 'react';

interface ProgressBarProps {
  progress: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
  const safeProgress = isNaN(progress) ? 0 : progress;
  
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm text-gray-600">
        <span>Fortschritt</span>
        <span>{Math.round(safeProgress)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${safeProgress}%`, backgroundColor: '#666666' }}
        />
      </div>
    </div>
  );
};