import React from 'react';
import { GeneratorOptions, ModelStyle, NullabilityMode } from '../types';
import { Settings2, Code2, Check, Sliders, ShieldCheck } from 'lucide-react';

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

  const featureToggles = [
    {
      id: 'generateToString' as const,
      label: 'toString()',
      active: options.generateToString,
      desc: 'สร้างเมธอด toString() สำหรับ Debug และพิมพ์ค่าตัวแปร',
      pureDartOnly: true,
    },
    {
      id: 'generateCopyWith' as const,
      label: 'copyWith()',
      active: options.generateCopyWith,
      desc: 'สร้างเมธอด copyWith สำหรับคัดลอกและอัปเดตข้อมูล',
      pureDartOnly: true,
    },
    {
      id: 'generateToJson' as const,
      label: 'toJson()',
      active: options.generateToJson,
      desc: 'สร้างเมธอด toJson() สำหรับแปลง Model กลับเป็น JSON Map',
      pureDartOnly: false,
    },
    {
      id: 'generateEquality' as const,
      label: '== & hashCode',
      active: options.generateEquality,
      desc: 'สร้าง operator == และ hashCode ด้วย Object.hash()',
      pureDartOnly: true,
    },
    {
      id: 'useImmutableAnnotation' as const,
      label: '@immutable',
      active: options.useImmutableAnnotation,
      desc: 'ใส่ Annotation @immutable และ import package:meta/meta.dart',
      pureDartOnly: true,
    },
    {
      id: 'safeNumberParsing' as const,
      label: 'Safe Num Parsing',
      active: options.safeNumberParsing,
      desc: 'แปลงเลข JSON ด้วย (json[...] as num?) ป้องกัน App Crash',
      pureDartOnly: false,
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 p-4 lg:px-6 rounded-xl shadow-sm transition-colors space-y-4">
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

      {/* Second Row: Nullability & Feature Chips */}
      <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-xs">
        {/* Nullability Selector */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-slate-600 dark:text-slate-400 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Null Safety:
          </span>
          <div className="flex bg-slate-100 dark:bg-slate-950 p-0.5 rounded-lg border border-slate-200 dark:border-slate-800">
            {nullabilityModes.map((nm) => {
              const isSelected = options.nullability === nm.id;
              return (
                <button
                  key={nm.id}
                  onClick={() => onChangeOptions({ nullability: nm.id })}
                  className={`px-2.5 py-1 rounded-md transition-all font-medium ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-sm font-semibold'
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

        {/* Feature Toggles as Prominent Clickable Chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-600 dark:text-slate-400 font-semibold flex items-center gap-1 flex-shrink-0">
            <Sliders className="w-3.5 h-3.5 text-cyan-500" />
            Toggles:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {featureToggles.map((item) => {
              if (item.pureDartOnly && options.style !== 'pure_dart') return null;
              const isOn = !!item.active;
              return (
                <button
                  key={item.id}
                  onClick={() => onChangeOptions({ [item.id]: !isOn })}
                  title={item.desc}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                    isOn
                      ? 'bg-cyan-50 dark:bg-cyan-950/60 border-cyan-500 text-cyan-800 dark:text-cyan-200 shadow-sm ring-1 ring-cyan-500/40'
                      : 'bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-200/70 dark:hover:bg-slate-700/60'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isOn ? 'bg-cyan-500 dark:bg-cyan-400 ring-2 ring-cyan-500/30' : 'bg-slate-400 dark:bg-slate-600'
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
