import React from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Shield, LayoutDashboard, BarChart3, Database, Sun, Moon, Map } from 'lucide-react';

const Sidebar = ({ isConnected, darkMode, toggleDarkMode }) => {
    const location = useLocation();

    const handleLogoClick = (e) => {
        if (location.pathname === '/') {
            e.preventDefault();
            window.location.reload();
        }
    };

    const navItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/analytics', label: 'Analytics', icon: BarChart3 },
        { path: '/map', label: 'Live Map', icon: Map },
        { path: '/reports', label: 'Reports', icon: Database },
    ];

    return (
        <aside className="h-16 lg:h-full w-full lg:w-64 flex-shrink-0 flex lg:flex-col justify-between items-center lg:items-stretch bg-white/70 dark:bg-slate-900/80 backdrop-blur-md border-b lg:border-b-0 lg:border-r border-slate-200/60 dark:border-slate-800 p-4 z-40 transition-all duration-300">
            {/* Logo Section */}
            <Link
                to="/"
                onClick={handleLogoClick}
                className="hidden lg:flex items-center gap-3 mb-8 px-2 hover:opacity-90 transition-all duration-200 group"
            >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:scale-105 group-hover:shadow-blue-500/35 transition-all duration-300">
                    <Shield size={18} className="text-white" />
                </div>
                <div>
                    <h1 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-200">RoadAI</h1>
                    <span className="text-[10px] text-slate-400 font-mono">v11.0.0</span>
                </div>
            </Link>

            {/* Mobile Brand / Logo (only on small viewports) */}
            <Link
                to="/"
                onClick={handleLogoClick}
                className="flex lg:hidden items-center gap-2 group hover:opacity-90 transition-all duration-200"
            >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center group-hover:scale-105 transition-all duration-300">
                    <Shield size={16} className="text-white" />
                </div>
                <span className="text-sm font-bold text-slate-800 dark:text-white group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-200">RoadAI</span>
            </Link>

            {/* Navigation Links */}
            <nav className="flex lg:flex-col gap-1.5 flex-1 lg:flex-initial justify-center lg:justify-start px-2 lg:px-0">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 btn-interactive ${
                                    isActive
                                        ? 'bg-blue-50 text-accent-blue border border-blue-100 shadow-sm shadow-blue-500/5 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/50'
                                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/60 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800'
                                }`
                            }
                        >
                            <Icon size={16} className="flex-shrink-0" />
                            <span className="hidden lg:inline">{item.label}</span>
                        </NavLink>
                    );
                })}
            </nav>

            {/* Bottom Actions Section */}
            <div className="flex lg:flex-col gap-2 lg:mt-auto items-center lg:items-stretch w-auto lg:w-full">
                {/* Theme Toggle Button */}
                <button
                    onClick={toggleDarkMode}
                    className="flex items-center justify-center lg:justify-start gap-3 px-3 py-2 rounded-xl text-[11px] font-semibold tracking-wide transition-all duration-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100/60 dark:text-slate-400 dark:hover:text-slate-200 dark:hover:bg-slate-800/60 border border-slate-200/50 dark:border-slate-800 btn-interactive lg:mb-2 bg-white/50 dark:bg-slate-900/30"
                >
                    {darkMode ? <Sun size={14} className="text-amber-500" /> : <Moon size={14} className="text-indigo-400" />}
                    <span className="hidden lg:inline">{darkMode ? 'Light Theme' : 'Dark Theme'}</span>
                </button>

                {/* Connection Status indicator */}
                <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200/50 dark:border-slate-800">
                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-detect-safe animate-pulse' : 'bg-red-400'}`} />
                    <span className="hidden lg:inline text-[11px] font-mono font-semibold text-slate-500 dark:text-slate-400 truncate max-w-[120px]">
                        {isConnected ? 'Server Online' : 'Server Offline'}
                    </span>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
