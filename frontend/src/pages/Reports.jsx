import React, { useState } from 'react';
import ManagementDashboard from '../components/ManagementDashboard';
import VideoReports from './VideoReports';
import { Image, Video } from 'lucide-react';

const Reports = () => {
    const [activeTab, setActiveTab] = useState('images');

    return (
        <div className="flex-1 min-h-0 flex flex-col gap-3 sm:gap-4 overflow-y-auto pr-1">
            {/* Page Header */}
            <div className="flex-shrink-0 border-b border-slate-200 dark:border-slate-800 pb-0 mb-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-2">
                    <div>
                        <h2 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-blue-500">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                <polyline points="14 2 14 8 20 8" />
                            </svg>
                            Report Registry
                        </h2>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                            Download images, videos &amp; PDF reports from AWS S3 storage
                        </p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-0" style={{ marginBottom: '-1px' }}>
                    <button
                        onClick={() => setActiveTab('images')}
                        className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-t-lg border border-b-0 transition-all duration-200 ${
                            activeTab === 'images'
                                ? 'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 border-slate-200 dark:border-slate-700'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                    >
                        <Image size={16} />
                        Image Reports
                    </button>
                    <button
                        onClick={() => setActiveTab('videos')}
                        className={`flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-t-lg border border-b-0 transition-all duration-200 ml-1 ${
                            activeTab === 'videos'
                                ? 'bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400 border-slate-200 dark:border-slate-700'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                    >
                        <Video size={16} />
                        Video Reports
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 min-h-0">
                {activeTab === 'images' ? (
                    <ManagementDashboard />
                ) : (
                    <VideoReports />
                )}
            </div>
        </div>
    );
};

export default Reports;
