import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HomeDashboard } from './components/HomeDashboard';
import { JsonToDartTool } from './components/tools/JsonToDartTool';
import { JsonFormatterTool } from './components/tools/JsonFormatterTool';
import { FlutterAssetsTool } from './components/tools/FlutterAssetsTool';
import { JwtEncoderTool } from './components/tools/JwtEncoderTool';
import { SonarRulesExplorerTool } from './components/tools/SonarRulesExplorerTool';

export const App: React.FC = () => {
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
      case 'json-to-dart':
        return <JsonToDartTool />;
      case 'flutter-assets':
        return <FlutterAssetsTool />;
      case 'json-formatter':
        return <JsonFormatterTool />;
      case 'jwt-decoder':
        return <JwtEncoderTool />;
      case 'sonarqube-rules':
        return <SonarRulesExplorerTool />;
      default:
        return <HomeDashboard onSelectTool={handleSelectTool} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Top Navbar */}
      <Navbar
        currentToolId={currentToolId}
        onNavigateHome={handleNavigateHome}
        onSelectTool={handleSelectTool}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-8">
        {renderCurrentView()}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-6 px-4 text-center text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">DevTools Hub</span>
            <span>•</span>
            <span>SonarQube &amp; Clean Code Ready</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <button
              onClick={handleNavigateHome}
              className="hover:text-cyan-300 transition-colors"
            >
              หน้าแรก
            </button>
            <span>•</span>
            <button
              onClick={() => handleSelectTool('json-to-dart')}
              className="hover:text-cyan-300 transition-colors"
            >
              JSON to Dart Model
            </button>
            <span>•</span>
            <button
              onClick={() => handleSelectTool('flutter-assets')}
              className="hover:text-cyan-300 transition-colors"
            >
              Colors &amp; Assets
            </button>
            <span>•</span>
            <button
              onClick={() => handleSelectTool('json-formatter')}
              className="hover:text-cyan-300 transition-colors"
            >
              JSON Formatter
            </button>
            <span>•</span>
            <button
              onClick={() => handleSelectTool('jwt-decoder')}
              className="hover:text-cyan-300 transition-colors"
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
