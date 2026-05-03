import React, { useState, useEffect } from 'react';

const COINGECKO_IDS = {
  'BTCUSDT': 'bitcoin', 'ETHUSDT': 'ethereum', 'BNBUSDT': 'binancecoin',
  'SOLUSDT': 'solana', 'XRPUSDT': 'ripple', 'ADAUSDT': 'cardano',
  'DOGEUSDT': 'dogecoin', 'TRXUSDT': 'tron', 'LINKUSDT': 'chainlink', 'AVAXUSDT': 'avalanche-2',
};

const fmtNum = (n, dec = 2) =>
  n != null ? Number(n).toLocaleString('en-US', { maximumFractionDigits: dec }) : '--';

const fmtUSD = (n) => {
  if (n == null) return '--';
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  if (n >= 1e3) return `$${(n / 1e3).toFixed(2)}K`;
  return `$${n.toFixed(4)}`;
};

const fmtPct = (n) => n != null ? `${n >= 0 ? '+' : ''}${n.toFixed(2)}%` : '--';
const clr = (n) => (n == null || n >= 0) ? 'text-up' : 'text-down';

const Row = ({ label, val, label2, val2, up, up2, bold }) => (
  <tr>
    <td className="text-amber" style={bold ? { fontWeight: 'bold' } : {}}>{label}</td>
    <td className={`right ${up != null ? (up ? 'text-up' : 'text-down') : 'text-white'}`}
        style={bold ? { fontWeight: 'bold' } : {}}>{val}</td>
    {label2 != null && <>
      <td className="text-amber" style={bold ? { fontWeight: 'bold' } : {}}>{label2}</td>
      <td className={`right ${up2 != null ? (up2 ? 'text-up' : 'text-down') : 'text-white'}`}
          style={bold ? { fontWeight: 'bold' } : {}}>{val2 ?? '--'}</td>
    </>}
  </tr>
);

const FinancialAnalysis = ({ symbol }) => {
  const [coinData, setCoinData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('MARKET');

  const coinId = COINGECKO_IDS[symbol] || 'bitcoin';
  const asset = symbol.replace('USDT', '');

  useEffect(() => {
    setLoading(true);
    setError(null);
    setCoinData(null);

    fetch(
      `https://api.coingecko.com/api/v3/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=true&developer_data=true&sparkline=false`
    )
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(data => {
        setCoinData(data);
        setLoading(false);
      })
      .catch(() => {
        setError('CoinGecko rate limit reached — please wait 30s and retry');
        setLoading(false);
      });
  }, [coinId]);

  const tabs = [
    { id: 'MARKET', label: 'Market Data' },
    { id: 'SUPPLY', label: 'Supply & Network' },
    { id: 'DEV', label: 'Dev & Community' },
    { id: 'METRICS', label: 'Key Metrics' },
  ];

  if (loading) return (
    <div className="panel" style={{ overflow: 'hidden' }}>
      <div className="panel-header"><span>FA — {asset} FINANCIAL ANALYSIS</span><span className="mono-xs">CoinGecko</span></div>
      <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-amber)' }}>LOADING MARKET DATA...</div>
    </div>
  );

  if (error || !coinData) return (
    <div className="panel" style={{ overflow: 'hidden' }}>
      <div className="panel-header"><span>FA — {asset} FINANCIAL ANALYSIS</span></div>
      <div style={{ padding: '16px', color: 'var(--text-down)', fontSize: '12px' }}>{error || 'No data available'}</div>
    </div>
  );

  const md = coinData.market_data;
  const dev = coinData.developer_data;
  const comm = coinData.community_data;

  return (
    <div className="panel" style={{ overflow: 'hidden' }}>
      <div className="panel-header">
        <span>FA — {asset} FINANCIAL ANALYSIS</span>
        <span className="mono-xs">CoinGecko • Live</span>
      </div>

      <div className="tab-bar">
        {tabs.map(t => (
          <button key={t.id} className={`tab-item ${activeTab === t.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '4px' }}>

        {activeTab === 'MARKET' && md && (
          <table className="bb-table">
            <thead>
              <tr><th>Metric</th><th className="right">Value</th><th>Metric</th><th className="right">Value</th></tr>
            </thead>
            <tbody>
              <Row bold label="Current Price (USD)" val={fmtUSD(md.current_price?.usd)}
                   label2="Market Cap (USD)" val2={fmtUSD(md.market_cap?.usd)} />
              <Row label="24h High" val={fmtUSD(md.high_24h?.usd)} up={true}
                   label2="Market Cap Rank" val2={`#${md.market_cap_rank}`} />
              <Row label="24h Low" val={fmtUSD(md.low_24h?.usd)} up={false}
                   label2="Total Volume 24h" val2={fmtUSD(md.total_volume?.usd)} />
              <tr style={{ borderTop: '1px solid var(--border-color)' }}>
                <td className="text-amber">24h Change</td>
                <td className={`right ${clr(md.price_change_percentage_24h)}`}>{fmtPct(md.price_change_percentage_24h)}</td>
                <td className="text-amber">7d Change</td>
                <td className={`right ${clr(md.price_change_percentage_7d)}`}>{fmtPct(md.price_change_percentage_7d)}</td>
              </tr>
              <tr>
                <td className="text-amber">30d Change</td>
                <td className={`right ${clr(md.price_change_percentage_30d)}`}>{fmtPct(md.price_change_percentage_30d)}</td>
                <td className="text-amber">1y Change</td>
                <td className={`right ${clr(md.price_change_percentage_1y)}`}>{fmtPct(md.price_change_percentage_1y)}</td>
              </tr>
              <tr style={{ borderTop: '2px solid var(--text-amber)' }}>
                <td className="text-amber" style={{ fontWeight: 'bold' }}>All-Time High</td>
                <td className="right text-up" style={{ fontWeight: 'bold' }}>{fmtUSD(md.ath?.usd)}</td>
                <td className="text-amber" style={{ fontWeight: 'bold' }}>ATH Change</td>
                <td className={`right ${clr(md.ath_change_percentage?.usd)}`} style={{ fontWeight: 'bold' }}>
                  {fmtPct(md.ath_change_percentage?.usd)}
                </td>
              </tr>
              <Row label="ATH Date"
                   val={md.ath_date?.usd ? new Date(md.ath_date.usd).toLocaleDateString('en-GB') : '--'}
                   label2="All-Time Low" val2={fmtUSD(md.atl?.usd)} up2={false} />
              <tr>
                <td className="text-amber">Vol / Mkt Cap</td>
                <td className="right text-grey">
                  {md.total_volume?.usd && md.market_cap?.usd
                    ? ((md.total_volume.usd / md.market_cap.usd) * 100).toFixed(2) + '%'
                    : '--'}
                </td>
                <td className="text-amber">Fully Diluted Val.</td>
                <td className="right text-white">{fmtUSD(md.fully_diluted_valuation?.usd)}</td>
              </tr>
            </tbody>
          </table>
        )}

        {activeTab === 'SUPPLY' && md && (
          <table className="bb-table">
            <thead>
              <tr><th>Metric</th><th className="right">Value</th><th>Metric</th><th className="right">Value</th></tr>
            </thead>
            <tbody>
              <Row bold label="Circulating Supply"
                   val={`${fmtNum(md.circulating_supply, 0)} ${asset}`}
                   label2="Max Supply"
                   val2={md.max_supply ? `${fmtNum(md.max_supply, 0)} ${asset}` : 'Unlimited'} />
              <Row label="Total Supply"
                   val={`${fmtNum(md.total_supply, 0)} ${asset}`}
                   label2="% of Max Circulating"
                   val2={md.max_supply && md.circulating_supply
                     ? ((md.circulating_supply / md.max_supply) * 100).toFixed(1) + '%'
                     : '--'} />
              <tr style={{ borderTop: '1px solid var(--border-color)' }}>
                <td className="text-amber" style={{ fontWeight: 'bold' }}>Market Cap</td>
                <td className="right text-white" style={{ fontWeight: 'bold' }}>{fmtUSD(md.market_cap?.usd)}</td>
                <td className="text-amber" style={{ fontWeight: 'bold' }}>Fully Diluted Val.</td>
                <td className="right text-white" style={{ fontWeight: 'bold' }}>{fmtUSD(md.fully_diluted_valuation?.usd)}</td>
              </tr>
              <tr>
                <td className="text-amber">FDV / Mkt Cap</td>
                <td className="right text-grey">
                  {md.fully_diluted_valuation?.usd && md.market_cap?.usd
                    ? (md.fully_diluted_valuation.usd / md.market_cap.usd).toFixed(2) + 'x'
                    : '--'}
                </td>
                <td className="text-amber">Current Price</td>
                <td className="right">{fmtUSD(md.current_price?.usd)}</td>
              </tr>
              <tr style={{ borderTop: '2px solid var(--text-amber)' }}>
                <td className="text-amber" style={{ fontWeight: 'bold' }} colSpan={2}>ASSET DETAILS</td>
                <td colSpan={2} />
              </tr>
              <tr>
                <td className="text-amber">Hashing Algorithm</td>
                <td className="right text-grey">{coinData.hashing_algorithm || 'N/A'}</td>
                <td className="text-amber">Genesis Date</td>
                <td className="right text-grey">{coinData.genesis_date || '--'}</td>
              </tr>
              <tr>
                <td className="text-amber">Categories</td>
                <td className="right text-grey" colSpan={3}>
                  {coinData.categories?.slice(0, 3).join(', ') || '--'}
                </td>
              </tr>
            </tbody>
          </table>
        )}

        {activeTab === 'DEV' && (
          <table className="bb-table">
            <thead>
              <tr><th>Metric</th><th className="right">Value</th><th>Metric</th><th className="right">Value</th></tr>
            </thead>
            <tbody>
              {dev ? (
                <>
                  <tr>
                    <td className="text-amber" style={{ fontWeight: 'bold' }} colSpan={4}>DEVELOPER ACTIVITY (GitHub)</td>
                  </tr>
                  <Row label="Stars" val={fmtNum(dev.stars, 0)} label2="Forks" val2={fmtNum(dev.forks, 0)} />
                  <Row label="Open Issues" val={fmtNum(dev.total_issues, 0)}
                       label2="Closed Issues" val2={fmtNum(dev.closed_issues, 0)} />
                  <Row label="PRs Merged" val={fmtNum(dev.pull_requests_merged, 0)} up={true}
                       label2="PR Contributors" val2={fmtNum(dev.pull_request_contributors, 0)} />
                  <Row label="Commits (4w)" val={fmtNum(dev.commit_count_4_weeks, 0)} up={true}
                       label2="Subscribers" val2={fmtNum(dev.subscribers, 0)} />
                </>
              ) : (
                <tr><td colSpan={4} style={{ padding: '12px', color: 'var(--text-grey)' }}>No developer data available</td></tr>
              )}
              {comm ? (
                <>
                  <tr style={{ borderTop: '2px solid var(--text-amber)' }}>
                    <td className="text-amber" style={{ fontWeight: 'bold' }} colSpan={4}>COMMUNITY METRICS</td>
                  </tr>
                  <Row label="Twitter Followers" val={fmtNum(comm.twitter_followers, 0)}
                       label2="Reddit Subscribers" val2={fmtNum(comm.reddit_subscribers, 0)} />
                  <Row label="Reddit Active 48h" val={fmtNum(comm.reddit_active_accounts_48h, 0)}
                       label2="Telegram Members" val2={fmtNum(comm.telegram_channel_user_count, 0)} />
                  <Row label="Reddit Posts 48h avg" val={comm.reddit_average_posts_48h?.toFixed(1) ?? '--'}
                       label2="Reddit Comments 48h avg" val2={comm.reddit_average_comments_48h?.toFixed(1) ?? '--'} />
                </>
              ) : null}
            </tbody>
          </table>
        )}

        {activeTab === 'METRICS' && md && (
          <div style={{ padding: '4px' }}>
            <div className="section-title">PRICE PERFORMANCE</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '8px' }}>
              {[
                { label: '24h Change', v: md.price_change_percentage_24h },
                { label: '7d Change', v: md.price_change_percentage_7d },
                { label: '14d Change', v: md.price_change_percentage_14d },
                { label: '30d Change', v: md.price_change_percentage_30d },
                { label: '60d Change', v: md.price_change_percentage_60d },
                { label: '200d Change', v: md.price_change_percentage_200d },
                { label: '1y Change', v: md.price_change_percentage_1y },
                { label: 'ATH Change', v: md.ath_change_percentage?.usd },
              ].map(r => (
                <div key={r.label} className="data-row">
                  <span className="data-label">{r.label}</span>
                  <span className={`data-value ${clr(r.v)}`}>{fmtPct(r.v)}</span>
                </div>
              ))}
            </div>

            <div className="section-title" style={{ marginTop: '8px' }}>MARKET METRICS</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '8px' }}>
              {[
                { label: 'Market Cap Rank', value: `#${md.market_cap_rank}` },
                { label: 'Market Cap', value: fmtUSD(md.market_cap?.usd) },
                { label: 'All-Time High', value: fmtUSD(md.ath?.usd) },
                { label: 'ATH Date', value: md.ath_date?.usd ? new Date(md.ath_date.usd).toLocaleDateString('en-GB') : '--' },
                { label: 'All-Time Low', value: fmtUSD(md.atl?.usd) },
                { label: 'ATL Date', value: md.atl_date?.usd ? new Date(md.atl_date.usd).toLocaleDateString('en-GB') : '--' },
                {
                  label: 'Vol / Mkt Cap',
                  value: md.total_volume?.usd && md.market_cap?.usd
                    ? ((md.total_volume.usd / md.market_cap.usd) * 100).toFixed(2) + '%'
                    : '--',
                },
                {
                  label: 'FDV / Mkt Cap',
                  value: md.fully_diluted_valuation?.usd && md.market_cap?.usd
                    ? (md.fully_diluted_valuation.usd / md.market_cap.usd).toFixed(2) + 'x'
                    : '--',
                },
              ].map(r => (
                <div key={r.label} className="data-row">
                  <span className="data-label">{r.label}</span>
                  <span className="data-value">{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialAnalysis;
