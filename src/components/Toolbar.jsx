import React from 'react';

const FKEYS = [
  { key: 'F2',  label: 'GOVT',   view: 'TOP',  tooltip: 'Government & Macro News' },
  { key: 'F3',  label: 'CORP',   view: 'FA',   tooltip: 'Fundamental Analysis' },
  { key: 'F4',  label: 'MTGE',   view: 'HP',   tooltip: 'Historical Price Table' },
  { key: 'F5',  label: 'M-MKT',  view: 'TLKR', tooltip: 'Market Watchlist' },
  { key: 'F6',  label: 'MUNI',   view: 'WEI',  tooltip: 'Crypto Market Index' },
  { key: 'F7',  label: 'PFD',    view: 'GIP',  tooltip: 'Intraday Price Chart' },
  { key: 'F8',  label: 'EQUITY', view: 'DES',  tooltip: 'Security Overview' },
  { key: 'F9',  label: 'COMDTY', view: 'HP',   tooltip: 'Historical Price Data' },
  { key: 'F10', label: 'INDEX',  view: 'WEI',  tooltip: 'Market Index Monitor' },
  { key: 'F11', label: 'CURNCY', view: 'TLKR', tooltip: 'Currency / Watchlist' },
  { key: 'F12', label: 'CLIENT', view: null,   tooltip: 'Client Portal (not available)' },
];

const Toolbar = ({ navigateTo, showToast, goBack }) => {
  const handleFKey = (fk) => {
    if (fk.view) {
      navigateTo(fk.view);
      showToast(`${fk.label} — ${fk.tooltip}`);
    } else {
      showToast(`${fk.label} — Not available in this build`);
    }
  };

  return (
    <div className="toolbar-row">
      <div style={{ display: 'flex', alignItems: 'center', gap: '2px', marginRight: '8px' }}>
        <span className="text-amber" style={{ fontWeight: 'bold', fontSize: '11px', marginRight: '4px' }}>7T</span>
        <span className="text-grey mono-xs">|</span>
      </div>

      {FKEYS.map(fk => (
        <button
          key={fk.key}
          className="fkey-btn yellow"
          onClick={() => handleFKey(fk)}
          title={`${fk.key} — ${fk.tooltip}`}
        >
          {fk.key} {fk.label}
        </button>
      ))}

      <span style={{ flex: 1 }} />

      <button className="fkey-btn" onClick={() => navigateTo('DES')} title="Return to main menu">MENU</button>
      <button className="fkey-btn" onClick={goBack} title="Go back">BACK</button>
      <button className="fkey-btn red" onClick={() => showToast('Input cancelled')} title="Cancel">CANCEL</button>
      <button className="fkey-btn green" onClick={() => showToast('GO pressed — type a command and press Enter')} title="Execute">GO</button>
    </div>
  );
};

export default Toolbar;
