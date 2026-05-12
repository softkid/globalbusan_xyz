import React from 'react';
import { RoadmapPhase } from '../data/roadmap';

interface TimelineProps {
  currentValue: number;
  onChange: (val: number) => void;
  phases: RoadmapPhase[];
}

const Timeline: React.FC<TimelineProps> = ({ currentValue, onChange, phases }) => {
  return (
    <div className="flex flex-col items-center w-full max-w-2xl px-4">
      <div className="w-full relative h-12 flex items-center">
        <input
          type="range"
          min="0"
          max="48"
          value={currentValue}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-busan-primary hover:accent-busan-accent transition-all"
        />
        
        {/* Timeline Markers */}
        <div className="absolute top-8 w-full flex justify-between text-[10px] text-slate-500 font-medium px-1">
          <span className={currentValue < 12 ? 'text-busan-primary' : ''}>26.06 (시작)</span>
          <span className={currentValue >= 12 && currentValue < 24 ? 'text-busan-primary' : ''}>27.06</span>
          <span className={currentValue >= 24 && currentValue < 36 ? 'text-busan-primary' : ''}>28.06</span>
          <span className={currentValue >= 36 && currentValue < 48 ? 'text-busan-primary' : ''}>29.06</span>
          <span className={currentValue === 48 ? 'text-busan-primary' : ''}>30.06 (완성)</span>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
