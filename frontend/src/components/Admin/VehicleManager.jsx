import { useState, useEffect } from 'react';
import useVehicleStore from '../../store/vehicleStore';
import useBranchStore from '../../store/branchStore';
import useAuthStore from '../../store/authStore';

const VehicleManager = () => {
    const { vehicles, fetchVehicles, createVehicle, updateVehicle, deleteVehicle } = useVehicleStore();
    const { branches, fetchBranches } = useBranchStore();
    const { user } = useAuthStore();
    
    const [showForm, setShowForm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    
    const initialFormState = {
        brand: '', model: '', type: 'Car', category: 'Economy', pricePerDay: '',
        depositAmount: '', fuelType: 'Petrol', transmission: 'Manual', seats: '5',
        images: [''], features: [''], registrationNumber: '', branchId: ''
    };
    
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        fetchVehicles('', 1);
        fetchBranches();
    }, [fetchVehicles, fetchBranches]);

    const handleAddClick = () => {
        setEditMode(false);
        setFormData(initialFormState);
        setShowForm(true);
    };

    const handleEditClick = (vehicle) => {
        setEditMode(true);
        setSelectedVehicle(vehicle);
        setFormData({
            ...vehicle,
            branchId: vehicle.branchId?._id || vehicle.branchId
        });
        setShowForm(true);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleArrayChange = (e, field, index) => {
        const newArray = [...formData[field]];
        newArray[index] = e.target.value;
        setFormData({ ...formData, [field]: newArray });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        let success = false;
        if (editMode) {
            success = await updateVehicle(selectedVehicle._id, formData);
        } else {
            success = await createVehicle(formData);
        }
        if (success) {
            setShowForm(false);
            fetchVehicles('', 1); // refresh
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl relative">
                <div className="px-8 py-6 border-b border-zinc-800 bg-zinc-900/80 flex justify-between items-center">
                    <h3 className="font-heading font-black uppercase tracking-widest text-lg text-white">Fleet Vehicles</h3>
                    <button onClick={handleAddClick} className="bg-white text-zinc-950 hover:bg-zinc-300 px-4 py-2 rounded-lg text-xs font-black uppercase tracking-[0.2em] transition-colors">Add New Asset</button>
                </div>

                {showForm && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md overflow-y-auto">
                        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl w-full max-w-4xl p-8 my-8 shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                            <h3 className="text-xl font-heading font-black uppercase tracking-widest text-white mb-6 border-b border-zinc-800 pb-4">{editMode ? 'Edit Vehicle' : 'Add New Vehicle'}</h3>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <label className="block text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-2">Manufacturer</label>
                                        <input type="text" name="brand" value={formData.brand} onChange={handleChange} required className="w-full bg-zinc-950 border border-zinc-800 rounded-lg text-white px-4 py-3 text-sm focus:border-white focus:ring-1 focus:ring-white outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-2">Model Designation</label>
                                        <input type="text" name="model" value={formData.model} onChange={handleChange} required className="w-full bg-zinc-950 border border-zinc-800 rounded-lg text-white px-4 py-3 text-sm focus:border-white focus:ring-1 focus:ring-white outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-2">Assigned Branch</label>
                                        <select name="branchId" value={formData.branchId} onChange={handleChange} required className="w-full bg-zinc-950 border border-zinc-800 rounded-lg text-white px-4 py-3 text-sm focus:border-white focus:ring-1 focus:ring-white outline-none transition-all">
                                            <option value="">SELECT BRANCH</option>
                                            {branches.map(b => (
                                                <option key={b._id} value={b._id}>{b.name} - {b.location?.city}</option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div>
                                        <label className="block text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-2">Classification</label>
                                        <select name="type" value={formData.type} onChange={handleChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg text-white px-4 py-3 text-sm focus:border-white focus:ring-1 focus:ring-white outline-none transition-all">
                                            <option value="Car">Car</option><option value="Bike">Bike</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-2">Tier</label>
                                        <select name="category" value={formData.category} onChange={handleChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg text-white px-4 py-3 text-sm focus:border-white focus:ring-1 focus:ring-white outline-none transition-all">
                                            <option value="Economy">Economy</option><option value="Premium">Premium</option>
                                            <option value="Luxury">Luxury</option><option value="SUV">SUV</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-2">Registration Tag</label>
                                        <input type="text" name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} required className="w-full bg-zinc-950 border border-zinc-800 rounded-lg text-white px-4 py-3 text-sm focus:border-white focus:ring-1 focus:ring-white outline-none transition-all font-mono uppercase" />
                                    </div>

                                    <div>
                                        <label className="block text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-2">Daily Rate (₹)</label>
                                        <input type="number" name="pricePerDay" value={formData.pricePerDay} onChange={handleChange} required className="w-full bg-zinc-950 border border-zinc-800 rounded-lg text-emerald-400 font-bold px-4 py-3 text-sm focus:border-white focus:ring-1 focus:ring-white outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-2">Deposit Req (₹)</label>
                                        <input type="number" name="depositAmount" value={formData.depositAmount} onChange={handleChange} required className="w-full bg-zinc-950 border border-zinc-800 rounded-lg text-amber-400 font-bold px-4 py-3 text-sm focus:border-white focus:ring-1 focus:ring-white outline-none transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-2">Powertrain</label>
                                        <select name="fuelType" value={formData.fuelType} onChange={handleChange} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg text-white px-4 py-3 text-sm focus:border-white focus:ring-1 focus:ring-white outline-none transition-all">
                                            <option value="Petrol">Petrol</option><option value="Diesel">Diesel</option>
                                            <option value="Electric">Electric</option><option value="Hybrid">Hybrid</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-2">Vehicle Image URL</label>
                                    <input type="text" value={formData.images[0]} onChange={(e) => handleArrayChange(e, 'images', 0)} required className="w-full bg-zinc-950 border border-zinc-800 rounded-lg text-zinc-400 px-4 py-3 text-xs focus:border-white focus:ring-1 focus:ring-white outline-none transition-all" />
                                </div>

                                <div className="flex justify-end space-x-4 pt-6 border-t border-zinc-800">
                                    <button type="button" onClick={() => setShowForm(false)} className="px-6 py-3 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg text-xs font-bold uppercase tracking-widest transition-colors">Cancel</button>
                                    <button type="submit" className="bg-white text-zinc-950 hover:bg-zinc-300 px-6 py-3 rounded-lg text-xs font-black uppercase tracking-[0.2em] transition-colors">{editMode ? 'Commit Updates' : 'Add Vehicle'}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-zinc-950/80 text-zinc-500 text-xs font-bold uppercase tracking-widest">
                            <tr>
                                <th className="px-8 py-5">Vehicle Details</th>
                                <th className="px-8 py-5">Tag</th>
                                <th className="px-8 py-5">Assigned Branch</th>
                                <th className="px-8 py-5">Financials</th>
                                <th className="px-8 py-5">Status</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800 text-zinc-300">
                            {vehicles.map(vehicle => (
                                <tr key={vehicle._id} className="hover:bg-zinc-800/30 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="font-bold text-white text-base">{vehicle.brand} {vehicle.model}</div>
                                        <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">{vehicle.type} // {vehicle.category}</div>
                                    </td>
                                    <td className="px-8 py-6 font-mono text-zinc-400 uppercase">{vehicle.registrationNumber}</td>
                                    <td className="px-8 py-6 text-zinc-300">{vehicle.branchId?.name || 'UNASSIGNED'}</td>
                                    <td className="px-8 py-6">
                                        <div className="text-emerald-500 font-bold">₹{vehicle.pricePerDay} <span className="text-zinc-500 text-xs font-normal">/ DAY</span></div>
                                        <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">DEP: ₹{vehicle.depositAmount}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest border ${
                                            vehicle.status === 'Available' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                                            vehicle.status === 'Maintenance' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                                            'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                        }`}>
                                            {vehicle.status}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end gap-3">
                                            <button onClick={() => handleEditClick(vehicle)} className="text-[10px] font-bold uppercase tracking-widest text-blue-500 hover:text-blue-400 border border-blue-500/30 hover:border-blue-400 px-3 py-1.5 rounded-md transition-all">Configure</button>
                                            <button onClick={() => deleteVehicle(vehicle._id)} className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-400 border border-red-500/30 hover:border-red-400 px-3 py-1.5 rounded-md transition-all">Retire</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default VehicleManager;
