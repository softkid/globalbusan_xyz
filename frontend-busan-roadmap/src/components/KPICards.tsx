import React from 'react';
import { KPI } from '../data/roadmap';
import { motion } from 'framer-motion';

interface KPICardsProps {
  kpis: KPI[];
}

const KPICards: React.FC<KPICardsProps> = ({ kpis }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {kpis.map((kpi, idx) => (
        <motion.div 
          key={idx}
          className="bg-white/5 border border-white/10 p-4 rounded-2xl flex flex-col items-center text-center relative overflow-hidden group"
          whileHover={{ borderColor: 'rgba(0, 240, 255, 0.3)', backgroundColor: 'rgba(0, 240, 255, 0.05)' }}
        >
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-busan-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <span className="text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-wider">{kpi.label}</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-white tabular-nums">{kpi.value}</span>
            <span className="text-xs text-busan-primary font-bold">{kpi.unit}</span>
          </div>
          <div className="mt-2 text-[9px] text-slate-400">
            목표: <span className="text-white">{kpi.target}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default KPICards;
