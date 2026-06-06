import React from 'react';
import HeatmapView from '../components/HeatmapView';

const LiveMap = () => {
    return (
        <div className="flex-1 min-h-0 flex flex-col gap-4">
            {/* Page Header */}
            <div className="flex-shrink-0 flex items-center justify-between border-b border-slate-200 pb-3">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Geographical Heatmap</h2>
                    <p className="text-xs text-slate-400">GPS locations and distribution density of detected road defects</p>
                </div>
            </div>

            {/* Map Canvas Wrapper */}
            <div className="flex-1 min-h-0 overflow-hidden relative">
                <HeatmapView height="100%" hideHeader={true} />
            </div>
        </div>
    );
};

export default LiveMap;
