import React from 'react';

const Footer = () => {
  return (
    <div className="footer-row" style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '13px', backgroundColor: '#222222' }}>
      <span className="text-amber" style={{ marginLeft: '8px' }}>Suggested Functions</span>
      
      <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#000', borderRight: '1px solid var(--border-color)', height: '100%', padding: '0 8px' }}>
        <span className="text-white" style={{ fontWeight: 'bold', marginRight: '8px' }}>DES</span>
        <span className="text-grey">Study in-depth information on a security</span>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#000', borderRight: '1px solid var(--border-color)', height: '100%', padding: '0 8px' }}>
        <span className="text-white" style={{ fontWeight: 'bold', marginRight: '8px' }}>GR</span>
        <span className="text-grey">Analyze a ratio chart with statistics</span>
      </div>
    </div>
  );
};

export default Footer;
