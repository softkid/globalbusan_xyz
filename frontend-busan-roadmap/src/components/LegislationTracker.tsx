import React from 'react';
import { Legislation } from '../data/roadmap';
import { CheckCircle2, Clock, FileEdit } from 'lucide-react';

interface Props {
  legislation: Legislation[];
}

const statusConfig = {
  passed: { icon: CheckCircle2, color: '#68ffb3', label: '통과' },
  pending: { icon: Clock, color: '#ffb347', label: '심의중' },
  drafting: { icon: FileEdit, color: '#888', label: '초안' },
};

const LegislationTracker: React.FC<Props> = ({ legislation }) => {
  return (
    <div className="flex flex-col gap-2">
      {legislation.map((law, i) => {
        const cfg = statusConfig[law.status];
        const Icon = cfg.icon;
        return (
          <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 hover:border-white/20 transition-all">
            <Icon className="w-4 h-4 flex-shrink-0" style={{ color: cfg.color }} />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-200 truncate">{law.name}</p>
              {law.date && <p className="text-[9px] text-slate-500">{law.date}</p>}
            </div>
            <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${cfg.color}15`, color: cfg.color }}>
              {cfg.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

export default LegislationTracker;
