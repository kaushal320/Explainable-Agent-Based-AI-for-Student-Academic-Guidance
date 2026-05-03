import React from "react";
import { Link } from "react-router-dom";
import { CalendarDays, BookOpen, ChevronRight, Zap } from "lucide-react";
import { motion } from "framer-motion";

const PublicLearning = () => {
  const weeksPreview = [
    {
      id: 1,
      title: "Foundations",
      blurb: "Introductory concepts and fundamentals to get started.",
    },
    {
      id: 2,
      title: "Core Concepts",
      blurb: "Hands-on modules and practical exercises.",
    },
    {
      id: 3,
      title: "Applications",
      blurb: "Apply knowledge to real problems and mini-projects.",
    },
    {
      id: 4,
      title: "Mastery",
      blurb: "Capstone tasks and interview-ready projects.",
    },
  ];

  return (
    <div className="public-page-container relative z-10">
      <motion.header 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="glass-panel rounded-[3rem] p-10 md:p-14 mb-12 shadow-[0_30px_60px_-15px_rgba(37,99,235,0.15)] relative overflow-hidden border-2 border-white"
      >
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 200, repeat: Infinity, ease: "linear" }} className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none"></motion.div>
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative z-10">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-indigo-600 rounded-3xl shadow-lg shadow-indigo-600/30">
              <BookOpen size={40} className="text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Zap size={16} className="text-indigo-600" />
                <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">
                  Curriculum
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
                Learning Hub{" "}
                <span className="premium-gradient-text">Preview</span>
              </h1>
              <p className="text-slate-500 font-medium mt-2 max-w-xl text-lg">
                Explore a 4-week guided plan that helps you build career-ready
                skills. Sign in to unlock your personalized curriculum.
              </p>
            </div>
          </div>

          <div className="mt-6 md:mt-0">
            <Link to="/login">
              <motion.button 
                 whileHover={{ scale: 1.05 }}
                 whileTap={{ scale: 0.95 }}
                 className="btn btn-primary px-10 py-5 text-lg shadow-[0_15px_30px_-10px_rgba(37,99,235,0.4)] group flex items-center gap-3 border-none"
              >
                Enter Portal
                <ChevronRight size={22} className="group-hover:translate-x-2 transition-transform" />
              </motion.button>
            </Link>
          </div>
        </div>
      </motion.header>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {weeksPreview.map((w, index) => (
          <motion.article 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
            key={w.id} 
            className="p-8 bg-white/90 backdrop-blur-md rounded-[2.5rem] border-2 border-slate-50 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.05)] hover:shadow-[0_25px_50px_-12px_rgba(37,99,235,0.15)] hover:-translate-y-2 hover:border-indigo-100 transition-all duration-300 group"
          >
            <div className="flex items-center gap-5 mb-5">
              <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-[1.25rem] flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 shadow-sm group-hover:shadow-lg group-hover:shadow-indigo-500/30 group-hover:scale-110">
                <CalendarDays size={26} />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-0.5">
                  Week {w.id}
                </span>
                <h3 className="font-black text-xl text-slate-800 tracking-tight">
                  {w.title}
                </h3>
              </div>
            </div>
            <p className="text-slate-600 font-medium leading-relaxed ml-16">
              {w.blurb}
            </p>
          </motion.article>
        ))}
      </section>
    </div>
  );
};

export default PublicLearning;
