import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { OrderBookData, OrderBookEntry, OrderBookMetrics } from '../../../types'
import styles from './OrderBook.module.scss'

interface OrderBookProps {
    className?: string
    apiBaseUrl?: string
}

// API base URL - can be overridden via props or environment variable
const DEFAULT_API_URL = process.env.NEXT_PUBLIC_ORDERBOOK_API_URL || 'https://orderbook-api.vercel.app'

const SYMBOLS = [
    { id: 'KRAKEN_SPOT_BTC_USD', label: 'BTC/USD (Kraken)' },
    { id: 'KRAKEN_SPOT_ETH_USD', label: 'ETH/USD (Kraken)' },
    { id: 'COINBASE_SPOT_BTC_USD', label: 'BTC/USD (Coinbase)' },
    { id: 'BINANCE_SPOT_BTC_USDT', label: 'BTC/USDT (Binance)' },
]

const SIGNIFICANT_SIZE_THRESHOLD = 1 // Size threshold for significant orders

/**
 * Calculate order book metrics from raw data
 */
const calculateMetrics = (data: OrderBookData): OrderBookMetrics => {
    const bids = data.bids || []
    const asks = data.asks || []

    const totalBidVolume = bids.reduce((sum, entry) => sum + entry.size, 0)
    const totalAskVolume = asks.reduce((sum, entry) => sum + entry.size, 0)

    const bestBid = bids.length > 0 ? bids[0].price : 0
    const bestAsk = asks.length > 0 ? asks[0].price : 0

    const spread = bestAsk - bestBid
    const orderImbalance = (totalBidVolume - totalAskVolume) / (totalBidVolume + totalAskVolume)

    const significantBids = bids.filter(entry => entry.size > SIGNIFICANT_SIZE_THRESHOLD)
    const significantAsks = asks.filter(entry => entry.size > SIGNIFICANT_SIZE_THRESHOLD)

    return {
        spread,
        orderImbalance,
        significantBids,
        significantAsks,
        bestBid,
        bestAsk,
        totalBidVolume,
        totalAskVolume,
    }
}

/**
 * Format price with appropriate decimal places
 */
const formatPrice = (price: number): string => {
    if (price >= 1000) {
        return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    }
    return price.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })
}

/**
 * Format size/volume
 */
const formatSize = (size: number): string => {
    return size.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })
}

const OrderBook: React.FC<OrderBookProps> = ({ className, apiBaseUrl }) => {
    const [symbol, setSymbol] = useState(SYMBOLS[0].id)
    const [data, setData] = useState<OrderBookData | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const baseUrl = apiBaseUrl || DEFAULT_API_URL

    const fetchOrderBook = useCallback(async () => {
        setLoading(true)
        setError(null)

        try {
            const response = await fetch(`${baseUrl}/api/orderbook?symbol=${symbol}`)

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Failed to fetch order book')
            }

            const orderBookData: OrderBookData = await response.json()
            setData(orderBookData)
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
            setLoading(false)
        }
    }, [symbol, baseUrl])

    useEffect(() => {
        fetchOrderBook()

        // Auto-refresh every 30 seconds
        const interval = setInterval(fetchOrderBook, 30000)
        return () => clearInterval(interval)
    }, [fetchOrderBook])

    const metrics = useMemo(() => {
        if (!data) return null
        return calculateMetrics(data)
    }, [data])

    // Get top N levels for visualization
    const displayLevels = useMemo(() => {
        if (!data) return { bids: [], asks: [], maxSize: 0 }

        const maxLevels = 15
        const bids = data.bids.slice(0, maxLevels)
        const asks = data.asks.slice(0, maxLevels)

        // Find max size for scaling bars
        const allSizes = [...bids.map(b => b.size), ...asks.map(a => a.size)]
        const maxSize = allSizes.length > 0 ? Math.max(...allSizes) : 1

        return { bids, asks, maxSize }
    }, [data])

    if (loading && !data) {
        return (
            <div className={`${styles.orderBook} ${className || ''}`}>
                <div className={styles.loading}>Loading order book data...</div>
            </div>
        )
    }

    if (error) {
        return (
            <div className={`${styles.orderBook} ${className || ''}`}>
                <div className={styles.error}>
                    <strong>Error:</strong> {error}
                    <br />
                    <small>Make sure COINAPI_KEY is set in your environment variables.</small>
                </div>
            </div>
        )
    }

    if (!data || !metrics) {
        return null
    }

    return (
        <div className={`${styles.orderBook} ${className || ''}`}>
            <div className={styles.header}>
                <select
                    className={styles.symbolSelect}
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                >
                    {SYMBOLS.map(s => (
                        <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                </select>
                <button
                    className={styles.refreshButton}
                    onClick={fetchOrderBook}
                    disabled={loading}
                >
                    {loading ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>

            {/* Metrics Cards */}
            <div className={styles.metrics}>
                <div className={styles.metricCard}>
                    <div className={styles.metricLabel}>Best Bid</div>
                    <div className={`${styles.metricValue} ${styles.positive}`}>
                        ${formatPrice(metrics.bestBid)}
                    </div>
                </div>
                <div className={styles.metricCard}>
                    <div className={styles.metricLabel}>Best Ask</div>
                    <div className={`${styles.metricValue} ${styles.negative}`}>
                        ${formatPrice(metrics.bestAsk)}
                    </div>
                </div>
                <div className={styles.metricCard}>
                    <div className={styles.metricLabel}>Spread</div>
                    <div className={styles.metricValue}>
                        ${formatPrice(metrics.spread)}
                    </div>
                </div>
                <div className={styles.metricCard}>
                    <div className={styles.metricLabel}>Order Imbalance</div>
                    <div className={`${styles.metricValue} ${metrics.orderImbalance >= 0 ? styles.positive : styles.negative}`}>
                        {(metrics.orderImbalance * 100).toFixed(2)}%
                    </div>
                </div>
            </div>

            {/* Depth Visualization */}
            <div className={styles.chartContainer}>
                <h3 className={styles.chartTitle}>Order Book Depth</h3>
                <div className={styles.depthChart}>
                    {displayLevels.bids.map((bid, index) => {
                        const ask = displayLevels.asks[index]
                        const bidWidth = (bid.size / displayLevels.maxSize) * 100
                        const askWidth = ask ? (ask.size / displayLevels.maxSize) * 100 : 0

                        return (
                            <div key={index} className={styles.depthRow}>
                                <div
                                    className={styles.bidBar}
                                    style={{ width: `${bidWidth}%`, marginLeft: 'auto' }}
                                >
                                    <span className={styles.sizeText}>{formatSize(bid.size)}</span>
                                </div>
                                <div className={styles.priceColumn}>
                                    <span className={styles.positive}>${formatPrice(bid.price)}</span>
                                    {ask && (
                                        <>
                                            {' | '}
                                            <span className={styles.negative}>${formatPrice(ask.price)}</span>
                                        </>
                                    )}
                                </div>
                                {ask && (
                                    <div
                                        className={styles.askBar}
                                        style={{ width: `${askWidth}%` }}
                                    >
                                        <span className={styles.sizeText}>{formatSize(ask.size)}</span>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Order Tables */}
            <div className={styles.orderTable}>
                <div className={`${styles.orderColumn} ${styles.bidsColumn}`}>
                    <h4>Bids (Buyers)</h4>
                    <div className={styles.orderList}>
                        {data.bids.slice(0, 20).map((bid, index) => (
                            <div key={index} className={`${styles.orderRow} ${styles.bidRow}`}>
                                <span>${formatPrice(bid.price)}</span>
                                <span>{formatSize(bid.size)}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className={`${styles.orderColumn} ${styles.asksColumn}`}>
                    <h4>Asks (Sellers)</h4>
                    <div className={styles.orderList}>
                        {data.asks.slice(0, 20).map((ask, index) => (
                            <div key={index} className={`${styles.orderRow} ${styles.askRow}`}>
                                <span>${formatPrice(ask.price)}</span>
                                <span>{formatSize(ask.size)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Timestamp */}
            <div className={styles.timestamp}>
                Last updated: {new Date(data.time_coinapi).toLocaleString()}
            </div>
        </div>
    )
}

export default OrderBook
