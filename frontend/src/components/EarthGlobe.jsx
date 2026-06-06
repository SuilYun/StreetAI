import React, { useRef, useEffect } from 'react';
import anime from 'animejs';

const EarthGlobe = ({ isConnected }) => {
    const globeRef = useRef(null);
    const rotationRef = useRef(null);

    useEffect(() => {
        if (!globeRef.current) return;

        // Continuous rotation animation
        rotationRef.current = anime({
            targets: globeRef.current.querySelector('.earth-inner'),
            rotate: '1turn',
            loop: true,
            easing: 'linear',
            duration: 8000,
        });

        return () => {
            if (rotationRef.current) rotationRef.current.pause();
        };
    }, []);

    // Pause/resume spin based on connection
    useEffect(() => {
        if (rotationRef.current) {
            if (isConnected) {
                rotationRef.current.play();
            } else {
                rotationRef.current.pause();
            }
        }
    }, [isConnected]);

    const color = isConnected ? '#10b981' : '#ef4444';
    const bgGradient = isConnected
        ? 'linear-gradient(135deg, #10b981 0%, #059669 40%, #047857 100%)'
        : 'linear-gradient(135deg, #ef4444 0%, #dc2626 40%, #b91c1c 100%)';

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="earth-globe-container">
                <div
                    ref={globeRef}
                    className={`earth-globe ${isConnected ? 'connected' : 'disconnected'}`}
                    style={{ background: bgGradient }}
                >
                    {/* Continent-like shapes via CSS */}
                    <div className="earth-inner" style={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '50%',
                    }}>
                        {/* Grid lines */}
                        <div style={{
                            position: 'absolute', inset: 0, borderRadius: '50%',
                            border: `1.5px solid ${isConnected ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.15)'}`,
                        }} />
                        {/* Horizontal lines */}
                        {[20, 35, 50, 65, 80].map((top) => (
                            <div key={top} style={{
                                position: 'absolute', left: '10%', right: '10%',
                                top: `${top}%`, height: '1px',
                                background: `${isConnected ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)'}`,
                                borderRadius: '50%',
                            }} />
                        ))}
                        {/* Vertical meridians */}
                        {[25, 50, 75].map((left) => (
                            <div key={left} style={{
                                position: 'absolute', top: '10%', bottom: '10%',
                                left: `${left}%`, width: '1px',
                                background: `${isConnected ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)'}`,
                            }} />
                        ))}
                        {/* Continent blobs */}
                        <div style={{
                            position: 'absolute', top: '25%', left: '20%',
                            width: '25%', height: '18%', borderRadius: '40%',
                            background: 'rgba(255,255,255,0.15)',
                        }} />
                        <div style={{
                            position: 'absolute', top: '45%', left: '55%',
                            width: '20%', height: '22%', borderRadius: '35%',
                            background: 'rgba(255,255,255,0.12)',
                        }} />
                        <div style={{
                            position: 'absolute', top: '30%', left: '60%',
                            width: '15%', height: '12%', borderRadius: '30%',
                            background: 'rgba(255,255,255,0.1)',
                        }} />
                    </div>
                    {/* Specular highlight */}
                    <div style={{
                        position: 'absolute', top: '8%', left: '15%',
                        width: '35%', height: '35%', borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)',
                    }} />
                </div>
            </div>
            {/* Status label */}
            <div className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-detect-safe' : 'bg-detect-pothole'} animate-pulse`} />
                <span className={`text-xs font-semibold ${isConnected ? 'text-detect-safe' : 'text-detect-pothole'}`}>
                    {isConnected ? 'LIVE' : 'OFFLINE'}
                </span>
            </div>
        </div>
    );
};

export default EarthGlobe;
