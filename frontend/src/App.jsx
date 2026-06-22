import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { checkServerStatus } from './services/api';
import Sidebar from './components/Sidebar';

const Landing = lazy(() => import('./pages/Landing'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Reports = lazy(() => import('./pages/Reports'));
const LiveMap = lazy(() => import('./pages/LiveMap'));
const LiveMonitor = lazy(() => import('./pages/LiveMonitor'));
const MishmiPage = lazy(() => import('./pages/Mishmi/MishmiPage'));

function App() {
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem('theme') === 'dark';
    });

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [darkMode]);

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
    const [latestEvent, setLatestEvent] = useState(null);
    const [events, setEvents] = useState([]);

    // Lifted analysis state from VideoPlayer to persist across view transitions
    const [activeMode, setActiveMode] = useState('image');
    const [uploadedSrc, setUploadedSrc] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [fileName, setFileName] = useState('');
    const [analysisState, setAnalysisState] = useState('idle');
    const [analysisProgress, setAnalysisProgress] = useState(0);
    const [analysisResults, setAnalysisResults] = useState(null);
    const [analysisTime, setAnalysisTime] = useState(0);
    const [imageLoaded, setImageLoaded] = useState(false);

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

    // Pipe latestEvent into global events list
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

    // Reset local events when global stats are reset
    useEffect(() => {
        if (stats.totalDetections === 0) {
            setEvents([]);
        }
    }, [stats.totalDetections]);

    const handleMediaStateChange = useCallback((isActive) => {
        setMediaActive(isActive);
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

        if (issues.length > 0) {
            setLatestEvent({
                ...issues[issues.length - 1],
                timestamp: new Date().toISOString()
            });
        }

        let potholes = 0;
        let cracks = 0;
        let erosion = 0;
        let longCracks = 0;
        let textCracks = 0;
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

        setStats(prev => {
            const nextDetections = prev.totalDetections + issues.length;
            const prevConfidenceSum = prev.totalDetections * prev.avgConfidence;
            const newConfidenceSum = prevConfidenceSum + totalConfidence;
            const newAvgConfidence = nextDetections > 0 ? parseFloat((newConfidenceSum / nextDetections).toFixed(1)) : 0;

            return {
                totalDetections: nextDetections,
                potholes: prev.potholes + potholes,
                cracks: prev.cracks + cracks,
                erosion: prev.erosion + erosion,
                longCracks: prev.longCracks + longCracks,
                transCracks: prev.transCracks + transCracks,
                alligatorCracks: prev.alligatorCracks + alligatorCracks,
                avgConfidence: newAvgConfidence,
            };
        });
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

    return (
        <Router>
            <Suspense fallback={
                <div className="h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-400 dark:text-slate-500 font-semibold text-xs gap-3">
                    <div className="w-8 h-8 rounded-full border-2 border-blue-500 border-t-transparent animate-spin"></div>
                    <span>Initializing StreetScan AI...</span>
                </div>
            }>
                <Routes>
                    {/* Landing page — full-screen, no sidebar */}
                    <Route path="/" element={<Landing />} />
                    <Route path="/mishmi" element={<MishmiPage />} />

                    {/* App routes — with sidebar */}
                    <Route path="/*" element={
                        <div className="h-dvh lg:h-screen overflow-hidden flex flex-col lg:flex-row bg-slate-50 dark:bg-slate-950 relative">
                            {/* Decorative blur blobs for glassmorphism backdrop texture */}
                            <div className="absolute top-[-10%] left-[-10%] w-[35%] h-[35%] rounded-full bg-blue-500/5 dark:bg-blue-500/10 blur-[130px] pointer-events-none z-0" />
                            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-orange-500/5 dark:bg-orange-500/10 blur-[130px] pointer-events-none z-0" />
                            
                            <Sidebar isConnected={isConnected} darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} />
                            <main className="flex-1 min-h-0 p-3 sm:p-4 lg:p-6 flex flex-col overflow-hidden z-10 pb-20 lg:pb-6 mobile-main-content lg:!pb-6">
                                <Routes>
                                    <Route
                                        path="/dashboard"
                                        element={
                                            <Dashboard
                                                stats={stats}
                                                isConnected={isConnected}
                                                latestEvent={latestEvent}
                                                events={events}
                                                setEvents={setEvents}
                                                handleMediaStateChange={handleMediaStateChange}
                                                handleAnalysisComplete={handleAnalysisComplete}
                                                handleResetStats={handleResetStats}
                                                activeMode={activeMode}
                                                setActiveMode={setActiveMode}
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
                                        }
                                    />
                                    <Route path="/analytics" element={<Analytics stats={stats} />} />
                                    <Route path="/reports" element={<Reports />} />
                                    <Route path="/map" element={<LiveMap />} />
                                    <Route
                                        path="/monitor"
                                        element={
                                            <LiveMonitor
                                                events={events}
                                                stats={stats}
                                                handleResetStats={handleResetStats}
                                                setEvents={setEvents}
                                                isConnected={isConnected}
                                            />
                                        }
                                    />
                                </Routes>
                            </main>
                        </div>
                    } />
                </Routes>
            </Suspense>
        </Router>
    );
}

export default App;
