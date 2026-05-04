import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Brain, Sparkles, Target, BookOpen, ChevronRight, Zap } from 'lucide-react';

const FeatureCard = ({ icon: Icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="bg-white/50 backdrop-blur-xl p-8 rounded-4xl border border-white/40 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all group relative overflow-hidden"
  >
    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full blur-3xl -mr-16 -mt-16 opacity-50 group-hover:opacity-100 transition-opacity"></div>
    <div className="p-4 bg-indigo-50 rounded-2xl w-max mb-6 group-hover:scale-110 transition-transform">
      <Icon size={24} className="text-indigo-600" />
    </div>
    <h3 className="text-xl font-black text-slate-800 mb-3 tracking-tight">{title}</h3>
    <p className="text-slate-500 font-medium leading-relaxed">{description}</p>
  </motion.div>
);

const Home = () => {
  return (
    <div className="min-h-screen bg-[#fafcff] pt-24 overflow-hidden hero-hero">
      {/* Hero Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-200 h-125 bg-linear-to-tr from-indigo-200/40 via-blue-200/40 to-purple-200/40 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute top-32 -left-32 w-96 h-96 bg-indigo-300/20 blur-[80px] rounded-full pointer-events-none"></div>
      <div className="absolute top-32 -right-32 w-96 h-96 bg-blue-300/20 blur-[80px] rounded-full pointer-events-none"></div>

      <div className="site-container relative z-10">
        <div className="flex flex-col items-center text-center mt-20 mb-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-8"
          >
            <Sparkles size={16} className="text-indigo-600" />
            <span className="text-sm font-bold text-slate-700 tracking-wide uppercase">AI-Powered Academic Guidance</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="hero-title max-w-4xl"
          >
            Predict Your <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-600 to-blue-500">Career Path</span> with Precision
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="hero-sub"
          >
            Leverage explainable AI to analyze your academic strengths, predict your optimal IT career, and receive personalized tutoring to get there.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="hero-ctas"
          >
            <Link to="/app">
              <button className="btn bg-slate-900 text-white flex items-center gap-2 group">
                Enter Portal
                <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <Link to="/feedback">
              <button className="btn btn-outline flex items-center gap-2">
                Provide Feedback
              </button>
            </Link>
          </motion.div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32 relative">
          <div className="absolute inset-0 bg-linear-to-b from-transparent via-indigo-50/30 to-transparent blur-3xl -z-10"></div>
          
          <FeatureCard 
            icon={Target}
            title="Career Prediction"
            description="Our machine learning models analyze your academic profile to predict the most suitable IT career path with high accuracy."
            delay={0.4}
          />
          <FeatureCard 
            icon={Brain}
            title="AI Personal Tutor"
            description="Chat with an intelligent RAG-powered tutor that understands your curriculum and provides tailored guidance and answers."
            delay={0.5}
          />
          <FeatureCard 
            icon={BookOpen}
            title="Resource Hub"
            description="Access a curated library of learning resources, courses, and materials specifically tailored to your predicted career path."
            delay={0.6}
          />
        </div>
        
        {/* Banner */}
        <motion.div 
           initial={{ opacity: 0, y: 30 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.6 }}
           className="bg-indigo-600 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden mb-32 shadow-2xl shadow-indigo-200/50"
        >
            <div className="absolute top-0 right-0 p-32 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 p-32 bg-blue-400/20 rounded-full blur-3xl -ml-20 -mb-20"></div>
            
            <Zap size={48} className="text-white/80 mx-auto mb-8" />
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-6 relative z-10">
                Ready to accelerate your learning?
            </h2>
            <p className="text-indigo-100 text-xl font-medium max-w-2xl mx-auto mb-10 relative z-10">
                Join our platform today and unlock your personalized academic canvas powered by state-of-the-art AI.
            </p>
            <Link to="/app">
               <button className="px-10 py-5 bg-white text-indigo-600 rounded-2xl font-black text-lg hover:shadow-xl hover:scale-105 transition-all relative z-10 shadow-lg">
                  Start Your Journey
               </button>
            </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
