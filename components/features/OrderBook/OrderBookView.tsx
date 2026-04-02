import React, { useMemo } from 'react'
import { Box } from '@radix-ui/themes'
import { OrderBookData, OrderBookMetrics, OrderBookEntry } from '../../../types'
import {
  SymbolSelector,
  MetricsCards,
  DepthChart,
  OrderTables,
  ConnectionStatus
} from './components'
import styles from './OrderBook.module.scss'

// Re-export SYMBOLS for backward compatibility
export { SYMBOLS } from './components'

const SIGNIFICANT_SIZE_THRESHOLD = 1

export interface OrderBookViewProps {
  className?: string
  data: OrderBookData
  symbol: string
  loading: boolean
  isConnected: boolean
  showConnectionStatus?: boolean
  onSymbolChange: (symbol: string) => void
  onRefresh: () => void
}

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
 * Orchestrator component for the order book display
 * Composes smaller display components
 */
const OrderBookView: React.FC<OrderBookViewProps> = ({
  className,
  data,
  symbol,
  loading,
  isConnected,
  showConnectionStatus = false,
  onSymbolChange,
  onRefresh
}) => {
  const metrics = useMemo(() => calculateMetrics(data), [data])

  return (
    <Box className={`${styles.orderBook} ${className || ''}`}>
      <SymbolSelector
        symbol={symbol}
        loading={loading}
        onSymbolChange={onSymbolChange}
        onRefresh={onRefresh}
      />

      <MetricsCards
        bestBid={metrics.bestBid}
        bestAsk={metrics.bestAsk}
        spread={metrics.spread}
        orderImbalance={metrics.orderImbalance}
      />

      <DepthChart bids={data.bids} asks={data.asks} />

      <OrderTables bids={data.bids} asks={data.asks} />

      <ConnectionStatus
        symbol={data.symbol}
        lastUpdateId={data.lastUpdateId}
        isConnected={isConnected}
        showConnectionStatus={showConnectionStatus}
      />
    </Box>
  )
}

export default OrderBookView
