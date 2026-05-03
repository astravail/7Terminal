import React, { useEffect, useState } from 'react';

const SummaryBar = ({ symbol }) => {
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

  if (!stats || !stats.lastPrice) return <div className="summary-row" style={{color: 'var(--text-grey)'}}>Loading...</div>;

  const isUp = parseFloat(stats.priceChangePercent) >= 0;
  const colorClass = isUp ? 'text-up' : 'text-down';

  return (
    <div className="summary-row" style={{ fontSize: '15px', fontWeight: 'bold' }}>
      <span className="text-white" style={{ marginRight: '16px' }}>{symbol.replace('USDT', '')} US $</span>
      <span className={colorClass} style={{ marginRight: '16px' }}>
        {isUp ? '↑' : '↓'} {parseFloat(stats.lastPrice).toFixed(2)}
      </span>
      <span className={colorClass} style={{ marginRight: '32px' }}>
        {isUp ? '+' : ''}{parseFloat(stats.priceChange).toFixed(2)} ({parseFloat(stats.priceChangePercent).toFixed(2)}%)
      </span>
      
      <span className="text-amber" style={{ fontSize: '12px', marginRight: '8px' }}>At {new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })} d</span>
      
      <span className="text-amber" style={{ fontSize: '12px', marginRight: '4px' }}>Vol</span>
      <span className="text-white" style={{ fontSize: '12px', marginRight: '16px' }}>{parseFloat(stats.volume).toLocaleString(undefined, {maximumFractionDigits: 0})}</span>
      
      <span className="text-amber" style={{ fontSize: '12px', marginRight: '4px' }}>O</span>
      <span className="text-white" style={{ fontSize: '12px', marginRight: '16px' }}>{parseFloat(stats.openPrice).toFixed(2)}P</span>
      
      <span className="text-amber" style={{ fontSize: '12px', marginRight: '4px' }}>H</span>
      <span className="text-white" style={{ fontSize: '12px', marginRight: '16px' }}>{parseFloat(stats.highPrice).toFixed(2)}P</span>
      
      <span className="text-amber" style={{ fontSize: '12px', marginRight: '4px' }}>L</span>
      <span className="text-white" style={{ fontSize: '12px', marginRight: '16px' }}>{parseFloat(stats.lowPrice).toFixed(2)}Q</span>
      
      <span className="text-amber" style={{ fontSize: '12px', marginRight: '4px' }}>Val</span>
      <span className="text-white" style={{ fontSize: '12px' }}>{(parseFloat(stats.quoteVolume) / 1000000).toFixed(3)}M</span>
    </div>
  );
};

export default SummaryBar;
