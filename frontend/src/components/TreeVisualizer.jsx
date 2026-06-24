import React from 'react';
import { GitCommit, Minimize2 } from 'lucide-react';

export default function TreeVisualizer({ treeData }) {
  if (!treeData || Object.keys(treeData).length === 0) {
    return (
      <div className="text-xs text-slate-500 italic py-2 flex items-center gap-1.5">
        <Minimize2 className="w-3.5 h-3.5" />
        No hierarchical branches to display.
      </div>
    );
  }

  const roots = Object.keys(treeData);

  return (
    <div className="py-2 pl-1 select-none overflow-x-auto">
      {roots.map((root) => (
        <TreeNode key={root} name={root} children={treeData[root]} isRoot={true} />
      ))}
    </div>
  );
}

function TreeNode({ name, children, isRoot = false }) {
  const childKeys = Object.keys(children || {});
  const hasChildren = childKeys.length > 0;

  return (
    <div className="relative pl-5 py-1">
      {/* Horizontal connector line for child nodes */}
      {!isRoot && (
        <div className="absolute left-0 top-1/2 w-4 h-[1px] bg-slate-700/70"></div>
      )}

      {/* Node Representation */}
      <div className="flex items-center gap-2 group cursor-default">
        {/* Node Circle */}
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm tracking-tight transition-all duration-300 ${
          isRoot 
            ? 'bg-gradient-to-tr from-indigo-600 to-purple-600 border border-indigo-500 shadow-md shadow-indigo-500/10 text-white' 
            : 'bg-slate-900 border border-slate-800 text-slate-300 group-hover:text-indigo-400 group-hover:border-indigo-500/40 group-hover:bg-slate-950'
        }`}>
          {name}
        </div>

        {/* Labels & Details */}
        {isRoot && (
          <span className="text-[9px] uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-bold px-1.5 py-0.5 rounded-md">
            Root
          </span>
        )}

        {hasChildren && (
          <span className="text-[10px] text-slate-500 bg-slate-950 border border-slate-900 px-1.5 py-0.5 rounded-md group-hover:text-slate-400 transition-colors">
            {childKeys.length} branch{childKeys.length > 1 ? 'es' : ''}
          </span>
        )}
      </div>

      {/* Child Nodes */}
      {hasChildren && (
        <div className="relative ml-[13px] pl-3 border-l border-slate-800/80 mt-1 flex flex-col">
          {childKeys.map((key) => (
            <TreeNode key={key} name={key} children={children[key]} isRoot={false} />
          ))}
        </div>
      )}
    </div>
  );
}
