import React, { useState, useMemo, useRef } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Wand2,
  Copy,
  Check,
  Layers,
  Code2
} from 'lucide-react';
import { SonarDartLinter, SonarIssue, IssueSeverity } from '../../analyzer/sonarCodeLinter';

const SAMPLE_BAD_CODE = `// ❌ ตัวอย่างโค้ด Dart ที่มี SonarQube Issues หลากหลายประเภท
import 'dart:io';

class user_profile_response {
  final int user_id;
  final String First_Name;
  final double account_balance;
  final bool is_active;

  user_profile_response({
    required this.user_id,
    required this.First_Name,
    required this.account_balance,
    required this.is_active,
  });

  factory user_profile_response.fromJson(Map<String, dynamic> json) {
    return user_profile_response(
      user_id: json['user_id'] as int,
      First_Name: json['first_name'] as String,
      account_balance: json['balance'] as double,
      is_active: json['is_active'] as bool,
    );
  }

  // TODO: เพิ่ม unit test สำหรับฟังก์ชันนี้
  void processPayment() {}

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is user_profile_response && other.user_id == user_id;
  }
  // Missing hashCode override!
}
`;

const SAMPLE_UNSAFE_CAST_CODE = `class ProductItem {
  final int id;
  final String title;
  final double price;

  ProductItem({
    required this.id,
    required this.title,
    required this.price,
  });

  factory ProductItem.fromJson(Map<String, dynamic> json) {
    return ProductItem(
      id: json['id'] as int,
      title: json['title'] as String,
      price: json['price'] as double, // Unsafe double cast!
    );
  }

  @override
  int get hashCode => id.hashCode ^ title.hashCode ^ price.hashCode;
}
`;

const SAMPLE_CLEAN_CODE = `import 'package:meta/meta.dart';

@immutable
class UserProfileResponse {
  final int userId;
  final String firstName;
  final double accountBalance;
  final bool isActive;

  const UserProfileResponse({
    required this.userId,
    required this.firstName,
    required this.accountBalance,
    required this.isActive,
  });

  factory UserProfileResponse.fromJson(Map<String, dynamic> json) {
    return UserProfileResponse(
      userId: (json['user_id'] as num?)?.toInt() ?? 0,
      firstName: json['first_name']?.toString() ?? '',
      accountBalance: (json['balance'] as num?)?.toDouble() ?? 0.0,
      isActive: json['is_active'] as bool? ?? false,
    );
  }

  @override
  bool operator ==(Object other) {
    if (identical(this, other)) return true;
    return other is UserProfileResponse &&
        other.userId == userId &&
        other.firstName == firstName &&
        other.accountBalance == accountBalance &&
        other.isActive == isActive;
  }

  @override
  int get hashCode => Object.hash(
        userId,
        firstName,
        accountBalance,
        isActive,
      );
}
`;

export const SonarCodeLinterTool: React.FC = () => {
  const [dartCode, setDartCode] = useState<string>(SAMPLE_BAD_CODE);
  const [selectedSeverity, setSelectedSeverity] = useState<string>('ALL');
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Run Real-time Line-by-Line Linting
  const report = useMemo(() => {
    return SonarDartLinter.analyze(dartCode);
  }, [dartCode]);

  const lines = dartCode.split('\n');

  // Map issues by line number for line gutter indicators
  const issuesByLine = useMemo(() => {
    const map = new Map<number, SonarIssue[]>();
    for (const issue of report.issues) {
      if (!map.has(issue.lineNumber)) {
        map.set(issue.lineNumber, []);
      }
      map.get(issue.lineNumber)!.push(issue);
    }
    return map;
  }, [report.issues]);

  const filteredIssues = useMemo(() => {
    if (selectedSeverity === 'ALL') return report.issues;
    return report.issues.filter((i) => i.severity === selectedSeverity);
  }, [report.issues, selectedSeverity]);

  const handleAutoFix = () => {
    const fixed = SonarDartLinter.autoFix(dartCode);
    setDartCode(fixed);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(dartCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSelectIssue = (issue: SonarIssue) => {
    setSelectedIssueId(issue.id);
    if (textareaRef.current) {
      const linesArray = dartCode.split('\n');
      let charIndex = 0;
      for (let i = 0; i < issue.lineNumber - 1; i++) {
        charIndex += linesArray[i].length + 1;
      }
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(charIndex, charIndex + (linesArray[issue.lineNumber - 1]?.length || 0));
    }
  };

  const getSeverityBadge = (sev: IssueSeverity) => {
    switch (sev) {
      case 'CRITICAL':
      case 'BLOCKER':
        return 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border-rose-300 dark:border-rose-600/40';
      case 'MAJOR':
        return 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-600/40';
      case 'MINOR':
        return 'bg-cyan-100 dark:bg-cyan-950/80 text-cyan-700 dark:text-cyan-300 border-cyan-300 dark:border-cyan-600/40';
      case 'INFO':
      default:
        return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info & Toolbar */}
      <div className="bg-white dark:bg-slate-900/80 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              SonarQube Code Checker &amp; Line-by-Line Linter
            </h2>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-500/30">
              Real-time
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            วางโค้ด Dart/Flutter เพื่อตรวจจับและแสดง SonarQube Code Smells &amp; Issues แบบรายบรรทัด
          </p>
        </div>

        {/* Presets & Quick Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Preset Buttons */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-800 text-xs">
            <span className="text-slate-400 px-2 flex items-center gap-1 font-medium">
              <Layers className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              Presets:
            </span>
            <button
              onClick={() => setDartCode(SAMPLE_BAD_CODE)}
              className="px-2.5 py-1 rounded text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              โค้ดมี Issues
            </button>
            <button
              onClick={() => setDartCode(SAMPLE_UNSAFE_CAST_CODE)}
              className="px-2.5 py-1 rounded text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              Unsafe Casts
            </button>
            <button
              onClick={() => setDartCode(SAMPLE_CLEAN_CODE)}
              className="px-2.5 py-1 rounded text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
            >
              Clean 100%
            </button>
          </div>

          {/* Auto Fix Button */}
          {report.totalIssues > 0 && (
            <button
              onClick={handleAutoFix}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all active:scale-95"
              title="Automatically fix naming and unsafe casting issues"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Auto-Fix</span>
            </button>
          )}

          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 border border-slate-300 dark:border-slate-700 transition-colors"
            title="Copy Code"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Quality Gate Status Overview Banner */}
      <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all shadow-sm ${
        report.qualityGate === 'PASSED'
          ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-white dark:from-emerald-950/40 dark:via-teal-950/20 dark:to-slate-900 border-emerald-300 dark:border-emerald-500/40'
          : 'bg-gradient-to-r from-rose-50 via-amber-50 to-white dark:from-rose-950/40 dark:via-amber-950/20 dark:to-slate-900 border-rose-300 dark:border-rose-500/40'
      }`}>
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${
            report.qualityGate === 'PASSED'
              ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/40'
              : 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 border border-rose-300 dark:border-rose-500/40'
          }`}>
            {report.qualityGate === 'PASSED' ? <ShieldCheck className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-extrabold ${
                report.qualityGate === 'PASSED' ? 'text-emerald-800 dark:text-emerald-300' : 'text-rose-800 dark:text-rose-300'
              }`}>
                SonarQube Quality Gate: {report.qualityGate}
              </span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-white/80 dark:bg-slate-900/80 border border-slate-300 dark:border-slate-700">
                Score: {report.complianceScore}/100
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              {report.totalIssues === 0
                ? 'ยอดเยี่ยม! โค้ดผ่านเกณฑ์ SonarQube และ Dart Clean Code ไร้ Warning 100%'
                : `พบข้อผิดพลาดทั้งหมด ${report.totalIssues} จุด ในโค้ดของคุณ (${report.linesCount} บรรทัด)`}
            </p>
          </div>
        </div>

        {/* Issue Counter Chips */}
        <div className="flex items-center gap-2 text-xs font-mono">
          {report.criticalCount > 0 && (
            <span className="px-2.5 py-1 rounded-lg bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-600/50 font-bold">
              Critical: {report.criticalCount}
            </span>
          )}
          {report.majorCount > 0 && (
            <span className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-600/50 font-bold">
              Major: {report.majorCount}
            </span>
          )}
          {report.minorCount > 0 && (
            <span className="px-2.5 py-1 rounded-lg bg-cyan-100 dark:bg-cyan-950/80 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-600/50 font-bold">
              Minor: {report.minorCount}
            </span>
          )}
          {report.infoCount > 0 && (
            <span className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700">
              Info: {report.infoCount}
            </span>
          )}
        </div>
      </div>

      {/* Main Split-Screen Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Code Editor with Line Number Gutter & Issue Badges */}
        <div className="lg:col-span-7 flex flex-col bg-white dark:bg-slate-900/70 rounded-xl border border-slate-200 dark:border-slate-800 shadow-md dark:shadow-xl overflow-hidden min-h-[550px]">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
              Dart / Flutter Source Code Editor
            </span>
            <span className="text-[11px] font-mono text-slate-500">
              {lines.length} lines • Live Inspection
            </span>
          </div>

          <div className="relative flex-1 flex overflow-auto bg-slate-50/60 dark:bg-slate-950/90 font-mono text-xs">
            {/* Line Numbers & Gutter Issue Badges */}
            <div className="select-none py-4 px-3 bg-slate-100 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800/80 text-slate-400 text-right space-y-[4.5px]">
              {lines.map((_, idx) => {
                const lineNum = idx + 1;
                const lineIssues = issuesByLine.get(lineNum);
                const hasCritical = lineIssues?.some((i) => i.severity === 'CRITICAL' || i.severity === 'BLOCKER');
                const hasMajor = lineIssues?.some((i) => i.severity === 'MAJOR');

                return (
                  <div key={lineNum} className="flex items-center justify-end gap-1.5 h-5 leading-5">
                    {lineIssues && (
                      <span
                        className={`w-2 h-2 rounded-full animate-pulse ${
                          hasCritical ? 'bg-rose-500 ring-2 ring-rose-500/30' : hasMajor ? 'bg-amber-500' : 'bg-cyan-500'
                        }`}
                        title={`Line ${lineNum}: ${lineIssues.length} issue(s)`}
                      />
                    )}
                    <span className={`text-[11px] ${lineIssues ? 'font-bold text-slate-800 dark:text-slate-200' : 'text-slate-400 dark:text-slate-600'}`}>
                      {lineNum}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Editable Text Area */}
            <textarea
              ref={textareaRef}
              value={dartCode}
              onChange={(e) => setDartCode(e.target.value)}
              spellCheck={false}
              className="flex-1 p-4 bg-transparent text-slate-900 dark:text-slate-200 font-mono text-xs sm:text-sm leading-relaxed resize-none focus:outline-none focus:ring-0 whitespace-pre"
              placeholder="วางโค้ด Dart ของคุณที่นี่..."
            />
          </div>
        </div>

        {/* Right: Line-by-Line Issues Inspector Panel */}
        <div className="lg:col-span-5 flex flex-col bg-white dark:bg-slate-900/70 rounded-xl border border-slate-200 dark:border-slate-800 shadow-md dark:shadow-xl overflow-hidden min-h-[550px]">
          {/* Panel Header & Filter */}
          <div className="p-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              SonarQube Issues List ({filteredIssues.length})
            </span>

            {/* Severity Filter */}
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-lg px-2 py-1 focus:outline-none"
            >
              <option value="ALL">All Severities</option>
              <option value="CRITICAL">Critical ({report.criticalCount})</option>
              <option value="MAJOR">Major ({report.majorCount})</option>
              <option value="MINOR">Minor ({report.minorCount})</option>
              <option value="INFO">Info ({report.infoCount})</option>
            </select>
          </div>

          {/* Issues List Body */}
          <div className="flex-1 p-3 overflow-y-auto space-y-3 max-h-[580px]">
            {filteredIssues.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center text-slate-500">
                <ShieldCheck className="w-12 h-12 text-emerald-500 mb-2" />
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  ไม่พบ Issue ในหมวดนี้
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  โค้ดของคุณในส่วนนี้ผ่านเกณฑ์ SonarQube และ Clean Code เรียบร้อยแล้ว
                </p>
              </div>
            ) : (
              filteredIssues.map((issue) => {
                const isSelected = selectedIssueId === issue.id;

                return (
                  <div
                    key={issue.id}
                    onClick={() => handleSelectIssue(issue)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-50/80 dark:bg-slate-800/90 border-cyan-500 ring-1 ring-cyan-500/50 shadow-md'
                        : 'bg-slate-50 dark:bg-slate-950/70 border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-700'
                    }`}
                  >
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                          Line {issue.lineNumber}
                        </span>
                        <span className="font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400">
                          {issue.ruleId}
                        </span>
                      </div>

                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${getSeverityBadge(issue.severity)}`}>
                        {issue.severity}
                      </span>
                    </div>

                    {/* Title & Message */}
                    <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {issue.title}
                    </h5>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                      {issue.message}
                    </p>

                    {/* Offending Code Snippet */}
                    <div className="mt-2 p-2 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-rose-600 dark:text-rose-400 overflow-x-auto">
                      ❌ {issue.offendingText}
                    </div>

                    {/* Suggested Fix */}
                    {issue.suggestedFix && (
                      <div className="mt-1.5 p-2 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 text-[11px] font-mono text-emerald-700 dark:text-emerald-300 overflow-x-auto">
                        ✅ แนะนำ: {issue.suggestedFix}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
