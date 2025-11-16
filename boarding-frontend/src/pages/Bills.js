import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBills, addBill, updateBill, removeBill } from '../redux/billSlice'
import { fetchMembers } from '../redux/memberSlice'
import api from '../services/api'
import Modal from '../components/Modal'
import Badge from '../components/Badge'

export default function Bills() {
  const dispatch = useDispatch()
  const { list: bills, status } = useSelector(state => state.bills)
  const { list: members } = useSelector(state => state.members)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBill, setEditingBill] = useState(null)
  const [monthFilter, setMonthFilter] = useState('All')
  const [form, setForm] = useState({
    member: '',
    month: '',
    water_amount: 0,
    electricity_amount: 0,
    balance: 0,
    paid_status: 'Unpaid'
  })
  const [submitError, setSubmitError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    dispatch(fetchBills())
    dispatch(fetchMembers())
  }, [dispatch])

  const filteredBills = monthFilter === 'All' 
    ? bills 
    : bills.filter(b => b.month === monthFilter)

  const uniqueMonths = [...new Set(bills.map(b => b.month))].sort().reverse()

  const openAddModal = () => {
    setEditingBill(null)
    setForm({ member: '', month: '', water_amount: 0, electricity_amount: 0, balance: 0, paid_status: 'Unpaid' })
    setSubmitError(null)
    setIsModalOpen(true)
  }

  const openEditModal = (bill) => {
    setEditingBill(bill)
    setForm({
      member: typeof bill.member === 'object' ? bill.member.id : bill.member,
      month: bill.month,
      water_amount: bill.water_amount,
      electricity_amount: bill.electricity_amount,
      balance: bill.balance,
      paid_status: bill.paid_status
    })
    setSubmitError(null)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingBill(null)
    setSubmitError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError(null)

    try {
      const billData = { ...form, member: parseInt(form.member) }
      if (editingBill) {
        const res = await api.patch(`/bills/${editingBill.id}/`, billData)
        dispatch(updateBill(res.data))
      } else {
        const res = await api.post('/bills/', billData)
        dispatch(addBill(res.data))
      }
      closeModal()
    } catch (err) {
      setSubmitError(err.response?.data?.detail || 'Failed to save bill')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this bill?')) return
    try {
      await api.delete(`/bills/${id}/`)
      dispatch(removeBill(id))
    } catch (err) {
      alert('Failed to delete bill')
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Bills</h2>
          <p className="text-sm text-gray-500 mt-1">Track monthly water and electricity bills</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <span>+</span>
          <span>Add Bill</span>
        </button>
      </div>

      {/* Month Filter */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <select
          className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
        >
          <option value="All">All Months</option>
          {uniqueMonths.map(month => (
            <option key={month} value={month}>{month}</option>
          ))}
        </select>
      </div>

      {status === 'loading' ? (
        <div className="text-center py-12">Loading bills...</div>
      ) : filteredBills.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500">No bills found. Add one to get started!</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Member</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Month</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Water</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Electricity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredBills.map((bill) => {
                  const memberName = bill.member_name || (typeof bill.member === 'object' ? bill.member?.name : 'N/A')
                  return (
                    <tr key={bill.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{memberName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{bill.month}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{bill.water_amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{bill.electricity_amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{bill.balance}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={bill.paid_status === 'Paid' ? 'success' : 'danger'}>
                          {bill.paid_status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => openEditModal(bill)} className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                        <button onClick={() => handleDelete(bill.id)} className="text-red-600 hover:text-red-900">Delete</button>
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
        title={editingBill ? 'Edit Bill' : 'Add New Bill'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Member *</label>
            <select
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.member}
              onChange={(e) => setForm({ ...form, member: e.target.value })}
              disabled={submitting || !!editingBill}
            >
              <option value="">Select a member</option>
              {members.map(m => (
                <option key={m.id} value={m.id}>{m.name} {m.room_number ? `(Room ${m.room_number})` : ''}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Month *</label>
            <input
              type="text"
              required
              placeholder="e.g., Nov-2025"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.month}
              onChange={(e) => setForm({ ...form, month: e.target.value })}
              disabled={submitting}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Water Amount</label>
              <input
                type="number"
                step="0.01"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.water_amount}
                onChange={(e) => setForm({ ...form, water_amount: e.target.value })}
                disabled={submitting}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Electricity Amount</label>
              <input
                type="number"
                step="0.01"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.electricity_amount}
                onChange={(e) => setForm({ ...form, electricity_amount: e.target.value })}
                disabled={submitting}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Balance</label>
            <input
              type="number"
              step="0.01"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.balance}
              onChange={(e) => setForm({ ...form, balance: e.target.value })}
              disabled={submitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status *</label>
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.paid_status}
              onChange={(e) => setForm({ ...form, paid_status: e.target.value })}
              disabled={submitting}
            >
              <option value="Paid">Paid</option>
              <option value="Unpaid">Unpaid</option>
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
              {submitting ? 'Saving...' : editingBill ? 'Update' : 'Add Bill'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
