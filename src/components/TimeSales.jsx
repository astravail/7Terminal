import React, { useState, useEffect } from 'react';

const TimeSales = ({ symbol }) => {
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    setTrades([]);

    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@trade`);
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const trade = {
        id: data.t,
        time: new Date(data.T).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        price: parseFloat(data.p).toFixed(2),
        qty: parseFloat(data.q).toFixed(6),
        value: (parseFloat(data.p) * parseFloat(data.q)).toFixed(2),
        side: data.m ? 'SELL' : 'BUY',
        ms: new Date(data.T).getMilliseconds().toString().padStart(3, '0'),
      };
      setTrades(prev => [trade, ...prev].slice(0, 200));
    };

    return () => ws.close();
  }, [symbol]);

  const asset = symbol.replace('USDT', '');

  return (
    <div className="panel" style={{ overflow: 'hidden' }}>
      <div className="panel-header">
        <span>{asset} — TIME & SALES</span>
        <span className="mono-xs">{trades.length} trades</span>
      </div>

      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', padding: '2px 6px', background: '#0a0a0a' }}>
        <span className="text-cyan mono-xs" style={{ width: '70px' }}>TIME</span>
        <span className="text-cyan mono-xs" style={{ width: '90px', textAlign: 'right' }}>PRICE</span>
        <span className="text-cyan mono-xs" style={{ width: '90px', textAlign: 'right' }}>SIZE</span>
        <span className="text-cyan mono-xs" style={{ width: '80px', textAlign: 'right' }}>VALUE</span>
        <span className="text-cyan mono-xs" style={{ width: '40px', textAlign: 'center' }}>SIDE</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none' }}>
        {trades.map(trade => (
          <div key={trade.id}
               style={{
                 display: 'flex',
                 padding: '1px 6px',
                 fontSize: '11px',
                 borderBottom: '1px solid #0a0a0a',
               }}>
            <span className="text-grey" style={{ width: '70px' }}>{trade.time}<span className="text-grey" style={{ fontSize: '9px' }}>.{trade.ms}</span></span>
            <span className={trade.side === 'BUY' ? 'text-up' : 'text-down'} style={{ width: '90px', textAlign: 'right', fontWeight: 'bold' }}>{trade.price}</span>
            <span className="text-white" style={{ width: '90px', textAlign: 'right' }}>{trade.qty}</span>
            <span className="text-grey" style={{ width: '80px', textAlign: 'right' }}>${trade.value}</span>
            <span className={trade.side === 'BUY' ? 'text-up' : 'text-down'} style={{ width: '40px', textAlign: 'center', fontSize: '10px' }}>{trade.side}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeSales;
