import React, { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, BarChart3, Database, Sun, Moon, Map, Home, Activity, Settings, X } from 'lucide-react';

// Reusable, highly interactive and professional animated Brand Logo SVG
const LogoIcon = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="logoBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
            <linearGradient id="logoRoadGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#020617" />
                <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
            <linearGradient id="logoSweepGrad" x1="50" y1="-5" x2="85" y2="15" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.6" />
            </linearGradient>
            <filter id="logoGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
        </defs>

        {/* Outer metallic panel */}
        <rect x="1.5" y="1.5" width="97" height="97" rx="14" fill="url(#logoBgGrad)" stroke="#334155" strokeWidth="2" />
        
        {/* Cyan outer border glow */}
        <rect x="1.5" y="1.5" width="97" height="97" rx="14" stroke="#22d3ee" strokeWidth="1" opacity="0.35" />

        {/* 5x5 Coordinate Grid */}
        <g opacity="0.25">
            {/* Vertical lines */}
            <line x1="10" y1="10" x2="10" y2="90" stroke="#64748b" strokeWidth="0.75" />
            <line x1="26" y1="10" x2="26" y2="90" stroke="#64748b" strokeWidth="0.75" />
            <line x1="42" y1="10" x2="42" y2="90" stroke="#64748b" strokeWidth="0.75" />
            <line x1="58" y1="10" x2="58" y2="90" stroke="#64748b" strokeWidth="0.75" />
            <line x1="74" y1="10" x2="74" y2="90" stroke="#64748b" strokeWidth="0.75" />
            <line x1="90" y1="10" x2="90" y2="90" stroke="#64748b" strokeWidth="0.75" />

            {/* Horizontal lines */}
            <line x1="10" y1="10" x2="90" y2="10" stroke="#64748b" strokeWidth="0.75" />
            <line x1="10" y1="26" x2="90" y2="26" stroke="#64748b" strokeWidth="0.75" />
            <line x1="10" y1="42" x2="90" y2="42" stroke="#64748b" strokeWidth="0.75" />
            <line x1="10" y1="58" x2="90" y2="58" stroke="#64748b" strokeWidth="0.75" />
            <line x1="10" y1="74" x2="90" y2="74" stroke="#64748b" strokeWidth="0.75" />
            <line x1="10" y1="90" x2="90" y2="90" stroke="#64748b" strokeWidth="0.75" />
        </g>

        {/* Concentric Radar Rings */}
        <g opacity="0.45">
            <circle cx="50" cy="35" r="14" stroke="#22d3ee" strokeWidth="1.0" strokeDasharray="1 2" />
            <circle cx="50" cy="35" r="24" stroke="#22d3ee" strokeWidth="1.0" />
            <circle cx="50" cy="35" r="34" stroke="#22d3ee" strokeWidth="1.0" />
            <circle cx="50" cy="35" r="44" stroke="#22d3ee" strokeWidth="1.0" strokeDasharray="3 3" />
        </g>

        {/* Radar Sweep Wedge */}
        <g className="animate-radar-sweep">
            <path d="M 50 35 L 50 -5 A 40 40 0 0 1 85 15 Z" fill="url(#logoSweepGrad)" />
            <line x1="50" y1="35" x2="85" y2="15" stroke="#22d3ee" strokeWidth="1.5" filter="url(#logoGlow)" />
        </g>

        {/* Road Polygon */}
        <path d="M 22 90 L 45 35 H 55 L 78 90 Z" fill="url(#logoRoadGrad)" stroke="#475569" strokeWidth="1" />
        
        {/* Road White Border lines */}
        <line x1="22" y1="90" x2="45" y2="35" stroke="#f8fafc" strokeWidth="1.5" opacity="0.9" />
        <line x1="78" y1="90" x2="55" y2="35" stroke="#f8fafc" strokeWidth="1.5" opacity="0.9" />
        
        {/* Dashed Center lane (scrolling animated) */}
        <line x1="50" y1="90" x2="50" y2="35" stroke="#38bdf8" strokeWidth="2.0" strokeDasharray="5 6" className="animate-road-dash" />

        {/* Scanning Laser Line (horizontal scanning sweep) */}
        <g className="animate-laser-line">
            <line x1="15" y1="0" x2="85" y2="0" stroke="#10b981" strokeWidth="2" filter="url(#logoGlow)" />
            {/* laser highlight endpoints */}
            <circle cx="15" cy="0" r="1.5" fill="#34d399" />
            <circle cx="85" cy="0" r="1.5" fill="#34d399" />
        </g>

        {/* Pothole Target detection anomaly */}
        <g className="animate-target-pulse" style={{ transformOrigin: '38px 65px' }}>
            {/* Pothole overlay */}
            <ellipse cx="38" cy="65" rx="5" ry="3" fill="#ef4444" opacity="0.3" />
            <ellipse cx="38" cy="65" rx="3" ry="1.5" fill="#991b1b" opacity="0.6" />
            {/* Bounding box brackets */}
            <path d="M 31 60 H 34 V 63" stroke="#ef4444" strokeWidth="1.2" fill="none" />
            <path d="M 45 60 H 42 V 63" stroke="#ef4444" strokeWidth="1.2" fill="none" />
            <path d="M 31 70 H 34 V 67" stroke="#ef4444" strokeWidth="1.2" fill="none" />
            <path d="M 45 70 H 42 V 67" stroke="#ef4444" strokeWidth="1.2" fill="none" />
            <text x="48" y="63" fill="#ef4444" fontSize="6" fontFamily="monospace" fontWeight="bold">D40</text>
        </g>

        {/* Corner Brackets (neon breathing) */}
        <g className="animate-glow-pulse" strokeWidth="2.5" strokeLinecap="round" filter="url(#logoGlow)">
            {/* Top Left (Cyan) */}
            <path d="M 10 22 V 10 H 22" stroke="#22d3ee" />
            {/* Top Right (Cyan) */}
            <path d="M 90 22 V 10 H 78" stroke="#22d3ee" />
            {/* Bottom Left (White) */}
            <path d="M 10 78 V 90 H 22" stroke="#ffffff" />
            {/* Bottom Right (White) */}
            <path d="M 90 78 V 90 H 78" stroke="#ffffff" />
        </g>
    </svg>
);

const Sidebar = ({ isConnected, darkMode, toggleDarkMode }) => {
    const location = useLocation();
    const [mobileSettingsOpen, setMobileSettingsOpen] = useState(false);

    const handleLogoClick = (e) => {
        if (location.pathname === '/dashboard') {
            e.preventDefault();
            window.location.reload();
        }
    };

    const navItems = [
        { path: '/', label: 'Home', icon: Home },
        { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/monitor', label: 'Monitor', icon: Activity },
        { path: '/analytics', label: 'Analytics', icon: BarChart3 },
        { path: '/map', label: 'Map', icon: Map },
        { path: '/reports', label: 'Reports', icon: Database },
    ];

    return (
        <>
            {/* ═══════════════════════════════════════════════════════
                DESKTOP SIDEBAR (lg and up)
                ═══════════════════════════════════════════════════════ */}
            <aside className="hidden lg:flex h-full w-64 flex-shrink-0 flex-col justify-between items-stretch bg-white dark:bg-slate-900 border-r border-slate-200/60 dark:border-slate-800 p-4 z-40 transition-all duration-300">
                {/* Logo Section */}
                <Link
                    to="/dashboard"
                    onClick={handleLogoClick}
                    className="flex items-center gap-3 mb-8 px-2 hover:opacity-90 transition-all duration-200 group"
                >
                    <div className="w-10 h-10 flex-shrink-0 group-hover:scale-105 transition-all duration-300 relative shadow-lg shadow-cyan-500/20 rounded-xl overflow-hidden">
                        <LogoIcon />
                    </div>
                    <div>
                        <h1 className="text-[15px] font-extrabold text-slate-800 dark:text-white tracking-tight group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-200">StreetScan <span className="text-cyan-500">AI</span></h1>
                        <span className="text-[9px] text-slate-400 font-mono tracking-wider">v11.0.1</span>
                    </div>
                </Link>

                {/* Navigation Links */}
                <nav className="flex flex-col gap-1.5 flex-1">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={
                                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 btn-interactive relative overflow-hidden group ${
                                        isActive
                                            ? 'bg-blue-50 text-accent-blue border border-blue-100 shadow-sm shadow-blue-500/5 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/50'
                                            : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/60 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800'
                                    }`
                                }
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-4 rounded-r-full bg-blue-500 dark:bg-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
                                )}
                                <Icon size={16} className={`flex-shrink-0 transition-transform duration-200 group-hover:scale-110 group-hover:rotate-[6deg] ${isActive ? 'text-blue-500 dark:text-blue-400' : ''}`} />
                                <span>{item.label}</span>
                            </NavLink>
                        );
                    })}
                </nav>

                {/* Bottom Actions Section */}
                <div className="flex flex-col gap-2 mt-auto">
                    {/* Theme Toggle Button */}
                    <button
                        onClick={toggleDarkMode}
                        className="flex items-center justify-start gap-3 px-3 py-2 rounded-xl text-[11px] font-semibold tracking-wide transition-all duration-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100/60 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/60 border border-slate-200/50 dark:border-slate-800 btn-interactive mb-2 bg-white/50 dark:bg-slate-900/30"
                    >
                        {darkMode ? <Sun size={14} className="text-amber-500" /> : <Moon size={14} className="text-indigo-400" />}
                        <span>{darkMode ? 'Light Theme' : 'Dark Theme'}</span>
                    </button>

                    {/* Connection Status indicator */}
                    <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800">
                        <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-detect-safe animate-pulse' : 'bg-red-400'}`} />
                        <span className="text-[11px] font-mono font-semibold text-slate-500 dark:text-slate-400 truncate max-w-[120px]">
                            {isConnected ? 'Server Online' : 'Server Offline'}
                        </span>
                    </div>
                </div>
            </aside>

            {/* ═══════════════════════════════════════════════════════
                MOBILE BOTTOM TAB BAR (below lg)
                ═══════════════════════════════════════════════════════ */}
            <nav className="lg:hidden bottom-tab-bar mobile-bottom-nav bg-white/95 dark:bg-slate-900/95">
                <div className="flex items-center justify-around px-1 pt-1.5 pb-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={`flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded-xl transition-all duration-200 min-w-[3.5rem] ${
                                    isActive
                                        ? 'text-blue-500 dark:text-blue-400'
                                        : 'text-slate-400 dark:text-slate-500 active:text-slate-600 dark:active:text-slate-300'
                                }`}
                            >
                                <div className={`relative p-1.5 rounded-xl transition-all duration-200 ${
                                    isActive ? 'bg-blue-50 dark:bg-blue-950/50' : ''
                                }`}>
                                    <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                                    {/* Active indicator dot */}
                                    {isActive && (
                                        <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-500 dark:bg-blue-400" />
                                    )}
                                </div>
                                <span className={`text-[9px] font-semibold leading-none ${
                                    isActive ? 'text-blue-500 dark:text-blue-400' : 'text-slate-400 dark:text-slate-500'
                                }`}>
                                    {item.label}
                                </span>
                            </NavLink>
                        );
                    })}

                    {/* Settings / More button */}
                    <button
                        onClick={() => setMobileSettingsOpen(true)}
                        className="flex flex-col items-center justify-center gap-0.5 px-2 py-1 rounded-xl transition-all duration-200 min-w-[3.5rem] text-slate-400 dark:text-slate-500 active:text-slate-600 relative"
                    >
                        <div className="relative p-1.5 rounded-xl">
                            <Settings size={20} strokeWidth={2} />
                            {/* Connection status indicator dot */}
                            <div className={`absolute top-0.5 right-0.5 w-2 h-2 rounded-full border-2 border-white dark:border-slate-900 ${
                                isConnected ? 'bg-emerald-400' : 'bg-red-400'
                            }`} />
                        </div>
                        <span className="text-[9px] font-semibold leading-none text-slate-400 dark:text-slate-500">More</span>
                    </button>
                </div>
            </nav>

            {/* ═══════════════════════════════════════════════════════
                MOBILE SETTINGS DRAWER
                ═══════════════════════════════════════════════════════ */}
            {mobileSettingsOpen && (
                <div className="lg:hidden fixed inset-0 z-[60]" onClick={() => setMobileSettingsOpen(false)}>
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                    
                    {/* Drawer */}
                    <div 
                        className="absolute bottom-0 left-0 right-0 bg-white dark:bg-slate-900 rounded-t-3xl p-6 pb-8 shadow-2xl border-t border-slate-200/60 dark:border-slate-800"
                        style={{ paddingBottom: 'calc(2rem + env(safe-area-inset-bottom, 0px))' }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Handle bar */}
                        <div className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-700 mx-auto mb-5" />

                        {/* Close button */}
                        <button
                            onClick={() => setMobileSettingsOpen(false)}
                            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400"
                        >
                            <X size={16} />
                        </button>

                        {/* Brand */}
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 flex-shrink-0 rounded-xl overflow-hidden shadow-lg shadow-cyan-500/20">
                                <LogoIcon />
                            </div>
                            <div>
                                <h2 className="text-sm font-extrabold text-slate-800 dark:text-white">StreetScan <span className="text-cyan-500">AI</span></h2>
                                <span className="text-[9px] text-slate-400 font-mono tracking-wider">v11.0.1</span>
                            </div>
                        </div>

                        {/* Connection Status */}
                        <div className={`flex items-center gap-3 p-3.5 rounded-2xl mb-4 ${
                            isConnected 
                                ? 'bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-900/50'
                                : 'bg-red-50 dark:bg-red-950/30 border border-red-200/50 dark:border-red-900/50'
                        }`}>
                            <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-emerald-500 animate-pulse' : 'bg-red-400'}`} />
                            <div>
                                <span className={`text-xs font-bold ${isConnected ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
                                    {isConnected ? 'Server Online' : 'Server Offline'}
                                </span>
                                <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">
                                    {isConnected ? 'Backend API responding' : 'Cannot reach backend API'}
                                </p>
                            </div>
                        </div>

                        {/* Theme Toggle */}
                        <button
                            onClick={() => { toggleDarkMode(); setMobileSettingsOpen(false); }}
                            className="w-full flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-200 active:scale-[0.98] transition-all"
                        >
                            {darkMode ? <Sun size={18} className="text-amber-500" /> : <Moon size={18} className="text-indigo-400" />}
                            <span>{darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}</span>
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default React.memo(Sidebar);
