import React from 'react';
import { ShieldAlert, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';
import DamageRadarChart from '../components/DamageRadarChart';

const Analytics = ({ stats }) => {
    const totalIssues = stats.potholes + stats.longCracks + stats.transCracks + stats.alligatorCracks;

    const getSystemHealth = () => {
        if (stats.potholes > 10 || stats.alligatorCracks > 5) return { label: 'Urgent Maintenance Required', color: 'text-red-500 bg-red-50 border-red-200' };
        if (totalIssues > 5) return { label: 'Caution: Road Anomalies Detected', color: 'text-amber-500 bg-amber-50 border-amber-200' };
        return { label: 'Road Infrastructure Stable', color: 'text-green-500 bg-green-50 border-green-200' };
    };

    const health = getSystemHealth();

    return (
        <div className="flex-1 min-h-0 flex flex-col gap-5 overflow-y-auto pr-1">
            {/* Page Header */}
            <div className="flex-shrink-0 flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Analytics Insights</h2>
                    <p className="text-xs text-slate-400">Detailed damage profile & predictive maintenance metrics</p>
                </div>
                <div className={`px-4 py-2 rounded-xl border text-xs font-semibold ${health.color} flex items-center gap-2`}>
                    <ShieldAlert size={14} />
                    {health.label}
                </div>
            </div>

            {/* Main Visualizations Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch min-h-0 flex-1">
                {/* Left side: Radar & Breakdown */}
                <div className="lg:col-span-2 flex flex-col min-h-0">
                    <DamageRadarChart stats={stats} />
                </div>

                {/* Right side: Insights & Actions */}
                <div className="lg:col-span-1 flex flex-col gap-4">
                    {/* Summary Card */}
                    <div className="glass-panel p-4 flex flex-col justify-between border border-slate-200/60 bg-white">
                        <h3 className="text-sm font-semibold text-slate-800 mb-3">Defect Severity Summary</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-500">Average AI Confidence</span>
                                <span className="font-mono font-bold text-cyan-600 bg-cyan-50 px-2.5 py-0.5 rounded-lg border border-cyan-100">{stats.avgConfidence}%</span>
                            </div>
                            <div className="flex justify-between items-center text-xs">
                                <span className="text-slate-500">Total Anomalies Identified</span>
                                <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-lg border border-slate-200/60">{totalIssues}</span>
                            </div>
                        </div>
                    </div>

                    {/* AI Maintenance Advisory */}
                    <div className="glass-panel p-4 flex flex-col flex-1 border border-slate-200/60 bg-white min-h-[220px]">
                        <h3 className="text-sm font-semibold text-slate-800 mb-3">AI Maintenance Advisory</h3>
                        <div className="flex-1 overflow-y-auto space-y-3.5 pr-0.5">
                            {totalIssues === 0 ? (
                                <div className="flex flex-col items-center justify-center text-center h-full py-6">
                                    <CheckCircle2 size={36} className="text-emerald-500 mb-2" />
                                    <p className="text-xs font-semibold text-slate-700">Infrastructure Clean</p>
                                    <p className="text-[11px] text-slate-400 mt-1">No active defects require scheduling.</p>
                                </div>
                            ) : (
                                <>
                                    {stats.potholes > 0 && (
                                        <div className="flex gap-3 p-3 rounded-xl bg-red-50/50 border border-red-100 text-xs">
                                            <AlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={16} />
                                            <div>
                                                <h4 className="font-bold text-red-900">Asphalt Patching Recommended</h4>
                                                <p className="text-red-700/80 text-[11px] mt-0.5">Detected {stats.potholes} active potholes. Prioritize cold-mix or hot asphalt filling before weather erosion expands defect diameter.</p>
                                            </div>
                                        </div>
                                    )}
                                    {(stats.alligatorCracks > 0 || stats.longCracks > 0 || stats.transCracks > 0) && (
                                        <div className="flex gap-3 p-3 rounded-xl bg-amber-50/50 border border-amber-100 text-xs">
                                            <TrendingUp className="text-amber-500 flex-shrink-0 mt-0.5" size={16} />
                                            <div>
                                                <h4 className="font-bold text-amber-900">Crack Sealing Advisory</h4>
                                                <p className="text-amber-700/80 text-[11px] mt-0.5">Fissures present on road surface. Schedule routing and rubberized crack sealing to block sub-base water penetration.</p>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Analytics;
