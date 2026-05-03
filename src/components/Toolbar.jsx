import React from 'react';

const FKEYS = [
  { key: 'F2', label: 'GOVT', color: 'yellow' },
  { key: 'F3', label: 'CORP', color: 'yellow' },
  { key: 'F4', label: 'MTGE', color: 'yellow' },
  { key: 'F5', label: 'M-MKT', color: 'yellow' },
  { key: 'F6', label: 'MUNI', color: 'yellow' },
  { key: 'F7', label: 'PFD', color: 'yellow' },
  { key: 'F8', label: 'EQUITY', color: 'yellow' },
  { key: 'F9', label: 'COMDTY', color: 'yellow' },
  { key: 'F10', label: 'INDEX', color: 'yellow' },
  { key: 'F11', label: 'CURNCY', color: 'yellow' },
  { key: 'F12', label: 'CLIENT', color: 'yellow' },
];

const ACTIONS = [
  { label: 'MENU', color: '', action: 'MENU' },
  { label: 'BACK', color: '', action: 'BACK' },
  { label: 'CANCEL', color: 'red', action: 'CANCEL' },
  { label: 'GO', color: 'green', action: 'GO' },
];

const Toolbar = ({ navigateTo, showToast }) => {
  const handleFKey = (fkey) => {
    showToast(`${fkey.label} sector selected — filtering by ${fkey.label}`);
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
          className={`fkey-btn ${fk.color}`} 
          onClick={() => handleFKey(fk)}
          title={`${fk.key} — ${fk.label}`}
        >
          {fk.key} {fk.label}
        </button>
      ))}

      <span style={{ flex: 1 }} />

      {ACTIONS.map(a => (
        <button 
          key={a.label} 
          className={`fkey-btn ${a.color}`}
          onClick={() => {
            if (a.action === 'MENU') navigateTo('DES');
            else showToast(`${a.label} pressed`);
          }}
        >
          {a.label}
        </button>
      ))}
    </div>
  );
};

export default Toolbar;
