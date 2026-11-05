
import './App.css'
import Landing from './Pages/Landing'
import Login from './Pages/Login'
import Signup from './Pages/Signup'
import Dashboard from './Pages/Dashboard'
import { useEffect } from 'react'
import api from './api'


function App() {
useEffect(() => {
  const fetchUser = async () => {
    try {
      const response = await api.get('/me')
      console.log(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  fetchUser()
}, [])


  const path = window.location.pathname.replace(/\/+$/, '') || '/'

  if (path === '/login') return <Login />
  if (path === '/signup') return <Signup />
  if (path === '/dashboard') return <Dashboard />

  return <Landing />
}

export default App
