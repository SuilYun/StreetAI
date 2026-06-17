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
    events,
    setEvents,
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
    const totalIssues = stats.potholes + stats.longCracks + stats.transCracks + stats.alligatorCracks;

    const getSystemHealth = () => {
        if (stats.potholes > 10 || stats.alligatorCracks > 5) return { label: 'Urgent Action Required', color: 'text-red-500 bg-red-500/5 border-red-500/25' };
        if (totalIssues > 5) return { label: 'Caution: Road Defects Present', color: 'text-amber-500 bg-amber-500/5 border-amber-500/25' };
        return { label: 'Road Status Stable', color: 'text-green-500 bg-green-500/5 border-green-500/25' };
    };

    const health = getSystemHealth();

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

            {/* Layout Grid (Full Width Optimized) */}
            <div className="flex-grow flex flex-col gap-4 min-h-0 w-full">
                <div className="flex-shrink-0">
                    <StatsBar stats={stats} isConnected={isConnected} />
                </div>
 
                <div className="flex-grow flex-1 min-h-[450px] flex flex-col">
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
        </div>
    );
};

export default Dashboard;
