import React, { useState, useEffect } from 'react';

const HistoricalPrice = ({ symbol }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('1D');

  useEffect(() => {
    setLoading(true);
    const intervals = { '1D': '1m', '1W': '15m', '1M': '1h', '3M': '4h', '1Y': '1d' };
    const limits = { '1D': 60, '1W': 96, '1M': 120, '3M': 90, '1Y': 365 };

    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${intervals[period]}&limit=${limits[period]}`
        );
        const json = await response.json();
        const formatted = json.map(d => ({
          time: new Date(d[0]).toLocaleString('en-GB', {
            day: '2-digit', month: '2-digit',
            hour: '2-digit', minute: '2-digit',
            ...(period === '1Y' ? { year: '2-digit' } : {})
          }),
          open: parseFloat(d[1]).toFixed(2),
          high: parseFloat(d[2]).toFixed(2),
          low: parseFloat(d[3]).toFixed(2),
          close: parseFloat(d[4]).toFixed(2),
          volume: parseFloat(d[5]).toFixed(4),
          change: (parseFloat(d[4]) - parseFloat(d[1])).toFixed(2),
          changePct: (((parseFloat(d[4]) - parseFloat(d[1])) / parseFloat(d[1])) * 100).toFixed(3),
          trades: d[8],
          quoteVol: (parseFloat(d[7]) / 1000).toFixed(1) + 'K',
        }));
        setData(formatted.reverse());
        setLoading(false);
      } catch (e) {
        setLoading(false);
      }
    };

    fetchData();
  }, [symbol, period]);

  const asset = symbol.replace('USDT', '');

  return (
    <div className="panel" style={{ overflow: 'hidden' }}>
      <div className="panel-header">
        <span>HP — {asset} HISTORICAL PRICE TABLE</span>
        <span className="mono-xs">{period} Interval</span>
      </div>

      <div className="tab-bar">
        {['1D', '1W', '1M', '3M', '1Y'].map(p => (
          <button key={p} className={`tab-item ${period === p ? 'active' : ''}`}
                  onClick={() => setPeriod(p)}>
            {p}
          </button>
        ))}
        <span style={{ flex: 1 }} />
        <span className="text-grey mono-xs" style={{ padding: '3px 8px' }}>
          {data.length} records
        </span>
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        {loading ? (
          <div style={{ padding: '16px', textAlign: 'center' }} className="text-grey">Loading data...</div>
        ) : (
          <table className="bb-table">
            <thead>
              <tr>
                <th>Date/Time</th>
                <th className="right">Open</th>
                <th className="right">High</th>
                <th className="right">Low</th>
                <th className="right">Close</th>
                <th className="right">Change</th>
                <th className="right">Chg%</th>
                <th className="right">Volume</th>
                <th className="right">Trades</th>
                <th className="right">Quote Vol</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, i) => {
                const isUp = parseFloat(row.change) >= 0;
                return (
                  <tr key={i}>
                    <td className="text-cyan">{row.time}</td>
                    <td className="right">{row.open}</td>
                    <td className="right text-up">{row.high}</td>
                    <td className="right text-down">{row.low}</td>
                    <td className="right" style={{ fontWeight: 'bold' }}>{row.close}</td>
                    <td className={`right ${isUp ? 'text-up' : 'text-down'}`}>{isUp ? '+' : ''}{row.change}</td>
                    <td className={`right ${isUp ? 'text-up' : 'text-down'}`}>{isUp ? '+' : ''}{row.changePct}%</td>
                    <td className="right text-grey">{row.volume}</td>
                    <td className="right text-grey">{row.trades}</td>
                    <td className="right text-grey">{row.quoteVol}</td>
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

export default HistoricalPrice;
