import React from 'react';
import { ShieldCheck, Zap, Home, ChevronRight } from 'lucide-react';
import { TOOLS_REGISTRY } from '../constants/toolsRegistry';

interface NavbarProps {
  currentToolId: string | null;
  onNavigateHome: () => void;
  onSelectTool: (toolId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentToolId,
  onNavigateHome,
  onSelectTool,
}) => {
  const currentTool = currentToolId
    ? TOOLS_REGISTRY.find((t) => t.id === currentToolId)
    : null;

  const mobileTools = TOOLS_REGISTRY.filter((t) => t.platform === 'mobile');
  const webTools = TOOLS_REGISTRY.filter((t) => t.platform === 'web');
  const sharedTools = TOOLS_REGISTRY.filter((t) => t.platform === 'shared');

  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Logo & Navigation / Breadcrumb */}
        <div className="flex items-center gap-3">
          {/* Logo */}
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2.5 text-left group focus:outline-none"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 shadow-lg shadow-cyan-500/20 text-white font-bold group-hover:scale-105 transition-transform">
              <Zap className="w-5 h-5 text-cyan-200" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-300 bg-clip-text text-transparent">
                  DevTools Hub
                </span>
                <span className="px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Clean Code
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Mobile (Flutter) &amp; Web (Next.js) Tools
              </p>
            </div>
          </button>

          {/* Breadcrumb */}
          {currentTool && (
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-400 pl-3 border-l border-slate-800">
              <ChevronRight className="w-4 h-4 text-slate-600" />
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                currentTool.platform === 'mobile'
                  ? 'bg-cyan-950 text-cyan-300 border border-cyan-500/30'
                  : currentTool.platform === 'web'
                  ? 'bg-violet-950 text-violet-300 border border-violet-500/30'
                  : 'bg-slate-800 text-slate-300 border border-slate-700'
              }`}>
                {currentTool.platform === 'mobile' ? 'Mobile' : currentTool.platform === 'web' ? 'Next.js' : 'Utility'}
              </span>
              <span className="font-semibold text-slate-200">
                {currentTool.title}
              </span>
            </div>
          )}
        </div>

        {/* Action Controls & Navigation */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Home Button */}
          <button
            onClick={onNavigateHome}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              currentToolId === null
                ? 'bg-cyan-600 text-white shadow-md shadow-cyan-600/20'
                : 'bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700/70 border border-slate-700/60'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>หน้าแรก (Home)</span>
          </button>

          {/* Quick Tool Switcher Dropdown (Grouped) */}
          <div className="relative">
            <select
              value={currentToolId || ''}
              onChange={(e) => {
                if (e.target.value === '') {
                  onNavigateHome();
                } else {
                  onSelectTool(e.target.value);
                }
              }}
              className="bg-slate-800/90 border border-slate-700/80 text-slate-200 text-xs font-semibold rounded-lg px-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
            >
              <option value="">-- เลือกเครื่องมือ (Switch Tool) --</option>
              
              <optgroup label="📱 Mobile (Flutter & Dart)">
                {mobileTools.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title} ({t.titleTh})
                  </option>
                ))}
              </optgroup>

              <optgroup label="🌐 Web (Next.js & TypeScript)">
                {webTools.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title} ({t.titleTh})
                  </option>
                ))}
              </optgroup>

              <optgroup label="🛠️ General Utilities">
                {sharedTools.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title} ({t.titleTh})
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
