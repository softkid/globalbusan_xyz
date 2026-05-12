import React from 'react';
import { RiskFactor } from '../data/roadmap';
import { AlertTriangle } from 'lucide-react';

interface RiskMonitorProps {
  risks: RiskFactor[];
}

const RiskMonitor: React.FC<RiskMonitorProps> = ({ risks }) => {
  return (
    <div className="flex flex-col gap-3">
      {risks.length === 0 ? (
        <div className="text-center py-4 text-slate-500 text-xs italic">
          현재 단계의 주요 위험 요소가 없습니다.
        </div>
      ) : (
        risks.map((r, idx) => (
          <div key={idx} className={`p-4 rounded-xl border ${
            r.level === 'high' ? 'bg-red-500/5 border-red-500/20' : 
            r.level === 'medium' ? 'bg-orange-500/5 border-orange-500/20' : 
            'bg-blue-500/5 border-blue-500/20'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className={`w-4 h-4 ${
                r.level === 'high' ? 'text-red-400' : 
                r.level === 'medium' ? 'text-orange-400' : 
                'text-blue-400'
              }`} />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {r.category} RISK
              </span>
            </div>
            <h5 className="text-sm font-bold text-slate-200 mb-1">{r.factor}</h5>
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong className="text-busan-accent">대응:</strong> {r.mitigation}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default RiskMonitor;
