import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook that simulates a WebSocket connection for live road damage detection.
 * 
 * Detections only run when `isActive` is true (i.e., media source is loaded).
 * 
 * When the real backend is ready, replace the setInterval mock with:
 *   const ws = new WebSocket(WS_URL);
 *   ws.onmessage = (event) => { const data = JSON.parse(event.data); ... };
 */

const DAMAGE_TYPES = ['Pothole', 'Crack', 'Surface Erosion'];
const SEVERITY_MAP = { Pothole: 'High', Crack: 'Medium', 'Surface Erosion': 'Low' };

const randomBetween = (min, max) => Math.random() * (max - min) + min;

const generateEvent = (id) => {
    const type = DAMAGE_TYPES[Math.floor(Math.random() * DAMAGE_TYPES.length)];
    const confidence = parseFloat(randomBetween(0.65, 0.99).toFixed(2));

    const x = randomBetween(10, 70);
    const y = randomBetween(10, 70);
    const w = randomBetween(8, 20);
    const h = randomBetween(6, 15);

    return {
        id,
        type,
        confidence,
        severity: SEVERITY_MAP[type],
        bbox: [x, y, w, h],
        timestamp: new Date().toISOString(),
    };
};

const useLiveDetection = (isActive = false) => {
    const [events, setEvents] = useState([]);
    const [latestEvent, setLatestEvent] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [stats, setStats] = useState({
        totalDetections: 0,
        potholes: 0,
        cracks: 0,
        erosion: 0,
        avgConfidence: 0,
    });
    const eventIdRef = useRef(0);
    const confidenceSumRef = useRef(0);

    const updateStats = useCallback((event, total) => {
        setStats((prev) => {
            const updated = { ...prev };
            updated.totalDetections = total;
            if (event.type === 'Pothole') updated.potholes += 1;
            else if (event.type === 'Crack') updated.cracks += 1;
            else updated.erosion += 1;
            confidenceSumRef.current += event.confidence * 100;
            updated.avgConfidence = parseFloat((confidenceSumRef.current / total).toFixed(1));
            return updated;
        });
    }, []);

    useEffect(() => {
        // Only start detecting when a media source is active
        if (!isActive) {
            setIsConnected(false);
            return;
        }

        setIsConnected(true);

        const interval = setInterval(() => {
            eventIdRef.current += 1;
            const event = generateEvent(eventIdRef.current);

            setLatestEvent(event);
            setEvents((prev) => [event, ...prev].slice(0, 100));
            updateStats(event, eventIdRef.current);
        }, randomBetween(1500, 3000));

        return () => {
            clearInterval(interval);
            setIsConnected(false);
        };
    }, [isActive, updateStats]);

    return { events, latestEvent, isConnected, stats };
};

export default useLiveDetection;
