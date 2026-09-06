import React, { useRef } from 'react';
import { AlignLeft, Minimize2, Trash2, Copy, Check, Upload, AlertCircle, FileCode } from 'lucide-react';

interface JsonEditorProps {
  value: string;
  onChange: (val: string) => void;
  error: string | null;
}

export const JsonEditor: React.FC<JsonEditorProps> = ({
  value,
  onChange,
  error,
}) => {
  const [copied, setCopied] = React.useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBeautify = () => {
    try {
      const parsed = JSON.parse(value);
      onChange(JSON.stringify(parsed, null, 2));
    } catch {
      // Keep as is if invalid
    }
  };

  const handleMinify = () => {
    try {
      const parsed = JSON.parse(value);
      onChange(JSON.stringify(parsed));
    } catch {
      // Keep as is if invalid
    }
  };

  const handleClear = () => {
    onChange('');
  };

  const handleCopy = async () => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      if (text) {
        onChange(text);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const lineCount = value ? value.split('\n').length : 0;
  const byteCount = new Blob([value]).size;

  return (
    <div className="flex flex-col h-full bg-slate-900/70 rounded-xl border border-slate-800 shadow-xl overflow-hidden">
      {/* Editor Header Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <FileCode className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            JSON Input
          </span>
          <span className="text-[11px] text-slate-500 font-mono">
            ({lineCount} lines • {(byteCount / 1024).toFixed(1)} KB)
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".json,application/json"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-1.5 rounded-md text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
            title="Upload JSON File"
          >
            <Upload className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleBeautify}
            className="flex items-center gap-1 px-2 py-1 rounded-md text-xs text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
            title="Beautify / Format JSON"
          >
            <AlignLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px]">Format</span>
          </button>
          <button
            onClick={handleMinify}
            className="p-1.5 rounded-md text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors"
            title="Minify JSON"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleCopy}
            disabled={!value}
            className="p-1.5 rounded-md text-slate-400 hover:text-cyan-300 hover:bg-slate-800 transition-colors disabled:opacity-40"
            title="Copy JSON"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleClear}
            disabled={!value}
            className="p-1.5 rounded-md text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors disabled:opacity-40"
            title="Clear JSON"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Editor Body */}
      <div className="relative flex-1 min-h-[450px]">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={`วาง JSON ของคุณที่นี่ หรือเลือก Preset ด้านบน...\n\n{\n  "user_id": 101,\n  "full_name": "Somchai Prasert",\n  "is_active": true\n}`}
          spellCheck={false}
          className="w-full h-full p-4 bg-slate-950/90 text-slate-200 font-mono text-xs sm:text-sm leading-relaxed resize-none focus:outline-none focus:ring-1 focus:ring-cyan-500/30 selection:bg-cyan-500/30"
        />

        {/* JSON Syntax Error Overlay Banner */}
        {error && (
          <div className="absolute bottom-3 left-3 right-3 p-3 rounded-lg bg-rose-950/90 border border-rose-600/60 text-rose-200 text-xs flex items-start gap-2 shadow-2xl backdrop-blur-sm animate-pulse-subtle">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <div className="font-semibold text-rose-300">Invalid JSON Syntax</div>
              <div className="font-mono text-[11px] text-rose-200/90 mt-0.5 line-clamp-2">
                {error}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
