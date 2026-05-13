import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Map from './components/Map';
import Timeline from './components/Timeline';
import KPIStrip from './components/KPIStrip';
import KPICards from './components/KPICards';
import ProjectList from './components/ProjectList';
import RiskMonitor from './components/RiskMonitor';
import LegislationTracker from './components/LegislationTracker';
import BudgetChart from './components/BudgetChart';
import ReportViewer from './components/ReportViewer';
import { roadmapPhases, BudgetBreakdown } from './data/roadmap';
import { motion } from 'framer-motion';
import { Play, Pause, Gavel, BarChart3, ShieldAlert, MessageSquareText, ListChecks } from 'lucide-react';

const App: React.FC = () => {
  const [sliderValue, setSliderValue] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setSliderValue((prev) => {
          if (prev >= 48) { setIsPlaying(false); return 48; }
          return prev + 3;
        });
      }, 800);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const interpolatedPhase = useMemo(() => {
    const currentPhaseIndex = [...roadmapPhases].reverse().findIndex(p => p.id <= sliderValue);
    const actualIndex = currentPhaseIndex >= 0 ? roadmapPhases.length - 1 - currentPhaseIndex : 0;
    const basePhase = roadmapPhases[actualIndex];
    const nextPhase = roadmapPhases[actualIndex + 1] || basePhase;
    const progress = nextPhase.id === basePhase.id ? 0 : (sliderValue - basePhase.id) / (nextPhase.id - basePhase.id);
    if (progress === 0) return basePhase;

    const interpolatedKpis = basePhase.kpis.map((kpi, i) => {
      const baseVal = parseFloat(kpi.value.replace(/,/g, ''));
      const nextVal = parseFloat(nextPhase.kpis[i].value.replace(/,/g, ''));
      const val = baseVal + (nextVal - baseVal) * progress;
      let formattedVal = '';
      if (kpi.unit === '조') formattedVal = val.toFixed(2);
      else if (kpi.unit === '%') formattedVal = Math.round(val).toString();
      else formattedVal = Math.round(val).toLocaleString();
      return { ...kpi, value: formattedVal };
    });

    const interpolatedDistricts: Record<string, number> = {};
    for (const key in basePhase.districtProgress) {
      interpolatedDistricts[key] = Math.round(basePhase.districtProgress[key] + (nextPhase.districtProgress[key] - basePhase.districtProgress[key]) * progress);
    }

    const interpolatedBudget: BudgetBreakdown = {
      시비: basePhase.budget.시비 + (nextPhase.budget.시비 - basePhase.budget.시비) * progress,
      국비: basePhase.budget.국비 + (nextPhase.budget.국비 - basePhase.budget.국비) * progress,
      공공: basePhase.budget.공공 + (nextPhase.budget.공공 - basePhase.budget.공공) * progress,
      민간: basePhase.budget.민간 + (nextPhase.budget.민간 - basePhase.budget.민간) * progress,
    };

    return { ...basePhase, kpis: interpolatedKpis, districtProgress: interpolatedDistricts, budget: interpolatedBudget };
  }, [sliderValue]);

  const currentPeriodText = useMemo(() => {
    const qi = 2 + Math.floor(sliderValue / 3);
    return `${2026 + Math.floor(qi / 4)}년 ${(qi % 4) + 1}분기`;
  }, [sliderValue]);

  const headerJobs = interpolatedPhase.kpis.find(k => k.label === '디지털 일자리')?.value || '0';
  const headerFdi = interpolatedPhase.kpis.find(k => k.label === 'FDI 유치')?.value || '0';
  const overallPct = Math.round(Object.values(interpolatedPhase.districtProgress).reduce((a, b) => a + b, 0) / 16);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header budget={interpolatedPhase.budget} jobs={headerJobs} fdi={headerFdi} onOpenReports={() => setIsReportOpen(true)} />

      <main className="flex-1 flex flex-col gap-3 p-4 overflow-hidden">

        {/* ── ROW 1: Hero KPI Strip ── */}
        <KPIStrip kpis={interpolatedPhase.kpis} />

        {/* ── ROW 2: Timeline Control ── */}
        <div className="glass-panel flex items-center justify-between px-6 py-3 gap-6">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="w-10 h-10 rounded-full bg-busan-primary text-busan-dark flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,240,255,0.4)] flex-shrink-0"
          >
            {isPlaying ? <Pause fill="currentColor" size={16} /> : <Play fill="currentColor" className="ml-0.5" size={16} />}
          </button>

          <Timeline currentValue={sliderValue} onChange={setSliderValue} phases={roadmapPhases} />

          <div className="flex items-center gap-4 flex-shrink-0">
            <div className="text-right flex flex-col">
              <span className="text-[8px] text-slate-500 font-black uppercase">Period</span>
              <span className="text-sm font-black text-busan-primary tabular-nums tracking-tighter">{currentPeriodText}</span>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-right flex flex-col">
              <span className="text-[8px] text-slate-500 font-black uppercase">Stage</span>
              <span className="text-sm font-black text-busan-accent tracking-tighter">{interpolatedPhase.stage}</span>
            </div>
          </div>
        </div>

        {/* ── ROW 3: Main Content (Map + Panels) ── */}
        <div className="flex-1 grid grid-cols-[320px_1fr_320px] gap-3 overflow-hidden min-h-0">

          {/* Left: Projects + Detailed KPIs */}
          <aside className="glass-panel p-5 flex flex-col gap-4 overflow-y-auto">
            <div className="flex items-center gap-2">
              <ListChecks className="w-4 h-4 text-busan-primary" />
              <h2 className="text-sm font-black text-white">추진 사업</h2>
            </div>
            <ProjectList projects={interpolatedPhase.projects} />

            <div className="border-t border-white/5 pt-4">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">상세 KPI</h3>
              <KPICards kpis={interpolatedPhase.kpis} />
            </div>
          </aside>

          {/* Center: Map */}
          <section className="glass-panel relative overflow-hidden border-busan-primary/20 shadow-[inset_0_0_50px_rgba(0,240,255,0.1)]">
            <Map progress={interpolatedPhase.districtProgress} />

            {/* Overlay: Overall progress */}
            <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-1.5 bg-busan-dark/70 backdrop-blur-md p-3 rounded-2xl border border-white/5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-slate-400">전체 디지털 전환율</span>
                <span className="text-base font-black text-busan-primary tabular-nums">{overallPct}%</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-busan-secondary to-busan-primary shadow-[0_0_15px_rgba(0,240,255,0.5)]"
                  initial={false}
                  animate={{ width: `${overallPct}%` }}
                />
              </div>
            </div>

            {/* Gov stance tooltip */}
            <div className="absolute top-4 left-4 right-4 bg-busan-dark/70 backdrop-blur-md border border-busan-primary/20 p-3 rounded-xl z-10">
              <div className="flex items-start gap-2">
                <MessageSquareText className="w-3.5 h-3.5 text-busan-primary mt-0.5 flex-shrink-0" />
                <p className="text-[11px] text-slate-300 leading-relaxed line-clamp-2 italic">
                  "{interpolatedPhase.govStance}"
                </p>
              </div>
            </div>
          </section>

          {/* Right: Budget + Legislation + Risk */}
          <aside className="glass-panel p-5 flex flex-col gap-4 overflow-y-auto">
            {/* Budget */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-busan-accent" />
                <h3 className="text-sm font-black text-white">예산 구조</h3>
              </div>
              <BudgetChart budget={interpolatedPhase.budget} />
            </div>

            <div className="border-t border-white/5 pt-4 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <Gavel className="w-4 h-4 text-yellow-400" />
                <h3 className="text-sm font-black text-white">입법 동향</h3>
              </div>
              <LegislationTracker legislation={interpolatedPhase.legislation} />
            </div>

            <div className="border-t border-white/5 pt-4 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-red-400" />
                <h3 className="text-sm font-black text-white">위험 요인</h3>
              </div>
              <RiskMonitor risks={interpolatedPhase.risks} />
            </div>

            <div className="mt-auto pt-3 border-t border-white/5">
              <p className="text-[8px] text-slate-500 text-center leading-relaxed">
                해양수도 4개년 로드맵 · 디지털허브 2.0 보고서 기반 예측치
              </p>
            </div>
          </aside>
        </div>
      </main>

      <ReportViewer isOpen={isReportOpen} onClose={() => setIsReportOpen(false)} />
    </div>
  );
};

export default App;
