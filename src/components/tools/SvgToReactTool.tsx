import React, { useState } from 'react';
import { FileCode2, Copy, Check } from 'lucide-react';
import { toPascalCase } from '../../generator/naming';

export const SvgToReactTool: React.FC = () => {
  const [svgInput, setSvgInput] = useState<string>(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
</svg>`);
  const [componentName, setComponentName] = useState<string>('DollarSignIcon');
  const [useCurrentColor, setUseCurrentColor] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  // Convert SVG to React TSX
  const convertSvgToReact = (svg: string, name: string): string => {
    if (!svg.trim()) return '// กรุณากรอกโค้ด SVG';

    let cleaned = svg
      .replace(/class=/g, 'className=')
      .replace(/stroke-width=/g, 'strokeWidth=')
      .replace(/stroke-linecap=/g, 'strokeLinecap=')
      .replace(/stroke-linejoin=/g, 'strokeLinejoin=')
      .replace(/fill-rule=/g, 'fillRule=')
      .replace(/clip-rule=/g, 'clipRule=')
      .replace(/clip-path=/g, 'clipPath=')
      .replace(/stop-color=/g, 'stopColor=')
      .replace(/stop-opacity=/g, 'stopOpacity=')
      .replace(/font-size=/g, 'fontSize=')
      .replace(/font-family=/g, 'fontFamily=')
      .replace(/text-anchor=/g, 'textAnchor=');

    if (useCurrentColor) {
      cleaned = cleaned
        .replace(/stroke="#[a-fA-F0-9]{3,6}"/g, 'stroke="currentColor"')
        .replace(/fill="#[a-fA-F0-9]{3,6}"/g, 'fill="currentColor"');
    }

    // Add {...props} to <svg
    cleaned = cleaned.replace(/<svg\b([^>]*)>/i, '<svg $1 {...props}>');

    const pascal = toPascalCase(name || 'CustomIcon');

    return `import React from 'react';

export interface ${pascal}Props extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
}

export const ${pascal}: React.FC<${pascal}Props> = ({
  size = 24,
  width,
  height,
  ...props
}) => {
  return (
    ${cleaned
      .replace(/width="[0-9]+"/, 'width={width ?? size}')
      .replace(/height="[0-9]+"/, 'height={height ?? size}')}
  );
};

export default ${pascal};
`;
  };

  const generatedCode = convertSvgToReact(svgInput, componentName);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <FileCode2 className="w-5 h-5 text-indigo-400" />
            SVG to React &amp; Next.js Component (TSX)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            แปลงไฟล์ SVG ดิบเป็น React/Next.js Component พร้อม TypeScript Props และ dynamic currentColor
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={useCurrentColor}
              onChange={(e) => setUseCurrentColor(e.target.checked)}
              className="rounded border-slate-700 bg-slate-950 text-indigo-500"
            />
            <span>Use currentColor</span>
          </label>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow transition-all active:scale-95"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy TSX'}</span>
          </button>
        </div>
      </div>

      {/* Main Dual-Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Left: SVG Input */}
        <div className="flex flex-col h-full bg-slate-900/70 rounded-xl border border-slate-800 shadow-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Raw SVG Input
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Component Name:</span>
              <input
                type="text"
                value={componentName}
                onChange={(e) => setComponentName(e.target.value)}
                className="bg-slate-950 border border-slate-700/80 rounded px-2 py-0.5 text-xs text-indigo-300 font-mono focus:outline-none w-36"
              />
            </div>
          </div>
          <textarea
            value={svgInput}
            onChange={(e) => setSvgInput(e.target.value)}
            spellCheck={false}
            className="w-full flex-1 min-h-[400px] p-4 bg-slate-950/90 text-slate-200 font-mono text-xs leading-relaxed resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500/40"
          />
        </div>

        {/* Right: React Component Output */}
        <div className="flex flex-col h-full bg-slate-900/70 rounded-xl border border-slate-800 shadow-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              React Next.js Component (TSX)
            </span>
          </div>
          <div className="p-4 flex-1 bg-slate-950/90 font-mono text-xs text-slate-200 overflow-auto min-h-[400px]">
            <pre className="whitespace-pre text-indigo-200">{generatedCode}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
