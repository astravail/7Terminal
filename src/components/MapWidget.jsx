import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;

const getIcon = (isFlashing) => new L.DivIcon({
  className: 'custom-div-icon',
  html: `<div style="background-color: var(--text-amber); width: 12px; height: 12px; border-radius: 50%; box-shadow: 0 0 12px var(--text-amber); transition: all 0.2s; ${isFlashing ? 'transform: scale(2); background-color: var(--color-up); box-shadow: 0 0 20px var(--color-up);' : ''}"></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6]
});

const EXCHANGES = [
  { id: 1, name: 'NYSE', city: 'New York', region: 'NA', lat: 40.7069, lng: -74.0113 },
  { id: 2, name: 'NASDAQ', city: 'New York', region: 'NA', lat: 40.7589, lng: -73.9851 },
  { id: 3, name: 'LSE', city: 'London', region: 'EU', lat: 51.5153, lng: -0.0998 },
  { id: 4, name: 'Euronext', city: 'Paris', region: 'EU', lat: 48.8686, lng: 2.3415 },
  { id: 5, name: 'TSE', city: 'Tokyo', region: 'AS', lat: 35.6815, lng: 139.7771 },
  { id: 6, name: 'HKEX', city: 'Hong Kong', region: 'AS', lat: 22.2841, lng: 114.1578 },
  { id: 7, name: 'ASX', city: 'Sydney', region: 'OC', lat: -33.8642, lng: 151.2057 },
  { id: 8, name: 'TSX', city: 'Toronto', region: 'NA', lat: 43.6481, lng: -79.3819 },
  { id: 9, name: 'SSE', city: 'Shanghai', region: 'AS', lat: 31.2382, lng: 121.5063 },
  { id: 10, name: 'Frankfurt SE', city: 'Frankfurt', region: 'EU', lat: 50.1154, lng: 8.6775 },
];

const MapWidget = ({ latestTrade }) => {
  const [filter, setFilter] = useState('ALL');
  const [flashingId, setFlashingId] = useState(null);

  useEffect(() => {
    if (latestTrade) {
      const randomExchangeId = EXCHANGES[Math.floor(Math.random() * EXCHANGES.length)].id;
      setFlashingId(randomExchangeId);
      
      const timer = setTimeout(() => {
        setFlashingId(null);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [latestTrade]);

  const filteredExchanges = filter === 'ALL' 
    ? EXCHANGES 
    : EXCHANGES.filter(e => e.region === filter);

  return (
    <div className="panel map-panel" style={{ position: 'relative' }}>
      <div className="panel-header">
        <span>GLOBAL TRADING BMAP</span>
        <div style={{ display: 'flex', gap: '4px' }}>
          {['ALL', 'NA', 'EU', 'AS', 'OC'].map(reg => (
            <button 
              key={reg}
              onClick={() => setFilter(reg)}
              style={{
                background: filter === reg ? 'var(--text-amber)' : 'transparent',
                color: filter === reg ? '#000' : 'var(--text-white)',
                border: '1px solid var(--border-color)',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '10px',
                padding: '1px 4px',
                outline: 'none',
                fontWeight: 'bold'
              }}
            >
              {reg}
            </button>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, zIndex: 1 }}>
        <MapContainer center={[20, 0]} zoom={2} style={{ height: '100%', width: '100%' }} zoomControl={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {filteredExchanges.map(exchange => (
            <Marker 
              key={exchange.id} 
              position={[exchange.lat, exchange.lng]} 
              icon={getIcon(flashingId === exchange.id)}
            >
              <Popup>
                <div style={{ textAlign: 'center', fontFamily: 'Courier New', color: 'black' }}>
                  <strong>{exchange.name}</strong><br/>
                  <span>{exchange.city}</span>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapWidget;
