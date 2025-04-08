import { useAuth } from '@/context/AuthContext'
import { Navigate } from 'react-router-dom'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth()

    if (loading) {
        return <div>Loading...</div>
    }

    if (!user) {
        return <Navigate to="/login" />
    }

    return <>{children}</>
}
