import React, { useEffect, useState } from 'react';

const generateNews = (symbol) => {
  const asset = symbol.replace('USDT', '');
  const templates = [
    `${asset} surges past key resistance level amid broad market rally`,
    `Institutional investors show renewed interest in ${asset} accumulation`,
    `${asset} network upgrade scheduled for next week: What to expect`,
    `Market analysts predict new highs for ${asset} as adoption grows`,
    `${asset} trading volume spikes across major US exchanges`,
    `Regulatory clarity boosts ${asset} adoption in European markets`,
    `New decentralized application launches on ${asset} mainnet`,
    `Whale alert: massive ${asset} movement detected from unknown wallet`,
    `${asset} hash rate hits all-time high ahead of halving event`,
    `Partnership announced between major tech firm and ${asset} Foundation`
  ];
  return templates[Math.floor(Math.random() * templates.length)];
};

const NewsFeed = ({ symbol }) => {
  const [news, setNews] = useState([]);

  useEffect(() => {
    const initialNews = Array.from({ length: 15 }).map((_, i) => ({
      id: Date.now() - i * 100000,
      code: Math.floor(Math.random() * 900) + 100,
      source: ['TOR', 'BI', 'FOR', 'BN', 'CNBC'][Math.floor(Math.random() * 5)],
      time: new Date(Date.now() - i * 100000).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      headline: generateNews(symbol)
    }));
    setNews(initialNews);

    const interval = setInterval(() => {
      setNews(prev => {
        const newItem = {
          id: Date.now(),
          code: Math.floor(Math.random() * 900) + 100,
          source: ['TOR', 'BI', 'FOR', 'BN', 'CNBC'][Math.floor(Math.random() * 5)],
          time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
          headline: generateNews(symbol)
        };
        return [newItem, ...prev].slice(0, 50);
      });
    }, 8000);

    return () => clearInterval(interval);
  }, [symbol]);

  return (
    <div className="news-row" style={{ padding: '4px', fontFamily: 'Courier New, monospace', fontSize: '14px' }}>
      <div style={{ display: 'flex', color: 'var(--text-amber)', fontWeight: 'bold', marginBottom: '2px', paddingLeft: '40px' }}>
        <span style={{ width: '40px' }}>300)</span>
        <span className="clickable" style={{ marginRight: '16px' }}>Edit Panel</span>
        <span style={{ width: '40px' }}>301)</span>
        <span className="clickable">Expand Panel</span>
      </div>
      <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', scrollbarWidth: 'none' }}>
        {news.map(item => (
          <div key={item.id} style={{ display: 'flex', gap: '8px', whiteSpace: 'nowrap', lineHeight: '1.4' }}>
            <span style={{ color: '#5588FF', width: '30px', textAlign: 'right' }}>{item.code}</span>
            <span style={{ color: 'var(--text-grey)', width: '30px' }}>{item.source}</span>
            <span style={{ color: 'var(--text-amber)' }}>{item.time}</span>
            <span style={{ color: '#5588FF' }}>{item.headline}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsFeed;
