import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

export default function Notifications() {
  const [notifications, setNotifications] = useState([])
  const members = useSelector(state => state.members.list)
  const payments = useSelector(state => state.payments.list)
  const repairs = useSelector(state => state.repairs.list)
  const schedules = useSelector(state => state.schedules.list)
  const bills = useSelector(state => state.bills.list)

  useEffect(() => {
    // Generate notifications from recent activity
    const newNotifications = []
    
    // Recent payments
    payments.slice(0, 5).forEach(payment => {
      const memberName = payment.member_name || 'Unknown'
      newNotifications.push({
        id: `payment-${payment.id}`,
        type: 'payment',
        icon: '💰',
        message: `Payment of ₹${payment.amount} ${payment.status === 'Paid' ? 'received' : 'pending'} from ${memberName}`,
        timestamp: payment.payment_date,
        color: payment.status === 'Paid' ? 'green' : 'yellow'
      })
    })

    // Recent repairs
    repairs.slice(0, 5).forEach(repair => {
      const memberName = repair.member_name || 'Unknown'
      newNotifications.push({
        id: `repair-${repair.id}`,
        type: 'repair',
        icon: '🔧',
        message: `${repair.item_name} repair ${repair.status === 'Completed' ? 'completed' : 'scheduled'} for ${memberName}`,
        timestamp: repair.repair_date,
        color: repair.status === 'Completed' ? 'green' : 'yellow'
      })
    })

    // Recent schedules
    schedules.slice(0, 5).forEach(schedule => {
      const memberName = schedule.member_name || 'Unassigned'
      newNotifications.push({
        id: `schedule-${schedule.id}`,
        type: 'schedule',
        icon: schedule.task_type === 'Water' ? '🚿' : schedule.task_type === 'Food' ? '🍽️' : '🧹',
        message: `${schedule.task_type} schedule ${schedule.completed ? 'completed' : 'pending'} for ${memberName} on ${schedule.date}`,
        timestamp: schedule.date,
        color: schedule.completed ? 'green' : 'blue'
      })
    })

    // Recent bills
    bills.slice(0, 5).forEach(bill => {
      const memberName = bill.member_name || 'Unknown'
      newNotifications.push({
        id: `bill-${bill.id}`,
        type: 'bill',
        icon: '🧾',
        message: `Bill for ${memberName} - ${bill.month} ${bill.paid_status === 'Paid' ? 'paid' : 'unpaid'}`,
        timestamp: bill.month,
        color: bill.paid_status === 'Paid' ? 'green' : 'red'
      })
    })

    // Sort by timestamp (most recent first)
    newNotifications.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    setNotifications(newNotifications)
  }, [members, payments, repairs, schedules, bills])

  const getColorClasses = (color) => {
    const colors = {
      green: 'bg-green-50 border-green-200',
      yellow: 'bg-yellow-50 border-yellow-200',
      blue: 'bg-blue-50 border-blue-200',
      red: 'bg-red-50 border-red-200',
    }
    return colors[color] || 'bg-gray-50 border-gray-200'
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
        <p className="text-sm text-gray-500 mt-1">System alerts and real-time updates</p>
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white rounded-lg shadow p-4 border-l-4 ${getColorClasses(notification.color)}`}
            >
              <div className="flex items-start space-x-4">
                <div className="text-2xl">{notification.icon}</div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">{notification.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

