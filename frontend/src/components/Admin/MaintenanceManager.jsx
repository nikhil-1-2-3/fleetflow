import { useEffect, useState } from 'react';
import useMaintenanceStore from '../../store/maintenanceStore';
import useVehicleStore from '../../store/vehicleStore';

const MaintenanceManager = () => {
    const { records, fetchRecords, createRecord, updateRecord, deleteRecord } = useMaintenanceStore();
    const { vehicles, fetchVehicles } = useVehicleStore();
    
    const [formData, setFormData] = useState({
        vehicleId: '',
        serviceDate: '',
        cost: '',
        description: '',
        serviceCenter: '',
        notes: ''
    });
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchRecords();
        fetchVehicles('', 1); // get vehicles for the dropdown
    }, [fetchRecords, fetchVehicles]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = await createRecord(formData);
        if (success) {
            setShowForm(false);
            setFormData({ vehicleId: '', serviceDate: '', cost: '', description: '', serviceCenter: '', notes: '' });
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="px-8 py-6 border-b border-zinc-800 bg-zinc-900/80 flex justify-between items-center">
                    <h3 className="font-heading font-black uppercase tracking-widest text-lg text-white">Service Logs</h3>
                    <button onClick={() => setShowForm(!showForm)} className="bg-white text-zinc-950 hover:bg-zinc-300 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-[0.2em] transition-colors">
                        {showForm ? 'Cancel Operation' : 'Log Maintenance'}
                    </button>
                </div>
                
                {showForm && (
                    <div className="p-8 border-b border-zinc-800 bg-zinc-950/50">
                        <form onSubmit={handleSubmit}>
                            <h4 className="text-zinc-500 font-bold uppercase tracking-widest text-xs mb-4">Initialize Maintenance Record</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <select name="vehicleId" value={formData.vehicleId} onChange={handleChange} required className="bg-zinc-900 border border-zinc-800 text-white px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-widest focus:border-white focus:ring-1 focus:ring-white outline-none">
                                    <option value="">SELECT VEHICLE</option>
                                    {vehicles.map(v => (
                                        <option key={v._id} value={v._id}>{v.brand} {v.model} ({v.registrationNumber})</option>
                                    ))}
                                </select>
                                <input type="date" name="serviceDate" value={formData.serviceDate} onChange={handleChange} required className="bg-zinc-900 border border-zinc-800 text-white px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-widest focus:border-white focus:ring-1 focus:ring-white outline-none" />
                                <input type="number" name="cost" value={formData.cost} onChange={handleChange} placeholder="EXPENDITURE (₹)" required className="bg-zinc-900 border border-zinc-800 text-white px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-widest focus:border-white focus:ring-1 focus:ring-white outline-none placeholder-zinc-700" />
                                <input type="text" name="serviceCenter" value={formData.serviceCenter} onChange={handleChange} placeholder="SERVICE CENTER" className="bg-zinc-900 border border-zinc-800 text-white px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-widest focus:border-white focus:ring-1 focus:ring-white outline-none placeholder-zinc-700" />
                                <input type="text" name="description" value={formData.description} onChange={handleChange} placeholder="WORK DESCRIPTION" required className="bg-zinc-900 border border-zinc-800 text-white px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-widest focus:border-white focus:ring-1 focus:ring-white outline-none md:col-span-2 placeholder-zinc-700" />
                                <input type="text" name="notes" value={formData.notes} onChange={handleChange} placeholder="ADDITIONAL TELEMETRY / NOTES" className="bg-zinc-900 border border-zinc-800 text-white px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-widest focus:border-white focus:ring-1 focus:ring-white outline-none md:col-span-2 placeholder-zinc-700" />
                            </div>
                            <button type="submit" className="bg-emerald-500 text-zinc-950 hover:bg-emerald-400 px-6 py-3 rounded-lg text-xs font-black uppercase tracking-[0.2em] transition-colors">Commit Record</button>
                        </form>
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-zinc-950/80 text-zinc-500 text-xs font-bold uppercase tracking-widest">
                            <tr>
                                <th className="px-8 py-5">Date</th>
                                <th className="px-8 py-5">Vehicle</th>
                                <th className="px-8 py-5">Log Entry</th>
                                <th className="px-8 py-5">Expenditure</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800 text-zinc-300">
                            {records.map(record => (
                                <tr key={record._id} className="hover:bg-zinc-800/30 transition-colors group">
                                    <td className="px-8 py-6 font-mono text-zinc-400">{new Date(record.serviceDate).toLocaleDateString()}</td>
                                    <td className="px-8 py-6 font-bold text-white">{record.vehicleId?.brand} <span className="text-zinc-500 font-normal uppercase tracking-widest text-xs ml-1">{record.vehicleId?.model}</span></td>
                                    <td className="px-8 py-6 text-zinc-400">{record.description}</td>
                                    <td className="px-8 py-6 text-emerald-500 font-bold">₹{record.cost}</td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest border ${
                                            record.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                        }`}>
                                            {record.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-3">
                                            {record.status !== 'Completed' && (
                                                <button onClick={() => updateRecord(record._id, { status: 'Completed' })} className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 hover:text-emerald-400 border border-emerald-500/30 hover:border-emerald-400 px-3 py-1.5 rounded-md transition-all">Sign Off</button>
                                            )}
                                            <button onClick={() => deleteRecord(record._id)} className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-400 border border-red-500/30 hover:border-red-400 px-3 py-1.5 rounded-md transition-all">Expunge</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {records.length === 0 && (
                                <tr>
                                    <td colSpan="6" className="px-8 py-12 text-center text-zinc-500 font-bold uppercase tracking-widest text-sm">No maintenance records logged</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MaintenanceManager;
