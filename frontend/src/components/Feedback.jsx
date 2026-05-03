import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, CheckCircle, AlertCircle, Star, Mail, FileText } from 'lucide-react';
import axios from 'axios';

const RATINGS = [
  { val: 1, label: 'Poor',      emoji: '😞' },
  { val: 2, label: 'Fair',      emoji: '😐' },
  { val: 3, label: 'Good',      emoji: '🙂' },
  { val: 4, label: 'Great',     emoji: '😊' },
  { val: 5, label: 'Excellent', emoji: '🤩' },
];

export default function Feedback() {
  const [form, setForm] = useState({ rating: 0, comment: '', user_email: '' });
  const [status, setStatus] = useState('idle');

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.rating) return;
    setStatus('submitting');
    try {
      await axios.post('http://localhost:8000/api/feedback', form);
      setStatus('success');
      setForm({ rating: 0, comment: '', user_email: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <div style={{ minHeight:'100vh', paddingTop:'6rem', paddingBottom:'4rem', position:'relative', overflow:'hidden', background:'#f8fafc' }}>

      {/* blobs */}
      {[
        { top:'-6rem',   right:'-6rem',  size:'32rem', c:'rgba(79,70,229,0.08)', d:200 },
        { bottom:'-5rem',left:'-5rem',   size:'28rem', c:'rgba(37,99,235,0.07)', d:250 },
      ].map((b,i)=>(
        <motion.div key={i} animate={{ rotate:i%2===0?360:-360 }} transition={{ duration:b.d, repeat:Infinity, ease:'linear' }}
          style={{ position:'fixed', top:b.top, right:b.right, bottom:b.bottom, left:b.left,
            width:b.size, height:b.size, background:b.c, borderRadius:'9999px', filter:'blur(80px)', pointerEvents:'none', zIndex:0 }} />
      ))}

      <div style={{ position:'relative', zIndex:1, display:'flex', flexDirection:'column', alignItems:'center', padding:'0 1.25rem' }}>

        {/* Page header */}
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ type:'spring', stiffness:85 }}
          style={{ textAlign:'center', marginBottom:'2.5rem' }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', padding:'0.45rem 1.1rem', borderRadius:'9999px', background:'rgba(255,255,255,0.9)', border:'1px solid #e0e7ff', boxShadow:'0 4px 14px rgba(79,70,229,0.1)', marginBottom:'1.25rem' }}>
            <Star size={13} style={{ color:'#f59e0b' }} />
            <span style={{ fontSize:'11px', fontWeight:900, textTransform:'uppercase', letterSpacing:'0.2em', color:'#4f46e5' }}>Share Your Experience</span>
          </div>
          <h1 style={{ fontSize:'clamp(1.8rem,4vw,3rem)', fontWeight:950, color:'#0f172a', letterSpacing:'-0.025em', lineHeight:1.1, margin:'0 0 0.75rem' }}>
            Your <span style={{ background:'linear-gradient(135deg,#2563eb,#7c3aed)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Feedback</span> Matters
          </h1>
          <p style={{ color:'#64748b', fontSize:'1rem', fontWeight:500, maxWidth:'44ch', margin:'0 auto' }}>
            Help us improve Scholar Hub — every rating and comment makes a difference.
          </p>
        </motion.div>

        {/* Card */}
        <motion.div initial={{ opacity:0, y:28 }} animate={{ opacity:1, y:0 }} transition={{ type:'spring', stiffness:80, delay:0.1 }}
          style={{ width:'100%', maxWidth:'560px', background:'#fff', borderRadius:'2.5rem', padding:'2.5rem', border:'1.5px solid #f1f5f9', boxShadow:'0 20px 60px -15px rgba(37,99,235,0.12)', position:'relative', overflow:'hidden' }}>

          {/* top accent */}
          <div style={{ position:'absolute', top:0, left:0, right:0, height:'4px', background:'linear-gradient(90deg,#2563eb,#7c3aed)' }} />

          {/* card header */}
          <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'2rem' }}>
            <div style={{ width:'3rem', height:'3rem', borderRadius:'1rem', background:'linear-gradient(135deg,#eff6ff,#e0e7ff)', border:'1.5px solid #bfdbfe', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <MessageSquare size={20} style={{ color:'#2563eb' }} />
            </div>
            <div>
              <h2 style={{ fontSize:'1.15rem', fontWeight:900, color:'#0f172a', margin:0 }}>Scholar Hub Feedback</h2>
              <p style={{ fontSize:'0.8rem', color:'#94a3b8', margin:0, fontWeight:600 }}>Takes less than a minute</p>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div key="success" initial={{ opacity:0, scale:0.85 }} animate={{ opacity:1, scale:1 }} exit={{ opacity:0 }} transition={{ type:'spring', stiffness:120 }}
                style={{ background:'linear-gradient(135deg,#ecfdf5,#d1fae5)', borderRadius:'2rem', padding:'2.5rem', textAlign:'center', border:'1.5px solid #6ee7b7' }}>
                <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', delay:0.15 }}>
                  <CheckCircle size={60} style={{ color:'#059669', margin:'0 auto 1.25rem' }} />
                </motion.div>
                <h3 style={{ fontSize:'1.4rem', fontWeight:950, color:'#0f172a', margin:'0 0 0.5rem' }}>Thank You!</h3>
                <p style={{ color:'#065f46', fontWeight:600, fontSize:'0.95rem', margin:'0 0 1.75rem', lineHeight:1.6 }}>
                  Your feedback was submitted successfully and will help us improve.
                </p>
                <motion.button whileHover={{ scale:1.04 }} whileTap={{ scale:0.97 }} onClick={() => setStatus('idle')}
                  style={{ padding:'0.75rem 2rem', background:'#fff', color:'#059669', borderRadius:'9999px', fontWeight:900, border:'2px solid #a7f3d0', cursor:'pointer', fontSize:'0.9rem' }}>
                  Submit Another
                </motion.button>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'1.75rem' }}>

                {/* error */}
                {status === 'error' && (
                  <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.875rem 1.25rem', background:'#fff1f2', border:'1.5px solid #fecdd3', borderRadius:'1rem' }}>
                    <AlertCircle size={17} style={{ color:'#be123c', flexShrink:0 }} />
                    <span style={{ fontSize:'0.875rem', color:'#be123c', fontWeight:700 }}>Failed to submit. Please try again.</span>
                  </div>
                )}

                {/* RATING */}
                <div>
                  <label style={{ display:'block', fontSize:'10px', fontWeight:900, textTransform:'uppercase', letterSpacing:'0.2em', color:'#64748b', marginBottom:'1rem' }}>
                    How would you rate your experience?
                  </label>
                  <div style={{ display:'flex', gap:'0.625rem' }}>
                    {RATINGS.map(({ val, label, emoji }) => (
                      <motion.button key={val} type="button" whileHover={{ scale:1.1, y:-3 }} whileTap={{ scale:0.92 }}
                        onClick={() => set('rating', val)}
                        style={{ flex:1, aspectRatio:'1', borderRadius:'1.25rem', border:'none', cursor:'pointer',
                          display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'0.25rem',
                          background: form.rating === val ? 'linear-gradient(135deg,#2563eb,#4f46e5)' : '#f8fafc',
                          boxShadow: form.rating === val ? '0 10px 25px -5px rgba(37,99,235,0.4)' : '0 2px 8px rgba(2,6,23,0.04)',
                          border: form.rating === val ? 'none' : '1.5px solid #f1f5f9',
                          transform: form.rating === val ? 'scale(1.08)' : 'scale(1)',
                          transition:'all 0.25s cubic-bezier(0.16,1,0.3,1)' }}>
                        <span style={{ fontSize:'1.4rem', lineHeight:1 }}>{emoji}</span>
                        <span style={{ fontSize:'8px', fontWeight:900, textTransform:'uppercase', letterSpacing:'0.1em', color: form.rating === val ? 'rgba(255,255,255,0.8)' : '#94a3b8' }}>{label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* EMAIL */}
                <div>
                  <label style={{ display:'block', fontSize:'10px', fontWeight:900, textTransform:'uppercase', letterSpacing:'0.2em', color:'#64748b', marginBottom:'0.75rem' }}>
                    Email <span style={{ color:'#cbd5e1', fontWeight:600 }}>(optional)</span>
                  </label>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', background:'#f8fafc', border:'1.5px solid #f1f5f9', borderRadius:'1rem', padding:'0 1rem', transition:'border-color 0.2s' }}
                    onFocus={(e)=>e.currentTarget.style.borderColor='#bfdbfe'}
                    onBlur={(e)=>e.currentTarget.style.borderColor='#f1f5f9'}>
                    <Mail size={16} style={{ color:'#94a3b8', flexShrink:0 }} />
                    <input type="email" placeholder="scholar@example.com" value={form.user_email}
                      onChange={(e) => set('user_email', e.target.value)}
                      style={{ flex:1, border:'none', outline:'none', background:'transparent', padding:'0.875rem 0', fontSize:'0.925rem', fontWeight:700, color:'#0f172a' }} />
                  </div>
                </div>

                {/* COMMENT */}
                <div>
                  <label style={{ display:'block', fontSize:'10px', fontWeight:900, textTransform:'uppercase', letterSpacing:'0.2em', color:'#64748b', marginBottom:'0.75rem' }}>
                    Your Thoughts
                  </label>
                  <div style={{ display:'flex', gap:'0.75rem', alignItems:'flex-start', background:'#f8fafc', border:'1.5px solid #f1f5f9', borderRadius:'1rem', padding:'0.75rem 1rem' }}>
                    <FileText size={16} style={{ color:'#94a3b8', flexShrink:0, marginTop:'0.125rem' }} />
                    <textarea required placeholder="What do you like? What could be better?" value={form.comment}
                      onChange={(e) => set('comment', e.target.value)}
                      style={{ flex:1, border:'none', outline:'none', background:'transparent', minHeight:'120px', resize:'vertical', fontSize:'0.925rem', fontWeight:600, color:'#0f172a', lineHeight:1.65, fontFamily:'inherit' }} />
                  </div>
                </div>

                {/* SUBMIT */}
                <motion.button type="submit" disabled={status==='submitting' || !form.rating}
                  whileHover={ status==='submitting' ? {} : { scale:1.02, y:-2 } }
                  whileTap={ status==='submitting' ? {} : { scale:0.98 } }
                  style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'0.625rem',
                    width:'100%', padding:'1rem', border:'none', cursor: form.rating ? 'pointer' : 'not-allowed',
                    borderRadius:'1.25rem', fontWeight:900, fontSize:'1rem',
                    background: form.rating ? 'linear-gradient(135deg,#1e3a8a,#2563eb)' : '#f1f5f9',
                    color: form.rating ? '#fff' : '#94a3b8',
                    boxShadow: form.rating ? '0 15px 35px -8px rgba(37,99,235,0.4)' : 'none',
                    opacity: status==='submitting' ? 0.7 : 1,
                    transition:'all 0.3s cubic-bezier(0.16,1,0.3,1)' }}>
                  {status === 'submitting' ? (
                    <div style={{ width:'1.25rem', height:'1.25rem', border:'2px solid rgba(255,255,255,0.4)', borderTopColor:'#fff', borderRadius:'9999px', animation:'spin 0.8s linear infinite' }} />
                  ) : (
                    <><Send size={18} /> Submit Feedback</>
                  )}
                </motion.button>

              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
