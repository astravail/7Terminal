import React, { useState } from 'react';

const generateFinancials = (symbol) => {
  const asset = symbol.replace('USDT', '');
  const baseRevenue = Math.random() * 50 + 10; // billions
  
  const years = [2021, 2022, 2023, 2024, '2025E'];
  
  return {
    asset,
    incomeStatement: years.map((yr, i) => {
      const rev = baseRevenue * (1 + (i * 0.15) + (Math.random() - 0.3) * 0.1);
      const cogs = rev * (0.35 + Math.random() * 0.1);
      const grossProfit = rev - cogs;
      const opex = rev * (0.2 + Math.random() * 0.05);
      const ebit = grossProfit - opex;
      const netIncome = ebit * (0.7 + Math.random() * 0.1);
      return {
        year: yr,
        revenue: rev.toFixed(2),
        cogs: cogs.toFixed(2),
        grossProfit: grossProfit.toFixed(2),
        grossMargin: ((grossProfit / rev) * 100).toFixed(1),
        opex: opex.toFixed(2),
        ebit: ebit.toFixed(2),
        ebitMargin: ((ebit / rev) * 100).toFixed(1),
        netIncome: netIncome.toFixed(2),
        netMargin: ((netIncome / rev) * 100).toFixed(1),
        eps: (netIncome / (Math.random() * 2 + 1)).toFixed(2),
      };
    }),
    balanceSheet: years.map((yr, i) => {
      const totalAssets = baseRevenue * (2.5 + i * 0.3);
      const cash = totalAssets * (0.1 + Math.random() * 0.1);
      const currentAssets = totalAssets * (0.35 + Math.random() * 0.05);
      const totalDebt = totalAssets * (0.2 + Math.random() * 0.1);
      const equity = totalAssets - totalDebt;
      return {
        year: yr,
        totalAssets: totalAssets.toFixed(2),
        cash: cash.toFixed(2),
        currentAssets: currentAssets.toFixed(2),
        totalDebt: totalDebt.toFixed(2),
        equity: equity.toFixed(2),
        debtToEquity: (totalDebt / equity).toFixed(2),
        roe: ((baseRevenue * 0.3 / equity) * 100).toFixed(1),
        roa: ((baseRevenue * 0.3 / totalAssets) * 100).toFixed(1),
      };
    }),
  };
};

const FinancialAnalysis = ({ symbol }) => {
  const [data] = useState(() => generateFinancials(symbol));
  const [activeTab, setActiveTab] = useState('IS');

  const tabs = [
    { id: 'IS', label: 'Income Statement' },
    { id: 'BS', label: 'Balance Sheet' },
    { id: 'CF', label: 'Cash Flow' },
    { id: 'RATIOS', label: 'Key Ratios' },
  ];

  return (
    <div className="panel" style={{ overflow: 'hidden' }}>
      <div className="panel-header">
        <span>FA — {data.asset} FINANCIAL ANALYSIS</span>
        <span className="mono-xs">Annual</span>
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
        {activeTab === 'IS' && (
          <table className="bb-table">
            <thead>
              <tr>
                <th>Line Item (in $B)</th>
                {data.incomeStatement.map(d => <th key={d.year} className="right">{d.year}</th>)}
              </tr>
            </thead>
            <tbody>
              <tr><td className="text-amber" style={{fontWeight:'bold'}}>Revenue</td>
                {data.incomeStatement.map(d => <td key={d.year} className="right text-white" style={{fontWeight:'bold'}}>{d.revenue}</td>)}</tr>
              <tr><td className="text-cyan">Cost of Goods Sold</td>
                {data.incomeStatement.map(d => <td key={d.year} className="right text-down">({d.cogs})</td>)}</tr>
              <tr style={{borderTop:'1px solid var(--border-color)'}}>
                <td className="text-amber" style={{fontWeight:'bold'}}>Gross Profit</td>
                {data.incomeStatement.map(d => <td key={d.year} className="right text-up" style={{fontWeight:'bold'}}>{d.grossProfit}</td>)}</tr>
              <tr><td className="text-grey" style={{paddingLeft:'16px'}}>Gross Margin</td>
                {data.incomeStatement.map(d => <td key={d.year} className="right text-grey">{d.grossMargin}%</td>)}</tr>
              <tr><td className="text-cyan">Operating Expenses</td>
                {data.incomeStatement.map(d => <td key={d.year} className="right text-down">({d.opex})</td>)}</tr>
              <tr style={{borderTop:'1px solid var(--border-color)'}}>
                <td className="text-amber" style={{fontWeight:'bold'}}>EBIT</td>
                {data.incomeStatement.map(d => <td key={d.year} className="right text-up" style={{fontWeight:'bold'}}>{d.ebit}</td>)}</tr>
              <tr><td className="text-grey" style={{paddingLeft:'16px'}}>EBIT Margin</td>
                {data.incomeStatement.map(d => <td key={d.year} className="right text-grey">{d.ebitMargin}%</td>)}</tr>
              <tr style={{borderTop:'2px solid var(--text-amber)'}}>
                <td className="text-amber" style={{fontWeight:'bold', fontSize:'13px'}}>Net Income</td>
                {data.incomeStatement.map(d => <td key={d.year} className="right text-up" style={{fontWeight:'bold', fontSize:'13px'}}>{d.netIncome}</td>)}</tr>
              <tr><td className="text-grey" style={{paddingLeft:'16px'}}>Net Margin</td>
                {data.incomeStatement.map(d => <td key={d.year} className="right text-grey">{d.netMargin}%</td>)}</tr>
              <tr><td className="text-cyan">EPS (Diluted)</td>
                {data.incomeStatement.map(d => <td key={d.year} className="right text-white">${d.eps}</td>)}</tr>
            </tbody>
          </table>
        )}

        {activeTab === 'BS' && (
          <table className="bb-table">
            <thead>
              <tr>
                <th>Line Item (in $B)</th>
                {data.balanceSheet.map(d => <th key={d.year} className="right">{d.year}</th>)}
              </tr>
            </thead>
            <tbody>
              <tr><td className="text-amber" style={{fontWeight:'bold'}}>Total Assets</td>
                {data.balanceSheet.map(d => <td key={d.year} className="right text-white" style={{fontWeight:'bold'}}>{d.totalAssets}</td>)}</tr>
              <tr><td className="text-cyan" style={{paddingLeft:'16px'}}>Cash & Equivalents</td>
                {data.balanceSheet.map(d => <td key={d.year} className="right text-up">{d.cash}</td>)}</tr>
              <tr><td className="text-cyan" style={{paddingLeft:'16px'}}>Current Assets</td>
                {data.balanceSheet.map(d => <td key={d.year} className="right">{d.currentAssets}</td>)}</tr>
              <tr style={{borderTop:'1px solid var(--border-color)'}}>
                <td className="text-amber" style={{fontWeight:'bold'}}>Total Debt</td>
                {data.balanceSheet.map(d => <td key={d.year} className="right text-down">{d.totalDebt}</td>)}</tr>
              <tr style={{borderTop:'2px solid var(--text-amber)'}}>
                <td className="text-amber" style={{fontWeight:'bold', fontSize:'13px'}}>Shareholders' Equity</td>
                {data.balanceSheet.map(d => <td key={d.year} className="right text-up" style={{fontWeight:'bold'}}>{d.equity}</td>)}</tr>
              <tr><td className="text-grey" style={{paddingLeft:'16px'}}>Debt/Equity</td>
                {data.balanceSheet.map(d => <td key={d.year} className="right text-grey">{d.debtToEquity}x</td>)}</tr>
              <tr><td className="text-cyan">Return on Equity</td>
                {data.balanceSheet.map(d => <td key={d.year} className="right">{d.roe}%</td>)}</tr>
              <tr><td className="text-cyan">Return on Assets</td>
                {data.balanceSheet.map(d => <td key={d.year} className="right">{d.roa}%</td>)}</tr>
            </tbody>
          </table>
        )}

        {activeTab === 'CF' && (
          <div style={{ padding: '16px' }}>
            <table className="bb-table">
              <thead>
                <tr>
                  <th>Cash Flow Item (in $B)</th>
                  {data.incomeStatement.map(d => <th key={d.year} className="right">{d.year}</th>)}
                </tr>
              </thead>
              <tbody>
                <tr><td className="text-amber" style={{fontWeight:'bold'}}>Operating Cash Flow</td>
                  {data.incomeStatement.map(d => <td key={d.year} className="right text-up">{(parseFloat(d.netIncome) * 1.2).toFixed(2)}</td>)}</tr>
                <tr><td className="text-cyan">Capital Expenditures</td>
                  {data.incomeStatement.map(d => <td key={d.year} className="right text-down">({(parseFloat(d.revenue) * 0.08).toFixed(2)})</td>)}</tr>
                <tr style={{borderTop:'1px solid var(--border-color)'}}>
                  <td className="text-amber" style={{fontWeight:'bold'}}>Free Cash Flow</td>
                  {data.incomeStatement.map(d => <td key={d.year} className="right text-up" style={{fontWeight:'bold'}}>{(parseFloat(d.netIncome) * 1.2 - parseFloat(d.revenue) * 0.08).toFixed(2)}</td>)}</tr>
                <tr><td className="text-cyan">Dividends Paid</td>
                  {data.incomeStatement.map(d => <td key={d.year} className="right text-down">({(parseFloat(d.netIncome) * 0.3).toFixed(2)})</td>)}</tr>
                <tr><td className="text-cyan">Share Buybacks</td>
                  {data.incomeStatement.map(d => <td key={d.year} className="right text-down">({(parseFloat(d.netIncome) * 0.15).toFixed(2)})</td>)}</tr>
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'RATIOS' && (
          <div style={{ padding: '8px' }}>
            <div className="section-title">VALUATION RATIOS</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '8px' }}>
              {[
                { label: 'P/E Ratio', value: (15 + Math.random() * 20).toFixed(1) + 'x' },
                { label: 'Forward P/E', value: (12 + Math.random() * 15).toFixed(1) + 'x' },
                { label: 'P/B Ratio', value: (2 + Math.random() * 5).toFixed(1) + 'x' },
                { label: 'P/S Ratio', value: (3 + Math.random() * 8).toFixed(1) + 'x' },
                { label: 'EV/EBITDA', value: (10 + Math.random() * 10).toFixed(1) + 'x' },
                { label: 'EV/Revenue', value: (4 + Math.random() * 8).toFixed(1) + 'x' },
                { label: 'Dividend Yield', value: (Math.random() * 3).toFixed(2) + '%' },
                { label: 'Payout Ratio', value: (20 + Math.random() * 40).toFixed(0) + '%' },
              ].map(r => (
                <div key={r.label} className="data-row">
                  <span className="data-label">{r.label}</span>
                  <span className="data-value">{r.value}</span>
                </div>
              ))}
            </div>

            <div className="section-title" style={{ marginTop: '8px' }}>PROFITABILITY</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '8px' }}>
              {[
                { label: 'Gross Margin', value: (50 + Math.random() * 20).toFixed(1) + '%' },
                { label: 'Operating Margin', value: (20 + Math.random() * 20).toFixed(1) + '%' },
                { label: 'Net Margin', value: (10 + Math.random() * 20).toFixed(1) + '%' },
                { label: 'ROE', value: (15 + Math.random() * 20).toFixed(1) + '%' },
                { label: 'ROA', value: (5 + Math.random() * 10).toFixed(1) + '%' },
                { label: 'ROIC', value: (10 + Math.random() * 15).toFixed(1) + '%' },
              ].map(r => (
                <div key={r.label} className="data-row">
                  <span className="data-label">{r.label}</span>
                  <span className="data-value">{r.value}</span>
                </div>
              ))}
            </div>

            <div className="section-title" style={{ marginTop: '8px' }}>LEVERAGE & LIQUIDITY</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', padding: '8px' }}>
              {[
                { label: 'Current Ratio', value: (1 + Math.random() * 2).toFixed(2) + 'x' },
                { label: 'Quick Ratio', value: (0.5 + Math.random() * 1.5).toFixed(2) + 'x' },
                { label: 'Debt/Equity', value: (0.2 + Math.random() * 0.8).toFixed(2) + 'x' },
                { label: 'Interest Coverage', value: (5 + Math.random() * 15).toFixed(1) + 'x' },
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
