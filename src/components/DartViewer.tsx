import React, { useEffect, useState } from 'react';
import { GenerationResult, GeneratedFile } from '../types';
import { Copy, Check, Download, FileArchive, Layers, ShieldCheck } from 'lucide-react';
import Prism from 'prismjs';
import 'prismjs/components/prism-dart';
import JSZip from 'jszip';

interface DartViewerProps {
  generationResult: GenerationResult | null;
  error: string | null;
  onOpenSonarModal: () => void;
}

export const DartViewer: React.FC<DartViewerProps> = ({
  generationResult,
  error,
  onOpenSonarModal,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('all');

  useEffect(() => {
    Prism.highlightAll();
  }, [generationResult, activeTab]);

  const handleCopy = async (text: string) => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingle = (fileName: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadZip = async (files: GeneratedFile[]) => {
    const zip = new JSZip();
    files.forEach((f) => {
      zip.file(f.fileName, f.content);
    });

    const content = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'flutter_models.zip';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (error) {
    return (
      <div className="flex flex-col h-full bg-white dark:bg-slate-900/70 rounded-xl border border-slate-200 dark:border-slate-800 shadow-md dark:shadow-xl overflow-hidden items-center justify-center p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/80 border border-rose-300 dark:border-rose-600/40 flex items-center justify-center text-rose-600 dark:text-rose-400 mb-3">
          !
        </div>
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200 mb-1">
          ไม่สามารถ Generate โค้ดได้
        </h3>
        <p className="text-xs text-rose-600 dark:text-rose-400 max-w-md font-mono bg-rose-50 dark:bg-rose-950/30 p-3 rounded-lg border border-rose-200 dark:border-rose-900/50">
          {error}
        </p>
      </div>
    );
  }

  if (!generationResult) {
    return (
      <div className="flex flex-col h-full bg-white dark:bg-slate-900/70 rounded-xl border border-slate-200 dark:border-slate-800 shadow-md dark:shadow-xl overflow-hidden items-center justify-center p-8 text-center text-slate-400">
        <Layers className="w-12 h-12 mb-3 text-slate-300 dark:text-slate-700" />
        <p className="text-sm">กรอก JSON เพื่อดู Flutter Model ที่สร้างขึ้น</p>
      </div>
    );
  }

  const { code, files, classes, complianceScore } = generationResult;
  const currentFile = activeTab === 'all'
    ? null
    : files.find((f) => f.className === activeTab);

  const displayedCode = currentFile ? currentFile.content : code;
  const displayedFileName = currentFile ? currentFile.fileName : 'model.dart';
  const lineCount = displayedCode.split('\n').length;

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900/70 rounded-xl border border-slate-200 dark:border-slate-800 shadow-md dark:shadow-xl overflow-hidden transition-colors">
      {/* Viewer Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 gap-2">
        {/* Class Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 max-w-full">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1 rounded-md text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === 'all'
                ? 'bg-cyan-100 dark:bg-cyan-600/30 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-500/50 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800/80'
            }`}
          >
            All Classes ({classes.length})
          </button>

          {classes.length > 1 &&
            classes.map((c) => (
              <button
                key={c.className}
                onClick={() => setActiveTab(c.className)}
                className={`px-2.5 py-1 rounded-md text-xs font-mono whitespace-nowrap transition-all ${
                  activeTab === c.className
                    ? 'bg-cyan-100 dark:bg-cyan-600/30 text-cyan-800 dark:text-cyan-300 border border-cyan-300 dark:border-cyan-500/50 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800/80'
                }`}
              >
                {c.className}
              </button>
            ))}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 self-end sm:self-auto">
          {/* SonarQube score badge */}
          <button
            onClick={onOpenSonarModal}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-500/30 text-emerald-700 dark:text-emerald-300 text-[11px] font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors"
            title="View SonarQube Compliance Audit"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Sonar: {complianceScore}%</span>
          </button>

          {/* Copy Button */}
          <button
            onClick={() => handleCopy(displayedCode)}
            className="flex items-center gap-1 px-3 py-1 rounded-md bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-semibold shadow-md shadow-cyan-600/20 transition-all active:scale-95"
            title="Copy Dart Code"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-white" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>

          {/* Download Single File */}
          <button
            onClick={() => handleDownloadSingle(displayedFileName, displayedCode)}
            className="p-1.5 rounded-md text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors border border-slate-300 dark:border-slate-700/60"
            title={`Download ${displayedFileName}`}
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {/* Download All as ZIP */}
          {files.length > 1 && (
            <button
              onClick={() => handleDownloadZip(files)}
              className="p-1.5 rounded-md text-indigo-600 dark:text-indigo-300 hover:text-indigo-900 dark:hover:text-white hover:bg-indigo-50 dark:hover:bg-indigo-950 border border-indigo-200 dark:border-indigo-500/30 transition-colors"
              title="Download All Classes as .ZIP"
            >
              <FileArchive className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Code Container */}
      <div className="relative flex-1 overflow-auto bg-slate-50/70 dark:bg-slate-950/90 code-container min-h-[450px]">
        <div className="absolute top-2 right-4 text-[11px] font-mono text-slate-400 dark:text-slate-600 select-none">
          {lineCount} lines • Dart 3
        </div>
        <pre className="line-numbers">
          <code className="language-dart">{displayedCode}</code>
        </pre>
      </div>
    </div>
  );
};
