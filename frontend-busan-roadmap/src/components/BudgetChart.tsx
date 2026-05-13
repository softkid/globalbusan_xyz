import React from 'react';
import { BudgetBreakdown } from '../data/roadmap';

interface Props {
  budget: BudgetBreakdown;
}

const segments = [
  { key: '시비', color: '#00f0ff', label: '시비 (마중물)' },
  { key: '국비', color: '#1d7eff', label: '국비·공모' },
  { key: '공공', color: '#68ffb3', label: '공사·출연기관' },
  { key: '민간', color: '#ff6b6b', label: '민간·FDI' },
] as const;

const BudgetChart: React.FC<Props> = ({ budget }) => {
  const total = budget.시비 + budget.국비 + budget.공공 + budget.민간;

  return (
    <div className="flex flex-col gap-3">
      {/* Horizontal stacked bar */}
      <div className="flex items-center gap-1 text-[10px]">
        <span className="text-slate-500 font-bold w-12">누적</span>
        <div className="flex-1 h-5 flex rounded-full overflow-hidden bg-white/5">
          {segments.map(seg => {
            const val = budget[seg.key as keyof BudgetBreakdown];
            const pct = total > 0 ? (val / total) * 100 : 0;
            if (pct < 1) return null;
            return (
              <div
                key={seg.key}
                className="h-full transition-all duration-700"
                style={{ width: `${pct}%`, backgroundColor: seg.color }}
                title={`${seg.label}: ${val.toFixed(2)}조`}
              />
            );
          })}
        </div>
        <span className="text-white font-black w-14 text-right">{total.toFixed(2)}조</span>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
        {segments.map(seg => {
          const val = budget[seg.key as keyof BudgetBreakdown];
          const pct = total > 0 ? ((val / total) * 100).toFixed(0) : '0';
          return (
            <div key={seg.key} className="flex items-center gap-2 text-[9px]">
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: seg.color }} />
              <span className="text-slate-400 flex-1">{seg.label}</span>
              <span className="text-white font-bold tabular-nums">{val.toFixed(2)}조</span>
              <span className="text-slate-500">({pct}%)</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetChart;
