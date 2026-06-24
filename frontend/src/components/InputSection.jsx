import React, { useState } from 'react';
import { Play, RotateCcw, HelpCircle, FileJson } from 'lucide-react';

const SAMPLES = [
  {
    name: 'Chitkara Forest (Complex)',
    data: 'A->B\nA->C\nB->D\nC->E\nE->F\nX->Y\nY->Z\nZ->X\nP->Q\nQ->R\nG->E\nG->H\nG->I\nhello\n1->2\nA->\nG->H' // includes duplicate G->H
  },
  {
    name: 'Simple Tree (A->D)',
    data: 'A->B\nA->C\nB->D'
  },
  {
    name: 'Multiple Trees',
    data: 'A->B\nC->D\nE->F'
  },
  {
    name: 'Multi-Parent Collision',
    data: 'A->C\nB->C\nC->D'
  },
  {
    name: 'Pure Cycles',
    data: 'A->B\nB->C\nC->A'
  }
];

export default function InputSection({ value, onChange, onSubmit, isLoading, onClear }) {
  const [selectedSample, setSelectedSample] = useState(0);

  const loadSample = (index) => {
    setSelectedSample(index);
    onChange(SAMPLES[index].data);
  };

  return (
    <div className="glass-card p-6 shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <FileJson className="w-5 h-5 text-indigo-400" />
            Input Node Connections
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Enter one connection per line or separated by commas (e.g. <code className="text-[11px] bg-slate-900 text-indigo-300 font-mono px-1 py-0.5 rounded">A-&gt;B</code>)
          </p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Presets:</span>
          <select
            onChange={(e) => loadSample(Number(e.target.value))}
            value={selectedSample}
            className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors"
          >
            {SAMPLES.map((sample, idx) => (
              <option key={idx} value={idx}>
                {sample.name}
              </option>
            ))}
          </select>
          <button
            onClick={() => loadSample(selectedSample)}
            className="px-2.5 py-1 text-xs font-bold text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 rounded-lg transition-all border border-indigo-500/20"
            title="Reload preset"
          >
            Load
          </button>
        </div>
      </div>

      {/* Input Area */}
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste node connections here...&#10;Example:&#10;A->B&#10;A->C&#10;B->D"
          rows={7}
          disabled={isLoading}
          className="w-full font-mono text-sm bg-slate-950/80 border border-slate-800 rounded-xl p-4 text-indigo-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-y shadow-inner"
        />
      </div>

      {/* Buttons */}
      <div className="flex items-center justify-between gap-3 mt-4">
        {/* Helper info */}
        <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Supports commas or line-breaks as separators.</span>
        </div>

        <div className="flex items-center gap-2 ml-auto w-full sm:w-auto">
          <button
            onClick={onClear}
            disabled={isLoading || !value}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 border border-slate-800 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900 text-slate-300 hover:text-slate-100 rounded-xl text-xs font-bold transition-all disabled:opacity-50 disabled:pointer-events-none"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear
          </button>
          
          <button
            onClick={onSubmit}
            disabled={isLoading || !value.trim()}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-550 hover:to-purple-550 text-white rounded-xl text-xs font-extrabold transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none shadow-lg shadow-indigo-500/20 active:scale-95"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                Analyze Hierarchy
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
