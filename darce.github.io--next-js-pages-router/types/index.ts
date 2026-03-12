import { MDXRemoteSerializeResult } from 'next-mdx-remote'

export interface MetaLink {
    url: string
    label: string
}

export interface MetaImage {
    src: string
    alt: string
}

export interface MetaData {
    index?: number
    year?: number
    title?: string
    subtitle?: string
    description?: string
    details?: string
    links?: MetaLink[]
    images?: MetaImage[]
    tags?: string[]
}

export interface ContentIndexData {
    slug: string
    metaData: MetaData
}

export interface MarkdownData extends ContentIndexData {
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
