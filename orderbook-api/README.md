# Orderbook API - Vercel Python Backend

A serverless Python API for fetching cryptocurrency order book data from CoinAPI.

## Overview

This backend service provides a proxy endpoint for fetching real-time order book data from CoinAPI. It's designed to be deployed on Vercel as a serverless function.

## Endpoints

### GET /api/orderbook

Fetches current order book data for a cryptocurrency trading pair.

**Query Parameters:**
- `symbol` (optional): Trading pair symbol (default: `KRAKEN_SPOT_BTC_USD`)

**Example Request:**
```bash
curl "https://your-vercel-app.vercel.app/api/orderbook?symbol=KRAKEN_SPOT_BTC_USD"
```

**Example Response:**
```json
{
  "symbol_id": "KRAKEN_SPOT_BTC_USD",
  "time_exchange": "2024-01-15T10:30:00.000Z",
  "time_coinapi": "2024-01-15T10:30:00.000Z",
  "asks": [
    {"price": 42000.50, "size": 1.5},
    {"price": 42001.00, "size": 2.3}
  ],
  "bids": [
    {"price": 42000.00, "size": 1.2},
    {"price": 41999.50, "size": 3.1}
  ]
}
```

## Setup

### 1. Clone and Install

```bash
git clone https://github.com/YOUR_USERNAME/orderbook-api.git
cd orderbook-api
pip install -r requirements.txt
```

### 2. Environment Variables

Create a `.env` file or set in Vercel dashboard:

```
COINAPI_KEY=your_coinapi_key_here
```

### 3. Local Development

```bash
vercel dev
```

### 4. Deploy to Vercel

```bash
vercel --prod
```

Or connect the GitHub repository to Vercel for automatic deployments.

## Configuration

### Supported Symbols

- `KRAKEN_SPOT_BTC_USD` - Bitcoin/USD on Kraken
- `KRAKEN_SPOT_ETH_USD` - Ethereum/USD on Kraken
- `COINBASE_SPOT_BTC_USD` - Bitcoin/USD on Coinbase
- `BINANCE_SPOT_BTC_USDT` - Bitcoin/USDT on Binance

See [CoinAPI documentation](https://docs.coinapi.io/) for more available symbols.

## CORS

The API is configured to allow requests from:
- `http://localhost:3000` (development)
- `https://darce.xyz` (production)
- `https://*.vercel.app` (Vercel previews)

## License

MIT
