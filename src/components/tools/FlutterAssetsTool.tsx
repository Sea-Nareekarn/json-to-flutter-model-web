import React, { useState } from 'react';
import { Palette, Image as ImageIcon, Copy, Check } from 'lucide-react';
import { toCamelCase } from '../../generator/naming';

export const FlutterAssetsTool: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'colors' | 'assets'>('colors');

  // Colors state
  const [colorInput, setColorInput] = useState<string>(`primary: #02569B
secondary: #0175C2
accent: #13B9FD
backgroundDark: #0F172A
surfaceCard: #1E293B
textPrimary: #F8FAFC
textSecondary: #94A3B8
success: #10B981
warning: #F59E0B
error: #EF4444`);
  const [colorClassName, setColorClassName] = useState<string>('AppColors');

  // Assets state
  const [assetInput, setAssetInput] = useState<string>(`assets/images/app_logo.png
assets/images/onboarding_hero.png
assets/images/user_avatar_placeholder.png
assets/icons/ic_home.svg
assets/icons/ic_search.svg
assets/icons/ic_settings.svg
assets/icons/ic_bell.svg`);
  const [assetClassName, setAssetClassName] = useState<string>('AppAssets');

  const [copied, setCopied] = useState(false);

  // Generate Dart Colors Code
  const parsedColors: { name: string; hex: string; dartName: string; flutterColor: string }[] = [];
  const colorLines = colorInput.split('\n');
  for (const line of colorLines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('//')) continue;
    const parts = trimmed.split(/[:=]/);
    if (parts.length >= 2) {
      const rawName = parts[0].trim();
      let rawHex = parts.slice(1).join(':').trim().replace(/['";,]/g, '');
      if (rawHex.startsWith('#')) rawHex = rawHex.slice(1);
      if (rawHex.startsWith('0x') || rawHex.startsWith('0X')) rawHex = rawHex.slice(2);
      if (rawHex.length === 6) rawHex = `FF${rawHex}`;

      if (rawHex.length === 8) {
        const dartName = toCamelCase(rawName);
        parsedColors.push({
          name: rawName,
          hex: rawHex.toUpperCase(),
          dartName,
          flutterColor: `const Color(0x${rawHex.toUpperCase()})`,
        });
      }
    }
  }

  const generatedColorsCode = `import 'package:flutter/material.dart';

/// App-wide design system color tokens
abstract final class ${colorClassName} {
${parsedColors.map((c) => `  static const Color ${c.dartName} = ${c.flutterColor};`).join('\n')}
}
`;

  // Generate Dart Assets Code
  const parsedAssets: { path: string; dartName: string }[] = [];
  const assetLines = assetInput.split('\n');
  for (const line of assetLines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('//')) continue;
    const fileName = trimmed.split('/').pop() || trimmed;
    const baseName = fileName.replace(/\.[^/.]+$/, '');
    const dartName = toCamelCase(baseName);
    parsedAssets.push({
      path: trimmed,
      dartName,
    });
  }

  const generatedAssetsCode = `/// Centralized asset paths to prevent typos
abstract final class ${assetClassName} {
${parsedAssets.map((a) => `  static const String ${a.dartName} = '${a.path}';`).join('\n')}
}
`;

  const displayedCode = activeSubTab === 'colors' ? generatedColorsCode : generatedAssetsCode;

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
            <Palette className="w-5 h-5 text-cyan-400" />
            Flutter Colors &amp; Assets Generator
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            แปลง Palette สีและ Asset Paths ให้เป็น Dart Class สำเร็จรูป ปลอดภัย ไร้ Typo
          </p>
        </div>

        {/* SubTab Selector */}
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveSubTab('colors')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
              activeSubTab === 'colors'
                ? 'bg-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            AppColors
          </button>
          <button
            onClick={() => setActiveSubTab('assets')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
              activeSubTab === 'assets'
                ? 'bg-cyan-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            AppAssets
          </button>
        </div>
      </div>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Left Pane: Input */}
        <div className="flex flex-col h-full bg-slate-900/70 rounded-xl border border-slate-800 shadow-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              {activeSubTab === 'colors' ? 'Color Palette Input (key: #HEX)' : 'Asset Paths Input (1 per line)'}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Class:</span>
              <input
                type="text"
                value={activeSubTab === 'colors' ? colorClassName : assetClassName}
                onChange={(e) => {
                  if (activeSubTab === 'colors') setColorClassName(e.target.value);
                  else setAssetClassName(e.target.value);
                }}
                className="bg-slate-950 border border-slate-700/80 rounded px-2 py-0.5 text-xs text-cyan-300 font-mono focus:outline-none w-28"
              />
            </div>
          </div>

          <div className="p-3 flex-1 flex flex-col">
            <textarea
              value={activeSubTab === 'colors' ? colorInput : assetInput}
              onChange={(e) => {
                if (activeSubTab === 'colors') setColorInput(e.target.value);
                else setAssetInput(e.target.value);
              }}
              spellCheck={false}
              className="w-full flex-1 min-h-[300px] p-3 bg-slate-950/90 text-slate-200 font-mono text-xs leading-relaxed resize-none rounded-lg border border-slate-800 focus:outline-none focus:ring-1 focus:ring-cyan-500/40"
            />

            {/* Live Color Swatches for Color Mode */}
            {activeSubTab === 'colors' && parsedColors.length > 0 && (
              <div className="mt-3 p-3 bg-slate-950/60 rounded-lg border border-slate-800">
                <span className="text-[11px] font-semibold text-slate-400 block mb-2">
                  Live Color Previews ({parsedColors.length}):
                </span>
                <div className="flex flex-wrap gap-2">
                  {parsedColors.map((c) => {
                    const cssHex = `#${c.hex.slice(2)}`;
                    return (
                      <div
                        key={c.dartName}
                        className="flex items-center gap-1.5 px-2 py-1 bg-slate-900 rounded-md border border-slate-800 text-[11px] font-mono text-slate-300 shadow-sm"
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-inner"
                          style={{ backgroundColor: cssHex }}
                        />
                        <span>{c.dartName}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Pane: Dart Code Viewer */}
        <div className="flex flex-col h-full bg-slate-900/70 rounded-xl border border-slate-800 shadow-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Generated Dart Code
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-md text-xs font-semibold shadow transition-all active:scale-95"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>

          <div className="p-4 flex-1 bg-slate-950/90 font-mono text-xs text-slate-200 overflow-auto min-h-[350px]">
            <pre className="whitespace-pre">{displayedCode}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
