import React from 'react';
import { motion } from 'framer-motion';
import { Target, AlertCircle, Award, CheckCircle, ChevronRight, BarChart2, Rocket, Map as MapIcon } from 'lucide-react';

const Roadmap = ({ prediction }) => {
  const { career, plan, skills } = prediction;
  const topWeakness = plan.weakness_rank[0][0];

  const skillData = [
    { label: 'Python', value: skills.Python, max: 3 },
    { label: 'SQL', value: skills.SQL, max: 3 },
    { label: 'Java', value: skills.Java, max: 3 },
    { label: 'GPA', value: skills.GPA, max: 4 },
  ];

  return (
    <div className="w-full space-y-10 pb-10 px-0 sm:px-2 lg:px-4 xl:px-6">
      {/* Hero Header */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 80, duration: 0.6 }}
        className="relative overflow-hidden rounded-[3rem] p-8 md:p-10 xl:p-14 flex flex-col xl:flex-row items-center gap-10 shadow-[0_30px_70px_-25px_rgba(37,99,235,0.35)]"
        style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 60%, #6366f1 100%)' }}
      >
        {/* BG blobs */}
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 200, repeat: Infinity, ease: 'linear' }} className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <motion.div animate={{ rotate: -360 }} transition={{ duration: 260, repeat: Infinity, ease: 'linear' }} className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />

        <motion.div
          whileHover={{ rotate: -6, scale: 1.05 }}
          transition={{ type: 'spring' }}
          className="p-6 bg-white/10 backdrop-blur rounded-3xl shadow-xl border border-white/20 flex-shrink-0"
        >
          <Rocket className="text-white" size={48} />
        </motion.div>
        <div className="flex-1 text-center xl:text-left space-y-4 relative z-10">
          <div className="flex items-center justify-center xl:justify-start gap-3 text-white/60 font-black uppercase tracking-[0.3em] text-[10px]">
            <Target size={16} /> Career Objective
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-none drop-shadow-md">{career}</h2>
          <p className="text-indigo-100 text-lg max-w-2xl leading-relaxed font-semibold">
            Strategically targeting: <span className="bg-white/15 text-white font-black px-3 py-1 rounded-lg border border-white/20 ml-1">{topWeakness}</span>
          </p>
        </div>
      </motion.div>

      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '2rem',
          alignItems: 'start',
        }}
      >
        {/* Assessment Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-panel p-7 md:p-8 rounded-[2.5rem] border border-white shadow-lg space-y-8 md:sticky md:top-6"
        >
          <div className="flex items-center gap-4 border-b-2 border-indigo-50 pb-5">
            <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-600/30">
              <BarChart2 className="text-white" size={22} />
            </div>
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest">Entry Metrics</h3>
          </div>
          <div className="space-y-8">
            {skillData.map((skill, idx) => (
              <div key={skill.label} className="space-y-3">
                <div className="flex justify-between items-end px-1">
                  <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">{skill.label} Proficiency</span>
                  <span className="text-2xl font-black text-slate-800">{skill.value}<span className="text-xs text-slate-400 ml-1">/{skill.max}</span></span>
                </div>
                <div className="h-3 bg-indigo-50 rounded-full overflow-hidden border border-indigo-100">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(skill.value / skill.max) * 100}%` }}
                    transition={{ duration: 1.5, ease: 'easeOut', delay: idx * 0.15 }}
                    className={`h-full rounded-full ${
                      (skill.value / skill.max) < 0.5
                        ? 'bg-gradient-to-r from-pink-500 to-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.4)]'
                        : 'bg-gradient-to-r from-indigo-500 to-blue-400 shadow-[0_0_10px_rgba(99,102,241,0.4)]'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-[2rem] shadow-inner">
            <div className="flex items-center gap-3 text-indigo-600 font-black text-[11px] mb-5 uppercase tracking-[0.2em]">
              <AlertCircle size={18} /> Academic Insights
            </div>
            <ul className="space-y-4">
              {plan.advice.map((item, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex gap-3 text-slate-700 text-sm leading-relaxed font-semibold"
                >
                  <CheckCircle size={18} className="text-indigo-500 flex-shrink-0 mt-0.5" />
                  {item}
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Roadmap Path */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel p-7 md:p-8 rounded-[2.5rem] border border-white shadow-lg space-y-8"
        >
          <div className="flex items-center gap-4 border-b-2 border-indigo-50 pb-5">
            <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-600/30">
              <MapIcon className="text-white" size={22} />
            </div>
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest">Immersion Schedule</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { title: 'Beginner', text: 'Build core literacy and foundational habits.' },
              { title: 'Intermediate', text: 'Start practical projects in your chosen IT track.' },
              { title: 'Advanced', text: 'Refine a specialization and strengthen your portfolio.' },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.08 }}
                className="rounded-[1.75rem] border border-slate-100 bg-white/90 p-5 shadow-[0_12px_30px_-18px_rgba(15,23,42,0.35)]"
              >
                <div className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-2">Phase {index + 1}</div>
                <h4 className="text-lg font-black text-slate-800 mb-2">{item.title}</h4>
                <p className="text-sm leading-relaxed text-slate-500 font-medium">{item.text}</p>
              </motion.div>
            ))}
          </div>
          
          <div className="grid grid-cols-1 xl:grid-cols-[1.08fr_0.92fr] gap-6 xl:gap-8 items-start">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['Beginner', 'Intermediate', 'Advanced'].map((level, i) => {
              const colors = [
                { border: 'border-emerald-200', bg: 'bg-emerald-50', text: 'text-emerald-600', badge: 'bg-emerald-600' },
                { border: 'border-amber-200',   bg: 'bg-amber-50',   text: 'text-amber-600',   badge: 'bg-amber-600'   },
                { border: 'border-indigo-200',  bg: 'bg-indigo-50',  text: 'text-indigo-600',  badge: 'bg-indigo-600'  },
              ][i];
              return (
                <motion.div 
                  key={level}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.25 + i * 0.15 }}
                  className={`p-5 md:p-6 border-2 ${colors.border} ${colors.bg} rounded-[2rem] hover:shadow-[0_15px_40px_-10px_rgba(37,99,235,0.15)] hover:-translate-y-1 transition-all duration-300 group min-h-[190px]`}
                >
                  <div className="flex items-center gap-4 mb-3">
                    <div className={`w-11 h-11 rounded-2xl ${colors.badge} flex items-center justify-center text-base font-black text-white shadow-lg`}>
                      P{i + 1}
                    </div>
                    <div>
                      <span className={`text-[10px] font-black uppercase tracking-[0.3em] ${colors.text} block mb-1`}>Phase Mastery</span>
                      <h4 className="text-lg md:text-xl font-black text-slate-800 tracking-tight">{level} Integration</h4>
                    </div>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed font-semibold ml-[3.25rem] md:ml-[3.9rem]">{plan[level.toLowerCase()]}</p>
                </motion.div>
              );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="p-5 md:p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-[2rem] border-2 border-emerald-100 shadow-sm hover:shadow-md transition-all"
              >
                <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3 mb-3">
                  <div className="p-2 bg-emerald-500 rounded-xl"><Award size={16} className="text-white" /></div>
                  Milestone Projects
                </div>
                <p className="text-sm text-slate-700 leading-relaxed font-semibold">{plan.projects}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="p-5 md:p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-[2rem] border-2 border-indigo-100 shadow-sm hover:shadow-md transition-all"
              >
                <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3 mb-3">
                  <div className="p-2 bg-indigo-600 rounded-xl"><Rocket size={16} className="text-white" /></div>
                  Professional Stack
                </div>
                <p className="text-sm text-slate-700 leading-relaxed font-semibold">{plan.tools}</p>
              </motion.div>

              <div className="rounded-[2rem] border border-slate-100 bg-white/90 p-5 shadow-[0_12px_30px_-18px_rgba(15,23,42,0.35)]">
                <div className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-3">Quick Focus</div>
                <p className="text-sm leading-relaxed text-slate-600 font-semibold">
                  Keep the roadmap balanced: one core skill block, one project block, and one toolkit block at a time.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Roadmap;
