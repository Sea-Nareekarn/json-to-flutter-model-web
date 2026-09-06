import React, { useState } from 'react';
import { TOOLS_REGISTRY, PLATFORMS, PlatformType } from '../constants/toolsRegistry';
import {
  Zap,
  Palette,
  FileCode2,
  KeyRound,
  ShieldCheck,
  Code2,
  Brush,
  Search,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Smartphone,
  Globe,
  Layers,
  Lock,
  Cpu
} from 'lucide-react';

interface HomeDashboardProps {
  onSelectTool: (toolId: string) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({ onSelectTool }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformType | 'all'>('all');

  const getToolIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap':
        return <Zap className="w-6 h-6 text-cyan-500 dark:text-cyan-300" />;
      case 'Palette':
        return <Palette className="w-6 h-6 text-cyan-500 dark:text-cyan-300" />;
      case 'FileCode2':
        return <FileCode2 className="w-6 h-6 text-indigo-500 dark:text-indigo-300" />;
      case 'Code2':
        return <Code2 className="w-6 h-6 text-violet-500 dark:text-violet-300" />;
      case 'Brush':
        return <Brush className="w-6 h-6 text-cyan-500 dark:text-cyan-300" />;
      case 'KeyRound':
        return <KeyRound className="w-6 h-6 text-amber-500 dark:text-amber-300" />;
      case 'ShieldCheck':
      default:
        return <ShieldCheck className="w-6 h-6 text-emerald-500 dark:text-emerald-300" />;
    }
  };

  const filteredTools = TOOLS_REGISTRY.filter((tool) => {
    const matchesSearch =
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.titleTh.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPlatform =
      selectedPlatform === 'all' || tool.platform === selectedPlatform;

    return matchesSearch && matchesPlatform;
  });

  return (
    <div className="space-y-10 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-white via-slate-50 to-indigo-50/50 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/40 border border-slate-200 dark:border-slate-800 p-8 md:p-12 text-center shadow-xl transition-colors duration-200">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 right-10 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-700 dark:text-cyan-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Developer Suite • Mobile (Flutter) &amp; Web (Next.js)</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            เครื่องมือเขียนโปรแกรม{' '}
            <span className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 dark:from-cyan-400 dark:via-sky-300 dark:to-violet-300 bg-clip-text text-transparent">
              Mobile &amp; Web DevTools
            </span>
          </h1>

          <p className="text-sm md:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
            ศูนย์รวมเครื่องมือเพิ่มความเร็วในการพัฒนา <strong>Flutter (Dart)</strong> และ <strong>Next.js (React / TypeScript)</strong> สร้างโมเดลที่ผ่านเกณฑ์ SonarQube 100% ใช้งานได้ฟรี ออฟไลน์ ปลอดภัย
          </p>

          {/* Quick Search */}
          <div className="pt-4 max-w-xl mx-auto">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาเครื่องมือ (เช่น JSON to Flutter, TypeScript Zod, Tailwind, JWT)..."
                className="w-full bg-white dark:bg-slate-950/90 border border-slate-300 dark:border-slate-700/80 rounded-xl pl-12 pr-4 py-3 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 shadow-md dark:shadow-xl transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Platform Tabs: Mobile (Flutter) vs Web (Next.js) */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((plat) => {
              const isSelected = selectedPlatform === plat.id;
              const count = plat.id === 'all'
                ? TOOLS_REGISTRY.length
                : TOOLS_REGISTRY.filter((t) => t.platform === plat.id).length;

              return (
                <button
                  key={plat.id}
                  onClick={() => setSelectedPlatform(plat.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? plat.id === 'mobile'
                        ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-600/25 ring-1 ring-cyan-400'
                        : plat.id === 'web'
                        ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg shadow-violet-600/25 ring-1 ring-violet-400'
                        : 'bg-slate-800 text-white shadow-lg'
                      : 'bg-white dark:bg-slate-900/90 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-sm'
                  }`}
                >
                  {plat.id === 'mobile' && <Smartphone className="w-4 h-4 text-cyan-300" />}
                  {plat.id === 'web' && <Globe className="w-4 h-4 text-violet-300" />}
                  {plat.id === 'all' && <Layers className="w-4 h-4 text-slate-300" />}
                  <span>{plat.nameTh}</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium self-end sm:self-auto">
            แสดงผล {filteredTools.length} จาก {TOOLS_REGISTRY.length} เครื่องมือ
          </span>
        </div>
      </section>

      {/* Tools Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool) => {
          const isMobile = tool.platform === 'mobile';
          const isWeb = tool.platform === 'web';

          return (
            <div
              key={tool.id}
              onClick={() => onSelectTool(tool.id)}
              className={`group relative flex flex-col justify-between bg-white dark:bg-slate-900/80 hover:bg-slate-50 dark:hover:bg-slate-900 border rounded-2xl p-6 shadow-md dark:shadow-xl hover:shadow-xl transition-all duration-300 cursor-pointer overflow-hidden ${
                isMobile
                  ? 'border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 hover:shadow-cyan-500/10'
                  : isWeb
                  ? 'border-slate-200 dark:border-slate-800 hover:border-violet-500/50 hover:shadow-violet-500/10'
                  : 'border-slate-200 dark:border-slate-800 hover:border-indigo-500/50 hover:shadow-indigo-500/10'
              }`}
            >
              {/* Top Badge & Icon */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl border flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm ${
                    isMobile
                      ? 'bg-cyan-50 dark:bg-gradient-to-tr dark:from-cyan-950 dark:to-slate-900 border-cyan-200 dark:border-cyan-500/30'
                      : isWeb
                      ? 'bg-violet-50 dark:bg-gradient-to-tr dark:from-violet-950 dark:to-slate-900 border-violet-200 dark:border-violet-500/30'
                      : 'bg-slate-50 dark:bg-gradient-to-tr dark:from-slate-950 dark:to-slate-900 border-slate-200 dark:border-slate-700'
                  }`}>
                    {getToolIcon(tool.icon)}
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Platform Pill */}
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      isMobile
                        ? 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950/80 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-500/30'
                        : isWeb
                        ? 'bg-violet-100 text-violet-800 dark:bg-violet-950/80 dark:text-violet-300 border border-violet-300 dark:border-violet-500/30'
                        : 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border border-slate-300 dark:border-slate-700'
                    }`}>
                      {isMobile ? 'Mobile' : isWeb ? 'Next.js' : 'Utility'}
                    </span>

                    {tool.badge && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30">
                        {tool.badge}
                      </span>
                    )}
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-300 transition-colors">
                  {tool.title}
                </h3>
                <p className={`text-xs font-semibold mb-2 ${isMobile ? 'text-cyan-600 dark:text-cyan-400/90' : isWeb ? 'text-violet-600 dark:text-violet-400/90' : 'text-slate-600 dark:text-slate-400'}`}>
                  {tool.titleTh}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4 line-clamp-3">
                  {tool.description}
                </p>

                {/* Feature Highlights */}
                <div className="space-y-1.5 pt-3 border-t border-slate-200 dark:border-slate-800/80 mb-6">
                  {tool.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                        isMobile ? 'text-cyan-600 dark:text-cyan-400' : isWeb ? 'text-violet-600 dark:text-violet-400' : 'text-indigo-600 dark:text-indigo-400'
                      }`} />
                      <span className="line-clamp-1">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Launch Button */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-slate-800/60 text-xs font-semibold text-cyan-600 dark:text-cyan-400 group-hover:text-cyan-700 dark:group-hover:text-cyan-300">
                <span>เปิดใช้งานเครื่องมือ</span>
                <div className={`flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:text-white transition-all ${
                  isMobile ? 'group-hover:bg-cyan-600' : isWeb ? 'group-hover:bg-violet-600' : 'group-hover:bg-indigo-600'
                }`}>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Trust & Privacy Highlights */}
      <section className="p-6 rounded-2xl bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center shadow-sm">
        <div className="flex flex-col items-center gap-2">
          <div className="p-2.5 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-200 dark:border-cyan-500/30 text-cyan-600 dark:text-cyan-400">
            <Lock className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">100% Client-Side Safe</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            โค้ดและข้อมูลทั้งหมดประมวลผลบนเบราว์เซอร์ของคุณ ไม่มีการส่งข้อมูลใดๆ ออกไปยังเซิร์ฟเวอร์
          </p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">SonarQube Certified</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            โครงสร้างและโค้ด Dart ที่สร้างขึ้นตรงตามเกณฑ์ Quality Gate ขององค์กร 100%
          </p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="p-2.5 rounded-xl bg-violet-50 dark:bg-violet-950/60 border border-violet-200 dark:border-violet-500/30 text-violet-600 dark:text-violet-400">
            <Cpu className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Next.js &amp; Flutter Ready</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            ครอบคลุมเครื่องมือสำหรับทั้ง Mobile (Flutter) และ Web (Next.js / TypeScript)
          </p>
        </div>
      </section>
    </div>
  );
};
