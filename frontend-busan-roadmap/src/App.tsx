import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import Map from './components/Map';
import Timeline from './components/Timeline';
import KPICards from './components/KPICards';
import ProjectList from './components/ProjectList';
import RiskMonitor from './components/RiskMonitor';
import { roadmapPhases } from './data/roadmap';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause } from 'lucide-react';

const App: React.FC = () => {
  const [sliderValue, setSliderValue] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Auto-play logic
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setSliderValue((prev) => {
          if (prev >= 48) {
            setIsPlaying(false);
            return 48;
          }
          return prev + 1;
        });
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Find current and next phase for interpolation
  const currentPhase = useMemo(() => {
    return [...roadmapPhases].reverse().find(p => p.id <= sliderValue) || roadmapPhases[0];
  }, [sliderValue]);

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
      
      <main className="flex-1 grid grid-cols-[380px_1fr_380px] gap-6 p-6 overflow-hidden bg-transparent">
        
        {/* Left Panel: Policy & KPI */}
        <aside className="glass-panel p-8 flex flex-col gap-6 overflow-y-auto">
          <div className="flex flex-col">
            <h2 className="text-xl font-black text-white mb-2">정책 실행 및 성과</h2>
            <div className="h-1 w-12 bg-busan-primary rounded-full" />
          </div>

          <KPICards kpis={currentPhase.kpis} />

          <div className="mt-4 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-busan-primary uppercase tracking-widest">중점 추진 사업</h3>
            <ProjectList projects={currentPhase.projects} />
          </div>
        </aside>

        {/* Center: Interactive Map & Timeline */}
        <section className="relative flex flex-col gap-6 overflow-hidden">
          {/* Map Container */}
          <div className="flex-1 glass-panel relative overflow-hidden border-busan-primary/20 shadow-[inset_0_0_50px_rgba(0,240,255,0.1)]">
            <Map progress={currentPhase.districtProgress} />
            
            {/* Global Progress Overlay */}
            <div className="absolute bottom-6 left-6 right-6 flex flex-col gap-2 bg-busan-dark/60 backdrop-blur-md p-4 rounded-2xl border border-white/5">
               <div className="flex justify-between items-center px-1">
                 <span className="text-xs font-bold text-slate-400">전체 디지털 생태계 전환율</span>
                 <span className="text-lg font-black text-busan-primary">
                    {Math.round(Object.values(currentPhase.districtProgress).reduce((a, b) => a + b, 0) / 16)}%
                 </span>
               </div>
               <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                 <motion.div 
                    className="h-full bg-gradient-to-r from-busan-secondary to-busan-primary shadow-[0_0_15px_rgba(0,240,255,0.5)]"
                    initial={false}
                    animate={{ width: `${Object.values(currentPhase.districtProgress).reduce((a, b) => a + b, 0) / 16}%` }}
                 />
               </div>
            </div>
          </div>

          {/* Timeline Control Bar */}
          <div className="h-28 glass-panel flex items-center justify-between px-10 gap-8">
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-14 h-14 rounded-full bg-busan-primary text-busan-dark flex items-center justify-center hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,240,255,0.4)]"
            >
              {isPlaying ? <Pause fill="currentColor" /> : <Play fill="currentColor" className="ml-1" />}
            </button>
            
            <Timeline 
              currentValue={sliderValue} 
              onChange={setSliderValue} 
              phases={roadmapPhases} 
            />
            
            <div className="text-right flex flex-col min-w-[120px]">
              <span className="text-[10px] text-slate-500 font-black">CURRENT PERIOD</span>
              <span className="text-xl font-black text-busan-primary tabular-nums">
                {currentPhase.period.split(' ')[0]}
              </span>
            </div>
          </div>
        </section>

        {/* Right Panel: Risk & Stance */}
        <aside className="glass-panel p-8 flex flex-col gap-6 overflow-y-auto">
          <div className="flex flex-col">
            <h2 className="text-xl font-black text-white mb-2">리스크 및 환경 요인</h2>
            <div className="h-1 w-12 bg-red-500 rounded-full" />
          </div>

          <div className="bg-gradient-to-br from-busan-secondary/20 to-busan-primary/5 border-l-4 border-busan-primary p-5 rounded-r-xl">
            <h4 className="text-xs font-black text-busan-primary mb-2 uppercase tracking-widest">정부 기조 및 정책 환경</h4>
            <p className="text-sm text-slate-200 leading-relaxed italic">
              "{currentPhase.govStance}"
            </p>
          </div>

          <div className="mt-4 flex flex-col gap-4">
            <h3 className="text-sm font-bold text-red-400 uppercase tracking-widest">주요 위험 요인 및 완화 전략</h3>
            <RiskMonitor risks={currentPhase.risks} />
          </div>

          <div className="mt-auto pt-6 border-t border-white/5">
             <p className="text-[10px] text-slate-500 text-center leading-relaxed">
               본 데이터는 해양수도 및 디지털허브 2.0 보고서를 기반으로 산출된 예측치이며, 실제 시정 진행 상황에 따라 기록될 예정입니다.
             </p>
          </div>
        </aside>

      </main>
    </div>
  );
};

export default App;
