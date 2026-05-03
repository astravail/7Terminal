import React, { useState, useEffect } from 'react';

const WATCHLIST_SYMBOLS = [
  'BTCUSDT', 'ETHUSDT', 'BNBUSDT', 'SOLUSDT', 'XRPUSDT',
  'ADAUSDT', 'DOGEUSDT', 'TRXUSDT', 'LINKUSDT', 'AVAXUSDT',
];

const NAMES = {
  BTCUSDT: 'Bitcoin', ETHUSDT: 'Ethereum', BNBUSDT: 'BNB',
  SOLUSDT: 'Solana', XRPUSDT: 'XRP', ADAUSDT: 'Cardano',
  DOGEUSDT: 'Dogecoin', TRXUSDT: 'TRON', LINKUSDT: 'Chainlink',
  AVAXUSDT: 'Avalanche',
};

const Watchlist = ({ navigateTo, fullScreen = false }) => {
  const [data, setData] = useState({});
  const [sortBy, setSortBy] = useState('symbol');
  const [sortDir, setSortDir] = useState(1);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const response = await fetch('https://api.binance.com/api/v3/ticker/24hr');
        const allTickers = await response.json();
        const filtered = {};
        WATCHLIST_SYMBOLS.forEach(sym => {
          const ticker = allTickers.find(t => t.symbol === sym);
          if (ticker) {
            filtered[sym] = {
              last: parseFloat(ticker.lastPrice),
              change: parseFloat(ticker.priceChange),
              changePct: parseFloat(ticker.priceChangePercent),
              high: parseFloat(ticker.highPrice),
              low: parseFloat(ticker.lowPrice),
              volume: parseFloat(ticker.volume),
              quoteVol: parseFloat(ticker.quoteVolume),
              trades: ticker.count,
              bid: parseFloat(ticker.bidPrice),
              ask: parseFloat(ticker.askPrice),
              open: parseFloat(ticker.openPrice),
              vwap: parseFloat(ticker.weightedAvgPrice),
            };
          }
        });
        setData(filtered);
      } catch (e) {}
    };

    fetchAll();
    const interval = setInterval(fetchAll, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSort = (col) => {
    if (sortBy === col) {
      setSortDir(d => d * -1);
    } else {
      setSortBy(col);
      setSortDir(1);
    }
  };

  const sorted = WATCHLIST_SYMBOLS
    .filter(s => data[s])
    .sort((a, b) => {
      if (sortBy === 'symbol') return a.localeCompare(b) * sortDir;
      if (sortBy === 'last') return (data[a].last - data[b].last) * sortDir;
      if (sortBy === 'changePct') return (data[a].changePct - data[b].changePct) * sortDir;
      if (sortBy === 'volume') return (data[a].quoteVol - data[b].quoteVol) * sortDir;
      return 0;
    });

  return (
    <div className="panel" style={{ overflow: 'hidden', height: '100%' }}>
      <div className="panel-header">
        <span>{fullScreen ? 'TLKR — TICKER MONITOR' : 'WATCHLIST'}</span>
        <span className="mono-xs">{Object.keys(data).length} securities</span>
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        <table className="bb-table">
          <thead>
            <tr>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('symbol')}>
                Ticker {sortBy === 'symbol' ? (sortDir > 0 ? '▲' : '▼') : ''}
              </th>
              <th>Name</th>
              <th className="right" style={{ cursor: 'pointer' }} onClick={() => handleSort('last')}>
                Last {sortBy === 'last' ? (sortDir > 0 ? '▲' : '▼') : ''}
              </th>
              <th className="right">Bid</th>
              <th className="right">Ask</th>
              <th className="right" style={{ cursor: 'pointer' }} onClick={() => handleSort('changePct')}>
                Chg% {sortBy === 'changePct' ? (sortDir > 0 ? '▲' : '▼') : ''}
              </th>
              <th className="right">Change</th>
              {fullScreen && <th className="right">Open</th>}
              <th className="right">High</th>
              <th className="right">Low</th>
              {fullScreen && <th className="right">VWAP</th>}
              <th className="right" style={{ cursor: 'pointer' }} onClick={() => handleSort('volume')}>
                Volume {sortBy === 'volume' ? (sortDir > 0 ? '▲' : '▼') : ''}
              </th>
              {fullScreen && <th className="right">Trades</th>}
              {fullScreen && <th className="right">Quote Vol</th>}
            </tr>
          </thead>
          <tbody>
            {sorted.map(sym => {
              const d = data[sym];
              if (!d) return null;
              const isUp = d.changePct >= 0;
              return (
                <tr key={sym}>
                  <td className="text-cyan" style={{ fontWeight: 'bold', cursor: 'pointer' }}>{sym.replace('USDT', '')}</td>
                  <td className="text-grey">{NAMES[sym]}</td>
                  <td className={`right ${isUp ? 'text-up' : 'text-down'}`} style={{ fontWeight: 'bold' }}>{d.last.toFixed(2)}</td>
                  <td className="right text-up">{d.bid.toFixed(2)}</td>
                  <td className="right text-down">{d.ask.toFixed(2)}</td>
                  <td className={`right ${isUp ? 'text-up' : 'text-down'}`} style={{ fontWeight: 'bold' }}>
                    {isUp ? '+' : ''}{d.changePct.toFixed(2)}%
                  </td>
                  <td className={`right ${isUp ? 'text-up' : 'text-down'}`}>
                    {isUp ? '+' : ''}{d.change.toFixed(2)}
                  </td>
                  {fullScreen && <td className="right">{d.open.toFixed(2)}</td>}
                  <td className="right">{d.high.toFixed(2)}</td>
                  <td className="right">{d.low.toFixed(2)}</td>
                  {fullScreen && <td className="right">{d.vwap.toFixed(2)}</td>}
                  <td className="right text-grey">
                    {d.quoteVol > 1000000000
                      ? `$${(d.quoteVol / 1000000000).toFixed(1)}B`
                      : `$${(d.quoteVol / 1000000).toFixed(1)}M`}
                  </td>
                  {fullScreen && <td className="right text-grey">{d.trades ? d.trades.toLocaleString() : 'N/A'}</td>}
                  {fullScreen && <td className="right text-grey">{(d.quoteVol / 1000000).toFixed(1)}M</td>}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Watchlist;
