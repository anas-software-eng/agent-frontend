
import './App.css'
import Landing from './Pages/Landing'
import Login from './Pages/Login'
import Signup from './Pages/Signup'

function App() {
  const path = window.location.pathname.replace(/\/+$/, '') || '/'

  if (path === '/login') return <Login />
  if (path === '/signup') return <Signup />

  return <Landing />
}

export default App
