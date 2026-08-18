import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import useAuthStore from '../store/authStore';

const Header = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        setIsMobileMenuOpen(false);
        navigate('/');
    };

    const closeMenu = () => setIsMobileMenuOpen(false);

    return (
        <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-7xl z-50 transition-all duration-300">
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 border-t-white/20 border-l-white/20 rounded-[15px] flex justify-between items-center py-4 px-6 lg:px-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] relative z-50">
                <Link to="/" onClick={closeMenu} className="flex items-center gap-2 group">
                    <span className="text-xl font-sans font-semibold text-white tracking-tight transition-colors">
                        FleetFlow
                    </span>
                </Link>

                {/* Mobile Hamburger Button */}
                <button 
                    className="md:hidden text-white focus:outline-none p-2"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-10 lg:gap-14">
                    <Link to="/vehicles" className="relative text-sm font-medium text-white/70 hover:text-white transition-colors duration-300 after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:w-0 after:h-[1px] after:bg-white after:transition-all after:duration-300 hover:after:w-full">Fleet</Link>
                    <Link to="/process" className="relative text-sm font-medium text-white/70 hover:text-white transition-colors duration-300 after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:w-0 after:h-[1px] after:bg-white after:transition-all after:duration-300 hover:after:w-full">Process</Link>
                    
                    {user ? (
                        <div className="flex items-center gap-8 lg:gap-10">
                            <Link to="/profile" className="relative text-sm font-medium text-white/70 hover:text-white transition-colors duration-300 after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:w-0 after:h-[1px] after:bg-white after:transition-all after:duration-300 hover:after:w-full">Profile</Link>
                            
                            {(user.role === 'admin' || user.role === 'manager') && (
                                <Link to="/dashboard" className="relative text-sm font-medium text-white/70 hover:text-white transition-colors duration-300 after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:w-0 after:h-[1px] after:bg-white after:transition-all after:duration-300 hover:after:w-full">
                                    Dashboard
                                </Link>
                            )}
                            
                            <button onClick={handleLogout} className="text-sm font-medium px-5 py-2.5 bg-white/10 text-white hover:bg-white hover:text-black rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-6 lg:gap-10">
                            <Link to="/login" className="relative text-sm font-medium text-white/70 hover:text-white transition-colors duration-300 after:content-[''] after:absolute after:-bottom-1.5 after:left-0 after:w-0 after:h-[1px] after:bg-white after:transition-all after:duration-300 hover:after:w-full">Sign In</Link>
                            <Link to="/register" className="text-sm font-medium bg-white text-black px-6 py-2.5 rounded-full transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] hover:scale-105">
                                Register
                            </Link>
                        </div>
                    )}
                </nav>
            </div>

            {/* Mobile Navigation Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-[110%] left-0 w-full bg-black/95 backdrop-blur-2xl border border-white/10 rounded-[15px] p-6 shadow-[0_20px_40px_rgba(0,0,0,0.5)] flex flex-col gap-6 z-40 transform transition-all">
                    <Link to="/vehicles" onClick={closeMenu} className="text-lg font-medium text-white/80 hover:text-white transition-colors">Fleet</Link>
                    <Link to="/process" onClick={closeMenu} className="text-lg font-medium text-white/80 hover:text-white transition-colors">Process</Link>
                    
                    <div className="w-full h-px bg-white/10"></div>
                    
                    {user ? (
                        <>
                            <Link to="/profile" onClick={closeMenu} className="text-lg font-medium text-white/80 hover:text-white transition-colors">Profile</Link>
                            
                            {(user.role === 'admin' || user.role === 'manager') && (
                                <Link to="/dashboard" onClick={closeMenu} className="text-lg font-medium text-white/80 hover:text-white transition-colors">
                                    Dashboard
                                </Link>
                            )}
                            
                            <button onClick={handleLogout} className="text-left text-lg font-medium text-white/80 hover:text-white transition-colors">
                                Logout
                            </button>
                        </>
                    ) : (
                        <div className="flex flex-col gap-4 mt-2">
                            <Link to="/login" onClick={closeMenu} className="text-lg font-medium text-white/80 hover:text-white transition-colors">Sign In</Link>
                            <Link to="/register" onClick={closeMenu} className="text-lg font-medium bg-white text-black px-6 py-4 rounded-xl text-center transition-all hover:bg-zinc-200">
                                Register
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
};

export default Header;
