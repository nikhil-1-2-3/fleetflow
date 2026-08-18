import { useEffect, useState } from 'react';
import useBranchStore from '../../store/branchStore';
import useAuthStore from '../../store/authStore';

const BranchManager = () => {
    const { branches, fetchBranches, createBranch, deleteBranch } = useBranchStore();
    const { user } = useAuthStore();
    
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        phone: '',
        email: ''
    });
    
    useEffect(() => {
        fetchBranches();
    }, [fetchBranches]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            name: formData.name,
            location: {
                address: formData.address,
                city: formData.city,
                state: formData.state,
                zipCode: formData.zipCode
            },
            contactInfo: {
                phone: formData.phone,
                email: formData.email
            }
        };
        const success = await createBranch(payload);
        if (success) {
            setFormData({ name: '', address: '', city: '', state: '', zipCode: '', phone: '', email: '' });
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-2xl overflow-hidden shadow-2xl">
                <div className="px-8 py-6 border-b border-zinc-800 bg-zinc-900/80 flex justify-between items-center">
                    <h3 className="font-heading font-black uppercase tracking-widest text-lg text-white">Branch Network</h3>
                </div>
                
                {user?.role === 'admin' && (
                    <div className="p-8 border-b border-zinc-800 bg-zinc-950/50">
                        <form onSubmit={handleSubmit}>
                            <h4 className="text-zinc-500 font-bold uppercase tracking-widest text-xs mb-4">Initialize New Branch</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="BRANCH DESIGNATION" required className="bg-zinc-900 border border-zinc-800 text-white px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-widest placeholder-zinc-700 focus:border-white focus:ring-1 focus:ring-white transition-all outline-none" />
                                <input type="text" name="address" value={formData.address} onChange={handleChange} placeholder="STREET ADDRESS" required className="bg-zinc-900 border border-zinc-800 text-white px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-widest placeholder-zinc-700 focus:border-white focus:ring-1 focus:ring-white transition-all outline-none" />
                                <input type="text" name="city" value={formData.city} onChange={handleChange} placeholder="CITY" required className="bg-zinc-900 border border-zinc-800 text-white px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-widest placeholder-zinc-700 focus:border-white focus:ring-1 focus:ring-white transition-all outline-none" />
                                <input type="text" name="state" value={formData.state} onChange={handleChange} placeholder="STATE / PROVINCE" required className="bg-zinc-900 border border-zinc-800 text-white px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-widest placeholder-zinc-700 focus:border-white focus:ring-1 focus:ring-white transition-all outline-none" />
                                <input type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} placeholder="POSTAL CODE" required className="bg-zinc-900 border border-zinc-800 text-white px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-widest placeholder-zinc-700 focus:border-white focus:ring-1 focus:ring-white transition-all outline-none" />
                                <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder="COMM LINK (PHONE)" className="bg-zinc-900 border border-zinc-800 text-white px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-widest placeholder-zinc-700 focus:border-white focus:ring-1 focus:ring-white transition-all outline-none" />
                                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="SECURE EMAIL" className="bg-zinc-900 border border-zinc-800 text-white px-4 py-3 rounded-lg text-xs font-bold uppercase tracking-widest placeholder-zinc-700 focus:border-white focus:ring-1 focus:ring-white transition-all outline-none" />
                            </div>
                            <button type="submit" className="bg-white text-zinc-950 hover:bg-zinc-300 px-6 py-3 rounded-lg text-xs font-black uppercase tracking-[0.2em] transition-colors">Add Branch</button>
                        </form>
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-zinc-950/80 text-zinc-500 text-xs font-bold uppercase tracking-widest">
                            <tr>
                                <th className="px-8 py-5">Designation</th>
                                <th className="px-8 py-5">Coordinates</th>
                                <th className="px-8 py-5">Comm Channels</th>
                                {user?.role === 'admin' && <th className="px-8 py-5 text-right">Actions</th>}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-800 text-zinc-300">
                            {branches.map(branch => (
                                <tr key={branch._id} className="hover:bg-zinc-800/30 transition-colors group">
                                    <td className="px-8 py-6 font-bold text-white">{branch.name}</td>
                                    <td className="px-8 py-6">
                                        <div className="text-zinc-300">{branch.location.address}</div>
                                        <div className="text-zinc-500 text-xs uppercase tracking-widest mt-1">{branch.location.city}, {branch.location.state} {branch.location.zipCode}</div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="text-zinc-300">{branch.contactInfo?.phone}</div>
                                        <div className="text-zinc-500 text-xs uppercase tracking-widest mt-1">{branch.contactInfo?.email}</div>
                                    </td>
                                    {user?.role === 'admin' && (
                                        <td className="px-8 py-6 text-right">
                                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex justify-end">
                                                <button onClick={() => deleteBranch(branch._id)} className="text-[10px] font-bold uppercase tracking-widest text-red-500 hover:text-red-400 border border-red-500/30 hover:border-red-400 px-3 py-1.5 rounded-md transition-all">Decommission</button>
                                            </div>
                                        </td>
                                    )}
                                </tr>
                            ))}
                            {branches.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-8 py-12 text-center text-zinc-500 font-bold uppercase tracking-widest text-sm">No active branches found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BranchManager;
