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
      <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <FileCode2 className="w-5 h-5 text-indigo-400" />
            JSON Formatter &amp; Validator
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            จัดรูปแบบให้สวยงาม ตรวจสอบความถูกต้อง เรียง Keys และคำนวณสถิติ
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => { setIndentSize(2); formatJson(2); }}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                indentSize === 2 ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              2 Spaces
            </button>
            <button
              onClick={() => { setIndentSize(4); formatJson(4); }}
              className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                indentSize === 4 ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              4 Spaces
            </button>
          </div>

          <button
            onClick={sortJsonKeys}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition-colors"
            title="Sort Object Keys Alphabetically"
          >
            <ArrowDownAZ className="w-3.5 h-3.5 text-cyan-400" />
            <span>Sort Keys</span>
          </button>

          <button
            onClick={minifyJson}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition-colors"
            title="Minify JSON (Remove Whitespace)"
          >
            <Minimize2 className="w-3.5 h-3.5 text-amber-400" />
            <span>Minify</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow transition-all active:scale-95"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors"
            title="Download formatted.json"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={() => setInput('')}
            className="p-1.5 bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 rounded-lg border border-slate-700 transition-colors"
            title="Clear"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor & Metrics */}
      <div className="bg-slate-900/70 rounded-xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
        {/* Top Status Bar */}
        <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className={`flex items-center gap-1.5 font-bold ${isValid ? 'text-emerald-400' : 'text-rose-400'}`}>
              <span className={`w-2 h-2 rounded-full ${isValid ? 'bg-emerald-400' : 'bg-rose-400'}`} />
              {isValid ? 'Valid JSON' : 'Invalid JSON'}
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">{lineCount} lines</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">{keyCount} total keys</span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">{(byteCount / 1024).toFixed(2)} KB</span>
          </div>
        </div>

        {/* Text Area */}
        <div className="relative min-h-[500px]">
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
            className="w-full h-full min-h-[500px] p-4 bg-slate-950/90 text-slate-200 font-mono text-xs sm:text-sm leading-relaxed resize-y focus:outline-none focus:ring-1 focus:ring-indigo-500/50"
          />

          {error && (
            <div className="absolute bottom-3 left-3 right-3 p-3 rounded-lg bg-rose-950/90 border border-rose-600/60 text-rose-200 text-xs flex items-start gap-2 shadow-2xl backdrop-blur-sm">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <div className="font-semibold text-rose-300">JSON Syntax Error</div>
                <div className="font-mono text-[11px] text-rose-200/90 mt-0.5">
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
