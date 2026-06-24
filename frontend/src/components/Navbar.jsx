import React from 'react';
import { GitBranch, Wifi, WifiOff, Award, Mail, Fingerprint } from 'lucide-react';

export default function Navbar({ isServerOnline, userDetails }) {
  return (
    <nav className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-900 px-4 py-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Branding & Logo */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 shadow-lg shadow-indigo-500/30">
            <GitBranch className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent text-glow">
              Hierarchy Analyzer
            </span>
            <div className="text-[10px] text-slate-500 font-medium uppercase tracking-wider">
              MERN Stack Engine
            </div>
          </div>
        </div>

        {/* User Details & Connection Status */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-4">
          {/* User Details Badges */}
          {userDetails && (
            <div className="flex flex-wrap items-center gap-2">
              {/* Roll Number */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-900 border border-slate-800 text-indigo-300">
                <Award className="w-3.5 h-3.5" />
                <span className="hidden xs:inline text-slate-400">Roll:</span> {userDetails.roll_number}
              </div>
              {/* Email */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-900 border border-slate-800 text-purple-300">
                <Mail className="w-3.5 h-3.5" />
                <span className="hidden xs:inline text-slate-400">Email:</span> {userDetails.email}
              </div>
              {/* User ID */}
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-900 border border-slate-800 text-pink-300">
                <Fingerprint className="w-3.5 h-3.5" />
                <span className="hidden xs:inline text-slate-400">ID:</span> {userDetails.user_id}
              </div>
            </div>
          )}

          {/* Connection Status Badge */}
          <div
            className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all duration-300 ${
              isServerOnline
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}
          >
            {isServerOnline ? (
              <>
                <Wifi className="w-3.5 h-3.5 animate-pulse" />
                <span>API Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3.5 h-3.5" />
                <span>API Offline</span>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
