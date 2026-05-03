import React, { useEffect, useState } from 'react';

const SOURCE_ABBR = {
  'cryptocompare': 'CC', 'coindesk': 'CD', 'cointelegraph': 'CT',
  'decrypt': 'DL', 'theblock': 'TBK', 'bloomberg': 'BB', 'reuters': 'RTRS',
  'wsj': 'WSJ', 'ft': 'FT', 'cnbc': 'CNBC', 'bitcoinist': 'BCST', 'newsbtc': 'NBTC',
};

const getSource = (name) => {
  if (!name) return 'NEWS';
  const lower = name.toLowerCase();
  for (const [key, val] of Object.entries(SOURCE_ABBR)) {
    if (lower.includes(key)) return val;
  }
  return name.slice(0, 4).toUpperCase();
};

const NewsTicker = ({ symbol }) => {
  const [headlines, setHeadlines] = useState([]);

  const fetchNews = async () => {
    try {
      const res = await fetch(
        'https://min-api.cryptocompare.com/data/v2/news/?lang=EN&sortOrder=latest'
      );
      if (!res.ok) return;
      const json = await res.json();
      if (json.Data) {
        setHeadlines(json.Data.slice(0, 40).map(item => ({
          id: item.id,
          source: getSource(item.source_info?.name || item.source),
          time: new Date(item.published_on * 1000).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
          text: item.title,
          url: item.url,
        })));
      }
    } catch (err) {
      // silent fail — ticker is non-critical
    }
  };

  useEffect(() => {
    fetchNews();
    const interval = setInterval(fetchNews, 180000);
    return () => clearInterval(interval);
  }, [symbol]);

  return (
    <div className="news-row" style={{ padding: '2px 4px', fontFamily: 'inherit', fontSize: '12px' }}>
      <div style={{
        display: 'flex', gap: '12px', color: 'var(--text-amber)', fontWeight: 'bold',
        marginBottom: '2px', fontSize: '11px', borderBottom: '1px solid var(--border-color)', paddingBottom: '2px'
      }}>
        <span>N</span>
        <span>LIVE FEED</span>
        <span style={{ flex: 1 }} />
        <span className="text-grey mono-xs">{headlines.length} items • CryptoCompare</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', scrollbarWidth: 'none' }}>
        {headlines.map(item => (
          <div
            key={item.id}
            style={{ display: 'flex', gap: '6px', lineHeight: '1.45', cursor: 'pointer' }}
            onClick={() => window.open(item.url, '_blank', 'noopener,noreferrer')}
            title="Click to open article"
          >
            <span className="text-grey" style={{ width: '28px', flexShrink: 0, fontSize: '11px' }}>{item.source}</span>
            <span className="text-amber" style={{ width: '36px', flexShrink: 0, fontSize: '11px' }}>{item.time}</span>
            <span style={{ color: '#5588FF', fontSize: '11px' }}>{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsTicker;
