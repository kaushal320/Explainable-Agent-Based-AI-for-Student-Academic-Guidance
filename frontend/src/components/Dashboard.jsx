import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { 
  LogOut, 
  MessageSquare, 
  BookOpen, 
  LayoutDashboard,
  Brain,
  User as UserIcon,
  Target,
  BarChart3,
  Sparkles,
  Zap,
  Globe,
  ChevronRight,
  Menu,
  X,
  Cpu
} from 'lucide-react';
import Chat from './Chat';
import LearningHub from './LearningHub';

const Dashboard = ({ user, onLogout }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const career = user.prediction.career || "Student";
  const navigate = useNavigate();
  const location = useLocation();

  const pathParts = location.pathname.split('/');
  const activeTab = pathParts[pathParts.length - 1] === 'app' ? 'overview' : pathParts[pathParts.length - 1];

  const navItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'chat', label: 'AI Genius', icon: Brain },
    { id: 'learning', label: 'Resource Hub', icon: BookOpen },
  ];

  const getProgress = (score) => {
    try {
      const [num, den] = score.split('/').map(Number);
      return (num / den) * 100;
    } catch (e) {
      return 50;
    }
  };

  const handleNav = (id) => {
    setSidebarOpen(false);
    if (id === 'overview') {
      navigate('/app');
    } else {
      navigate(`/app/${id}`);
    }
  };

  return (
    <div className="dashboard-layout">
      {/* MOBILE OVERLAY */}
      <div 
        className={`sidebar-overlay ${isSidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* MOBILE MENU TOGGLER */}
      <button 
        className="btn-menu-mobile"
        onClick={() => setSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* SOLID PROFESSIONAL SIDEBAR */}
      <aside className={`sidebar-scholar ${isSidebarOpen ? 'open' : ''}`}>
        <div className="flex items-center gap-4 mb-16 px-2">
          <div className="p-3 bg-white/10 rounded-2xl border border-white/20 shadow-inner">
             <Cpu size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tight text-white leading-none">Scholar Hub</h1>
            <p className="text-[10px] text-white/40 uppercase font-black mt-2 tracking-[0.3em]">Master v2.0</p>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          {navItems.map(item => (
            <div 
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`nav-item-scholar ${activeTab === item.id ? 'active' : ''} cursor-pointer`}
            >
              <item.icon size={20} />
              <span className="text-[14px]">{item.label}</span>
            </div>
          ))}
        </nav>

        <div className="mt-auto px-2">
           <button onClick={onLogout} className="btn-exit-portal">
              <LogOut size={14} />
              <span>Exit Portal</span>
           </button>
        </div>
      </aside>

      {/* SOLID MAIN WORKSPACE */}
      <main className="main-content-scholar">
        <header className="flex justify-between items-center bg-white p-7 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 mb-12">
           <div className="flex items-center gap-5">
              <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-100">
                {user.name ? user.name[0] : 'S'}
              </div>
              <div className="overflow-hidden">
                <h2 className="text-slate-800 font-black text-xl leading-none mb-1.5 truncate">Greetings, {user.name || 'Scholar'}</h2>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] truncate">Portal Status: Optimized</p>
                </div>
              </div>
           </div>
           
           <div className="flex items-center gap-3 px-6 py-3 bg-indigo-50 rounded-2xl border border-indigo-100 whitespace-nowrap">
              <Zap size={14} className="text-indigo-600" />
              <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hidden sm:inline">AI Tuning Active</span>
           </div>
        </header>

        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="w-full"
              >
                <div className="workspace-grid">
                  {/* Result Block */}
                  <div className="scholar-card">
                    <div className="flex items-center gap-3 mb-12">
                        <Sparkles className="text-indigo-600" size={18} />
                        <span className="font-black text-indigo-600 uppercase tracking-[0.3em]" style={{ fontSize: '10px' }}>Analysis Output</span>
                    </div>

                    <h2 className="text-slate-400 font-bold text-[11px] mb-6 uppercase tracking-[0.4em]">Based on your profile, you are a</h2>
                    <h1 className="text-slate-800 font-black tracking-tighter mb-12 leading-[0.85] text-[3rem] lg:text-[4.5rem]">
                      {career}
                    </h1>

                    <div className="p-8 bg-slate-50 rounded-3xl border-l-[6px] border-indigo-600 shadow-sm">
                      <p className="text-slate-600 font-medium text-lg leading-relaxed italic">
                        "Your academic record demonstrates exceptional strength in system logistics and architectural scalability. 
                        You are uniquely positioned for high-impact roles in core technical leadership."
                      </p>
                    </div>
                  </div>

                  {/* Skills Block */}
                  <div className="scholar-card">
                     <div className="flex items-center gap-5 mb-12">
                        <div className="p-3.5 bg-indigo-50 rounded-2xl">
                          <BarChart3 className="text-indigo-600" size={24} />
                        </div>
                        <h2 className="text-slate-800 font-black text-2xl tracking-tight">Core Competencies</h2>
                     </div>

                     <div className="flex flex-col gap-10">
                        {[
                          { label: 'Python Deep Logic', score: '2/3' },
                          { label: 'Cloud Distribution', score: '2/3' },
                          { label: 'Logic & Heuristics', score: '1/3' },
                          { label: 'Standard GPA', score: '3/4' }
                        ].map((metric) => (
                          <div key={metric.label}>
                             <div className="flex justify-between items-center mb-3 px-1">
                                <span className="font-black text-slate-500 text-[10px] uppercase tracking-[0.2em]">{metric.label}</span>
                                <span className="font-black text-indigo-700 text-xs bg-indigo-50 px-3 py-1 rounded-xl">{metric.score}</span>
                             </div>
                             <div className="progress-track-final" style={{ height: '12px', background: '#f1f5f9', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${getProgress(metric.score)}%` }}
                                  transition={{ duration: 1.5, ease: "easeOut" }}
                                  style={{ height: '100%', background: 'linear-gradient(90deg, #1e3a8a 0%, #3b82f6 100%)', borderRadius: '12px' }}
                                />
                             </div>
                          </div>
                        ))}
                     </div>

                     <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col gap-4">
                        <div className="flex items-center gap-2 mb-1 px-1">
                          <Zap size={12} className="text-indigo-600" />
                          <span className="font-black text-indigo-900 text-[9px] uppercase tracking-[0.3em]">AI Commands</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <motion.button 
                            whileHover={{ y: -3, boxShadow: '0 12px 24px rgba(30, 58, 138, 0.1)' }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleNav('chat')} 
                            className="flex items-center gap-4 p-4 rounded-[1.25rem] text-white transition-all border-none relative overflow-hidden group cursor-pointer"
                            style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)', color: '#ffffff' }}
                          >
                            <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md border border-white/20 shadow-inner group-hover:bg-white/20 transition-all">
                              <Brain size={18} className="text-white" />
                            </div>
                            <div className="text-left flex-1 min-w-0">
                              <span className="block font-black text-[11px] uppercase tracking-[0.05em] leading-tight truncate">Consult AI Tutor</span>
                              <span className="text-[8px] text-white/50 font-medium uppercase tracking-widest block truncate">Neural Guidance</span>
                            </div>
                            <ChevronRight size={14} className="opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                          </motion.button>

                          <motion.button 
                            whileHover={{ y: -3, boxShadow: '0 12px 24px rgba(6, 78, 59, 0.1)' }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleNav('learning')} 
                            className="flex items-center gap-4 p-4 rounded-[1.25rem] text-white transition-all border-none relative overflow-hidden group cursor-pointer"
                            style={{ background: 'linear-gradient(135deg, #064e3b 0%, #059669 100%)', color: '#ffffff' }}
                          >
                            <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md border border-white/20 shadow-inner group-hover:bg-white/20 transition-all">
                              <BookOpen size={18} className="text-white" />
                            </div>
                            <div className="text-left flex-1 min-w-0">
                              <span className="block font-black text-[11px] uppercase tracking-[0.05em] leading-tight truncate">Explore Lab</span>
                              <span className="text-[8px] text-white/50 font-medium uppercase tracking-widest block truncate">Knowledge Hub</span>
                            </div>
                            <ChevronRight size={14} className="opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                          </motion.button>
                        </div>
                     </div>
                  </div>
                </div>
              </motion.div>
            } />

            <Route path="/chat" element={
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden min-h-[700px] w-full"
              >
                 <Chat user={user} />
              </motion.div>
            } />

            <Route path="/learning" element={
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-10 w-full"
              >
                 <LearningHub user={user} />
              </motion.div>
            } />
            
            <Route path="*" element={<Navigate to="/app" replace />} />
          </Routes>
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Dashboard;
