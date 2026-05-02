import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Send, CheckCircle, AlertCircle } from 'lucide-react';
import axios from 'axios';

const Feedback = () => {
  const [formData, setFormData] = useState({ rating: 5, comment: '', user_email: '' });
  const [status, setStatus] = useState('idle'); // idle, submitting, success, error

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    try {
      await axios.post('http://localhost:8000/api/feedback', formData);
      setStatus('success');
      setFormData({ rating: 5, comment: '', user_email: '' });
    } catch (error) {
      console.error("Feedback error:", error);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-[#fafcff] pt-32 pb-20 flex items-center justify-center px-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl bg-white p-10 md:p-14 rounded-[3rem] shadow-xl shadow-slate-200/50 border border-slate-100"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="p-4 bg-indigo-50 rounded-2xl">
             <MessageSquare className="text-indigo-600" size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">Your Feedback</h1>
            <p className="text-slate-500 font-medium mt-1">Help us improve the Scholar Hub experience.</p>
          </div>
        </div>

        {status === 'success' ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 bg-emerald-50 rounded-3xl border border-emerald-100 text-center"
          >
            <CheckCircle size={48} className="text-emerald-500 mx-auto mb-4" />
            <h2 className="text-xl font-black text-slate-800 mb-2">Thank You!</h2>
            <p className="text-emerald-700 font-medium">Your feedback has been successfully submitted and will help us improve.</p>
            <button 
              onClick={() => setStatus('idle')}
              className="mt-6 px-6 py-2.5 bg-white text-emerald-700 rounded-xl font-bold shadow-sm border border-emerald-200 hover:bg-emerald-50 transition-colors"
            >
              Submit Another
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
            {status === 'error' && (
              <div className="p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-3 font-medium text-sm">
                <AlertCircle size={18} />
                Failed to submit feedback. Please try again.
              </div>
            )}

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">How would you rate your experience?</label>
              <div className="flex gap-4">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, rating: num }))}
                    className={`w-12 h-12 rounded-2xl font-black text-lg flex items-center justify-center transition-all ${
                      formData.rating === num 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 scale-110' 
                        : 'bg-slate-50 text-slate-400 hover:bg-slate-100'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Email (Optional)</label>
              <input
                type="email"
                placeholder="scholar@example.com"
                value={formData.user_email}
                onChange={(e) => setFormData(prev => ({ ...prev, user_email: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-slate-800 transition-all placeholder:text-slate-400"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">Your Thoughts</label>
              <textarea
                required
                placeholder="What do you like? What could be better?"
                value={formData.comment}
                onChange={(e) => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 font-medium text-slate-800 transition-all placeholder:text-slate-400 min-h-[150px] resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-indigo-600 hover:shadow-xl hover:shadow-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'submitting' ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <Send size={20} />
                  Submit Feedback
                </>
              )}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default Feedback;
