import { useState, useEffect, useMemo } from 'react'
import { OrderBookData } from '../../../types'
import { useWebSocket } from './useWebSocket'

const BINANCE_WS_URL = 'wss://stream.binance.com:9443/ws'

/**
 * Parse Binance WebSocket message into OrderBookData
 *
 * Binance sends depth updates in this format:
 * {
 *   "lastUpdateId": 160,
 *   "bids": [["0.0024", "10"], ["0.0023", "5"]],
 *   "asks": [["0.0025", "8"], ["0.0026", "12"]]
 * }
 *
 * We transform to: { symbol, lastUpdateId, bids: [{price, size}], asks: [{price, size}] }
 *
 * Binance uses "b"/"a" shorthand in some stream types and "bids"/"asks" in others.
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

const buildBinanceWsUrl = (symbol: string, depthLevels: number = 20, updateSpeed: number = 100): string => {
    const streamName = `${symbol.toLowerCase()}@depth${depthLevels}@${updateSpeed}ms`
    return `${BINANCE_WS_URL}/${streamName}`
}

export interface UseOrderBookOptions {
    /** Initial symbol to fetch */
    initialSymbol?: string
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
    refresh: () => void
}

/**
 * Custom hook for real-time order book data via Binance WebSocket.
 * Connects directly to Binance's public WebSocket stream — no proxy needed.
 */
export function useOrderBook({
    initialSymbol = 'XRPUSDT',
    enabled = true
}: UseOrderBookOptions = {}): UseOrderBookResult {
    const [symbol, setSymbol] = useState(initialSymbol)
    const [loading, setLoading] = useState(true)

    const wsUrl = useMemo(() => buildBinanceWsUrl(symbol), [symbol])
    const parseMessage = useMemo(() => parseBinanceMessage(symbol), [symbol])

    const {
        data,
        isConnected,
        error,
        reconnect
    } = useWebSocket<OrderBookData>({
        url: wsUrl,
        enabled,
        parseMessage
    })

    useEffect(() => {
        if (data) {
            setLoading(false)
        }
    }, [data])

    // Reset loading state when symbol changes
    useEffect(() => {
        setLoading(true)
    }, [symbol])

    return {
        data,
        loading,
        error,
        isConnected,
        symbol,
        setSymbol,
        refresh: reconnect
    }
}
