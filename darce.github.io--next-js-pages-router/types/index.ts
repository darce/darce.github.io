
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

// OrderBook types for CoinAPI data
export interface OrderBookEntry {
    price: number
    size: number
}

export interface OrderBookData {
    symbol_id: string
    time_exchange: string
    time_coinapi: string
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