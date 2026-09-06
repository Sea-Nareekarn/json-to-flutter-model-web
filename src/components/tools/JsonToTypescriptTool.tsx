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
  const [outputMode, setOutputMode] = useState<'interface' | 'type' | 'zod'>('interface');
  const [useOptional, setUseOptional] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  // Parse JSON to TypeScript / Zod
  const generatedCode = useMemo(() => {
    if (!jsonInput.trim()) return '// กรุณากรอก JSON';

    try {
      const parsed = JSON.parse(jsonInput);
      const rootPascal = toPascalCase(rootName || 'RootObject');
      const interfaces: { name: string; content: string; zodContent: string }[] = [];

      const inferType = (val: unknown, keyName: string): { tsType: string; zodType: string } => {
        if (val === null || val === undefined) {
          return { tsType: 'unknown', zodType: 'z.unknown()' };
        }
        if (typeof val === 'boolean') {
          return { tsType: 'boolean', zodType: 'z.boolean()' };
        }
        if (typeof val === 'number') {
          return { tsType: 'number', zodType: 'z.number()' };
        }
        if (typeof val === 'string') {
          return { tsType: 'string', zodType: 'z.string()' };
        }
        if (Array.isArray(val)) {
          if (val.length === 0) {
            return { tsType: 'unknown[]', zodType: 'z.array(z.unknown())' };
          }
          const itemType = inferType(val[0], `${keyName}Item`);
          return {
            tsType: `${itemType.tsType}[]`,
            zodType: `z.array(${itemType.zodType})`,
          };
        }
        if (typeof val === 'object') {
          const subName = toPascalCase(keyName);
          generateSubObject(val as Record<string, unknown>, subName);
          return {
            tsType: subName,
            zodType: `${subName}Schema`,
          };
        }
        return { tsType: 'unknown', zodType: 'z.unknown()' };
      };

      const generateSubObject = (obj: Record<string, unknown>, className: string) => {
        const tsLines: string[] = [];
        const zodLines: string[] = [];

        for (const [k, v] of Object.entries(obj)) {
          const propName = toCamelCase(k);
          const typeInfo = inferType(v, `${className}${toPascalCase(k)}`);
          const opt = useOptional ? '?' : '';
          const zodOpt = useOptional ? '.optional()' : '';

          tsLines.push(`  ${propName}${opt}: ${typeInfo.tsType};`);
          zodLines.push(`  ${propName}: ${typeInfo.zodType}${zodOpt},`);
        }

        interfaces.unshift({
          name: className,
          content: tsLines.join('\n'),
          zodContent: zodLines.join('\n'),
        });
      };

      if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
        generateSubObject(parsed as Record<string, unknown>, rootPascal);
      } else {
        return `export type ${rootPascal} = ${typeof parsed};`;
      }

      if (outputMode === 'zod') {
        const zodBlocks: string[] = ["import { z } from 'zod';\n"];
        for (const item of interfaces) {
          zodBlocks.push(
            `export const ${item.name}Schema = z.object({\n${item.zodContent}\n});\n\nexport type ${item.name} = z.infer<typeof ${item.name}Schema>;`
          );
        }
        return zodBlocks.join('\n\n');
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
  }, [jsonInput, rootName, outputMode, useOptional]);

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
      <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <Code2 className="w-5 h-5 text-violet-400" />
            JSON to TypeScript &amp; Zod Schema (Next.js)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            สร้าง Type-Safe Interfaces และ Zod Schema สำหรับ Next.js App Router, Server Actions &amp; API Routes
          </p>
        </div>

        {/* Action Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Mode Selector */}
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setOutputMode('interface')}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                outputMode === 'interface'
                  ? 'bg-violet-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Interface
            </button>
            <button
              onClick={() => setOutputMode('type')}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                outputMode === 'type'
                  ? 'bg-violet-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Type
            </button>
            <button
              onClick={() => setOutputMode('zod')}
              className={`px-3 py-1 rounded-md font-semibold transition-all ${
                outputMode === 'zod'
                  ? 'bg-violet-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Zod Schema validation for Next.js"
            >
              Zod Schema
            </button>
          </div>

          <label className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={useOptional}
              onChange={(e) => setUseOptional(e.target.checked)}
              className="rounded border-slate-700 bg-slate-950 text-violet-500"
            />
            <span>Optional (?)</span>
          </label>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-lg text-xs font-semibold shadow transition-all active:scale-95"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-colors"
            title="Download .ts file"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Dual-Pane */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Left Pane: JSON */}
        <div className="flex flex-col h-full bg-slate-900/70 rounded-xl border border-slate-800 shadow-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              JSON Input
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Root Name:</span>
              <input
                type="text"
                value={rootName}
                onChange={(e) => setRootName(e.target.value)}
                className="bg-slate-950 border border-slate-700/80 rounded px-2 py-0.5 text-xs text-violet-300 font-mono focus:outline-none w-32"
              />
            </div>
          </div>
          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            spellCheck={false}
            className="w-full flex-1 min-h-[450px] p-4 bg-slate-950/90 text-slate-200 font-mono text-xs sm:text-sm leading-relaxed resize-none focus:outline-none focus:ring-1 focus:ring-violet-500/40"
          />
        </div>

        {/* Right Pane: TypeScript / Zod */}
        <div className="flex flex-col h-full bg-slate-900/70 rounded-xl border border-slate-800 shadow-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              {outputMode === 'zod' ? 'Zod Schema (TypeScript)' : 'TypeScript Definitions'}
            </span>
            <span className="text-[11px] font-mono text-violet-400">
              Next.js 14/15 Ready
            </span>
          </div>
          <div className="p-4 flex-1 bg-slate-950/90 font-mono text-xs text-slate-200 overflow-auto min-h-[450px]">
            <pre className="whitespace-pre text-violet-200">{generatedCode}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
