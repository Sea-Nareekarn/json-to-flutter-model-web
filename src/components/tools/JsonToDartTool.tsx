import React, { useState, useMemo } from 'react';
import { SAMPLE_PRESETS, SamplePreset } from '../../constants/sampleJson';
import { GeneratorOptions } from '../../types';
import { generateFlutterModel } from '../../generator';
import { OptionsBar } from '../OptionsBar';
import { JsonEditor } from '../JsonEditor';
import { DartViewer } from '../DartViewer';
import { SonarModal } from '../SonarModal';
import { ShieldCheck, Sparkles, Terminal, Layers } from 'lucide-react';

export const JsonToDartTool: React.FC = () => {
  const [jsonInput, setJsonInput] = useState<string>(SAMPLE_PRESETS[0].json);
  const [options, setOptions] = useState<GeneratorOptions>({
    rootClassName: SAMPLE_PRESETS[0].defaultClassName,
    style: 'pure_dart',
    nullability: 'smart',
    generateCopyWith: true,
    generateToString: true,
    generateEquality: true,
    generateToJson: true,
    generateComments: true,
    useImmutableAnnotation: true,
    safeNumberParsing: true,
    useExplicitToJson: true,
    separateFiles: false,
  });

  const [isSonarModalOpen, setIsSonarModalOpen] = useState(false);

  // Generate model reactively
  const { result, error, jsonError } = useMemo(() => {
    if (!jsonInput.trim()) {
      return { result: null, error: null, jsonError: null };
    }

    try {
      JSON.parse(jsonInput);
    } catch (err: unknown) {
      const e = err as Error;
      return { result: null, error: null, jsonError: e.message };
    }

    try {
      const genResult = generateFlutterModel(jsonInput, options);
      return { result: genResult, error: null, jsonError: null };
    } catch (err: unknown) {
      const e = err as Error;
      return { result: null, error: e.message, jsonError: null };
    }
  }, [jsonInput, options]);

  const handleSelectPreset = (preset: SamplePreset) => {
    setJsonInput(preset.json);
    setOptions((prev) => ({
      ...prev,
      rootClassName: preset.defaultClassName,
    }));
  };

  const handleOptionsChange = (updated: Partial<GeneratorOptions>) => {
    setOptions((prev) => ({ ...prev, ...updated }));
  };

  const complianceScore = result ? result.complianceScore : 100;
  const sonarResults = result ? result.sonarResults : [];

  return (
    <div className="space-y-6">
      {/* Preset Quick Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-900/80 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-cyan-600 dark:text-cyan-400" />
            ตัวอย่าง JSON สำเร็จรูป:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {SAMPLE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => handleSelectPreset(preset)}
                className="px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-slate-700/60 transition-colors font-medium"
                title={preset.description}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => setIsSonarModalOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-500/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 text-xs font-semibold shadow-sm transition-all"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>SonarQube Score: {complianceScore}%</span>
        </button>
      </div>

      {/* Options & Settings Toolbar */}
      <OptionsBar
        options={options}
        onChangeOptions={handleOptionsChange}
      />

      {/* Main Dual-Pane Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        {/* Left Pane: JSON Editor */}
        <div className="flex flex-col h-full">
          <JsonEditor
            value={jsonInput}
            onChange={setJsonInput}
            error={jsonError}
          />
        </div>

        {/* Right Pane: Dart / Flutter Code Viewer */}
        <div className="flex flex-col h-full">
          <DartViewer
            generationResult={result}
            error={error}
            onOpenSonarModal={() => setIsSonarModalOpen(true)}
          />
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 flex items-start gap-3 shadow-sm">
          <div className="p-2 rounded-lg bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-500/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">SonarQube Rules</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              ผ่านเกณฑ์ S101, S117, S1104, S1206, S1905 ไร้ Warning 100%
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 flex items-start gap-3 shadow-sm">
          <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">Safe Num Parsing</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              แปลง `num?` ป้องกัน runtime crash เมื่อ backend ส่ง float/int สลับกัน
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 flex items-start gap-3 shadow-sm">
          <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">Dart 3 &amp; Object.hash</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              ใช้ `Object.hash()` มาตรฐาน Dart 3 ป้องกัน hash collision
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 flex items-start gap-3 shadow-sm">
          <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">Multiple Generators</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              รองรับ Pure Dart, Freezed, JsonSerializable และ Equatable
            </p>
          </div>
        </div>
      </section>

      {/* SonarQube Detailed Audit Modal */}
      <SonarModal
        isOpen={isSonarModalOpen}
        onClose={() => setIsSonarModalOpen(false)}
        sonarResults={sonarResults}
        complianceScore={complianceScore}
      />
    </div>
  );
};
