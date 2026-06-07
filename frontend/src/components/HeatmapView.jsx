import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const SEVERITY_COLORS = {
    High: '#ef4444',
    Medium: '#f59e0b',
    Low: '#10b981',
};

const SEVERITY_RADIUS = {
    High: 12,
    Medium: 9,
    Low: 6,
};

const ChangeMapView = ({ center, zoom }) => {
    const map = useMap();
    useEffect(() => {
        if (center) {
            map.setView(center, zoom);
        }
    }, [center, zoom, map]);
    return null;
};

// Default hot zones for demo purposes (until backend provides real GPS data)
export const DEFAULT_ZONES = [
    { id: 'd1', lat: 12.9716, lng: 77.5946, location: 'MG Road, Bengaluru', severity: 'High', issues: 'Pothole (94%)', time: '10m ago' },
    { id: 'd2', lat: 12.9352, lng: 77.6245, location: 'Koramangala, Bengaluru', severity: 'High', issues: 'Pothole (99%)', time: '25m ago' },
    { id: 'd3', lat: 13.0354, lng: 77.5988, location: 'Hebbal Flyover, Bengaluru', severity: 'Medium', issues: 'Alligator Cracks (88%)', time: '40m ago' },
    { id: 'd4', lat: 12.9307, lng: 77.5838, location: 'Jayanagar, Bengaluru', severity: 'Low', issues: 'Transverse Cracks (75%)', time: '1h ago' },
];

const HeatmapView = ({ 
    height = '280px', 
    hideHeader = false, 
    center = [12.9716, 77.5946], 
    zoom = 11, 
    selectedZoneId = null 
}) => {
    const [hotZones, setHotZones] = useState(DEFAULT_ZONES);
    const [mapError, setMapError] = useState(false);
    const [isDark, setIsDark] = useState(() => document.documentElement.classList.contains('dark'));

    useEffect(() => {
        const observer = new MutationObserver(() => {
            setIsDark(document.documentElement.classList.contains('dark'));
        });
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

    // If the map crashes, show a fallback
    if (mapError) {
        return (
            <div className="glass-panel overflow-hidden h-full">
                {!hideHeader && (
                    <div className="px-4 py-3 border-b border-white/[0.06]">
                        <h3 className="text-sm font-semibold text-mission-100">Damage Hot Zones</h3>
                    </div>
                )}
                <div className="flex items-center justify-center text-mission-400 text-sm" style={{ height }}>
                    Map failed to load. Check Leaflet installation.
                </div>
            </div>
        );
    }

    return (
        <div className="glass-panel overflow-hidden h-full flex flex-col">
            {!hideHeader && (
                <div className="px-4 py-3 border-b border-slate-200/50 flex-shrink-0 bg-white">
                    <h3 className="text-sm font-semibold text-mission-100">Damage Hot Zones</h3>
                </div>
            )}
            <MapContainer
                center={center}
                zoom={zoom}
                style={{ height, width: '100%', flex: 1 }}
                scrollWheelZoom={true}
                zoomControl={true}
            >
                <ChangeMapView center={center} zoom={zoom} />
                <TileLayer
                    url={isDark 
                        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" 
                        : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"}
                    attribution={isDark 
                        ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
                        : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'}
                />
                {hotZones
                    .filter((zone) => zone.lat != null && zone.lng != null)
                    .map((zone) => (
                        <CircleMarker
                            key={zone.id}
                            center={[zone.lat, zone.lng]}
                            radius={zone.id === selectedZoneId ? (SEVERITY_RADIUS[zone.severity] * 1.5) : (SEVERITY_RADIUS[zone.severity] || 8)}
                            pathOptions={{
                                color: zone.id === selectedZoneId ? '#38bdf8' : (SEVERITY_COLORS[zone.severity] || '#3b82f6'),
                                fillColor: SEVERITY_COLORS[zone.severity] || '#3b82f6',
                                fillOpacity: zone.id === selectedZoneId ? 0.75 : 0.4,
                                weight: zone.id === selectedZoneId ? 4 : 2,
                            }}
                        >
                            <Popup>
                                <div style={{ color: '#0f172a', fontSize: '12px', fontWeight: 500, lineHeight: 1.5 }}>
                                    <strong>{zone.location}</strong><br />
                                    {zone.issues}<br />
                                    Severity: {zone.severity}
                                </div>
                            </Popup>
                        </CircleMarker>
                    ))}
            </MapContainer>
        </div>
    );
};

export default HeatmapView;
