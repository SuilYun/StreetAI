import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Database, Shield, Menu, X, Image as ImageIcon, Video } from 'lucide-react';
import anime from 'animejs';
import useLiveDetection from './hooks/useLiveDetection';
import { checkServerStatus } from './services/api';
import StatsBar from './components/StatsBar';
import VideoPlayer from './components/VideoPlayer';
import DamageRadarChart from './components/DamageRadarChart';
import ManagementDashboard from './components/ManagementDashboard';

function App() {
    const [currentView, setCurrentView] = useState('image'); // 'image', 'video', or 'dashboard'
    const [mediaActive, setMediaActive] = useState(false);
    const [stats, setStats] = useState({
        totalDetections: 0,
        potholes: 0,
        cracks: 0,
        erosion: 0,
        longCracks: 0,
        transCracks: 0,
        alligatorCracks: 0,
        avgConfidence: 0,
    });

    const [isConnected, setIsConnected] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const latestEvent = null;
    const headerRef = useRef(null);
    const menuRef = useRef(null);

    // Header shimmer animation
    useEffect(() => {
        if (headerRef.current) {
            anime({
                targets: headerRef.current,
                backgroundPosition: ['0% 50%', '200% 50%'],
                loop: true,
                easing: 'linear',
                duration: 4000,
            });
        }
    }, []);

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Real-time server connection check
    useEffect(() => {
        const checkStatus = async () => {
            const status = await checkServerStatus();
            setIsConnected(status);
        };
        checkStatus();
        const interval = setInterval(checkStatus, 3000);
        return () => clearInterval(interval);
    }, []);

    const handleMediaStateChange = useCallback((isActive) => {
        setMediaActive(isActive);
    }, []);

    const handleResetStats = useCallback(() => {
        setStats({
            totalDetections: 0,
            potholes: 0,
            cracks: 0,
            erosion: 0,
            longCracks: 0,
            transCracks: 0,
            alligatorCracks: 0,
            avgConfidence: 0,
        });
    }, []);

    const handleAnalysisComplete = useCallback((data) => {
        let issues = [];
        if (data.detected_issues) {
            issues = data.detected_issues;
        } else if (data.timeline) {
            data.timeline.forEach(frame => {
                if (frame.detected_issues) {
                    issues = issues.concat(frame.detected_issues);
                }
            });
        }

        let potholes = 0;
        let cracks = 0;
        let erosion = 0;
        let longCracks = 0;
        let transCracks = 0;
        let alligatorCracks = 0;
        let totalConfidence = 0;

        issues.forEach(issue => {
            if (issue.type.includes('Pothole') || issue.type.includes('D40')) potholes++;
            else if (issue.type.includes('Erosion') || issue.type.includes('Healthy') || issue.type.includes('Safe')) erosion++;
            else {
                cracks++;
                if (issue.type === 'Long. Cracks' || issue.type.includes('Longitudinal') || issue.type.includes('D00')) longCracks++;
                else if (issue.type === 'Trans. Cracks' || issue.type.includes('Transverse') || issue.type.includes('D10')) transCracks++;
                else if (issue.type === 'Alligator Cracks' || issue.type.includes('Alligator') || issue.type.includes('D20')) alligatorCracks++;
            }
            totalConfidence += issue.confidence * 100;
        });

        const avgConfidence = issues.length > 0 ? parseFloat((totalConfidence / issues.length).toFixed(1)) : 0;

        setStats(prev => ({
            totalDetections: prev.totalDetections + issues.length,
            potholes: prev.potholes + potholes,
            cracks: prev.cracks + cracks,
            erosion: prev.erosion + erosion,
            longCracks: prev.longCracks + longCracks,
            transCracks: prev.transCracks + transCracks,
            alligatorCracks: prev.alligatorCracks + alligatorCracks,
            avgConfidence: avgConfidence > 0 ? avgConfidence : prev.avgConfidence,
        }));
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-4 lg:p-6">
            {/* Header */}
            <header className="mb-6 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    {/* Hamburger Menu in the top left */}
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="p-2.5 text-slate-600 hover:text-blue-600 hover:bg-slate-100/80 active:bg-slate-200/80 rounded-xl border border-slate-200/60 transition-all flex items-center justify-center shadow-sm bg-white"
                            aria-label="Toggle Navigation Menu"
                        >
                            {menuOpen ? <X size={20} /> : <Menu size={20} />}
                        </button>

                        {menuOpen && (
                            <div className="absolute left-0 mt-2 w-56 bg-white rounded-xl border border-slate-200/80 shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                <button
                                    onClick={() => {
                                        setCurrentView('image');
                                        setMenuOpen(false);
                                    }}
                                    className={`w-full px-4 py-2.5 text-left flex items-center gap-3 text-sm font-medium transition-all ${
                                        currentView === 'image'
                                            ? 'bg-blue-50/60 text-blue-600 font-semibold'
                                            : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                                    }`}
                                >
                                    <ImageIcon size={16} />
                                    Image Option
                                </button>
                                <button
                                    onClick={() => {
                                        setCurrentView('video');
                                        setMenuOpen(false);
                                    }}
                                    className={`w-full px-4 py-2.5 text-left flex items-center gap-3 text-sm font-medium transition-all ${
                                        currentView === 'video'
                                            ? 'bg-blue-50/60 text-blue-600 font-semibold'
                                            : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                                    }`}
                                >
                                    <Video size={16} />
                                    Video Option
                                </button>
                                <button
                                    onClick={() => {
                                        setCurrentView('dashboard');
                                        setMenuOpen(false);
                                    }}
                                    className={`w-full px-4 py-2.5 text-left flex items-center gap-3 text-sm font-medium transition-all ${
                                        currentView === 'dashboard'
                                            ? 'bg-blue-50/60 text-blue-600 font-semibold'
                                            : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                                    }`}
                                >
                                    <Database size={16} />
                                    Previous Reports
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Logo */}
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
                        <Shield size={22} className="text-white" />
                    </div>
                    <div>
                        <h1
                            ref={headerRef}
                            className="text-2xl font-bold text-slate-800"
                            style={{
                                backgroundImage: 'linear-gradient(90deg, #3b82f6, #06b6d4, #3b82f6)',
                                backgroundSize: '200% auto',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            RoadAI
                        </h1>
                        <p className="text-sm text-slate-500">
                            Real-time road damage detection & analytics
                        </p>
                    </div>
                </div>
            </header>

            {currentView === 'dashboard' ? (
                <ManagementDashboard />
            ) : (
                <>
                    {/* Stats Row */}
                    <div className="mb-5">
                        <StatsBar stats={stats} isConnected={isConnected} />
                    </div>

                    {/* Main Grid: Video + Radar Chart Sidebar */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
                        <div className="lg:col-span-2">
                            <VideoPlayer
                                latestEvent={latestEvent}
                                onMediaStateChange={handleMediaStateChange}
                                onAnalysisComplete={handleAnalysisComplete}
                                activeMode={currentView}
                                onModeChange={(mode) => setCurrentView(mode)}
                                onReset={handleResetStats}
                            />
                        </div>
                        <div className="lg:col-span-1">
                            <DamageRadarChart stats={stats} />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default App;
