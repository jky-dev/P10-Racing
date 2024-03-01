import React, { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

import { useSupabaseContext } from './contexts/SupabaseContext'

interface ProtectedRouteProps {
  admin?: boolean
  children: ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  admin = false,
  children,
}) => {
  const { user, isAdmin } = useSupabaseContext()
  const navigate = useNavigate()

  const checkUser = () => {
    if (!user) {
      navigate('/')
    }

    if (admin && !isAdmin) {
      navigate('/')
    }
  }

  React.useEffect(() => {
    checkUser()
  }, [])

  if (!user) return null

  return <>{children}</>
}

export default ProtectedRoute
