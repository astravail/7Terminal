import React, { useEffect, useState } from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area } from 'recharts';

const IntradayChart = ({ symbol }) => {
  const [data, setData] = useState([]);
  const [chartType, setChartType] = useState('LINE');

  useEffect(() => {
    setData([]);
    const fetchKlines = async () => {
      try {
        const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1m&limit=120`);
        const json = await response.json();
        const formatted = json.map(d => ({
          time: new Date(d[0]).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
          open: parseFloat(d[1]),
          high: parseFloat(d[2]),
          low: parseFloat(d[3]),
          close: parseFloat(d[4]),
          price: parseFloat(d[4]),
          volume: parseFloat(d[5]),
          vwap: (parseFloat(d[1]) + parseFloat(d[2]) + parseFloat(d[3]) + parseFloat(d[4])) / 4,
        }));
        setData(formatted);
      } catch (e) {}
    };

    fetchKlines();
    const interval = setInterval(fetchKlines, 30000);

    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@miniTicker`);
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      const currentPrice = parseFloat(msg.c);
      setData(prev => {
        if (prev.length === 0) return prev;
        const newData = [...prev];
        const last = newData.length - 1;
        newData[last] = { ...newData[last], price: currentPrice, close: currentPrice };
        return newData;
      });
    };

    return () => {
      clearInterval(interval);
      ws.close();
    };
  }, [symbol]);

  const asset = symbol.replace('USDT', '');
  const lastPrice = data.length > 0 ? data[data.length - 1].price : 0;
  const firstPrice = data.length > 0 ? data[0].open : 0;
  const change = lastPrice - firstPrice;
  const changePct = firstPrice ? ((change / firstPrice) * 100).toFixed(3) : '0.000';
  const isUp = change >= 0;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length > 0 && payload[0].value !== undefined) {
      return (
        <div style={{ backgroundColor: '#111', border: '1px solid var(--text-amber)', padding: '4px 8px', fontSize: '11px' }}>
          <div className="text-cyan">{label}</div>
          <div className="text-amber">Price: {payload[0].value.toFixed(2)}</div>
          {payload[1] && <div className="text-grey">Vol: {payload[1].value.toFixed(4)}</div>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="panel" style={{ overflow: 'hidden' }}>
      <div className="panel-header">
        <span>GIP — {asset} INTRADAY PRICE</span>
        <span className="mono-xs">{new Date().toLocaleDateString('en-GB')}</span>
      </div>

      <div className="tab-bar">
        {['LINE', 'AREA', 'CANDLE'].map(t => (
          <button key={t} className={`tab-item ${chartType === t ? 'active' : ''}`}
                  onClick={() => setChartType(t)}>
            {t}
          </button>
        ))}
        <span style={{ flex: 1 }} />
        <span className={`mono-xs ${isUp ? 'text-up' : 'text-down'}`} style={{ padding: '3px 8px', fontWeight: 'bold' }}>
          {lastPrice.toFixed(2)} {isUp ? '▲' : '▼'} {change.toFixed(2)} ({changePct}%)
        </span>
      </div>

      <div style={{ flex: 1, padding: '4px', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 8, left: 8, right: 8, bottom: 8 }}>
          <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={100}>
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="1 3" stroke="var(--border-color)" vertical={false} />
              <XAxis dataKey="time" stroke="var(--border-color)" tick={{ fill: 'var(--text-white)', fontSize: 9 }} axisLine={false} tickLine={false} interval={Math.floor(data.length / 8)} />
              <YAxis yAxisId="right" orientation="right" domain={['auto', 'auto']} stroke="var(--border-color)" tick={{ fill: 'var(--text-white)', fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={(val) => val.toFixed(0)} />
              <YAxis yAxisId="left" orientation="left" domain={[0, dataMax => dataMax * 5]} hide />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border-color)', strokeWidth: 1 }} />
              <Bar yAxisId="left" dataKey="volume" fill="rgba(51, 102, 153, 0.4)" isAnimationActive={false} />
              {chartType === 'LINE' && (
                <Line yAxisId="right" type="linear" dataKey="price" stroke={isUp ? 'var(--color-up)' : 'var(--color-down)'} strokeWidth={1.5} dot={false} isAnimationActive={false} />
              )}
              {chartType === 'AREA' && (
                <Area yAxisId="right" type="monotone" dataKey="price" stroke={isUp ? 'var(--color-up)' : 'var(--color-down)'} fill={isUp ? 'rgba(0,255,0,0.1)' : 'rgba(255,0,0,0.1)'} strokeWidth={1.5} dot={false} isAnimationActive={false} />
              )}
              {chartType === 'CANDLE' && (
                <Line yAxisId="right" type="linear" dataKey="price" stroke="var(--text-amber)" strokeWidth={1.5} dot={false} isAnimationActive={false} />
              )}
              <Line yAxisId="right" type="monotone" dataKey="vwap" stroke="var(--purple)" strokeWidth={1} strokeDasharray="3 3" dot={false} isAnimationActive={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default IntradayChart;
