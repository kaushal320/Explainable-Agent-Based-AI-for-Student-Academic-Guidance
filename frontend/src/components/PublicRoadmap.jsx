import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  MapIcon, Target, Lock, Zap, Globe, Shield,
  BarChart2, ChevronRight, Rocket, Award, CheckCircle, AlertCircle,
} from "lucide-react";

const IT_FIELDS = [
  {
    icon: Globe,
    gradient: "linear-gradient(135deg,#3b82f6,#6366f1)",
    glowColor: "rgba(99,102,241,0.18)",
    title: "Web Development",
    tags: ["HTML", "CSS", "JavaScript", "React"],
    desc: "Build the interfaces and experiences that billions of people interact with every day.",
  },
  {
    icon: BarChart2,
    gradient: "linear-gradient(135deg,#10b981,#0d9488)",
    glowColor: "rgba(16,185,129,0.18)",
    title: "Data Science",
    tags: ["Python", "SQL", "Machine Learning", "Visualisation"],
    desc: "Extract insights from data, build predictive models, and drive evidence-based decisions.",
  },
  {
    icon: Shield,
    gradient: "linear-gradient(135deg,#f43f5e,#e11d48)",
    glowColor: "rgba(244,63,94,0.18)",
    title: "Cybersecurity",
    tags: ["Networks", "Ethical Hacking", "Compliance", "SIEM"],
    desc: "Protect systems, detect threats, and keep critical data safe in a connected world.",
  },
];

const SKILLS = [
  { label: "Python",  value: 1, max: 3, color: "#6366f1" },
  { label: "SQL",     value: 1, max: 3, color: "#3b82f6" },
  { label: "Java",    value: 1, max: 3, color: "#8b5cf6" },
  { label: "GPA",     value: 4, max: 4, color: "#10b981" },
];

const ADVICE = [
  "Start with programming basics, Git, and problem solving",
  "Explore major IT paths such as web development, data, and cybersecurity",
  "Build small projects that show your interest in a chosen field",
];

const PHASES = [
  { n: "01", title: "Beginner", color: "#059669",  bg: "linear-gradient(135deg,#ecfdf5,#d1fae5)", border: "#6ee7b7", text: "Learn core computing concepts, syntax, file handling and basic algorithms." },
  { n: "02", title: "Intermediate", color: "#d97706", bg: "linear-gradient(135deg,#fffbeb,#fef3c7)", border: "#fcd34d", text: "Build practical projects across web, database and automation domains." },
  { n: "03", title: "Advanced", color: "#4f46e5",   bg: "linear-gradient(135deg,#eef2ff,#e0e7ff)", border: "#a5b4fc", text: "Choose a specialization and craft a portfolio ready for the job market." },
];

const up = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { type: "spring", stiffness: 85, delay },
});

/* ── tiny label above each section ── */
const Tag = ({ icon, label }) => (
  <div style={{ display:"flex", alignItems:"center", gap:"0.4rem", marginBottom:"1.25rem" }}>
    <span style={{ color:"#2563eb" }}>{icon}</span>
    <span style={{ fontSize:"10px", fontWeight:900, textTransform:"uppercase", letterSpacing:"0.22em", color:"#94a3b8" }}>{label}</span>
  </div>
);

export default function PublicRoadmap() {
  return (
    <div className="public-page-container" style={{ position:"relative", zIndex:10 }}>

      {/* ════════════ HERO ════════════ */}
      <motion.div
        initial={{ opacity:0, y:30 }}
        animate={{ opacity:1, y:0 }}
        transition={{ type:"spring", stiffness:80 }}
        style={{
          background:"linear-gradient(135deg,#0f172a 0%,#1e3a8a 45%,#2563eb 80%,#6366f1 100%)",
          borderRadius:"2.5rem",
          padding:"3.5rem 3rem",
          marginBottom:"2.5rem",
          position:"relative",
          overflow:"hidden",
          boxShadow:"0 30px 70px -15px rgba(37,99,235,0.45)",
        }}
      >
        {/* blobs */}
        {[
          { top:"-6rem", right:"-6rem", size:"22rem", color:"rgba(99,102,241,0.15)" },
          { bottom:"-5rem", left:"-5rem", size:"18rem", color:"rgba(16,185,129,0.12)" },
        ].map((b, i) => (
          <motion.div key={i} animate={{ rotate: i%2===0?360:-360 }}
            transition={{ duration: i%2===0?200:260, repeat:Infinity, ease:"linear" }}
            style={{ position:"absolute", top:b.top, right:b.right, bottom:b.bottom, left:b.left,
              width:b.size, height:b.size, background:b.color, borderRadius:"9999px",
              filter:"blur(50px)", pointerEvents:"none" }} />
        ))}

        <div style={{ position:"relative", zIndex:1 }}>
          {/* eyebrow */}
          <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", marginBottom:"1.25rem" }}>
            <Target size={13} style={{ color:"rgba(255,255,255,0.5)" }} />
            <span style={{ fontSize:"10px", fontWeight:900, textTransform:"uppercase", letterSpacing:"0.25em", color:"rgba(255,255,255,0.5)" }}>
              Public Preview · Career Path Explorer
            </span>
          </div>

          <h1 style={{ fontSize:"clamp(2rem,4.5vw,3.25rem)", fontWeight:950, color:"#fff",
            lineHeight:1.08, letterSpacing:"-0.025em", margin:"0 0 1rem" }}>
            Explore IT Career<br />
            <span style={{ color:"#93c5fd" }}>Roadmaps</span>
          </h1>

          <p style={{ color:"rgba(255,255,255,0.65)", fontSize:"1.05rem", fontWeight:500,
            maxWidth:"52ch", lineHeight:1.7, margin:"0 0 2rem" }}>
            Discover the most popular technology career paths and the exact skills needed to break in.
            Sign in for a <strong style={{ color:"#fff", fontWeight:800 }}>personalised roadmap</strong> built around your GPA and current skill levels.
          </p>

          <div style={{ display:"flex", gap:"0.875rem", flexWrap:"wrap" }}>
            <Link to="/login" style={{
              display:"inline-flex", alignItems:"center", gap:"0.5rem",
              background:"#fff", color:"#1e3a8a", padding:"0.75rem 1.75rem",
              borderRadius:"9999px", fontWeight:900, fontSize:"0.875rem",
              textDecoration:"none", boxShadow:"0 8px 25px rgba(0,0,0,0.18)",
            }}>
              <Rocket size={15} /> Get My Roadmap <ChevronRight size={14} />
            </Link>
            <span style={{
              display:"inline-flex", alignItems:"center", gap:"0.5rem",
              background:"rgba(255,255,255,0.1)", color:"rgba(255,255,255,0.75)",
              padding:"0.75rem 1.5rem", borderRadius:"9999px", fontWeight:700,
              fontSize:"0.875rem", border:"1px solid rgba(255,255,255,0.2)",
            }}>
              <Lock size={13} /> Free · No credit card
            </span>
          </div>
        </div>
      </motion.div>

      {/* ════════════ IT FIELDS ════════════ */}
      <motion.div {...up(0.05)}>
        <Tag icon={<Zap size={12}/>} label="Explore IT Paths" />
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(290px,1fr))", gap:"1.25rem" }}>
          {IT_FIELDS.map(({ icon:Icon, gradient, glowColor, title, tags, desc }, i) => (
            <motion.div key={title} {...up(0.07 + i*0.07)}
              whileHover={{ y:-7, boxShadow:`0 30px 60px -15px ${glowColor}` }}
              style={{
                background:"#fff", borderRadius:"1.75rem", padding:"1.75rem 1.75rem 1.5rem",
                border:"1.5px solid #f1f5f9", boxShadow:"0 4px 20px rgba(2,6,23,0.05)",
                transition:"all 0.3s cubic-bezier(0.16,1,0.3,1)",
              }}>
              {/* card top stripe */}
              <div style={{ height:"3px", background:gradient, borderRadius:"9999px", marginBottom:"1.25rem" }} />
              <div style={{ display:"flex", alignItems:"center", gap:"1rem", marginBottom:"0.875rem" }}>
                <div style={{ width:"2.75rem", height:"2.75rem", borderRadius:"0.875rem",
                  background:gradient, display:"flex", alignItems:"center", justifyContent:"center",
                  boxShadow:`0 8px 20px -4px ${glowColor}`, flexShrink:0 }}>
                  <Icon size={19} style={{ color:"#fff" }} />
                </div>
                <h3 style={{ fontWeight:900, fontSize:"1.05rem", color:"#0f172a", margin:0 }}>{title}</h3>
              </div>
              <p style={{ fontSize:"0.875rem", color:"#64748b", lineHeight:1.65, marginBottom:"1.1rem" }}>{desc}</p>
              <div style={{ display:"flex", flexWrap:"wrap", gap:"0.35rem" }}>
                {tags.map(t => (
                  <span key={t} style={{ fontSize:"9px", fontWeight:900, textTransform:"uppercase",
                    letterSpacing:"0.12em", padding:"0.3rem 0.7rem", borderRadius:"9999px",
                    background:"#f8fafc", color:"#475569", border:"1px solid #e2e8f0" }}>{t}</span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ════════════ SKILLS + ADVICE ════════════ */}
      <motion.div {...up(0.08)} style={{ marginTop:"2.5rem" }}>
        <Tag icon={<BarChart2 size={12}/>} label="Sample Entry Metrics" />
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))", gap:"1.25rem" }}>

          {/* skill bars */}
          <div style={{ background:"#fff", borderRadius:"1.75rem", padding:"2rem 2rem 1.75rem",
            border:"1.5px solid #f1f5f9", boxShadow:"0 4px 20px rgba(2,6,23,0.04)" }}>
            <p style={{ fontSize:"0.8rem", color:"#94a3b8", marginBottom:"1.5rem", fontWeight:600 }}>
              Sign in to replace this demo data with your actual levels.
            </p>
            <div style={{ display:"flex", flexDirection:"column", gap:"1.25rem" }}>
              {SKILLS.map((s, i) => (
                <motion.div key={s.label} {...up(0.12 + i*0.07)}>
                  <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"0.45rem" }}>
                    <span style={{ fontSize:"10px", fontWeight:900, textTransform:"uppercase",
                      letterSpacing:"0.2em", color:"#64748b" }}>{s.label}</span>
                    <span style={{ fontSize:"0.95rem", fontWeight:900, color:"#0f172a" }}>
                      {s.value}<span style={{ fontSize:"10px", color:"#cbd5e1", marginLeft:"2px" }}>/{s.max}</span>
                    </span>
                  </div>
                  <div style={{ height:"7px", background:"#f1f5f9", borderRadius:"9999px", overflow:"hidden" }}>
                    <motion.div
                      initial={{ width:0 }}
                      whileInView={{ width:`${(s.value/s.max)*100}%` }}
                      viewport={{ once:true }}
                      transition={{ duration:1.3, ease:"easeOut", delay: i*0.1 }}
                      style={{ height:"100%", borderRadius:"9999px", background:s.color,
                        boxShadow:`0 0 8px ${s.color}55` }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* advice */}
          <div style={{ background:"linear-gradient(135deg,#eff6ff,#eef2ff)", borderRadius:"1.75rem",
            padding:"2rem", border:"1.5px solid #dbeafe", boxShadow:"0 4px 20px rgba(37,99,235,0.06)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"0.5rem", marginBottom:"1.25rem" }}>
              <AlertCircle size={16} style={{ color:"#2563eb" }} />
              <span style={{ fontSize:"10px", fontWeight:900, textTransform:"uppercase",
                letterSpacing:"0.2em", color:"#2563eb" }}>Academic Insights</span>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:"1rem" }}>
              {ADVICE.map((item, i) => (
                <motion.div key={i} {...up(0.14 + i*0.07)}
                  style={{ display:"flex", gap:"0.75rem", alignItems:"flex-start",
                    background:"rgba(255,255,255,0.7)", borderRadius:"1rem", padding:"0.875rem 1rem",
                    border:"1px solid rgba(219,234,254,0.8)" }}>
                  <CheckCircle size={16} style={{ color:"#2563eb", flexShrink:0, marginTop:"1px" }} />
                  <span style={{ fontSize:"0.875rem", color:"#1e293b", fontWeight:600, lineHeight:1.55 }}>{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ════════════ PHASES ════════════ */}
      <motion.div {...up(0.1)} style={{ marginTop:"2.5rem" }}>
        <Tag icon={<MapIcon size={12}/>} label="Learning Phases" />
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:"1.25rem" }}>
          {PHASES.map((p, i) => (
            <motion.div key={p.n} {...up(0.1 + i*0.08)}
              whileHover={{ y:-5 }}
              style={{ background:p.bg, borderRadius:"1.75rem", padding:"1.75rem",
                border:`1.5px solid ${p.border}`, transition:"all 0.3s",
                boxShadow:"0 4px 20px rgba(2,6,23,0.04)" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"1rem", marginBottom:"1rem" }}>
                <div style={{ width:"2.75rem", height:"2.75rem", borderRadius:"0.875rem",
                  background:p.color, display:"flex", alignItems:"center", justifyContent:"center",
                  fontWeight:950, color:"#fff", fontSize:"0.8rem", letterSpacing:"0.05em", flexShrink:0 }}>
                  {p.n}
                </div>
                <div>
                  <div style={{ fontSize:"9px", fontWeight:900, textTransform:"uppercase",
                    letterSpacing:"0.22em", color:p.color, marginBottom:"2px" }}>Phase</div>
                  <h4 style={{ fontWeight:900, fontSize:"1rem", color:"#0f172a", margin:0 }}>{p.title}</h4>
                </div>
              </div>
              <p style={{ fontSize:"0.875rem", color:"#475569", lineHeight:1.65, margin:0, fontWeight:600 }}>{p.text}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* ════════════ TOOLS + PROJECTS ════════════ */}
      <motion.div {...up(0.1)} style={{ marginTop:"2.5rem",
        display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(260px,1fr))", gap:"1.25rem" }}>
        {[
          { icon:<Award size={17} style={{color:"#fff"}}/>, bg:"#059669", label:"Milestone Projects",
            card:"linear-gradient(135deg,#ecfdf5,#d1fae5)", border:"#a7f3d0",
            text:"Personal website · Data dashboard · Security checklist" },
          { icon:<Rocket size={17} style={{color:"#fff"}}/>, bg:"#2563eb", label:"Professional Stack",
            card:"linear-gradient(135deg,#eff6ff,#e0e7ff)", border:"#bfdbfe",
            text:"HTML, CSS, JavaScript, Python, SQL, Git" },
          { icon:<Zap size={17} style={{color:"#fff"}}/>, bg:"#d97706", label:"Quick Focus",
            card:"linear-gradient(135deg,#fffbeb,#fef9c3)", border:"#fcd34d",
            text:"One core skill · One project · One toolkit — at a time." },
        ].map((c, i) => (
          <motion.div key={c.label} {...up(0.1 + i*0.07)}
            style={{ background:c.card, borderRadius:"1.75rem", padding:"1.75rem",
              border:`1.5px solid ${c.border}`, boxShadow:"0 4px 20px rgba(2,6,23,0.04)" }}>
            <div style={{ display:"flex", alignItems:"center", gap:"0.75rem", marginBottom:"0.875rem" }}>
              <div style={{ width:"2.25rem", height:"2.25rem", borderRadius:"0.75rem",
                background:c.bg, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                {c.icon}
              </div>
              <span style={{ fontSize:"10px", fontWeight:900, textTransform:"uppercase",
                letterSpacing:"0.2em", color:"#475569" }}>{c.label}</span>
            </div>
            <p style={{ fontSize:"0.875rem", color:"#374151", lineHeight:1.65, margin:0, fontWeight:600 }}>{c.text}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* ════════════ CTA BANNER ════════════ */}
      <motion.div {...up(0.12)} style={{
        marginTop:"3rem",
        background:"linear-gradient(135deg,#0f172a 0%,#1e3a8a 50%,#2563eb 100%)",
        borderRadius:"2rem", padding:"2.75rem 3rem",
        display:"flex", flexWrap:"wrap", alignItems:"center", justifyContent:"space-between",
        gap:"1.5rem", position:"relative", overflow:"hidden",
        boxShadow:"0 30px 60px -15px rgba(37,99,235,0.35)",
      }}>
        <motion.div animate={{ rotate:360 }} transition={{ duration:180, repeat:Infinity, ease:"linear" }}
          style={{ position:"absolute", top:"-5rem", right:"-5rem", width:"18rem", height:"18rem",
            background:"rgba(255,255,255,0.04)", borderRadius:"9999px", pointerEvents:"none" }} />
        <div style={{ position:"relative", zIndex:1 }}>
          <div style={{ fontSize:"10px", fontWeight:900, color:"rgba(255,255,255,0.45)",
            textTransform:"uppercase", letterSpacing:"0.22em", marginBottom:"0.5rem" }}>
            Ready to level up?
          </div>
          <h2 style={{ fontSize:"1.65rem", fontWeight:950, color:"#fff", margin:"0 0 0.5rem", lineHeight:1.15 }}>
            Get your <span style={{ color:"#93c5fd" }}>personalised</span> roadmap today
          </h2>
          <p style={{ color:"rgba(255,255,255,0.55)", fontSize:"0.9rem", margin:0, fontWeight:500 }}>
            AI-generated career roadmap based on your actual skills and GPA.
          </p>
        </div>
        <div style={{ display:"flex", gap:"0.875rem", flexWrap:"wrap", position:"relative", zIndex:1 }}>
          <Link to="/login" style={{
            display:"inline-flex", alignItems:"center", gap:"0.5rem",
            background:"#fff", color:"#1e3a8a", padding:"0.8rem 1.75rem",
            borderRadius:"9999px", fontWeight:900, fontSize:"0.875rem", textDecoration:"none",
            boxShadow:"0 8px 25px rgba(0,0,0,0.2)",
          }}>
            <Rocket size={14}/> Sign In Free <ChevronRight size={14}/>
          </Link>
          <Link to="/learning" style={{
            display:"inline-flex", alignItems:"center", gap:"0.5rem",
            background:"rgba(255,255,255,0.08)", color:"rgba(255,255,255,0.8)",
            padding:"0.8rem 1.5rem", borderRadius:"9999px", fontWeight:700,
            fontSize:"0.875rem", textDecoration:"none",
            border:"1px solid rgba(255,255,255,0.2)",
          }}>
            Browse Learning Hub
          </Link>
        </div>
      </motion.div>

    </div>
  );
}
