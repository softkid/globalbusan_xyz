import React from 'react';
import { districts } from '../data/roadmap';
import { motion } from 'framer-motion';

interface MapProps {
  progress: Record<string, number>;
}

const Map: React.FC<MapProps> = ({ progress }) => {
  return (
    <div className="relative w-full h-full min-h-[500px] flex items-center justify-center overflow-hidden">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(rgba(0, 240, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.2) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      <div className="relative w-full h-full max-w-4xl max-h-[800px]">
        {districts.map((d) => {
          const pct = progress[d.id] || 0;
          const scale = 1 + (pct / 100) * 0.8;
          const opacity = 0.1 + (pct / 100) * 0.9;
          
          return (
            <motion.div
              key={d.id}
              className="absolute group"
              style={{ top: `${d.coords.y}%`, left: `${d.coords.x}%`, transform: 'translate(-50%, -50%)' }}
              initial={false}
              animate={{ opacity: 1 }}
            >
              {/* Pulsing Aura */}
              <motion.div 
                className="absolute inset-0 rounded-full bg-busan-primary/20"
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.1, 0.3] }}
                transition={{ duration: 3, repeat: Infinity }}
                style={{ width: '40px', height: '40px', margin: '-20px' }}
              />

              {/* District Node */}
              <motion.div
                className="relative z-10 w-4 h-4 rounded-full border-2 border-busan-primary cursor-crosshair"
                animate={{ 
                  scale: scale,
                  backgroundColor: `rgba(0, 240, 255, ${opacity})`,
                  boxShadow: `0 0 ${pct/3}px rgba(0, 240, 255, 0.8)`
                }}
                transition={{ type: 'spring', stiffness: 50 }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>

              {/* Name Label */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-busan-dark/80 backdrop-blur-md border border-white/10 px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap z-20 pointer-events-none transition-all group-hover:border-busan-primary/50 group-hover:text-busan-primary">
                {d.name}
              </div>

              {/* Tooltip */}
              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-300 z-30 scale-95 group-hover:scale-100">
                <div className="bg-busan-dark/95 backdrop-blur-xl border border-busan-primary/50 p-3 rounded-xl shadow-2xl w-48 text-center">
                  <h4 className="text-busan-primary font-bold text-xs mb-1">{d.name}</h4>
                  <p className="text-slate-400 text-[10px] leading-tight mb-2">{d.focus}</p>
                  <div className="flex justify-between items-center text-[10px] border-t border-white/10 pt-2">
                    <span>진행률</span>
                    <span className="text-busan-accent font-bold">{pct}%</span>
                  </div>
                  <div className="w-full h-1 bg-white/10 rounded-full mt-1 overflow-hidden">
                    <motion.div 
                      className="h-full bg-gradient-to-r from-busan-secondary to-busan-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Map;
