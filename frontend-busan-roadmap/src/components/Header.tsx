import React from 'react';
import { BudgetBreakdown } from '../data/roadmap';
import { Banknote, Users, Building2, FileText } from 'lucide-react';

interface HeaderProps {
  budget?: BudgetBreakdown;
  jobs?: string;
  fdi?: string;
  onOpenReports?: () => void;
}

const Header: React.FC<HeaderProps> = ({ budget, jobs, fdi, onOpenReports }) => {
  const total = budget ? (budget.시비 + budget.국비 + budget.공공 + budget.민간).toFixed(2) : '0';

  return (
    <header className="flex justify-between items-center px-10 h-20 bg-busan-panel backdrop-blur-2xl border-b border-white/10">
      <div className="flex flex-col">
        <h1 className="text-xl font-black bg-gradient-to-r from-busan-primary to-busan-accent bg-clip-text text-transparent tracking-tighter">
          BUSAN DIGITAL HUB 2.0
        </h1>
        <p className="text-[9px] text-slate-500 font-black tracking-[0.3em] uppercase">
          해양수도 · 디지털허브 통합 정책 모니터링
        </p>
      </div>

      {/* Live KPI Summary */}
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2">
          <Banknote className="w-4 h-4 text-busan-accent" />
          <div className="flex flex-col">
            <span className="text-[8px] text-slate-500 font-bold">누적 투자</span>
            <span className="text-sm font-black text-white tabular-nums">{total}조</span>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2">
          <Users className="w-4 h-4 text-busan-primary" />
          <div className="flex flex-col">
            <span className="text-[8px] text-slate-500 font-bold">디지털 일자리</span>
            <span className="text-sm font-black text-white tabular-nums">{jobs || '0'}명</span>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2">
          <Building2 className="w-4 h-4 text-red-400" />
          <div className="flex flex-col">
            <span className="text-[8px] text-slate-500 font-bold">FDI 유치</span>
            <span className="text-sm font-black text-white tabular-nums">{fdi || '0'}조</span>
          </div>
        </div>

        <button
          onClick={onOpenReports}
          className="flex items-center gap-2 bg-busan-primary/10 hover:bg-busan-primary/20 border border-busan-primary/30 rounded-xl px-4 py-2.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <FileText className="w-4 h-4 text-busan-primary" />
          <span className="text-xs font-bold text-busan-primary">정책 보고서</span>
        </button>

        <div className="flex flex-col items-end ml-2">
          <span className="text-[10px] text-busan-primary font-bold">LIVE STATUS</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-busan-accent rounded-full animate-pulse shadow-[0_0_8px_#68ffb3]" />
            <span className="text-xs font-bold text-white">동북아 해양 중심지 도약 중</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
