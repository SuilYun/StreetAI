import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
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

// Default hot zones for demo purposes (until backend provides real GPS data)
const DEFAULT_ZONES = [
    { id: 'd1', lat: 40.7128, lng: -74.006, location: 'Main St & 5th Ave', severity: 'High', issues: 'Pothole (94%)' },
    { id: 'd2', lat: 40.7589, lng: -73.9851, location: 'Highway 61', severity: 'Medium', issues: 'Crack (88%)' },
    { id: 'd3', lat: 40.7282, lng: -73.7949, location: 'Elm Street', severity: 'Low', issues: 'Crack (75%)' },
    { id: 'd4', lat: 40.6892, lng: -74.0445, location: 'Oak Boulevard', severity: 'High', issues: 'Pothole (99%)' },
];

const HeatmapView = ({ height = '280px', hideHeader = false }) => {
    const [hotZones, setHotZones] = useState(DEFAULT_ZONES);
    const [mapError, setMapError] = useState(false);

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
                center={[40.7128, -74.006]}
                zoom={11}
                style={{ height, width: '100%', flex: 1 }}
                scrollWheelZoom={false}
                zoomControl={false}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                />
                {hotZones
                    .filter((zone) => zone.lat != null && zone.lng != null)
                    .map((zone) => (
                        <CircleMarker
                            key={zone.id}
                            center={[zone.lat, zone.lng]}
                            radius={SEVERITY_RADIUS[zone.severity] || 8}
                            pathOptions={{
                                color: SEVERITY_COLORS[zone.severity] || '#3b82f6',
                                fillColor: SEVERITY_COLORS[zone.severity] || '#3b82f6',
                                fillOpacity: 0.4,
                                weight: 2,
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
