import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="flex justify-between items-center px-10 h-24 bg-busan-panel backdrop-blur-2xl border-b border-white/10">
      <div className="flex flex-col">
        <h1 className="text-2xl font-black bg-gradient-to-r from-busan-primary to-busan-accent bg-clip-text text-transparent tracking-tighter">
          BUSAN DIGITAL HUB 2.0
        </h1>
        <p className="text-[10px] text-slate-500 font-black tracking-[0.3em] uppercase">
          Maritime Capital Time Machine
        </p>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="flex flex-col items-end">
          <span className="text-[10px] text-busan-primary font-bold">LIVE STATUS</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-busan-accent rounded-full animate-pulse shadow-[0_0_8px_#68ffb3]" />
            <span className="text-sm font-bold text-white">동북아 해양 중심지 도약 중</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
