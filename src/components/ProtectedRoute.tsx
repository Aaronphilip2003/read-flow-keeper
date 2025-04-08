import { useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useNavigate, useLocation } from 'react-router-dom'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        if (!loading && !user) {
            // Store the attempted path in sessionStorage
            sessionStorage.setItem('redirectAfterLogin', location.pathname)
            navigate('/login')
        }
    }, [user, loading, navigate, location])

    if (loading) {
        return <div>Loading...</div>
    }

    if (!user) {
        return null
    }

    return <>{children}</>
}
