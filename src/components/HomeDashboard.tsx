import React, { useState } from 'react';
import { TOOLS_REGISTRY, TOOL_CATEGORIES } from '../constants/toolsRegistry';
import {
  Zap,
  Palette,
  FileCode2,
  KeyRound,
  ShieldCheck,
  Search,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Lock,
  Cpu
} from 'lucide-react';

interface HomeDashboardProps {
  onSelectTool: (toolId: string) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({ onSelectTool }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const getToolIcon = (iconName: string) => {
    switch (iconName) {
      case 'Zap':
        return <Zap className="w-6 h-6 text-cyan-300" />;
      case 'Palette':
        return <Palette className="w-6 h-6 text-cyan-300" />;
      case 'FileCode2':
        return <FileCode2 className="w-6 h-6 text-indigo-300" />;
      case 'KeyRound':
        return <KeyRound className="w-6 h-6 text-amber-300" />;
      case 'ShieldCheck':
      default:
        return <ShieldCheck className="w-6 h-6 text-emerald-300" />;
    }
  };

  const filteredTools = TOOLS_REGISTRY.filter((tool) => {
    const matchesSearch =
      tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.titleTh.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.features.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' || tool.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-10 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 p-8 md:p-12 text-center shadow-2xl">
        {/* Glow Effects */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 right-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Developer &amp; Flutter DevTools Hub</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
            เครื่องมือช่วยเขียนโปรแกรม{' '}
            <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">
              Clean Code &amp; SonarQube
            </span>
          </h1>

          <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            ศูนย์รวมเครื่องมือเพิ่มความเร็วในการพัฒนา Flutter, จัดการ JSON, ถอดรหัส JWT และสร้างโมเดลที่ผ่านเกณฑ์ SonarQube 100% ใช้งานได้ฟรี ออฟไลน์ ปลอดภัย 100%
          </p>

          {/* Quick Search inside Hero */}
          <div className="pt-4 max-w-xl mx-auto">
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาเครื่องมือ (เช่น JSON to Dart, JWT, Colors, SonarQube)..."
                className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl pl-12 pr-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 shadow-xl transition-all"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter Pills */}
      <section className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedCategory === 'all'
                ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-600/20'
                : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            เครื่องมือทั้งหมด ({TOOLS_REGISTRY.length})
          </button>
          {TOOL_CATEGORIES.map((cat) => {
            const count = TOOLS_REGISTRY.filter((t) => t.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-lg shadow-cyan-600/20'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat.nameTh} ({count})
              </button>
            );
          })}
        </div>

        <span className="text-xs text-slate-400 font-medium">
          แสดงผล {filteredTools.length} จาก {TOOLS_REGISTRY.length} เครื่องมือ
        </span>
      </section>

      {/* Tools Cards Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTools.map((tool) => (
          <div
            key={tool.id}
            onClick={() => onSelectTool(tool.id)}
            className="group relative flex flex-col justify-between bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300 cursor-pointer overflow-hidden"
          >
            {/* Top Badge & Icon */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-950 via-slate-900 to-indigo-950 border border-cyan-500/30 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                  {getToolIcon(tool.icon)}
                </div>

                {tool.badge && (
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {tool.badge}
                  </span>
                )}
              </div>

              {/* Title & Description */}
              <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                {tool.title}
              </h3>
              <p className="text-xs font-semibold text-cyan-400/90 mb-2">
                {tool.titleTh}
              </p>
              <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-3">
                {tool.description}
              </p>

              {/* Feature Highlights */}
              <div className="space-y-1.5 pt-3 border-t border-slate-800/80 mb-6">
                {tool.features.map((feat, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-1">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Launch Button */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-800/60 text-xs font-semibold text-cyan-400 group-hover:text-cyan-300">
              <span>เปิดใช้งานเครื่องมือ</span>
              <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-800 group-hover:bg-cyan-600 group-hover:text-white transition-all">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Trust & Privacy Highlights */}
      <section className="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        <div className="flex flex-col items-center gap-2">
          <div className="p-2.5 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
            <Lock className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-slate-200">100% Client-Side Safe</h4>
          <p className="text-[11px] text-slate-400">
            โค้ดและข้อมูลทั้งหมดประมวลผลบนเบราว์เซอร์ของคุณ ไม่มีการส่งข้อมูลใดๆ ออกไปยังเซิร์ฟเวอร์
          </p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-slate-200">SonarQube Standard</h4>
          <p className="text-[11px] text-slate-400">
            โครงสร้างและโค้ด Dart ที่สร้างขึ้นตรงตามเกณฑ์ Quality Gate ขององค์กร
          </p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="p-2.5 rounded-xl bg-indigo-950/60 border border-indigo-500/30 text-indigo-400">
            <Cpu className="w-5 h-5" />
          </div>
          <h4 className="text-xs font-bold text-slate-200">High Performance</h4>
          <p className="text-[11px] text-slate-400">
            สร้างจาก React 19 + TypeScript + Vite ทำงานเร็ว โหลดไว ไม่มีโฆษณารบกวน
          </p>
        </div>
      </section>
    </div>
  );
};
