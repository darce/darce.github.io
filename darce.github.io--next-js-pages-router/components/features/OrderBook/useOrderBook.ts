import { useState, useEffect, useCallback, useRef } from 'react'
import { OrderBookData } from '../../../types'

// API URLs
const BINANCE_API_URL = 'https://api.binance.com/api/v3'
const BINANCE_WS_URL = 'wss://stream.binance.com:9443/ws'
const PROXY_API_URL = process.env.NEXT_PUBLIC_ORDERBOOK_API_URL || ''

export interface UseOrderBookOptions {
    /** Initial symbol to fetch */
    initialSymbol?: string
    /** API base URL for proxy (optional) */
    apiBaseUrl?: string
    /** Update mode: 'websocket' for real-time, 'polling' for REST API polling */
    updateMode?: 'websocket' | 'polling'
    /** Polling interval in ms (only used when updateMode is 'polling') */
    pollInterval?: number
}

export interface UseOrderBookResult {
    data: OrderBookData | null
    loading: boolean
    error: string | null
    isConnected: boolean
    symbol: string
    setSymbol: (symbol: string) => void
    refresh: () => Promise<void>
}

/**
 * Custom hook for fetching and managing order book data
 * Supports both WebSocket (real-time) and REST API (polling) modes
 */
export function useOrderBook({
    initialSymbol = 'XRPUSDT',
    apiBaseUrl,
    updateMode = 'websocket',
    pollInterval = 1000
}: UseOrderBookOptions = {}): UseOrderBookResult {
    const [symbol, setSymbol] = useState(initialSymbol)
    const [data, setData] = useState<OrderBookData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isConnected, setIsConnected] = useState(false)
    const wsRef = useRef<WebSocket | null>(null)
    const symbolRef = useRef(symbol)

    // Keep symbolRef in sync with symbol state
    useEffect(() => {
        symbolRef.current = symbol
    }, [symbol])

    // Parse WebSocket message and update state
    const handleWsMessage = useCallback((event: MessageEvent) => {
        try {
            const wsData = JSON.parse(event.data)
            // Binance depth stream format - use ref to avoid stale closure
            const currentSymbol = symbolRef.current
            const orderBookData: OrderBookData = {
                symbol: currentSymbol,
                lastUpdateId: wsData.lastUpdateId || wsData.u,
                bids: (wsData.bids || wsData.b || []).map((b: string[]) => ({
                    price: parseFloat(b[0]),
                    size: parseFloat(b[1])
                })),
                asks: (wsData.asks || wsData.a || []).map((a: string[]) => ({
                    price: parseFloat(a[0]),
                    size: parseFloat(a[1])
                })),
            }
            setData(orderBookData)
            setLoading(false)
        } catch (err) {
            console.error('WebSocket message parse error:', err)
        }
    }, []) // No dependencies - uses ref for symbol

    // Connect to WebSocket
    const connectWebSocket = useCallback(() => {
        // Mark that we're intentionally reconnecting (don't flash "Connecting" status)
        const isReconnecting = wsRef.current?.readyState === WebSocket.OPEN
        
        if (wsRef.current) {
            // Remove the onclose handler before closing to prevent status flash
            wsRef.current.onclose = null
            wsRef.current.close()
        }

        const streamName = `${symbol.toLowerCase()}@depth20@100ms`
        const ws = new WebSocket(`${BINANCE_WS_URL}/${streamName}`)

        ws.onopen = () => {
            setIsConnected(true)
            setError(null)
            setLoading(false)
        }

        ws.onmessage = handleWsMessage

        ws.onerror = () => {
            setError('WebSocket connection error')
            setIsConnected(false)
        }

        ws.onclose = () => {
            // Only set disconnected if this is the current WebSocket
            if (wsRef.current === ws) {
                setIsConnected(false)
            }
        }

        wsRef.current = ws
    }, [symbol, handleWsMessage])

    const fetchOrderBook = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            // Use proxy API if provided, otherwise call Binance directly
            const url = apiBaseUrl || PROXY_API_URL
                ? `${apiBaseUrl || PROXY_API_URL}/api/orderbook?symbol=${symbol}`
                : `${BINANCE_API_URL}/depth?symbol=${symbol}&limit=20`

            const response = await fetch(url)

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || errorData.msg || 'Failed to fetch order book')
            }

            const rawData = await response.json()

            // Transform Binance format if calling directly
            const orderBookData: OrderBookData = rawData.bids && Array.isArray(rawData.bids[0])
                ? {
                    symbol,
                    lastUpdateId: rawData.lastUpdateId,
                    bids: rawData.bids.map((b: string[]) => ({ price: parseFloat(b[0]), size: parseFloat(b[1]) })),
                    asks: rawData.asks.map((a: string[]) => ({ price: parseFloat(a[0]), size: parseFloat(a[1]) })),
                }
                : rawData

            setData(orderBookData)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
            setLoading(false)
        }
    }, [symbol, apiBaseUrl])

    // WebSocket mode: connect on mount and when symbol changes
    useEffect(() => {
        if (updateMode === 'websocket') {
            connectWebSocket()

            return () => {
                if (wsRef.current) {
                    wsRef.current.close()
                }
            }
        }
    }, [updateMode, connectWebSocket])

    // Polling mode: fetch periodically
    useEffect(() => {
        if (updateMode === 'polling') {
            fetchOrderBook()
            const interval = setInterval(fetchOrderBook, pollInterval)
            return () => clearInterval(interval)
        }
    }, [updateMode, fetchOrderBook, pollInterval])

    // Initial fetch for both modes (WebSocket needs initial data while connecting)
    useEffect(() => {
        if (updateMode === 'websocket' && !data) {
            fetchOrderBook()
        }
    }, [updateMode, data, fetchOrderBook])

    return {
        data,
        loading,
        error,
        isConnected,
        symbol,
        setSymbol,
        refresh: fetchOrderBook
    }
}
