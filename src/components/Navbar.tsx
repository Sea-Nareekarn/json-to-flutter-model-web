import React from 'react';
import { ShieldCheck, Layers, Zap } from 'lucide-react';
import { SAMPLE_PRESETS, SamplePreset } from '../constants/sampleJson';

interface NavbarProps {
  onSelectPreset: (preset: SamplePreset) => void;
  onOpenSonarModal: () => void;
  complianceScore: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onSelectPreset,
  onOpenSonarModal,
  complianceScore,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 shadow-lg shadow-cyan-500/20 text-white font-bold">
            <Zap className="w-5 h-5 text-cyan-200" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
                JSON to Flutter Model
              </h1>
              <span className="px-2 py-0.5 text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                SonarQube 100%
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Clean Architecture • Zero SonarQube Smells • Dart 3 Null-Safety
            </p>
          </div>
        </div>

        {/* Action Controls & Presets */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Preset Buttons */}
          <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700/60 text-xs">
            <span className="text-slate-400 px-2 flex items-center gap-1 font-medium">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              Presets:
            </span>
            {SAMPLE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                className="px-2.5 py-1 rounded-md text-slate-300 hover:text-white hover:bg-slate-700/70 transition-colors font-medium"
                title={preset.description}
              >
                {preset.name}
              </button>
            ))}
          </div>

          {/* SonarQube Compliance Button */}
          <button
            onClick={onOpenSonarModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-600/30 text-xs font-semibold shadow-sm transition-all group"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span>Sonar Score: {complianceScore}%</span>
            <span className="text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded text-emerald-300 font-mono">
              Audit
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
