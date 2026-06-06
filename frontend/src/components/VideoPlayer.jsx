import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Video, Image, Upload, Loader2, Search, X, Save, RotateCcw } from 'lucide-react';
import anime from 'animejs';
import { uploadImage, uploadVideo, getImageUrl } from '../services/api';
import VideoTimeline from './VideoTimeline';

const TYPE_COLORS = {
    'Pothole (D40)': { border: '#ef4444', bg: 'bg-red-500/15', text: 'text-red-400', badge: 'bg-red-500' },
    'Transverse Cracks (D10)': { border: '#8b5cf6', bg: 'bg-violet-500/15', text: 'text-violet-400', badge: 'bg-violet-500' },
    'Longitudinal Cracks (D00)': { border: '#f59e0b', bg: 'bg-amber-500/15', text: 'text-amber-400', badge: 'bg-amber-500' },
    'Alligator Cracks (D20)': { border: '#10b981', bg: 'bg-emerald-500/15', text: 'text-emerald-400', badge: 'bg-emerald-500' },
    'Healthy Road Conditions': { border: '#06b6d4', bg: 'bg-cyan-500/15', text: 'text-cyan-400', badge: 'bg-cyan-500' }
};

const SEVERITY_STYLES = {
    High: 'bg-detect-pothole/20 text-detect-pothole border border-detect-pothole/30',
    Medium: 'bg-detect-crack/20 text-detect-crack border border-detect-crack/30',
    Low: 'bg-detect-safe/20 text-detect-safe border border-detect-safe/30',
    None: 'bg-white/10 text-mission-300 border border-white/10',
};

const MODES = [
    { id: 'image', label: 'Image', icon: Image },
    { id: 'video', label: 'Video', icon: Video },
];

const VideoPlayer = ({ latestEvent, onMediaStateChange, onAnalysisComplete, activeMode, onModeChange }) => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const imageContainerRef = useRef(null);
    const mediaRef = useRef(null);
    const boxTimeoutRef = useRef(null);
    const laserRef = useRef(null);

    const [localMode, setLocalMode] = useState('image');
    const mode = activeMode || localMode;
    const setMode = onModeChange || setLocalMode;

    const [uploadedSrc, setUploadedSrc] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [fileName, setFileName] = useState('');

    // Image analysis states
    const [analysisState, setAnalysisState] = useState('idle'); // idle | analyzing | done
    const [analysisProgress, setAnalysisProgress] = useState(0);
    const [analysisResults, setAnalysisResults] = useState(null);
    const [analysisTime, setAnalysisTime] = useState(0);
    const [imageLoaded, setImageLoaded] = useState(false);

    // ── Notify parent when media is active ──
    useEffect(() => {
        const isActive = mode !== 'image' && uploadedSrc !== null;
        onMediaStateChange?.(isActive);
    }, [mode, uploadedSrc, onMediaStateChange]);

    // ── Laser Scanning Animation ──
    useEffect(() => {
        if (analysisState === 'analyzing' && laserRef.current) {
            const containerHeight = laserRef.current.parentElement.offsetHeight || 300;
            anime({
                targets: laserRef.current,
                translateY: [0, containerHeight - 5],
                direction: 'alternate',
                loop: true,
                easing: 'easeInOutSine',
                duration: 1200
            });
        }
    }, [analysisState]);

    // ── Draw bounding boxes for live detection (camera/video mode) ──
    useEffect(() => {
        if (mode === 'image') return; // Image mode uses its own drawing
        if (!latestEvent || !canvasRef.current || !containerRef.current) return;

        const canvas = canvasRef.current;
        const container = containerRef.current;
        const ctx = canvas.getContext('2d');

        canvas.width = container.offsetWidth;
        canvas.height = container.offsetHeight;

        const [xPct, yPct, wPct, hPct] = latestEvent.bbox;
        const x = (xPct / 100) * canvas.width;
        const y = (yPct / 100) * canvas.height;
        const w = (wPct / 100) * canvas.width;
        const h = (hPct / 100) * canvas.height;
        const color = TYPE_COLORS[latestEvent.type]?.border || '#3b82f6';

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2.5;
        ctx.strokeRect(x, y, w, h);
        ctx.fillStyle = color + '18';
        ctx.fillRect(x, y, w, h);

        const cornerLen = 10;
        ctx.lineWidth = 3;
        [[x, y, x + cornerLen, y, x, y + cornerLen],
         [x + w - cornerLen, y, x + w, y, x + w, y + cornerLen],
         [x, y + h - cornerLen, x, y + h, x + cornerLen, y + h],
         [x + w - cornerLen, y + h, x + w, y + h, x + w, y + h - cornerLen]
        ].forEach(([mx, my, lx1, ly1, lx2, ly2]) => {
            ctx.beginPath();
            ctx.moveTo(mx, my); ctx.lineTo(lx1, ly1);
            ctx.moveTo(lx1 === mx ? lx2 : lx1, ly1 === my ? ly2 : ly1);
            ctx.lineTo(lx2, ly2);
            ctx.stroke();
        });

        const label = `${latestEvent.type} ${(latestEvent.confidence * 100).toFixed(0)}%`;
        ctx.font = '600 13px Inter, sans-serif';
        const textWidth = ctx.measureText(label).width;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.roundRect(x - 2, y - 22, textWidth + 12, 20, 4);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.fillText(label, x + 4, y - 7);

        if (boxTimeoutRef.current) clearTimeout(boxTimeoutRef.current);
        boxTimeoutRef.current = setTimeout(() => ctx.clearRect(0, 0, canvas.width, canvas.height), 2500);
        return () => { if (boxTimeoutRef.current) clearTimeout(boxTimeoutRef.current); };
    }, [latestEvent, mode]);

    // ── Draw bounding boxes on image after analysis ──
    const drawImageBoxes = useCallback(() => {
        if (!analysisResults || !imageContainerRef.current) return;

        const canvas = imageContainerRef.current;
        const imgEl = canvas.parentElement?.querySelector('img');
        if (!imgEl) return;

        const ctx = canvas.getContext('2d');
        canvas.width = imgEl.offsetWidth;
        canvas.height = imgEl.offsetHeight;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const imgW = analysisResults.image_width || imgEl.naturalWidth || 640;
        const imgH = analysisResults.image_height || imgEl.naturalHeight || 480;

        // Correctly account for object-contain letterboxing/pillarboxing
        const imgRatio = imgW / imgH;
        const containerRatio = canvas.width / canvas.height;

        let displayWidth, displayHeight;
        let offsetX = 0, offsetY = 0;

        if (imgRatio > containerRatio) {
            // Image is wider than container (letterboxed top/bottom)
            displayWidth = canvas.width;
            displayHeight = canvas.width / imgRatio;
            offsetY = (canvas.height - displayHeight) / 2;
        } else {
            // Image is taller than container (pillarboxed left/right)
            displayHeight = canvas.height;
            displayWidth = canvas.height * imgRatio;
            offsetX = (canvas.width - displayWidth) / 2;
        }

        analysisResults.detected_issues.forEach((issue) => {
            const [bx, by, bw, bh] = issue.bbox;
            // Since bbox coordinates are percentages (0 to 100), map them to display area
            const x = offsetX + (bx / 100) * displayWidth;
            const y = offsetY + (by / 100) * displayHeight;
            const w = (bw / 100) * displayWidth;
            const h = (bh / 100) * displayHeight;
            const color = TYPE_COLORS[issue.type]?.border || '#3b82f6';

            // Box
            ctx.strokeStyle = color;
            ctx.lineWidth = 2;
            ctx.setLineDash([6, 3]);
            ctx.strokeRect(x, y, w, h);
            ctx.setLineDash([]);
            ctx.fillStyle = color + '15';
            ctx.fillRect(x, y, w, h);

            // Corner brackets
            const cl = 8;
            ctx.lineWidth = 3;
            ctx.strokeStyle = color;
            ctx.beginPath();
            ctx.moveTo(x, y + cl); ctx.lineTo(x, y); ctx.lineTo(x + cl, y);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x + w - cl, y); ctx.lineTo(x + w, y); ctx.lineTo(x + w, y + cl);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x, y + h - cl); ctx.lineTo(x, y + h); ctx.lineTo(x + cl, y + h);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(x + w - cl, y + h); ctx.lineTo(x + w, y + h); ctx.lineTo(x + w, y + h - cl);
            ctx.stroke();

            // Label
            const label = `${issue.type} ${(issue.confidence * 100).toFixed(0)}%`;
            ctx.font = '600 12px Inter, sans-serif';
            const tw = ctx.measureText(label).width;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.roundRect(x, y - 20, tw + 10, 18, 3);
            ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.fillText(label, x + 5, y - 6);
        });
    }, [analysisResults]);

    useEffect(() => {
        if (analysisState === 'done' && imageLoaded) {
            // Small delay to ensure DOM is painted
            const timer = setTimeout(() => drawImageBoxes(), 100);
            return () => clearTimeout(timer);
        }
    }, [analysisState, imageLoaded, drawImageBoxes]);

    // ── Live Video Tracking ──
    const handleTimeUpdate = () => {
        if (mode !== 'video' || analysisState !== 'done' || !analysisResults || !analysisResults.timeline) return;
        if (!canvasRef.current || !mediaRef.current) return;

        const currentTime = mediaRef.current.currentTime;
        
        // Find the absolute closest frame in the timeline
        let closestFrame = null;
        let minDiff = Infinity;
        
        analysisResults.timeline.forEach(f => {
            const diff = Math.abs(f.timestamp - currentTime);
            if (diff < minDiff) {
                minDiff = diff;
                closestFrame = f;
            }
        });

        // Use the closest frame if it is within 0.25 seconds (since frames are spaced 0.20s apart)
        const frame = (minDiff < 0.25) ? closestFrame : null;

        const canvas = canvasRef.current;
        const videoEl = mediaRef.current;
        const ctx = canvas.getContext('2d');

        canvas.width = videoEl.offsetWidth;
        canvas.height = videoEl.offsetHeight;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (!frame || frame.detected_issues.length === 0) return;

        // Correctly account for object-contain letterboxing/pillarboxing in video
        const videoW = videoEl.videoWidth || canvas.width;
        const videoH = videoEl.videoHeight || canvas.height;
        const videoRatio = videoW / videoH;
        const containerRatio = canvas.width / canvas.height;

        let displayWidth, displayHeight;
        let offsetX = 0, offsetY = 0;

        if (videoRatio > containerRatio) {
            // Video is wider than container (letterboxed top/bottom)
            displayWidth = canvas.width;
            displayHeight = canvas.width / videoRatio;
            offsetY = (canvas.height - displayHeight) / 2;
        } else {
            // Video is taller than container (pillarboxed left/right)
            displayHeight = canvas.height;
            displayWidth = canvas.height * videoRatio;
            offsetX = (canvas.width - displayWidth) / 2;
        }

        frame.detected_issues.forEach(issue => {
            const [xPct, yPct, wPct, hPct] = issue.bbox;
            const x = offsetX + (xPct / 100) * displayWidth;
            const y = offsetY + (yPct / 100) * displayHeight;
            const w = (wPct / 100) * displayWidth;
            const h = (hPct / 100) * displayHeight;
            const color = TYPE_COLORS[issue.type]?.border || '#3b82f6';

            ctx.strokeStyle = color;
            ctx.lineWidth = 2.5;
            ctx.strokeRect(x, y, w, h);
            ctx.fillStyle = color + '18';
            ctx.fillRect(x, y, w, h);

            const label = `${issue.type} ${(issue.confidence * 100).toFixed(0)}%`;
            ctx.font = '600 13px Inter, sans-serif';
            const textWidth = ctx.measureText(label).width;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.roundRect(x - 2, y - 22, textWidth + 12, 20, 4);
            ctx.fill();
            ctx.fillStyle = '#ffffff';
            ctx.fillText(label, x + 4, y - 7);
        });
    };

    // ── Mode switch ──
    const switchMode = (newMode) => {
        setUploadedSrc(null);
        setUploadedFile(null);
        setFileName('');
        setAnalysisState('idle');
        setAnalysisResults(null);
        setAnalysisProgress(0);
        setImageLoaded(false);
        setMode(newMode);
    };

    // ── File upload ──
    const handleFileUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setFileName(file.name);
        setUploadedSrc(URL.createObjectURL(file));
        setUploadedFile(file);
        setAnalysisState('idle');
        setImageLoaded(false);
        setAnalysisResults(null);
    };

    // ── Analyze media via backend ──
    const handleAnalyze = async () => {
        if (!uploadedFile) return;

        setAnalysisState('analyzing');
        setAnalysisProgress(0);
        const startTime = Date.now();

        // Simulate progress bar while waiting for backend
        const progressInterval = setInterval(() => {
            setAnalysisProgress((prev) => {
                if (prev >= 95) { clearInterval(progressInterval); return 95; }
                return prev + Math.random() * 8;
            });
        }, 800);

        try {
            let response;
            if (mode === 'video') {
                response = await uploadVideo(uploadedFile);
            } else {
                response = await uploadImage(uploadedFile);
            }
            
            clearInterval(progressInterval);
            setAnalysisProgress(100);
            setAnalysisTime(((Date.now() - startTime) / 1000).toFixed(2));

            if (response.success && response.data) {
                setAnalysisResults(response.data);
                if (onAnalysisComplete) {
                    onAnalysisComplete(response.data);
                }
                setTimeout(() => setAnalysisState('done'), 400);
            } else {
                throw new Error('Invalid response');
            }
        } catch (error) {
            clearInterval(progressInterval);
            console.error('Analysis failed:', error);
            setAnalysisState('idle');
            alert(`Analysis failed: ${error.message}`);
        }
    };

    // ── New upload reset ──
    const handleNewUpload = () => {
        setUploadedSrc(null);
        setUploadedFile(null);
        setFileName('');
        setAnalysisState('idle');
        setAnalysisResults(null);
        setAnalysisProgress(0);
        setImageLoaded(false);
    };

    // ── Render content ──
    const renderContent = () => {
        // ── VIDEO MODE ──
        if (mode === 'video') {
            if (!uploadedSrc) {
                return (
                    <label className="flex flex-col items-center justify-center h-full gap-4 cursor-pointer">
                        <div className="w-16 h-16 rounded-full bg-detect-crack/10 flex items-center justify-center">
                            <Upload size={28} className="text-detect-crack" />
                        </div>
                        <p className="text-mission-300 text-sm">Click to upload a video file</p>
                        <span className="text-xs text-mission-400">MP4, AVI, MOV supported</span>
                        <input type="file" accept="video/*" className="hidden" onChange={handleFileUpload} />
                    </label>
                );
            }
            return (
                <div className="flex flex-col h-full w-full">
                    {/* Video Player overlay */}
                    <div className="relative flex-1 min-h-0 bg-black">
                        <video ref={mediaRef} src={uploadedSrc} onTimeUpdate={handleTimeUpdate} controls className="w-full h-full object-contain" />
                        
                        {/* Live Bounding Boxes Canvas */}
                        {analysisState === 'done' && (
                            <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none z-10" />
                        )}

                        {/* Close button */}
                        {analysisState !== 'analyzing' && (
                            <button onClick={handleNewUpload}
                                className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white flex items-center justify-center transition-all border border-slate-200 shadow-sm text-slate-500">
                                <X size={16} />
                            </button>
                        )}

                        {/* Loading overlay & Laser */}
                        {analysisState === 'analyzing' && (
                            <>
                                <div ref={laserRef} className="absolute left-0 top-0 w-full h-[3px] bg-accent-cyan shadow-[0_0_15px_rgba(6,182,212,1)] z-30" />
                                <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
                                <Loader2 size={32} className="animate-spin text-accent-cyan mb-4" />
                                <span className="text-sm font-mono text-accent-cyan mb-2">Extracting and analyzing frames...</span>
                                <div className="w-64 h-1.5 bg-mission-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-accent-blue to-accent-cyan rounded-full transition-all duration-300"
                                        style={{ width: `${Math.min(analysisProgress, 100)}%` }} />
                                </div>
                            </div>
                            </>
                        )}
                    </div>

                    {/* Bottom bar — Analyze */}
                    {analysisState === 'idle' && (
                        <div className="flex items-center gap-3 px-4 py-3 border-t border-slate-200 bg-white">
                            <button onClick={handleAnalyze}
                                className="flex items-center gap-2 px-5 py-2.5 bg-accent-blue hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-all btn-interactive shadow-md shadow-blue-500/20">
                                <Search size={16} />
                                Analyze Video
                            </button>
                            <button onClick={handleNewUpload}
                                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-sm font-medium transition-all border border-slate-200 btn-interactive">
                                Cancel
                            </button>
                        </div>
                    )}
                </div>
            );
        }

        // ── IMAGE MODE ──
        if (mode === 'image') {
            // Empty state — upload prompt
            if (!uploadedSrc) {
                return (
                    <label className="flex flex-col items-center justify-center h-full gap-4 cursor-pointer">
                        <div className="w-16 h-16 rounded-full bg-accent-blue/10 flex items-center justify-center">
                            <Upload size={28} className="text-accent-blue" />
                        </div>
                        <p className="text-mission-200 text-sm font-medium">Upload Road Media</p>
                        <span className="text-xs text-mission-400">JPG, PNG, WEBP supported</span>
                        <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                    </label>
                );
            }

            return (
                <div className="flex flex-col h-full">
                    {/* Image + Canvas overlay */}
                    <div className="relative flex-1 min-h-0">
                        <img src={uploadedSrc} alt="Upload" className="w-full h-full object-contain"
                            onLoad={() => setImageLoaded(true)} />
                        <canvas ref={imageContainerRef}
                            className="absolute top-0 left-0 w-full h-full pointer-events-none z-10" />

                        {/* Close button */}
                        {analysisState !== 'analyzing' && (
                            <button onClick={handleNewUpload}
                                className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-mission-900/70 hover:bg-mission-900 flex items-center justify-center transition-all border border-white/10">
                                <X size={16} />
                            </button>
                        )}

                        {/* Loading overlay & Laser */}
                        {analysisState === 'analyzing' && (
                            <>
                                <div ref={laserRef} className="absolute left-0 top-0 w-full h-[3px] bg-accent-cyan shadow-[0_0_15px_rgba(6,182,212,1)] z-30" />
                                <div className="absolute bottom-0 left-0 right-0 z-20 p-4 bg-gradient-to-t from-white/95 to-transparent">
                                <div className="flex items-center gap-2 mb-2">
                                    <Loader2 size={16} className="animate-spin text-accent-cyan" />
                                    <span className="text-sm font-mono text-accent-cyan">AI model analyzing...</span>
                                    <span className="ml-auto text-sm font-mono text-mission-300">{Math.min(Math.round(analysisProgress), 100)}%</span>
                                </div>
                                <div className="w-full h-1.5 bg-mission-700 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-accent-blue to-accent-cyan rounded-full transition-all duration-300"
                                        style={{ width: `${Math.min(analysisProgress, 100)}%` }} />
                                </div>
                            </div>
                            </>
                        )}
                    </div>

                    {/* Bottom bar — Analyze / Results */}
                    {analysisState === 'idle' && (
                        <div className="flex items-center gap-3 px-4 py-3 border-t border-slate-200">
                            <button onClick={handleAnalyze}
                                className="flex items-center gap-2 px-5 py-2.5 bg-accent-blue hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-all btn-interactive shadow-md shadow-blue-500/20">
                                <Search size={16} />
                                Analyze Image
                            </button>
                            <button onClick={handleNewUpload}
                                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-sm font-medium transition-all border border-slate-200 btn-interactive">
                                Cancel
                            </button>
                        </div>
                    )}

                    {/* Results panel */}
                    {analysisState === 'done' && analysisResults && (
                        <div className="px-4 py-4 border-t border-slate-200">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <span className="text-xs font-mono text-accent-cyan uppercase tracking-wider">Analysis Complete</span>
                                    <h3 className="text-lg font-semibold text-mission-100">Detection Results</h3>
                                </div>
                                <span className="text-xs font-mono text-mission-400">Processed in {analysisTime}s</span>
                            </div>

                            {/* Issue cards */}
                            {analysisResults.detected_issues.length === 0 ? (
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-detect-safe/10 border border-detect-safe/20">
                                    <span className="text-detect-safe text-sm font-medium">✓ No damage detected</span>
                                </div>
                            ) : (
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {analysisResults.detected_issues.map((issue, idx) => {
                                        const colors = TYPE_COLORS[issue.type] || TYPE_COLORS.Crack;
                                        return (
                                            <div key={idx}
                                                className={`flex items-center gap-3 p-3 rounded-lg ${colors.bg} border border-slate-200/60 min-w-[200px]`}>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className="font-semibold text-sm text-mission-100">{issue.type}</span>
                                                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${SEVERITY_STYLES[issue.severity]}`}>
                                                            {issue.severity === 'High' ? 'critical' : issue.severity.toLowerCase()}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-mission-300">Confidence</span>
                                                        <span className={`text-xs font-bold ${colors.text}`}>{(issue.confidence * 100).toFixed(0)}%</span>
                                                    </div>
                                                    <div className="w-full h-1 bg-slate-200 rounded-full mt-1 overflow-hidden">
                                                        <div className="h-full rounded-full transition-all duration-1000"
                                                            style={{ width: `${issue.confidence * 100}%`, backgroundColor: colors.border }} />
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Action buttons */}
                            <div className="flex items-center gap-3">
                                <button className="flex items-center gap-2 px-4 py-2 bg-detect-pothole hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-all">
                                    <Save size={14} />
                                    Save Report
                                </button>
                                <button onClick={handleNewUpload}
                                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-sm font-medium transition-all border border-slate-200 btn-interactive">
                                    <RotateCcw size={14} />
                                    New Upload
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            );
        }
    };

    return (
        <>
            <div className="glass-panel overflow-auto relative flex flex-col" ref={containerRef}>
                {/* Header tabs */}
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 z-20 bg-white/90 backdrop-blur-sm">
                    <div className="flex gap-1">
                        {MODES.map((m) => {
                            const Icon = m.icon;
                            const isActive = mode === m.id;
                            return (
                                <button key={m.id} onClick={() => switchMode(m.id)}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                        isActive ? 'bg-blue-50 text-accent-blue border border-blue-200'
                                                 : 'text-slate-500 hover:text-slate-700 hover:bg-slate-100'}`}>
                                    <Icon size={14} />
                                    {m.label}
                                </button>
                            );
                        })}
                    </div>
                    <div className="flex items-center gap-2">
                        {fileName && <span className="text-xs text-mission-300 font-mono truncate max-w-[150px]">{fileName}</span>}
                    </div>
                </div>

                {/* Media area */}
                <div className="relative flex-1 flex flex-col" style={{ minHeight: '360px' }}>
                    {renderContent()}
                </div>
            </div>

            {/* Frame-by-Frame Results for Video */}
            {mode === 'video' && analysisState === 'done' && analysisResults && (
                <VideoTimeline results={analysisResults} onReset={handleNewUpload} />
            )}
        </>
    );
};

export default VideoPlayer;
