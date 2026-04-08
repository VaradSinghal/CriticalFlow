'use client'

import { useEffect, useState } from 'react'
import { WardSnapshot, WsMessage } from '@/types'

export function useWardSocket() {
  const [snapshot, setSnapshot] = useState<WardSnapshot | null>(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8000'
    const ws = new WebSocket(`${wsUrl}/ws/ward`)

    ws.onopen = () => {
      setConnected(true)
      console.log('WS connected')
    }

    ws.onmessage = (event) => {
      const msg: WsMessage = JSON.parse(event.data)
      if (msg.type === 'snapshot') {
        setSnapshot(msg.payload)
      }
    }

    ws.onclose = () => setConnected(false)
    ws.onerror = (e) => console.error('WS error', e)

    return () => ws.close()
  }, [])

  return { snapshot, connected }
}
