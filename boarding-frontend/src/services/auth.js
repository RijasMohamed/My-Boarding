import api from './api'

export async function login(username, password){
  const res = await api.post('/auth/token/', {username, password})
  const {access, refresh} = res.data
  localStorage.setItem('access', access)
  localStorage.setItem('refresh', refresh)
  return res.data
}

export function logout(){
  localStorage.removeItem('access')
  localStorage.removeItem('refresh')
}

export function getAccess(){
  return localStorage.getItem('access')
}
