import React, { useState, useEffect } from 'react';
import { useTheme } from './hooks/useTheme';
import { Navbar } from './components/Navbar';
import { HomeDashboard } from './components/HomeDashboard';
import { JsonToDartTool } from './components/tools/JsonToDartTool';
import { JsonFormatterTool } from './components/tools/JsonFormatterTool';
import { FlutterAssetsTool } from './components/tools/FlutterAssetsTool';
import { JwtEncoderTool } from './components/tools/JwtEncoderTool';
import { SonarRulesExplorerTool } from './components/tools/SonarRulesExplorerTool';
import { JsonToTypescriptTool } from './components/tools/JsonToTypescriptTool';
import { NextjsTailwindTool } from './components/tools/NextjsTailwindTool';
import { SvgToReactTool } from './components/tools/SvgToReactTool';

export const App: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();

  const getToolFromHash = (): string | null => {
    const hash = window.location.hash.replace(/^#\/?/, '');
    if (!hash) return null;
    return hash;
  };

  const [currentToolId, setCurrentToolId] = useState<string | null>(getToolFromHash);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentToolId(getToolFromHash());
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSelectTool = (toolId: string) => {
    window.location.hash = `#/${toolId}`;
    setCurrentToolId(toolId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = () => {
    window.location.hash = '#/';
    setCurrentToolId(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderCurrentView = () => {
    switch (currentToolId) {
      // Mobile (Flutter)
      case 'json-to-dart':
        return <JsonToDartTool />;
      case 'flutter-assets':
        return <FlutterAssetsTool />;
      case 'sonarqube-rules':
        return <SonarRulesExplorerTool />;

      // Web (Next.js)
      case 'json-to-typescript':
        return <JsonToTypescriptTool />;
      case 'nextjs-tailwind':
        return <NextjsTailwindTool />;
      case 'svg-to-react':
        return <SvgToReactTool />;

      // Shared Utilities
      case 'json-formatter':
        return <JsonFormatterTool />;
      case 'jwt-decoder':
        return <JwtEncoderTool />;

      default:
        return <HomeDashboard onSelectTool={handleSelectTool} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 font-sans transition-colors duration-200">
      {/* Top Navbar */}
      <Navbar
        currentToolId={currentToolId}
        onNavigateHome={handleNavigateHome}
        onSelectTool={handleSelectTool}
        isDark={isDark}
        onToggleTheme={toggleTheme}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8">
        {renderCurrentView()}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-950/80 py-6 px-4 text-center text-xs text-slate-500 dark:text-slate-400 mt-12 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700 dark:text-slate-300">DevTools Hub</span>
            <span>•</span>
            <span>Mobile (Flutter) &amp; Web (Next.js)</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-slate-600 dark:text-slate-400">
            <button
              onClick={handleNavigateHome}
              className="hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors"
            >
              หน้าแรก
            </button>
            <span>•</span>
            <button
              onClick={() => handleSelectTool('json-to-dart')}
              className="hover:text-cyan-600 dark:hover:text-cyan-300 transition-colors"
            >
              JSON to Flutter
            </button>
            <span>•</span>
            <button
              onClick={() => handleSelectTool('json-to-typescript')}
              className="hover:text-violet-600 dark:hover:text-violet-300 transition-colors"
            >
              JSON to Next.js / Zod
            </button>
            <span>•</span>
            <button
              onClick={() => handleSelectTool('nextjs-tailwind')}
              className="hover:text-violet-600 dark:hover:text-violet-300 transition-colors"
            >
              Next.js Tailwind
            </button>
            <span>•</span>
            <button
              onClick={() => handleSelectTool('jwt-decoder')}
              className="hover:text-amber-600 dark:hover:text-amber-300 transition-colors"
            >
              JWT Decoder
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
