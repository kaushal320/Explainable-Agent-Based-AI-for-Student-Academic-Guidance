import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Brain, MessageSquare, Home, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = ({ isAuthenticated }) => {
  const location = useLocation();

  // Don't show navbar if we are inside the /app route (Dashboard handles its own navigation)
  if (location.pathname.startsWith('/app')) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200/50">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="p-2 bg-indigo-600 rounded-xl group-hover:scale-105 transition-transform shadow-lg shadow-indigo-200">
            <Brain size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-black text-xl text-slate-800 tracking-tight leading-none">Scholar Hub</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">AI Tutor</p>
          </div>
        </Link>

        <div className="flex items-center gap-6">
          <Link 
            to="/" 
            className={`flex items-center gap-2 text-sm font-semibold transition-colors ${location.pathname === '/' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <Home size={16} />
            <span>Home</span>
          </Link>
          <Link 
            to="/feedback" 
            className={`flex items-center gap-2 text-sm font-semibold transition-colors ${location.pathname === '/feedback' ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <MessageSquare size={16} />
            <span>Feedback</span>
          </Link>
          
          <div className="w-px h-6 bg-slate-200"></div>
          
          <Link to="/app">
            <motion.button 
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-colors"
            >
              <LogIn size={16} />
              <span>{isAuthenticated ? 'Enter Portal' : 'Login / Sign Up'}</span>
            </motion.button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
