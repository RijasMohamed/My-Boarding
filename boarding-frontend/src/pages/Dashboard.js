import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import Card from '../components/Card'
import Badge from '../components/Badge'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await api.get('/dashboard/stats/')
      setStats(res.data)
    } catch (err) {
      console.error('Error fetching stats:', err)
      console.error('Error details:', err.response?.data || err.message)
      // Show more detailed error message
      if (err.response?.status === 403) {
        console.error('Access denied - user may not have staff/admin role')
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-yellow-800 font-medium mb-2">Failed to load dashboard data</p>
          <p className="text-sm text-yellow-600">
            This may be due to permission restrictions. Please ensure your user account has admin or staff role.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card
          title="Total Members"
          value={stats.members.total}
          subtitle={`${stats.members.active} active`}
          color="blue"
          icon="👥"
          onClick={() => navigate('/members')}
        />
        <Card
          title="Pending Payments"
          value={stats.payments.pending_count}
          subtitle={`₹${stats.payments.pending_amount.toFixed(2)}`}
          color="yellow"
          icon="💰"
          onClick={() => navigate('/payments')}
        />
        <Card
          title="Pending Repairs"
          value={stats.repairs.pending}
          color="red"
          icon="🔧"
          onClick={() => navigate('/repairs')}
        />
        <Card
          title="Today's Schedules"
          value={stats.schedules.today}
          subtitle={`${stats.schedules.completed_today} completed`}
          color="green"
          icon="📅"
          onClick={() => navigate('/schedules')}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Recent Activity</h2>
          <div className="space-y-4">
            {/* Recent Payments */}
            {stats.recent_activity.payments.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Recent Payments</h3>
                <div className="space-y-2">
                  {stats.recent_activity.payments.slice(0, 3).map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {payment.member_name || 'N/A'}
                        </p>
                        <p className="text-xs text-gray-500">{payment.payment_date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-green-600">₹{payment.amount}</p>
                        <Badge variant={payment.status === 'Paid' ? 'success' : 'warning'}>
                          {payment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Repairs */}
            {stats.recent_activity.repairs.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Recent Repairs</h3>
                <div className="space-y-2">
                  {stats.recent_activity.repairs.slice(0, 3).map((repair) => (
                    <div key={repair.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{repair.item_name}</p>
                        <p className="text-xs text-gray-500">{repair.repair_date}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-800">₹{repair.cost}</p>
                        <Badge variant={repair.status === 'Completed' ? 'success' : 'warning'}>
                          {repair.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Schedules */}
            {stats.recent_activity.schedules.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-2">Recent Schedules</h3>
                <div className="space-y-2">
                  {stats.recent_activity.schedules.slice(0, 3).map((schedule) => (
                    <div key={schedule.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{schedule.task_type}</p>
                        <p className="text-xs text-gray-500">{schedule.date} {schedule.time}</p>
                      </div>
                      <Badge variant={schedule.completed ? 'success' : 'warning'}>
                        {schedule.completed ? 'Completed' : 'Pending'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Unpaid Bills</p>
                <p className="text-2xl font-bold text-blue-600">{stats.bills.unpaid_count}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="text-lg font-semibold text-gray-800">₹{stats.bills.unpaid_amount.toFixed(2)}</p>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-600">Active Members</p>
                <p className="text-2xl font-bold text-green-600">{stats.members.active}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Inactive</p>
                <p className="text-lg font-semibold text-gray-800">{stats.members.inactive}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

