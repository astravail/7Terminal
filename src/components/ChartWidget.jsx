import React, { useEffect, useState } from 'react';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const ChartWidget = ({ symbol }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    setData([]);
    const fetchKlines = async () => {
      try {
        const response = await fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=1m&limit=60`);
        const json = await response.json();
        const formattedData = json.map(d => ({
          time: new Date(d[0]).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
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
  }, [symbol]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length > 0 && payload[0].value !== undefined) {
      return (
        <div style={{ backgroundColor: 'var(--bg-color)', border: '1px solid var(--text-amber)', padding: '2px 4px' }}>
          <div className="text-cyan">{`${label}`}</div>
          <div className="text-amber">Px: {payload[0].value.toFixed(2)}</div>
          {payload[1] && <div className="text-white">Vol: {payload[1].value.toFixed(2)}</div>}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="panel chart-panel">
      <div className="panel-header">
        <span>{symbol.replace('USDT', '')} GP</span>
      </div>
      <div style={{ flex: 1, padding: '4px', width: '100%', height: '100%', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 10, left: 10, right: 10, bottom: 10 }}>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="1 3" stroke="var(--border-color)" vertical={false} />
              <XAxis dataKey="time" stroke="var(--border-color)" tick={{ fill: 'var(--text-white)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis yAxisId="right" orientation="right" domain={['auto', 'auto']} stroke="var(--border-color)" tick={{ fill: 'var(--text-white)', fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(val) => val.toFixed(2)} />
              <YAxis yAxisId="left" orientation="left" domain={[0, dataMax => dataMax * 5]} hide={true} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border-color)', strokeWidth: 1 }} />
              <Bar yAxisId="left" dataKey="volume" fill="var(--border-color)" isAnimationActive={false} />
              <Line yAxisId="right" type="linear" dataKey="price" stroke="var(--text-amber)" strokeWidth={1} dot={false} isAnimationActive={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ChartWidget;
