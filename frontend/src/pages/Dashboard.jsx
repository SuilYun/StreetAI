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
                    />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
