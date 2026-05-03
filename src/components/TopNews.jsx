import React, { useState, useEffect } from 'react';

const SYMBOL_TO_CC = {
  'BTCUSDT': 'BTC', 'ETHUSDT': 'ETH', 'BNBUSDT': 'BNB',
  'SOLUSDT': 'SOL', 'XRPUSDT': 'XRP', 'ADAUSDT': 'ADA',
  'DOGEUSDT': 'DOGE', 'TRXUSDT': 'TRX', 'LINKUSDT': 'LINK', 'AVAXUSDT': 'AVAX',
};

const SOURCE_ABBR = {
  'cryptocompare': 'CC', 'coindesk': 'CD', 'cointelegraph': 'CT',
  'decrypt': 'DL', 'theblock': 'TBK', 'bloomberg': 'BB', 'reuters': 'RTRS',
  'wsj': 'WSJ', 'ft': 'FT', 'cnbc': 'CNBC', 'forbes': 'FRBS',
  'bitcoinist': 'BCST', 'newsbtc': 'NBTC', 'ambcrypto': 'AMB',
};

const getSource = (name) => {
  if (!name) return 'NEWS';
  const lower = name.toLowerCase();
  for (const [key, val] of Object.entries(SOURCE_ABBR)) {
    if (lower.includes(key)) return val;
  }
  return name.slice(0, 4).toUpperCase();
};

const CATEGORY_PARAMS = {
  'TOP': '',
  'CN': null, // set dynamically
  'EXCL': '&categories=Market,Trading,Analysis',
  'FIRST': '&categories=Regulation,Technology',
  'MKTW': '&categories=Exchange,Mining',
};

const TopNews = ({ symbol, navigateTo }) => {
  const [news, setNews] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('TOP');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const coinSymbol = SYMBOL_TO_CC[symbol] || 'BTC';

  const fetchNews = async (category) => {
    setLoading(true);
    setError(null);
    try {
      let params = CATEGORY_PARAMS[category] ?? '';
      if (category === 'CN') params = `&categories=${coinSymbol}`;

      const res = await fetch(
        `https://min-api.cryptocompare.com/data/v2/news/?lang=EN&sortOrder=latest${params}`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();

      if (json.Data) {
        const items = json.Data.map((item, i) => ({
          id: item.id,
          source: getSource(item.source_info?.name || item.source),
          time: new Date(item.published_on * 1000).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
          headline: item.title,
          url: item.url,
          priority: i < 3 ? 'high' : 'normal',
        }));
        setNews(items);
      }
    } catch (err) {
      setError('Failed to fetch news. Retrying...');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(selectedCategory);
    const interval = setInterval(() => fetchNews(selectedCategory), 120000);
    return () => clearInterval(interval);
  }, [selectedCategory, symbol]);

  const categories = ['TOP', 'CN', 'EXCL', 'FIRST', 'MKTW'];

  return (
    <div className="panel" style={{ overflow: 'hidden' }}>
      <div className="panel-header">
        <span>TOP NEWS — {selectedCategory === 'CN' ? `${coinSymbol} COIN NEWS` : 'CRYPTO & MARKETS'}</span>
        <span className="mono-xs">{new Date().toLocaleDateString('en-GB')} • CryptoCompare</span>
      </div>

      <div className="tab-bar">
        {categories.map(cat => (
          <button
            key={cat}
            className={`tab-item ${selectedCategory === cat ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '4px', scrollbarWidth: 'none' }}>
        {loading ? (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-amber)' }}>
            FETCHING HEADLINES...
          </div>
        ) : error ? (
          <div style={{ padding: '12px', color: 'var(--text-down)', fontSize: '12px' }}>{error}</div>
        ) : (
          news.map((item, idx) => (
            <div
              key={item.id}
              style={{ display: 'flex', gap: '8px', lineHeight: '1.6', cursor: 'pointer' }}
              className="clickable"
              onClick={() => window.open(item.url, '_blank', 'noopener,noreferrer')}
              title="Click to open article in new tab"
            >
              <span style={{ color: '#5588FF', width: '30px', textAlign: 'right', flexShrink: 0 }}>
                {String(idx + 1).padStart(3, ' ')}
              </span>
              <span className="text-grey" style={{ width: '35px', flexShrink: 0 }}>{item.source}</span>
              <span className="text-amber" style={{ width: '40px', flexShrink: 0 }}>{item.time}</span>
              <span style={{ color: item.priority === 'high' ? 'var(--orange)' : '#5588FF' }}>
                {item.priority === 'high' && '★ '}{item.headline}
              </span>
              <span style={{ color: '#333', fontSize: '10px', flexShrink: 0, alignSelf: 'center' }}>↗</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TopNews;
