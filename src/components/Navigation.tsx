import { LogOut, LayoutDashboard } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';


export const Navigation = () => {
    const { currentUser, role, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const getDashboardLink = () => {
        if (role === 'admin') return '/admin';
        if (role === 'practitioner') return '/practitioner';
        return '/portal';
    };

    return (
        <nav style={{
            padding: '1rem 2rem',
            background: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(0,0,0,0.05)',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '40px', height: '40px', background: 'var(--color-primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>AS</div>
                <h1 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-serif)', color: 'var(--color-text)', margin: 0 }}>Ayursutra</h1>
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <Link to="/" style={{ textDecoration: 'none', color: 'var(--color-text)', fontSize: '0.9rem' }}>Home</Link>
                <Link to="/therapies" style={{ textDecoration: 'none', color: 'var(--color-text)', fontSize: '0.9rem' }}>Therapies</Link>

                {currentUser ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Link to={getDashboardLink()} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', fontWeight: 500 }}>
                            <LayoutDashboard size={18} /> Dashboard
                        </Link>
                        <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666' }}>
                            <LogOut size={18} /> Logout
                        </button>
                        <div style={{ width: '32px', height: '32px', background: '#354f3b', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.8rem' }}>
                            {currentUser.email?.charAt(0)?.toUpperCase()}
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Link to="/login" style={{ textDecoration: 'none', color: 'var(--color-text)', fontWeight: 500 }}>Login</Link>
                        <Link to="/register" style={{
                            textDecoration: 'none',
                            background: 'var(--color-primary)',
                            color: 'white',
                            padding: '0.5rem 1.25rem',
                            borderRadius: '20px',
                            boxShadow: '0 4px 6px rgba(53, 79, 59, 0.2)',
                            transition: 'transform 0.2s'
                        }}>
                            Get Started
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};
