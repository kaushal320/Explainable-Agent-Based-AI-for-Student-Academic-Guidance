import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Code, 
  Database, 
  Coffee, 
  GraduationCap, 
  ChevronRight, 
  Loader2,
  Trophy,
  ArrowRight,
  User as UserIcon
} from 'lucide-react';
import { predictCareer } from '../api';

const Onboarding = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    gpa: 3.0,
    python_exp: "I know the basics (loops, functions)",
    sql_exp: "I can write basic SELECT queries",
    java_exp: "I have never programmed in Java",
    domain: "Software Engineering"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const totalSteps = 3;

  const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const prediction = await predictCareer(formData);
      onComplete({ ...formData, prediction });
    } catch (err) {
      setError("Network Failure: Ensure API is active.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="scholar-card"
      >
        <div className="scholar-header" style={{ padding: '2.5rem 2rem' }}>
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white rounded-2xl shadow-xl transform -rotate-3 border-4 border-indigo-50">
              <UserIcon className="text-indigo" size={32} />
            </div>
          </div>
          <h1 className="scholar-h1 text-white mb-2" style={{ fontSize: '2.5rem' }}>Scholar Portal</h1>
          <p className="scholar-mini text-white opacity-70">Academic Mastery System</p>
        </div>

        <div className="p-10">
          {/* Progress Bar */}
          <div className="flex gap-6 mb-12">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex-1 space-y-3">
                <div className={`h-2.5 rounded-full transition-all duration-500 ${step >= i ? 'bg-indigo shadow-md' : 'bg-slate-100'}`} />
                <div className="flex justify-between scholar-mini">
                   <span className={step >= i ? 'text-indigo' : 'text-slate-300'}>Phase</span>
                   <span className={step >= i ? 'text-indigo' : 'text-slate-300'}>0{i}</span>
                </div>
              </div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-10"
              >
                <div>
                  <label className="scholar-label mb-3 flex items-center gap-3">
                    <GraduationCap size={18} className="text-indigo" /> GPA Performance
                  </label>
                  <div className="gpa-group" style={{ position: 'relative', display: 'block' }}>
                    <input 
                      type="number" step="0.01" value={formData.gpa}
                      onChange={(e) => setFormData({...formData, gpa: parseFloat(e.target.value)})}
                      className="gpa-input"
                    />
                    <div className="badge-pill" style={{ right: '0.75rem' }}>Scale 4.0</div>
                  </div>
                </div>

                <div>
                  <label className="scholar-label mb-3 flex items-center gap-3">
                    <Sparkles size={18} className="text-indigo" /> Target Professional Field
                  </label>
                  <div className="gpa-group" style={{ position: 'relative', display: 'block' }}>
                    <select 
                      value={formData.domain} onChange={(e) => setFormData({...formData, domain: e.target.value})}
                      className="select-input"
                    >
                      <option>Software Engineering</option>
                      <option>Data Science</option>
                      <option>Cybersecurity</option>
                      <option>AI Engineering</option>
                      <option>Web Development</option>
                    </select>
                    <div style={{ position: 'absolute', right: '1.5rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex', alignItems: 'center' }}>
                      <ChevronRight size={22} className="text-indigo opacity-30" style={{ transform: 'rotate(90deg)' }} />
                    </div>
                  </div>
                </div>

                <button onClick={nextStep} className="btn-premium mt-8">
                  Assessment <ArrowRight size={24} />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="flex flex-col gap-8"
              >
                {[
                  { key: 'python_exp', icon: Code, label: 'Python Mastery' },
                  { key: 'sql_exp', icon: Database, label: 'Data Architecture' },
                  { key: 'java_exp', icon: Coffee, label: 'Java Engineering' }
                ].map((skill) => (
                  <div key={skill.key}>
                    <label className="scholar-label mb-2 flex items-center gap-3">
                       <skill.icon size={18} className="text-indigo" /> {skill.label}
                    </label>
                    <div className="gpa-group" style={{ position: 'relative', display: 'block' }}>
                      <select 
                        value={formData[skill.key]} onChange={(e) => setFormData({...formData, [skill.key]: e.target.value})}
                        className="select-input"
                        style={{ padding: '1rem 1.5rem', fontSize: '1rem' }}
                      >
                        {["I have never used it", "Basics (loops, functions)", "Advanced / Projects"].map(opt => <option key={opt}>{opt}</option>)}
                      </select>
                      <div style={{ position: 'absolute', right: '1.25rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', display: 'flex', alignItems: 'center' }}>
                        <ChevronRight size={20} className="text-indigo opacity-30" style={{ transform: 'rotate(90deg)' }} />
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="flex gap-8 mt-10">
                  <button onClick={prevStep} className="btn-back">Back</button>
                  <button onClick={nextStep} className="btn-premium flex-1">Review Assessment <ArrowRight size={24} /></button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="s3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} 
                className="flex flex-col gap-10 text-center"
              >
                <div className="flex justify-center">
                   <div className="p-6 bg-indigo rounded-3xl shadow-xl">
                      <Trophy className="text-white" size={48} />
                   </div>
                </div>
                <div>
                  <h2 className="scholar-h2 mb-2" style={{ fontSize: '1.75rem' }}>Final Verification</h2>
                  <p className="scholar-mini text-slate-400">Engineering your career path</p>
                </div>

                <div className="bg-slate-50 rounded-3xl p-8 flex flex-col gap-5 text-left border-4 border-slate-100">
                  <div className="flex justify-between items-center border-b-2 border-slate-200 pb-5">
                    <span className="scholar-mini text-slate-400">Field</span>
                    <span className="text-indigo font-black text-lg">{formData.domain}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="scholar-mini text-slate-400">GPA Score</span>
                    <span className="scholar-h2" style={{ fontSize: '2rem' }}>{formData.gpa}</span>
                  </div>
                </div>

                <div className="flex gap-8">
                  <button onClick={prevStep} className="btn-back flex-1">Edit</button>
                  <button onClick={handleSubmit} disabled={loading} className="btn-premium flex-1">
                    {loading ? <Loader2 className="animate-spin" size={24} /> : <>Predict <Sparkles size={24} /></>}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Onboarding;
