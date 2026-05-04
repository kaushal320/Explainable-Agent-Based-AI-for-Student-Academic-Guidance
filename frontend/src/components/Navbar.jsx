import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Brain,
  MessageSquare,
  Home,
  LogIn,
  BookOpen,
  MapPin,
} from "lucide-react";
import { motion } from "framer-motion";

const Navbar = ({ isAuthenticated }) => {
  const location = useLocation();

  // Don't show navbar if we are inside the /app route (Dashboard handles its own navigation)
  if (location.pathname.startsWith("/app")) {
    return null;
  }

  return (
    <nav className="site-navbar">
      <div className="site-container nav-inner">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="p-2 bg-indigo-600 rounded-xl group-hover:scale-105 transition-transform shadow-lg shadow-indigo-200">
            <Brain size={20} className="text-white" />
          </div>
          <div>
            <h1 className="font-black text-xl text-slate-800 tracking-tight leading-none">
              Scholar Hub
            </h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
              AI Tutor
            </p>
          </div>
        </Link>

        <div className="nav-links">
          <Link
            to="/"
            className={`nav-link ${location.pathname === "/" ? "text-indigo-600" : ""}`}
          >
            <Home size={16} />
            <span>Home</span>
          </Link>
          <Link
            to="/learning"
            className={`nav-link ${location.pathname === "/learning" ? "text-indigo-600" : ""}`}
          >
            <BookOpen size={16} />
            <span>Learning</span>
          </Link>
          <Link
            to="/resources"
            className={`nav-link ${location.pathname === "/resources" ? "text-indigo-600" : ""}`}
          >
            <MapPin size={16} />
            <span>Resources</span>
          </Link>
          <Link
            to="/feedback"
            className={`nav-link ${location.pathname === "/feedback" ? "text-indigo-600" : ""}`}
          >
            <MessageSquare size={16} />
            <span>Feedback</span>
          </Link>

          <div className="w-px h-6 bg-slate-200"></div>

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
