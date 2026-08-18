import { useState, useEffect } from 'react';
import useAuthStore from '../store/authStore';
import useBookingStore from '../store/bookingStore';
import { useNavigate } from 'react-router-dom';
import useReviewStore from '../store/reviewStore';

const UserProfile = () => {
    const { user, updateProfile, requestPasswordChange, verifyPasswordChange, isLoading, error, clearError } = useAuthStore();
    const { myBookings, fetchMyBookings, loading: bookingsLoading } = useBookingStore();
    const { createReview, loading: reviewLoading } = useReviewStore();
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('Overview');
    
    // Profile State
    const [profileSuccess, setProfileSuccess] = useState('');
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phone: ''
    });

    // Password State
    const [passwordError, setPasswordError] = useState('');
    const [passwordSuccess, setPasswordSuccess] = useState('');
    const [pwdData, setPwdData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    
    // OTP Modal State
    const [showOTPModal, setShowOTPModal] = useState(false);
    const [otp, setOtp] = useState('');

    // Review Modal State
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [reviewBooking, setReviewBooking] = useState(null);
    const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
    const [reviewError, setReviewError] = useState('');
    const [reviewSuccess, setReviewSuccess] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            setProfileData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || ''
            });
            fetchMyBookings();
        }
        return () => clearError();
    }, [user, navigate, fetchMyBookings, clearError]);

    // Handle Profile Update
    const handleProfileChange = (e) => setProfileData({ ...profileData, [e.target.name]: e.target.value });
    
    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setProfileSuccess('');
        const result = await updateProfile(profileData);
        if (result.success) {
            setProfileSuccess('Profile updated successfully!');
            setTimeout(() => setProfileSuccess(''), 4000);
        }
    };

    // Handle Password Update Flow
    const handlePwdChange = (e) => setPwdData({ ...pwdData, [e.target.name]: e.target.value });
    
    const handlePwdSubmit = async (e) => {
        e.preventDefault();
        setPasswordError('');
        setPasswordSuccess('');
        
        if (pwdData.newPassword !== pwdData.confirmPassword) {
            setPasswordError('Passwords do not match');
            return;
        }
        if (pwdData.newPassword.length < 6) {
            setPasswordError('Password must be at least 6 characters');
            return;
        }

        const result = await requestPasswordChange();
        if (result.success) {
            setShowOTPModal(true);
        } else {
            setPasswordError(result.error || 'Failed to request password change');
        }
    };

    const handleOTPVerify = async (e) => {
        e.preventDefault();
        const result = await verifyPasswordChange(otp, pwdData.newPassword);
        if (result.success) {
            setShowOTPModal(false);
            setOtp('');
            setPwdData({ newPassword: '', confirmPassword: '' });
            setPasswordSuccess('Password successfully changed!');
            setTimeout(() => setPasswordSuccess(''), 4000);
        }
    };

    if (!user) return null;

    // Derived stats
    const activeBookings = myBookings.filter(b => ['Approved', 'Active'].includes(b.status));
    const pastBookings = myBookings.filter(b => ['Completed', 'Cancelled', 'Rejected'].includes(b.status));

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        setReviewError('');
        const result = await createReview({
            vehicleId: reviewBooking.vehicleId._id,
            bookingId: reviewBooking._id,
            rating: reviewData.rating,
            comment: reviewData.comment
        });
        if (result.success) {
            setReviewSuccess('Review submitted successfully!');
            setTimeout(() => {
                setShowReviewModal(false);
                setReviewSuccess('');
                setReviewBooking(null);
                setReviewData({ rating: 5, comment: '' });
            }, 2000);
        } else {
            setReviewError(result.error);
        }
    };

    return (
        <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-zinc-900/40 via-zinc-950 to-zinc-950 px-6 pt-32 pb-12 relative overflow-hidden text-white">
            
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-center md:items-end justify-between mb-12 text-white">
                    <div className="flex items-center gap-6">
                        <div className="relative group">
                            <div className="w-24 h-24 bg-zinc-900/50 backdrop-blur-xl rounded-2xl flex items-center justify-center text-4xl font-heading font-black uppercase border border-zinc-800 shadow-2xl transition-transform duration-300 group-hover:scale-105">
                                {user.name.charAt(0)}
                            </div>
                            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full border-2 border-zinc-950" title="Online"></div>
                        </div>
                        <div>
                            <h1 className="text-4xl font-heading font-black uppercase tracking-tighter">{user.name}</h1>
                            <p className="text-zinc-500 mt-1 flex items-center gap-2">
                                <span className="font-mono text-sm">{user.email}</span>
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-zinc-300 border border-zinc-700 uppercase tracking-widest">{user.role}</span>
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Sidebar Navigation */}
                    <aside className="lg:col-span-3">
                        <div className="bg-zinc-900/60 backdrop-blur-xl rounded-3xl shadow-sm border border-zinc-800 p-4 sticky top-32">
                            <nav className="space-y-2">
                                {[
                                    { id: 'Overview', icon: '📊' },
                                    { id: 'Bookings', icon: '🚗' },
                                    { id: 'Security', icon: '🔒' }
                                ].map(tab => (
                                    <button 
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 ${
                                            activeTab === tab.id 
                                            ? 'bg-white text-zinc-950 shadow-[0_0_15px_rgba(255,255,255,0.2)]' 
                                            : 'text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300'
                                        }`}
                                    >
                                        <span className="text-xl">{tab.icon}</span>
                                        {tab.id}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main className="lg:col-span-9 space-y-6">
                        
                        {/* OVERVIEW TAB */}
                        {activeTab === 'Overview' && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                    <div className="bg-zinc-900/60 backdrop-blur-xl rounded-3xl p-6 border border-zinc-800 shadow-sm relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
                                        <div className="relative z-10">
                                            <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">Total Bookings</h3>
                                            <div className="text-5xl font-heading font-black text-white">{myBookings.length}</div>
                                        </div>
                                    </div>
                                    <div className="bg-zinc-900/60 backdrop-blur-xl rounded-3xl p-6 border border-zinc-800 shadow-sm relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
                                        <div className="relative z-10">
                                            <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">Active Rentals</h3>
                                            <div className="text-5xl font-heading font-black text-white">{activeBookings.length}</div>
                                        </div>
                                    </div>
                                    <div className="bg-zinc-900/60 backdrop-blur-xl rounded-3xl p-6 border border-zinc-800 shadow-sm relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
                                        <div className="relative z-10">
                                            <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">Past Trips</h3>
                                            <div className="text-5xl font-heading font-black text-white">{pastBookings.length}</div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-zinc-900/60 backdrop-blur-xl rounded-3xl shadow-sm border border-zinc-800 p-8 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-2 h-full bg-emerald-500"></div>
                                    <h2 className="text-2xl font-heading font-black uppercase tracking-widest text-white mb-6">Personal Details</h2>
                                    
                                    {profileSuccess && (
                                        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center gap-3 text-xs font-bold uppercase tracking-widest">
                                            <span>✅</span> {profileSuccess}
                                        </div>
                                    )}

                                    <form onSubmit={handleProfileSubmit} className="space-y-6 max-w-2xl">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Full Name</label>
                                                <input type="text" name="name" value={profileData.name} onChange={handleProfileChange} required className="w-full bg-zinc-950 border border-zinc-800 rounded-xl text-white px-4 py-3 text-sm focus:border-white focus:ring-1 focus:ring-white outline-none transition-all" />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Phone Number</label>
                                                <input type="tel" name="phone" value={profileData.phone} onChange={handleProfileChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl text-white px-4 py-3 text-sm focus:border-white focus:ring-1 focus:ring-white outline-none transition-all placeholder-zinc-700" placeholder="+1 (555) 000-0000" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Email Address</label>
                                            <input type="email" name="email" value={profileData.email} disabled className="w-full bg-zinc-950/50 border border-zinc-800 rounded-xl text-zinc-500 px-4 py-3 text-sm cursor-not-allowed opacity-50" />
                                        </div>
                                        <div className="pt-4">
                                            <button type="submit" disabled={isLoading} className="bg-white text-zinc-950 hover:bg-zinc-300 rounded-xl px-8 py-3 text-xs font-black uppercase tracking-[0.2em] transition-colors">
                                                {isLoading ? 'Processing...' : 'Commit Updates'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                        {/* BOOKINGS TAB */}
                        {activeTab === 'Bookings' && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                                <div className="flex justify-between items-center bg-zinc-900/60 backdrop-blur-xl p-6 rounded-3xl shadow-sm border border-zinc-800">
                                    <h2 className="text-2xl font-heading font-black uppercase tracking-widest text-white">Your Fleet Trips</h2>
                                    <button onClick={() => navigate('/vehicles')} className="text-zinc-400 hover:text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-colors">
                                        Book another vehicle <span className="text-emerald-500">→</span>
                                    </button>
                                </div>
                                
                                {bookingsLoading ? (
                                    <div className="flex justify-center py-12">
                                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
                                    </div>
                                ) : myBookings.length === 0 ? (
                                    <div className="bg-zinc-900/60 backdrop-blur-xl rounded-3xl p-12 text-center border border-zinc-800 shadow-sm">
                                        <div className="w-24 h-24 bg-zinc-950 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 border border-zinc-800 shadow-xl">🏜️</div>
                                        <h3 className="text-2xl font-heading font-black uppercase tracking-widest text-white mb-2">No active bookings</h3>
                                        <p className="text-zinc-500 mb-8 max-w-sm mx-auto font-mono text-sm">Ready for your next adventure? Browse our premium fleet and hit the road today.</p>
                                        <button onClick={() => navigate('/vehicles')} className="bg-white text-zinc-950 hover:bg-zinc-300 rounded-xl px-8 py-3 text-xs font-black uppercase tracking-[0.2em] transition-colors">Explore Fleet</button>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {myBookings.map(booking => (
                                            <div key={booking._id} className="bg-zinc-900/60 backdrop-blur-xl rounded-3xl p-6 border border-zinc-800 shadow-sm hover:border-zinc-600 transition-all group flex flex-col md:flex-row gap-6 items-center">
                                                <div className="w-full md:w-48 h-32 bg-zinc-950 rounded-2xl overflow-hidden relative flex-shrink-0 border border-zinc-800">
                                                    {booking.vehicleId?.images && booking.vehicleId.images[0] ? (
                                                        <img src={booking.vehicleId.images[0]} alt="vehicle" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-zinc-600 font-mono text-xs uppercase tracking-widest">No Image</div>
                                                    )}
                                                    <div className="absolute top-2 right-2">
                                                        <span className={`backdrop-blur-md px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest border ${
                                                            booking.status === 'Pending' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                                                            booking.status === 'Approved' || booking.status === 'Active' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                                                            'bg-zinc-800/80 border-zinc-700 text-zinc-300'
                                                        }`}>
                                                            {booking.status}
                                                        </span>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex-1 w-full">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <div>
                                                            <h4 className="font-heading font-black text-xl text-white group-hover:text-emerald-400 transition-colors uppercase tracking-wider">
                                                                {booking.vehicleId?.brand} {booking.vehicleId?.model}
                                                            </h4>
                                                            <p className="text-xs font-mono text-zinc-500 mt-2 flex items-center gap-3">
                                                                <span className="text-zinc-400">📅 {new Date(booking.startDate).toLocaleDateString()}</span>
                                                                <span className="text-zinc-700">→</span>
                                                                <span className="text-zinc-400">{new Date(booking.endDate).toLocaleDateString()}</span>
                                                            </p>
                                                        </div>
                                                        <div className="text-right flex flex-col items-end">
                                                            <div className="font-black font-heading text-2xl text-emerald-400">₹{booking.totalAmount}</div>
                                                            <span className={`inline-block mt-1 px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border ${
                                                                booking.isPaid ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                                                            }`}>
                                                                {booking.isPaid ? 'Paid' : 'Unpaid'}
                                                            </span>
                                                            {booking.status === 'Completed' && (
                                                                <button
                                                                    onClick={() => {
                                                                        setReviewBooking(booking);
                                                                        setShowReviewModal(true);
                                                                    }}
                                                                    className="mt-4 px-4 py-2 border border-zinc-700 hover:border-white text-zinc-300 hover:text-white rounded-lg text-[10px] font-bold uppercase tracking-widest transition-colors shadow-sm"
                                                                >
                                                                    Write Review
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                    
                                                    {['Pending', 'Approved', 'Active'].includes(booking.status) && (
                                                        <div className="mt-4 bg-red-950/20 border border-red-500/20 rounded-lg p-3 flex gap-2 items-start">
                                                            <span className="text-red-500 text-sm font-bold">!</span>
                                                            <p className="text-red-400/80 text-[10px] uppercase tracking-widest font-bold leading-relaxed">
                                                                Document Reminder: Original Aadhar card and last month's light bill are required at pickup.
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* SECURITY TAB */}
                        {/* SECURITY TAB */}
                        {activeTab === 'Security' && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <div className="bg-zinc-900/60 backdrop-blur-xl rounded-3xl shadow-sm border border-zinc-800 p-8 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform hover:scale-150"></div>
                                    <div className="flex items-center gap-4 mb-8 border-b border-zinc-800 pb-6">
                                        <div className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center text-xl border border-rose-500/20">🔒</div>
                                        <div>
                                            <h2 className="text-2xl font-heading font-black uppercase tracking-widest text-white">Security Settings</h2>
                                            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-1">Update your password to keep your account secure.</p>
                                        </div>
                                    </div>

                                    {(error || passwordError) && (
                                        <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl flex items-start gap-3 text-xs font-bold uppercase tracking-widest">
                                            <span>⚠️</span> <p>{error || passwordError}</p>
                                        </div>
                                    )}
                                    {passwordSuccess && (
                                        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-2xl flex items-center gap-3 text-xs font-bold uppercase tracking-widest">
                                            <span>✅</span> {passwordSuccess}
                                        </div>
                                    )}

                                    <form onSubmit={handlePwdSubmit} className="max-w-md space-y-6 relative z-10">
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">New Password</label>
                                            <input 
                                                type="password" 
                                                name="newPassword" 
                                                value={pwdData.newPassword} 
                                                onChange={handlePwdChange} 
                                                required 
                                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl text-white px-4 py-3 text-sm focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Confirm New Password</label>
                                            <input 
                                                type="password" 
                                                name="confirmPassword" 
                                                value={pwdData.confirmPassword} 
                                                onChange={handlePwdChange} 
                                                required 
                                                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl text-white px-4 py-3 text-sm focus:border-rose-500 focus:ring-1 focus:ring-rose-500 outline-none transition-all"
                                            />
                                        </div>
                                        <div className="pt-4">
                                            <button 
                                                type="submit" 
                                                disabled={isLoading} 
                                                className="bg-white text-zinc-950 hover:bg-zinc-300 font-black rounded-xl px-8 py-3 uppercase tracking-[0.2em] transition-colors w-full md:w-auto text-xs"
                                            >
                                                {isLoading ? 'Processing...' : 'Update Password'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>

            {/* OTP VERIFICATION MODAL */}
            {showOTPModal && (
                <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] max-w-md w-full p-8 animate-in zoom-in-95 duration-200 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                        <div className="text-center mb-8 relative z-10">
                            <div className="w-16 h-16 bg-blue-500/10 text-blue-500 border border-blue-500/20 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                                ✉️
                            </div>
                            <h3 className="text-2xl font-heading font-black uppercase tracking-widest text-white mb-2">Check your email</h3>
                            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-2">
                                We've sent a 6-digit verification code to <span className="text-white font-mono">{user.email}</span>.
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-3 bg-rose-500/10 text-rose-400 rounded-xl text-xs font-bold uppercase tracking-widest text-center border border-rose-500/20">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleOTPVerify} className="space-y-6 relative z-10">
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2 text-center">Verification Code</label>
                                <input 
                                    type="text" 
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    maxLength="6"
                                    placeholder="------"
                                    className="w-full text-center text-3xl tracking-[0.5em] font-mono px-4 py-4 rounded-xl border border-zinc-800 bg-zinc-950 text-white focus:border-white focus:ring-1 focus:ring-white outline-none placeholder-zinc-800 transition-all"
                                    required
                                />
                            </div>
                            
                            <div className="flex gap-3">
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setShowOTPModal(false);
                                        clearError();
                                    }}
                                    className="flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest text-zinc-400 bg-zinc-800 hover:bg-zinc-700 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={isLoading || otp.length !== 6}
                                    className="flex-1 bg-white text-zinc-950 py-3 rounded-xl text-xs font-black uppercase tracking-[0.2em] hover:bg-zinc-300 disabled:opacity-50 transition-all"
                                >
                                    {isLoading ? 'Verifying...' : 'Verify'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* REVIEW MODAL */}
            {showReviewModal && reviewBooking && (
                <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.5)] max-w-lg w-full p-8 animate-in zoom-in-95 duration-200 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
                        <div className="text-center mb-6 relative z-10">
                            <h3 className="text-2xl font-heading font-black uppercase tracking-widest text-white mb-2">Rate your trip</h3>
                            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mt-2">
                                How was your experience with the <span className="text-emerald-400">{reviewBooking.vehicleId?.brand} {reviewBooking.vehicleId?.model}</span>?
                            </p>
                        </div>

                        {reviewError && (
                            <div className="mb-6 p-3 bg-rose-500/10 text-rose-400 rounded-xl text-xs font-bold uppercase tracking-widest text-center border border-rose-500/20 relative z-10">
                                {reviewError}
                            </div>
                        )}
                        {reviewSuccess && (
                            <div className="mb-6 p-3 bg-emerald-500/10 text-emerald-400 rounded-xl text-xs font-bold uppercase tracking-widest text-center border border-emerald-500/20 relative z-10">
                                {reviewSuccess}
                            </div>
                        )}

                        <form onSubmit={handleReviewSubmit} className="space-y-6 relative z-10">
                            <div className="flex justify-center gap-4 py-4">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        type="button"
                                        key={star}
                                        onClick={() => setReviewData({ ...reviewData, rating: star })}
                                        className={`text-4xl transition-transform hover:scale-125 ${
                                            star <= reviewData.rating ? 'text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.5)]' : 'text-zinc-800'
                                        }`}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>
                            
                            <div>
                                <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Your Review</label>
                                <textarea
                                    value={reviewData.comment}
                                    onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                                    required
                                    rows="4"
                                    placeholder="Tell others about your experience..."
                                    className="w-full bg-zinc-950 border border-zinc-800 rounded-xl text-white px-4 py-3 text-sm focus:border-white focus:ring-1 focus:ring-white outline-none resize-none transition-all placeholder-zinc-700"
                                ></textarea>
                            </div>
                            
                            <div className="flex gap-3 pt-4">
                                <button 
                                    type="button" 
                                    onClick={() => {
                                        setShowReviewModal(false);
                                        setReviewError('');
                                        setReviewSuccess('');
                                    }}
                                    className="flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest text-zinc-400 bg-zinc-800 hover:bg-zinc-700 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={reviewLoading}
                                    className="flex-1 bg-white text-zinc-950 py-3 rounded-xl text-xs font-black uppercase tracking-[0.2em] hover:bg-zinc-300 disabled:opacity-50 transition-all"
                                >
                                    {reviewLoading ? 'Submitting...' : 'Submit Review'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;
