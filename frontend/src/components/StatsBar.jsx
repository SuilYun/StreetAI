import React, { useEffect, useRef, useState } from 'react';
import { Activity, Target, AlertTriangle } from 'lucide-react';
import anime from 'animejs';
import EarthGlobe from './EarthGlobe';

const AnimatedValue = ({ value }) => {
    const [displayVal, setDisplayVal] = useState(0);
    const prevValue = useRef(0);

    useEffect(() => {
        const stringVal = String(value);
        const hasDecimal = stringVal.includes('.');
        const targetNum = parseFloat(stringVal) || 0;

        const tempObj = { val: prevValue.current };
        anime({
            targets: tempObj,
            val: targetNum,
            duration: 1500,
            easing: 'easeOutExpo',
            update: () => {
                setDisplayVal(hasDecimal ? tempObj.val.toFixed(1) : Math.round(tempObj.val));
            },
            complete: () => {
                prevValue.current = targetNum;
            }
        });
    }, [value]);

    const suffix = String(value).includes('%') ? '%' : '';
    return <span>{displayVal}{suffix}</span>;
};

const StatsBar = ({ stats, isConnected }) => {
    const cards = [
        {
            label: 'Total Detections',
            value: stats.totalDetections,
            icon: <Activity size={20} />,
            color: 'text-blue-500 dark:text-blue-400',
            bgColor: 'bg-blue-500/5',
            iconBg: 'bg-blue-500/10',
            glowClass: 'glow-blue',
        },
        {
            label: 'Avg Confidence',
            value: `${stats.avgConfidence || 0}%`,
            icon: <Target size={20} />,
            color: 'text-emerald-500 dark:text-emerald-400',
            bgColor: 'bg-emerald-500/5',
            iconBg: 'bg-emerald-500/10',
            glowClass: 'glow-green',
        },
        {
            label: 'Critical Alerts',
            value: stats.potholes,
            icon: <AlertTriangle size={20} />,
            color: 'text-red-500 dark:text-red-400',
            bgColor: 'bg-red-500/5',
            iconBg: 'bg-red-500/10',
            glowClass: 'glow-red',
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
        <div ref={containerRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card) => (
                <div key={card.label} className={`stat-card relative overflow-hidden ${card.glowClass}`}>
                    <div className="flex items-center justify-between z-10 relative">
                        <span className="text-xs text-mission-400 uppercase tracking-wider font-medium">{card.label}</span>
                        <div className={`${card.iconBg} ${card.color} p-2 rounded-lg`}>
                            {card.icon}
                        </div>
                    </div>
                    <span className={`text-4xl font-extrabold tracking-tight mt-1 z-10 relative ${card.color}`}>
                        <AnimatedValue value={card.value} />
                    </span>
                    <div className="absolute right-[-16px] bottom-[-16px] opacity-[0.04] text-slate-900 dark:text-white pointer-events-none">
                        {React.cloneElement(card.icon, { size: 100 })}
                    </div>
                </div>
            ))}

            {/* Earth Globe Connectivity Card */}
            <div className={`stat-card flex flex-col items-center justify-center gap-1 relative overflow-hidden ${isConnected ? 'glow-green' : 'glow-red'}`}>
                <span className="text-xs text-mission-400 uppercase tracking-wider font-medium mb-1">Server Status</span>
                <EarthGlobe isConnected={isConnected} />
            </div>
        </div>
    );
};

export default StatsBar;
