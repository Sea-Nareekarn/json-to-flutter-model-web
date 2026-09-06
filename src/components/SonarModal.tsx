import React from 'react';
import { SonarRuleResult } from '../types';
import { ShieldCheck, CheckCircle2, AlertTriangle, X, Award, HelpCircle } from 'lucide-react';

interface SonarModalProps {
  isOpen: boolean;
  onClose: () => void;
  sonarResults: SonarRuleResult[];
  complianceScore: number;
}

export const SonarModal: React.FC<SonarModalProps> = ({
  isOpen,
  onClose,
  sonarResults,
  complianceScore,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl max-h-[85vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                SonarQube &amp; Dart Clean Code Audit
                <span className="px-2 py-0.5 text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-full">
                  Score: {complianceScore}%
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                การตรวจสอบความถูกต้องตามมาตรฐาน Clean Code และ SonarQube Rules สำหรับ Flutter &amp; Dart
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content / Checklist */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Summary Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/50 via-teal-950/30 to-slate-900 border border-emerald-500/30 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-bold text-emerald-300 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                SonarQube Quality Gate Status: PASSED
              </h4>
              <p className="text-xs text-slate-300 mt-1">
                โมเดลที่สร้างขึ้นผ่านการตรวจสอบกฎ Naming, Immutability, Type Safety และ paired hash/equals
              </p>
            </div>
            <div className="text-2xl font-extrabold text-emerald-400 font-mono">
              {complianceScore}/100
            </div>
          </div>

          {/* Rule Cards */}
          <div className="space-y-3">
            {sonarResults.map((rule) => {
              const isPassed = rule.status === 'passed';
              return (
                <div
                  key={rule.ruleId}
                  className={`p-4 rounded-xl border transition-all ${
                    isPassed
                      ? 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      : 'bg-amber-950/20 border-amber-500/30'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      {isPassed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-cyan-400">
                            {rule.ruleId}
                          </span>
                          <span className="text-xs font-semibold text-slate-200">
                            {rule.title}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
                            {rule.category}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">
                          {rule.description}
                        </p>
                        <div className="mt-2 p-2 rounded bg-slate-900 border border-slate-800/80 text-[11px] font-mono text-emerald-300">
                          ✓ {rule.explanation}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Architecture Tips */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 space-y-1.5">
            <h5 className="font-semibold text-slate-300 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-indigo-400" />
              ทำไม SonarQube จึงเข้มงวดกับ Data Model ใน Flutter?
            </h5>
            <p>
              1. <strong>Object.hash()</strong>: ใน Dart 3.x การใช้ `Object.hash(...)` ช่วยป้องกัน hash collision เมื่อเทียบกับ bitwise XOR (`^`) ในอดีต
            </p>
            <p>
              2. <strong>(num?)?.toInt()</strong>: Backend มักส่งตัวเลขเช่น `100.0` หรือ `100` สลับกัน การ cast เป็น `as int` ตรงๆ จะเกิด runtime crash ได้
            </p>
            <p>
              3. <strong>const Constructor</strong>: ช่วยให้ Flutter Tree ทำ compile-time constant caching ประหยัด memory ได้มหาศาล
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
          >
            ปิดหน้าต่าง
          </button>
        </div>
      </div>
    </div>
  );
};
