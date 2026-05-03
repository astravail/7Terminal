import React from 'react';

const QUICK_LINKS = [
  { cmd: 'DES', desc: 'Description' },
  { cmd: 'GP', desc: 'Graph Price' },
  { cmd: 'TOP', desc: 'Top News' },
  { cmd: 'WEI', desc: 'World Equity' },
  { cmd: 'FA', desc: 'Financials' },
  { cmd: 'HP', desc: 'Hist. Price' },
  { cmd: 'GIP', desc: 'Intraday' },
  { cmd: 'TLKR', desc: 'Watchlist' },
];

const Footer = ({ activeView, navigateTo }) => {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' });

  return (
    <div className="footer-row" style={{ fontSize: '11px', gap: '0' }}>
      <span className="text-amber" style={{ marginRight: '6px', fontWeight: 'bold' }}>Functions:</span>

      {QUICK_LINKS.map(link => (
        <div
          key={link.cmd}
          onClick={() => navigateTo(link.cmd)}
          style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: activeView === link.cmd ? 'var(--tab-active)' : 'transparent',
            borderRight: '1px solid var(--border-color)',
            height: '100%',
            padding: '0 6px',
            cursor: 'pointer',
            transition: 'background 0.15s',
          }}
          onMouseEnter={e => { if (activeView !== link.cmd) e.currentTarget.style.backgroundColor = '#222'; }}
          onMouseLeave={e => { if (activeView !== link.cmd) e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          <span className={activeView === link.cmd ? 'text-amber' : 'text-white'} style={{ fontWeight: 'bold', marginRight: '4px' }}>{link.cmd}</span>
          <span className="text-grey">{link.desc}</span>
        </div>
      ))}

      <span style={{ flex: 1 }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '8px' }}>
        <span className="text-grey">NET:</span>
        <span className="status-dot online" />
        <span className="text-up mono-xs">WS-OK</span>
        <span className="status-dot online" />
        <span className="text-up mono-xs">REST-OK</span>
      </div>

      <div style={{ borderLeft: '1px solid var(--border-color)', height: '100%', display: 'flex', alignItems: 'center', paddingLeft: '8px' }}>
        <span className="text-amber" style={{ fontWeight: 'bold' }}>{timeStr}</span>
        <span className="text-grey" style={{ marginLeft: '6px' }}>{dateStr}</span>
      </div>
    </div>
  );
};

export default Footer;
