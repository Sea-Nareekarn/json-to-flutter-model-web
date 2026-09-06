import React, { useState } from 'react';
import { Brush, Copy, Check } from 'lucide-react';
import { toCamelCase } from '../../generator/naming';

export const NextjsTailwindTool: React.FC = () => {
  const [colorInput, setColorInput] = useState<string>(`primary: #3B82F6
primaryDark: #1D4ED8
secondary: #06B6D4
accent: #8B5CF6
background: #020617
surface: #0F172A
card: #1E293B
border: #334155
foreground: #F8FAFC
muted: #94A3B8
success: #10B981
warning: #F59E0B
destructive: #EF4444`);

  const [activeTab, setActiveTab] = useState<'tailwind' | 'css'>('tailwind');
  const [copied, setCopied] = useState<boolean>(false);

  // Parse color tokens
  const parsedColors: { name: string; hex: string; varName: string }[] = [];
  const lines = colorInput.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('//')) continue;
    const parts = trimmed.split(/[:=]/);
    if (parts.length >= 2) {
      const name = toCamelCase(parts[0].trim());
      let hex = parts.slice(1).join(':').trim().replace(/['";,]/g, '');
      if (!hex.startsWith('#') && (hex.length === 6 || hex.length === 3)) {
        hex = `#${hex}`;
      }
      const varName = parts[0].trim().replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
      parsedColors.push({ name, hex, varName });
    }
  }

  // Generate Tailwind config code
  const tailwindConfig = `// tailwind.config.ts (Next.js App Router)
import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
${parsedColors.map((c) => `        '${c.name}': '${c.hex}',`).join('\n')}
      },
    },
  },
  plugins: [],
};
export default config;
`;

  // Generate CSS Variables for globals.css
  const cssVariables = `/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
${parsedColors.map((c) => `  --${c.varName}: ${c.hex};`).join('\n')}
}

.dark {
${parsedColors.map((c) => `  --${c.varName}: ${c.hex};`).join('\n')}
}
`;

  const displayedCode = activeTab === 'tailwind' ? tailwindConfig : cssVariables;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(displayedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Brush className="w-5 h-5 text-cyan-400" />
            Tailwind CSS &amp; Next.js Theme Generator
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            แปลง Color Tokens เป็น `tailwind.config.ts` และ CSS Variables สำหรับ Next.js 14/15
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('tailwind')}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                activeTab === 'tailwind' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              tailwind.config.ts
            </button>
            <button
              onClick={() => setActiveTab('css')}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                activeTab === 'css' ? 'bg-cyan-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              globals.css (:root)
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold shadow transition-all active:scale-95"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Main Dual-Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Left: Input */}
        <div className="flex flex-col h-full bg-slate-900/70 rounded-xl border border-slate-800 shadow-xl overflow-hidden p-4 space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Color Palette Input (key: #HEX)
          </span>
          <textarea
            value={colorInput}
            onChange={(e) => setColorInput(e.target.value)}
            spellCheck={false}
            className="w-full flex-1 min-h-[300px] p-3 bg-slate-950/90 text-slate-200 font-mono text-xs rounded-lg border border-slate-800 focus:outline-none focus:ring-1 focus:ring-cyan-500/40"
          />

          {/* Color Preview Swatches */}
          {parsedColors.length > 0 && (
            <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                Color Swatches ({parsedColors.length}):
              </span>
              <div className="flex flex-wrap gap-2">
                {parsedColors.map((c) => (
                  <div
                    key={c.name}
                    className="flex items-center gap-1.5 px-2 py-1 bg-slate-900 rounded-md border border-slate-800 text-[11px] font-mono text-slate-300"
                  >
                    <span
                      className="w-3.5 h-3.5 rounded-full border border-white/20"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Output */}
        <div className="flex flex-col h-full bg-slate-900/70 rounded-xl border border-slate-800 shadow-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Generated {activeTab === 'tailwind' ? 'Tailwind Config' : 'CSS Variables'}
            </span>
          </div>
          <div className="p-4 flex-1 bg-slate-950/90 font-mono text-xs text-slate-200 overflow-auto min-h-[450px]">
            <pre className="whitespace-pre text-cyan-200">{displayedCode}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
