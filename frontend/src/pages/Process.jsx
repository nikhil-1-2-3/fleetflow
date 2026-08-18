import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, CheckCircle, Car, Key } from 'lucide-react';

const Process = () => {
    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const steps = [
        {
            title: "Curation & Selection",
            description: "Browse our hand-picked collection of luxury and performance vehicles. Each vehicle is maintained to pristine showroom standards, ensuring an uncompromising experience.",
            icon: <Search className="w-8 h-8 text-red-600" />,
            delay: 0.1
        },
        {
            title: "Booking & Verification",
            description: "Reserve your chosen vehicle through our seamless digital platform. Please note: you must submit your original Aadhar card and last month's light bill at our center before vehicle handover for security verification.",
            icon: <CheckCircle className="w-8 h-8 text-red-600" />,
            delay: 0.2
        },
        {
            title: "White-Glove Delivery",
            description: "Experience effortless handover. We deliver the vehicle directly to your desired location, providing a comprehensive walkthrough of its features and capabilities.",
            icon: <Car className="w-8 h-8 text-red-600" />,
            delay: 0.3
        },
        {
            title: "The Journey & Return",
            description: "Enjoy the pure thrill of driving. When your journey concludes, our team will coordinate a convenient pickup, ensuring your experience remains flawless from start to finish.",
            icon: <Key className="w-8 h-8 text-red-600" />,
            delay: 0.4
        }
    ];

    return (
        <div className="w-full flex flex-col font-sans antialiased bg-zinc-950 text-zinc-100 selection:bg-red-600 selection:text-white pt-12">
            
            {/* --- HERO SECTION --- */}
            <section className="relative pt-32 pb-24 px-6 md:px-12 lg:px-24">
                <div className="max-w-[1200px] mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                        className="text-center md:text-left border-b border-zinc-900 pb-16"
                    >
                        <h2 className="text-red-600 uppercase tracking-[0.3em] text-xs font-bold mb-6">The Process</h2>
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-heading font-black uppercase leading-[0.9] tracking-tighter mb-8 text-white">
                            Effortless <br />
                            <span className="text-zinc-600 font-outline-1">Elegance.</span>
                        </h1>
                        <p className="max-w-2xl text-zinc-400 text-lg font-light leading-relaxed">
                            Renting a masterpiece shouldn't be complicated. We have refined our process to be as smooth and powerful as the vehicles in our fleet.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* --- STEPS SECTION --- */}
            <section className="py-24 px-6 md:px-12 lg:px-24">
                <div className="max-w-[1200px] mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-24 gap-x-16">
                        {steps.map((step, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 40 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 1, delay: step.delay, ease: [0.16, 1, 0.3, 1] }}
                                className="relative flex flex-col group"
                            >
                                <div className="text-[140px] leading-none font-heading font-black text-transparent [-webkit-text-stroke:2px_#dc2626] absolute -top-12 right-0 pointer-events-none select-none transition-transform duration-700 group-hover:-translate-y-4 z-0 opacity-40">
                                    0{idx + 1}
                                </div>
                                
                                <div className="mb-8 p-4 bg-zinc-900 w-max rounded-xl border border-zinc-800 shadow-xl shadow-black/20 relative z-10">
                                    {step.icon}
                                </div>
                                
                                <h3 className="text-3xl font-heading font-bold uppercase tracking-tight mb-4 relative z-10 text-white">
                                    {step.title}
                                </h3>
                                
                                <p className="text-zinc-400 leading-relaxed font-light relative z-10">
                                    {step.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- CTA SECTION --- */}
            <section className="py-32 bg-black text-zinc-100 px-6 md:px-12 lg:px-24 mt-12 relative overflow-hidden border-t border-zinc-900">
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-zinc-800 via-transparent to-transparent"></div>
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <h2 className="text-4xl md:text-6xl font-heading font-black uppercase tracking-tighter mb-8 text-white">
                            Ready for the <span className="text-red-600">Drive?</span>
                        </h2>
                        <p className="text-zinc-400 mb-12 max-w-2xl mx-auto font-light text-lg">
                            Explore our meticulously curated collection and book your next unforgettable journey today.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link to="/vehicles" className="w-full sm:w-auto flex items-center justify-center gap-4 bg-red-700 text-white px-10 py-5 hover:bg-red-800 hover:shadow-2xl hover:shadow-red-900/30 transition-all duration-500 uppercase tracking-widest text-xs font-bold">
                                View Fleet <ArrowRight size={16} />
                            </Link>
                            <Link to="/register" className="w-full sm:w-auto text-zinc-400 hover:text-white uppercase tracking-widest text-xs font-bold border-b border-zinc-600 hover:border-white pb-1 transition-all duration-300">
                                Create Profile
                            </Link>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default Process;
