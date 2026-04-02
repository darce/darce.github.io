import React from 'react'
import { Card, Flex, Grid, Text } from '@radix-ui/themes'

/**
 * Format price with appropriate decimal places
 */
export const formatPrice = (price: number): string => {
  if (price >= 1000) {
    return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
  }
  return price.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })
}

export interface MetricCardProps {
  label: string
  value: string
  color?: 'green' | 'red' | 'gray'
  className?: string
}

/**
 * Single metric card - reusable building block
 */
export const MetricCard: React.FC<MetricCardProps> = ({ label, value, color, className }) => (
  <Card size="1" variant="surface" className={className}>
    <Flex direction="column" gap="1">
      <Text size="1" color="gray">{label}</Text>
      <Text size="3" weight="bold" color={color}>
        {value}
      </Text>
    </Flex>
  </Card>
)

export interface MetricsCardsProps {
  bestBid: number
  bestAsk: number
  spread: number
  orderImbalance: number
}

/**
 * Grid of all 4 metric cards - used in full OrderBook view
 */
const MetricsCards: React.FC<MetricsCardsProps> = ({
  bestBid,
  bestAsk,
  spread,
  orderImbalance
}) => {
  return (
    <Grid columns={{ initial: '2', md: '4' }} gap="3" mb="4">
      <MetricCard
        label="Best Bid"
        value={`$${formatPrice(bestBid)}`}
        color="green"
      />
      <MetricCard
        label="Best Ask"
        value={`$${formatPrice(bestAsk)}`}
        color="red"
      />
      <MetricCard
        label="Spread"
        value={`$${formatPrice(spread)}`}
      />
      <MetricCard
        label="Order Imbalance"
        value={`${(orderImbalance * 100).toFixed(2)}%`}
        color={orderImbalance >= 0 ? 'green' : 'red'}
      />
    </Grid>
  )
}

export default MetricsCards
