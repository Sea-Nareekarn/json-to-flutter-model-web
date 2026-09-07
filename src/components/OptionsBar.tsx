import React from 'react';
import { GeneratorOptions, ModelStyle, NullabilityMode } from '../types';
import { Settings2, Code2, Check } from 'lucide-react';

interface OptionsBarProps {
  options: GeneratorOptions;
  onChangeOptions: (updated: Partial<GeneratorOptions>) => void;
}

export const OptionsBar: React.FC<OptionsBarProps> = ({
  options,
  onChangeOptions,
}) => {
  const styles: { id: ModelStyle; label: string; tag: string }[] = [
    { id: 'pure_dart', label: 'Pure Dart 3', tag: 'Zero Deps / Recommended' },
    { id: 'freezed', label: 'Freezed', tag: 'Code Gen' },
    { id: 'json_serializable', label: 'JsonSerializable', tag: 'build_runner' },
    { id: 'equatable', label: 'Equatable', tag: 'Value Equality' },
  ];

  const nullabilityModes: { id: NullabilityMode; label: string; desc: string }[] = [
    { id: 'smart', label: 'Smart Nullable', desc: 'Auto-detects nulls' },
    { id: 'nullable', label: 'All Nullable (T?)', desc: '100% Safe against nulls' },
    { id: 'non_nullable', label: 'Required Non-Null', desc: 'Strict required fields' },
  ];

  return (
    <div className="bg-white dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 p-4 lg:px-8 rounded-xl shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto space-y-4">
        {/* Top row: Root Class Name & Generator Model Style */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          {/* Root Class Name */}
          <div className="md:col-span-4">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
              Root Class Name
            </label>
            <input
              type="text"
              value={options.rootClassName}
              onChange={(e) => onChangeOptions({ rootClassName: e.target.value })}
              placeholder="e.g. UserProfileResponse"
              className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700/80 rounded-lg px-3 py-2 text-sm text-slate-900 dark:text-cyan-300 font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
            />
          </div>

          {/* Model Style Selector */}
          <div className="md:col-span-8">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Settings2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              Model Generator Style
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {styles.map((st) => {
                const isActive = options.style === st.id;
                return (
                  <button
                    key={st.id}
                    onClick={() => onChangeOptions({ style: st.id })}
                    className={`flex flex-col items-start px-3 py-2 rounded-lg border text-left transition-all ${
                      isActive
                        ? 'bg-cyan-50 dark:bg-cyan-950/40 border-cyan-500/80 text-cyan-800 dark:text-cyan-200 ring-1 ring-cyan-500/50 shadow-sm'
                        : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-xs font-bold flex items-center gap-1">
                      {st.label}
                      {isActive && <Check className="w-3 h-3 text-cyan-600 dark:text-cyan-400" />}
                    </span>
                    <span className="text-[10px] text-slate-500 line-clamp-1">{st.tag}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Second Row: Nullability & Granular Feature Toggles */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
          {/* Nullability Selector */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Null Safety:</span>
            <div className="flex bg-slate-100 dark:bg-slate-950 p-0.5 rounded-lg border border-slate-200 dark:border-slate-800">
              {nullabilityModes.map((nm) => {
                const isSelected = options.nullability === nm.id;
                return (
                  <button
                    key={nm.id}
                    onClick={() => onChangeOptions({ nullability: nm.id })}
                    className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                    }`}
                    title={nm.desc}
                  >
                    {nm.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Feature Checkboxes */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-slate-700 dark:text-slate-300">
            <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors">
              <input
                type="checkbox"
                checked={options.safeNumberParsing}
                onChange={(e) => onChangeOptions({ safeNumberParsing: e.target.checked })}
                className="rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-cyan-600 dark:text-cyan-500 focus:ring-0"
              />
              <span title="Uses (json['x'] as num?)?.toInt() to prevent double/int mismatch exceptions">
                Safe Num Parsing
              </span>
            </label>

            {options.style === 'pure_dart' && (
              <>
                <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors">
                  <input
                    type="checkbox"
                    checked={options.generateCopyWith}
                    onChange={(e) => onChangeOptions({ generateCopyWith: e.target.checked })}
                    className="rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-cyan-600 dark:text-cyan-500 focus:ring-0"
                  />
                  <span title="Generate .copyWith() method for updating immutable models">copyWith</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors">
                  <input
                    type="checkbox"
                    checked={options.generateToString}
                    onChange={(e) => onChangeOptions({ generateToString: e.target.checked })}
                    className="rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-cyan-600 dark:text-cyan-500 focus:ring-0"
                  />
                  <span title="Generate toString() method for debug logs">toString()</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors">
                  <input
                    type="checkbox"
                    checked={options.generateEquality}
                    onChange={(e) => onChangeOptions({ generateEquality: e.target.checked })}
                    className="rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-cyan-600 dark:text-cyan-500 focus:ring-0"
                  />
                  <span title="Generate operator == and hashCode">== &amp; hashCode</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors">
                  <input
                    type="checkbox"
                    checked={options.useImmutableAnnotation}
                    onChange={(e) => onChangeOptions({ useImmutableAnnotation: e.target.checked })}
                    className="rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-cyan-600 dark:text-cyan-500 focus:ring-0"
                  />
                  <span title="Import meta.dart and add @immutable annotation">@immutable</span>
                </label>
              </>
            )}

            <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors">
              <input
                type="checkbox"
                checked={options.generateToJson}
                onChange={(e) => onChangeOptions({ generateToJson: e.target.checked })}
                className="rounded border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-cyan-600 dark:text-cyan-500 focus:ring-0"
              />
              <span title="Generate Map<String, dynamic> toJson() method">toJson()</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
