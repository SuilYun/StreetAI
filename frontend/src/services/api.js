// src/services/api.js

/**
 * API service for the FastAPI backend.
 *
 * DEPLOYMENT CONFIGURATION:
 * ─────────────────────────
 * Set the VITE_API_URL environment variable in your Render / hosting dashboard
 * to point to your deployed backend URL.
 *
 * Example (Render environment variable):
 *   VITE_API_URL=https://your-backend-name.onrender.com
 *
 * For local development, it defaults to http://127.0.0.1:8000
 */
const getBaseUrl = () => {
    // 1. Explicit env var always wins
    if (import.meta.env.VITE_API_URL) return import.meta.env.VITE_API_URL;

    // 2. Local development / LAN access
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        const isLocalOrLAN = 
            hostname === 'localhost' || 
            hostname === '127.0.0.1' || 
            hostname.startsWith('192.168.') || 
            hostname.startsWith('10.') || 
            (hostname.startsWith('172.') && parseInt(hostname.split('.')[1]) >= 16 && parseInt(hostname.split('.')[1]) <= 31) ||
            hostname.endsWith('.local');

        if (isLocalOrLAN) {
            // Assume backend is on the same host but port 8000
            return `http://${hostname}:8000`;
        }
    }

    // 3. Deployed — fallback to your deployed Render backend
    return 'https://street-scan-api.onrender.com';
};

const BASE_URL = getBaseUrl();

const getWsUrl = () => {
    if (import.meta.env.VITE_WS_URL) return import.meta.env.VITE_WS_URL;
    const protocol = BASE_URL.startsWith('https') ? 'wss' : 'ws';
    const host = BASE_URL.replace(/^https?:\/\//, '');
    return `${protocol}://${host}/ws/detections`;
};

export const WS_URL = getWsUrl();

// ──────────────────────────────────────────────
// Health Check
// ──────────────────────────────────────────────
export const checkServerStatus = async () => {
    try {
        const response = await fetch(`${BASE_URL}/`);
        return response.ok;
    } catch (error) {
        return false;
    }
};

// ──────────────────────────────────────────────
// Image Upload — sends to real backend
// ──────────────────────────────────────────────
export const uploadImage = async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('latitude', '0.0');
    formData.append('longitude', '0.0');

    const response = await fetch(`${BASE_URL}/api/reports/`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Upload failed' }));
        throw new Error(error.detail || 'Upload failed');
    }

    const data = await response.json();
    return {
        success: true,
        data: data.analysis || {
            detected_issues: [{
                type: data.damage_type,
                severity: data.severity,
                confidence: data.confidence,
                bbox: [20, 20, 40, 40] // Placeholder if analysis not returned
            }]
        }
    };
};

// ──────────────────────────────────────────────
// Video Upload — sends to real backend
// ──────────────────────────────────────────────
export const uploadVideo = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${BASE_URL}/api/reports/video`, {
        method: 'POST',
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ detail: 'Upload failed' }));
        throw new Error(error.detail || 'Upload failed');
    }

    return response.json();
};

// ──────────────────────────────────────────────
// Fetch Historical Reports from backend
// ──────────────────────────────────────────────
export const fetchReports = async () => {
    try {
        const response = await fetch(`${BASE_URL}/api/reports/`);
        if (!response.ok) throw new Error('Failed to fetch reports');
        return response.json();
    } catch (error) {
        console.warn('Backend not available, using empty reports:', error.message);
        return [];
    }
};

// ──────────────────────────────────────────────
// Fetch Analytics (still mocked — backend doesn't have this yet)
// ──────────────────────────────────────────────
export const fetchAnalytics = async () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                radarData: [
                    { category: 'Potholes', value: 85, fullMark: 100 },
                    { category: 'Longitudinal Cracks', value: 65, fullMark: 100 },
                    { category: 'Transverse Cracks', value: 45, fullMark: 100 },
                    { category: 'Alligator Cracks', value: 55, fullMark: 100 },
                ],
                kpis: {
                    totalDetections: 1247,
                    avgConfidence: 87.3,
                    criticalAlerts: 42,
                    uptimeHours: 168,
                },
            });
        }, 600);
    });
};

/**
 * Helper: Get the full URL for an uploaded image.
 * The backend serves images at /uploads/filename.ext
 */
export const getImageUrl = (relativePath) => {
    if (!relativePath) return '';
    if (relativePath.startsWith('http') || relativePath.startsWith('blob:')) return relativePath;
    return `${BASE_URL}${relativePath}`;
};

// ──────────────────────────────────────────────
// Download Report Image from S3
// ──────────────────────────────────────────────
export const downloadReportImage = async (reportId) => {
    const response = await fetch(`${BASE_URL}/api/reports/${reportId}/download-image`);
    if (!response.ok) throw new Error('Failed to download image');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `road_damage_report_${reportId}.jpg`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
};

// ──────────────────────────────────────────────
// Download PDF Report
// ──────────────────────────────────────────────
export const downloadReportPdf = async (reportId) => {
    const response = await fetch(`${BASE_URL}/api/reports/${reportId}/download-pdf`);
    if (!response.ok) throw new Error('Failed to generate PDF');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `StreetScan_Report_${reportId}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
};

// ──────────────────────────────────────────────
// Video Reports
// ──────────────────────────────────────────────
export const fetchVideoReports = async () => {
    try {
        const response = await fetch(`${BASE_URL}/api/reports/videos/list`);
        if (!response.ok) throw new Error('Failed to fetch video reports');
        return response.json();
    } catch (error) {
        console.warn('Backend not available for video reports:', error.message);
        return [];
    }
};

export const downloadVideo = async (videoId, filename) => {
    const response = await fetch(`${BASE_URL}/api/reports/videos/${videoId}/download`);
    if (!response.ok) throw new Error('Failed to download video');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || `video_${videoId}.mp4`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
};

export const downloadVideoPdf = async (videoId) => {
    const response = await fetch(`${BASE_URL}/api/reports/videos/${videoId}/download-pdf`);
    if (!response.ok) throw new Error('Failed to generate video PDF');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `StreetScan_Video_Report_${videoId}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
};

