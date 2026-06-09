import React, { useState, useEffect } from 'react';
import { fetchVideoReports, downloadVideo, downloadVideoPdf, getImageUrl } from '../services/api';
import { Video, Download, Clock, AlertTriangle, Eye, ChevronDown, Film, Activity, Shield, FileText } from 'lucide-react';
import './VideoReports.css';

const VideoReports = () => {
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('All');
    const [expandedId, setExpandedId] = useState(null);
    const [downloading, setDownloading] = useState(null);
    const [downloadingPdf, setDownloadingPdf] = useState(null);

    useEffect(() => {
        loadVideos();
    }, []);

    const loadVideos = async () => {
        setLoading(true);
        try {
            const data = await fetchVideoReports();
            setVideos(data);
        } catch (err) {
            console.error('Failed to load video reports:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async (id, filename) => {
        setDownloading(id);
        try {
            await downloadVideo(id, filename);
        } catch (err) {
            alert('Download failed: ' + err.message);
        } finally {
            setDownloading(null);
        }
    };

    const handlePdfDownload = async (id) => {
        setDownloadingPdf(id);
        try {
            await downloadVideoPdf(id);
        } catch (err) {
            alert('PDF download failed: ' + err.message);
        } finally {
            setDownloadingPdf(null);
        }
    };

    const getSeverityClass = (severity) => {
        switch (severity) {
            case 'High': return 'severity-high';
            case 'Medium': return 'severity-medium';
            case 'Low': return 'severity-low';
            default: return 'severity-none';
        }
    };

    const getSeverityIcon = (severity) => {
        switch (severity) {
            case 'High': return <AlertTriangle size={14} />;
            case 'Medium': return <Shield size={14} />;
            case 'Low': return <Activity size={14} />;
            default: return <Eye size={14} />;
        }
    };

    const formatDuration = (seconds) => {
        if (!seconds) return '—';
        const m = Math.floor(seconds / 60);
        const s = Math.round(seconds % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) +
            ' at ' + d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    const filtered = filter === 'All' ? videos : videos.filter(v => v.worst_severity === filter);

    const stats = {
        total: videos.length,
        highCount: videos.filter(v => v.worst_severity === 'High').length,
        totalFrames: videos.reduce((sum, v) => sum + v.frames_scanned, 0),
        avgConfidence: videos.length > 0 ? Math.round(videos.reduce((sum, v) => sum + v.peak_confidence, 0) / videos.length) : 0,
    };

    const parseTimeline = (timelineStr) => {
        try { return JSON.parse(timelineStr || '[]'); } catch { return []; }
    };

    if (loading) {
        return (
            <div className="vr-page">
                <div className="vr-loading">
                    <div className="vr-spinner"></div>
                    <p>Loading video reports...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="vr-page">
            {/* Header */}
            <div className="vr-header">
                <div className="vr-header-text">
                    <div className="vr-header-icon">
                        <Film size={24} />
                    </div>
                    <div>
                        <h1>Video Analysis Registry</h1>
                        <p>Archived video scans with frame-by-frame AI detection results</p>
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="vr-stats-row">
                <div className="vr-stat-card">
                    <span className="vr-stat-label">Total Videos</span>
                    <span className="vr-stat-value">{stats.total}</span>
                </div>
                <div className="vr-stat-card vr-stat-danger">
                    <span className="vr-stat-label">Critical Scans</span>
                    <span className="vr-stat-value">{stats.highCount}</span>
                </div>
                <div className="vr-stat-card">
                    <span className="vr-stat-label">Frames Analyzed</span>
                    <span className="vr-stat-value">{stats.totalFrames.toLocaleString()}</span>
                </div>
                <div className="vr-stat-card">
                    <span className="vr-stat-label">Avg Peak Conf.</span>
                    <span className="vr-stat-value">{stats.avgConfidence}%</span>
                </div>
            </div>

            {/* Filter Pills */}
            <div className="vr-filters">
                {['All', 'High', 'Medium', 'Low', 'None'].map(f => (
                    <button
                        key={f}
                        className={`vr-filter-pill ${filter === f ? 'active' : ''} ${f !== 'All' ? getSeverityClass(f) : ''}`}
                        onClick={() => setFilter(f)}
                    >
                        {f === 'All' ? `All (${videos.length})` : `${f} (${videos.filter(v => v.worst_severity === f).length})`}
                    </button>
                ))}
            </div>

            {/* Video List */}
            {filtered.length === 0 ? (
                <div className="vr-empty">
                    <Video size={48} strokeWidth={1} />
                    <h3>No video reports found</h3>
                    <p>Upload a video from the Dashboard to start analysis</p>
                </div>
            ) : (
                <div className="vr-list">
                    {filtered.map((video) => {
                        const timeline = parseTimeline(video.timeline_data);
                        const isExpanded = expandedId === video.id;

                        return (
                            <div key={video.id} className={`vr-card ${getSeverityClass(video.worst_severity)}`}>
                                <div className="vr-card-main" onClick={() => setExpandedId(isExpanded ? null : video.id)}>
                                    {/* Left: Video icon */}
                                    <div className={`vr-card-icon ${getSeverityClass(video.worst_severity)}`}>
                                        <Video size={22} />
                                    </div>

                                    {/* Center: Info */}
                                    <div className="vr-card-info">
                                        <div className="vr-card-title">
                                            <span className="vr-filename">{video.filename}</span>
                                            <span className={`vr-severity-badge ${getSeverityClass(video.worst_severity)}`}>
                                                {getSeverityIcon(video.worst_severity)}
                                                {video.worst_severity}
                                            </span>
                                        </div>
                                        <div className="vr-card-meta">
                                            <span><Clock size={12} /> {formatDate(video.created_at)}</span>
                                            <span><Film size={12} /> {video.frames_scanned} frames</span>
                                            <span><AlertTriangle size={12} /> {video.damage_frames} damage</span>
                                            <span><Activity size={12} /> {video.peak_confidence}% peak</span>
                                        </div>

                                        {/* Damage progress bar */}
                                        <div className="vr-damage-bar">
                                            <div
                                                className={`vr-damage-fill ${getSeverityClass(video.worst_severity)}`}
                                                style={{
                                                    width: video.frames_scanned > 0
                                                        ? `${Math.min((video.damage_frames / video.frames_scanned) * 100, 100)}%`
                                                        : '0%'
                                                }}
                                            ></div>
                                        </div>
                                        <span className="vr-damage-label">
                                            {video.frames_scanned > 0
                                                ? `${Math.round((video.damage_frames / video.frames_scanned) * 100)}% frames with damage`
                                                : 'No frames analyzed'}
                                        </span>
                                    </div>

                                    {/* Right: Actions */}
                                    <div className="vr-card-actions">
                                        <button
                                            className="vr-btn-pdf"
                                            onClick={(e) => { e.stopPropagation(); handlePdfDownload(video.id); }}
                                            disabled={downloadingPdf === video.id}
                                            title="Download PDF Report"
                                        >
                                            {downloadingPdf === video.id ? (
                                                <div className="vr-btn-spinner"></div>
                                            ) : (
                                                <FileText size={16} />
                                            )}
                                        </button>
                                        <button
                                            className="vr-btn-download"
                                            onClick={(e) => { e.stopPropagation(); handleDownload(video.id, video.filename); }}
                                            disabled={downloading === video.id || !video.video_url}
                                            title="Download Video"
                                        >
                                            {downloading === video.id ? (
                                                <div className="vr-btn-spinner"></div>
                                            ) : (
                                                <Download size={16} />
                                            )}
                                        </button>
                                        <button
                                            className={`vr-btn-expand ${isExpanded ? 'expanded' : ''}`}
                                            onClick={(e) => { e.stopPropagation(); setExpandedId(isExpanded ? null : video.id); }}
                                            title="View Timeline"
                                        >
                                            <ChevronDown size={16} />
                                        </button>
                                    </div>
                                </div>

                                {/* Expanded: Timeline */}
                                {isExpanded && (
                                    <div className="vr-timeline">
                                        <h4>Detection Timeline</h4>
                                        {timeline.length === 0 ? (
                                            <p className="vr-no-timeline">No damage detections in this video.</p>
                                        ) : (
                                            <div className="vr-timeline-list">
                                                {timeline.slice(0, 20).map((entry, idx) => (
                                                    <div key={idx} className="vr-timeline-entry">
                                                        <span className="vr-tl-time">{entry.timestamp}s</span>
                                                        <div className="vr-tl-dot"></div>
                                                        <div className="vr-tl-issues">
                                                            {entry.detected_issues.map((issue, i) => (
                                                                <span key={i} className={`vr-tl-issue ${getSeverityClass(issue.severity)}`}>
                                                                    {issue.type} — {Math.round(issue.confidence * 100)}%
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                                {timeline.length > 20 && (
                                                    <p className="vr-tl-more">+ {timeline.length - 20} more detections...</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default VideoReports;
