import { LogOut, LayoutDashboard, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.jpg';

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
            padding: '0.5rem 2rem',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid rgba(0,0,0,0.05)',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
        }}>
            <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <img src={logo} alt="Ayursutra Logo" style={{ height: '60px', objectFit: 'contain' }} />
            </Link>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <Link to="/" style={{ textDecoration: 'none', color: 'var(--color-text-main)', fontSize: '0.9rem' }}>Home</Link>
                <Link to="/#therapies" style={{ textDecoration: 'none', color: 'var(--color-text-main)', fontSize: '0.9rem' }}>Therapies</Link>

                {currentUser ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Link to={getDashboardLink()} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', fontWeight: 500 }}>
                            <LayoutDashboard size={18} /> Dashboard
                        </Link>
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <Link to="/profile" style={{
                                width: '32px', height: '32px', borderRadius: '50%', background: 'var(--color-primary)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', textDecoration: 'none'
                            }}>
                                <User size={18} />
                            </Link>
                        </div>
                        <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666' }}>
                            <LogOut size={18} />
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Link to="/login" style={{ textDecoration: 'none', color: 'var(--color-text-main)', fontWeight: 500 }}>Login</Link>
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
