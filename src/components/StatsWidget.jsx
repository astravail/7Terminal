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

  if (!stats || !stats.lastPrice) return (
    <div className="panel sidebar-right">
      <div className="panel-header">DES — SECURITY DESCRIPTION</div>
      <div style={{padding: '10px'}} className="text-grey">Loading...</div>
    </div>
  );

  const DataItem = ({ label, value, colorClass = "text-white" }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '1px 0' }}>
      <span className="text-cyan" style={{ fontSize: '11px' }}>{label}</span>
      <span className={colorClass} style={{ fontSize: '11px' }}>{value}</span>
    </div>
  );

  const isUp = parseFloat(stats.priceChangePercent) >= 0;
  const asset = symbol.replace('USDT', '');

  return (
    <div className="panel sidebar-right">
      <div className="panel-header">
        <span>{asset} &lt;Equity&gt; DES</span>
      </div>
      <div style={{ padding: '4px 8px', display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto', scrollbarWidth: 'none', flex: 1 }}>
        
        {/* Header section */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-color)', paddingBottom: '4px' }}>
          <div>
            <div className="text-amber" style={{ fontSize: '13px', fontWeight: 'bold' }}>{asset} DIGITAL ASSET</div>
            <div className="text-white" style={{ fontSize: '11px' }}>{asset} / TetherUS</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className={isUp ? 'text-up' : 'text-down'} style={{ fontSize: '14px', fontWeight: 'bold' }}>
              {parseFloat(stats.lastPrice).toFixed(2)}
            </div>
            <div className={isUp ? 'text-up' : 'text-down'} style={{ fontSize: '11px' }}>
              {parseFloat(stats.priceChange).toFixed(2)} ({parseFloat(stats.priceChangePercent).toFixed(2)}%)
            </div>
          </div>
        </div>

        {/* Price Stats */}
        <div>
          <div className="section-title" style={{ padding: '2px 0', background: 'transparent', fontSize: '11px' }}>PRICE STATISTICS</div>
          <DataItem label="Open" value={parseFloat(stats.openPrice).toFixed(2)} />
          <DataItem label="High" value={parseFloat(stats.highPrice).toFixed(2)} colorClass="text-up" />
          <DataItem label="Low" value={parseFloat(stats.lowPrice).toFixed(2)} colorClass="text-down" />
          <DataItem label="Close" value={parseFloat(stats.lastPrice).toFixed(2)} />
          <DataItem label="Prev Close" value={parseFloat(stats.prevClosePrice).toFixed(2)} />
          <DataItem label="VWAP" value={parseFloat(stats.weightedAvgPrice).toFixed(2)} />
        </div>

        {/* Volume */}
        <div>
          <div className="section-title" style={{ padding: '2px 0', background: 'transparent', fontSize: '11px' }}>VOLUME & TURNOVER</div>
          <DataItem label="Vol (Base)" value={parseFloat(stats.volume).toLocaleString(undefined, {maximumFractionDigits: 2})} />
          <DataItem label="Vol (Quote)" value={`$${(parseFloat(stats.quoteVolume) / 1000000).toFixed(2)}M`} />
          <DataItem label="Trades (24h)" value={stats.count ? stats.count.toLocaleString() : 'N/A'} />
          <DataItem label="Avg Trade" value={stats.count ? `$${(parseFloat(stats.quoteVolume) / stats.count).toFixed(2)}` : 'N/A'} />
        </div>

        {/* Spread */}
        <div>
          <div className="section-title" style={{ padding: '2px 0', background: 'transparent', fontSize: '11px' }}>MARKET MICROSTRUCTURE</div>
          <DataItem label="Bid" value={parseFloat(stats.bidPrice).toFixed(2)} colorClass="text-up" />
          <DataItem label="Ask" value={parseFloat(stats.askPrice).toFixed(2)} colorClass="text-down" />
          <DataItem label="Spread" value={(parseFloat(stats.askPrice) - parseFloat(stats.bidPrice)).toFixed(4)} />
          <DataItem label="Spread %" value={`${(((parseFloat(stats.askPrice) - parseFloat(stats.bidPrice)) / parseFloat(stats.lastPrice)) * 100).toFixed(4)}%`} />
        </div>

        {/* Network */}
        <div>
          <div className="section-title" style={{ padding: '2px 0', background: 'transparent', fontSize: '11px' }}>SUPPLY & NETWORK</div>
          <DataItem label="Algorithm" value="SHA-256/PoS" />
          <DataItem label="Consensus" value="Proof of Work/Stake" />
          <DataItem label="Data Source" value="Binance WS" />
        </div>
      </div>
      
      <div style={{ borderTop: '1px solid var(--border-color)', padding: '3px 8px', display: 'flex', gap: '8px', fontSize: '11px' }}>
        <span className="text-amber">NET:</span>
        <span className="status-dot online" />
        <span className="text-up">WS-OK</span>
        <span className="status-dot online" />
        <span className="text-up">REST-OK</span>
      </div>
    </div>
  );
};

export default StatsWidget;
