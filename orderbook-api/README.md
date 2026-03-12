# Orderbook API (Vercel Python)

Serverless proxy endpoint for Binance orderbook data used by the frontend.

## Endpoint

### `GET /api/orderbook`

Query parameters:
- `symbol` (optional, default: `BTCUSDT`)
- `limit` (optional, default: `20`, clamped to `1..100`)

Example:

```bash
curl "https://your-vercel-app.vercel.app/api/orderbook?symbol=BTCUSDT&limit=20"
```

Response shape:

```json
{
  "symbol": "BTCUSDT",
  "lastUpdateId": 123456789,
  "bids": [{ "price": 61234.1, "size": 0.42 }],
  "asks": [{ "price": 61235.2, "size": 0.37 }]
}
```

## CORS

Allowed origins:
- `http://localhost:3000`
- `https://darce.xyz`
- `https://www.darce.xyz`
- `https://*.vercel.app`

The API echoes `Access-Control-Allow-Origin` only for allowed origins.

## Deployment

CI deploys this service via `.github/workflows/deploy-api.yml`.

## Local

```bash
vercel dev
```
