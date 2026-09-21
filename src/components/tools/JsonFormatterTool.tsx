import React, { useState } from 'react';
import { Minimize2, ArrowDownAZ, Copy, Check, Download, Trash2, AlertCircle, FileCode2 } from 'lucide-react';

export const JsonFormatterTool: React.FC = () => {
  const [input, setInput] = useState<string>(`{
  "project": "DevTools Hub",
  "version": "1.0.0",
  "author": {
    "name": "Nareekarn",
    "role": "Flutter Architect"
  },
  "tags": ["flutter", "dart", "clean-code", "sonarqube"],
  "features": {
    "zero_deps": true,
    "rating": 5.0
  }
}`);
  const [indentSize, setIndentSize] = useState<number>(2);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatJson = (space: number) => {
    try {
      setError(null);
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed, null, space));
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message);
    }
  };

  const minifyJson = () => {
    try {
      setError(null);
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed));
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message);
    }
  };

  const sortKeysRecursively = (obj: unknown): unknown => {
    if (Array.isArray(obj)) {
      return obj.map(sortKeysRecursively);
    } else if (obj !== null && typeof obj === 'object') {
      const sorted: Record<string, unknown> = {};
      const keys = Object.keys(obj as Record<string, unknown>).sort();
      for (const key of keys) {
        sorted[key] = sortKeysRecursively((obj as Record<string, unknown>)[key]);
      }
      return sorted;
    }
    return obj;
  };

  const sortJsonKeys = () => {
    try {
      setError(null);
      const parsed = JSON.parse(input);
      const sorted = sortKeysRecursively(parsed);
      setInput(JSON.stringify(sorted, null, indentSize));
    } catch (err: unknown) {
      const e = err as Error;
      setError(e.message);
    }
  };

  const handleCopy = async () => {
    if (!input) return;
    await navigator.clipboard.writeText(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([input], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Compute stats
  let keyCount = 0;
  let isValid = false;
  try {
    const p = JSON.parse(input);
    isValid = true;
    const countKeys = (o: unknown) => {
      if (typeof o === 'object' && o !== null) {
        if (Array.isArray(o)) {
          o.forEach(countKeys);
        } else {
          keyCount += Object.keys(o).length;
          Object.values(o).forEach(countKeys);
        }
      }
    };
    countKeys(p);
  } catch {
    isValid = false;
  }

  const lineCount = input ? input.split('\n').length : 0;
  const byteCount = new Blob([input]).size;

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white dark:bg-slate-900/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-sm dark:shadow-xl transition-colors duration-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-600 dark:text-indigo-400">
              <FileCode2 className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              JSON Formatter &amp; Validator
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30">
                Fast &amp; Offline
              </span>
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            จัดรูปแบบให้สวยงาม ตรวจสอบความถูกต้อง เรียง Keys และคำนวณสถิติ
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <button
              onClick={() => { setIndentSize(2); formatJson(2); }}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                indentSize === 2
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              2 Spaces
            </button>
            <button
              onClick={() => { setIndentSize(4); formatJson(4); }}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                indentSize === 4
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              4 Spaces
            </button>
          </div>

          <button
            onClick={sortJsonKeys}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 transition-colors"
            title="Sort Object Keys Alphabetically"
          >
            <ArrowDownAZ className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
            <span>Sort Keys</span>
          </button>

          <button
            onClick={minifyJson}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold border border-slate-300 dark:border-slate-700 transition-colors"
            title="Minify JSON (Remove Whitespace)"
          >
            <Minimize2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>Minify</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition-all active:scale-95"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl border border-slate-300 dark:border-slate-700 transition-colors"
            title="Download formatted.json"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={() => setInput('')}
            className="p-2 bg-slate-100 hover:bg-rose-50 dark:bg-slate-800 dark:hover:bg-rose-950/60 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 rounded-xl border border-slate-300 dark:border-slate-700 transition-colors"
            title="Clear"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor & Metrics */}
      <div className="bg-white dark:bg-slate-900/70 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl overflow-hidden flex flex-col transition-colors">
        {/* Top Status Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className={`flex items-center gap-1.5 font-bold ${isValid ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
              <span className={`w-2 h-2 rounded-full ${isValid ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              {isValid ? 'Valid JSON' : 'Invalid JSON'}
            </span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="text-slate-600 dark:text-slate-400">{lineCount} lines</span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="text-slate-600 dark:text-slate-400">{keyCount} total keys</span>
            <span className="text-slate-300 dark:text-slate-700">|</span>
            <span className="text-slate-600 dark:text-slate-400">{(byteCount / 1024).toFixed(2)} KB</span>
          </div>
        </div>

        {/* Text Area */}
        <div className="relative min-h-[500px] p-3 bg-slate-50/50 dark:bg-slate-950/50">
          <textarea
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              try {
                JSON.parse(e.target.value);
                setError(null);
              } catch (err: unknown) {
                const errorObj = err as Error;
                setError(errorObj.message);
              }
            }}
            placeholder="วาง JSON ที่ต้องการจัดรูปแบบที่นี่..."
            spellCheck={false}
            className="w-full h-full min-h-[500px] p-4 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-mono text-xs sm:text-sm leading-relaxed resize-y rounded-xl border border-slate-200 dark:border-slate-800/80 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 shadow-xs"
          />

          {error && (
            <div className="absolute bottom-6 left-6 right-6 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/90 border border-rose-300 dark:border-rose-600/60 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-2.5 shadow-xl backdrop-blur-sm">
              <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-rose-700 dark:text-rose-300">JSON Syntax Error</div>
                <div className="font-mono text-[11px] text-rose-600 dark:text-rose-200/90 mt-0.5">
                  {error}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
