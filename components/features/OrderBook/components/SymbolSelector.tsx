import React from 'react'
import { Flex, Select, Button } from '@radix-ui/themes'

export const SYMBOLS = [
  { id: 'BTCUSDT', label: 'BTC/USDT' },
  { id: 'ETHUSDT', label: 'ETH/USDT' },
  { id: 'BNBUSDT', label: 'BNB/USDT' },
  { id: 'SOLUSDT', label: 'SOL/USDT' },
  { id: 'XRPUSDT', label: 'XRP/USDT' },
]

export interface SymbolSelectorProps {
  symbol: string
  loading: boolean
  onSymbolChange: (symbol: string) => void
  onRefresh: () => void
}

const SymbolSelector: React.FC<SymbolSelectorProps> = ({
  symbol,
  loading,
  onSymbolChange,
  onRefresh
}) => {
  return (
    <Flex justify="between" align="center" gap="3" mb="4">
      <Select.Root value={symbol} onValueChange={onSymbolChange}>
        <Select.Trigger variant="surface" />
        <Select.Content position="popper">
          {SYMBOLS.map(s => (
            <Select.Item key={s.id} value={s.id}>{s.label}</Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
      <Button
        variant="soft"
        onClick={onRefresh}
        disabled={loading}
        loading={loading}
      >
        Refresh
      </Button>
    </Flex>
  )
}

export default SymbolSelector
