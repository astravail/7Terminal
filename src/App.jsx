import React, { useState, useCallback } from 'react';
import Toolbar from './components/Toolbar';
import CommandLine from './components/CommandLine';
import SummaryBar from './components/SummaryBar';
import MainContent from './components/MainContent';
import NewsTicker from './components/NewsTicker';
import Footer from './components/Footer';

function App() {
  const [activeSymbol, setActiveSymbol] = useState('BTCUSDT');
  const [activeView, setActiveView] = useState('DES');
  const [latestTrade, setLatestTrade] = useState(null);
  const [viewHistory, setViewHistory] = useState(['DES']);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message) => {
    setToast(message);
    setTimeout(() => setToast(null), 2000);
  }, []);

  const navigateTo = useCallback((view) => {
    setViewHistory(prev => [...prev, view]);
    setActiveView(view);
  }, []);

  const goBack = useCallback(() => {
    setViewHistory(prev => {
      if (prev.length <= 1) return prev;
      const newHistory = prev.slice(0, -1);
      setActiveView(newHistory[newHistory.length - 1]);
      return newHistory;
    });
  }, []);

  return (
    <div className="app-container">
      <Toolbar navigateTo={navigateTo} showToast={showToast} goBack={goBack} />
      <CommandLine 
        activeSymbol={activeSymbol} 
        setActiveSymbol={setActiveSymbol}
        activeView={activeView}
        navigateTo={navigateTo}
        goBack={goBack}
        showToast={showToast}
      />
      <SummaryBar symbol={activeSymbol} activeView={activeView} />
      <MainContent 
        activeView={activeView}
        activeSymbol={activeSymbol}
        latestTrade={latestTrade}
        setLatestTrade={setLatestTrade}
        navigateTo={navigateTo}
      />
      <NewsTicker symbol={activeSymbol} />
      <Footer activeView={activeView} navigateTo={navigateTo} />
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

export default App;
