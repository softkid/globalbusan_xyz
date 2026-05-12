import React from 'react';
import { PolicyProject } from '../data/roadmap';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

interface ProjectListProps {
  projects: PolicyProject[];
}

const ProjectList: React.FC<ProjectListProps> = ({ projects }) => {
  return (
    <div className="flex flex-col gap-3">
      {projects.map((p, idx) => (
        <div key={idx} className="bg-white/5 border border-white/10 p-4 rounded-xl hover:border-white/20 transition-all">
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-sm font-bold text-busan-accent">{p.title}</h4>
            {p.status === 'completed' ? (
              <CheckCircle2 className="w-4 h-4 text-busan-accent" />
            ) : p.status === 'in-progress' ? (
              <Clock className="w-4 h-4 text-busan-primary" />
            ) : (
              <Circle className="w-4 h-4 text-slate-600" />
            )}
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
          <div className="w-full h-1 bg-white/10 rounded-full mt-3 overflow-hidden">
            <div 
              className={`h-full ${p.status === 'completed' ? 'bg-busan-accent' : 'bg-busan-primary'}`} 
              style={{ width: p.status === 'completed' ? '100%' : '60%' }} 
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectList;
