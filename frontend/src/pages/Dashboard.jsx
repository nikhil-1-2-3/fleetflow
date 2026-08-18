import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import useBookingStore from '../store/bookingStore';
import VehicleManager from '../components/Admin/VehicleManager';
import BranchManager from '../components/Admin/BranchManager';
import MaintenanceManager from '../components/Admin/MaintenanceManager';

const Dashboard = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const { bookings, fetchAllBookings, updateBookingStatus, loading } = useBookingStore();
    const [activeTab, setActiveTab] = useState('Overview');

    useEffect(() => {
        if (!user || (user.role !== 'admin' && user.role !== 'manager')) {
            navigate('/');
        } else {
            fetchAllBookings();
        }
    }, [user, navigate, fetchAllBookings]);

    if (loading) {
        return <div className="text-center mt-10">Loading dashboard...</div>;
    }

    return (
        <div className="flex flex-col md:flex-row h-screen bg-zinc-950 text-white overflow-hidden -m-6 pt-24 pb-0">
            {/* Sidebar */}
            <aside className="w-full md:w-72 shrink-0 bg-zinc-900/50 backdrop-blur-xl border-b md:border-b-0 md:border-r border-zinc-800 flex flex-col z-20">
                <div className="h-16 md:h-20 flex items-center px-8 border-b border-zinc-800 shrink-0">
                    <span className="font-heading font-black text-xl md:text-2xl uppercase tracking-widest text-white">
                        Fleet<span className="text-zinc-600">Admin</span>
                    </span>
                </div>
                <nav className="flex-none md:flex-1 flex flex-row md:flex-col px-4 py-4 md:py-8 space-x-2 md:space-x-0 md:space-y-2 overflow-x-auto md:overflow-y-auto no-scrollbar">
                    {[
                        { id: 'Overview', label: 'Command Center' },
                        { id: 'Branches', label: 'Branch Network' },
                        { id: 'Vehicles', label: 'Fleet Vehicles' },
                        { id: 'Maintenance', label: 'Service Logs' },
                        { id: 'Bookings', label: 'Active Manifest' }
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)} 
                            className={`w-max shrink-0 md:w-full text-left px-6 py-4 rounded-xl text-xs font-bold uppercase tracking-[0.2em] transition-all duration-300 flex items-center gap-3 ${activeTab === tab.id ? 'bg-white text-zinc-950 shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300'}`}
                        >
                            {activeTab === tab.id && <span className="w-1.5 h-1.5 bg-zinc-950 rounded-full animate-pulse"></span>}
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto p-4 md:p-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-zinc-900/40 via-zinc-950 to-zinc-950 relative">
                
                {activeTab === 'Overview' && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <header className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                            <div>
                                <h2 className="text-4xl font-heading font-black uppercase tracking-tighter text-white">System <span className="text-zinc-600">Overview</span></h2>
                                <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs mt-2">Live Telemetry Data</p>
                            </div>
                            <div className="flex items-center gap-3 bg-zinc-900 border border-zinc-800 px-4 py-2 rounded-lg">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                <span className="text-xs font-bold uppercase tracking-widest text-emerald-500">System Online</span>
                            </div>
                        </header>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                            <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 p-8 rounded-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
                                <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">Total Bookings</h3>
                                <p className="text-6xl font-heading font-black text-white">{bookings.length}</p>
                            </div>
                            <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 p-8 rounded-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
                                <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">Active Rentals</h3>
                                <p className="text-6xl font-heading font-black text-white">
                                    {bookings.filter(b => b.status === 'Active').length}
                                </p>
                            </div>
                            <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 p-8 rounded-2xl relative overflow-hidden group">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl -mr-10 -mt-10 transition-transform group-hover:scale-150"></div>
                                <h3 className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">Pending Approvals</h3>
                                <p className="text-6xl font-heading font-black text-white">
                                    {bookings.filter(b => b.status === 'Pending').length}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'Branches' && (
                    <BranchManager />
                )}

                {activeTab === 'Vehicles' && (
                    <VehicleManager />
                )}

                {activeTab === 'Maintenance' && (
                    <MaintenanceManager />
                )}

                {(activeTab === 'Overview' || activeTab === 'Bookings') && (
                    <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
                        <div className="px-8 py-6 border-b border-zinc-800 bg-zinc-900/80 flex justify-between items-center">
                            <h3 className="font-heading font-black uppercase tracking-widest text-lg text-white">
                                {activeTab === 'Overview' ? 'Recent Manifest' : 'Global Manifest'}
                            </h3>
                            <button className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors">Export CSV</button>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead className="bg-zinc-950/80 text-zinc-500 text-xs font-bold uppercase tracking-widest">
                                    <tr>
                                        <th className="px-8 py-5">Operative</th>
                                        <th className="px-8 py-5">Vehicle</th>
                                        <th className="px-8 py-5">Rental Period</th>
                                        <th className="px-8 py-5">Booking Status</th>
                                        <th className="px-8 py-5">Mission Status</th>
                                        <th className="px-8 py-5 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800 text-zinc-300">
                                    {bookings.slice(0, activeTab === 'Overview' ? 5 : undefined).map((booking) => (
                                        <tr key={booking._id} className="hover:bg-zinc-800/30 transition-colors group">
                                            <td className="px-8 py-6 font-medium text-white">{booking.customerId?.name}</td>
                                            <td className="px-8 py-6">
                                                <div className="font-bold">{booking.vehicleId?.brand}</div>
                                                <div className="text-zinc-500 text-xs uppercase tracking-widest mt-1">{booking.vehicleId?.model}</div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="text-white">{new Date(booking.startDate).toLocaleDateString()} &rarr; {new Date(booking.endDate).toLocaleDateString()}</div>
                                                <div className="text-emerald-500 font-bold mt-1">₹{booking.totalAmount.toLocaleString()}</div>
                                            </td>
                                            <td className="px-8 py-6">
                                                {booking.isPaid ? (
                                                    <div>
                                                        <span className="px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                            Paid: ₹{booking.payment?.amount || booking.totalAmount}
                                                        </span>
                                                        {booking.payment?.providerPaymentId && (
                                                            <div className="text-[10px] text-zinc-600 font-mono mt-2 uppercase">
                                                                TXN: {booking.payment.providerPaymentId.substring(0, 12)}...
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span className="px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest bg-red-500/10 text-red-400 border border-red-500/20">
                                                        Unpaid
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-8 py-6">
                                                <span className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest border ${
                                                    booking.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                                                    booking.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                                                    booking.status === 'Active' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                                                    'bg-zinc-800 text-zinc-400 border-zinc-700'
                                                }`}>
                                                    {booking.status}
                                                </span>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                {booking.status === 'Pending' ? (
                                                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <button onClick={() => updateBookingStatus(booking._id, 'Approved')} className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 hover:text-emerald-400 border border-emerald-500/30 hover:border-emerald-400 px-3 py-1.5 rounded-md transition-all">Approve</button>
                                                        <button onClick={() => updateBookingStatus(booking._id, 'Rejected')} className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-400 border border-red-500/30 hover:border-red-400 px-3 py-1.5 rounded-md transition-all">Reject</button>
                                                    </div>
                                                ) : (
                                                    <span className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">Locked</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                    {bookings.length === 0 && (
                                        <tr>
                                            <td colSpan="6" className="px-8 py-12 text-center text-zinc-500 font-bold uppercase tracking-widest text-sm">No manifest data available</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
