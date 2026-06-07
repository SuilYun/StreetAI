import React, { useEffect, useRef } from 'react';
import anime from 'animejs';
import { BarChart3 } from 'lucide-react';
import {
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    ResponsiveContainer,
    Tooltip,
} from 'recharts';

const DamageRadarChart = ({ stats }) => {
    const chartRef = useRef(null);

    useEffect(() => {
        if (chartRef.current) {
            anime({
                targets: chartRef.current,
                scale: [0.9, 1],
                opacity: [0, 1],
                easing: 'easeOutElastic(1, .8)',
                duration: 1000,
                delay: 200
            });
        }
    }, []);
    const rawData = [
        { category: 'Potholes', count: stats.potholes, color: '#ef4444', bg: 'bg-red-50' },
        { category: 'Longitudinal Cracks', count: stats.longCracks, color: '#f59e0b', bg: 'bg-amber-50' },
        { category: 'Transverse Cracks', count: stats.transCracks, color: '#8b5cf6', bg: 'bg-violet-50' },
        { category: 'Alligator Cracks', count: stats.alligatorCracks, color: '#10b981', bg: 'bg-emerald-50' },
    ];

    const chartData = rawData.map(d => ({ category: d.category, value: d.count * 3 }));

    // Normalize to max 100
    const maxVal = Math.max(...chartData.map((d) => d.value), 1);
    const normalizedData = chartData.map((d) => ({
        ...d,
        value: Math.min(Math.round((d.value / maxVal) * 100), 100),
        fullMark: 100,
    }));

    const totalIssues = rawData.reduce((sum, d) => sum + d.count, 0);

    return (
        <div ref={chartRef} className="glass-panel p-4 flex flex-col gap-4 h-full min-h-0 overflow-y-auto">
            <h3 className="text-sm font-semibold text-mission-100 dark:text-slate-100">Damage Profile</h3>
            
            {totalIssues === 0 ? (
                <div className="flex flex-col items-center justify-center h-[220px] text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50/50 dark:bg-slate-900/30 p-4">
                    <div className="w-12 h-12 rounded-full bg-slate-100/80 dark:bg-slate-800 flex items-center justify-center mb-3">
                        <BarChart3 className="text-slate-400 dark:text-slate-500 w-6 h-6" />
                    </div>
                    <p className="text-slate-700 dark:text-slate-200 text-xs font-semibold">Awaiting Damage Data</p>
                    <p className="text-slate-400 dark:text-slate-500 text-[10px] max-w-[200px] mt-1">
                        Upload and analyze road media on the dashboard to generate the damage profile.
                    </p>
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={220}>
                    <RadarChart cx="50%" cy="50%" outerRadius="70%" data={normalizedData}>
                        <defs>
                            <linearGradient id="radarGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.2}/>
                            </linearGradient>
                        </defs>
                        <PolarGrid stroke="rgba(100, 116, 139, 0.15)" />
                        <PolarAngleAxis
                            dataKey="category"
                            tick={{ fill: '#64748b', fontSize: 11 }}
                        />
                        <PolarRadiusAxis
                            angle={90}
                            domain={[0, 100]}
                            tick={false}
                            axisLine={false}
                        />
                        <Radar
                            name="Damage"
                            dataKey="value"
                            stroke="#06b6d4"
                            fill="url(#radarGradient)"
                            fillOpacity={1}
                            strokeWidth={2}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#ffffff',
                                border: '1px solid #e2e8f0',
                                borderRadius: '8px',
                                color: '#334155',
                                fontSize: '12px',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                            }}
                        />
                    </RadarChart>
                </ResponsiveContainer>
            )}

            {/* Data Breakdown */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-3">
                <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Breakdown</span>
                    <span className="text-xs font-mono text-slate-400 dark:text-slate-500">{totalIssues} total</span>
                </div>
                <div className="flex flex-col gap-2.5">
                    {rawData.map((item) => (
                        <div key={item.category} className="flex items-start gap-3">
                            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1" style={{ backgroundColor: item.color }} />
                            <span className="text-xs text-slate-600 dark:text-slate-300 flex-1 leading-tight">{item.category}</span>
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-100 w-6 text-right mt-0.5">{item.count}</span>
                            <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-700"
                                    style={{
                                        width: totalIssues > 0 ? `${(item.count / totalIssues) * 100}%` : '0%',
                                        backgroundColor: item.color,
                                    }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DamageRadarChart;
