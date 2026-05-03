import React, { useEffect, useState } from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ChartWidget = ({ symbol }) => {
  const [data, setData] = useState([]);
  const [timeframe, setTimeframe] = useState('1m');

  useEffect(() => {
    setData([]);
    const fetchKlines = async () => {
      try {
        const limits = { '1m': 60, '5m': 60, '15m': 60, '1h': 48, '4h': 60 };
        const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${timeframe}&limit=${limits[timeframe] || 60}`);
        const json = await response.json();
        const formattedData = json.map(d => ({
          time: new Date(d[0]).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
          open: parseFloat(d[1]),
          high: parseFloat(d[2]),
          low: parseFloat(d[3]),
          price: parseFloat(d[4]),
          volume: parseFloat(d[5])
        }));
        setData(formattedData);
      } catch (error) {}
    };

    fetchKlines();
    const interval = setInterval(fetchKlines, 60000);
    
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@miniTicker`);
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      const currentPrice = parseFloat(msg.c);
      
      setData(prevData => {
        if (prevData.length === 0) return prevData;
        const newData = [...prevData];
        const lastIndex = newData.length - 1;
        newData[lastIndex] = { ...newData[lastIndex], price: currentPrice };
        return newData;
      });
    };

    return () => {
      clearInterval(interval);
      ws.close();
    };
  }, [symbol, timeframe]);

  const asset = symbol.replace('USDT', '');
  const lastPrice = data.length > 0 ? data[data.length - 1].price : 0;
  const firstPrice = data.length > 0 ? data[0].open : 0;
  const isUp = lastPrice >= firstPrice;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length > 0 && payload[0].value !== undefined) {
      return (
        <div style={{ backgroundColor: '#111', border: '1px solid var(--text-amber)', padding: '4px 8px', fontSize: '11px' }}>
          <div className="text-cyan">{label}</div>
          <div className="text-amber">Px: {payload[0].value.toFixed(2)}</div>
          {payload[1] && <div className="text-grey">Vol: {payload[1].value.toFixed(4)}</div>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="panel chart-panel">
      <div className="panel-header">
        <span>{asset} GP — PRICE CHART</span>
        <div style={{ display: 'flex', gap: '2px' }}>
          {['1m', '5m', '15m', '1h', '4h'].map(tf => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              style={{
                background: timeframe === tf ? '#000' : 'transparent',
                color: timeframe === tf ? 'var(--text-amber)' : '#000',
                border: '1px solid #00000033',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontSize: '9px',
                padding: '0px 4px',
                fontWeight: 'bold',
              }}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, padding: '4px', width: '100%', height: '100%', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 6, left: 6, right: 6, bottom: 6 }}>
          <ResponsiveContainer width="100%" height="100%" minWidth={100} minHeight={100}>
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="1 3" stroke="var(--border-color)" vertical={false} />
              <XAxis dataKey="time" stroke="var(--border-color)" tick={{ fill: 'var(--text-white)', fontSize: 9 }} axisLine={false} tickLine={false} interval={Math.floor(data.length / 6)} />
              <YAxis yAxisId="right" orientation="right" domain={['auto', 'auto']} stroke="var(--border-color)" tick={{ fill: 'var(--text-white)', fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={(val) => val.toFixed(0)} />
              <YAxis yAxisId="left" orientation="left" domain={[0, dataMax => dataMax * 5]} hide={true} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border-color)', strokeWidth: 1 }} />
              <Bar yAxisId="left" dataKey="volume" fill="rgba(51, 102, 153, 0.4)" isAnimationActive={false} />
              <Line yAxisId="right" type="linear" dataKey="price" stroke={isUp ? 'var(--color-up)' : 'var(--color-down)'} strokeWidth={1.5} dot={false} isAnimationActive={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ChartWidget;
