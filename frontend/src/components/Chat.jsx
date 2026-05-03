import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Bot, Loader2, Sparkles, BrainCircuit, ChevronRight, MessageSquare, Zap, Cpu } from 'lucide-react';
import { streamMessage } from '../api';
import { useNavigate } from 'react-router-dom';

const MarkdownText = ({ text }) => {
  const parseContent = (rawText) => {
    const codeBlocks = [];
    let processed = rawText.replace(/```python([\s\S]*?)```/g, (match, code) => {
      const id = `CODE_BLK_${codeBlocks.length}`;
      const highlighted = code.trim()
        .replace(/\b(def|class|if|else|elif|for|while|return|import|from|as|try|except|with)\b/g, '<span style="color:#f472b6;font-weight:bold">$1</span>')
        .replace(/\b(print|len|range|int|str|float|list|dict|set|print)\b/g, '<span style="color:#7dd3fc">$1</span>')
        .replace(/#.*$/gm, '<span style="color:#64748b;font-style:italic">$0</span>')
        .replace(/(["'])(?:(?=(\\?))\2.)*?\1/g, '<span style="color:#34d399">$0</span>');
      
      codeBlocks.push(`
        <div style="background:#0f172a; border-radius:12px; overflow:hidden; margin:1.5rem 0; border:1px solid rgba(255,255,255,0.1); font-family:monospace; font-size:13px; box-shadow:0 10px 20px rgba(0,0,0,0.2)">
          <div style="background:rgba(255,255,255,0.05); padding:8px 16px; border-bottom:1px solid rgba(255,255,255,0.1); display:flex; justify-content:space-between; align-items:center">
            <span style="color:#94a3b8; font-size:10px; font-weight:bold; letter-spacing:0.1em; text-transform:uppercase">Python Environment</span>
            <button class="copy-code-btn" data-code-id="raw-code-${id}" style="color:#94a3b8; font-size:10px; font-weight:bold; cursor:pointer; background:none; border:none; display:flex; align-items:center; gap:4px">
               <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
               COPY
            </button>
          </div>
          <div style="position:relative">
            <pre style="padding:20px; margin:0; color:#f8fafc; overflow-x:auto; line-height:1.6"><code>${highlighted}</code></pre>
            <div id="raw-code-${id}" style="display:none;">${code.trim().replace(/</g, "&lt;").replace(/>/g, "&gt;")}</div>
          </div>
        </div>
      `);
      return id;
    });

    processed = processed
      .replace(/^#### (.*$)/gm, '<h4 style="color:#1e40af; font-weight:800; font-size:14px; margin:1.5rem 0 0.5rem 0; text-transform:uppercase; letter-spacing:0.1em">$1</h4>')
      .replace(/^### (.*$)/gm, '<h3 style="color:#1e3a8a; font-weight:900; font-size:16px; margin:2rem 0 1rem 0; text-transform:uppercase; letter-spacing:0.1em; border-bottom:2px solid #eff6ff; padding-bottom:6px">$1</h3>')
      .replace(/^## (.*$)/gm, '<h2 style="color:#0f172a; font-weight:900; font-size:20px; margin:2.25rem 0 1.25rem 0">$1</h2>')
      .replace(/^[=|-]{3,}$/gm, '<hr style="margin:2rem 0; border:0; border-top:1px solid #e2e8f0" />');

    processed = processed
      .replace(/\*\*(.*?)\*\*/g, '<strong style="font-weight:900; color:#0f172a">$1</strong>')
      .replace(/`(.*?)`/g, '<code style="background:#f1f5f9; padding:2px 6px; border-radius:4px; color:#1e3a8a; font-weight:900; font-size:12px; border:1px solid #e2e8f0">$1</code>');

    processed = processed
      .replace(/^\d+\.\s+(.*)$/gm, '<li style="margin: 0 0 8px 1.5rem; display:list-item; list-style-type:decimal; padding-left:8px; font-weight:500; color:#334155">$1</li>')
      .replace(/^[*|-]\s+(.*)$/gm, '<li style="margin: 0 0 8px 1.5rem; display:list-item; list-style-type:disc; padding-left:8px; font-weight:500; color:#334155">$1</li>');

    const blocks = processed.split('\n\n');
    let finalHtml = blocks.map(block => {
      if (block.includes('<h') || block.includes('<li') || block.includes('CODE_BLK_')) return block;
      return `<p style="margin-bottom:1rem; line-height:1.6; font-weight:500; color:#334155; font-size: 15px;">${block}</p>`;
    }).join('');

    codeBlocks.forEach((codeHtml, i) => {
      finalHtml = finalHtml.replace(`CODE_BLK_${i}`, codeHtml);
    });

    return finalHtml;
  };

  return <div dangerouslySetInnerHTML={{ __html: parseContent(text) }} />;
};

const Chat = ({ user }) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: `Hello! I am your AI Career Tutor. Based on your profile, I have predicted that your ideal career path is **${user.prediction.career}**! \n\nI have generated a personalized 4-week learning plan for you. Would you like to see your skill analysis or roadmap?` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [streamingText, setStreamingText] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText, loading]);

  const handleChatClick = (e) => {
    const copyBtn = e.target.closest('.copy-code-btn');
    if (copyBtn) {
      const codeBlockId = copyBtn.getAttribute('data-code-id');
      const codeElement = document.getElementById(codeBlockId);
      if (codeElement) {
        const textarea = document.createElement('textarea');
        textarea.innerHTML = codeElement.innerHTML;
        navigator.clipboard.writeText(textarea.value);
        
        const originalHtml = copyBtn.innerHTML;
        copyBtn.innerHTML = '<span style="color:#34d399">COPIED!</span>';
        setTimeout(() => { copyBtn.innerHTML = originalHtml; }, 2000);
      }
    }
  };

  const handleSend = async (msgContent = input) => {
    const textToSend = msgContent || input;
    if (!textToSend.trim() || loading) return;

    const userMsg = { role: 'user', content: textToSend };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setStreamingText('');

    try {
      const context = {
        career: user.prediction.career,
        top_weakness: user.prediction.plan.weakness_rank[0][0],
        skills: user.prediction.skills
      };

      let accumulatedResponse = '';
      await streamMessage(textToSend, messages, context, (chunk) => {
        accumulatedResponse += chunk;
        setStreamingText(accumulatedResponse);
      });

      setMessages(prev => [...prev, { role: 'assistant', content: accumulatedResponse }]);
      setStreamingText('');
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: "❌ **Link Interrupted**. Please re-engage." }]);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { label: "Analyze My Skills", icon: Zap, color: '#1e3a8a' },
    { label: "Show My Roadmap", icon: ChevronRight, color: '#059669' },
    { label: "Improve GPA", icon: Sparkles, color: '#b45309' }
  ];

  const navigate = useNavigate();

  return (
    <div className="chat-window-scholar" onClick={handleChatClick}>
      
      {/* HEADER BAR */}
      <header className="chat-header-scholar">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
               <BrainCircuit size={20} />
            </div>
            <div>
               <h3 className="text-slate-800 font-bold text-sm uppercase tracking-widest leading-none mb-1">Scholar AI Tutor</h3>
               <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Logic Hub Active</span>
               </div>
            </div>
         </div>
         <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">v2.0 Beta</span>
      </header>

      {/* MESSAGES VIEWPORT */}
      <div className="chat-messages-scholar custom-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map((msg, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={msg.role === 'user' ? 'user-bubble-scholar' : 'ai-bubble-scholar'}
            >
              {msg.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-2 opacity-50">
                  <Bot size={12} />
                  <span className="text-[9px] font-black uppercase tracking-widest">AI Tutor Voice</span>
                </div>
              )}
              {msg.role === 'assistant' ? (
                <MarkdownText text={msg.content} />
              ) : (
                <p className="font-semibold">{msg.content}</p>
              )}
            </motion.div>
          ))}
          
          {streamingText && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="ai-bubble-scholar"
            >
              <div className="flex items-center gap-2 mb-2 opacity-50 font-black">
                 <Bot size={12} className="animate-pulse" />
                 <span className="text-[9px] uppercase tracking-widest animate-pulse">Streaming Intelligence...</span>
              </div>
              <MarkdownText text={streamingText} />
            </motion.div>
          )}
        </AnimatePresence>

        {loading && !streamingText && (
          <div className="ai-bubble-scholar">
             <div className="flex items-center gap-3">
                <Loader2 size={16} className="animate-spin text-indigo-400" />
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Syncing Logic...</span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ACTION & INPUT AREA */}
      <div className="chat-input-area-scholar">
        {!loading && (
          <div className="flex flex-wrap gap-2 mb-6">
             {quickActions.map(action => (
               <button 
                 key={action.label}
                 onClick={() => {
                   if (action.label === 'Show My Roadmap') return navigate('/app/roadmap');
                   return handleSend(action.label);
                 }}
                 className="action-pill-scholar"
               >
                 <action.icon size={14} style={{ color: action.color }} />
                 <span>{action.label}</span>
               </button>
             ))}
          </div>
        )}

        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }} 
          className="chat-input-pill"
        >
          <MessageSquare size={18} className="text-slate-400" />
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Engage with Scholar AI..."
          />
          <button 
            type="submit"
            className="btn-chat-send"
            disabled={!input.trim() || loading}
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
