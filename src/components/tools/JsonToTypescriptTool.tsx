import React, { useState, useMemo } from 'react';
import { Code2, Copy, Check, Download } from 'lucide-react';
import { toPascalCase, toCamelCase } from '../../generator/naming';

export const JsonToTypescriptTool: React.FC = () => {
  const [jsonInput, setJsonInput] = useState<string>(`{
  "id": "usr_99812",
  "username": "nareekarn",
  "email": "nareekarn@example.com",
  "isActive": true,
  "role": "ADMIN",
  "profile": {
    "firstName": "Somchai",
    "lastName": "Prasert",
    "age": 28,
    "avatarUrl": "https://example.com/avatar.png"
  },
  "tags": ["developer", "flutter", "nextjs"],
  "stats": {
    "loginCount": 142,
    "lastActive": "2026-09-06T08:00:00Z"
  }
}`);
  const [rootName, setRootName] = useState<string>('UserResponse');
  const [outputMode, setOutputMode] = useState<'interface' | 'type'>('interface');
  const [useOptional, setUseOptional] = useState<boolean>(false);
  const [useReadonly, setUseReadonly] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Parse JSON to TypeScript Interfaces & Types
  const generatedCode = useMemo(() => {
    if (!jsonInput.trim()) return '// กรุณากรอก JSON';

    try {
      const parsed = JSON.parse(jsonInput);
      const rootPascal = toPascalCase(rootName || 'RootObject');
      const interfaces: { name: string; content: string }[] = [];

      const inferType = (val: unknown, keyName: string): string => {
        if (val === null || val === undefined) {
          return 'unknown';
        }
        if (typeof val === 'boolean') {
          return 'boolean';
        }
        if (typeof val === 'number') {
          return 'number';
        }
        if (typeof val === 'string') {
          return 'string';
        }
        if (Array.isArray(val)) {
          if (val.length === 0) {
            return 'unknown[]';
          }
          const itemType = inferType(val[0], `${keyName}Item`);
          return `${itemType}[]`;
        }
        if (typeof val === 'object') {
          const subName = toPascalCase(keyName);
          generateSubObject(val as Record<string, unknown>, subName);
          return subName;
        }
        return 'unknown';
      };

      const generateSubObject = (obj: Record<string, unknown>, className: string) => {
        const tsLines: string[] = [];

        for (const [k, v] of Object.entries(obj)) {
          const propName = toCamelCase(k);
          const typeStr = inferType(v, `${className}${toPascalCase(k)}`);
          const opt = useOptional ? '?' : '';
          const ro = useReadonly ? 'readonly ' : '';

          tsLines.push(`  ${ro}${propName}${opt}: ${typeStr};`);
        }

        interfaces.unshift({
          name: className,
          content: tsLines.join('\n'),
        });
      };

      if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
        generateSubObject(parsed as Record<string, unknown>, rootPascal);
      } else {
        return `export type ${rootPascal} = ${typeof parsed};`;
      }

      if (outputMode === 'type') {
        return interfaces
          .map((item) => `export type ${item.name} = {\n${item.content}\n};`)
          .join('\n\n');
      }

      // Default: interface
      return interfaces
        .map((item) => `export interface ${item.name} {\n${item.content}\n}`)
        .join('\n\n');
    } catch (err: unknown) {
      const e = err as Error;
      return `// JSON Syntax Error: ${e.message}`;
    }
  }, [jsonInput, rootName, outputMode, useOptional, useReadonly]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(generatedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedCode], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${rootName || 'types'}.ts`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-white dark:bg-slate-900/80 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-sm dark:shadow-xl transition-colors duration-200">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 text-violet-600 dark:text-violet-400">
              <Code2 className="w-5 h-5" />
            </span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              JSON to TypeScript Interfaces &amp; Types
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-violet-50 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300 border border-violet-200 dark:border-violet-500/30">
                Next.js 14/15 Ready
              </span>
            </h2>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400">
            สร้าง Type-Safe Interfaces และ Types สำหรับ Next.js App Router, React, Server Actions &amp; Web API
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* Mode Selector */}
          <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
            <button
              onClick={() => setOutputMode('interface')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                outputMode === 'interface'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Interface
            </button>
            <button
              onClick={() => setOutputMode('type')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                outputMode === 'type'
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              Type
            </button>
          </div>

          <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
            <input
              type="checkbox"
              checked={useOptional}
              onChange={(e) => setUseOptional(e.target.checked)}
              className="rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-violet-600 focus:ring-0 w-3.5 h-3.5"
            />
            <span>Optional (?)</span>
          </label>

          <label className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors">
            <input
              type="checkbox"
              checked={useReadonly}
              onChange={(e) => setUseReadonly(e.target.checked)}
              className="rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-violet-600 focus:ring-0 w-3.5 h-3.5"
            />
            <span>Readonly</span>
          </label>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-violet-600 hover:bg-violet-500 text-white rounded-xl text-xs font-bold shadow-md shadow-violet-600/20 transition-all active:scale-95"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl border border-slate-300 dark:border-slate-700 transition-colors"
            title="Download .ts file"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Dual-Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Left Pane: JSON */}
        <div className="flex flex-col h-full bg-white dark:bg-slate-900/70 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl overflow-hidden transition-colors">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              JSON Input
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Root Name:</span>
              <input
                type="text"
                value={rootName}
                onChange={(e) => setRootName(e.target.value)}
                className="bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1 text-xs text-violet-600 dark:text-violet-300 font-mono font-bold focus:outline-none w-36 shadow-xs"
              />
            </div>
          </div>
          <div className="p-3 flex-1 flex flex-col bg-slate-50/50 dark:bg-slate-950/50">
            <textarea
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              spellCheck={false}
              rows={18}
              className="w-full flex-1 min-h-[480px] p-3.5 bg-white dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-mono text-xs sm:text-sm leading-relaxed resize-none rounded-xl border border-slate-200 dark:border-slate-800/80 focus:outline-none focus:ring-1 focus:ring-violet-500/40 shadow-xs"
            />
          </div>
        </div>

        {/* Right Pane: TypeScript */}
        <div className="flex flex-col h-full bg-white dark:bg-slate-900/70 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl overflow-hidden transition-colors">
          <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              TypeScript Definitions ({outputMode === 'interface' ? 'Interfaces' : 'Type Aliases'})
            </span>
            <span className="text-[11px] font-mono text-violet-600 dark:text-violet-400 font-bold">
              Strict Mode Ready
            </span>
          </div>
          <div className="p-3 flex-1 flex flex-col bg-slate-50/50 dark:bg-slate-950/50">
            <pre className="p-4 flex-1 bg-slate-900 dark:bg-slate-950 font-mono text-xs sm:text-sm text-violet-200 dark:text-violet-300 overflow-auto min-h-[480px] rounded-xl border border-slate-800/80 leading-relaxed shadow-sm">
              {generatedCode}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
