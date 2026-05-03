import React, { useState } from 'react';
import CommandLine from './components/CommandLine';
import SummaryBar from './components/SummaryBar';
import OrderBook from './components/OrderBook';
import MapWidget from './components/MapWidget';
import ChartWidget from './components/ChartWidget';
import NewsFeed from './components/NewsFeed';
import StatsWidget from './components/StatsWidget';
import Footer from './components/Footer';

function App() {
  const [activeSymbol, setActiveSymbol] = useState('BTCUSDT');
  const [latestTrade, setLatestTrade] = useState(null);

  return (
    <div className="app-container">
      <CommandLine activeSymbol={activeSymbol} setActiveSymbol={setActiveSymbol} />
      <SummaryBar symbol={activeSymbol} />
      
      <OrderBook symbol={activeSymbol} onNewTrade={setLatestTrade} />
      <ChartWidget symbol={activeSymbol} />
      <MapWidget latestTrade={latestTrade} />
      <StatsWidget symbol={activeSymbol} />
      
      <NewsFeed symbol={activeSymbol} />
      <Footer />
    </div>
  );
}

export default App;
