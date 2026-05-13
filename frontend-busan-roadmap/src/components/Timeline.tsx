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
          step="3"
          value={currentValue}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-busan-primary hover:accent-busan-accent transition-all"
        />

        {/* Phase milestone dots on track */}
        {phases.map(phase => {
          const pct = (phase.id / 48) * 100;
          const isActive = currentValue >= phase.id;
          return (
            <div
              key={phase.id}
              className="absolute top-1/2 -translate-y-1/2 pointer-events-none"
              style={{ left: `${pct}%` }}
            >
              <div className={`w-2.5 h-2.5 rounded-full border-2 transition-all ${
                isActive
                  ? 'bg-busan-primary border-busan-primary shadow-[0_0_6px_rgba(0,240,255,0.6)]'
                  : 'bg-busan-dark border-slate-600'
              }`} />
            </div>
          );
        })}
        
        {/* Timeline Labels */}
        <div className="absolute top-9 w-full flex justify-between text-[9px] text-slate-500 font-medium px-0">
          {phases.map(phase => {
            const pct = (phase.id / 48) * 100;
            const isActive = currentValue >= phase.id && (phases.find(p => p.id > phase.id)?.id ?? 49) > currentValue;
            return (
              <div
                key={phase.id}
                className="absolute flex flex-col items-center -translate-x-1/2"
                style={{ left: `${pct}%` }}
              >
                <span className={`whitespace-nowrap ${isActive ? 'text-busan-primary font-bold' : ''}`}>
                  {phase.period.replace('년', "'").replace(' ', '')}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
