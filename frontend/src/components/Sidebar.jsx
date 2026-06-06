import React from 'react';
import { NavLink } from 'react-router-dom';
import { Shield, LayoutDashboard, BarChart3, Database } from 'lucide-react';

const Sidebar = ({ isConnected }) => {
    const navItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/analytics', label: 'Analytics', icon: BarChart3 },
        { path: '/reports', label: 'Reports', icon: Database },
    ];

    return (
        <aside className="h-16 lg:h-full w-full lg:w-64 flex-shrink-0 flex lg:flex-col justify-between items-center lg:items-stretch bg-white/70 backdrop-blur-md border-b lg:border-b-0 lg:border-r border-slate-200/60 p-4 z-40 transition-all duration-300">
            {/* Logo Section */}
            <div className="hidden lg:flex items-center gap-3 mb-8 px-2">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-md shadow-blue-500/20">
                    <Shield size={18} className="text-white" />
                </div>
                <div>
                    <h1 className="text-lg font-bold text-slate-800 tracking-tight">RoadAI</h1>
                    <span className="text-[10px] text-slate-400 font-mono">v11.0.0</span>
                </div>
            </div>

            {/* Mobile Brand / Logo (only on small viewports) */}
            <div className="flex lg:hidden items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                    <Shield size={16} className="text-white" />
                </div>
                <span className="text-sm font-bold text-slate-800">RoadAI</span>
            </div>

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
                                        ? 'bg-blue-50 text-accent-blue border border-blue-100 shadow-sm shadow-blue-500/5'
                                        : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100/60'
                                }`
                            }
                        >
                            <Icon size={16} className="flex-shrink-0" />
                            <span className="hidden lg:inline">{item.label}</span>
                        </NavLink>
                    );
                })}
            </nav>

            {/* Connection Status indicator */}
            <div className="lg:mt-auto flex items-center gap-2.5 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/50">
                <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-detect-safe animate-pulse' : 'bg-red-400'}`} />
                <span className="hidden lg:inline text-[11px] font-mono font-semibold text-slate-500 truncate max-w-[120px]">
                    {isConnected ? 'Server Online' : 'Server Offline'}
                </span>
            </div>
        </aside>
    );
};

export default Sidebar;
