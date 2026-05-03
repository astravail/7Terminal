import React, { useEffect, useState } from 'react';

const SummaryBar = ({ symbol, activeView }) => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}`);
        const data = await response.json();
        setStats(data);
      } catch (error) {}
    };
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, [symbol]);

  const asset = symbol.replace('USDT', '');

  if (!stats || !stats.lastPrice) {
    return (
      <div className="summary-row" style={{ color: 'var(--text-grey)', fontSize: '12px' }}>
        <span className="text-amber" style={{ marginRight: '8px' }}>Loading {asset}...</span>
      </div>
    );
  }

  const isUp = parseFloat(stats.priceChangePercent) >= 0;
  const colorClass = isUp ? 'text-up' : 'text-down';
  const now = new Date();

  return (
    <div className="summary-row" style={{ fontSize: '12px', fontWeight: 'bold', gap: '12px' }}>
      <span className="text-white">{asset} US$</span>
      <span className={colorClass}>
        {isUp ? '▲' : '▼'} {parseFloat(stats.lastPrice).toFixed(2)}
      </span>
      <span className={colorClass}>
        {isUp ? '+' : ''}{parseFloat(stats.priceChange).toFixed(2)} ({parseFloat(stats.priceChangePercent).toFixed(2)}%)
      </span>

      <span className="text-grey" style={{ fontWeight: 'normal' }}>|</span>

      <span className="text-amber" style={{ fontSize: '11px', fontWeight: 'normal' }}>At</span>
      <span className="text-white" style={{ fontSize: '11px', fontWeight: 'normal' }}>
        {now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </span>

      <span className="text-amber mono-xs" style={{ fontWeight: 'normal' }}>Vol</span>
      <span className="text-white mono-xs" style={{ fontWeight: 'normal' }}>{parseFloat(stats.volume).toLocaleString(undefined, {maximumFractionDigits: 0})}</span>

      <span className="text-amber mono-xs" style={{ fontWeight: 'normal' }}>O</span>
      <span className="text-white mono-xs" style={{ fontWeight: 'normal' }}>{parseFloat(stats.openPrice).toFixed(2)}</span>

      <span className="text-amber mono-xs" style={{ fontWeight: 'normal' }}>H</span>
      <span className="text-white mono-xs" style={{ fontWeight: 'normal' }}>{parseFloat(stats.highPrice).toFixed(2)}</span>

      <span className="text-amber mono-xs" style={{ fontWeight: 'normal' }}>L</span>
      <span className="text-white mono-xs" style={{ fontWeight: 'normal' }}>{parseFloat(stats.lowPrice).toFixed(2)}</span>

      <span className="text-amber mono-xs" style={{ fontWeight: 'normal' }}>VWAP</span>
      <span className="text-white mono-xs" style={{ fontWeight: 'normal' }}>{parseFloat(stats.weightedAvgPrice).toFixed(2)}</span>

      <span className="text-amber mono-xs" style={{ fontWeight: 'normal' }}>Val</span>
      <span className="text-white mono-xs" style={{ fontWeight: 'normal' }}>{(parseFloat(stats.quoteVolume) / 1000000).toFixed(1)}M</span>

      <span style={{ flex: 1 }} />
      
      <span className="text-grey mono-xs" style={{ fontWeight: 'normal', padding: '1px 6px', border: '1px solid var(--border-color)' }}>
        {activeView}
      </span>
    </div>
  );
};

export default SummaryBar;
