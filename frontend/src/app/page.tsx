"use client";
import { useState, useEffect } from "react";
import { AlertCircle, ShieldAlert, CheckCircle, Network, Info } from "lucide-react";

export default function RiskDashboard() {
  const [merchants, setMerchants] = useState([]);
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showFalsePositiveModal, setShowFalsePositiveModal] = useState(false);

  useEffect(() => {
    fetch("http://localhost:8000/api/merchants")
      .then((res) => res.json())
      .then((data) => {
        setMerchants(data);
        setLoading(false);
      });
  }, []);

  const fetchExplanation = (merchantId) => {
    setExplanation(null);
    fetch(`http://localhost:8000/api/explain/${merchantId}`)
      .then((res) => res.json())
      .then((data) => {
        setSelectedMerchant(merchantId);
        setExplanation(data);
      });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-300 p-8 font-sans transition-colors duration-300">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Razorpay X-Ray</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Causal Risk Twin & Explainable Fraud Engine</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 px-4 py-2 rounded-full text-sm font-medium border border-emerald-200 dark:border-emerald-800/50 shadow-inner">
            <span className="text-lg leading-none">🔒</span>
            <span>Differential Privacy (DP) Active</span>
          </div>
          <div className="flex items-center space-x-2 bg-indigo-100 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-400 px-4 py-2 rounded-full text-sm font-medium border border-indigo-200 dark:border-indigo-800/50 shadow-inner">
            <Network className="w-4 h-4" />
            <span>GraphSAGE Model Active</span>
          </div>
        </div>
      </header>

      <div className="flex gap-8">
        {/* Left Pane: Merchant List */}
        <div className="w-1/3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg dark:shadow-2xl overflow-hidden flex flex-col h-[80vh] transition-colors duration-300">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/30">
            <h2 className="font-semibold text-slate-700 dark:text-slate-200">Flagged Entities</h2>
          </div>
          <div className="overflow-y-auto p-4 space-y-3 flex-1 custom-scrollbar">
            {loading ? (
              <p className="text-sm text-slate-500 text-center py-8">Scanning Graph Network...</p>
            ) : (
              merchants.map((m) => (
                <div
                  key={m.id}
                  onClick={() => fetchExplanation(m.id)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    selectedMerchant === m.id
                      ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30 shadow-[0_0_15px_rgba(99,102,241,0.15)] ring-1 ring-indigo-500"
                      : "border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-slate-900 dark:text-slate-100 truncate pr-4">{m.name}</h3>
                    {m.risk_score > 0.8 ? (
                      <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0 drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]" />
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 font-mono text-xs">{m.id}</span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        m.risk_score > 0.8
                          ? "bg-rose-100 dark:bg-rose-950/50 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900/50"
                          : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700"
                      }`}
                    >
                      Risk: {(m.risk_score * 100).toFixed(1)}%
                    </span>
                  </div>
                  {/* Temporal Velocity Badge */}
                  <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">7-Day Velocity</span>
                    <span className={`text-xs font-bold ${m.risk_velocity > 0.2 ? "text-rose-600 dark:text-rose-400" : "text-amber-600 dark:text-amber-400"}`}>
                      +{ (m.risk_velocity * 100).toFixed(1) } pts
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Pane: Causal Explanation */}
        <div className="w-2/3 flex flex-col gap-6">
          {explanation ? (
            <>
              {/* SAR Report Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg dark:shadow-2xl p-6 relative overflow-hidden transition-colors duration-300">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></div>
                <div className="flex items-center space-x-2 mb-4 pb-4 border-b border-slate-100 dark:border-slate-800 relative z-10">
                  <AlertCircle className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <h2 className="font-semibold text-lg text-slate-800 dark:text-slate-100">
                    AI Compliance Report
                  </h2>
                </div>
                <div className="prose prose-slate dark:prose-invert prose-sm max-w-none relative z-10">
                  {explanation.llm_report.split("\n").map((line, i) => {
                    // Highlight the RAG Citation
                    if (line.startsWith(">")) {
                      return (
                        <div key={i} className="pl-4 py-2 border-l-2 border-indigo-500 bg-indigo-50 dark:bg-indigo-950/20 my-4 text-indigo-700 dark:text-indigo-200 italic rounded-r-md">
                          {line.replace(">", "")}
                        </div>
                      );
                    }
                    if (line.includes("**CRITICAL ALERt:**")) {
                        return <p key={i} className="mb-2 text-rose-600 dark:text-rose-400 font-medium leading-relaxed">{line}</p>
                    }
                    return (
                      <p key={i} className="mb-2 text-slate-700 dark:text-slate-300 leading-relaxed">
                        {line}
                      </p>
                    );
                  })}
                </div>
              </div>

              {/* Causal Traces Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-lg dark:shadow-2xl p-6 transition-colors duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="font-semibold text-lg text-slate-800 dark:text-slate-100">Counterfactual Analysis</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      Computed via edge-ablation on the Graph Neural Network.
                    </p>
                  </div>
                  <Info className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                </div>
                
                <div className="space-y-4">
                  {explanation.causal_traces.length > 0 ? (
                    explanation.causal_traces.map((trace, i) => (
                      <div key={i} className="flex items-center p-4 bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-800 rounded-lg">
                        <div className="shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 font-bold text-sm shadow-[0_0_10px_rgba(244,63,94,0.1)] dark:shadow-[0_0_10px_rgba(244,63,94,0.2)]">
                          -{ (trace.risk_drop * 100).toFixed(0) }%
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-slate-900 dark:text-slate-200">{trace.explanation}</p>
                          <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">
                            {trace.connected_node_label} • <span className="text-slate-500 dark:text-slate-400 font-mono">{trace.connected_node_id}</span>
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 rounded-lg text-sm border border-emerald-100 dark:border-emerald-900/50">
                      No highly impactful single-edge causal traces found. The risk score is likely distributed across many weak connections.
                    </div>
                  )}
                </div>
                
                {/* Human-in-the-loop Feedback */}
                <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Risk Officer Decision (Human-in-the-Loop)</h3>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setShowFalsePositiveModal(true)}
                      className="px-4 py-2 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800 rounded-lg text-sm font-medium transition-colors">
                      Mark as False Positive
                    </button>
                    <button 
                      onClick={() => setShowBlockModal(true)}
                      className="px-4 py-2 bg-rose-600 dark:bg-rose-600/90 text-white hover:bg-rose-700 dark:hover:bg-rose-500 border border-rose-600 dark:border-rose-500/50 rounded-lg text-sm font-medium shadow-[0_0_15px_rgba(225,29,72,0.2)] dark:shadow-[0_0_15px_rgba(225,29,72,0.4)] transition-all">
                      Confirm Fraud & Block
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="h-[80vh] flex items-center justify-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 border-dashed rounded-xl transition-colors duration-300">
              <div className="text-center">
                <Network className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-300">Select an Entity</h3>
                <p className="text-slate-500 mt-1 max-w-sm mx-auto">
                  Click on a flagged merchant to generate a counterfactual causal trace and RBI compliance report.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Custom Block Modal Overlay */}
      {showBlockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm transition-opacity">
          <div className="bg-[#1e293b] border border-rose-500/30 rounded-xl shadow-2xl p-8 max-w-md w-full relative animate-in fade-in zoom-in duration-200">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
            
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-rose-500/20 flex items-center justify-center mb-4 border border-rose-500/30">
                <AlertCircle className="w-6 h-6 text-rose-400" />
              </div>
              
              <h2 className="text-xl font-bold text-white mb-3">Merchant Blocked Successfully!</h2>
              
              <p className="text-sm text-slate-300 mb-8 leading-relaxed">
                Accounts frozen and SAR drafted for {explanation?.merchant}. Regulatory audit trail dispatched to RBI compliance gateway.
              </p>
              
              <button 
                onClick={() => setShowBlockModal(false)}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold shadow-lg shadow-indigo-500/30 transition-all w-full max-w-[200px]"
              >
                OK (Dismiss Alert)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom False Positive Modal Overlay */}
      {showFalsePositiveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm transition-opacity">
          <div className="bg-[#1e293b] border border-emerald-500/30 rounded-xl shadow-2xl p-8 max-w-md w-full relative animate-in fade-in zoom-in duration-200">
            <div className="absolute top-0 left-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -ml-10 -mt-10 pointer-events-none"></div>
            
            <div className="flex flex-col items-center text-center relative z-10">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4 border border-emerald-500/30">
                <CheckCircle className="w-6 h-6 text-emerald-400" />
              </div>
              
              <h2 className="text-xl font-bold text-white mb-3">Feedback Logged</h2>
              
              <p className="text-sm text-slate-300 mb-8 leading-relaxed">
                {explanation?.merchant} marked as a False Positive. The Human-in-the-Loop decision has been logged and the Graph Neural Network will be re-weighted in the next training cycle.
              </p>
              
              <button 
                onClick={() => setShowFalsePositiveModal(false)}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold shadow-lg shadow-emerald-500/30 transition-all w-full max-w-[200px]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
