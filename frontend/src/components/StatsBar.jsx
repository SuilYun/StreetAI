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
            color: 'text-blue-500 dark:text-blue-400',
            bgColor: 'bg-blue-500/5',
            iconBg: 'bg-blue-500/10',
        },
        {
            label: 'Avg Confidence',
            value: `${stats.avgConfidence || 0}%`,
            icon: <Target size={20} />,
            color: 'text-emerald-500 dark:text-emerald-400',
            bgColor: 'bg-emerald-500/5',
            iconBg: 'bg-emerald-500/10',
        },
        {
            label: 'Critical Alerts',
            value: stats.potholes,
            icon: <AlertTriangle size={20} />,
            color: 'text-red-500 dark:text-red-400',
            bgColor: 'bg-red-500/5',
            iconBg: 'bg-red-500/10',
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
                <div key={card.label} className="stat-card relative overflow-hidden">
                    <div className="flex items-center justify-between z-10 relative">
                        <span className="text-xs text-mission-400 uppercase tracking-wider font-medium">{card.label}</span>
                        <div className={`${card.iconBg} ${card.color} p-2 rounded-lg`}>
                            {card.icon}
                        </div>
                    </div>
                    <span className={`text-4xl font-extrabold tracking-tight mt-1 z-10 relative ${card.color}`}>{card.value}</span>
                    <div className="absolute right-[-16px] bottom-[-16px] opacity-[0.04] text-slate-900 dark:text-white pointer-events-none">
                        {React.cloneElement(card.icon, { size: 100 })}
                    </div>
                </div>
            ))}

            {/* Earth Globe Connectivity Card */}
            <div className="stat-card flex flex-col items-center justify-center gap-1 relative overflow-hidden">
                <span className="text-xs text-mission-400 uppercase tracking-wider font-medium mb-1">Server Status</span>
                <EarthGlobe isConnected={isConnected} />
            </div>
        </div>
    );
};

export default StatsBar;
