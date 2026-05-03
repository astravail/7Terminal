import React, { useEffect, useState } from 'react';

const GLOBAL_HEADLINES = [
  'Fed signals pause — Yields decline',
  'EU Markets rally on ECB pivot',
  'Oil surges 3% on OPEC+ cuts',
  'BOJ holds rates, yen weakens',
  'Gold hits new record $2,450',
  'Tech leads NASDAQ to new high',
  'US PMI beats at 52.1',
  'China GDP growth slows to 4.7%',
  'SEC approves crypto ETF framework',
  'UK CPI drops to 2.3%',
];

const generateCryptoHeadline = (symbol) => {
  const asset = symbol.replace('USDT', '');
  const templates = [
    `${asset} +2.4% on institutional buying`,
    `${asset} whale transfer — 5,000 units moved`,
    `${asset} volume spikes 45% in 1hr`,
    `${asset} breaks key resistance at $${(Math.random() * 100000).toFixed(0)}`,
    `${asset} network upgrade confirmed for Q3`,
    `${asset} options OI hits record`,
    `${asset} ETF flows remain positive`,
  ];
  return templates[Math.floor(Math.random() * templates.length)];
};

const NewsTicker = ({ symbol }) => {
  const [headlines, setHeadlines] = useState([]);

  useEffect(() => {
    const initial = [];
    for (let i = 0; i < 20; i++) {
      const isGlobal = Math.random() > 0.4;
      initial.push({
        id: Date.now() - i * 50000,
        source: isGlobal ? ['BB', 'RTRS', 'DJ', 'FT'][Math.floor(Math.random() * 4)] : ['COIN', 'DL'][Math.floor(Math.random() * 2)],
        time: new Date(Date.now() - i * 50000).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        text: isGlobal ? GLOBAL_HEADLINES[Math.floor(Math.random() * GLOBAL_HEADLINES.length)] : generateCryptoHeadline(symbol),
        priority: Math.random() > 0.85 ? 'high' : 'normal',
      });
    }
    setHeadlines(initial);

    const interval = setInterval(() => {
      const isGlobal = Math.random() > 0.4;
      setHeadlines(prev => [{
        id: Date.now(),
        source: isGlobal ? ['BB', 'RTRS', 'DJ'][Math.floor(Math.random() * 3)] : 'COIN',
        time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        text: isGlobal ? GLOBAL_HEADLINES[Math.floor(Math.random() * GLOBAL_HEADLINES.length)] : generateCryptoHeadline(symbol),
        priority: Math.random() > 0.85 ? 'high' : 'normal',
      }, ...prev].slice(0, 50));
    }, 7000);

    return () => clearInterval(interval);
  }, [symbol]);

  return (
    <div className="news-row" style={{ padding: '2px 4px', fontFamily: 'inherit', fontSize: '12px' }}>
      <div style={{ display: 'flex', gap: '12px', color: 'var(--text-amber)', fontWeight: 'bold', marginBottom: '2px', fontSize: '11px', borderBottom: '1px solid var(--border-color)', paddingBottom: '2px' }}>
        <span>N</span>
        <span className="clickable">TOP</span>
        <span className="clickable">CN</span>
        <span className="clickable">EXCL</span>
        <span className="clickable">FIRST WORD</span>
        <span style={{ flex: 1 }} />
        <span className="text-grey mono-xs">{headlines.length} items</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', scrollbarWidth: 'none' }}>
        {headlines.map(item => (
          <div key={item.id} style={{ display: 'flex', gap: '6px', lineHeight: '1.45', cursor: 'pointer' }}>
            <span className="text-grey" style={{ width: '28px', flexShrink: 0, fontSize: '11px' }}>{item.source}</span>
            <span className="text-amber" style={{ width: '36px', flexShrink: 0, fontSize: '11px' }}>{item.time}</span>
            <span style={{ color: item.priority === 'high' ? 'var(--orange)' : '#5588FF', fontSize: '11px' }}>
              {item.priority === 'high' && '★ '}{item.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsTicker;
