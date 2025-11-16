import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/members', label: 'Members', icon: '👥' },
  { path: '/schedules', label: 'Schedules', icon: '📅' },
  { path: '/payments', label: 'Payments', icon: '💰' },
  { path: '/bills', label: 'Bills', icon: '🧾' },
  { path: '/repairs', label: 'Repairs', icon: '🔧' },
  { path: '/notifications', label: 'Notifications', icon: '🔔' },
  { path: '/settings', label: 'Settings', icon: '⚙️' },
]

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation()

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-slate-800 text-white w-64 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 border-b border-slate-700">
          <h1 className="text-2xl font-bold">🏠 Boarding House</h1>
          <p className="text-sm text-slate-400 mt-1">Management System</p>
        </div>

        <nav className="mt-6">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path || 
                           (item.path === '/dashboard' && location.pathname === '/')
            return (
              <Link
                key={item.path}
                to={item.path === '/dashboard' ? '/' : item.path}
                onClick={onClose}
                className={`flex items-center px-6 py-3 text-gray-300 hover:bg-slate-700 hover:text-white transition-colors ${
                  isActive ? 'bg-slate-700 text-white border-r-4 border-blue-500' : ''
                }`}
              >
                <span className="mr-3 text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="absolute bottom-0 w-full p-6 border-t border-slate-700">
          <p className="text-xs text-slate-400 text-center">
            © Boarding House Management System 2025
          </p>
        </div>
      </aside>
    </>
  )
}

