import React, { useEffect, useRef } from 'react';
import { Activity, Target, AlertTriangle } from 'lucide-react';
import anime from 'animejs';
import EarthGlobe from './EarthGlobe';

const StatsBar = ({ stats, isConnected }) => {
    const cards = [
        {
            label: 'Total Detections',
            value: stats.totalDetections,
            icon: <Activity size={20} />,
            color: 'text-accent-blue',
            bgColor: 'bg-blue-50',
            iconBg: 'bg-blue-100',
        },
        {
            label: 'Avg Confidence',
            value: `${stats.avgConfidence || 0}%`,
            icon: <Target size={20} />,
            color: 'text-detect-safe',
            bgColor: 'bg-emerald-50',
            iconBg: 'bg-emerald-100',
        },
        {
            label: 'Critical Alerts',
            value: stats.potholes,
            icon: <AlertTriangle size={20} />,
            color: 'text-detect-pothole',
            bgColor: 'bg-red-50',
            iconBg: 'bg-red-100',
        },
    ];

    const containerRef = useRef(null);

    useEffect(() => {
        if (containerRef.current) {
            const cardsElements = containerRef.current.querySelectorAll('.stat-card');
            anime.set(cardsElements, { opacity: 0, translateY: 20 });
            anime({
                targets: cardsElements,
                opacity: 1,
                translateY: 0,
                delay: anime.stagger(100, { start: 300 }),
                easing: 'easeOutElastic(1, .8)',
                duration: 800,
            });
        }
    }, []);

    return (
        <div ref={containerRef} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card) => (
                <div key={card.label} className="stat-card">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-mission-400 uppercase tracking-wider font-medium">{card.label}</span>
                        <div className={`${card.iconBg} ${card.color} p-2 rounded-lg`}>
                            {card.icon}
                        </div>
                    </div>
                    <span className={`text-3xl font-bold ${card.color}`}>{card.value}</span>
                </div>
            ))}

            {/* Earth Globe Connectivity Card */}
            <div className="stat-card flex flex-col items-center justify-center gap-1">
                <span className="text-xs text-mission-400 uppercase tracking-wider font-medium mb-1">Server Status</span>
                <EarthGlobe isConnected={isConnected} />
            </div>
        </div>
    );
};

export default StatsBar;
