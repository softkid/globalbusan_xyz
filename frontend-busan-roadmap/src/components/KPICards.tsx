import React, { useState } from 'react';
import { KPI } from '../data/roadmap';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu, Anchor, Wallet, TrendingUp } from 'lucide-react';

interface KPICardsProps {
  kpis: KPI[];
}

const tabs = [
  { key: 'digital', label: '디지털', icon: Cpu, color: '#00f0ff' },
  { key: 'maritime', label: '해양', icon: Anchor, color: '#1d7eff' },
  { key: 'budget', label: '예산', icon: Wallet, color: '#68ffb3' },
  { key: 'invest', label: '투자', icon: TrendingUp, color: '#ff6b6b' },
] as const;

const KPICards: React.FC<KPICardsProps> = ({ kpis }) => {
  const [activeTab, setActiveTab] = useState<string>('digital');
  const filtered = kpis.filter(k => k.category === activeTab);
  const activeColor = tabs.find(t => t.key === activeTab)?.color || '#00f0ff';

  return (
    <div className="flex flex-col gap-3">
      {/* Tab Bar */}
      <div className="flex gap-1 bg-white/5 rounded-xl p-1">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                isActive
                  ? 'bg-white/10 text-white shadow-lg'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
              style={isActive ? { color: tab.color } : {}}
            >
              <Icon className="w-3 h-3" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* KPI Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-2 gap-3"
        >
          {filtered.map((kpi, idx) => {
            const targetNum = parseFloat(kpi.target.replace(/[^0-9.]/g, ''));
            const valNum = parseFloat(kpi.value.replace(/,/g, ''));
            const pct = targetNum > 0 ? Math.min((valNum / targetNum) * 100, 100) : 0;

            return (
              <motion.div
                key={idx}
                className="bg-white/5 border border-white/10 p-3 rounded-xl flex flex-col relative overflow-hidden group"
                whileHover={{ borderColor: `${activeColor}40`, backgroundColor: `${activeColor}08` }}
              >
                <div
                  className="absolute top-0 left-0 w-full h-[1px] opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ background: `linear-gradient(to right, transparent, ${activeColor}80, transparent)` }}
                />
                <span className="text-[9px] text-slate-500 font-bold mb-1 uppercase tracking-wider">{kpi.label}</span>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl font-black text-white tabular-nums">{kpi.value}</span>
                  <span className="text-[10px] font-bold" style={{ color: activeColor }}>{kpi.unit}</span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: activeColor }}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                  />
                </div>
                <div className="mt-1 text-[8px] text-slate-500 flex justify-between">
                  <span>목표</span>
                  <span className="text-white">{kpi.target}</span>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default KPICards;
