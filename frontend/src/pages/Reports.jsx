import React from 'react';
import ManagementDashboard from '../components/ManagementDashboard';

const Reports = () => {
    return (
        <div className="flex-1 min-h-0 flex flex-col gap-4 overflow-y-auto pr-1">
            {/* Page Header */}
            <div className="flex-shrink-0 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-1">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-blue-500">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                        </svg>
                        Report Registry
                    </h2>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Download images & PDF reports from AWS S3 storage</p>
                </div>
            </div>

            {/* Management Table Container */}
            <div className="flex-1 min-h-0">
                <ManagementDashboard />
            </div>
        </div>
    );
};

export default Reports;
