import React, { useState, useEffect } from 'react';

const SECTOR_MAP = {
  'layer-1': 'Layer 1', 'layer-2': 'Layer 2', 'defi': 'DeFi',
  'nft': 'NFT & Gaming', 'meme': 'Meme', 'exchange': 'Exchange',
  'artificial-intelligence': 'AI & Data', 'oracle': 'Infrastructure',
  'infrastructure': 'Infrastructure', 'privacy': 'Infrastructure',
  'stablecoin': 'Stablecoins', 'gaming': 'NFT & Gaming',
  'metaverse': 'NFT & Gaming', 'lending': 'DeFi', 'yield': 'DeFi',
  'dex': 'DeFi', 'bridge': 'Infrastructure', 'data': 'AI & Data',
  'cross-chain': 'Infrastructure', 'smart-contract': 'Layer 1',
};

const getSector = (id) => {
  const lower = id.toLowerCase();
  for (const [key, val] of Object.entries(SECTOR_MAP)) {
    if (lower.includes(key)) return val;
  }
  return 'Other';
};

const fmtCap = (n) => {
  if (!n) return '--';
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  return `$${n.toFixed(0)}`;
};

const fmtVol = (n) => {
  if (!n) return '--';
  if (n >= 1e9) return `$${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(0)}M`;
  return `$${n.toFixed(0)}`;
};

const abbrev = (id) => {
  const parts = id.split('-');
  if (parts.length === 1) return id.slice(0, 5).toUpperCase();
  return parts.map(w => w[0]).join('').toUpperCase().slice(0, 5);
};

const SECTORS = ['ALL', 'Layer 1', 'DeFi', 'NFT & Gaming', 'Infrastructure', 'AI & Data', 'Other'];

const WorldEquity = ({ navigateTo }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sectorFilter, setSectorFilter] = useState('ALL');
  const [lastUpdated, setLastUpdated] = useState('');

  const fetchCategories = async () => {
    try {
      const res = await fetch('https://api.coingecko.com/api/v3/coins/categories');
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();

      const mapped = json.slice(0, 35).map(cat => ({
        id: cat.id,
        symbol: abbrev(cat.id),
        name: cat.name,
        sector: getSector(cat.id),
        marketCap: cat.market_cap,
        change24h: cat.market_cap_change_24h,
        volume24h: cat.volume_24h,
        numCoins: cat.coins_count ?? 0,
      }));

      setData(mapped);
      setLastUpdated(new Date().toLocaleTimeString('en-GB'));
      setLoading(false);
      setError(null);
    } catch (err) {
      if (!data.length) setError('CoinGecko rate limit reached — retry in 60s');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    const interval = setInterval(fetchCategories, 60000);
    return () => clearInterval(interval);
  }, []);

  const filtered = sectorFilter === 'ALL' ? data : data.filter(d => d.sector === sectorFilter);

  return (
    <div className="panel" style={{ overflow: 'hidden' }}>
      <div className="panel-header">
        <span>WEI — CRYPTO MARKET INDEX MONITOR</span>
        <span className="mono-xs">CoinGecko • {lastUpdated || '...'}</span>
      </div>

      <div className="tab-bar">
        {SECTORS.map(s => (
          <button key={s} className={`tab-item ${sectorFilter === s ? 'active' : ''}`}
                  onClick={() => setSectorFilter(s)}>
            {s}
          </button>
        ))}
        <span style={{ flex: 1 }} />
        <span className="text-grey mono-xs" style={{ padding: '3px 8px' }}>
          {filtered.length} categories
        </span>
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        {loading ? (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-amber)' }}>
            FETCHING MARKET DATA...
          </div>
        ) : error ? (
          <div style={{ padding: '12px', color: 'var(--text-down)', fontSize: '12px' }}>{error}</div>
        ) : (
          <table className="bb-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Category Name</th>
                <th>Sector</th>
                <th>Ccy</th>
                <th className="right">Market Cap</th>
                <th className="right">24h Chg%</th>
                <th className="right">Volume 24h</th>
                <th className="right">Coins</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(item => {
                const isUp = (item.change24h ?? 0) >= 0;
                return (
                  <tr key={item.id}>
                    <td className="text-cyan" style={{ fontWeight: 'bold' }}>{item.symbol}</td>
                    <td>{item.name}</td>
                    <td className="text-grey">{item.sector}</td>
                    <td className="text-grey">USD</td>
                    <td className={`right ${isUp ? 'text-up' : 'text-down'}`} style={{ fontWeight: 'bold' }}>
                      {fmtCap(item.marketCap)}
                    </td>
                    <td className={`right ${isUp ? 'text-up' : 'text-down'}`}>
                      {item.change24h != null ? `${isUp ? '+' : ''}${item.change24h.toFixed(2)}%` : '--'}
                    </td>
                    <td className="right text-grey">{fmtVol(item.volume24h)}</td>
                    <td className="right text-grey">{item.numCoins || '--'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default WorldEquity;
