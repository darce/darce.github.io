import { useState, useEffect, useCallback, useMemo } from 'react'
import { OrderBookData } from '../../../types'
import { useWebSocket } from './useWebSocket'

// API URLs
const BINANCE_API_URL = 'https://api.binance.com/api/v3'
const BINANCE_WS_URL = 'wss://stream.binance.com:9443/ws'
const PROXY_API_URL = process.env.NEXT_PUBLIC_ORDERBOOK_API_URL || ''

/**
 * Parse Binance WebSocket message into OrderBookData
 */
const parseBinanceMessage = (symbol: string) => (event: MessageEvent): OrderBookData | null => {
    try {
        const wsData = JSON.parse(event.data)
        return {
            symbol,
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
    } catch {
        return null
    }
}

/**
 * Build Binance WebSocket URL for order book depth stream
 */
const buildBinanceWsUrl = (symbol: string, depthLevels: number = 20, updateSpeed: number = 100): string => {
    const streamName = `${symbol.toLowerCase()}@depth${depthLevels}@${updateSpeed}ms`
    return `${BINANCE_WS_URL}/${streamName}`
}

export interface UseOrderBookOptions {
    /** Initial symbol to fetch */
    initialSymbol?: string
    /** API base URL for proxy (optional) */
    apiBaseUrl?: string
    /** Update mode: 'websocket' for real-time, 'polling' for REST API polling */
    updateMode?: 'websocket' | 'polling'
    /** Polling interval in ms (only used when updateMode is 'polling') */
    pollInterval?: number
    /** Whether the hook is enabled (default: true). Set to false to disable all data fetching. */
    enabled?: boolean
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
    pollInterval = 1000,
    enabled = true
}: UseOrderBookOptions = {}): UseOrderBookResult {
    const [symbol, setSymbol] = useState(initialSymbol)
    const [restData, setRestData] = useState<OrderBookData | null>(null)
    const [loading, setLoading] = useState(true)
    const [restError, setRestError] = useState<string | null>(null)

    // Memoize WebSocket URL and parser to prevent unnecessary reconnections
    const wsUrl = useMemo(() => buildBinanceWsUrl(symbol), [symbol])
    const parseMessage = useMemo(() => parseBinanceMessage(symbol), [symbol])

    // WebSocket connection (only active in websocket mode and when hook is enabled)
    const {
        data: wsData,
        isConnected,
        error: wsError
    } = useWebSocket<OrderBookData>({
        url: wsUrl,
        enabled: enabled && updateMode === 'websocket',
        parseMessage
    })

    // Use WebSocket data when available, fall back to REST data
    const data = updateMode === 'websocket' ? (wsData || restData) : restData
    const error = updateMode === 'websocket' ? wsError : restError

    // Update loading state when WebSocket data arrives
    useEffect(() => {
        if (wsData) {
            setLoading(false)
        }
    }, [wsData])

    const fetchOrderBook = useCallback(async () => {
        setLoading(true)
        setRestError(null)

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

            setRestData(orderBookData)
        } catch (err) {
            setRestError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
            setLoading(false)
        }
    }, [symbol, apiBaseUrl])

    // Polling mode: fetch periodically (only when enabled)
    useEffect(() => {
        if (enabled && updateMode === 'polling') {
            fetchOrderBook()
            const interval = setInterval(fetchOrderBook, pollInterval)
            return () => clearInterval(interval)
        }
    }, [enabled, updateMode, fetchOrderBook, pollInterval])

    // Initial fetch for WebSocket mode (provides data while connecting)
    useEffect(() => {
        if (enabled && updateMode === 'websocket' && !wsData && !restData) {
            fetchOrderBook()
        }
    }, [enabled, updateMode, wsData, restData, fetchOrderBook])

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
