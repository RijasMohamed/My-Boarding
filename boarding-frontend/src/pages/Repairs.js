import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchRepairs, addRepair, updateRepair, removeRepair } from '../redux/repairSlice'
import { fetchMembers } from '../redux/memberSlice'
import api from '../services/api'
import Modal from '../components/Modal'
import Badge from '../components/Badge'

export default function Repairs() {
  const dispatch = useDispatch()
  const { list: repairs, status } = useSelector(state => state.repairs)
  const { list: members } = useSelector(state => state.members)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRepair, setEditingRepair] = useState(null)
  const [statusFilter, setStatusFilter] = useState('All')
  const [form, setForm] = useState({
    member: '',
    item_name: '',
    repair_date: '',
    cost: '',
    replaced_by: '',
    description: '',
    status: 'Pending'
  })
  const [submitError, setSubmitError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    dispatch(fetchRepairs())
    dispatch(fetchMembers())
  }, [dispatch])

  const filteredRepairs = statusFilter === 'All'
    ? repairs
    : repairs.filter(r => r.status === statusFilter)

  const openAddModal = () => {
    setEditingRepair(null)
    setForm({ member: '', item_name: '', repair_date: '', cost: '', replaced_by: '', description: '', status: 'Pending' })
    setSubmitError(null)
    setIsModalOpen(true)
  }

  const openEditModal = (repair) => {
    setEditingRepair(repair)
    setForm({
      member: typeof repair.member === 'object' ? repair.member.id : repair.member,
      item_name: repair.item_name,
      repair_date: repair.repair_date,
      cost: repair.cost,
      replaced_by: repair.replaced_by || '',
      description: repair.description || '',
      status: repair.status
    })
    setSubmitError(null)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingRepair(null)
    setSubmitError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError(null)

    try {
      const repairData = { ...form, member: parseInt(form.member) }
      if (editingRepair) {
        const res = await api.patch(`/repairs/${editingRepair.id}/`, repairData)
        dispatch(updateRepair(res.data))
      } else {
        const res = await api.post('/repairs/', repairData)
        dispatch(addRepair(res.data))
      }
      closeModal()
    } catch (err) {
      setSubmitError(err.response?.data?.detail || 'Failed to save repair')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this repair?')) return
    try {
      await api.delete(`/repairs/${id}/`)
      dispatch(removeRepair(id))
    } catch (err) {
      alert('Failed to delete repair')
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Repairs</h2>
          <p className="text-sm text-gray-500 mt-1">Log all repaired or replaced items</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <span>+</span>
          <span>Add Repair</span>
        </button>
      </div>

      {/* Status Filter */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <select
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {status === 'loading' ? (
        <div className="text-center py-12">Loading repairs...</div>
      ) : filteredRepairs.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500">No repairs found. Add one to get started!</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Member</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Item</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cost</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Replaced By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredRepairs.map((repair) => {
                  const memberName = repair.member_name || (typeof repair.member === 'object' ? repair.member?.name : 'N/A')
                  return (
                    <tr key={repair.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{memberName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{repair.item_name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{repair.repair_date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{repair.cost}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{repair.replaced_by || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={repair.status === 'Completed' ? 'success' : 'warning'}>
                          {repair.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => openEditModal(repair)} className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                        <button onClick={() => handleDelete(repair.id)} className="text-red-600 hover:text-red-900">Delete</button>
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
        title={editingRepair ? 'Edit Repair' : 'Add New Repair'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Member *</label>
            <select
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.member}
              onChange={(e) => setForm({ ...form, member: e.target.value })}
              disabled={submitting || !!editingRepair}
            >
              <option value="">Select a member</option>
              {members.map(m => (
                <option key={m.id} value={m.id}>{m.name} {m.room_number ? `(Room ${m.room_number})` : ''}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item Name *</label>
            <input
              type="text"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.item_name}
              onChange={(e) => setForm({ ...form, item_name: e.target.value })}
              disabled={submitting}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Repair Date *</label>
              <input
                type="date"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.repair_date}
                onChange={(e) => setForm({ ...form, repair_date: e.target.value })}
                disabled={submitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Cost *</label>
              <input
                type="number"
                step="0.01"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.cost}
                onChange={(e) => setForm({ ...form, cost: e.target.value })}
                disabled={submitting}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Replaced By</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.replaced_by}
              onChange={(e) => setForm({ ...form, replaced_by: e.target.value })}
              disabled={submitting}
            />
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
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              disabled={submitting}
            >
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
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
              {submitting ? 'Saving...' : editingRepair ? 'Update' : 'Add Repair'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
