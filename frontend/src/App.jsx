import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { checkServerStatus } from './services/api';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Reports from './pages/Reports';
import LiveMap from './pages/LiveMap';

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
    const latestEvent = null;

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
            <div className="h-screen overflow-hidden flex flex-col lg:flex-row bg-slate-50 dark:bg-slate-950">
                {/* Persistent Responsive Sidebar */}
                <Sidebar isConnected={isConnected} darkMode={darkMode} toggleDarkMode={() => setDarkMode(!darkMode)} />

                {/* Main Content Pane */}
                <main className="flex-1 min-h-0 p-4 lg:p-6 flex flex-col overflow-hidden">
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <Dashboard
                                    stats={stats}
                                    isConnected={isConnected}
                                    latestEvent={latestEvent}
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
                        <Route
                            path="/analytics"
                            element={<Analytics stats={stats} />}
                        />
                        <Route
                            path="/reports"
                            element={<Reports />}
                        />
                        <Route
                            path="/map"
                            element={<LiveMap />}
                        />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}

export default App;
