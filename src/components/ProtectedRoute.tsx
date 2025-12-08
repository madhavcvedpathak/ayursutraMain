import { Navigate } from 'react-router-dom';
import { useAuth, type Role } from '../context/AuthContext';
import { type ReactNode } from 'react';

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles?: Role[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const { currentUser, role, loading } = useAuth();

    if (loading) {
        return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>Loading...</div>;
    }

    if (!currentUser) {
        return <Navigate to="/login" />;
    }

    if (allowedRoles && role && !allowedRoles.includes(role)) {
        // Redirect to their appropriate dashboard if they try to access a wrong one
        if (role === 'patient') return <Navigate to="/portal" />;
        if (role === 'practitioner') return <Navigate to="/practitioner" />;
        if (role === 'admin') return <Navigate to="/admin" />;
        return <Navigate to="/" />;
    }

    return <>{children}</>;
};
