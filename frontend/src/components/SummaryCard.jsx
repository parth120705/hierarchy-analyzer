import React from 'react';
import { GitCommit, RotateCw, Crown } from 'lucide-react';

export default function SummaryCard({ summary }) {
  const { total_trees = 0, total_cycles = 0, largest_tree_root = '' } = summary || {};

  const stats = [
    {
      title: 'Total Valid Trees',
      value: total_trees,
      description: 'Cycle-free hierarchical components',
      icon: <GitCommit className="w-5 h-5 text-indigo-400" />,
      glowColor: 'glow-indigo',
      borderColor: 'border-indigo-500/20'
    },
    {
      title: 'Total Cycles',
      value: total_cycles,
      description: 'Components containing infinite loops',
      icon: <RotateCw className="w-5 h-5 text-rose-400" />,
      glowColor: 'glow-rose',
      borderColor: 'border-rose-500/20'
    },
    {
      title: 'Largest Tree Root',
      value: largest_tree_root || 'None',
      description: 'Tree with the deepest hierarchy',
      icon: <Crown className="w-5 h-5 text-amber-400" />,
      glowColor: 'glow-amber',
      borderColor: 'border-amber-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <div
          key={index}
          className={`glass-card p-5 relative overflow-hidden flex items-center justify-between border ${stat.borderColor} ${stat.glowColor}`}
        >
          {/* Background gradient sphere */}
          <div className="absolute -bottom-5 -right-5 w-20 h-20 bg-slate-900 rounded-full blur-xl opacity-80"></div>
          
          <div className="flex-1 min-w-0 pr-3">
            <span className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
              {stat.title}
            </span>
            <span className="block text-2xl font-black text-slate-100 tracking-tight mt-1.5 truncate">
              {stat.value}
            </span>
            <span className="block text-[10px] text-slate-500 mt-1 truncate">
              {stat.description}
            </span>
          </div>

          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 flex-shrink-0 shadow-inner">
            {stat.icon}
          </div>
        </div>
      ))}
    </div>
  );
}
