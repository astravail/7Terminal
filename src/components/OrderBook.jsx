import React, { useEffect, useState } from 'react';

const OrderBook = ({ symbol, onNewTrade }) => {
  const [bids, setBids] = useState([]);
  const [asks, setAsks] = useState([]);

  useEffect(() => {
    setBids([]);
    setAsks([]);
    
    const wsDepth = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@depth20@100ms`);
    wsDepth.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.bids && data.asks) {
        setBids(data.bids.slice(0, 15));
        setAsks(data.asks.slice(0, 15));
      }
    };

    const wsTrade = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@trade`);
    wsTrade.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (onNewTrade) onNewTrade(data);
    };

    return () => {
      wsDepth.close();
      wsTrade.close();
    };
  }, [symbol]);

  return (
    <div className="panel sidebar-left">
      <div className="panel-header">
        <span>{symbol.replace('USDT', '')} IBQ</span>
      </div>
      <div style={{ padding: '4px 8px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', paddingBottom: '2px', marginBottom: '4px' }}>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', paddingRight: '4px', borderRight: '1px solid var(--border-color)' }}>
            <span className="text-cyan">BID SIZE</span>
            <span className="text-cyan">BID</span>
          </div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', paddingLeft: '4px' }}>
            <span className="text-cyan">ASK</span>
            <span className="text-cyan">ASK SIZE</span>
          </div>
        </div>
        
        <div style={{ overflowY: 'hidden', flex: 1, display: 'flex', flexDirection: 'column' }}>
          {bids.map((bid, i) => {
            const ask = asks[i];
            if (!ask) return null;
            return (
              <div key={i} style={{ display: 'flex', marginBottom: '1px' }}>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', paddingRight: '4px', borderRight: '1px solid var(--border-color)' }}>
                  <span className="text-white">{parseFloat(bid[1]).toFixed(4)}</span>
                  <span className="text-up">{parseFloat(bid[0]).toFixed(2)}</span>
                </div>
                <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', paddingLeft: '4px' }}>
                  <span className="text-down">{parseFloat(ask[0]).toFixed(2)}</span>
                  <span className="text-white">{parseFloat(ask[1]).toFixed(4)}</span>
                </div>
              </div>
            );
          })}
        </div>
        <div className="text-amber" style={{ textAlign: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '4px' }}>MARKET DEPTH</div>
      </div>
    </div>
  );
};

export default OrderBook;
