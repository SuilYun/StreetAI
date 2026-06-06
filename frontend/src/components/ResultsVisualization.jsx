import React from 'react';
import { AlertTriangle, CheckCircle, ChevronRight } from 'lucide-react';
import './ResultsVisualization.css';

const ResultsVisualization = ({ results }) => {
    if (!results) {
        return (
            <div className="results-container glass-panel empty-state">
                <div className="empty-icon">
                    <AlertTriangle size={32} color="var(--text-secondary)" />
                </div>
                <p>Awaiting upload to analyze road conditions.</p>
            </div>
        );
    }

    const { detected_issues, overall_severity, processed_image_url } = results;

    const getSeverityColor = (severity) => {
        switch (severity) {
            case 'High': return 'var(--danger)';
            case 'Medium': return 'var(--warning)';
            case 'Low': return 'var(--success)';
            default: return 'var(--text-secondary)';
        }
    };

    return (
        <div className="results-container glass-panel">
            <div className="results-header">
                <h2>Analysis Results</h2>
                <span
                    className="severity-badge"
                    style={{ backgroundColor: `${getSeverityColor(overall_severity)}20`, color: getSeverityColor(overall_severity), border: `1px solid ${getSeverityColor(overall_severity)}` }}
                >
                    {overall_severity} Severity
                </span>
            </div>

            <div className="results-content">
                <div className="image-preview" style={{ backgroundImage: `url(${processed_image_url})` }}>
                    {/* Typically bounding boxes come from the backend, implemented here as an example overlay */}
                    <div className="simulated-bounding-box"></div>
                </div>

                <div className="issues-list">
                    <h3>Detected Anomalies</h3>
                    {detected_issues.length === 0 ? (
                        <div className="issue-item success">
                            <CheckCircle size={20} color="var(--success)" />
                            <span>No road damage detected.</span>
                        </div>
                    ) : (
                        detected_issues.map((issue, idx) => (
                            <div key={idx} className="issue-item">
                                <div className="issue-info">
                                    <span className="issue-type">{issue.type}</span>
                                    <div className="confidence-bar-bg">
                                        <div className="confidence-bar-fill" style={{ width: `${issue.confidence * 100}%`, backgroundColor: getSeverityColor(issue.severity) }}></div>
                                    </div>
                                </div>
                                <span className="issue-confidence">{(issue.confidence * 100).toFixed(1)}%</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResultsVisualization;
