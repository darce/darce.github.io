from http.server import BaseHTTPRequestHandler
import json
import urllib.request
import urllib.parse
import urllib.error

# CORS allowed origins
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://darce.xyz",
    "https://www.darce.xyz",
]

# Binance public API (no API key required)
BINANCE_API_URL = "https://api.binance.com/api/v3"
DEFAULT_SYMBOL = "BTCUSDT"
DEFAULT_LIMIT = 20  # Number of price levels (max 5000)


def get_cors_headers(origin: str) -> dict:
    """Get CORS headers based on request origin"""
    headers = {
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json",
    }
    
    # Check if origin is allowed or is a Vercel preview
    if origin in ALLOWED_ORIGINS or (origin and origin.endswith(".vercel.app")):
        headers["Access-Control-Allow-Origin"] = origin
    else:
        # Default to localhost for development
        headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
    
    return headers


def format_orderbook(binance_data: dict, symbol: str) -> dict:
    """
    Transform Binance orderbook format to a cleaner structure.
    Binance returns: {"lastUpdateId": 123, "bids": [["price", "qty"], ...], "asks": [...]}
    We transform to: {"symbol": "BTCUSDT", "bids": [{"price": 123.45, "size": 0.5}, ...], ...}
    """
    def parse_levels(levels):
        return [
            {
                "price": float(level[0]),
                "size": float(level[1])
            }
            for level in levels
        ]
    
    return {
        "symbol": symbol,
        "lastUpdateId": binance_data.get("lastUpdateId"),
        "bids": parse_levels(binance_data.get("bids", [])),
        "asks": parse_levels(binance_data.get("asks", [])),
    }


class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        """Handle CORS preflight requests"""
        origin = self.headers.get("Origin", "")
        cors_headers = get_cors_headers(origin)
        
        self.send_response(200)
        for key, value in cors_headers.items():
            self.send_header(key, value)
        self.end_headers()

    def do_GET(self):
        """Handle GET requests for order book data"""
        origin = self.headers.get("Origin", "")
        cors_headers = get_cors_headers(origin)
        
        # Parse query parameters
        parsed_path = urllib.parse.urlparse(self.path)
        query_params = urllib.parse.parse_qs(parsed_path.query)
        symbol = query_params.get("symbol", [DEFAULT_SYMBOL])[0].upper()
        
        # Validate and parse limit
        try:
            limit = int(query_params.get("limit", [DEFAULT_LIMIT])[0])
            limit = min(max(limit, 1), 100)  # Clamp between 1 and 100
        except ValueError:
            limit = DEFAULT_LIMIT
        
        try:
            # Fetch from Binance public API (no API key needed)
            url = f"{BINANCE_API_URL}/depth?symbol={symbol}&limit={limit}"
            req = urllib.request.Request(
                url,
                headers={"User-Agent": "OrderBook-API/1.0"}
            )
            
            with urllib.request.urlopen(req, timeout=10) as response:
                data = json.loads(response.read().decode())
            
            # Transform to cleaner format
            order_book = format_orderbook(data, symbol)
            
            self.send_response(200)
            for key, value in cors_headers.items():
                self.send_header(key, value)
            self.send_header("Cache-Control", "s-maxage=1, stale-while-revalidate=5")
            self.end_headers()
            self.wfile.write(json.dumps(order_book).encode())
            
        except urllib.error.HTTPError as e:
            error_body = e.read().decode() if e.fp else ""
            try:
                error_data = json.loads(error_body)
                error_msg = error_data.get("msg", f"Binance API error: {e.code}")
            except:
                error_msg = f"Binance API error: {e.code}"
            
            self.send_response(e.code if e.code < 500 else 502)
            for key, value in cors_headers.items():
                self.send_header(key, value)
            self.end_headers()
            self.wfile.write(json.dumps({"error": error_msg}).encode())
            
        except urllib.error.URLError as e:
            self.send_response(503)
            for key, value in cors_headers.items():
                self.send_header(key, value)
            self.end_headers()
            self.wfile.write(json.dumps({"error": "Unable to reach Binance API"}).encode())
            
        except Exception as e:
            self.send_response(500)
            for key, value in cors_headers.items():
                self.send_header(key, value)
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode())
