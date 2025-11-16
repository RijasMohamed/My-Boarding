import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSchedules, addSchedule, updateSchedule, removeSchedule } from '../redux/scheduleSlice'
import { fetchMembers } from '../redux/memberSlice'
import api from '../services/api'
import Modal from '../components/Modal'
import Badge from '../components/Badge'

export default function Schedules() {
  const dispatch = useDispatch()
  const { list: schedules, status } = useSelector(state => state.schedules)
  const { list: members } = useSelector(state => state.members)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSchedule, setEditingSchedule] = useState(null)
  const [taskFilter, setTaskFilter] = useState('All')
  const [form, setForm] = useState({
    task_type: 'Water',
    assigned_to: '',
    date: '',
    time: '',
    description: '',
    completed: false
  })
  const [submitError, setSubmitError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    dispatch(fetchSchedules())
    dispatch(fetchMembers())
  }, [dispatch])

  const filteredSchedules = taskFilter === 'All'
    ? schedules
    : schedules.filter(s => s.task_type === taskFilter)

  const openAddModal = () => {
    setEditingSchedule(null)
    setForm({ task_type: 'Water', assigned_to: '', date: '', time: '', description: '', completed: false })
    setSubmitError(null)
    setIsModalOpen(true)
  }

  const openEditModal = (schedule) => {
    setEditingSchedule(schedule)
    setForm({
      task_type: schedule.task_type,
      assigned_to: schedule.assigned_to || '',
      date: schedule.date,
      time: schedule.time,
      description: schedule.description || '',
      completed: schedule.completed || false
    })
    setSubmitError(null)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingSchedule(null)
    setSubmitError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError(null)

    try {
      const scheduleData = { ...form, assigned_to: form.assigned_to ? parseInt(form.assigned_to) : null }
      if (editingSchedule) {
        const res = await api.patch(`/schedules/${editingSchedule.id}/`, scheduleData)
        dispatch(updateSchedule(res.data))
      } else {
        const res = await api.post('/schedules/', scheduleData)
        dispatch(addSchedule(res.data))
      }
      closeModal()
    } catch (err) {
      setSubmitError(err.response?.data?.detail || 'Failed to save schedule')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this schedule?')) return
    try {
      await api.delete(`/schedules/${id}/`)
      dispatch(removeSchedule(id))
    } catch (err) {
      alert('Failed to delete schedule')
    }
  }

  const getTaskIcon = (type) => {
    switch(type) {
      case 'Water': return '🚿'
      case 'Food': return '🍽️'
      case 'Cleaning': return '🧹'
      default: return '📅'
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Schedules</h2>
          <p className="text-sm text-gray-500 mt-1">Manage daily schedules for water, food, and cleaning</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <span>+</span>
          <span>Add Schedule</span>
        </button>
      </div>

      {/* Task Type Filter */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex space-x-2">
          <button
            onClick={() => setTaskFilter('All')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              taskFilter === 'All' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setTaskFilter('Water')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              taskFilter === 'Water' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🚿 Water
          </button>
          <button
            onClick={() => setTaskFilter('Food')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              taskFilter === 'Food' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🍽️ Food
          </button>
          <button
            onClick={() => setTaskFilter('Cleaning')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              taskFilter === 'Cleaning' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            🧹 Cleaning
          </button>
        </div>
      </div>

      {status === 'loading' ? (
        <div className="text-center py-12">Loading schedules...</div>
      ) : filteredSchedules.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500">No schedules found. Add one to get started!</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned To</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredSchedules.map((schedule) => {
                  const memberName = schedule.member_name || (schedule.assigned_to ? members.find(m => m.id === schedule.assigned_to)?.name : null) || '-'
                  return (
                    <tr key={schedule.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl">{getTaskIcon(schedule.task_type)}</span>
                          <span className="text-sm font-medium text-gray-900">{schedule.task_type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{memberName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{schedule.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{schedule.time}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">{schedule.description || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={schedule.completed ? 'success' : 'warning'}>
                          {schedule.completed ? 'Completed' : 'Pending'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => openEditModal(schedule)} className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                        <button onClick={() => handleDelete(schedule.id)} className="text-red-600 hover:text-red-900">Delete</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingSchedule ? 'Edit Schedule' : 'Add New Schedule'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Task Type *</label>
            <select
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.task_type}
              onChange={(e) => setForm({ ...form, task_type: e.target.value })}
              disabled={submitting}
            >
              <option value="Water">🚿 Water</option>
              <option value="Food">🍽️ Food</option>
              <option value="Cleaning">🧹 Cleaning</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.assigned_to}
              onChange={(e) => setForm({ ...form, assigned_to: e.target.value })}
              disabled={submitting}
            >
              <option value="">None</option>
              {members.map(m => (
                <option key={m.id} value={m.id}>{m.name} {m.room_number ? `(Room ${m.room_number})` : ''}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
              <input
                type="date"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                disabled={submitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time *</label>
              <input
                type="time"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                disabled={submitting}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows="3"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              disabled={submitting}
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              checked={form.completed}
              onChange={(e) => setForm({ ...form, completed: e.target.checked })}
              disabled={submitting}
            />
            <label className="ml-2 text-sm text-gray-700">Mark as completed</label>
          </div>
          {submitError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {submitError}
            </div>
          )}
          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={closeModal} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50" disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400" disabled={submitting}>
              {submitting ? 'Saving...' : editingSchedule ? 'Update' : 'Add Schedule'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
