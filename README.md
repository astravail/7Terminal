# 7Terminal — Bloomberg Terminal Clone

7Terminal is a high-performance, real-time financial data terminal clone built with React, Vite, and WebSockets. It replicates the iconic Bloomberg Terminal interface, providing professional-grade market data visualization, news feeds, and financial analysis tools.

## 🚀 Key Features

- **Real-Time Data**: Powered by Binance WebSockets and REST APIs for sub-second price updates and live order book data.
- **Bloomberg-Authentic UI**: Replicates the classic terminal aesthetic, including:
    - **Yellow Sector Keys** (F2–F12) for market sector navigation.
    - **Command Line** with autocomplete for functions and tickers.
    - **Amber Fields** and high-contrast terminal typography.
    - **Multi-Panel Layouts** that change dynamically based on the active function.
- **Comprehensive Financial Tools**:
    - `DES` (Description): Default multi-panel view with Order Book, Charts, and Stats.
    - `TOP` (Top News): Curated global and company-specific news feeds.
    - `WEI` (World Equity Index): Real-time monitor for 23+ global indices.
    - `FA` (Financial Analysis): Interactive Income Statements, Balance Sheets, and Ratios.
    - `HP` (Historical Price): Detailed OHLCV historical data tables.
    - `GIP` (Intraday Price): Live intraday charts with VWAP and Time & Sales.
    - `TLKR` (Ticker Monitor): Full-screen sortable watchlist.
- **Interactive Help System**: Type `HELP <GO>` to access a comprehensive manual of commands and shortcuts.

## 🛠 Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 6](https://vitejs.dev/)
- **Data Fetching**: WebSockets (Binance Stream) & Fetch API
- **Charts**: [Recharts](https://recharts.org/)
- **Maps**: [React Leaflet](https://react-leaflet.js.org/)
- **Styling**: Vanilla CSS (Terminal Design System)

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/piotrhusak/7Terminal.git
   cd 7Terminal
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to `http://localhost:5173`

## ⌨️ Command Reference

Type any of the following in the command line and press **Enter** (or click **GO**):

| Command | Function | Description |
|:---|:---|:---|
| `DES` | Description | Comprehensive overview of the loaded security |
| `TOP` | Top News | Main page for top worldwide headlines |
| `WEI` | World Equity | Global market index monitor |
| `FA` | Financials | Detailed company financial statements |
| `HP` | Hist. Price | Tabular historical pricing data |
| `GIP` | Intraday | Live intraday price graph |
| `TLKR` | Watchlist | Full-screen ticker monitor |
| `BACK` | Back | Return to the previous screen |
| `HELP` | Help | Open the system user manual |

## ⚖️ Disclaimer

This project is for educational and demonstration purposes only. It is not an official Bloomberg product. Real-time equity data (e.g., NYSE) often requires expensive licenses; therefore, this terminal utilizes digital asset (crypto) feeds to demonstrate high-frequency functionality without interruptions.

---

Built by [Piotr Husak](https://github.com/piotrhusak)
