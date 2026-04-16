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
    <div className="space-y-12 overflow-y-auto max-h-[calc(100vh-180px)] pr-6 custom-scrollbar pb-10">
      {/* Hero Header */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.98, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="dashboard-hero bg-white border-4 border-indigo-600 shadow-2xl relative overflow-hidden flex flex-col xl:flex-row items-center gap-10"
      >
        <div className="p-5 bg-indigo-600 rounded-3xl shadow-xl shadow-indigo-600/30 transform -rotate-3">
          <Rocket className="text-white" size={44} />
        </div>
        <div className="flex-1 text-center xl:text-left space-y-3">
          <div className="flex items-center justify-center xl:justify-start gap-4 text-indigo-600 font-black uppercase tracking-[0.3em] text-[10px]">
            <Target size={18} /> Career Objective
          </div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tight leading-none uppercase">{career}</h2>
          <p className="text-slate-500 text-lg max-w-2xl leading-relaxed font-bold">
            Strategically targeting: <span className="text-indigo-600 font-black px-3 py-1 bg-indigo-50 rounded-lg">{topWeakness}</span>
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Assessment Card */}
        <div className="lg:col-span-4 metric-card bg-white border-2 border-indigo-100 shadow-xl space-y-8">
          <div className="flex items-center gap-4 border-b-2 border-indigo-50 pb-5">
            <BarChart2 className="text-indigo-600" size={24} />
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest">Entry Metrics</h3>
          </div>
          <div className="space-y-8">
            {skillData.map((skill) => (
              <div key={skill.label} className="space-y-4">
                <div className="flex justify-between items-end px-1">
                  <span className="text-[12px] font-black uppercase tracking-[0.2em] text-slate-500">{skill.label} Proficiency</span>
                  <span className="text-2xl font-black text-slate-800">{skill.value}<span className="text-xs text-slate-400 ml-1">/{skill.max}</span></span>
                </div>
                <div className="h-4 bg-indigo-50 rounded-full overflow-hidden border-2 border-indigo-100 shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(skill.value / skill.max) * 100}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className={`h-full ${
                      (skill.value / skill.max) < 0.5 ? 'bg-pink-500' : 'bg-indigo-600 shadow-[0_0_20px_rgba(37,99,235,0.4)]'
                    }`}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-8 bg-[#f8fbff] border-2 border-indigo-50 rounded-[2rem] mt-4 shadow-inner">
            <div className="flex items-center gap-3 text-indigo-600 font-black text-[11px] mb-5 uppercase tracking-[0.2em]">
              <AlertCircle size={20} /> Academic Insights
            </div>
            <ul className="space-y-5">
              {plan.advice.map((item, i) => (
                <li key={i} className="flex gap-4 text-slate-700 text-sm leading-relaxed font-bold">
                  <CheckCircle size={18} className="text-indigo-600 flex-shrink-0 mt-0.5" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Roadmap Path */}
        <div className="lg:col-span-8 metric-card bg-white border-2 border-indigo-100 shadow-xl space-y-8">
          <div className="flex items-center gap-4 border-b-2 border-indigo-50 pb-5">
            <MapIcon className="text-indigo-600" size={24} />
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-widest">Immersion Schedule</h3>
          </div>
          
          <div className="space-y-6">
            {['Beginner', 'Intermediate', 'Advanced'].map((level, i) => (
              <motion.div 
                key={level}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.15 }}
                className="p-8 border-2 border-indigo-50 bg-[#f8fbff] rounded-[2.5rem] hover:border-indigo-600 hover:bg-white transition-all group shadow-sm"
              >
                <div className="flex items-center gap-6 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-xl font-black text-white shadow-xl shadow-indigo-600/30">
                    P{i + 1}
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-600 block mb-1">Phase Mastery</span>
                    <h4 className="text-2xl font-black text-slate-800 tracking-tight">{level} Integration</h4>
                  </div>
                </div>
                <p className="text-slate-600 text-lg leading-relaxed font-bold">{plan[level.toLowerCase()]}</p>
              </motion.div>
            ))}

            <div className="pt-8 border-t-2 border-indigo-50 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-[#f8fbff] rounded-[2rem] border-2 border-indigo-50 shadow-inner">
                <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3 mb-4">
                  <Award size={24} className="text-emerald-500" /> Milestone Projects
                </div>
                <p className="text-sm text-slate-700 leading-relaxed font-bold">{plan.projects}</p>
              </div>
              <div className="p-8 bg-[#f8fbff] rounded-[2rem] border-2 border-indigo-50 shadow-inner">
                <div className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-3 mb-4">
                  <Rocket size={24} className="text-indigo-600" /> Professional Stack
                </div>
                <p className="text-sm text-slate-700 leading-relaxed font-bold">{plan.tools}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
