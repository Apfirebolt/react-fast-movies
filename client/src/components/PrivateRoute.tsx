import { Outlet, Navigate } from 'react-router-dom'
import { useAuthStatus } from '../hooks/useAuth'
import Loader from './Loader'

const PrivateRoute = () => {
  const { loggedIn, checkingStatus } = useAuthStatus()

  if (checkingStatus) {
    return <Loader />
  }

  return loggedIn ? <Outlet /> : <Navigate to='/login' />
}

export default PrivateRoute