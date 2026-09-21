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

/// Clean static color tokens for Flutter
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

    // Extract filename without extension for dart property name
    const filename = trimmed.split('/').pop() || trimmed;
    const nameWithoutExt = filename.split('.').slice(0, -1).join('.') || filename;
    const dartName = toCamelCase(nameWithoutExt);

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
      <div className="bg-white dark:bg-slate-900/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm dark:shadow-xl transition-colors duration-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20 text-cyan-600 dark:text-cyan-400">
              <Palette className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              Flutter Colors &amp; Assets Generator
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-50 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-500/30">
                Flutter Clean Code
              </span>
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            แปลง Palette สีและ Asset Paths ให้เป็น Dart Class สำเร็จรูป ปลอดภัย ไร้ Typo
          </p>
        </div>

        {/* SubTab Selector */}
        <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs shrink-0">
          <button
            onClick={() => setActiveSubTab('colors')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeSubTab === 'colors'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            AppColors
          </button>
          <button
            onClick={() => setActiveSubTab('assets')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-semibold transition-all ${
              activeSubTab === 'assets'
                ? 'bg-cyan-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
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
        <div className="flex flex-col h-full bg-white dark:bg-slate-900/70 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl overflow-hidden transition-colors">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              {activeSubTab === 'colors' ? 'Color Palette Input (key: #HEX)' : 'Asset Paths Input (1 per line)'}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Class:</span>
              <input
                type="text"
                value={activeSubTab === 'colors' ? colorClassName : assetClassName}
                onChange={(e) => {
                  if (activeSubTab === 'colors') setColorClassName(e.target.value);
                  else setAssetClassName(e.target.value);
                }}
                className="bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs text-cyan-600 dark:text-cyan-300 font-mono font-bold focus:outline-none w-32 shadow-xs"
              />
            </div>
          </div>

          <div className="p-3 flex-1 flex flex-col bg-slate-50/50 dark:bg-slate-950/50">
            <textarea
              value={activeSubTab === 'colors' ? colorInput : assetInput}
              onChange={(e) => {
                if (activeSubTab === 'colors') setColorInput(e.target.value);
                else setAssetInput(e.target.value);
              }}
              spellCheck={false}
              rows={12}
              className="w-full flex-1 min-h-[300px] p-3.5 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-mono text-xs sm:text-sm leading-relaxed resize-none rounded-xl border border-slate-200 dark:border-slate-800/80 focus:outline-none focus:ring-1 focus:ring-cyan-500/40 shadow-xs"
            />

            {/* Live Color Swatches for Color Mode */}
            {activeSubTab === 'colors' && parsedColors.length > 0 && (
              <div className="mt-3 p-3.5 bg-white dark:bg-slate-950/60 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block mb-2">
                  Live Color Previews ({parsedColors.length}):
                </span>
                <div className="flex flex-wrap gap-2">
                  {parsedColors.map((c) => {
                    const cssHex = `#${c.hex.slice(2)}`;
                    return (
                      <div
                        key={c.dartName}
                        className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-700 dark:text-slate-300 shadow-xs"
                      >
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-white/20 shadow-inner shrink-0"
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
        <div className="flex flex-col h-full bg-white dark:bg-slate-900/70 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl overflow-hidden transition-colors">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Generated Dart Code
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-bold shadow-md shadow-cyan-600/20 transition-all active:scale-95"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>

          <div className="p-3 flex-1 flex flex-col bg-slate-50/50 dark:bg-slate-950/50">
            <pre className="p-4 flex-1 bg-slate-900 dark:bg-slate-950 font-mono text-xs sm:text-sm text-cyan-200 dark:text-cyan-300 overflow-auto min-h-[350px] rounded-xl border border-slate-800/80 leading-relaxed shadow-sm">
              {displayedCode}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
