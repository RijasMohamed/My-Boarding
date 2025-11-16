import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

const pageTitles = {
  '/': 'Dashboard',
  '/dashboard': 'Dashboard',
  '/members': 'Members',
  '/schedules': 'Schedules',
  '/payments': 'Payments',
  '/bills': 'Bills',
  '/repairs': 'Repairs',
  '/notifications': 'Notifications',
  '/settings': 'Settings',
}

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const pageTitle = pageTitles[location.pathname] || 'Dashboard'

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-64">
        <Topbar onMenuClick={() => setSidebarOpen(true)} pageTitle={pageTitle} />
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

