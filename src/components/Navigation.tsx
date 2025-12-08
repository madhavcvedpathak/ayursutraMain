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
        <nav className="sticky top-0 z-50 flex items-center justify-between px-4 py-3 md:px-8 md:py-4 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all duration-300">
            <Link to="/" className="flex items-center gap-3 md:gap-4 no-underline group">
                <img src={logo} alt="Ayursutra Logo" className="h-[50px] md:h-[75px] object-contain transition-transform group-hover:scale-105" />
                <h1 className="font-serif text-[2rem] md:text-[2.5rem] font-bold m-0 tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#1b5e20] to-[#2e7d32] drop-shadow-sm">
                    Ayursutra
                </h1>
            </Link>

            {/* Desktop & Scrollable Mobile Menu Container */}
            <div className="flex items-center gap-4 overflow-x-auto md:overflow-visible pb-1 md:pb-0 scrollbar-hide snap-x md:snap-none">
                <Link to="/" className="text-brand-deep/80 hover:text-brand-deep font-forum text-lg font-medium px-2 py-1 transition-colors whitespace-nowrap snap-center no-underline">Home</Link>
                <Link to="/#therapies" className="text-brand-deep/80 hover:text-brand-deep font-forum text-lg font-medium px-2 py-1 transition-colors whitespace-nowrap snap-center no-underline">Therapies</Link>

                {currentUser ? (
                    <div className="flex items-center gap-3 md:gap-4 border-l border-gray-200 pl-4 snap-center">
                        <Link to={getDashboardLink()} className="flex items-center gap-2 text-brand-teal hover:text-brand-ocean font-medium transition-colors whitespace-nowrap no-underline">
                            <LayoutDashboard size={18} />
                            <span className="hidden md:inline">Dashboard</span>
                        </Link>

                        <Link to="/profile" className="min-w-[36px] min-h-[36px] md:w-10 md:h-10 rounded-full bg-brand-sage text-brand-deep flex items-center justify-center hover:bg-brand-teal hover:text-white transition-all shadow-sm no-underline">
                            <User size={18} />
                        </Link>

                        <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors p-1 bg-transparent border-none cursor-pointer">
                            <LogOut size={20} />
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-3 snap-center pl-2">
                        <Link to="/login" className="text-brand-deep font-medium hover:text-brand-teal transition-colors whitespace-nowrap no-underline">Login</Link>
                        <Link to="/register" className="bg-brand-teal text-white px-5 py-2 rounded-full font-medium shadow-brand hover:bg-brand-ocean hover:-translate-y-0.5 transition-all whitespace-nowrap text-sm md:text-base no-underline cursor-pointer block">
                            Get Started
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
};
