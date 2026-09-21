import React, { useState } from 'react';
import { ShieldCheck, Search, CheckCircle2, XCircle, Copy, Check, AlertCircle } from 'lucide-react';
import { SONAR_RULES_LIST } from '../../constants/sonarRulesData';

export const SonarRulesExplorerTool: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['All', 'Naming', 'Architecture', 'Type Safety', 'Clean Code'];

  const filteredRules = SONAR_RULES_LIST.filter((rule) => {
    const matchesSearch =
      rule.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rule.dartLintEquivalent.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' || rule.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleCopy = async (code: string, id: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white dark:bg-slate-900/80 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            Dart SonarQube Rules Knowledge Base
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            คู่มือกฎ SonarQube &amp; Dart Analyzer ที่พบบ่อย พร้อมตัวอย่างโค้ดที่ถูกต้องและวิธีแก้
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[280px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ค้นหากฎ (เช่น S101, const, hash, naming)..."
            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-900 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
          />
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-emerald-600 text-white shadow'
                : 'bg-white dark:bg-slate-900/80 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Rules List */}
      <div className="space-y-4">
        {filteredRules.length === 0 ? (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800">
            <AlertCircle className="w-8 h-8 mx-auto mb-2 text-slate-400 dark:text-slate-600" />
            <p className="text-sm">ไม่พบกฎ SonarQube ที่ตรงกับคำค้นหา "{searchQuery}"</p>
          </div>
        ) : (
          filteredRules.map((rule) => (
            <div
              key={rule.id}
              className="bg-white dark:bg-slate-900/70 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm dark:shadow-lg transition-colors"
            >
              {/* Card Header */}
              <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 border border-emerald-200 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-400">
                    {rule.id}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {rule.name}
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700/60">
                    {rule.dartLintEquivalent}
                  </span>
                  <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-500/20">
                    {rule.severity}
                  </span>
                </div>
              </div>

              {/* Card Content */}
              <div className="p-4 space-y-3">
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium">
                  {rule.summary}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {rule.explanation}
                </p>

                {/* Side by side code comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                  {/* Bad Code */}
                  <div className="bg-slate-950 rounded-lg border border-rose-200 dark:border-rose-900/40 overflow-hidden">
                    <div className="px-3 py-1.5 bg-rose-100 dark:bg-rose-950/30 border-b border-rose-200 dark:border-rose-900/40 text-[11px] font-bold text-rose-700 dark:text-rose-400 flex items-center gap-1.5">
                      <XCircle className="w-3.5 h-3.5" />
                      Non-Compliant (จะโดน SonarQube แจ้งเตือน)
                    </div>
                    <pre className="p-3 text-[11px] font-mono text-rose-300 dark:text-rose-200 overflow-auto whitespace-pre">
                      {rule.badCode}
                    </pre>
                  </div>

                  {/* Good Code */}
                  <div className="bg-slate-950 rounded-lg border border-emerald-200 dark:border-emerald-900/40 overflow-hidden relative">
                    <div className="px-3 py-1.5 bg-emerald-100 dark:bg-emerald-950/30 border-b border-emerald-200 dark:border-emerald-900/40 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Compliant (ผ่านเกณฑ์ 100%)
                      </span>
                      <button
                        onClick={() => handleCopy(rule.goodCode, rule.id)}
                        className="text-[10px] text-slate-600 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-300 flex items-center gap-1"
                      >
                        {copiedId === rule.id ? <Check className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedId === rule.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <pre className="p-3 text-[11px] font-mono text-emerald-300 dark:text-emerald-200 overflow-auto whitespace-pre">
                      {rule.goodCode}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
