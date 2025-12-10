import { useCallback, useEffect, useRef, useState } from 'react'

export interface UseWebSocketOptions<T> {
    url: string
    enabled?: boolean
    parseMessage?: (event: MessageEvent) => T | null
    onOpen?: () => void
    onClose?: () => void
    onError?: (error: Event) => void
}

export interface UseWebSocketResult<T> {
    data: T | null
    isConnected: boolean
    error: string | null
    reconnect: () => void
}

/**
 * Generic hook for managing WebSocket connections
 * Can be used with any WebSocket server
 */
export function useWebSocket<T>({
    url,
    enabled = true,
    parseMessage,
    onOpen,
    onClose,
    onError
}: UseWebSocketOptions<T>): UseWebSocketResult<T> {
    const [data, setData] = useState<T | null>(null)
    const [isConnected, setIsConnected] = useState(false)
    const [error, setError] = useState<string | null>(null)
    
    const wsRef = useRef<WebSocket | null>(null)

    // Parse WebSocket message
    const handleMessage = useCallback((event: MessageEvent) => {
        try {
            if (parseMessage) {
                const parsed = parseMessage(event)
                if (parsed !== null) {
                    setData(parsed)
                }
            } else {
                // Default: parse as JSON
                setData(JSON.parse(event.data))
            }
        } catch (err) {
            console.error('WebSocket message parse error:', err)
        }
    }, [parseMessage])

    // Connect to WebSocket
    const connect = useCallback(() => {
        if (wsRef.current) {
            wsRef.current.onclose = null
            wsRef.current.close()
        }

        const ws = new WebSocket(url)

        ws.onopen = () => {
            setIsConnected(true)
            setError(null)
            onOpen?.()
        }

        ws.onmessage = handleMessage

        ws.onerror = (e) => {
            setError('WebSocket connection error')
            setIsConnected(false)
            onError?.(e)
        }

        ws.onclose = () => {
            if (wsRef.current === ws) {
                setIsConnected(false)
                onClose?.()
            }
        }

        wsRef.current = ws
    }, [url, handleMessage, onOpen, onClose, onError])

    // Disconnect from WebSocket
    const disconnect = useCallback(() => {
        if (wsRef.current) {
            wsRef.current.onclose = null
            wsRef.current.close()
            wsRef.current = null
            setIsConnected(false)
        }
    }, [])

    // Manage connection lifecycle
    useEffect(() => {
        if (enabled) {
            connect()
        } else {
            disconnect()
        }

        return () => {
            disconnect()
        }
    }, [enabled, connect, disconnect])

    return {
        data,
        isConnected,
        error,
        reconnect: connect
    }
}
