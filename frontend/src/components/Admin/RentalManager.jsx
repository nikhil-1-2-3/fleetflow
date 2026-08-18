import { useEffect, useState } from 'react';
import useRentalStore from '../../store/rentalStore';
import useBookingStore from '../../store/bookingStore';

const RentalManager = () => {
    const { records, fetchRecords, processCheckOut, processCheckIn } = useRentalStore();
    const { bookings, fetchAllBookings } = useBookingStore();
    
    const [action, setAction] = useState(null); // 'checkout' | 'checkin' | null
    const [selectedItem, setSelectedItem] = useState(null);
    const [formData, setFormData] = useState({
        odometer: '',
        fuelLevel: 'Full',
        conditionNotes: '',
        damageCharges: '0',
        lateCharges: '0'
    });

    useEffect(() => {
        fetchRecords();
        fetchAllBookings();
    }, [fetchRecords, fetchAllBookings]);

    const handleActionClick = (type, item) => {
        setAction(type);
        setSelectedItem(item);
        setFormData({
            odometer: type === 'checkout' ? item.vehicleId?.currentOdometer || 0 : (item.pickup?.odometer || 0),
            fuelLevel: 'Full',
            conditionNotes: '',
            damageCharges: '0',
            lateCharges: '0'
        });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let success = false;
        
        if (action === 'checkout') {
            success = await processCheckOut({
                bookingId: selectedItem._id,
                odometer: Number(formData.odometer),
                fuelLevel: formData.fuelLevel,
                conditionNotes: formData.conditionNotes
            });
        } else if (action === 'checkin') {
            success = await processCheckIn(selectedItem._id, {
                odometer: Number(formData.odometer),
                fuelLevel: formData.fuelLevel,
                conditionNotes: formData.conditionNotes,
                damageCharges: Number(formData.damageCharges),
                lateCharges: Number(formData.lateCharges)
            });
        }

        if (success) {
            setAction(null);
            setSelectedItem(null);
            fetchAllBookings(); // Refresh bookings to update status
        }
    };

    // Filter data
    const approvedBookings = bookings.filter(b => b.status === 'Approved');
    const activeRentals = records.filter(r => !r.return?.date);

    return (
        <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                <h3 className="font-heading font-semibold text-xl text-slate-900 mb-6">Check-in & Check-out</h3>
                
                {action && (
                    <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
                            <h3 className="text-xl font-bold mb-4">
                                {action === 'checkout' ? 'Handover Keys (Check-out)' : 'Receive Vehicle (Check-in)'}
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Odometer Reading</label>
                                    <input type="number" name="odometer" value={formData.odometer} onChange={handleChange} required className="w-full px-3 py-2 border rounded-md" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Fuel Level</label>
                                    <select name="fuelLevel" value={formData.fuelLevel} onChange={handleChange} className="w-full px-3 py-2 border rounded-md">
                                        <option value="Full">Full</option>
                                        <option value="3/4">3/4</option>
                                        <option value="Half">Half</option>
                                        <option value="1/4">1/4</option>
                                        <option value="Empty">Empty</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Condition Notes</label>
                                    <textarea name="conditionNotes" value={formData.conditionNotes} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" rows="3"></textarea>
                                </div>
                                
                                {action === 'checkin' && (
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Damage Charges (₹)</label>
                                            <input type="number" name="damageCharges" value={formData.damageCharges} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Late Charges (₹)</label>
                                            <input type="number" name="lateCharges" value={formData.lateCharges} onChange={handleChange} className="w-full px-3 py-2 border rounded-md" />
                                        </div>
                                    </div>
                                )}
                                
                                <div className="flex justify-end space-x-3 mt-6">
                                    <button type="button" onClick={() => setAction(null)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Cancel</button>
                                    <button type="submit" className="btn-primary">Process {action === 'checkout' ? 'Check-out' : 'Check-in'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Check-Out Queue */}
                    <div>
                        <h4 className="font-medium text-slate-800 mb-4 border-b pb-2">Ready for Pickup (Check-out)</h4>
                        <div className="space-y-3">
                            {approvedBookings.map(booking => (
                                <div key={booking._id} className="p-4 border border-slate-200 rounded-lg flex justify-between items-center bg-slate-50">
                                    <div>
                                        <p className="font-medium">{booking.vehicleId?.brand} {booking.vehicleId?.model}</p>
                                        <p className="text-sm text-slate-500">{booking.customerId?.name}</p>
                                        <p className="text-xs text-slate-400">{new Date(booking.startDate).toLocaleDateString()}</p>
                                    </div>
                                    <button onClick={() => handleActionClick('checkout', booking)} className="px-3 py-1 bg-primary-600 text-white rounded-md text-sm">
                                        Check-out
                                    </button>
                                </div>
                            ))}
                            {approvedBookings.length === 0 && <p className="text-slate-500 text-sm">No vehicles waiting for pickup.</p>}
                        </div>
                    </div>

                    {/* Check-In Queue */}
                    <div>
                        <h4 className="font-medium text-slate-800 mb-4 border-b pb-2">Currently Rented (Awaiting Check-in)</h4>
                        <div className="space-y-3">
                            {activeRentals.map(record => (
                                <div key={record._id} className="p-4 border border-slate-200 rounded-lg flex justify-between items-center bg-emerald-50">
                                    <div>
                                        <p className="font-medium">{record.bookingId?.vehicleId?.brand} {record.bookingId?.vehicleId?.model}</p>
                                        <p className="text-sm text-emerald-600">Rented to {record.bookingId?.customerId?.name}</p>
                                        <p className="text-xs text-emerald-500">Since: {new Date(record.pickup.date).toLocaleDateString()}</p>
                                    </div>
                                    <button onClick={() => handleActionClick('checkin', record)} className="px-3 py-1 bg-emerald-600 text-white rounded-md text-sm">
                                        Check-in
                                    </button>
                                </div>
                            ))}
                            {activeRentals.length === 0 && <p className="text-slate-500 text-sm">No vehicles currently rented out.</p>}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default RentalManager;
