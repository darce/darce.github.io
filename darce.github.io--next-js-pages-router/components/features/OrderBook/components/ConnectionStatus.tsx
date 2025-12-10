import React from 'react'
import { Flex, Text, Badge } from '@radix-ui/themes'

export interface ConnectionStatusProps {
  symbol: string
  lastUpdateId: number
  isConnected: boolean
  showConnectionStatus?: boolean
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({
  symbol,
  lastUpdateId,
  isConnected,
  showConnectionStatus = false
}) => {
  return (
    <Flex align="center" gap="2">
      <Text size="1" color="gray">
        {symbol} · Update ID: {lastUpdateId}
      </Text>
      {showConnectionStatus && (
        <Badge
          color={isConnected ? 'green' : 'orange'}
          variant="soft"
          size="1"
        >
          {isConnected ? '🟢 Live' : '🔴 Connecting...'}
        </Badge>
      )}
    </Flex>
  )
}

export default ConnectionStatus
