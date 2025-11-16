import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPayments, addPayment, updatePayment, removePayment } from '../redux/paymentSlice'
import { fetchMembers } from '../redux/memberSlice'
import api from '../services/api'
import Modal from '../components/Modal'
import Badge from '../components/Badge'

export default function Payments() {
  const dispatch = useDispatch()
  const { list: payments, status } = useSelector(state => state.payments)
  const { list: members } = useSelector(state => state.members)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingPayment, setEditingPayment] = useState(null)
  const [form, setForm] = useState({
    member: '',
    amount: '',
    collected_by: '',
    status: 'Paid'
  })
  const [submitError, setSubmitError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    dispatch(fetchPayments())
    dispatch(fetchMembers())
  }, [dispatch])

  const openAddModal = () => {
    setEditingPayment(null)
    setForm({ member: '', amount: '', collected_by: '', status: 'Paid' })
    setSubmitError(null)
    setIsModalOpen(true)
  }

  const openEditModal = (payment) => {
    setEditingPayment(payment)
    setForm({
      member: typeof payment.member === 'object' ? payment.member.id : payment.member,
      amount: payment.amount,
      collected_by: payment.collected_by || '',
      status: payment.status
    })
    setSubmitError(null)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingPayment(null)
    setSubmitError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError(null)

    try {
      const paymentData = { ...form, member: parseInt(form.member) }
      if (editingPayment) {
        const res = await api.patch(`/payments/${editingPayment.id}/`, paymentData)
        dispatch(updatePayment(res.data))
      } else {
        const res = await api.post('/payments/', paymentData)
        dispatch(addPayment(res.data))
      }
      closeModal()
    } catch (err) {
      setSubmitError(err.response?.data?.detail || 'Failed to save payment')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this payment?')) return
    try {
      await api.delete(`/payments/${id}/`)
      dispatch(removePayment(id))
    } catch (err) {
      alert('Failed to delete payment')
    }
  }

  const unpaidPayments = payments.filter(p => p.status === 'Unpaid')

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Payments</h2>
          <p className="text-sm text-gray-500 mt-1">Track fee collection and payments</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <span>+</span>
          <span>Add Payment</span>
        </button>
      </div>

      {unpaidPayments.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800">
            <strong>{unpaidPayments.length}</strong> unpaid payment(s) pending
          </p>
        </div>
      )}

      {status === 'loading' ? (
        <div className="text-center py-12">Loading payments...</div>
      ) : payments.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <p className="text-gray-500">No payments yet. Add one to get started!</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Member</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Collected By</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {payments.map((payment) => {
                  const memberName = payment.member_name || (typeof payment.member === 'object' ? payment.member?.name : 'N/A')
                  const isUnpaid = payment.status === 'Unpaid'
                  return (
                    <tr key={payment.id} className={isUnpaid ? 'bg-red-50' : 'hover:bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{memberName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{payment.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.payment_date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.collected_by || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={payment.status === 'Paid' ? 'success' : 'danger'}>
                          {payment.status}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button onClick={() => openEditModal(payment)} className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>
                        <button onClick={() => handleDelete(payment.id)} className="text-red-600 hover:text-red-900">Delete</button>
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
        title={editingPayment ? 'Edit Payment' : 'Add New Payment'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Member *</label>
            <select
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.member}
              onChange={(e) => setForm({ ...form, member: e.target.value })}
              disabled={submitting}
            >
              <option value="">Select a member</option>
              {members.map(m => (
                <option key={m.id} value={m.id}>{m.name} {m.room_number ? `(Room ${m.room_number})` : ''}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
            <input
              type="number"
              step="0.01"
              required
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              disabled={submitting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Collected By</label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.collected_by}
              onChange={(e) => setForm({ ...form, collected_by: e.target.value })}
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
              {submitting ? 'Saving...' : editingPayment ? 'Update' : 'Add Payment'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
