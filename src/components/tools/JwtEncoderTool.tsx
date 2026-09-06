import React, { useState } from 'react';
import { KeyRound, Binary, Globe, Copy, Check, AlertCircle, Clock } from 'lucide-react';

export const JwtEncoderTool: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'jwt' | 'base64' | 'url'>('jwt');

  // JWT state
  const [jwtInput, setJwtInput] = useState<string>(
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IlNvbWNoYWkgUHJhc2VydCIsImlhdCI6MTUxNjIzOTAyMiwiZXhwIjoyMDgwMDAwMDAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'
  );

  // Base64 state
  const [base64Input, setBase64Input] = useState<string>('Flutter DevTools Hub 2026');
  const [base64Output, setBase64Output] = useState<string>('');
  const [base64Mode, setBase64Mode] = useState<'encode' | 'decode'>('encode');

  // URL state
  const [urlInput, setUrlInput] = useState<string>('https://example.com/api/v1/search?query=Flutter Model Generator&lang=th-TH');
  const [urlOutput, setUrlOutput] = useState<string>('');
  const [urlMode, setUrlMode] = useState<'encode' | 'decode'>('encode');

  const [copied, setCopied] = useState(false);

  // Parse JWT
  let jwtHeader: Record<string, unknown> | null = null;
  let jwtPayload: Record<string, unknown> | null = null;
  let jwtError: string | null = null;
  let expDateStr: string | null = null;
  let isExpired = false;

  if (jwtInput.trim()) {
    try {
      const parts = jwtInput.trim().split('.');
      if (parts.length >= 2) {
        const decodeBase64Url = (str: string) => {
          let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
          while (base64.length % 4) {
            base64 += '=';
          }
          return decodeURIComponent(
            atob(base64)
              .split('')
              .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          );
        };

        jwtHeader = JSON.parse(decodeBase64Url(parts[0]));
        jwtPayload = JSON.parse(decodeBase64Url(parts[1]));

        if (jwtPayload && typeof jwtPayload.exp === 'number') {
          const expTime = jwtPayload.exp * 1000;
          const expDate = new Date(expTime);
          expDateStr = expDate.toLocaleString();
          isExpired = Date.now() > expTime;
        }
      } else {
        jwtError = 'JWT Token ต้องมีอย่างน้อย 2 ส่วนคั่นด้วยจุด (.)';
      }
    } catch (err: unknown) {
      const e = err as Error;
      jwtError = `ไม่สามารถถอดรหัส JWT ได้: ${e.message}`;
    }
  }

  // Handle Base64 conversion
  const handleBase64Convert = () => {
    try {
      if (base64Mode === 'encode') {
        setBase64Output(btoa(unescape(encodeURIComponent(base64Input))));
      } else {
        setBase64Output(decodeURIComponent(escape(atob(base64Input))));
      }
    } catch {
      setBase64Output('Error: ข้อมูลไม่ถูกต้องสำหรับการแปลง Base64');
    }
  };

  // Handle URL conversion
  const handleUrlConvert = () => {
    try {
      if (urlMode === 'encode') {
        setUrlOutput(encodeURIComponent(urlInput));
      } else {
        setUrlOutput(decodeURIComponent(urlInput));
      }
    } catch {
      setUrlOutput('Error: ข้อมูลไม่ถูกต้องสำหรับการแปลง URL');
    }
  };

  const handleCopy = async (text: string) => {
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-amber-400" />
            JWT, Base64 &amp; URL Converter
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            ถอดรหัส JWT Token ตรวจสอบ Expire, แปลง Base64 และ URL Encoding 100% Client-side
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('jwt')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
              activeTab === 'jwt' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            JWT Decoder
          </button>
          <button
            onClick={() => { setActiveTab('base64'); handleBase64Convert(); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
              activeTab === 'base64' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Binary className="w-3.5 h-3.5" />
            Base64
          </button>
          <button
            onClick={() => { setActiveTab('url'); handleUrlConvert(); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-semibold transition-all ${
              activeTab === 'url' ? 'bg-amber-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            URL Encode
          </button>
        </div>
      </div>

      {/* JWT TAB */}
      {activeTab === 'jwt' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          {/* JWT Input */}
          <div className="bg-slate-900/70 rounded-xl border border-slate-800 shadow-xl overflow-hidden flex flex-col">
            <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Encoded JWT Token
              </span>
            </div>
            <div className="p-3 flex-1 flex flex-col">
              <textarea
                value={jwtInput}
                onChange={(e) => setJwtInput(e.target.value)}
                placeholder="วาง JWT Token ที่นี่..."
                spellCheck={false}
                className="w-full flex-1 min-h-[350px] p-3 bg-slate-950/90 text-amber-300 font-mono text-xs leading-relaxed resize-none rounded-lg border border-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500/40"
              />
              {jwtError && (
                <div className="mt-3 p-3 rounded-lg bg-rose-950/80 border border-rose-600/60 text-rose-200 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  <span>{jwtError}</span>
                </div>
              )}
            </div>
          </div>

          {/* JWT Decoded View */}
          <div className="space-y-4">
            {/* Expiration Info Banner */}
            {expDateStr && (
              <div className={`p-3 rounded-xl border flex items-center justify-between text-xs ${
                isExpired
                  ? 'bg-rose-950/40 border-rose-600/40 text-rose-300'
                  : 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
              }`}>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>
                    Expires: <strong>{expDateStr}</strong>
                  </span>
                </div>
                <span className="font-bold uppercase px-2 py-0.5 rounded bg-slate-900/80 text-[10px]">
                  {isExpired ? 'EXPIRED' : 'ACTIVE'}
                </span>
              </div>
            )}

            {/* Header Box */}
            <div className="bg-slate-900/70 rounded-xl border border-slate-800 overflow-hidden">
              <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs font-bold text-rose-400 uppercase tracking-wider">
                Header (Algorithm &amp; Type)
              </div>
              <pre className="p-3 bg-slate-950/90 text-xs font-mono text-rose-200 overflow-auto">
                {jwtHeader ? JSON.stringify(jwtHeader, null, 2) : '// No Header'}
              </pre>
            </div>

            {/* Payload Box */}
            <div className="bg-slate-900/70 rounded-xl border border-slate-800 overflow-hidden">
              <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs font-bold text-indigo-400 uppercase tracking-wider flex justify-between items-center">
                <span>Payload (Claims Data)</span>
                <button
                  onClick={() => handleCopy(JSON.stringify(jwtPayload, null, 2))}
                  className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  Copy
                </button>
              </div>
              <pre className="p-3 bg-slate-950/90 text-xs font-mono text-indigo-200 overflow-auto max-h-[250px]">
                {jwtPayload ? JSON.stringify(jwtPayload, null, 2) : '// No Payload'}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* BASE64 TAB */}
      {activeTab === 'base64' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <div className="bg-slate-900/70 rounded-xl border border-slate-800 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Input Text</span>
              <div className="flex gap-1 text-xs">
                <button
                  onClick={() => { setBase64Mode('encode'); }}
                  className={`px-2.5 py-1 rounded ${base64Mode === 'encode' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400'}`}
                >
                  Encode
                </button>
                <button
                  onClick={() => { setBase64Mode('decode'); }}
                  className={`px-2.5 py-1 rounded ${base64Mode === 'decode' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400'}`}
                >
                  Decode
                </button>
              </div>
            </div>
            <textarea
              value={base64Input}
              onChange={(e) => setBase64Input(e.target.value)}
              className="w-full min-h-[250px] p-3 bg-slate-950 text-slate-200 font-mono text-xs rounded-lg border border-slate-800 focus:outline-none"
            />
            <button
              onClick={handleBase64Convert}
              className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-lg shadow"
            >
              Convert Now
            </button>
          </div>

          <div className="bg-slate-900/70 rounded-xl border border-slate-800 p-4 space-y-3 flex flex-col">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Output</span>
              <button
                onClick={() => handleCopy(base64Output)}
                className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                Copy
              </button>
            </div>
            <textarea
              readOnly
              value={base64Output}
              className="w-full flex-1 min-h-[250px] p-3 bg-slate-950 text-amber-300 font-mono text-xs rounded-lg border border-slate-800 focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* URL TAB */}
      {activeTab === 'url' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          <div className="bg-slate-900/70 rounded-xl border border-slate-800 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">URL Input</span>
              <div className="flex gap-1 text-xs">
                <button
                  onClick={() => setUrlMode('encode')}
                  className={`px-2.5 py-1 rounded ${urlMode === 'encode' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400'}`}
                >
                  Encode
                </button>
                <button
                  onClick={() => setUrlMode('decode')}
                  className={`px-2.5 py-1 rounded ${urlMode === 'decode' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400'}`}
                >
                  Decode
                </button>
              </div>
            </div>
            <textarea
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              className="w-full min-h-[250px] p-3 bg-slate-950 text-slate-200 font-mono text-xs rounded-lg border border-slate-800 focus:outline-none"
            />
            <button
              onClick={handleUrlConvert}
              className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-lg shadow"
            >
              Convert URL
            </button>
          </div>

          <div className="bg-slate-900/70 rounded-xl border border-slate-800 p-4 space-y-3 flex flex-col">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Output URL</span>
              <button
                onClick={() => handleCopy(urlOutput)}
                className="flex items-center gap-1 text-xs text-amber-400 hover:text-amber-300"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                Copy
              </button>
            </div>
            <textarea
              readOnly
              value={urlOutput}
              className="w-full flex-1 min-h-[250px] p-3 bg-slate-950 text-amber-300 font-mono text-xs rounded-lg border border-slate-800 focus:outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
};
