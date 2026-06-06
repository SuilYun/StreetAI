import React from 'react';
import StatsBar from '../components/StatsBar';
import VideoPlayer from '../components/VideoPlayer';

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
    return (
        <div className="flex-1 min-h-0 flex flex-col">
            {/* Stats Row */}
            <div className="mb-4 flex-shrink-0">
                <StatsBar stats={stats} isConnected={isConnected} />
            </div>

            {/* Main Workspace Grid */}
            <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
                <div className="flex-1 min-h-0 overflow-y-auto pr-1">
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
