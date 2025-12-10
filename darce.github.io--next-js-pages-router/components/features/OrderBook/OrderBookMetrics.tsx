import React, { createContext, useContext, ReactNode, useState, useCallback } from 'react'
import { useOrderBook } from './useOrderBook'
import { MetricCard, formatPrice } from './components/MetricsCards'
import { OrderBookData } from '../../../types'

export interface OrderBookMetricProps {
  /** Trading symbol - only needed if NOT inside OrderBookProvider */
  symbol?: string
  className?: string
}

/**
 * Context for sharing order book data AND symbol state between components
 * This prevents multiple WebSocket connections and keeps symbols in sync
 */
interface OrderBookContextValue {
  data: OrderBookData | null
  symbol: string
  setSymbol: (symbol: string) => void
  loading: boolean
  isConnected: boolean
  refresh: () => void
}

const OrderBookContext = createContext<OrderBookContextValue | null>(null)

/**
 * Hook to access the shared OrderBook context
 */
export const useOrderBookContext = () => useContext(OrderBookContext)

/**
 * Provider that shares a single WebSocket connection and symbol state
 * All OrderBook components and inline metrics inside this will stay in sync
 */
export const OrderBookProvider: React.FC<{
  initialSymbol?: string
  children: ReactNode
}> = ({ initialSymbol = 'XRPUSDT', children }) => {
  const { data, loading, isConnected, symbol, setSymbol, refresh } = useOrderBook({
    initialSymbol
  })

  return (
    <OrderBookContext.Provider value={{ data, symbol, setSymbol, loading, isConnected, refresh }}>
      {children}
    </OrderBookContext.Provider>
  )
}

/**
 * Hook to get order book data - from context if available, otherwise creates own connection
 */
const useOrderBookData = (propSymbol?: string): { data: OrderBookData | null } => {
  const context = useContext(OrderBookContext)

  // If we're inside a provider, use shared data (ignore propSymbol)
  if (context) {
    return { data: context.data }
  }

  // Otherwise, create our own connection (standalone usage)
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { data } = useOrderBook({ initialSymbol: propSymbol ?? 'XRPUSDT' })
  return { data }
}

/**
 * Live Best Bid display
 */
export const BestBid: React.FC<OrderBookMetricProps> = ({ symbol, className }) => {
  const { data } = useOrderBookData(symbol)
  const bestBid = data?.bids?.[0]?.price ?? 0

  return (
    <MetricCard
      label="Best Bid"
      value={`$${formatPrice(bestBid)}`}
      color="green"
      className={className}
    />
  )
}

/**
 * Live Best Ask display
 */
export const BestAsk: React.FC<OrderBookMetricProps> = ({ symbol, className }) => {
  const { data } = useOrderBookData(symbol)
  const bestAsk = data?.asks?.[0]?.price ?? 0

  return (
    <MetricCard
      label="Best Ask"
      value={`$${formatPrice(bestAsk)}`}
      color="red"
      className={className}
    />
  )
}

/**
 * Live Spread display
 */
export const Spread: React.FC<OrderBookMetricProps> = ({ symbol, className }) => {
  const { data } = useOrderBookData(symbol)
  const bestBid = data?.bids?.[0]?.price ?? 0
  const bestAsk = data?.asks?.[0]?.price ?? 0
  const spread = bestAsk - bestBid

  return (
    <MetricCard
      label="Spread"
      value={`$${formatPrice(spread)}`}
      className={className}
    />
  )
}

/**
 * Live Order Imbalance display
 */
export const OrderImbalance: React.FC<OrderBookMetricProps> = ({ symbol, className }) => {
  const { data } = useOrderBookData(symbol)

  const bids = data?.bids ?? []
  const asks = data?.asks ?? []
  const totalBidVolume = bids.reduce((sum, entry) => sum + entry.size, 0)
  const totalAskVolume = asks.reduce((sum, entry) => sum + entry.size, 0)
  const imbalance = (totalBidVolume - totalAskVolume) / (totalBidVolume + totalAskVolume) || 0

  return (
    <MetricCard
      label="Order Imbalance"
      value={`${(imbalance * 100).toFixed(2)}%`}
      color={imbalance >= 0 ? 'green' : 'red'}
      className={className}
    />
  )
}
