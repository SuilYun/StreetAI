import React, { useState, useEffect } from 'react';
import StatsBar from '../components/StatsBar';
import VideoPlayer from '../components/VideoPlayer';
import DamageRadarChart from '../components/DamageRadarChart';
import EventTerminal from '../components/EventTerminal';
import { ShieldAlert, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';

const Dashboard = ({
    stats,
    isConnected,
    latestEvent,
    handleMediaStateChange,
    handleAnalysisComplete,
    handleResetStats,
    activeMode,
    setActiveMode,
    uploadedSrc,
    setUploadedSrc,
    uploadedFile,
    setUploadedFile,
    fileName,
    setFileName,
    analysisState,
    setAnalysisState,
    analysisResults,
    setAnalysisResults,
    analysisProgress,
    setAnalysisProgress,
    analysisTime,
    setAnalysisTime,
    imageLoaded,
    setImageLoaded,
}) => {
    const [events, setEvents] = useState([]);

    // Pipe latestEvent into the EventTerminal events list
    useEffect(() => {
        if (latestEvent) {
            setEvents((prev) => {
                if (prev.some((e) => e.id === latestEvent.id)) return prev;

                const formatType = (type) => {
                    if (type.includes('Pothole') || type.includes('D40')) return 'Pothole';
                    if (type.includes('Erosion') || type.includes('Surface') || type.includes('Healthy') || type.includes('Safe')) return 'Surface Erosion';
                    return 'Crack';
                };

                const newEvent = {
                    id: latestEvent.id || Math.random().toString(),
                    type: formatType(latestEvent.type),
                    confidence: latestEvent.confidence,
                    timestamp: latestEvent.timestamp || new Date().toISOString(),
                };
                return [newEvent, ...prev].slice(0, 100);
            });
        }
    }, [latestEvent]);

    const totalIssues = stats.potholes + stats.longCracks + stats.transCracks + stats.alligatorCracks;

    const getSystemHealth = () => {
        if (stats.potholes > 10 || stats.alligatorCracks > 5) return { label: 'Urgent Action Required', color: 'text-red-500 bg-red-500/5 border-red-500/25' };
        if (totalIssues > 5) return { label: 'Caution: Road Defects Present', color: 'text-amber-500 bg-amber-500/5 border-amber-500/25' };
        return { label: 'Road Status Stable', color: 'text-green-500 bg-green-500/5 border-green-500/25' };
    };

    const health = getSystemHealth();

    // Reset local events when global stats are reset
    useEffect(() => {
        if (stats.totalDetections === 0) {
            setEvents([]);
        }
    }, [stats.totalDetections]);

    return (
        <div className="flex-1 min-h-0 flex flex-col gap-4 overflow-y-auto pr-1">
            {/* Header / Info bar */}
            <div className="flex-shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <ShieldAlert className="text-blue-500" size={22} />
                        Incident Control Room
                    </h2>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                        Real-time AI surface inspection and road infrastructure analysis
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {stats.totalDetections > 0 && (
                        <button
                            onClick={() => {
                                handleResetStats();
                                setEvents([]);
                            }}
                            className="text-xs px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700 font-semibold cursor-pointer"
                        >
                            Reset System Data
                        </button>
                    )}
                    <div className={`px-3 py-1.5 rounded-lg border text-xs font-semibold ${health.color} flex items-center gap-1.5`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                        {health.label}
                    </div>
                </div>
            </div>

            {/* Layout Grid */}
            <div className="flex-grow flex flex-col lg:flex-row gap-5 items-stretch min-h-0">
                {/* Left Side: StatsBar + Media Analyzer (2/3 width) */}
                <div className="flex-1 lg:max-w-[65%] flex flex-col gap-4 min-h-0">
                    <div className="flex-shrink-0">
                        <StatsBar stats={stats} isConnected={isConnected} />
                    </div>

                    <div className="flex-1 min-h-[420px] flex flex-col">
                        <VideoPlayer
                            latestEvent={latestEvent}
                            onMediaStateChange={handleMediaStateChange}
                            onAnalysisComplete={handleAnalysisComplete}
                            onReset={handleResetStats}
                            activeMode={activeMode}
                            onModeChange={setActiveMode}
                            uploadedSrc={uploadedSrc}
                            setUploadedSrc={setUploadedSrc}
                            uploadedFile={uploadedFile}
                            setUploadedFile={setUploadedFile}
                            fileName={fileName}
                            setFileName={setFileName}
                            analysisState={analysisState}
                            setAnalysisState={setAnalysisState}
                            analysisResults={analysisResults}
                            setAnalysisResults={setAnalysisResults}
                            analysisProgress={analysisProgress}
                            setAnalysisProgress={setAnalysisProgress}
                            analysisTime={analysisTime}
                            setAnalysisTime={setAnalysisTime}
                            imageLoaded={imageLoaded}
                            setImageLoaded={setImageLoaded}
                        />
                    </div>
                </div>

                {/* Right Side: DamageRadar + Live Terminal (1/3 width) */}
                <div className="w-full lg:max-w-[35%] flex flex-col gap-4 flex-shrink-0 min-h-0">
                    {/* Radar Chart */}
                    <div className="h-[300px] flex-shrink-0">
                        <DamageRadarChart stats={stats} />
                    </div>

                    {/* Live Event Terminal */}
                    <div className="flex-1 min-h-[220px] max-h-[300px]">
                        <EventTerminal events={events} />
                    </div>

                    {/* Quick Maintenance Advisory */}
                    <div className="glass-panel p-4 flex flex-col flex-shrink-0 bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800">
                        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-2.5">
                            AI Advisory Panel
                        </h3>
                        <div className="space-y-3.5 max-h-[180px] overflow-y-auto pr-1">
                            {totalIssues === 0 ? (
                                <div className="flex flex-col items-center justify-center text-center py-4">
                                    <CheckCircle2 size={32} className="text-emerald-500 mb-2" />
                                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                                        Scan Clean: Roads Intact
                                    </p>
                                    <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                                        Start a live CCTV scan or upload media to populate structural recommendations.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {stats.potholes > 0 && (
                                        <div className="flex gap-2.5 p-2.5 rounded-lg bg-red-500/5 border border-red-500/10 text-xs">
                                            <AlertTriangle className="text-red-500 flex-shrink-0 mt-0.5" size={15} />
                                            <div>
                                                <h4 className="font-bold text-red-900 dark:text-red-300">Asphalt Filling Scheduled</h4>
                                                <p className="text-red-600 dark:text-red-400/90 text-[10px] mt-0.5">
                                                    Identified {stats.potholes} active potholes. cold-mix patching recommended immediately to prevent widening.
                                                </p>
                                            </div>
                                        </div>
                                    )}
                                    {(stats.alligatorCracks > 0 || stats.longCracks > 0 || stats.transCracks > 0) && (
                                        <div className="flex gap-2.5 p-2.5 rounded-lg bg-amber-500/5 border border-amber-500/10 text-xs">
                                            <TrendingUp className="text-amber-500 flex-shrink-0 mt-0.5" size={15} />
                                            <div>
                                                <h4 className="font-bold text-amber-900 dark:text-amber-300">Joint Sealing Required</h4>
                                                <p className="text-amber-600 dark:text-amber-400/90 text-[10px] mt-0.5">
                                                    Fissures detected. Schedule rubberized crack sealing to block sub-base water infiltration.
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
        </div>
    );
};

export default Dashboard;
