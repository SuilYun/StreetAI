import React, { useEffect, useState, useRef } from 'react';
import anime from 'animejs';
import { fetchReports } from '../services/api';
import './ManagementDashboard.css';

const ManagementDashboard = () => {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await fetchReports();
                setReports(data);
            } catch (error) {
                console.error("Failed to fetch reports:", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const tableRef = useRef(null);

    useEffect(() => {
        if (!loading && tableRef.current) {
            const rows = tableRef.current.querySelectorAll('tr');
            anime.set(rows, { opacity: 0, translateX: -20 });
            anime({
                targets: rows,
                opacity: 1,
                translateX: 0,
                delay: anime.stagger(50),
                easing: 'easeOutQuad',
                duration: 500
            });
        }
    }, [loading]);

    const getSeverityClass = (severity) => {
        switch (severity) {
            case 'High': return 'severity-high';
            case 'Medium': return 'severity-medium';
            case 'Low': return 'severity-low';
            default: return '';
        }
    };

    return (
        <div className="dashboard-container glass-panel">
            <div className="dashboard-header">
                <h2>Recent Reports</h2>
                <span className="report-count">{reports.length} total</span>
            </div>

            {loading ? (
                <div className="dashboard-loading">
                    <p>Loading historical data...</p>
                </div>
            ) : (
                <div className="table-wrapper">
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Date</th>
                                <th>Issues</th>
                                <th>Severity</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody ref={tableRef}>
                            {reports.map((report) => (
                                <tr key={report.id} className="hover:bg-white/5 hover:scale-[1.01] transition-all duration-200 shadow-sm cursor-pointer border-b border-white/[0.02]">
                                    <td className="col-id">#{report.id}</td>
                                    <td className="col-date">{new Date(report.created_at).toLocaleDateString()}</td>
                                    <td className="col-issues">{report.damage_type}</td>
                                    <td className="col-severity">
                                        <span className={`badge ${getSeverityClass(report.severity)}`}>
                                            {report.severity}
                                        </span>
                                    </td>
                                    <td className="col-action">
                                        <button className="btn-view" onClick={(e) => { e.stopPropagation(); alert(`View details for Report #${report.id}\n(Feature not implemented yet)`); }}>View</button>
                                    </td>
                                </tr>
                            ))}
                            {reports.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="empty-row">No reports found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ManagementDashboard;
