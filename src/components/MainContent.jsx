import React from 'react';
import OrderBook from './OrderBook';
import ChartWidget from './ChartWidget';
import MapWidget from './MapWidget';
import StatsWidget from './StatsWidget';
import TopNews from './TopNews';
import WorldEquity from './WorldEquity';
import FinancialAnalysis from './FinancialAnalysis';
import HistoricalPrice from './HistoricalPrice';
import IntradayChart from './IntradayChart';
import Watchlist from './Watchlist';
import TimeSales from './TimeSales';

const MainContent = ({ activeView, activeSymbol, latestTrade, setLatestTrade, navigateTo }) => {
  const renderView = () => {
    switch (activeView) {
      case 'DES':
        return (
          <div className="main-content layout-des">
            <OrderBook symbol={activeSymbol} onNewTrade={setLatestTrade} />
            <ChartWidget symbol={activeSymbol} />
            <MapWidget latestTrade={latestTrade} />
            <StatsWidget symbol={activeSymbol} />
          </div>
        );

      case 'TOP':
        return (
          <div className="main-content layout-top">
            <TopNews symbol={activeSymbol} navigateTo={navigateTo} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <Watchlist navigateTo={navigateTo} />
            </div>
          </div>
        );

      case 'WEI':
        return (
          <div className="main-content layout-wei">
            <WorldEquity navigateTo={navigateTo} />
          </div>
        );

      case 'FA':
        return (
          <div className="main-content layout-fa">
            <FinancialAnalysis symbol={activeSymbol} />
            <ChartWidget symbol={activeSymbol} />
          </div>
        );

      case 'HP':
        return (
          <div className="main-content layout-hp">
            <HistoricalPrice symbol={activeSymbol} />
          </div>
        );

      case 'GIP':
        return (
          <div className="main-content layout-gip">
            <TimeSales symbol={activeSymbol} />
            <IntradayChart symbol={activeSymbol} />
          </div>
        );

      case 'TLKR':
        return (
          <div className="main-content layout-tlkr">
            <Watchlist navigateTo={navigateTo} fullScreen />
          </div>
        );

      default:
        return (
          <div className="main-content layout-des">
            <OrderBook symbol={activeSymbol} onNewTrade={setLatestTrade} />
            <ChartWidget symbol={activeSymbol} />
            <MapWidget latestTrade={latestTrade} />
            <StatsWidget symbol={activeSymbol} />
          </div>
        );
    }
  };

  return renderView();
};

export default MainContent;
