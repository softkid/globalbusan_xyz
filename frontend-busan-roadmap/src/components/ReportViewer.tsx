import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, ChevronRight, ExternalLink, Loader2 } from 'lucide-react';

export interface DocEntry {
  id: string;
  title: string;
  file: string;
  desc: string;
}

export const docs: DocEntry[] = [
  { id: 'digital-hub', title: '디지털허브 2.0 최종보고서', file: '/docs/digital-hub-report.md', desc: '부산 디지털허브 2.0 전략 검증 및 보완' },
  { id: 'maritime-roadmap', title: '해양수도 4개년 정책로드맵', file: '/docs/maritime-roadmap.md', desc: '2026~2030 해양수도 실현 단계별 계획' },
  { id: 'digital-design', title: '디지털허브 통합 설계도', file: '/docs/digital-hub-design.md', desc: 'API·데이터·디지털트윈 플랫폼 설계' },
  { id: 'fusion', title: '융합 실행전략 보고서', file: '/docs/fusion-strategy.md', desc: '해양수도 × 디지털허브 통합 전략' },
  { id: 'policy-exec', title: '정책 실행형 보고서', file: '/docs/policy-execution.md', desc: '전재수 정책 실행 방안' },
  { id: 'maritime-4yr', title: '해양수도 4년내 달성', file: '/docs/maritime-4year.md', desc: '단기 집중 달성 전략' },
];

interface ReportViewerProps {
  isOpen: boolean;
  onClose: () => void;
}

const ReportViewer: React.FC<ReportViewerProps> = ({ isOpen, onClose }) => {
  const [selectedDoc, setSelectedDoc] = useState<DocEntry | null>(null);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedDoc) { setContent(''); return; }
    setLoading(true);
    fetch(selectedDoc.file)
      .then(r => r.text())
      .then(t => { setContent(t); setLoading(false); })
      .catch(() => { setContent('문서를 불러올 수 없습니다.'); setLoading(false); });
  }, [selectedDoc]);

  // Reset when closed
  useEffect(() => {
    if (!isOpen) setSelectedDoc(null);
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            className="fixed inset-y-0 right-0 w-full max-w-4xl z-50 flex"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Sidebar: Doc list */}
            <div className="w-72 flex-shrink-0 bg-[#060e1a] border-r border-white/10 flex flex-col overflow-hidden">
              <div className="p-5 border-b border-white/10">
                <h2 className="text-sm font-black text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-busan-primary" />
                  정책 보고서
                </h2>
                <p className="text-[9px] text-slate-500 mt-1">문서를 선택하여 열람하세요</p>
              </div>
              <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-1.5">
                {docs.map(doc => (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc)}
                    className={`text-left p-3 rounded-xl transition-all border ${
                      selectedDoc?.id === doc.id
                        ? 'bg-busan-primary/10 border-busan-primary/30 text-white'
                        : 'bg-white/5 border-transparent hover:border-white/10 text-slate-300 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold truncate">{doc.title}</span>
                      <ChevronRight className="w-3 h-3 flex-shrink-0 text-slate-500" />
                    </div>
                    <p className="text-[9px] text-slate-500 mt-1 line-clamp-1">{doc.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Content area */}
            <div className="flex-1 bg-[#0a1628] flex flex-col overflow-hidden">
              {/* Top bar */}
              <div className="flex items-center justify-between px-6 h-14 border-b border-white/10 flex-shrink-0">
                <span className="text-sm font-bold text-white truncate">
                  {selectedDoc?.title || '문서를 선택하세요'}
                </span>
                <div className="flex items-center gap-2">
                  {selectedDoc && (
                    <a
                      href={selectedDoc.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-slate-400 hover:text-busan-primary flex items-center gap-1 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" /> 원본
                    </a>
                  )}
                  <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                  >
                    <X className="w-4 h-4 text-slate-400" />
                  </button>
                </div>
              </div>

              {/* Markdown content */}
              <div className="flex-1 overflow-y-auto p-8">
                {!selectedDoc ? (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500">
                    <FileText className="w-12 h-12 mb-4 opacity-30" />
                    <p className="text-sm">좌측에서 보고서를 선택하세요</p>
                  </div>
                ) : loading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-6 h-6 animate-spin text-busan-primary" />
                  </div>
                ) : (
                  <article className="prose prose-invert prose-sm max-w-none
                    prose-headings:text-white prose-headings:font-black
                    prose-h1:text-2xl prose-h1:border-b prose-h1:border-white/10 prose-h1:pb-3 prose-h1:mb-6
                    prose-h2:text-xl prose-h2:text-busan-primary prose-h2:mt-8
                    prose-h3:text-base prose-h3:text-busan-accent
                    prose-p:text-slate-300 prose-p:leading-relaxed
                    prose-strong:text-white
                    prose-a:text-busan-primary prose-a:no-underline hover:prose-a:underline
                    prose-table:border-collapse
                    prose-th:bg-white/10 prose-th:px-3 prose-th:py-2 prose-th:text-left prose-th:text-[11px] prose-th:font-bold prose-th:text-slate-300 prose-th:border prose-th:border-white/10
                    prose-td:px-3 prose-td:py-2 prose-td:text-[11px] prose-td:text-slate-400 prose-td:border prose-td:border-white/10
                    prose-li:text-slate-300 prose-li:text-sm
                    prose-code:text-busan-primary prose-code:bg-white/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded
                    prose-pre:bg-[#050d18] prose-pre:border prose-pre:border-white/10 prose-pre:rounded-xl
                    prose-blockquote:border-busan-primary/30 prose-blockquote:text-slate-400
                    prose-hr:border-white/10
                  ">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {content}
                    </ReactMarkdown>
                  </article>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ReportViewer;
