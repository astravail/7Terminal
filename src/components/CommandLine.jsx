import React, { useState, useRef, useEffect } from 'react';

const SYMBOLS = [
  { id: 'BTCUSDT', name: 'Bitcoin', sector: 'DIGITAL ASSET' },
  { id: 'ETHUSDT', name: 'Ethereum', sector: 'DIGITAL ASSET' },
  { id: 'BNBUSDT', name: 'Binance Coin', sector: 'DIGITAL ASSET' },
  { id: 'SOLUSDT', name: 'Solana', sector: 'DIGITAL ASSET' },
  { id: 'XRPUSDT', name: 'Ripple', sector: 'DIGITAL ASSET' },
  { id: 'ADAUSDT', name: 'Cardano', sector: 'DIGITAL ASSET' },
  { id: 'DOGEUSDT', name: 'Dogecoin', sector: 'DIGITAL ASSET' },
  { id: 'TRXUSDT', name: 'TRON', sector: 'DIGITAL ASSET' },
  { id: 'LINKUSDT', name: 'Chainlink', sector: 'DIGITAL ASSET' },
  { id: 'AVAXUSDT', name: 'Avalanche', sector: 'DIGITAL ASSET' },
];

const COMMANDS = [
  { cmd: 'DES',  desc: 'Security Description — Overview & Data', view: 'DES' },
  { cmd: 'GP',   desc: 'Graph Price — Historical Chart', view: 'DES' },
  { cmd: 'TOP',  desc: 'Top News — Global Headlines', view: 'TOP' },
  { cmd: 'WEI',  desc: 'Crypto Market Index Monitor', view: 'WEI' },
  { cmd: 'FA',   desc: 'Financial Analysis — On-Chain Metrics', view: 'FA' },
  { cmd: 'HP',   desc: 'Historical Price Table', view: 'HP' },
  { cmd: 'GIP',  desc: 'Intraday Price Chart', view: 'GIP' },
  { cmd: 'TLKR', desc: 'Watchlist — Ticker Monitor', view: 'TLKR' },
  { cmd: 'HELP', desc: 'Open Help Menu', view: null },
];

const RELATED_FUNCTIONS = {
  DES:  ['TOP', 'FA', 'HP', 'GIP'],
  TOP:  ['DES', 'WEI', 'TLKR'],
  WEI:  ['TOP', 'DES', 'TLKR'],
  FA:   ['DES', 'HP', 'GIP'],
  HP:   ['FA', 'GIP', 'DES'],
  GIP:  ['HP', 'DES', 'FA'],
  TLKR: ['DES', 'WEI', 'TOP'],
};

const MSG_ITEMS = [
  { type: 'system', time: null, text: 'Terminal connected — Binance WebSocket active' },
  { type: 'system', time: null, text: 'News feed active — CryptoCompare live data' },
  { type: 'info',   time: null, text: 'Market data via CoinGecko (free tier)' },
  { type: 'info',   time: null, text: 'No rate-limit keys required for current data sources' },
];

const CommandLine = ({ activeSymbol, setActiveSymbol, activeView, navigateTo, goBack, showToast }) => {
  const [input, setInput] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showMsg, setShowMsg] = useState(false);
  const [showIB, setShowIB] = useState(false);
  const [showRelated, setShowRelated] = useState(false);
  const inputRef = useRef(null);
  const relatedRef = useRef(null);

  const filteredSymbols = input
    ? SYMBOLS.filter(s => s.id.includes(input) || s.name.toUpperCase().includes(input))
    : [];
  const filteredCommands = input
    ? COMMANDS.filter(c => c.cmd.startsWith(input) || c.desc.toUpperCase().includes(input))
    : [];
  const allFiltered = [
    ...filteredCommands.map(c => ({ type: 'cmd', ...c })),
    ...filteredSymbols.map(s => ({ type: 'sym', ...s })),
  ];

  const relatedCmds = (RELATED_FUNCTIONS[activeView] || ['DES', 'TOP', 'WEI', 'FA']).map(
    cmd => COMMANDS.find(c => c.cmd === cmd)
  ).filter(Boolean);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (relatedRef.current && !relatedRef.current.contains(e.target)) {
        setShowRelated(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') { setInput(''); setShowDropdown(false); return; }

    if (e.key === 'Enter') {
      const cmd = input.toUpperCase().trim();

      if (cmd === 'HELP') { setShowHelp(true); setInput(''); setShowDropdown(false); return; }
      if (cmd === 'BACK' || cmd === 'MENU') { goBack(); setInput(''); setShowDropdown(false); return; }

      const knownCmd = COMMANDS.find(c => c.cmd === cmd);
      if (knownCmd && knownCmd.view) {
        navigateTo(knownCmd.view); setInput(''); setShowDropdown(false); return;
      }

      const validSymbol = SYMBOLS.find(s => s.id === cmd || s.id === `${cmd}USDT`);
      if (validSymbol) {
        setActiveSymbol(validSymbol.id);
        showToast(`Loaded ${validSymbol.name} (${validSymbol.id})`);
      } else if (filteredSymbols.length > 0) {
        setActiveSymbol(filteredSymbols[0].id);
        showToast(`Loaded ${filteredSymbols[0].name}`);
      } else if (filteredCommands.length > 0 && filteredCommands[0].view) {
        navigateTo(filteredCommands[0].view);
      } else {
        setInput('INVALID');
        showToast('Unknown command or ticker — Type HELP for commands');
        setTimeout(() => setInput(''), 1200);
        return;
      }
      setInput(''); setShowDropdown(false);
    }
  };

  const handleSelect = (item) => {
    if (item.type === 'cmd' && item.view) navigateTo(item.view);
    else if (item.type === 'sym') { setActiveSymbol(item.id); showToast(`Loaded ${item.name}`); }
    setInput(''); setShowDropdown(false);
  };

  const nowTime = new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="cmd-row">
      {/* Left: Security indicator */}
      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', minWidth: '200px' }}>
        <span style={{ border: '1px solid var(--border-color)', padding: '1px 4px', fontSize: '11px', color: 'var(--text-white)' }}>◀ ▶</span>
        <span style={{ backgroundColor: '#EEEEEE', color: '#000', padding: '1px 6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
              onClick={() => navigateTo('DES')}>
          {activeSymbol.replace('USDT', '')} <span style={{ fontSize: '9px' }}>▼</span>
        </span>
        <span style={{ backgroundColor: '#EEEEEE', color: '#000', padding: '1px 6px', fontSize: '11px', fontWeight: 'bold', cursor: 'pointer' }}
              onClick={() => navigateTo(activeView)}>
          {activeView} <span style={{ fontSize: '9px' }}>▼</span>
        </span>

        {/* Related Functions dropdown */}
        <div ref={relatedRef} style={{ position: 'relative' }}>
          <span
            className="text-grey mono-xs clickable"
            style={{ padding: '2px 4px', userSelect: 'none' }}
            onClick={() => setShowRelated(prev => !prev)}
          >
            Related Functions ▼
          </span>
          {showRelated && (
            <div style={{
              position: 'absolute', top: '20px', left: 0, zIndex: 200,
              backgroundColor: '#111', border: '1px solid var(--border-color)',
              minWidth: '220px', boxShadow: '0 4px 12px rgba(0,0,0,0.8)',
            }}>
              <div style={{ padding: '4px 8px', borderBottom: '1px solid var(--border-color)', fontSize: '10px', color: 'var(--text-amber)' }}>
                RELATED — {activeView}
              </div>
              {relatedCmds.map(c => (
                <div
                  key={c.cmd}
                  className="clickable"
                  style={{ padding: '5px 8px', display: 'flex', gap: '10px', alignItems: 'baseline' }}
                  onClick={() => { navigateTo(c.view); setShowRelated(false); }}
                >
                  <span style={{ fontWeight: 'bold', color: 'var(--text-amber)', width: '40px', flexShrink: 0 }}>{c.cmd}</span>
                  <span className="text-grey" style={{ fontSize: '11px' }}>{c.desc}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Center: Input */}
      <div style={{ flex: 1, position: 'relative', maxWidth: '500px', marginLeft: '20px' }}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => { setInput(e.target.value.toUpperCase()); setShowDropdown(true); }}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (input) setShowDropdown(true); }}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          placeholder=""
          style={{
            backgroundColor: showDropdown && input ? '#FFCC00' : 'transparent',
            border: showDropdown && input ? '1px solid #FFCC00' : '1px solid transparent',
            color: showDropdown && input && input !== 'INVALID' ? '#000' : (input === 'INVALID' ? 'red' : 'var(--text-white)'),
            fontFamily: 'inherit', fontSize: '13px', outline: 'none', width: '100%',
            fontWeight: 'bold', padding: '3px 4px', textTransform: 'uppercase',
          }}
          autoFocus
        />
        {showDropdown && input && input !== 'INVALID' && allFiltered.length > 0 && (
          <div className="autocomplete-dropdown" style={{ top: '28px', left: 0, width: '100%' }}>
            {allFiltered.slice(0, 12).map((item, i) => (
              <div
                key={item.cmd || item.id}
                className={`autocomplete-item ${i === 0 ? 'selected' : ''}`}
                onMouseDown={() => handleSelect(item)}
              >
                {item.type === 'cmd' ? (
                  <>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 'bold', color: 'var(--text-amber)' }}>{item.cmd}</span>
                      <span className="text-grey mono-xs">{item.desc}</span>
                    </div>
                    <span className="text-cyan mono-xs">FUNCTION</span>
                  </>
                ) : (
                  <>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 'bold' }}>{item.id.replace('USDT', '')} Equity</span>
                      <span className="text-grey mono-xs">{item.name}</span>
                    </div>
                    <span className="text-grey mono-xs">{item.sector}</span>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right: Action buttons */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '11px', marginLeft: 'auto', position: 'relative' }}>
        <span
          className="text-white clickable"
          onClick={() => { setShowMsg(prev => !prev); setShowIB(false); }}
          style={{ color: showMsg ? 'var(--text-amber)' : undefined }}
        >
          ✉ MSG
        </span>
        <span
          className="text-grey clickable"
          onClick={() => { setShowIB(prev => !prev); setShowMsg(false); }}
          style={{ color: showIB ? 'var(--text-amber)' : undefined }}
        >
          IB
        </span>
        <span className="text-grey clickable" onClick={goBack}>◀ BACK</span>
        <span className="text-amber clickable" style={{ fontWeight: 'bold' }} onClick={() => setShowHelp(true)}>? HELP</span>

        {/* MSG Panel */}
        {showMsg && (
          <div style={{
            position: 'absolute', top: '24px', right: '60px', zIndex: 300,
            backgroundColor: '#0a0a0a', border: '1px solid var(--border-color)',
            width: '340px', boxShadow: '0 4px 16px rgba(0,0,0,0.9)',
          }}>
            <div style={{ padding: '5px 10px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-amber" style={{ fontWeight: 'bold', fontSize: '11px' }}>MESSAGES</span>
              <span className="text-grey mono-xs">{nowTime}</span>
            </div>
            {MSG_ITEMS.map((m, i) => (
              <div key={i} style={{ padding: '5px 10px', borderBottom: '1px solid #111', display: 'flex', gap: '8px' }}>
                <span style={{ color: m.type === 'system' ? 'var(--text-up)' : 'var(--text-amber)', fontSize: '10px', flexShrink: 0 }}>
                  {m.type === 'system' ? '●' : '○'}
                </span>
                <span style={{ fontSize: '11px', color: 'var(--text-white)' }}>{m.text}</span>
              </div>
            ))}
            <div style={{ padding: '5px 10px', fontSize: '10px', color: 'var(--text-grey)' }}>
              No new user messages
            </div>
          </div>
        )}

        {/* IB Panel */}
        {showIB && (
          <div style={{
            position: 'absolute', top: '24px', right: '40px', zIndex: 300,
            backgroundColor: '#0a0a0a', border: '1px solid var(--border-color)',
            width: '300px', boxShadow: '0 4px 16px rgba(0,0,0,0.9)',
          }}>
            <div style={{ padding: '5px 10px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between' }}>
              <span className="text-amber" style={{ fontWeight: 'bold', fontSize: '11px' }}>7T IB NETWORK</span>
              <span style={{ fontSize: '10px', color: 'var(--text-down)' }}>● OFFLINE</span>
            </div>
            <div style={{ padding: '16px 10px', textAlign: 'center' }}>
              <div style={{ color: 'var(--text-grey)', fontSize: '12px', marginBottom: '8px' }}>
                Bloomberg IB — Not connected
              </div>
              <div style={{ color: 'var(--text-grey)', fontSize: '10px' }}>
                Instant Bloomberg messaging requires a live Bloomberg subscription.
                This terminal operates on public APIs only.
              </div>
            </div>
            <div style={{ padding: '5px 10px', borderTop: '1px solid var(--border-color)', fontSize: '10px', color: 'var(--text-grey)' }}>
              0 contacts online
            </div>
          </div>
        )}
      </div>

      {/* Help modal */}
      {showHelp && (
        <div className="help-overlay" onClick={() => setShowHelp(false)}>
          <div className="help-modal" onClick={(e) => e.stopPropagation()}>
            <div className="help-modal-header">
              <h2 className="text-amber" style={{ fontSize: '16px' }}>7TERMINAL — HELP & REFERENCE GUIDE</h2>
              <button onClick={() => setShowHelp(false)} style={{ background: 'transparent', color: 'var(--text-amber)', border: '1px solid var(--text-amber)', cursor: 'pointer', padding: '4px 12px', fontFamily: 'inherit', fontSize: '12px' }}>
                CLOSE &lt;GO&gt;
              </button>
            </div>
            <div className="help-modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                <div>
                  <p className="text-amber" style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' }}>NAVIGATION COMMANDS</p>
                  <table className="bb-table">
                    <thead><tr><th>Command</th><th>Description</th></tr></thead>
                    <tbody>
                      {COMMANDS.map(c => (
                        <tr key={c.cmd}>
                          <td className="text-cyan" style={{ fontWeight: 'bold' }}>{c.cmd} &lt;GO&gt;</td>
                          <td>{c.desc}</td>
                        </tr>
                      ))}
                      <tr><td className="text-cyan" style={{ fontWeight: 'bold' }}>BACK</td><td>Return to previous screen</td></tr>
                      <tr><td className="text-cyan" style={{ fontWeight: 'bold' }}>MENU</td><td>Return to main menu</td></tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <p className="text-amber" style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' }}>AVAILABLE SECURITIES</p>
                  <table className="bb-table">
                    <thead><tr><th>Ticker</th><th>Name</th><th>Sector</th></tr></thead>
                    <tbody>
                      {SYMBOLS.map(s => (
                        <tr key={s.id}>
                          <td className="text-cyan" style={{ fontWeight: 'bold' }}>{s.id.replace('USDT', '')}</td>
                          <td>{s.name}</td>
                          <td className="text-grey">{s.sector}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div style={{ marginTop: '24px' }}>
                <p className="text-amber" style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' }}>KEYBOARD SHORTCUTS</p>
                <table className="bb-table" style={{ maxWidth: '600px' }}>
                  <tbody>
                    <tr><td className="text-cyan">Enter</td><td>Execute command (GO)</td></tr>
                    <tr><td className="text-cyan">Escape</td><td>Cancel / clear input</td></tr>
                    <tr><td className="text-cyan">F2–F12</td><td>Market sector keys — navigate to related views</td></tr>
                  </tbody>
                </table>
              </div>

              <div style={{ marginTop: '24px' }}>
                <p className="text-amber" style={{ fontWeight: 'bold', marginBottom: '8px', fontSize: '14px' }}>DATA SOURCES</p>
                <table className="bb-table" style={{ maxWidth: '700px' }}>
                  <thead><tr><th>Source</th><th>Data</th><th>Refresh</th></tr></thead>
                  <tbody>
                    <tr><td className="text-cyan">Binance WebSocket</td><td>Order book, trades, price charts</td><td className="text-up">100ms live</td></tr>
                    <tr><td className="text-cyan">CryptoCompare</td><td>News headlines (TopNews + Ticker)</td><td className="text-up">2–3 min</td></tr>
                    <tr><td className="text-cyan">CoinGecko</td><td>Market categories (WEI), coin metrics (FA)</td><td className="text-up">60 sec</td></tr>
                    <tr><td className="text-cyan">Binance REST</td><td>Watchlist prices, historical OHLCV</td><td className="text-up">On demand</td></tr>
                  </tbody>
                </table>
              </div>

              <div style={{ marginTop: '24px', padding: '12px', background: '#000033', border: '1px solid var(--border-color)' }}>
                <p className="text-amber" style={{ fontWeight: 'bold', marginBottom: '8px' }}>SYSTEM STATUS</p>
                <p>
                  All data is <strong className="text-cyan">real-time and fact-based</strong> from public APIs.
                  News articles link to original sources. Market data reflects live crypto markets.
                  No API keys required — all sources are free-tier public endpoints.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommandLine;
