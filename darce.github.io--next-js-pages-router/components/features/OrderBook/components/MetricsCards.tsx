import React from 'react'
import { Card, Flex, Grid, Text } from '@radix-ui/themes'
import { OrderBookMetrics } from '../../../../types'

export interface MetricsCardsProps {
  metrics: OrderBookMetrics
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

const MetricsCards: React.FC<MetricsCardsProps> = ({ metrics }) => {
  return (
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
  )
}

export default MetricsCards
