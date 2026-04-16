import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  XCircle,
  Loader2,
  CalendarDays,
  Target,
  PlayCircle,
  ArrowRight,
  Sparkles,
  ListTodo,
  HelpCircle,
  Lock
} from 'lucide-react';
import { getLesson, getQuiz } from '../api';
import '../App.css'; 

const LearningHub = ({ user }) => {
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [lessonContent, setLessonContent] = useState('');
  const [quiz, setQuiz] = useState(null);
  const [userAnswer, setUserAnswer] = useState(null);
  const [quizResult, setQuizResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState('lesson');

  const topWeakness = user?.prediction?.plan?.weakness_rank?.[0]?.[0] || 'Topic Focus';

  useEffect(() => {
    fetchLesson();
  }, [selectedWeek]);

  const fetchLesson = async () => {
    setLoading(true);
    setQuizResult(null);
    setUserAnswer(null);
    try {
      const data = await getLesson(topWeakness, selectedWeek);
      setLessonContent(data.content);
    } catch (err) {
      setLessonContent("Failed to load schedule content. Please ensure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  const startQuiz = async () => {
    setLoading(true);
    setView('quiz');
    try {
      const data = await getQuiz(topWeakness);
      setQuiz(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleQuizSubmit = () => {
    if (userAnswer === null) return;
    const isCorrect = userAnswer === quiz.answer;
    setQuizResult(isCorrect ? 'correct' : 'incorrect');
  };

  const weeks = [
    { id: 1, title: 'Foundations', date: 'Week 1' },
    { id: 2, title: 'Core Concepts', date: 'Week 2' },
    { id: 3, title: 'Applications', date: 'Week 3' },
    { id: 4, title: 'Mastery', date: 'Week 4' }
  ];

  const parseContent = (content) => {
    if (!content) return [];
    
    // Auto-clean any markdown formatting from the LLM like triple backticks enclosing the whole output
    let cleanContent = content.trim();
    if (cleanContent.startsWith('```markdown')) {
        cleanContent = cleanContent.substring(11).trim();
    } else if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.substring(3).trim();
    }
    if (cleanContent.endsWith('```')) {
        cleanContent = cleanContent.substring(0, cleanContent.length - 3).trim();
    }

    const lines = cleanContent.split('\n');
    const blocks = [];
    let currentBlock = { title: 'Overview', items: [] };
    let codeBlockContent = [];
    let inCodeBlock = false;

    lines.forEach(line => {
      const trimmed = line.trim();
      
      if (trimmed.startsWith('```')) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeBlockContent = [];
        } else {
          inCodeBlock = false;
          currentBlock.items.push({ type: 'code', content: codeBlockContent.join('\n') });
        }
        return;
      }

      if (inCodeBlock) {
         codeBlockContent.push(line);
         return;
      }

      // Check for headers
      if (trimmed.startsWith('###') || trimmed.startsWith('## ') || trimmed.startsWith('# ') || trimmed.match(/^Week \d+:/)) {
        if (currentBlock.items.length > 0 || currentBlock.title !== 'Overview') {
          blocks.push({...currentBlock});
        }
        currentBlock = { 
            title: trimmed.replace(/^#+\s*/, '').trim(), 
            items: [] 
        };
      } else if (trimmed !== '') {
        // Detect "**Something**" or "**Something:**"
        let boldMatch = /^(\*\*|__)(.*?)\1:?$/.exec(trimmed);
        if (boldMatch) {
             currentBlock.items.push({ type: 'subtitle', content: boldMatch[2] });
        } else if (trimmed.startsWith('-') || trimmed.startsWith('* ')) {
             currentBlock.items.push({ type: 'list', content: trimmed.substring(1).trim().replace(/\*\*/g, '') });
        } else {
             currentBlock.items.push({ type: 'text', content: trimmed.replace(/\*\*/g, '') });
        }
      }
    });

    if (currentBlock.items.length > 0 || currentBlock.title !== 'Overview') {
      blocks.push(currentBlock);
    }
    return blocks;
  };

  const currentBlocks = lessonContent ? parseContent(lessonContent) : [];

  return (
    <div className="lh-container">
        
      {/* Header Area */}
      <div className="lh-header-card">
        <div className="lh-header-top">
          <div className="lh-title-area">
            <div className="lh-label">
              <CalendarDays size={18} /> Weekly Study Planner
            </div>
            <h1 className="lh-title">
              {topWeakness} <span>Path</span>
            </h1>
          </div>
          <div className="lh-ribbon">
            {weeks.map(week => (
              <button
                key={week.id}
                onClick={() => { setSelectedWeek(week.id); setView('lesson'); }}
                className={`lh-week-btn ${selectedWeek === week.id ? 'active' : ''}`}
              >
                <span className="lh-week-num">{week.id}</span>
                <span>{week.date}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="lh-grid">
        {/* Left Column: Flow / Modules */}
        <div>
          {loading ? (
            <div className="lh-schedule-card" style={{ alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
              <Loader2 className="animate-spin" size={48} color="#2563eb" style={{marginBottom: '1rem'}} />
              <p style={{fontSize: '14px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em'}}>Syncing Schedule...</p>
            </div>
          ) : view === 'lesson' ? (
            <div className="lh-schedule-list">
                {currentBlocks.map((block, index) => (
                  <div key={block.title + index} className="lh-schedule-card">
                    <div className="lh-card-header">
                      <div className="lh-card-icon">
                        <ListTodo size={28} />
                      </div>
                      <h3 className="lh-card-title">{block.title}</h3>
                    </div>

                    <div className="lh-items">
                      {block.items.map((item, i) => {
                        if (item.type === 'subtitle') {
                          return (
                            <h4 key={i} className="lh-subtitle">
                              <Target size={20} className="lh-subtitle-icon"/> {item.content}
                            </h4>
                          );
                        }
                        if (item.type === 'list') {
                          return (
                            <div key={i} className="lh-list-item">
                              <CheckCircle2 size={22} className="lh-check" />
                              <span className="lh-text" style={{fontWeight: '500'}}>{item.content}</span>
                            </div>
                          );
                        }
                        if (item.type === 'code') {
                           return <div key={i} className="lh-code-block">{item.content}</div>;
                        }
                        return <p key={i} className="lh-text">{item.content}</p>;
                      })}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="lh-quiz-view">
               {quiz && !quizResult ? (
                 <>
                   <div className="lh-quiz-tag">
                     <HelpCircle size={14} style={{display: 'inline', marginRight: '6px'}}/> Knowledge Checkpoint
                   </div>
                   <h3 className="lh-quiz-q">{quiz.question}</h3>
                   
                   <div className="lh-options-grid">
                     {quiz.options.map((option, i) => (
                       <button
                         key={i}
                         onClick={() => setUserAnswer(i)}
                         className={`lh-option-btn ${userAnswer === i ? 'selected' : ''}`}
                       >
                         <span className="lh-option-letter">
                           {String.fromCharCode(65 + i)}
                         </span>
                         <span>{option}</span>
                       </button>
                     ))}
                   </div>
                   
                   <button
                     disabled={userAnswer === null}
                     onClick={handleQuizSubmit}
                     className="lh-submit-btn"
                   >
                     Submit Evaluation <ArrowRight size={20} />
                   </button>
                 </>
               ) : quizResult ? (
                 <>
                   <div className={`lh-result-icon ${quizResult}`}>
                     {quizResult === 'correct' ? <CheckCircle2 size={64} /> : <XCircle size={64} />}
                   </div>
                   <h3 className="lh-result-title">
                     {quizResult === 'correct' ? 'Mastery Verified!' : 'Gap Detected'}
                   </h3>
                   <p className="lh-result-desc">
                     {quiz.explanation}
                   </p>
                   <button 
                     onClick={() => { setView('lesson'); setQuizResult(null); setUserAnswer(null); }}
                     className="lh-submit-btn" style={{width: 'auto'}}
                   >
                     Return to Course Plan
                   </button>
                 </>
               ) : null}
             </div>
          )}
        </div>

        {/* Right Column: Weekly Stats & Assessment */}
        <div className="lh-sidebar">
          <div className="lh-progress-card">
            
            <div className="lh-label" style={{color: '#94a3b8'}}>
              <Target size={16} /> Progress
            </div>

            <div className="lh-stat-row">
              <span className="lh-stat-val">{(selectedWeek/4 * 100).toFixed(0)}</span>
              <span className="lh-stat-lbl">%</span>
            </div>

            <div className="lh-progress-bg">
              <div 
                className="lh-progress-fill" 
                style={{width: `${(selectedWeek/4 * 100)}%`}}
              />
            </div>

            <div className="lh-sidebar-list">
              {weeks.map(w => (
                <div key={w.id} className="lh-sidebar-item">
                  <div className={`lh-sidebar-icon ${
                    w.id < selectedWeek ? 'completed' : 
                    w.id === selectedWeek ? 'current' : 'locked'
                  }`}>
                    {w.id < selectedWeek ? <CheckCircle2 size={18}/> : w.id === selectedWeek ? <PlayCircle size={18}/> : <Lock size={16}/>}
                  </div>
                  <span className={`lh-sidebar-text ${w.id > selectedWeek ? 'locked' : ''}`}>{w.title}</span>
                </div>
              ))}
            </div>
          </div>

          <button onClick={startQuiz} className="lh-assessment-btn">
            <Sparkles size={36} color="#bfdbfe" />
            <div>
              <div className="lh-assessment-title">Take Assessment</div>
              <div className="lh-assessment-sub">Unlock Next Stage</div>
            </div>
          </button>
        </div>

      </div>
    </div>
  );
};

export default LearningHub;
