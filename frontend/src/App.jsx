import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import Vehicles from './pages/Vehicles';
import Dashboard from './pages/Dashboard';
import UserProfile from './pages/UserProfile';
import Home from './pages/Home';
import Process from './pages/Process';

function App() {
  return (
    <div className="min-h-screen flex flex-col overflow-x-hidden w-full">
      <Header />

      <main className="flex-1 w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/vehicles" element={<Vehicles />} />
          <Route path="/process" element={<Process />} />
          <Route path="/*" element={
            <div className="max-w-7xl mx-auto p-6">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/profile" element={<UserProfile />} />
              </Routes>
            </div>
          } />
        </Routes>
      </main>

      <footer className="relative z-10 w-full bg-[#050505] text-white pt-24 pb-12 mt-auto">
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-24 mb-20">
                <div className="md:col-span-2">
                    <span className="text-3xl font-sans font-semibold tracking-tight mb-6 block">FleetFlow</span>
                    <p className="text-white/50 font-light leading-relaxed max-w-sm mb-8">
                        Redefining the luxury automotive experience. Curated masterpieces for those who demand uncompromising performance and elegance.
                    </p>
                </div>
                
                <div>
                    <h4 className="text-white uppercase tracking-[0.2em] text-xs font-semibold mb-8">Explore</h4>
                    <ul className="space-y-4">
                        {['The Fleet', 'Private Membership', 'Self-Drive Experiences', 'Corporate Events'].map(link => (
                            <li key={link}><a href="#" className="text-white/50 hover:text-white transition-colors text-sm font-light">{link}</a></li>
                        ))}
                    </ul>
                </div>
                
                <div>
                    <h4 className="text-white uppercase tracking-[0.2em] text-xs font-semibold mb-8">Operating Locations</h4>
                    <ul className="space-y-4 text-white/50 text-sm font-light">
                        <li>
                            <strong className="text-white block mb-1 font-medium">Mumbai HQ</strong>
                            The Platinum Tower, BKC<br/>
                            Mumbai, MH 400051
                        </li>
                        <li className="pt-2">
                            <strong className="text-white block mb-1 font-medium">Surat Branch</strong>
                            Dumas Road, Piplod<br/>
                            Surat, GJ 395007
                        </li>
                        <li className="pt-4"><a href="mailto:concierge@fleetflow.in" className="text-white hover:text-[#8A0303] transition-colors">concierge@fleetflow.in</a></li>
                    </ul>
                </div>
            </div>
            
            <div className="flex flex-col md:flex-row justify-between items-center border-t border-white/10 pt-8 text-xs text-white/30 uppercase tracking-widest font-light">
                <p>&copy; {new Date().getFullYear()} FleetFlow. All rights reserved.</p>
                <div className="flex gap-8 mt-4 md:mt-0">
                    <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                </div>
            </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
