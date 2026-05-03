import React, { useState, useEffect } from 'react';

const generateHeadline = (symbol) => {
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
    `Partnership announced between major tech firm and ${asset} Foundation`,
    `Central banks explore digital currencies — Impact on ${asset}`,
    `${asset} options open interest reaches record levels`,
    `ETF flows suggest institutional demand for ${asset} remains strong`,
    `Cross-chain bridge vulnerability patched — ${asset} unaffected`,
    `Global payments firm integrates ${asset} for cross-border transfers`,
  ];
  return templates[Math.floor(Math.random() * templates.length)];
};

const GLOBAL_HEADLINES = [
  'Fed signals pause in rate hikes; Treasury yields decline across curve',
  'US Manufacturing PMI beats expectations at 52.1 vs 50.8 consensus',
  'European markets rally on ECB dovish pivot; DAX up 1.8%',
  'China Q2 GDP growth slows to 4.7%, below 5.1% target',
  'Oil prices surge 3% as OPEC+ extends production cuts through Q4',
  'Bank of Japan holds rates steady, yen weakens to 158/USD',
  'US initial jobless claims fall to 215K, labor market remains tight',
  'Earnings season: 78% of S&P 500 companies beat EPS estimates',
  'Gold hits $2,450 record on geopolitical tensions and rate outlook',
  'SEC approves new crypto ETF framework, expanding market access',
  'UK inflation drops to 2.3%, bolstering rate cut expectations',
  'Tech sector leads NASDAQ to new record high on AI optimism',
  'Supply chain disruptions in Asia push shipping costs higher',
  'IMF raises global growth forecast to 3.2% for 2025',
  'Emerging markets rally on dollar weakness and commodity gains',
];

const TopNews = ({ symbol, navigateTo }) => {
  const [news, setNews] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('TOP');

  useEffect(() => {
    const items = [];
    const now = Date.now();
    
    // Global headlines
    GLOBAL_HEADLINES.forEach((headline, i) => {
      items.push({
        id: now - i * 200000,
        code: Math.floor(Math.random() * 900) + 100,
        source: ['BB', 'RTRS', 'DJ', 'FT', 'CNBC', 'WSJ'][Math.floor(Math.random() * 6)],
        time: new Date(now - i * 200000).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        headline,
        priority: i < 3 ? 'high' : 'normal',
        category: 'TOP'
      });
    });

    // Crypto-specific headlines
    for (let i = 0; i < 10; i++) {
      items.push({
        id: now - (15 + i) * 200000,
        code: Math.floor(Math.random() * 900) + 100,
        source: ['BB', 'COIN', 'DL'][Math.floor(Math.random() * 3)],
        time: new Date(now - (15 + i) * 200000).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        headline: generateHeadline(symbol),
        priority: 'normal',
        category: 'CN'
      });
    }

    setNews(items);

    const interval = setInterval(() => {
      setNews(prev => {
        const isGlobal = Math.random() > 0.4;
        const newItem = {
          id: Date.now(),
          code: Math.floor(Math.random() * 900) + 100,
          source: isGlobal 
            ? ['BB', 'RTRS', 'DJ', 'FT', 'CNBC', 'WSJ'][Math.floor(Math.random() * 6)]
            : ['BB', 'COIN', 'DL'][Math.floor(Math.random() * 3)],
          time: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
          headline: isGlobal 
            ? GLOBAL_HEADLINES[Math.floor(Math.random() * GLOBAL_HEADLINES.length)]
            : generateHeadline(symbol),
          priority: Math.random() > 0.8 ? 'high' : 'normal',
          category: isGlobal ? 'TOP' : 'CN'
        };
        return [newItem, ...prev].slice(0, 60);
      });
    }, 6000);

    return () => clearInterval(interval);
  }, [symbol]);

  const categories = ['TOP', 'CN', 'EXCL', 'FIRST', 'MKTW'];
  const filtered = selectedCategory === 'TOP' ? news.filter(n => n.category === 'TOP') : 
                   selectedCategory === 'CN' ? news.filter(n => n.category === 'CN') : news;

  return (
    <div className="panel" style={{ overflow: 'hidden' }}>
      <div className="panel-header">
        <span>TOP NEWS — {selectedCategory === 'CN' ? `${symbol.replace('USDT','')} COMPANY NEWS` : 'GLOBAL HEADLINES'}</span>
        <span className="mono-xs">{new Date().toLocaleDateString('en-GB')}</span>
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
        {filtered.map(item => (
          <div key={item.id} style={{ display: 'flex', gap: '8px', lineHeight: '1.6', cursor: 'pointer' }}
               className="clickable">
            <span style={{ color: '#5588FF', width: '30px', textAlign: 'right', flexShrink: 0 }}>{item.code}</span>
            <span className="text-grey" style={{ width: '35px', flexShrink: 0 }}>{item.source}</span>
            <span className="text-amber" style={{ width: '40px', flexShrink: 0 }}>{item.time}</span>
            <span style={{ color: item.priority === 'high' ? 'var(--orange)' : '#5588FF' }}>
              {item.priority === 'high' && '★ '}{item.headline}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopNews;
