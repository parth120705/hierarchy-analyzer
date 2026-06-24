import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from './components/Navbar';
import InputSection from './components/InputSection';
import SummaryCard from './components/SummaryCard';
import HierarchyCard from './components/HierarchyCard';
import Toast from './components/Toast';
import { 
  AlertOctagon, 
  Copy, 
  Check, 
  Trash2, 
  HelpCircle, 
  ShieldAlert, 
  FileText, 
  Code,
  FolderTree,
  ChevronRight,
  Database
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

export default function App() {
  const [inputValue, setInputValue] = useState('');
  const [response, setResponse] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isServerOnline, setIsServerOnline] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [isCopied, setIsCopied] = useState(false);
  const [isJsonOpen, setIsJsonOpen] = useState(false);

  // Default fallback user details
  const [userDetails, setUserDetails] = useState({
    user_id: 'parthmunjal_12072005',
    email: 'parth0847.be23@chitkara.edu.in',
    roll_number: '2310990847'
  });

  // Help Toast creation
  const addToast = (type, message) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  // Perform Health Check on mount
  useEffect(() => {
    checkServerHealth();
  }, []);

  const checkServerHealth = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/health`);
      if (res.status === 200) {
        setIsServerOnline(true);
        addToast('success', 'Successfully connected to backend processing server.');
      }
    } catch (err) {
      setIsServerOnline(false);
      addToast('error', 'Backend processing API is offline. Make sure the backend server is running on port 5001.');
    }
  };

  const handleClear = () => {
    setInputValue('');
    addToast('info', 'Input cleared.');
  };

  const handleSubmit = async () => {
    if (!inputValue.trim()) return;

    setIsLoading(true);
    setError(null);

    // Split input by commas or line breaks and clean whitespace
    const edgeList = inputValue
      .split(/[\n,]+/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    if (edgeList.length === 0) {
      setError("No valid elements found in input.");
      setIsLoading(false);
      addToast('warning', 'Please enter at least one connection edge.');
      return;
    }

    try {
      const res = await axios.post(`${API_BASE_URL}/bfhl`, { data: edgeList });
      
      setResponse(res.data);
      
      // Update displayed user credentials from actual backend response
      if (res.data.user_id) {
        setUserDetails({
          user_id: res.data.user_id,
          email: res.data.email_id,
          roll_number: res.data.college_roll_number
        });
      }

      addToast('success', `Analysis completed! Found ${res.data.summary.total_trees} trees and ${res.data.summary.total_cycles} cyclic loops.`);
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.error || err.message || 'API request failed';
      setError(errMsg);
      addToast('error', `Failed to analyze: ${errMsg}`);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (!response) return;
    navigator.clipboard.writeText(JSON.stringify(response, null, 2));
    setIsCopied(true);
    addToast('success', 'JSON payload copied to clipboard.');
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col relative select-none">
      {/* Background gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/5 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/5 rounded-full blur-[120px] pointer-events-none"></div>

      <Navbar isServerOnline={isServerOnline} userDetails={userDetails} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 sm:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Input Panel */}
        <div className="lg:col-span-5 flex flex-col gap-6 w-full">
          <InputSection
            value={inputValue}
            onChange={setInputValue}
            onSubmit={handleSubmit}
            onClear={handleClear}
            isLoading={isLoading}
          />

          {/* Quick instructions / Help */}
          <div className="glass-card p-5 border border-slate-900 text-slate-400">
            <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-widest mb-2 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-indigo-400" />
              Processing Rules Quick-Ref
            </h3>
            <ul className="text-xs space-y-2 list-disc list-inside">
              <li>Edges must match <code className="text-indigo-300 font-mono">X-&gt;Y</code> format, where X and Y are uppercase letters A-Z.</li>
              <li>Self-loops (e.g. <code className="text-rose-400 font-mono">A-&gt;A</code>) are stored in <span className="text-rose-400 font-medium">Invalid Entries</span>.</li>
              <li>Repeated connections are only processed once and listed in <span className="text-amber-400 font-medium">Duplicate Edges</span>.</li>
              <li>If a child node has multiple parents, the first-encountered parent wins; others are silently skipped.</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Results Dashboard */}
        <div className="lg:col-span-7 flex flex-col gap-6 w-full min-h-[400px]">
          {isLoading && (
            <div className="glass-card p-12 flex flex-col items-center justify-center text-center w-full grow min-h-[400px]">
              <div className="relative w-16 h-16 mb-4">
                <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20"></div>
                <div className="absolute inset-0 rounded-full border-4 border-t-indigo-500 animate-spin"></div>
              </div>
              <h3 className="text-sm font-bold text-slate-300">Processing Node Graphs</h3>
              <p className="text-xs text-slate-500 mt-1">Analyzing connectivity matrices, searching cycle paths, and computing depths...</p>
            </div>
          )}

          {error && !isLoading && (
            <div className="glass-card p-6 border-rose-500/20 text-rose-400 w-full flex items-start gap-4">
              <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <AlertOctagon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-rose-300">Analysis Error</h3>
                <p className="text-xs text-rose-400/80 mt-1">{error}</p>
                <button 
                  onClick={checkServerHealth} 
                  className="mt-3 px-3 py-1 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg text-[10px] font-extrabold text-rose-300 uppercase tracking-wider transition-all"
                >
                  Retry Health Check
                </button>
              </div>
            </div>
          )}

          {!response && !isLoading && !error && (
            <div className="glass-card p-12 flex flex-col items-center justify-center text-center grow border-dashed border-slate-800/80 min-h-[400px] shadow-none">
              <div className="p-4 rounded-full bg-slate-900/60 border border-slate-800 text-slate-500 mb-4 shadow-inner">
                <FolderTree className="w-10 h-10" />
              </div>
              <h3 className="text-sm font-bold text-slate-300">No Data Analyzed Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1.5">
                Load a preset scenario or write your connection strings in the input text area and press <strong>Analyze Hierarchy</strong> to compile structural insights.
              </p>
            </div>
          )}

          {response && !isLoading && !error && (
            <div className="flex flex-col gap-6 w-full animate-fade-in">
              {/* Summary Dashboard */}
              <SummaryCard summary={response.summary} />

              {/* Hierarchies Cards Section */}
              <div className="flex flex-col gap-4">
                <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-indigo-400" />
                  Compiled Hierarchies ({response.hierarchies.length})
                </h3>

                {response.hierarchies.length === 0 ? (
                  <div className="glass-card p-6 text-center text-slate-500 text-xs italic">
                    No valid components could be assembled from the provided edges.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {response.hierarchies.map((hierarchy, index) => (
                      <HierarchyCard key={index} hierarchy={hierarchy} />
                    ))}
                  </div>
                )}
              </div>

              {/* Extra Lists (Duplicates & Invalid Entries) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Invalid Entries */}
                <div className="glass-card p-5 border border-slate-800">
                  <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <AlertOctagon className="w-4 h-4 text-rose-400" />
                    Invalid Entries ({response.invalid_entries.length})
                  </h3>
                  <div className="max-h-36 overflow-y-auto pr-1">
                    {response.invalid_entries.length === 0 ? (
                      <p className="text-[11px] text-slate-500 italic">No syntax errors or loops detected.</p>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {response.invalid_entries.map((item, idx) => (
                          <span
                            key={idx}
                            className="inline-block px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/20 text-rose-400 font-mono text-xs font-semibold"
                          >
                            {item === '' ? '"" (empty)' : item}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Duplicate Edges */}
                <div className="glass-card p-5 border border-slate-800">
                  <h3 className="text-xs font-extrabold text-slate-300 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <ShieldAlert className="w-4 h-4 text-amber-400" />
                    Duplicate Edges ({response.duplicate_edges.length})
                  </h3>
                  <div className="max-h-36 overflow-y-auto pr-1">
                    {response.duplicate_edges.length === 0 ? (
                      <p className="text-[11px] text-slate-500 italic">No redundant connection entries.</p>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {response.duplicate_edges.map((item, idx) => (
                          <span
                            key={idx}
                            className="inline-block px-2.5 py-1 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 font-mono text-xs font-semibold"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Collapsible raw JSON response */}
              <div className="glass-card border border-slate-900 overflow-hidden">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setIsJsonOpen(!isJsonOpen)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setIsJsonOpen(!isJsonOpen);
                    }
                  }}
                  className="w-full px-5 py-4 flex items-center justify-between bg-slate-900/30 hover:bg-slate-900/50 cursor-pointer transition-colors focus:outline-none"
                >
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Code className="w-4 h-4 text-purple-400" />
                    Raw Response JSON
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard();
                      }}
                      className="p-1.5 rounded-lg border border-slate-800 bg-slate-950 hover:bg-slate-900 text-slate-400 hover:text-slate-200 transition-all flex items-center justify-center focus:outline-none"
                      title="Copy JSON payload"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <ChevronRight className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${isJsonOpen ? 'rotate-90' : ''}`} />
                  </div>
                </div>

                {isJsonOpen && (
                  <div className="p-4 border-t border-slate-900 bg-slate-950">
                    <pre className="text-xs font-mono text-indigo-200 overflow-x-auto max-h-[300px] leading-relaxed p-2 select-text selection:bg-indigo-500/30">
                      {JSON.stringify(response, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <Toast toasts={toasts} setToasts={setToasts} />

      <footer className="w-full bg-slate-950 border-t border-slate-900/80 py-4 text-center mt-auto">
        <span className="text-[10px] text-slate-600 font-bold uppercase tracking-wider">
          Hierarchy Analyzer &copy; {new Date().getFullYear()} &middot; Built for Chitkara Challenge
        </span>
      </footer>
    </div>
  );
}
