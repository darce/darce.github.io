import React from 'react'
import { Box, Flex, Text, Callout } from '@radix-ui/themes'
import { useOrderBook } from './useOrderBook'
import OrderBookView from './OrderBookView'
import styles from './OrderBook.module.scss'

export interface OrderBookProps {
    className?: string
    apiBaseUrl?: string
    /** Update mode: 'websocket' for real-time, 'polling' for REST API polling */
    updateMode?: 'websocket' | 'polling'
    /** Polling interval in ms (only used when updateMode is 'polling') */
    pollInterval?: number
}

/**
 * Order Book component - displays real-time cryptocurrency order book data
 * 
 * This component combines the useOrderBook hook (network/state) with
 * OrderBookView (presentation) to create a complete order book display.
 */
const OrderBook: React.FC<OrderBookProps> = ({
    className,
    apiBaseUrl,
    updateMode = 'websocket',
    pollInterval = 1000
}) => {
    const {
        data,
        loading,
        error,
        isConnected,
        symbol,
        setSymbol,
        refresh
    } = useOrderBook({
        // initialSymbol uses hook default (defined in useOrderBook.ts)
        apiBaseUrl,
        updateMode,
        pollInterval
    })

    if (loading && !data) {
        return (
            <Box className={`${styles.orderBook} ${className || ''}`}>
                <Flex align="center" justify="center" py="9">
                    <Text color="gray">Loading order book data...</Text>
                </Flex>
            </Box>
        )
    }

    if (error) {
        return (
            <Box className={`${styles.orderBook} ${className || ''}`}>
                <Callout.Root color="red" variant="soft">
                    <Callout.Text>
                        <Text weight="bold">Error:</Text> {error}
                        <br />
                        <Text size="1" color="gray">Please try again or select a different trading pair.</Text>
                    </Callout.Text>
                </Callout.Root>
            </Box>
        )
    }

    if (!data) {
        return null
    }

    return (
        <OrderBookView
            className={className}
            data={data}
            symbol={symbol}
            loading={loading}
            isConnected={isConnected}
            showConnectionStatus={updateMode === 'websocket'}
            onSymbolChange={setSymbol}
            onRefresh={refresh}
        />
    )
}

export default OrderBook
