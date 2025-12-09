
import { MDXRemoteSerializeResult } from 'next-mdx-remote'

export interface MetaData {
    index: number
    year: number
    title: string
    subtitle: string
    description: string
    details: string
    links?:
    {
        url: string,
        label: string
    }[]
    images?: {
        src: string,
        alt: string
    }[]
    tags?: string[]
}

export interface MarkdownData {
    slug: string
    metaData: MetaData
    mdxSource: MDXRemoteSerializeResult
}

// OrderBook types for Binance API data
export interface OrderBookEntry {
    price: number
    size: number
}

export interface OrderBookData {
    symbol: string
    lastUpdateId: number
    asks: OrderBookEntry[]
    bids: OrderBookEntry[]
}

export interface OrderBookMetrics {
    spread: number
    orderImbalance: number
    significantBids: OrderBookEntry[]
    significantAsks: OrderBookEntry[]
    bestBid: number
    bestAsk: number
    totalBidVolume: number
    totalAskVolume: number
}