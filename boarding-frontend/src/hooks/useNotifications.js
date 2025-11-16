import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { addMember, updateMember, removeMember } from '../redux/memberSlice'
import { addSchedule, updateSchedule, removeSchedule } from '../redux/scheduleSlice'
import { addPayment, updatePayment, removePayment } from '../redux/paymentSlice'
import { addBill, updateBill, removeBill } from '../redux/billSlice'
import { addRepair, updateRepair, removeRepair } from '../redux/repairSlice'

export function useNotifications() {
  const dispatch = useDispatch()
  const token = localStorage.getItem('access')
  const wsRef = useRef(null)
  const reconnectTimeoutRef = useRef(null)
  const API_BASE = process.env.REACT_APP_API_BASE || 'http://localhost:8000/api'
  const WS_BASE = API_BASE.replace('http', 'ws').replace('/api', '')

  useEffect(() => {
    if (!token) {
      console.log('[WS] No token, skipping WebSocket connection')
      return
    }

    const connectWebSocket = () => {
      try {
        console.log('[WS] Attempting to connect to:', `${WS_BASE}/ws/notifications/`)
        const ws = new WebSocket(`${WS_BASE}/ws/notifications/`)

        ws.onopen = () => {
          console.log('[WS] Connected successfully')
          // Clear any reconnect timeout on successful connection
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current)
            reconnectTimeoutRef.current = null
          }
        }

        ws.onmessage = (event) => {
          try {
            const payload = JSON.parse(event.data)
            console.log('[WS] Message received:', payload)
            const { model, action, data } = payload

            if (model === 'member') {
              if (action === 'created') dispatch(addMember(data))
              else if (action === 'updated') dispatch(updateMember(data))
              else if (action === 'deleted') dispatch(removeMember(data.id))
            } else if (model === 'schedule') {
              if (action === 'created') dispatch(addSchedule(data))
              else if (action === 'updated') dispatch(updateSchedule(data))
              else if (action === 'deleted') dispatch(removeSchedule(data.id))
            } else if (model === 'payment') {
              if (action === 'created') dispatch(addPayment(data))
              else if (action === 'updated') dispatch(updatePayment(data))
              else if (action === 'deleted') dispatch(removePayment(data.id))
            } else if (model === 'bill') {
              if (action === 'created') dispatch(addBill(data))
              else if (action === 'updated') dispatch(updateBill(data))
              else if (action === 'deleted') dispatch(removeBill(data.id))
            } else if (model === 'repair') {
              if (action === 'created') dispatch(addRepair(data))
              else if (action === 'updated') dispatch(updateRepair(data))
              else if (action === 'deleted') dispatch(removeRepair(data.id))
            }
          } catch (err) {
            console.error('[WS] Error parsing message:', err)
          }
        }

        ws.onerror = (err) => {
          console.error('[WS] Connection error:', err)
        }

        ws.onclose = () => {
          console.log('[WS] Connection closed')
          // Try to reconnect after 3 seconds
          reconnectTimeoutRef.current = setTimeout(() => {
            console.log('[WS] Attempting to reconnect...')
            connectWebSocket()
          }, 3000)
        }

        wsRef.current = ws
      } catch (err) {
        console.error('[WS] Failed to create WebSocket:', err)
      }
    }

    connectWebSocket()

    // Cleanup function
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current)
      }
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.close()
      }
    }
  }, [token, dispatch])
}

