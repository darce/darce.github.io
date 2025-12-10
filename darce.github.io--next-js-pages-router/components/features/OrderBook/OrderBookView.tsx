import React, { useMemo } from 'react'
import {
  Box,
  Card,
  Flex,
  Grid,
  Heading,
  Select,
  Button,
  Table,
  Text,
  Badge
} from '@radix-ui/themes'
import { OrderBookData, OrderBookMetrics } from '../../../types'
import styles from './OrderBook.module.scss'

// Binance trading pairs
export const SYMBOLS = [
  { id: 'BTCUSDT', label: 'BTC/USDT' },
  { id: 'ETHUSDT', label: 'ETH/USDT' },
  { id: 'BNBUSDT', label: 'BNB/USDT' },
  { id: 'SOLUSDT', label: 'SOL/USDT' },
  { id: 'XRPUSDT', label: 'XRP/USDT' },
]

const SIGNIFICANT_SIZE_THRESHOLD = 1 // Size threshold for significant orders

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

/**
 * Pure presentation component for the order book
 * Receives all data via props, no network logic
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

  // Get top N levels for visualization
  const displayLevels = useMemo(() => {
    const maxLevels = 15
    const bids = data.bids.slice(0, maxLevels)
    const asks = data.asks.slice(0, maxLevels)

    // Find max size for scaling bars
    const allSizes = [...bids.map(b => b.size), ...asks.map(a => a.size)]
    const maxSize = allSizes.length > 0 ? Math.max(...allSizes) : 1

    return { bids, asks, maxSize }
  }, [data])

  return (
    <Box className={`${styles.orderBook} ${className || ''}`}>
      {/* Header with Symbol Select and Refresh Button */}
      <Flex justify="between" align="center" gap="3" mb="4">
        <Select.Root value={symbol} onValueChange={onSymbolChange}>
          <Select.Trigger variant="surface" />
          <Select.Content position="popper">
            {SYMBOLS.map(s => (
              <Select.Item key={s.id} value={s.id}>{s.label}</Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
        <Button
          variant="soft"
          onClick={onRefresh}
          disabled={loading}
          loading={loading}
        >
          Refresh
        </Button>
      </Flex>

      {/* Metrics Cards */}
      <Grid columns={{ initial: '2', md: '4' }} gap="3" mb="4">
        <Card size="1" variant="surface">
          <Flex direction="column" gap="1">
            <Text size="1" color="gray">Best Bid</Text>
            <Text size="3" weight="bold" color="green">
              ${formatPrice(metrics.bestBid)}
            </Text>
          </Flex>
        </Card>
        <Card size="1" variant="surface">
          <Flex direction="column" gap="1">
            <Text size="1" color="gray">Best Ask</Text>
            <Text size="3" weight="bold" color="red">
              ${formatPrice(metrics.bestAsk)}
            </Text>
          </Flex>
        </Card>
        <Card size="1" variant="surface">
          <Flex direction="column" gap="1">
            <Text size="1" color="gray">Spread</Text>
            <Text size="3" weight="bold">
              ${formatPrice(metrics.spread)}
            </Text>
          </Flex>
        </Card>
        <Card size="1" variant="surface">
          <Flex direction="column" gap="1">
            <Text size="1" color="gray">Order Imbalance</Text>
            <Text size="3" weight="bold" color={metrics.orderImbalance >= 0 ? 'green' : 'red'}>
              {(metrics.orderImbalance * 100).toFixed(2)}%
            </Text>
          </Flex>
        </Card>
      </Grid>

      {/* Depth Visualization - Keep custom styles for this complex chart */}
      <Card size="2" variant="surface" mb="4">
        <Heading as="h3" size="3" mb="3">Order Book Depth</Heading>
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
                  <Text size="1" className={styles.sizeText}>{formatSize(bid.size)}</Text>
                </div>
                <div className={styles.priceColumn}>
                  <Text size="1" color="green">${formatPrice(bid.price)}</Text>
                  {ask && (
                    <>
                      <Text size="1" color="gray"> | </Text>
                      <Text size="1" color="red">${formatPrice(ask.price)}</Text>
                    </>
                  )}
                </div>
                {ask && (
                  <div
                    className={styles.askBar}
                    style={{ width: `${askWidth}%` }}
                  >
                    <Text size="1" className={styles.sizeText}>{formatSize(ask.size)}</Text>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </Card>

      {/* Order Tables */}
      <Grid columns={{ initial: '1', md: '2' }} gap="4" mb="4">
        <Card size="1" variant="surface">
          <Heading as="h4" size="2" mb="2" color="green">Bids (Buyers)</Heading>
          <Table.Root size="1">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Price</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell justify="end">Size</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data.bids.slice(0, 10).map((bid, index) => (
                <Table.Row key={index}>
                  <Table.Cell>
                    <Text color="green">${formatPrice(bid.price)}</Text>
                  </Table.Cell>
                  <Table.Cell justify="end">{formatSize(bid.size)}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Card>

        <Card size="1" variant="surface">
          <Heading as="h4" size="2" mb="2" color="red">Asks (Sellers)</Heading>
          <Table.Root size="1">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeaderCell>Price</Table.ColumnHeaderCell>
                <Table.ColumnHeaderCell justify="end">Size</Table.ColumnHeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {data.asks.slice(0, 10).map((ask, index) => (
                <Table.Row key={index}>
                  <Table.Cell>
                    <Text color="red">${formatPrice(ask.price)}</Text>
                  </Table.Cell>
                  <Table.Cell justify="end">{formatSize(ask.size)}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Card>
      </Grid>

      {/* Status */}
      <Flex align="center" gap="2">
        <Text size="1" color="gray">
          {data.symbol} · Update ID: {data.lastUpdateId}
        </Text>
        {showConnectionStatus && (
          <Badge
            color={isConnected ? 'green' : 'orange'}
            variant="soft"
            size="1"
          >
            {isConnected ? '🟢 Live' : '🔴 Connecting...'}
          </Badge>
        )}
      </Flex>
    </Box>
  )
}

export default OrderBookView
