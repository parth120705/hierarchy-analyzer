import React from 'react';
import { GitBranch, AlertTriangle, Layers, ArrowRight } from 'lucide-react';
import TreeVisualizer from './TreeVisualizer';

export default function HierarchyCard({ hierarchy }) {
  const { root, tree, depth, has_cycle } = hierarchy;

  return (
    <div className={`glass-card p-5 relative overflow-hidden transition-all duration-300 ${
      has_cycle 
        ? 'border-rose-500/20 hover:border-rose-500/40 hover:shadow-rose-500/5 hover:shadow-lg' 
        : 'border-slate-800 hover:border-slate-700 hover:shadow-indigo-500/5 hover:shadow-lg'
    }`}>
      {/* Background decoration */}
      <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-3xl pointer-events-none ${
        has_cycle ? 'bg-rose-500/5' : 'bg-indigo-500/5'
      }`}></div>

      {/* Card Header */}
      <div className="flex items-start justify-between gap-4 border-b border-slate-900 pb-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-200 flex items-center gap-1.5">
            <GitBranch className={`w-4 h-4 ${has_cycle ? 'text-rose-400' : 'text-indigo-400'}`} />
            {has_cycle ? `Cyclic Component (${root})` : `Tree Component (${root})`}
          </h3>
          <p className="text-[10px] text-slate-500 mt-0.5">
            Root: <code className="text-indigo-300 font-mono font-bold bg-slate-950 px-1 py-0.5 rounded border border-slate-900">{root}</code>
          </p>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-1.5">
          {has_cycle ? (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-500/10 border border-rose-500/30 text-rose-400 uppercase tracking-wider animate-pulse-slow">
              <AlertTriangle className="w-3 h-3" />
              Cycle Detected
            </span>
          ) : (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 uppercase tracking-wider">
              <Layers className="w-3 h-3" />
              Depth: {depth}
            </span>
          )}
        </div>
      </div>

      {/* Card Body (Visualization) */}
      <div className="bg-slate-950/40 rounded-xl border border-slate-900/60 p-4 min-h-[100px] flex flex-col justify-center">
        {has_cycle ? (
          <div className="flex flex-col items-center justify-center text-center p-3">
            <div className="p-2.5 rounded-full bg-rose-500/5 border border-rose-500/20 text-rose-400 mb-2">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h4 className="text-xs font-bold text-slate-300">Infinite Cycle Loop</h4>
            <p className="text-[10px] text-slate-500 max-w-xs mt-1">
              Nodes in this group are engaged in a circular dependency structure (no root exists). Tree visualization is disabled.
            </p>
          </div>
        ) : (
          <TreeVisualizer treeData={tree} />
        )}
      </div>
    </div>
  );
}
