import React from 'react';
import ManagementDashboard from '../components/ManagementDashboard';

const Reports = () => {
    return (
        <div className="flex-1 min-h-0 flex flex-col gap-4 overflow-y-auto pr-1">
            {/* Page Header */}
            <div className="flex-shrink-0 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 mb-1">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Database Registry</h2>
                    <p className="text-xs text-slate-400 dark:text-slate-500">Historical records of YOLO-detected road anomalies and metadata</p>
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
