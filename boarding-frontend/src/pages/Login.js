import React, {useState} from 'react'
import api from '../services/api'
import {useNavigate} from 'react-router-dom'

export default function Login(){
  const [username, setUsername] = useState('admin')
  const [password, setPassword] = useState('admin123')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try{
      console.log('[LOGIN] Attempting login with:', username)
      const res = await api.post('/auth/token/', {username, password})
      const {access, refresh} = res.data
      localStorage.setItem('access', access)
      localStorage.setItem('refresh', refresh)
      setError(null)
      console.log('[LOGIN] Success! Token stored')
      navigate('/', { replace: true })
    }catch(err){
      console.error('[LOGIN] Error:', err.response?.data || err.message)
      setError('Invalid credentials or backend not reachable')
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🏠 Boarding House</h1>
          <p className="text-gray-500">Management System</p>
        </div>
        <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">Sign In</h2>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input 
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
              value={username} 
              onChange={e=>setUsername(e.target.value)}
              placeholder="admin"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input 
              type="password" 
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" 
              value={password} 
              onChange={e=>setPassword(e.target.value)}
              placeholder="admin123"
              disabled={loading}
            />
          </div>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          <div>
            <button 
              disabled={loading}
              className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition-colors font-medium"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
          <div className="text-xs text-gray-500 mt-4 text-center">
            Demo credentials: admin / admin123
          </div>
        </form>
      </div>
    </div>
  )
}

