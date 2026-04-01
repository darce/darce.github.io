import { useCallback, useEffect, useRef, useState } from 'react'

const MAX_RECONNECT_DELAY_MS = 30_000
const BASE_RECONNECT_DELAY_MS = 1_000

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
 * Generic hook for managing WebSocket connections with auto-reconnect.
 * Uses exponential backoff when the connection drops unexpectedly.
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
    const reconnectAttemptRef = useRef(0)
    const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const intentionalCloseRef = useRef(false)

    const clearReconnectTimer = useCallback(() => {
        if (reconnectTimerRef.current) {
            clearTimeout(reconnectTimerRef.current)
            reconnectTimerRef.current = null
        }
    }, [])

    // Parse WebSocket message
    const handleMessage = useCallback((event: MessageEvent) => {
        try {
            if (parseMessage) {
                const parsed = parseMessage(event)
                if (parsed !== null) {
                    setData(parsed)
                }
            } else {
                setData(JSON.parse(event.data))
            }
        } catch {
            // Silently drop unparseable messages
        }
    }, [parseMessage])

    // Connect to WebSocket
    const connect = useCallback(() => {
        clearReconnectTimer()
        intentionalCloseRef.current = false

        if (wsRef.current) {
            wsRef.current.onclose = null
            wsRef.current.close()
        }

        const ws = new WebSocket(url)

        ws.onopen = () => {
            setIsConnected(true)
            setError(null)
            reconnectAttemptRef.current = 0
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

                // Auto-reconnect with exponential backoff unless intentionally closed
                if (!intentionalCloseRef.current) {
                    const attempt = reconnectAttemptRef.current
                    const delay = Math.min(
                        BASE_RECONNECT_DELAY_MS * Math.pow(2, attempt),
                        MAX_RECONNECT_DELAY_MS
                    )
                    reconnectAttemptRef.current = attempt + 1
                    reconnectTimerRef.current = setTimeout(connect, delay)
                }
            }
        }

        wsRef.current = ws
    }, [url, handleMessage, onOpen, onClose, onError, clearReconnectTimer])

    // Disconnect from WebSocket
    const disconnect = useCallback(() => {
        intentionalCloseRef.current = true
        clearReconnectTimer()
        if (wsRef.current) {
            wsRef.current.onclose = null
            wsRef.current.close()
            wsRef.current = null
            setIsConnected(false)
        }
    }, [clearReconnectTimer])

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
