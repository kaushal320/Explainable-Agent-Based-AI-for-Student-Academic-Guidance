import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Brain, MessageSquare, Home, LogIn, BookOpen, Map } from "lucide-react";
import { motion } from "framer-motion";

const Navbar = ({ isAuthenticated }) => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const roadmapPath = isAuthenticated ? "/app/roadmap" : "/roadmap";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Don't show navbar if we are inside the /app route (Dashboard handles its own navigation)
  if (location.pathname.startsWith("/app")) {
    return null;
  }

  return (
    <nav className={`site-navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="site-container nav-inner">
        <Link to="/" className="flex items-center gap-3 group">
          <motion.div
            whileHover={{ scale: 1.08, rotate: -5 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="p-2.5 rounded-2xl shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-shadow"
            style={{ background: 'linear-gradient(135deg, #2563eb 0%, #6366f1 100%)' }}
          >
            <Brain size={22} className="text-white" />
          </motion.div>
          <div>
            <h1 className="font-black text-xl text-slate-800 tracking-tight leading-none">Scholar<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600"> Hub</span></h1>
            <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] mt-0.5">AI Academic Guidance</p>
          </div>
        </Link>

        <div className="nav-links">
          <Link
            to="/"
            className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
          >
            <div className="flex items-center gap-2">
              <Home size={16} />
              <span>Home</span>
            </div>
          </Link>
          <Link
            to="/feedback"
            className={`nav-link ${location.pathname === "/feedback" ? "active" : ""}`}
          >
            <div className="flex items-center gap-2">
              <MessageSquare size={16} />
              <span>Feedback</span>
            </div>
          </Link>

          <Link
            to="/learning"
            className={`nav-link ${location.pathname === "/learning" ? "active" : ""}`}
          >
            <div className="flex items-center gap-2">
              <BookOpen size={16} />
              <span>Learning</span>
            </div>
          </Link>

          <Link
            to={roadmapPath}
            className={`nav-link ${location.pathname === roadmapPath ? "active" : ""}`}
          >
            <div className="flex items-center gap-2">
              <Map size={16} />
              <span>Roadmap</span>
            </div>
          </Link>

          <div className="w-px h-6 bg-slate-200 mx-2"></div>

          <Link to="/app">
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="cta-portal flex items-center gap-2"
            >
              <LogIn size={16} />
              <span>
                {isAuthenticated ? "Enter Portal" : "Login / Sign Up"}
              </span>
            </motion.button>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
