// src/services/api.js

/**
 * API service for the FastAPI backend.
 * Currently connected to the YOLO backend.
 * When your teammate's backend is ready, just change BASE_URL.
 */
const BASE_URL = 'http://127.0.0.1:8000';

export const WS_URL = 'ws://localhost:8000/ws/detections';

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
                    { category: 'Potholes (D40)', value: 85, fullMark: 100 },
                    { category: 'Longitudinal Cracks (D00)', value: 65, fullMark: 100 },
                    { category: 'Transverse Cracks (D10)', value: 45, fullMark: 100 },
                    { category: 'Healthy Road Conditions', value: 30, fullMark: 100 },
                    { category: 'Alligator Cracks (D20)', value: 55, fullMark: 100 },
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
