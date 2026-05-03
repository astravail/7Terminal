import React, { useState, useEffect, useRef } from 'react';

const SYMBOLS = [
  { id: 'BTCUSDT', name: 'Bitcoin' },
  { id: 'ETHUSDT', name: 'Ethereum' },
  { id: 'BNBUSDT', name: 'Binance Coin' },
  { id: 'SOLUSDT', name: 'Solana' },
  { id: 'XRPUSDT', name: 'Ripple' },
  { id: 'ADAUSDT', name: 'Cardano' },
  { id: 'DOGEUSDT', name: 'Dogecoin' },
  { id: 'TRXUSDT', name: 'TRON' },
  { id: 'LINKUSDT', name: 'Chainlink' },
  { id: 'AVAXUSDT', name: 'Avalanche' }
];

const CommandLine = ({ activeSymbol, setActiveSymbol }) => {
  const [input, setInput] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const inputRef = useRef(null);

  const filteredSymbols = input 
    ? SYMBOLS.filter(s => s.id.includes(input) || s.name.toUpperCase().includes(input))
    : [];

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const cmd = input.toUpperCase().trim();
      
      if (cmd === 'HELP') {
        setShowHelp(true);
        setInput('');
        setShowDropdown(false);
        return;
      }

      // Strict validation: Only allow known symbols to prevent breaking the app
      const validSymbol = SYMBOLS.find(s => s.id === cmd || s.id === `${cmd}USDT`);
      if (validSymbol) {
        setActiveSymbol(validSymbol.id);
      } else if (filteredSymbols.length > 0) {
        setActiveSymbol(filteredSymbols[0].id);
      } else {
        // Invalid input, do nothing or flash error
        setInput('INVALID COMMAND');
        setTimeout(() => setInput(''), 1000);
        return;
      }
      
      setInput('');
      setShowDropdown(false);
    }
  };

  const handleSelect = (sym) => {
    setActiveSymbol(sym);
    setInput('');
    setShowDropdown(false);
  };

  return (
    <div className="cmd-row" style={{ position: 'relative' }}>
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flex: 1 }}>
        <span className="text-white" style={{ border: '1px solid var(--border-color)', padding: '2px 4px', fontSize: '11px' }}>&lt; &gt;</span>
        <span className="text-white" style={{ backgroundColor: '#EEEEEE', color: '#000', padding: '2px 4px', fontSize: '11px', fontWeight: 'bold' }}>
          {activeSymbol.replace('USDT', '')} <span style={{fontSize:'9px'}}>▼</span>
        </span>
        <span className="text-white" style={{ backgroundColor: '#EEEEEE', color: '#000', padding: '2px 4px', fontSize: '11px', fontWeight: 'bold' }}>
          DES <span style={{fontSize:'9px'}}>▼</span>
        </span>
        <span className="text-grey" style={{ fontSize: '11px' }}>Related Functions Menu <span style={{fontSize:'9px'}}>▼</span></span>
      </div>

      <div style={{ position: 'absolute', left: '30%', display: 'flex', alignItems: 'center', width: '400px' }}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value.toUpperCase());
            setShowDropdown(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder=""
          style={{
            backgroundColor: showDropdown && input ? '#FFCC00' : 'transparent',
            border: showDropdown && input ? '1px solid #FFCC00' : 'none',
            color: showDropdown && input && input !== 'INVALID COMMAND' ? '#000' : (input === 'INVALID COMMAND' ? 'red' : 'var(--text-white)'),
            fontFamily: 'inherit',
            fontSize: '13px',
            outline: 'none',
            width: '100%',
            fontWeight: 'bold',
            padding: '2px',
            textTransform: 'uppercase'
          }}
          autoFocus
        />
        {showDropdown && input && input !== 'INVALID COMMAND' && filteredSymbols.length > 0 && (
          <div className="autocomplete-dropdown" style={{ top: '24px', left: 0 }}>
            {filteredSymbols.map((s, i) => (
              <div 
                key={s.id} 
                className={`autocomplete-item ${i === 0 ? 'selected' : ''}`}
                onClick={() => handleSelect(s.id)}
              >
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontWeight: 'bold' }}>{s.id.replace('USDT', '')} US Equity</span>
                  <span className="text-grey" style={{ fontSize: '11px' }}>{s.name}</span>
                </div>
                <span className="text-grey" style={{ fontSize: '11px' }}>DIGITAL ASSET</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', fontSize: '11px' }}>
        <span className="text-white">✉ Message</span>
        <span className="text-amber clickable" style={{fontWeight: 'bold'}} onClick={() => setShowHelp(true)}>★ ⚙ ? HELP</span>
      </div>

      {showHelp && (
        <div style={{ position: 'fixed', top: '10%', left: '10%', width: '80%', height: '80%', backgroundColor: '#000080', border: '2px solid var(--text-amber)', zIndex: 9999, padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--text-amber)', paddingBottom: '10px', marginBottom: '20px' }}>
            <h2 className="text-amber">7TERMINAL HELP MENU</h2>
            <button onClick={() => setShowHelp(false)} style={{ background: 'transparent', color: 'var(--text-amber)', border: '1px solid var(--text-amber)', cursor: 'pointer', padding: '4px 8px' }}>CLOSE &lt;GO&gt;</button>
          </div>
          
          <div className="text-white" style={{ fontSize: '14px', lineHeight: '1.8' }}>
            <p className="text-amber" style={{fontWeight: 'bold'}}>SYSTEM STATUS & LIMITATIONS</p>
            <p style={{ paddingLeft: '20px', marginBottom: '20px' }}>
              For å kunne levere <strong className="text-cyan">SANNTIDS TRANSAKSJONSDATA</strong> og en levende ordrebok (Level 2), har systemet rullet tilbake til det robuste WebSockets-nettverket. Ekte aksjedata (som Oslo Børs) krever ekstremt dyre, betalte lisenser for å få sanntids tick-data. Derfor bruker denne terminalen digitale eiendeler for å demonstrere funksjonaliteten fullt ut uten feil eller forsinkelser.
            </p>

            <p className="text-amber" style={{fontWeight: 'bold'}}>COMMAND SUMMARY</p>
            <ul style={{ listStyleType: 'none', paddingLeft: '20px', marginBottom: '20px' }}>
              <li><strong className="text-cyan">&lt;TICKER&gt; &lt;GO&gt;</strong> : Laster inn data. Gyldige koder: <em>BTC, ETH, SOL, BNB, XRP, ADA, DOGE, TRX, LINK, AVAX</em>. Skriver du inn noe ukjent, vil systemet avvise det for å hindre kræsj.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommandLine;
