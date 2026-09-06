import React, { useState, useMemo } from 'react';
import { SAMPLE_PRESETS, SamplePreset } from './constants/sampleJson';
import { GeneratorOptions } from './types';
import { generateFlutterModel } from './generator';
import { Navbar } from './components/Navbar';
import { OptionsBar } from './components/OptionsBar';
import { JsonEditor } from './components/JsonEditor';
import { DartViewer } from './components/DartViewer';
import { SonarModal } from './components/SonarModal';
import { ShieldCheck, Sparkles, Terminal } from 'lucide-react';

export const App: React.FC = () => {
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
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Top Navbar */}
      <Navbar
        onSelectPreset={handleSelectPreset}
        onOpenSonarModal={() => setIsSonarModalOpen(true)}
        complianceScore={complianceScore}
      />

      {/* Options & Settings Toolbar */}
      <OptionsBar
        options={options}
        onChangeOptions={handleOptionsChange}
      />

      {/* Main Dual-Pane Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8">
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
        <section className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-200">SonarQube Rules</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                ผ่านเกณฑ์ S101, S117, S1104, S1206, S1905 ไร้ Warning 100%
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-500/30">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-200">Safe Num Parsing</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                แปลง `num?` ป้องกัน runtime crash เมื่อ backend ส่ง float/int สลับกัน
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-500/30">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-200">Dart 3 &amp; Object.hash</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                ใช้ `Object.hash()` มาตรฐาน Dart 3 ป้องกัน hash collision
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3">
            <div className="p-2 rounded-lg bg-amber-950 text-amber-400 border border-amber-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-200">Multiple Generators</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                รองรับ Pure Dart, Freezed, JsonSerializable และ Equatable
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-4 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            Flutter &amp; Dart Model Generator • SonarQube Ready
          </span>
          <span className="flex items-center gap-1 text-slate-400">
            Crafted for Flutter Developers with Clean Code Standards
          </span>
        </div>
      </footer>

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
export default App;
