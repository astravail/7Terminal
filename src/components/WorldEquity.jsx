import React, { useState, useEffect } from 'react';

const INDICES = [
  { symbol: 'SPX', name: 'S&P 500', region: 'Americas', exchange: 'NYSE', currency: 'USD' },
  { symbol: 'INDU', name: 'Dow Jones Industrial', region: 'Americas', exchange: 'NYSE', currency: 'USD' },
  { symbol: 'CCMP', name: 'NASDAQ Composite', region: 'Americas', exchange: 'NASDAQ', currency: 'USD' },
  { symbol: 'RTY', name: 'Russell 2000', region: 'Americas', exchange: 'NYSE', currency: 'USD' },
  { symbol: 'SPTSX', name: 'S&P/TSX Composite', region: 'Americas', exchange: 'TSX', currency: 'CAD' },
  { symbol: 'MEXBOL', name: 'S&P/BMV IPC', region: 'Americas', exchange: 'BMV', currency: 'MXN' },
  { symbol: 'IBOV', name: 'Bovespa Index', region: 'Americas', exchange: 'B3', currency: 'BRL' },
  { symbol: 'UKX', name: 'FTSE 100', region: 'EMEA', exchange: 'LSE', currency: 'GBP' },
  { symbol: 'DAX', name: 'DAX Performance', region: 'EMEA', exchange: 'XETRA', currency: 'EUR' },
  { symbol: 'CAC', name: 'CAC 40', region: 'EMEA', exchange: 'Euronext', currency: 'EUR' },
  { symbol: 'SMI', name: 'Swiss Market', region: 'EMEA', exchange: 'SIX', currency: 'CHF' },
  { symbol: 'FTSEMIB', name: 'FTSE MIB', region: 'EMEA', exchange: 'Borsa', currency: 'EUR' },
  { symbol: 'AEX', name: 'AEX Index', region: 'EMEA', exchange: 'Euronext', currency: 'EUR' },
  { symbol: 'IBEX', name: 'IBEX 35', region: 'EMEA', exchange: 'BME', currency: 'EUR' },
  { symbol: 'OBX', name: 'OBX Total Return', region: 'EMEA', exchange: 'Oslo', currency: 'NOK' },
  { symbol: 'NKY', name: 'Nikkei 225', region: 'Asia-Pacific', exchange: 'TSE', currency: 'JPY' },
  { symbol: 'HSI', name: 'Hang Seng', region: 'Asia-Pacific', exchange: 'HKEX', currency: 'HKD' },
  { symbol: 'SHCOMP', name: 'Shanghai Composite', region: 'Asia-Pacific', exchange: 'SSE', currency: 'CNY' },
  { symbol: 'AS51', name: 'S&P/ASX 200', region: 'Asia-Pacific', exchange: 'ASX', currency: 'AUD' },
  { symbol: 'KOSPI', name: 'KOSPI Index', region: 'Asia-Pacific', exchange: 'KRX', currency: 'KRW' },
  { symbol: 'TWSE', name: 'TAIEX', region: 'Asia-Pacific', exchange: 'TWSE', currency: 'TWD' },
  { symbol: 'SENSEX', name: 'BSE SENSEX', region: 'Asia-Pacific', exchange: 'BSE', currency: 'INR' },
  { symbol: 'STI', name: 'Straits Times', region: 'Asia-Pacific', exchange: 'SGX', currency: 'SGD' },
];

const generateIndexData = () => {
  return INDICES.map(idx => {
    const basePrice = {
      'SPX': 5420, 'INDU': 39800, 'CCMP': 17200, 'RTY': 2080,
      'SPTSX': 22100, 'MEXBOL': 55200, 'IBOV': 128000,
      'UKX': 8300, 'DAX': 18600, 'CAC': 8100, 'SMI': 11800,
      'FTSEMIB': 34500, 'AEX': 890, 'IBEX': 11200, 'OBX': 1280,
      'NKY': 38500, 'HSI': 18600, 'SHCOMP': 3150, 'AS51': 7850,
      'KOSPI': 2720, 'TWSE': 20800, 'SENSEX': 74200, 'STI': 3350,
    }[idx.symbol] || 1000;

    const change = (Math.random() - 0.45) * basePrice * 0.02;
    const changePct = (change / basePrice) * 100;
    const last = basePrice + change;
    const volume = Math.floor(Math.random() * 5000 + 500);

    return {
      ...idx,
      last: last.toFixed(2),
      change: change.toFixed(2),
      changePct: changePct.toFixed(2),
      volume: `${volume}M`,
      ytd: ((Math.random() - 0.3) * 20).toFixed(1),
      open: (last - (Math.random() - 0.5) * basePrice * 0.005).toFixed(2),
      high: (last + Math.random() * basePrice * 0.005).toFixed(2),
      low: (last - Math.random() * basePrice * 0.005).toFixed(2),
    };
  });
};

const WorldEquity = ({ navigateTo }) => {
  const [data, setData] = useState(() => generateIndexData());
  const [regionFilter, setRegionFilter] = useState('ALL');

  useEffect(() => {
    const interval = setInterval(() => {
      setData(generateIndexData());
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const regions = ['ALL', 'Americas', 'EMEA', 'Asia-Pacific'];
  const filtered = regionFilter === 'ALL' ? data : data.filter(d => d.region === regionFilter);

  return (
    <div className="panel" style={{ overflow: 'hidden' }}>
      <div className="panel-header">
        <span>WEI — WORLD EQUITY INDEX MONITOR</span>
        <span className="mono-xs">{new Date().toLocaleTimeString('en-GB')}</span>
      </div>

      <div className="tab-bar">
        {regions.map(r => (
          <button key={r} className={`tab-item ${regionFilter === r ? 'active' : ''}`}
                  onClick={() => setRegionFilter(r)}>
            {r}
          </button>
        ))}
        <span style={{ flex: 1 }} />
        <span className="text-grey mono-xs" style={{ padding: '3px 8px' }}>
          Updated: {new Date().toLocaleTimeString('en-GB')}
        </span>
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        <table className="bb-table">
          <thead>
            <tr>
              <th>Ticker</th>
              <th>Index Name</th>
              <th>Exchange</th>
              <th>Ccy</th>
              <th className="right">Last</th>
              <th className="right">Change</th>
              <th className="right">Chg%</th>
              <th className="right">Open</th>
              <th className="right">High</th>
              <th className="right">Low</th>
              <th className="right">Vol</th>
              <th className="right">YTD%</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(item => {
              const isUp = parseFloat(item.change) >= 0;
              return (
                <tr key={item.symbol}>
                  <td className="text-cyan" style={{ fontWeight: 'bold', cursor: 'pointer' }}>{item.symbol}</td>
                  <td>{item.name}</td>
                  <td className="text-grey">{item.exchange}</td>
                  <td className="text-grey">{item.currency}</td>
                  <td className={`right ${isUp ? 'text-up' : 'text-down'}`} style={{fontWeight:'bold'}}>{item.last}</td>
                  <td className={`right ${isUp ? 'text-up' : 'text-down'}`}>{isUp ? '+' : ''}{item.change}</td>
                  <td className={`right ${isUp ? 'text-up' : 'text-down'}`}>{isUp ? '+' : ''}{item.changePct}%</td>
                  <td className="right">{item.open}</td>
                  <td className="right">{item.high}</td>
                  <td className="right">{item.low}</td>
                  <td className="right text-grey">{item.volume}</td>
                  <td className={`right ${parseFloat(item.ytd) >= 0 ? 'text-up' : 'text-down'}`}>
                    {parseFloat(item.ytd) >= 0 ? '+' : ''}{item.ytd}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WorldEquity;
