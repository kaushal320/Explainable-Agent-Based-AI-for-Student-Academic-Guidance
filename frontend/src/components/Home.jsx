import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Brain, Sparkles, Target, BookOpen, ChevronRight, Zap, Users, Award, TrendingUp } from 'lucide-react';

const FEATURES = [
  { icon: Target,   title: 'Career Prediction', accent: '#2563eb', glow: 'rgba(37,99,235,0.18)',  bg: 'linear-gradient(135deg,#eff6ff,#e0e7ff)', border: '#bfdbfe', desc: 'ML models analyze your academic profile to predict the most suitable IT career path with high accuracy.' },
  { icon: Brain,    title: 'AI Personal Tutor',  accent: '#7c3aed', glow: 'rgba(124,58,237,0.18)', bg: 'linear-gradient(135deg,#f5f3ff,#ede9fe)', border: '#c4b5fd', desc: 'Chat with a RAG-powered tutor that understands your curriculum and provides tailored guidance.' },
  { icon: BookOpen, title: 'Resource Hub',       accent: '#059669', glow: 'rgba(5,150,105,0.18)',  bg: 'linear-gradient(135deg,#ecfdf5,#d1fae5)', border: '#6ee7b7', desc: 'Access curated resources, courses and materials tailored to your predicted career path.' },
];

const STATS = [
  { icon: Users,      value: '500+', label: 'Students Guided'     },
  { icon: Award,      value: '95%',  label: 'Prediction Accuracy' },
  { icon: TrendingUp, value: '3×',   label: 'Faster Career Clarity'},
];

const up = (delay = 0) => ({
  initial: { opacity: 0, y: 26 },
  animate: { opacity: 1, y: 0 },
  transition: { type: 'spring', stiffness: 85, delay },
});

const wiv = (delay = 0) => ({
  initial: { opacity: 0, y: 26 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { type: 'spring', stiffness: 85, delay },
});

export default function Home() {
  return (
    <div style={{ minHeight:'100vh', paddingTop:'6rem', paddingBottom:'4rem', position:'relative', overflow:'hidden', background:'#f8fafc' }}>

      {/* blobs */}
      {[
        { top:'-8rem',    left:'-8rem',  size:'36rem', c:'rgba(59,130,246,0.10)', d:200 },
        { top:'10rem',    right:'-10rem',size:'40rem', c:'rgba(124,58,237,0.08)', d:240 },
        { bottom:'-6rem', left:'30%',    size:'28rem', c:'rgba(16,185,129,0.07)', d:280 },
      ].map((b,i)=>(
        <motion.div key={i} animate={{ rotate: i%2===0?360:-360 }} transition={{ duration:b.d, repeat:Infinity, ease:'linear' }}
          style={{ position:'fixed', top:b.top, right:b.right, bottom:b.bottom, left:b.left,
            width:b.size, height:b.size, background:b.c, borderRadius:'9999px', filter:'blur(80px)', pointerEvents:'none', zIndex:0 }} />
      ))}

      <div className="site-container" style={{ position:'relative', zIndex:1 }}>

        {/* HERO */}
        <div style={{ textAlign:'center', padding:'3rem 0 5rem' }}>
          <motion.div {...up(0)} style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', padding:'0.5rem 1.25rem', borderRadius:'9999px', background:'rgba(255,255,255,0.9)', border:'1px solid #e0e7ff', boxShadow:'0 4px 14px rgba(79,70,229,0.1)', marginBottom:'2rem' }}>
            <Sparkles size={15} style={{ color:'#4f46e5' }} />
            <span style={{ fontSize:'11px', fontWeight:900, textTransform:'uppercase', letterSpacing:'0.2em', color:'#4f46e5' }}>AI-Powered Academic Guidance</span>
          </motion.div>

          <motion.h1 {...up(0.07)} style={{ fontSize:'clamp(2.4rem,6vw,5rem)', fontWeight:950, lineHeight:1.05, letterSpacing:'-0.03em', color:'#0f172a', margin:'0 auto 1.5rem', maxWidth:'16ch' }}>
            Predict Your{' '}
            <span style={{ background:'linear-gradient(135deg,#2563eb,#7c3aed)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Career Path</span>{' '}
            with Precision
          </motion.h1>

          <motion.p {...up(0.13)} style={{ fontSize:'1.1rem', color:'#64748b', maxWidth:'580px', margin:'0 auto 2.5rem', lineHeight:1.75, fontWeight:500 }}>
            Leverage explainable AI to analyze your strengths, predict your optimal IT career, and receive personalized tutoring to get there faster.
          </motion.p>

          <motion.div {...up(0.19)} style={{ display:'flex', gap:'1rem', justifyContent:'center', flexWrap:'wrap' }}>
            <Link to="/app">
              <motion.button whileHover={{ scale:1.05, y:-2 }} whileTap={{ scale:0.97 }}
                style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', background:'linear-gradient(135deg,#2563eb,#4f46e5)', color:'#fff', padding:'0.9rem 2.25rem', borderRadius:'9999px', fontWeight:900, fontSize:'1rem', border:'none', cursor:'pointer', boxShadow:'0 15px 35px -8px rgba(37,99,235,0.45)' }}>
                Enter Portal <ChevronRight size={18} />
              </motion.button>
            </Link>
            <Link to="/feedback">
              <motion.button whileHover={{ scale:1.04, y:-2 }} whileTap={{ scale:0.97 }}
                style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', background:'#fff', color:'#374151', padding:'0.9rem 2.25rem', borderRadius:'9999px', fontWeight:800, fontSize:'1rem', border:'2px solid #e2e8f0', cursor:'pointer', boxShadow:'0 4px 14px rgba(0,0,0,0.06)' }}>
                Provide Feedback
              </motion.button>
            </Link>
          </motion.div>
        </div>

        {/* STATS */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:'1rem', marginBottom:'4rem' }}>
          {STATS.map(({ icon:Icon, value, label }, i) => (
            <motion.div key={label} {...wiv(i*0.08)}
              style={{ background:'#fff', borderRadius:'1.5rem', padding:'1.75rem', border:'1.5px solid #f1f5f9', boxShadow:'0 4px 20px rgba(2,6,23,0.04)', textAlign:'center' }}>
              <div style={{ width:'2.75rem', height:'2.75rem', borderRadius:'0.875rem', background:'linear-gradient(135deg,#eff6ff,#e0e7ff)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 0.875rem' }}>
                <Icon size={20} style={{ color:'#2563eb' }} />
              </div>
              <div style={{ fontSize:'2rem', fontWeight:950, color:'#0f172a', letterSpacing:'-0.03em', lineHeight:1 }}>{value}</div>
              <div style={{ fontSize:'10px', color:'#94a3b8', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.15em', marginTop:'0.4rem' }}>{label}</div>
            </motion.div>
          ))}
        </div>

        {/* FEATURES */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:'1.25rem', marginBottom:'5rem' }}>
          {FEATURES.map(({ icon:Icon, title, desc, accent, glow, bg, border }, i) => (
            <motion.div key={title} {...wiv(i*0.1)}
              whileHover={{ y:-8, boxShadow:`0 30px 60px -15px ${glow}` }}
              style={{ background:'#fff', borderRadius:'2rem', padding:'2.25rem', border:'1.5px solid #f1f5f9', boxShadow:'0 4px 20px rgba(2,6,23,0.04)', transition:'all 0.3s cubic-bezier(0.16,1,0.3,1)', position:'relative', overflow:'hidden' }}>
              <div style={{ position:'absolute', top:0, left:0, right:0, height:'3px', background:`linear-gradient(90deg,${accent},transparent)` }} />
              <div style={{ width:'3.25rem', height:'3.25rem', borderRadius:'1rem', background:bg, border:`1.5px solid ${border}`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'1.25rem' }}>
                <Icon size={24} style={{ color:accent }} />
              </div>
              <h3 style={{ fontSize:'1.15rem', fontWeight:900, color:'#0f172a', marginBottom:'0.75rem', letterSpacing:'-0.01em' }}>{title}</h3>
              <p style={{ fontSize:'0.9rem', color:'#64748b', lineHeight:1.7, fontWeight:500, margin:0 }}>{desc}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA BANNER */}
        <motion.div {...wiv(0)} style={{ background:'linear-gradient(135deg,#0f172a 0%,#1e3a8a 45%,#2563eb 80%,#7c3aed 100%)', borderRadius:'2.5rem', padding:'4rem 3rem', textAlign:'center', position:'relative', overflow:'hidden', boxShadow:'0 40px 80px -20px rgba(37,99,235,0.4)' }}>
          {[
            { top:'-5rem',   right:'-5rem',  size:'20rem', c:'rgba(255,255,255,0.06)', d:200 },
            { bottom:'-4rem',left:'-4rem',   size:'16rem', c:'rgba(99,102,241,0.2)',   d:260 },
          ].map((b,i)=>(
            <motion.div key={i} animate={{ rotate:i%2===0?360:-360 }} transition={{ duration:b.d, repeat:Infinity, ease:'linear' }}
              style={{ position:'absolute', top:b.top, right:b.right, bottom:b.bottom, left:b.left, width:b.size, height:b.size, background:b.c, borderRadius:'9999px', filter:'blur(40px)', pointerEvents:'none' }} />
          ))}

          <div style={{ position:'relative', zIndex:1 }}>
            <motion.div initial={{ scale:0 }} whileInView={{ scale:1 }} viewport={{ once:true }} transition={{ type:'spring', delay:0.2 }}
              style={{ width:'5rem', height:'5rem', borderRadius:'1.5rem', background:'rgba(255,255,255,0.12)', border:'1px solid rgba(255,255,255,0.2)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 2rem' }}>
              <Zap size={38} style={{ color:'#fff' }} />
            </motion.div>
            <h2 style={{ fontSize:'clamp(1.8rem,4vw,3.2rem)', fontWeight:950, color:'#fff', letterSpacing:'-0.025em', margin:'0 auto 1.25rem', lineHeight:1.1, maxWidth:'18ch' }}>
              Ready to accelerate your learning?
            </h2>
            <p style={{ color:'rgba(255,255,255,0.65)', fontSize:'1.05rem', fontWeight:500, maxWidth:'52ch', margin:'0 auto 2.5rem', lineHeight:1.7 }}>
              Join the platform today and unlock your personalized academic canvas powered by state-of-the-art AI.
            </p>
            <Link to="/app">
              <motion.button whileHover={{ scale:1.05 }} whileTap={{ scale:0.97 }}
                style={{ display:'inline-flex', alignItems:'center', gap:'0.5rem', padding:'1rem 2.75rem', background:'#fff', color:'#1e3a8a', borderRadius:'9999px', fontWeight:900, fontSize:'1.05rem', border:'none', cursor:'pointer', boxShadow:'0 10px 30px rgba(0,0,0,0.25)' }}>
                Start Your Journey <ChevronRight size={18} />
              </motion.button>
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
