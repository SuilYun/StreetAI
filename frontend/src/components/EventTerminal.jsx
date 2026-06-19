import React, { useRef, useEffect } from 'react';
import { Terminal } from 'lucide-react';

const TYPE_COLORS = {
    Pothole: 'border-detect-pothole text-detect-pothole',
    Crack: 'border-detect-crack text-detect-crack',
    'Surface Erosion': 'border-detect-erosion text-detect-erosion',
};

const TYPE_BG = {
    Pothole: 'bg-detect-pothole/5',
    Crack: 'bg-detect-crack/5',
    'Surface Erosion': 'bg-detect-erosion/5',
};

const EventTerminal = ({ events }) => {
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
    }, [events]);

    const formatTime = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
    };

    return (
        <div className="glass-panel flex flex-col h-full">
            <div className="flex items-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 border-b border-white/[0.06]">
                <Terminal size={14} className="text-detect-safe sm:w-4 sm:h-4" />
                <span className="text-xs sm:text-sm font-semibold text-mission-100">Live Event Stream</span>
                <div className="ml-auto flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-detect-safe animate-pulse"></div>
                    <span className="text-[10px] sm:text-xs text-mission-300 font-mono">{events.length} events</span>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-1.5 sm:px-2 py-2 space-y-1"
                style={{ maxHeight: '500px' }}
            >
                {events.length === 0 ? (
                    <div className="text-center text-mission-400 py-8 text-sm">
                        Waiting for detections...
                    </div>
                ) : (
                    events.map((event) => (
                        <div
                            key={event.id}
                            className={`terminal-entry ${TYPE_COLORS[event.type] || 'border-accent-blue text-mission-200'} ${TYPE_BG[event.type] || ''} rounded-r-lg`}
                        >
                            <div className="flex items-center justify-between gap-2">
                                <span className="text-xs text-mission-400">{formatTime(event.timestamp)}</span>
                                <span className="text-xs px-1.5 py-0.5 rounded bg-white/5">
                                    {(event.confidence * 100).toFixed(0)}%
                                </span>
                            </div>
                            <div className="mt-0.5 font-medium text-sm">
                                {event.type} detected
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default EventTerminal;
