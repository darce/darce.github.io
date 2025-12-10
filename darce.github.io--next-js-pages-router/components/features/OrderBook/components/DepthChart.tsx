import React from 'react'
import { Card, Heading, Text } from '@radix-ui/themes'
import { OrderBookEntry } from '../../../../types'
import styles from '../OrderBook.module.scss'

export interface DepthChartProps {
  bids: OrderBookEntry[]
  asks: OrderBookEntry[]
  maxLevels?: number
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

const DepthChart: React.FC<DepthChartProps> = ({
  bids,
  asks,
  maxLevels = 15
}) => {
  const displayBids = bids.slice(0, maxLevels)
  const displayAsks = asks.slice(0, maxLevels)

  // Find max size for scaling bars
  const allSizes = [...displayBids.map(b => b.size), ...displayAsks.map(a => a.size)]
  const maxSize = allSizes.length > 0 ? Math.max(...allSizes) : 1

  return (
    <Card size="2" variant="surface" mb="4">
      <Heading as="h3" size="3" mb="3">Order Book Depth</Heading>
      <div className={styles.depthChart}>
        {displayBids.map((bid, index) => {
          const ask = displayAsks[index]
          const bidWidth = (bid.size / maxSize) * 100
          const askWidth = ask ? (ask.size / maxSize) * 100 : 0

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
  )
}

export default DepthChart
