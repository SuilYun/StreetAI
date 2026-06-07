import React, { useState, useEffect } from 'react';
import HeatmapView, { DEFAULT_ZONES } from '../components/HeatmapView';
import { AlertTriangle, MapPin, Activity, RotateCcw } from 'lucide-react';

const LiveMap = () => {
    const [mapCenter, setMapCenter] = useState([12.9716, 77.5946]);
    const [mapZoom, setMapZoom] = useState(11);
    const [selectedZoneId, setSelectedZoneId] = useState(null);
    const [logs, setLogs] = useState([
        { time: '22:45:01', msg: 'System initialized on Bengaluru grid.' },
        { time: '22:45:03', msg: 'Connecting to AWS IoT stream... Connected.' },
        { time: '22:45:08', msg: 'Mapping server listening on port 8000.' },
    ]);

    useEffect(() => {
        const simulatedMsgs = [
            'Pothole detected at MG Road. Severity: HIGH.',
            'Alligator Crack detected at Koramangala. Severity: HIGH.',
            'Transverse Crack detected at Hebbal Flyover. Severity: MEDIUM.',
            'Longitudinal Crack detected at Jayanagar. Severity: LOW.',
            'Pothole detected at Outer Ring Road. Severity: HIGH.',
            'Longitudinal Crack detected at Indiranagar. Severity: MEDIUM.',
            'Pothole detected at Whitefield Main Road. Severity: HIGH.',
            'Alligator Crack detected at Malleshwaram. Severity: MEDIUM.',
            'Transverse Crack detected at Bannerghatta Road. Severity: LOW.',
            'Pothole detected at Richmond Road. Severity: HIGH.',
            'Pothole detected at HSR Layout. Severity: MEDIUM.',
        ];
        const interval = setInterval(() => {
            const time = new Date().toLocaleTimeString('en-US', { hour12: false });
            const randomMsg = simulatedMsgs[Math.floor(Math.random() * simulatedMsgs.length)];
            setLogs((prev) => [{ time, msg: randomMsg }, ...prev.slice(0, 15)]);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleZoneClick = (zone) => {
        setMapCenter([zone.lat, zone.lng]);
        setMapZoom(14);
        setSelectedZoneId(zone.id);
    };

    const handleReset = () => {
        setMapCenter([12.9716, 77.5946]);
        setMapZoom(11);
        setSelectedZoneId(null);
    };

    const getSeverityBadgeColor = (severity) => {
        switch (severity) {
            case 'High': return 'bg-red-500/10 text-red-500 border-red-500/20';
            case 'Medium': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
            case 'Low': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
            default: return 'bg-slate-500/10 text-slate-500 border-slate-500/20';
        }
    };

    return (
        <div className="flex-1 min-h-0 flex flex-col gap-4">
            {/* Page Header */}
            <div className="flex-shrink-0 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                    <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <Activity size={24} className="text-blue-500" />
                        Geographical Heatmap
                    </h2>
                    <p className="text-xs text-slate-400 mt-1">GPS locations and distribution density of detected road defects</p>
                </div>
                <button 
                    onClick={handleReset}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-200 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 transition-all cursor-pointer shadow-sm"
                >
                    <RotateCcw size={12} />
                    Reset View
                </button>
            </div>

            {/* Layout container */}
            <div className="flex-1 min-h-0 flex flex-col lg:flex-row gap-4">
                {/* Map Area */}
                <div className="flex-grow min-h-[400px] lg:min-h-0 overflow-hidden relative rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
                    <HeatmapView 
                        height="100%" 
                        hideHeader={true} 
                        center={mapCenter} 
                        zoom={mapZoom} 
                        selectedZoneId={selectedZoneId}
                    />
                </div>
                
                {/* Sidebar Area */}
                <div className="w-full lg:w-80 flex flex-col gap-4 flex-shrink-0 lg:overflow-y-auto pr-1">
                    {/* Caution / Warning Panel */}
                    <div className="glass-panel p-4 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/40 dark:bg-amber-950/10 flex gap-3 shadow-sm">
                        <AlertTriangle className="text-amber-500 flex-shrink-0 font-bold" size={24} />
                        <div className="flex flex-col gap-1">
                            <span className="text-xs font-bold text-amber-800 dark:text-amber-400">Feature Warning</span>
                            <p className="text-[11px] text-amber-700 dark:text-amber-450 leading-relaxed font-medium">
                                GPS mapping is currently in simulation mode. Direct video feed and live-stream telemetry integration will be active in the next major version.
                            </p>
                        </div>
                    </div>

                    {/* Live Incidents Panel */}
                    <div className="glass-panel flex-1 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden flex flex-col">
                        <div className="px-4 py-3 border-b border-slate-200/50 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800 flex-shrink-0">
                            <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Hotspots (Bengaluru)</span>
                            <span className="text-[10px] bg-blue-500/10 text-blue-500 font-bold px-2 py-0.5 rounded-full border border-blue-500/20">
                                {DEFAULT_ZONES.length} Alerts
                            </span>
                        </div>

                        <div className="flex-grow overflow-y-auto p-3 flex flex-col gap-2">
                            {DEFAULT_ZONES.map((zone) => {
                                const isActive = zone.id === selectedZoneId;
                                return (
                                    <button
                                        key={zone.id}
                                        onClick={() => handleZoneClick(zone)}
                                        className={`w-full text-left p-3 rounded-lg border transition-all flex flex-col gap-2 cursor-pointer
                                            ${isActive 
                                                ? 'bg-blue-500/5 border-blue-500 shadow-sm dark:bg-blue-950/20' 
                                                : 'bg-slate-50 hover:bg-slate-100 border-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:hover:bg-slate-700 dark:hover:border-slate-600'}
                                        `}
                                    >
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                                                <MapPin size={12} className={isActive ? "text-blue-500" : "text-slate-400"} />
                                                {zone.location.split(',')[0]}
                                            </span>
                                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded border ${getSeverityBadgeColor(zone.severity)}`}>
                                                {zone.severity.toUpperCase()}
                                            </span>
                                        </div>
                                        
                                        <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                                            <span>{zone.issues}</span>
                                            <span className="font-mono">{zone.time}</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Operations Terminal */}
                    <div className="glass-panel h-48 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-950 dark:bg-slate-950 overflow-hidden flex flex-col font-mono text-[10px] text-cyan-400 flex-shrink-0">
                        <div className="px-3 py-2 border-b border-slate-850 flex items-center justify-between bg-slate-900 text-slate-400">
                            <span className="font-bold flex items-center gap-1.5 uppercase tracking-wider text-[9px] text-cyan-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse"></span>
                                Live Scan Telemetry
                            </span>
                            <span className="text-[8px] font-mono bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                                ACTIVE
                            </span>
                        </div>
                        <div className="flex-1 overflow-y-auto p-3 flex flex-col-reverse gap-1.5 select-text">
                            {logs.map((log, idx) => (
                                <div key={idx} className="flex gap-2">
                                    <span className="text-blue-500 font-semibold flex-shrink-0 select-none">[{log.time}]</span>
                                    <span className="text-cyan-300 leading-normal">{log.msg}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LiveMap;
