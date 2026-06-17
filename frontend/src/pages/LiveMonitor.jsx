import React from 'react';
import DamageRadarChart from '../components/DamageRadarChart';
import EventTerminal from '../components/EventTerminal';
import { Activity, ShieldAlert, CheckCircle2, AlertTriangle, TrendingUp, RefreshCw } from 'lucide-react';

export default function LiveMonitor({ events, stats, handleResetStats, setEvents, isConnected }) {
    const totalIssues = stats.potholes + stats.longCracks + stats.transCracks + stats.alligatorCracks;

    const getSystemHealth = () => {
        if (stats.potholes > 10 || stats.alligatorCracks > 5) {
            return {
                label: 'Urgent Action Required',
                color: 'text-red-500 bg-red-500/5 border-red-500/20 dark:border-red-900/30',
                desc: 'Severe damage anomalies detected. Dispatch patch crews immediately.'
            };
        }
        if (totalIssues > 5) {
            return {
                label: 'Caution: Surface Defects Present',
                color: 'text-amber-500 bg-amber-500/5 border-amber-500/20 dark:border-amber-900/30',
                desc: 'Minor anomalies detected. Schedule preventive joint repairs.'
            };
        }
        return {
            label: 'System Diagnostics Healthy',
            color: 'text-emerald-500 bg-emerald-500/5 border-emerald-500/20 dark:border-emerald-900/30',
            desc: 'Continuous surveillance active. No critical structural warnings logged.'
        };
    };

    const health = getSystemHealth();

    return (
        <div className="flex-1 min-h-0 flex flex-col gap-5 overflow-y-auto pr-1">
            {/* Header section */}
            <div className="flex-shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <Activity className="text-cyan-500 animate-pulse" size={22} />
                        Live Telemetry Monitor
                    </h2>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                        Real-time AI telemetry feed, structural damage profiles, and maintenance advisories
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {stats.totalDetections > 0 && (
                        <button
                            onClick={() => {
                                handleResetStats();
                                setEvents([]);
                            }}
                            className="text-xs px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl border border-slate-200 dark:border-slate-700 font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                        >
                            <RefreshCw size={12} />
                            Reset Diagnostics
                        </button>
                    )}
                    <div className={`px-3 py-1.5 rounded-xl border text-xs font-semibold ${isConnected ? 'bg-emerald-500/5 text-emerald-500 border-emerald-500/10' : 'bg-red-500/5 text-red-500 border-red-500/10'} flex items-center gap-1.5`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                        {isConnected ? 'Server Sync Active' : 'Offline'}
                    </div>
                </div>
            </div>

            {/* Health Diagnostics Panel */}
            <div className={`flex-shrink-0 glass-panel p-4 border rounded-2xl flex items-start gap-4 bg-white dark:bg-slate-900 ${health.color}`}>
                <ShieldAlert size={24} className="flex-shrink-0 mt-0.5" />
                <div>
                    <h3 className="text-sm font-bold tracking-wide uppercase">{health.label}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">{health.desc}</p>
                </div>
            </div>

            {/* 3-Column Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 items-stretch min-h-0 flex-grow pb-4">
                {/* Damage Profile */}
                <div className="h-[480px] xl:h-auto min-h-[420px] flex flex-col">
                    <DamageRadarChart stats={stats} />
                </div>

                {/* Event Terminal */}
                <div className="h-[480px] xl:h-auto min-h-[420px] flex flex-col">
                    <EventTerminal events={events} />
                </div>

                {/* AI Advisory Panel */}
                <div className="h-[480px] xl:h-auto min-h-[420px] glass-panel p-5 flex flex-col bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                        AI Maintenance Advisory
                    </h3>
                    
                    <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                        {totalIssues === 0 ? (
                            <div className="flex flex-col items-center justify-center text-center h-full py-10">
                                <CheckCircle2 size={40} className="text-emerald-500 mb-3" />
                                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">
                                    Diagnostic Registry Clear
                                </h4>
                                <p className="text-[10px] text-slate-400 dark:text-slate-500 max-w-[200px] mt-1.5 leading-relaxed">
                                    No surface anomalies logged. Initiate media processing on the dashboard to trigger real-time repairs guidance.
                                </p>
                            </div>
                        ) : (
                            <>
                                <div className="space-y-1">
                                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Priority Schedule</span>
                                    <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
                                        <div style={{ width: `${(stats.potholes / totalIssues) * 100}%` }} className="bg-red-500 h-full" />
                                        <div style={{ width: `${((stats.longCracks + stats.transCracks + stats.alligatorCracks) / totalIssues) * 100}%` }} className="bg-amber-500 h-full" />
                                    </div>
                                </div>

                                {stats.potholes > 0 && (
                                    <div className="flex gap-3 p-3.5 rounded-xl bg-red-500/5 border border-red-500/10 text-xs shadow-sm shadow-red-500/2">
                                        <AlertTriangle className="text-red-500 flex-shrink-0 mt-0.5 animate-bounce" size={18} />
                                        <div>
                                            <h4 className="font-bold text-red-900 dark:text-red-300">Emergency Asphalt Filling</h4>
                                            <p className="text-red-600 dark:text-red-400/90 text-[10px] mt-1 leading-relaxed font-medium">
                                                Identified {stats.potholes} active potholes. Direct asphalt filling is required to mitigate high-speed vehicle impact risks and water erosion.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {(stats.alligatorCracks > 0 || stats.longCracks > 0 || stats.transCracks > 0) && (
                                    <div className="flex gap-3 p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/10 text-xs shadow-sm shadow-amber-500/2">
                                        <TrendingUp className="text-amber-500 flex-shrink-0 mt-0.5" size={18} />
                                        <div>
                                            <h4 className="font-bold text-amber-900 dark:text-amber-300">Preventative Joint Sealing</h4>
                                            <p className="text-amber-600 dark:text-amber-400/90 text-[10px] mt-1 leading-relaxed font-medium">
                                                Cracking detected: {stats.longCracks} long, {stats.transCracks} trans, and {stats.alligatorCracks} alligator anomalies. Schedule sealing to halt deep sub-base water damage.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
