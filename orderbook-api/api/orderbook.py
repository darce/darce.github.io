from http.server import BaseHTTPRequestHandler
import json
import os
import urllib.request
import urllib.parse
import urllib.error

# CORS allowed origins
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://darce.xyz",
    "https://www.darce.xyz",
]

COINAPI_BASE_URL = "https://rest.coinapi.io/v1"
DEFAULT_SYMBOL = "KRAKEN_SPOT_BTC_USD"


def get_cors_headers(origin: str) -> dict:
    """Get CORS headers based on request origin"""
    headers = {
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Content-Type": "application/json",
    }
    
    # Check if origin is allowed or is a Vercel preview
    if origin in ALLOWED_ORIGINS or origin.endswith(".vercel.app"):
        headers["Access-Control-Allow-Origin"] = origin
    else:
        # Default to localhost for development
        headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
    
    return headers


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
        symbol = query_params.get("symbol", [DEFAULT_SYMBOL])[0]
        
        # Get API key from environment
        api_key = os.environ.get("COINAPI_KEY")
        
        if not api_key:
            self.send_response(500)
            for key, value in cors_headers.items():
                self.send_header(key, value)
            self.end_headers()
            self.wfile.write(json.dumps({"error": "API key not configured"}).encode())
            return
        
        try:
            # Fetch from CoinAPI
            url = f"{COINAPI_BASE_URL}/orderbooks/current?symbol_id={symbol}&limit_levels=50"
            req = urllib.request.Request(url, headers={"X-CoinAPI-Key": api_key})
            
            with urllib.request.urlopen(req, timeout=10) as response:
                data = json.loads(response.read().decode())
            
            # CoinAPI returns an array, get first item
            order_book = data[0] if isinstance(data, list) else data
            
            self.send_response(200)
            for key, value in cors_headers.items():
                self.send_header(key, value)
            self.send_header("Cache-Control", "s-maxage=5, stale-while-revalidate")
            self.end_headers()
            self.wfile.write(json.dumps(order_book).encode())
            
        except urllib.error.HTTPError as e:
            self.send_response(e.code)
            for key, value in cors_headers.items():
                self.send_header(key, value)
            self.end_headers()
            self.wfile.write(json.dumps({"error": f"CoinAPI error: {e.code}"}).encode())
            
        except Exception as e:
            self.send_response(500)
            for key, value in cors_headers.items():
                self.send_header(key, value)
            self.end_headers()
            self.wfile.write(json.dumps({"error": str(e)}).encode())
