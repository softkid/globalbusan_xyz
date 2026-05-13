import React from 'react';
import { KPI } from '../data/roadmap';
import { motion } from 'framer-motion';
import { TrendingUp, Anchor, Cpu, Wallet } from 'lucide-react';

interface Props {
  kpis: KPI[];
}

const iconMap: Record<string, React.ElementType> = {
  '누적 예산': Wallet,
  '디지털 일자리': Cpu,
  '항만 자동화율': Anchor,
  'FDI 유치': TrendingUp,
  '항만 물동량': Anchor,
  '디지털 전환 기업': Cpu,
};

const KPIStrip: React.FC<Props> = ({ kpis }) => {
  // Show the 4 most impactful KPIs
  const highlights = kpis.filter(k =>
    ['누적 예산', '디지털 일자리', '항만 물동량', 'FDI 유치'].includes(k.label)
  );

  return (
    <div className="grid grid-cols-4 gap-3">
      {highlights.map((kpi, i) => {
        const Icon = iconMap[kpi.label] || TrendingUp;
        const targetNum = parseFloat(kpi.target.replace(/[^0-9.]/g, ''));
        const valNum = parseFloat(kpi.value.replace(/,/g, ''));
        const pct = targetNum > 0 ? Math.min((valNum / targetNum) * 100, 100) : 0;

        const colors = [
          { bg: 'from-emerald-500/20 to-emerald-500/5', ring: 'ring-emerald-500/20', text: 'text-emerald-400', bar: 'bg-emerald-400' },
          { bg: 'from-cyan-500/20 to-cyan-500/5', ring: 'ring-cyan-500/20', text: 'text-cyan-400', bar: 'bg-cyan-400' },
          { bg: 'from-blue-500/20 to-blue-500/5', ring: 'ring-blue-500/20', text: 'text-blue-400', bar: 'bg-blue-400' },
          { bg: 'from-rose-500/20 to-rose-500/5', ring: 'ring-rose-500/20', text: 'text-rose-400', bar: 'bg-rose-400' },
        ];
        const c = colors[i % 4];

        return (
          <motion.div
            key={kpi.label}
            className={`relative bg-gradient-to-br ${c.bg} border border-white/10 rounded-2xl p-4 ring-1 ${c.ring} overflow-hidden group`}
            whileHover={{ scale: 1.02, borderColor: 'rgba(255,255,255,0.2)' }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          >
            {/* Icon */}
            <div className="flex items-center justify-between mb-3">
              <div className={`w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center ${c.text}`}>
                <Icon className="w-4 h-4" />
              </div>
              <span className={`text-[10px] font-bold ${c.text} tabular-nums`}>
                {Math.round(pct)}%
              </span>
            </div>

            {/* Value */}
            <div className="flex items-baseline gap-1.5 mb-1">
              <span className="text-2xl font-black text-white tabular-nums tracking-tight">{kpi.value}</span>
              <span className={`text-xs font-bold ${c.text}`}>{kpi.unit}</span>
            </div>

            {/* Label */}
            <p className="text-[10px] text-slate-400 font-medium mb-3">{kpi.label}</p>

            {/* Progress bar */}
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${c.bar}`}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>

            {/* Target */}
            <div className="flex justify-between mt-1.5 text-[9px] text-slate-500">
              <span>목표</span>
              <span className="text-slate-400">{kpi.target}</span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default KPIStrip;
