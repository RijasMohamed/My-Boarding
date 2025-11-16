import React from 'react'

export default function Card({ title, value, icon, color = 'blue', subtitle, onClick }) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    yellow: 'bg-yellow-50 text-yellow-600 border-yellow-200',
    red: 'bg-red-50 text-red-600 border-red-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
  }

  return (
    <div
      className={`bg-white shadow rounded-2xl p-6 border-2 ${colorClasses[color]} hover:shadow-lg transition-all cursor-pointer`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-gray-500 text-sm font-medium uppercase">{title}</h3>
        {icon && <div className="text-2xl">{icon}</div>}
      </div>
      <p className="text-3xl font-bold mb-1">{value}</p>
      {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
    </div>
  )
}

