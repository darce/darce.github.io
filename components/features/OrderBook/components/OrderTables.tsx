import React from 'react'
import { Card, Grid, Heading, Table, Text } from '@radix-ui/themes'
import { OrderBookEntry } from '../../../../types'

export interface OrderTablesProps {
  bids: OrderBookEntry[]
  asks: OrderBookEntry[]
  maxRows?: number
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

const OrderTables: React.FC<OrderTablesProps> = ({
  bids,
  asks,
  maxRows = 10
}) => {
  return (
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
            {bids.slice(0, maxRows).map((bid, index) => (
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
            {asks.slice(0, maxRows).map((ask, index) => (
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
  )
}

export default OrderTables
