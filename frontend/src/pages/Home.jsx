import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import useVehicleStore from '../store/vehicleStore';
import ThreeDCar from '../components/ThreeDCar';

const Home = () => {
    const { vehicles, fetchVehicles, loading } = useVehicleStore();
    const navigate = useNavigate();

    useEffect(() => {
        fetchVehicles('', 1);
    }, [fetchVehicles]);

    const featuredVehicles = vehicles.slice(0, 4); 

    // Egyptian White Palette
    const BG_COLOR = '#FAF8F5'; // Egyptian White
    const TEXT_COLOR = '#1A110A'; // Deep Espresso
    const ACCENT = '#8A0303'; // Ferrari Red (matches car)

    return (
        <div className="w-full flex flex-col overflow-hidden font-sans antialiased bg-[#FAF8F5]">
            
            {/* The 3D Canvas Fixed in Background */}
            <ThreeDCar />
            
            {/* --- SECTION 1: HERO --- */}
            <section className="relative min-h-[100vh] w-full flex flex-col pt-24 px-6 md:px-12 lg:px-24 text-[#FAF8F5] selection:bg-[#8A0303] selection:text-[#FAF8F5] z-10 pointer-events-none">
                
                {/* Top Typography */}
                <div className="w-full max-w-2xl mt-12">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <h2 className="text-[#FF3333] uppercase tracking-[0.3em] text-xs font-semibold mb-6 drop-shadow-sm">The Private Collection</h2>
                        <h1 className="text-[12vw] md:text-[7vw] font-heading font-black uppercase leading-[1] tracking-tighter text-[#FAF8F5] mb-12 drop-shadow-xl">
                            A curated <br />
                            <span className="text-hollow text-[#FF3333]">automotive</span> <br />
                            experience.
                        </h1>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1.5, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="w-full max-w-max border-t border-[#1A110A]/20 pt-8 pointer-events-auto backdrop-blur-md bg-[#FAF8F5]/50 p-8 rounded-lg shadow-2xl border border-[#1A110A]/10"
                        >
                            <div className="flex flex-col md:flex-row md:items-center gap-8">
                                <h3 className="text-3xl text-[#1A110A] font-heading whitespace-nowrap">
                                    Rent Car
                                </h3>
                                
                                <div className="flex flex-col md:flex-row md:items-center gap-5">
                                    <Link to="/vehicles" className="group flex items-center justify-between gap-6 bg-[#1A110A] text-[#FAF8F5] px-8 py-4 hover:bg-[#8A0303] hover:shadow-xl transition-all duration-500 rounded-sm">
                                        <span className="uppercase tracking-widest text-xs font-semibold whitespace-nowrap">Book a Vehicle</span>
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-500 ease-out" />
                                    </Link>
                                    
                                    <Link to="/vehicles" className="group inline-flex items-center gap-4 text-[#1A110A]/70 pb-1 border-b border-[#1A110A]/20 hover:border-[#8A0303] hover:text-[#8A0303] transition-colors duration-500 uppercase tracking-widest text-[10px] font-semibold w-max whitespace-nowrap">
                                        <span>Explore the Fleet First</span>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* --- SECTION 2: THE SHOWCASE (FLEET PREVIEW) --- */}
            <section className="py-40 relative z-10 bg-transparent text-[#1A110A] selection:bg-[#8A0303] selection:text-[#FAF8F5]">
                <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
                    
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="flex flex-col md:flex-row justify-between items-end mb-24 border-b border-[#1A110A]/10 pb-8"
                    >
                        <h2 className="text-4xl md:text-5xl font-heading font-black uppercase tracking-tighter text-[#1A110A]">Featured <span className="text-hollow text-[#8A0303]">Vehicles</span></h2>
                        <Link to="/vehicles" className="text-[#1A110A]/50 hover:text-[#1A110A] font-bold uppercase tracking-[0.2em] text-xs mt-4 md:mt-0 transition-colors flex items-center gap-2">
                            View Full Fleet <ArrowRight size={14} />
                        </Link>
                    </motion.div>

                    {loading ? (
                        <div className="h-[40vh] flex items-center justify-center">
                            <div className="w-8 h-8 border-t-4 border-white animate-spin"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
                            {featuredVehicles.map((vehicle, i) => (
                                <motion.div 
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true, margin: "-50px" }}
                                    transition={{ duration: 1, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                    key={vehicle._id} 
                                    className="group flex flex-col cursor-pointer"
                                    onClick={() => navigate('/vehicles')}
                                >
                                    <div className="aspect-[4/3] bg-zinc-900 relative overflow-hidden mb-6">
                                        {vehicle.images && vehicle.images.length > 0 ? (
                                            <img src={vehicle.images[0]} alt={vehicle.model} className="w-full h-full object-cover mix-blend-luminosity group-hover:mix-blend-normal opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-out" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-zinc-700 font-bold uppercase tracking-widest">No Visuals</div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-60"></div>
                                        <div className="absolute top-4 left-4 bg-white text-zinc-950 px-3 py-1 font-bold uppercase tracking-widest text-xs">
                                            {vehicle.brand}
                                        </div>
                                    </div>
                                    
                                    <div className="flex flex-col flex-1">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="font-bold text-3xl uppercase tracking-tighter text-white">{vehicle.model}</h3>
                                            <div className="text-xl font-medium text-white">
                                                ₹{vehicle.pricePerDay}<span className="text-zinc-600 text-xs uppercase tracking-widest block text-right mt-1">/ day</span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-zinc-500 mb-8">
                                            <span>{vehicle.fuelType}</span>
                                            <span className="w-1 h-1 bg-zinc-700"></span>
                                            <span>{vehicle.transmission}</span>
                                            {vehicle.averageRating > 0 && (
                                                <>
                                                    <span className="w-1 h-1 bg-zinc-700"></span>
                                                    <span className="text-zinc-300">★ {vehicle.averageRating}</span>
                                                </>
                                            )}
                                        </div>
                                        
                                        <div className="mt-auto border-t border-zinc-900 pt-6 flex justify-between items-center">
                                            <span className={`text-xs font-bold uppercase tracking-[0.2em] ${
                                                vehicle.status === 'Available' ? 'text-white' : 'text-zinc-600'
                                            }`}>
                                                {vehicle.status}
                                            </span>
                                            <button 
                                                className="px-6 py-3 bg-zinc-900 group-hover:bg-white group-hover:text-zinc-950 text-white font-bold uppercase tracking-widest text-xs transition-colors duration-300 flex items-center gap-3"
                                            >
                                                Book <ArrowRight size={14} />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* --- SECTION 3: THE PHILOSOPHY --- */}
            <section id="how-it-works" className="py-64 bg-transparent text-[#1A110A] relative z-10 pointer-events-none selection:bg-[#8A0303] selection:text-[#FAF8F5]">
                <div className="max-w-[1000px] mx-auto px-6 md:px-12 text-center flex flex-col items-center backdrop-blur-xl bg-[#FAF8F5]/70 p-12 rounded-xl shadow-2xl border border-[#1A110A]/10 pointer-events-auto">
                    
                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5 }}
                        className="w-px h-24 bg-[#1A110A]/20 mb-12"
                    ></motion.div>

                    <motion.h2 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                        className="text-4xl md:text-6xl font-heading font-black uppercase tracking-tighter text-[#1A110A] leading-tight mb-12 drop-shadow-md"
                    >
                        The journey should be as <br /><span className="text-hollow text-[#8A0303]">breathtaking</span><br /> as the destination.
                    </motion.h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-left border-t border-[#1A110A]/10 pt-16 mt-12 w-full">
                        {[
                            { title: 'Curation', desc: 'Every vehicle in our fleet is hand-selected for its heritage, performance, and unmatched elegance.' },
                            { title: 'Discretion', desc: 'We prioritize your privacy with a seamless, highly confidential reservation protocol.' },
                            { title: 'Excellence', desc: 'From white-glove delivery to bespoke itineraries, our concierge is at your absolute disposal.' }
                        ].map((item, i) => (
                            <motion.div 
                                key={item.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 1, delay: i * 0.2, ease: [0.16, 1, 0.3, 1] }}
                            >
                                <h3 className="text-[#1A110A] font-heading text-xl mb-4">{item.title}</h3>
                                <p className="text-[#1A110A]/80 text-sm font-light leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- SECTION 4: EDITORIAL CTA --- */}
            <section className="py-40 bg-transparent text-[#1A110A] text-center relative z-10 selection:bg-[#8A0303] selection:text-[#FAF8F5]">
                <motion.div 
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                    className="max-w-3xl mx-auto px-6 flex flex-col items-center backdrop-blur-xl bg-[#FAF8F5]/80 p-16 rounded-xl shadow-2xl border border-[#1A110A]/10"
                >
                    <div className="text-[#1A110A]/50 text-xs uppercase tracking-[0.3em] font-semibold mb-8">Invitation</div>
                    <h2 className="text-5xl md:text-7xl font-heading font-black uppercase tracking-tighter mb-12">
                        Begin your <span className="text-hollow text-[#8A0303]">journey</span>.
                    </h2>
                    <Link to="/register" className="inline-flex items-center gap-6 border border-[#1A110A]/30 px-10 py-5 text-sm uppercase tracking-[0.2em] font-semibold hover:bg-[#8A0303] hover:text-[#FAF8F5] hover:border-[#8A0303] transition-colors duration-500 group">
                        <span>Become a Client</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-500" />
                    </Link>
                </motion.div>
            </section>

            {/* --- SECTION 5: TESTIMONIALS --- */}
            <section className="py-32 relative z-10 text-[#1A110A] selection:bg-[#8A0303] selection:text-[#FAF8F5]">
                <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-24">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="text-center mb-24 backdrop-blur-md bg-[#FAF8F5]/60 p-8 rounded-xl border border-[#1A110A]/10 max-w-2xl mx-auto shadow-lg"
                    >
                        <h2 className="text-4xl md:text-5xl font-heading font-black uppercase tracking-tighter text-[#1A110A] mb-4">Client <span className="text-hollow text-[#8A0303]">Experiences</span></h2>
                        <p className="text-[#1A110A]/60 uppercase tracking-widest text-xs font-semibold">Words from our esteemed clientele</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { name: "Vikram Malhotra", role: "CEO, TechVentures", text: "The level of discretion and the immaculate condition of the vehicles are simply unmatched. FleetFlow provides an automotive experience that redefines luxury in India." },
                            { name: "Ananya Sharma", role: "Creative Director", text: "From the seamless booking process to the white-glove delivery, every detail is orchestrated to perfection. It feels less like a rental and more like a private membership." },
                            { name: "Rajeev Desai", role: "Real Estate Developer", text: "I required a statement vehicle for a high-profile weekend event. The Ferrari exceeded all expectations, and the concierge service was flawless." }
                        ].map((t, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 1, delay: idx * 0.2 }}
                                className="backdrop-blur-xl bg-[#FAF8F5]/80 p-10 rounded-xl shadow-2xl border border-[#1A110A]/10 flex flex-col justify-between hover:-translate-y-2 transition-transform duration-500"
                            >
                                <div>
                                    <div className="flex gap-1 mb-6">
                                        {[1,2,3,4,5].map(star => (
                                            <svg key={star} className="w-4 h-4 text-[#C29B62]" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                        ))}
                                    </div>
                                    <p className="text-[#1A110A]/80 font-light leading-relaxed italic mb-8">"{t.text}"</p>
                                </div>
                                <div className="border-t border-[#1A110A]/10 pt-6">
                                    <h4 className="text-[#1A110A] font-heading font-semibold text-lg">{t.name}</h4>
                                    <p className="text-[#1A110A]/50 text-xs uppercase tracking-widest mt-1">{t.role}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- SECTION 6: BRANCHES --- */}
            <section className="py-32 relative z-10 text-[#1A110A] selection:bg-[#8A0303] selection:text-[#FAF8F5]">
                <div className="max-w-[1200px] mx-auto px-6 md:px-12">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-4xl md:text-5xl font-heading font-black uppercase tracking-tighter text-[#1A110A] mb-4">Our <span className="text-hollow text-[#8A0303]">Locations</span></h2>
                        <p className="text-[#1A110A]/60 uppercase tracking-widest text-xs font-semibold">Exclusive hubs for our esteemed clientele</p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
                        {/* Branch 1 */}
                        <motion.div 
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                            className="group cursor-pointer relative overflow-hidden rounded-xl border border-[#1A110A]/10 bg-[#FAF8F5]/80 backdrop-blur-xl p-10 hover:shadow-2xl transition-all duration-500 flex flex-col items-center text-center"
                        >
                            <h3 className="text-2xl font-heading font-black uppercase tracking-widest mb-2 text-[#1A110A] group-hover:text-[#8A0303] transition-colors">Mumbai</h3>
                            <p className="text-[#1A110A]/70 text-sm font-light mb-6">Bandra Kurla Complex, Mumbai, 400051</p>
                            <div className="w-12 h-px bg-[#1A110A]/20 group-hover:bg-[#8A0303] transition-colors"></div>
                        </motion.div>
                        
                        {/* Branch 2 */}
                        <motion.div 
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 1 }}
                            className="group cursor-pointer relative overflow-hidden rounded-xl border border-[#1A110A]/10 bg-[#FAF8F5]/80 backdrop-blur-xl p-10 hover:shadow-2xl transition-all duration-500 flex flex-col items-center text-center"
                        >
                            <h3 className="text-2xl font-heading font-black uppercase tracking-widest mb-2 text-[#1A110A] group-hover:text-[#8A0303] transition-colors">Delhi</h3>
                            <p className="text-[#1A110A]/70 text-sm font-light mb-6">Connaught Place, New Delhi, 110001</p>
                            <div className="w-12 h-px bg-[#1A110A]/20 group-hover:bg-[#8A0303] transition-colors"></div>
                        </motion.div>
                    </div>

                    {/* Coming Soon */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: 0.2 }}
                        className="text-center p-12 border border-[#1A110A]/10 rounded-xl bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(26,17,10,0.03)_10px,rgba(26,17,10,0.03)_20px)] backdrop-blur-md flex flex-col items-center group cursor-pointer hover:border-[#8A0303]/30 transition-colors"
                    >
                        <span className="inline-block px-4 py-1 mb-6 text-[10px] uppercase tracking-[0.3em] font-bold border border-[#8A0303]/30 text-[#8A0303] rounded-full bg-[#8A0303]/5 group-hover:bg-[#8A0303] group-hover:text-white transition-colors">Classified</span>
                        <h3 className="text-3xl md:text-4xl font-heading font-black uppercase tracking-tighter text-[#1A110A] mb-4">New Hubs <span className="text-[#1A110A]/30 group-hover:text-[#8A0303]/70 transition-colors">Coming Soon</span></h3>
                        <p className="text-[#1A110A]/60 max-w-lg mx-auto text-sm font-light">We are preparing to unveil highly anticipated, state-of-the-art facilities in select cities. Stay tuned for exclusive access.</p>
                    </motion.div>
                </div>
            </section>

        </div>
    );
};

export default Home;
