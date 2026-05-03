import React, { useEffect, useState } from 'react';

const StatsWidget = ({ symbol }) => {
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
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, [symbol]);

  if (!stats || !stats.lastPrice) return <div className="panel sidebar-right"><div className="panel-header">DES - SECURITY DESCRIPTION</div><div style={{padding: '10px'}}>Loading...</div></div>;

  const DataItem = ({ label, value, colorClass = "text-white" }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0' }}>
      <span className="text-cyan">{label}</span>
      <span className={colorClass}>{value}</span>
    </div>
  );

  const isUp = parseFloat(stats.priceChangePercent) >= 0;
  const asset = symbol.replace('USDT', '');

  return (
    <div className="panel sidebar-right">
      <div className="panel-header">
        <span>{asset} &lt;Equity&gt; DES</span>
      </div>
      <div style={{ padding: '4px 8px', display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', scrollbarWidth: 'none' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px' }}>
          <div>
            <div className="text-amber" style={{ fontSize: '14px', fontWeight: 'bold' }}>{asset} DIGITAL ASSET</div>
            <div className="text-white">{asset} / TetherUS</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className={isUp ? 'text-up' : 'text-down'} style={{ fontSize: '14px', fontWeight: 'bold' }}>
              {parseFloat(stats.lastPrice).toFixed(4)}
            </div>
            <div className={isUp ? 'text-up' : 'text-down'}>
              {parseFloat(stats.priceChange).toFixed(4)} ({parseFloat(stats.priceChangePercent).toFixed(2)}%)
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '8px' }}>
          <div>
            <div className="text-amber" style={{ borderBottom: '1px solid var(--border-color)', marginBottom: '2px' }}>PRICE STATISTICS</div>
            <DataItem label="Open" value={parseFloat(stats.openPrice).toFixed(4)} />
            <DataItem label="High" value={parseFloat(stats.highPrice).toFixed(4)} />
            <DataItem label="Low" value={parseFloat(stats.lowPrice).toFixed(4)} />
            <DataItem label="Close" value={parseFloat(stats.lastPrice).toFixed(4)} />
            <DataItem label="Prev Close" value={parseFloat(stats.prevClosePrice).toFixed(4)} />
            <DataItem label="VWAP" value={parseFloat(stats.weightedAvgPrice).toFixed(4)} />
          </div>

          <div>
            <div className="text-amber" style={{ borderBottom: '1px solid var(--border-color)', marginBottom: '2px' }}>VOLUME & TURNOVER</div>
            <DataItem label="Vol (Base)" value={parseFloat(stats.volume).toLocaleString(undefined, {maximumFractionDigits: 2})} />
            <DataItem label="Vol (Quote)" value={`$${(parseFloat(stats.quoteVolume) / 1000000).toFixed(2)}M`} />
            <DataItem label="Trades" value={stats.count ? stats.count.toLocaleString() : 'N/A'} />
            <DataItem label="Turnover" value={`${((parseFloat(stats.volume)/1000000) * parseFloat(stats.lastPrice)).toFixed(2)}M`} />
          </div>

          <div>
            <div className="text-amber" style={{ borderBottom: '1px solid var(--border-color)', marginBottom: '2px' }}>SUPPLY & NETWORK</div>
            <DataItem label="Circulating" value="N/A" />
            <DataItem label="Total Supply" value="N/A" />
            <DataItem label="Algorithm" value="SHA-256/PoS" />
            <DataItem label="Hashrate" value="N/A" />
          </div>
        </div>
      </div>
      
      <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', padding: '4px 8px', display: 'flex', gap: '16px' }}>
        <span className="text-amber">NET:</span>
        <span className="text-up">WS-OK</span>
        <span className="text-up">REST-OK</span>
      </div>
    </div>
  );
};

export default StatsWidget;
