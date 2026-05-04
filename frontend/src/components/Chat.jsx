import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Bot,
  Loader2,
  Sparkles,
  BrainCircuit,
  ChevronRight,
  MessageSquare,
  Zap,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Camera,
  CameraOff,
} from "lucide-react";
import { streamMessage, sendAgentMessage, API_BASE_URL, transcribeAudio } from "../api";
import { useNavigate } from "react-router-dom";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

const MarkdownText = ({ text }) => {
  const parseContent = (rawText) => {
    const codeBlocks = [];
    let processed = rawText.replace(
      /```python([\s\S]*?)```/g,
      (match, code) => {
        const id = `CODE_BLK_${codeBlocks.length}`;
        const highlighted = code
          .trim()
          .replace(
            /\b(def|class|if|else|elif|for|while|return|import|from|as|try|except|with)\b/g,
            '<span style="color:#f472b6;font-weight:bold">$1</span>',
          )
          .replace(
            /\b(print|len|range|int|str|float|list|dict|set|print)\b/g,
            '<span style="color:#7dd3fc">$1</span>',
          )
          .replace(
            /#.*$/gm,
            '<span style="color:#64748b;font-style:italic">$0</span>',
          )
          .replace(
            /(["'])(?:(?=(\\?))\2.)*?\1/g,
            '<span style="color:#34d399">$0</span>',
          );

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
      },
    );

    processed = processed
      .replace(
        /^#### (.*$)/gm,
        '<h4 style="color:#1e40af; font-weight:800; font-size:14px; margin:1.5rem 0 0.5rem 0; text-transform:uppercase; letter-spacing:0.1em">$1</h4>',
      )
      .replace(
        /^### (.*$)/gm,
        '<h3 style="color:#1e3a8a; font-weight:900; font-size:16px; margin:2rem 0 1rem 0; text-transform:uppercase; letter-spacing:0.1em; border-bottom:2px solid #eff6ff; padding-bottom:6px">$1</h3>',
      )
      .replace(
        /^## (.*$)/gm,
        '<h2 style="color:#0f172a; font-weight:900; font-size:20px; margin:2.25rem 0 1.25rem 0">$1</h2>',
      )
      .replace(
        /^[=|-]{3,}$/gm,
        '<hr style="margin:2rem 0; border:0; border-top:1px solid #e2e8f0" />',
      );

    processed = processed
      .replace(
        /\*\*(.*?)\*\*/g,
        '<strong style="font-weight:900; color:#0f172a">$1</strong>',
      )
      .replace(
        /`(.*?)`/g,
        '<code style="background:#f1f5f9; padding:2px 6px; border-radius:4px; color:#1e3a8a; font-weight:900; font-size:12px; border:1px solid #e2e8f0">$1</code>',
      );

    processed = processed
      .replace(
        /^\d+\.\s+(.*)$/gm,
        '<li style="margin: 0 0 8px 1.5rem; display:list-item; list-style-type:decimal; padding-left:8px; font-weight:500; color:#334155">$1</li>',
      )
      .replace(
        /^[*|-]\s+(.*)$/gm,
        '<li style="margin: 0 0 8px 1.5rem; display:list-item; list-style-type:disc; padding-left:8px; font-weight:500; color:#334155">$1</li>',
      );

    const blocks = processed.split("\n\n");
    let finalHtml = blocks
      .map((block) => {
        if (
          block.includes("<h") ||
          block.includes("<li") ||
          block.includes("CODE_BLK_")
        )
          return block;
        return `<p style="margin-bottom:1rem; line-height:1.6; font-weight:500; color:#334155; font-size: 15px;">${block}</p>`;
      })
      .join("");

    codeBlocks.forEach((codeHtml, i) => {
      finalHtml = finalHtml.replace(`CODE_BLK_${i}`, codeHtml);
    });

    return finalHtml;
  };

  return <div dangerouslySetInnerHTML={{ __html: parseContent(text) }} />;
};

const Chat = ({ user }) => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hello! I am your AI Career Tutor. Based on your profile, I have predicted that your ideal career path is **${user.prediction.career}**! \n\nI have generated a personalized 4-week learning plan for you. Would you like to see your skill analysis or roadmap?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [streamingText, setStreamingText] = useState("");
  const [useAgent, setUseAgent] = useState(false);
  const [ttsEnabled, setTtsEnabled] = useState(false);
  const ttsEnabledRef = useRef(false);
  const [ttsSpeaking, setTtsSpeaking] = useState(false);
  const currentUtterRef = useRef(null);
  const [listening, setListening] = useState(false);
  const [engagementEnabled, setEngagementEnabled] = useState(false);
  const engagementEnabledRef = useRef(false);
  const voiceTimeoutRef = useRef(null);
  const [engagementStatus, setEngagementStatus] = useState("off");
  const [engagementAlert, setEngagementAlert] = useState(null); // { type: 'yawn'|'away', msg: string }
  const messagesEndRef = useRef(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const landmarkerRef = useRef(null);
  const rafRef = useRef(null);
  const cooldownRef = useRef({ yawn: 0, away: 0 });
  const alertTimerRef = useRef(null);
  // Frame-sustain counters: condition must hold for N frames before firing
  const sustainRef = useRef({ yawn: 0, away: 0 });
  const recognitionRef = useRef(null);
  const voiceBaseRef = useRef("");
  const shouldListenRef = useRef(false);
  const voiceHadErrorRef = useRef(false);
  const [voiceStatus, setVoiceStatus] = useState("idle");
  const [voiceHint, setVoiceHint] = useState("Tap mic and start speaking");
  const [voiceTranscript, setVoiceTranscript] = useState("");
  const [recording, setRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const audioChunksRef = useRef([]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, streamingText, loading]);

  // Strip markdown syntax so TTS doesn't read out "asterisk" / "hashtag" etc.
  const stripMarkdown = (text) =>
    text
      .replace(/```[\s\S]*?```/g, "")           // remove fenced code blocks
      .replace(/`[^`]*`/g, "")                   // remove inline code
      .replace(/^#{1,6}\s*/gm, "")              // remove # heading markers
      .replace(/^[=\-]{2,}\s*$/gm, "")          // remove === / --- underline-style headings & hr
      .replace(/\*\*(.*?)\*\*/g, "$1")           // **bold** → plain
      .replace(/\*(.*?)\*/g, "$1")               // *italic* → plain
      .replace(/~~(.*?)~~/g, "$1")               // ~~strikethrough~~ → plain
      .replace(/_{1,2}(.*?)_{1,2}/g, "$1")      // _underline_ → plain
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")  // [link](url) → label only
      .replace(/!\[[^\]]*\]\([^)]+\)/g, "")     // ![image](url) → remove
      .replace(/^\s*[-*+]\s+/gm, "")            // bullet list markers
      .replace(/^\s*\d+\.\s+/gm, "")            // numbered list markers
      .replace(/^\s*>\s*/gm, "")                // blockquotes
      .replace(/\|/g, " ")                       // table pipes → space
      .replace(/={1,}/g, "")                    // ALL equal signs (=, ==, ===)
      .replace(/~{1,}/g, "")                    // stray tildes
      .replace(/\s+/g, " ")
      .trim();

  // Text-to-speech for completed assistant replies (not streaming chunks).
  useEffect(() => {
    if (!ttsEnabled) return;
    const last = messages[messages.length - 1];
    if (!last || last.role !== "assistant") return;
    if (!("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(stripMarkdown(last.content));
      utter.rate = 1.0;
      utter.pitch = 1.0;
      utter.onstart = () => setTtsSpeaking(true);
      utter.onend = () => setTtsSpeaking(false);
      utter.onerror = () => setTtsSpeaking(false);
      currentUtterRef.current = utter;
      window.speechSynthesis.speak(utter);
    } catch {
      // ignore
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [messages, ttsEnabled]);

  const toggleListening = async () => {
    if (listening) {
      shouldListenRef.current = false;
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
      }
      voiceHadErrorRef.current = false;
      setListening(false);
      voiceBaseRef.current = "";
      setVoiceStatus("idle");
      setVoiceHint("Voice typing paused");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true } 
      });
      mediaStreamRef.current = stream;
      
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      source.connect(analyser);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      let mediaRecorder = null;
      let audioChunks = [];
      let isCurrentlySpeaking = false;
      let silenceTimer = null;

      shouldListenRef.current = true;
      voiceHadErrorRef.current = false;
      setListening(true);
      setVoiceStatus("listening");
      setVoiceHint("Hearing you... (Custom AI Voice)");
      setVoiceTranscript(input || "");

      const processAudio = async (blob) => {
        setVoiceStatus("processing");
        setVoiceHint("Transcribing...");
        try {
          const res = await transcribeAudio(blob);
          const newText = res.text || "";
          if (newText.trim()) {
            const baseText = voiceBaseRef.current.trim();
            const merged = baseText ? `${baseText} ${newText}` : newText;
            voiceBaseRef.current = merged;
            setInput(merged);
            
            if (engagementEnabledRef.current) {
              handleSend(merged);
              voiceBaseRef.current = "";
              setInput("");
            }
          }
        } catch (e) {
          console.error("Transcription error:", e);
        }
        if (shouldListenRef.current) {
           setVoiceStatus("listening");
           setVoiceHint("Hearing you... (Custom AI Voice)");
        }
      };

      const checkVolume = () => {
        if (!shouldListenRef.current) return;
        
        let avg = 0;
        // Software echo cancellation: completely ignore mic input if the AI is currently talking
        if (!window.speechSynthesis || !window.speechSynthesis.speaking) {
          analyser.getByteFrequencyData(dataArray);
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
          avg = sum / dataArray.length;
        }

        if (avg > 15) { // Threshold for speaking
          if (!isCurrentlySpeaking) {
            isCurrentlySpeaking = true;
            mediaRecorder = new MediaRecorder(stream);
            audioChunks = [];
            mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
            mediaRecorder.onstop = () => {
              const blob = new Blob(audioChunks, { type: "audio/webm" });
              processAudio(blob);
            };
            mediaRecorder.start();
            setVoiceStatus("speaking");
          }
          if (silenceTimer) clearTimeout(silenceTimer);
        } else {
          if (isCurrentlySpeaking) {
            isCurrentlySpeaking = false;
            silenceTimer = setTimeout(() => {
              if (mediaRecorder && mediaRecorder.state === "recording") {
                mediaRecorder.stop();
              }
            }, 1500); // 1.5s of silence triggers sending
          }
        }
        requestAnimationFrame(checkVolume);
      };
      
      checkVolume();
    } catch (e) {
      setVoiceStatus("error");
      setVoiceHint("❌ Could not access microphone.");
      setListening(false);
    }
  };

  useEffect(() => {
    return () => {
      shouldListenRef.current = false;
      voiceHadErrorRef.current = false;
      if (mediaStreamRef.current) {
        mediaStreamRef.current.getTracks().forEach(t => t.stop());
      }
      try {
        if ("speechSynthesis" in window) {
          window.speechSynthesis.cancel();
        }
      } catch (e) {}
    };
  }, []);

  const pushCoachMessage = (text) => {
    setMessages((prev) => [...prev, { role: "assistant", content: text }]);
  };

  const computeDistance = (a, b) => {
    const dx = a.x - b.x;
    const dy = a.y - b.y;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const startEngagement = async () => {
    if (streamRef.current) return;
    setEngagementStatus("starting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user" },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      if (!landmarkerRef.current) {
        const resolver = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.35/wasm",
        );
        landmarkerRef.current = await FaceLandmarker.createFromOptions(
          resolver,
          {
            baseOptions: {
              modelAssetPath:
                "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
            },
            outputFaceBlendshapes: false,
            outputFacialTransformationMatrixes: false,
            runningMode: "VIDEO",
            numFaces: 1,
            minFaceDetectionConfidence: 0.25,
            minFacePresenceConfidence: 0.25,
            minTrackingConfidence: 0.25,
          },
        );
      }

      setEngagementStatus("on");
      pushCoachMessage("👨‍🏫 **Live Class Started**. I am now actively teaching and monitoring your engagement. Let's dive in! What topic would you like to cover today?");
      
      const loop = () => {
        const video = videoRef.current;
        const lm = landmarkerRef.current;
        if (!video || !lm) return;
        const now = performance.now();
        try {
          const res = lm.detectForVideo(video, now);
          const face = res?.faceLandmarks?.[0];

          // ── Draw AI Face Mesh ──
          const canvas = canvasRef.current;
          if (canvas && video.videoWidth) {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            if (face) {
              ctx.fillStyle = "rgba(16, 185, 129, 0.6)"; // emerald color
              ctx.beginPath();
              for (const pt of face) {
                ctx.moveTo(pt.x * canvas.width, pt.y * canvas.height);
                ctx.arc(pt.x * canvas.width, pt.y * canvas.height, 1.2, 0, 2 * Math.PI);
              }
              ctx.fill();
            }
          }

          if (face) {
            // ── Yawn: vertical mouth gap vs width ratio ──
            // Landmarks: 13=upper lip, 14=lower lip, 78=left corner, 308=right corner
            const upper = face[13];
            const lower = face[14];
            const leftM = face[78];
            const rightM = face[308];
            const mouthOpen = computeDistance(upper, lower);
            const mouthWidth = computeDistance(leftM, rightM);
            const yawnRatio = mouthWidth > 0 ? mouthOpen / mouthWidth : 0;
            // Threshold 0.65 = wide-open mouth (yawn), not just talking/slightly open
            const isYawning = yawnRatio > 0.65;

            // ── Look-away: nose X vs mouth midpoint ──
            const nose = face[1];
            const midX = (leftM.x + rightM.x) / 2;
            // Threshold 0.15 = clearly turned head, not just slight angle
            const isAway = Math.abs(nose.x - midX) > 0.15;

            // ── Frame-sustain debounce: must hold for 30 frames (~500ms) ──
            sustainRef.current.yawn = isYawning ? sustainRef.current.yawn + 1 : 0;
            sustainRef.current.away = isAway  ? sustainRef.current.away + 1  : 0;

            const SUSTAIN_FRAMES = 30;  // ~500ms at 60fps
            const COOLDOWN_MS    = 5000;  // 5s between repeat alerts (so user can test repeatedly)
            const t = Date.now();

            if (sustainRef.current.yawn >= SUSTAIN_FRAMES &&
                t - cooldownRef.current.yawn > COOLDOWN_MS) {
              cooldownRef.current.yawn = t;
              sustainRef.current.yawn = 0; // reset
              setEngagementAlert({ type: "yawn", msg: "😴 Yawn detected! You look tired — want a quick 2-minute break?" });
              if (alertTimerRef.current) clearTimeout(alertTimerRef.current);
              alertTimerRef.current = setTimeout(() => setEngagementAlert(null), 7000);
              
              const msg = "I noticed you yawning! Are you feeling tired? Let me know if you want a quick 2-minute break before we continue our lesson.";
              pushCoachMessage(msg);
              if (ttsEnabledRef.current && "speechSynthesis" in window) {
                window.speechSynthesis.cancel();
                window.speechSynthesis.speak(new SpeechSynthesisUtterance("I noticed you yawning. Are you feeling tired?"));
              }
            }
            if (sustainRef.current.away >= SUSTAIN_FRAMES &&
                t - cooldownRef.current.away > COOLDOWN_MS) {
              cooldownRef.current.away = t;
              sustainRef.current.away = 0; // reset
              setEngagementAlert({ type: "away", msg: "👀 You looked away! Stay focused — I'm here to help." });
              if (alertTimerRef.current) clearTimeout(alertTimerRef.current);
              alertTimerRef.current = setTimeout(() => setEngagementAlert(null), 7000);
              
              const msg = "It looks like you're getting distracted. Try to stay focused on the lesson — I'm here to help if something is confusing!";
              pushCoachMessage(msg);
              if (ttsEnabledRef.current && "speechSynthesis" in window) {
                window.speechSynthesis.cancel();
                window.speechSynthesis.speak(new SpeechSynthesisUtterance("It looks like you're getting distracted. Please try to stay focused on the lesson."));
              }
            }
          } else {
            // No face detected — reset sustain counters
            sustainRef.current.yawn = 0;
            sustainRef.current.away = 0;
          }
        } catch {
          // ignore frame errors
        }
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
    } catch (e) {
      setEngagementStatus("off");
      pushCoachMessage(
        "❌ Could not start camera/gesture recognition. Please allow camera permission and try again.",
      );
    }
  };

  const stopEngagement = () => {
    try {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    } catch {}
    rafRef.current = null;
    try {
      landmarkerRef.current?.close?.();
    } catch {}
    // keep landmarker cached; do not close hard
    if (streamRef.current) {
      try {
        streamRef.current.getTracks().forEach((t) => t.stop());
      } catch {}
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.srcObject = null;
    }
    setEngagementStatus("off");
  };

  useEffect(() => {
    engagementEnabledRef.current = engagementEnabled;
    if (engagementEnabled) {
      startEngagement();
      // Auto-enable AI voice output
      setTtsEnabled(true);
      ttsEnabledRef.current = true;
      // Auto-enable user microphone
      if (!shouldListenRef.current) {
        toggleListening();
      }
    } else {
      stopEngagement();
      // Auto-disable user microphone when leaving class
      if (shouldListenRef.current) {
        toggleListening();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [engagementEnabled]);

  const handleChatClick = (e) => {
    const copyBtn = e.target.closest(".copy-code-btn");
    if (copyBtn) {
      const codeBlockId = copyBtn.getAttribute("data-code-id");
      const codeElement = document.getElementById(codeBlockId);
      if (codeElement) {
        const textarea = document.createElement("textarea");
        textarea.innerHTML = codeElement.innerHTML;
        navigator.clipboard.writeText(textarea.value);

        const originalHtml = copyBtn.innerHTML;
        copyBtn.innerHTML = '<span style="color:#34d399">COPIED!</span>';
        setTimeout(() => {
          copyBtn.innerHTML = originalHtml;
        }, 2000);
      }
    }
  };

  const handleSend = async (msgContent = input) => {
    const textToSend = msgContent || input;
    if (!textToSend.trim() || loading) return;

    const userMsg = { role: "user", content: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    setStreamingText("");

    try {
      const context = {
        career: user.prediction.career,
        top_weakness: user.prediction.plan.weakness_rank[0][0],
        skills: user.prediction.skills,
      };

      if (useAgent) {
        const data = await sendAgentMessage(textToSend, messages, context);
        const text = data.response || "";
        setMessages((prev) => [...prev, { role: "assistant", content: text }]);
      } else {
        let accumulatedResponse = "";
        await streamMessage(textToSend, messages, context, (chunk) => {
          accumulatedResponse += chunk;
          setStreamingText(accumulatedResponse);
        });

        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: accumulatedResponse },
        ]);
        setStreamingText("");
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "❌ **Link Interrupted**. Please re-engage.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { label: "Analyze My Skills", icon: Zap, color: "#1e3a8a" },
    { label: "Show My Roadmap", icon: ChevronRight, color: "#059669" },
    { label: "Improve GPA", icon: Sparkles, color: "#b45309" },
  ];

  const navigate = useNavigate();

  return (
    <div className="chat-window-scholar" onClick={handleChatClick}>
      {/* Single always-mounted video — toggled visible/hidden via CSS class.
          Keeping it always in the DOM ensures videoRef stays stable and the
          stream assigned in startEngagement() is never lost on re-mount. */}
      <div className={`engage-cam-float ${engagementStatus === "on" ? "engage-cam-visible" : "engage-cam-hidden"}`}>
        <video
          ref={videoRef}
          playsInline
          muted
          className="engage-cam-video"
        />
        <canvas
          ref={canvasRef}
          className="engage-cam-canvas"
        />
        {engagementStatus === "on" && (
          <div className="engage-cam-badge">
            <span className="engage-cam-dot" />
            LIVE
          </div>
        )}
      </div>

      {/* On-screen engagement alert banner */}
      <AnimatePresence>
        {engagementAlert && (
          <motion.div
            key="engage-alert"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.3 }}
            className={`engage-alert-banner engage-alert-${engagementAlert.type}`}
          >
            {engagementAlert.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER BAR */}
      <header className="chat-header-scholar">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <BrainCircuit size={20} />
          </div>
          <div>
            <h3 className="text-slate-800 font-bold text-sm uppercase tracking-widest leading-none mb-1">
              Scholar AI Tutor
            </h3>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                Logic Hub Active
              </span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={useAgent}
              onChange={(e) => setUseAgent(e.target.checked)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
              Tool agent
            </span>
          </label>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (ttsEnabled) {
                  // Turn OFF — stop any active speech immediately
                  try { window.speechSynthesis.cancel(); } catch {}
                  setTtsSpeaking(false);
                  currentUtterRef.current = null;
                  setTtsEnabled(false);
                  ttsEnabledRef.current = false;
                } else {
                  setTtsEnabled(true);
                  ttsEnabledRef.current = true;
                }
              }}
              className={`text-[9px] font-black uppercase tracking-widest flex items-center gap-1 ${
                ttsEnabled ? "text-indigo-500" : "text-slate-500"
              }`}
              title={ttsEnabled ? (ttsSpeaking ? "Stop speaking" : "TTS on – click to disable") : "Speak AI replies (text-to-speech)"}
            >
              {ttsEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
              {ttsSpeaking ? "Stop" : "Speak"}
            </button>
            <button
              type="button"
              onClick={() => setEngagementEnabled((v) => !v)}
              className="text-[9px] font-black uppercase tracking-widest text-slate-500 flex items-center gap-1"
              title="Live Class teaching monitor (yawn/look-away)"
            >
              {engagementEnabled ? (
                <Camera size={14} />
              ) : (
                <CameraOff size={14} />
              )}
              Live Class
            </button>
          </div>
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
            v2.0 Beta
          </span>
        </div>
      </header>

      {/* MESSAGES VIEWPORT */}
      <div className="chat-messages-scholar custom-scrollbar">
        <AnimatePresence initial={false}>
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={
                msg.role === "user"
                  ? "user-bubble-scholar"
                  : "ai-bubble-scholar"
              }
            >
              {msg.role === "assistant" && (
                <div className="flex items-center gap-2 mb-2 opacity-50">
                  <Bot size={12} />
                  <span className="text-[9px] font-black uppercase tracking-widest">
                    AI Tutor Voice
                  </span>
                </div>
              )}
              {msg.role === "assistant" ? (
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
                <span className="text-[9px] uppercase tracking-widest animate-pulse">
                  Streaming Intelligence...
                </span>
              </div>
              <MarkdownText text={streamingText} />
            </motion.div>
          )}
        </AnimatePresence>

        {loading && !streamingText && (
          <div className="ai-bubble-scholar">
            <div className="flex items-center gap-3">
              <Loader2 size={16} className="animate-spin text-indigo-400" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">
                Syncing Logic...
              </span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* ACTION & INPUT AREA */}
      <div className="chat-input-area-scholar">
        {!loading && (
          <div className="flex flex-wrap gap-2 mb-6">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => {
                  if (action.label === "Show My Roadmap")
                    return navigate("/app/roadmap");
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
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="chat-input-pill"
        >
          <button
            type="button"
            onClick={toggleListening}
            className={`voice-mic-btn ${listening ? "is-listening" : ""}`}
            title={
              listening ? "Stop voice input" : "Voice input (speech-to-text)"
            }
            aria-label={
              listening
                ? "Voice input on. Click to stop."
                : "Voice input off. Click to start."
            }
            aria-pressed={listening}
            style={{ display: "flex", alignItems: "center" }}
          >
            {listening ? <Mic size={18} /> : <MicOff size={18} />}
          </button>
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
        <div className="voice-status-row" aria-live="polite" role="status">
          <span className={`voice-status-dot ${voiceStatus}`} />
          <span
            className={`voice-status-text ${voiceStatus === "error" ? "is-error" : ""}`}
          >
            {voiceHint}
          </span>
        </div>

        <AnimatePresence>
          {(voiceStatus === "listening" ||
            voiceStatus === "speaking" ||
            voiceStatus === "recording" ||
            voiceStatus === "starting" ||
            voiceStatus === "processing") && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className="voice-live-panel"
            >
              <div className="voice-live-header">
                <span className={`voice-live-badge ${voiceStatus}`}>
                  {voiceStatus === "recording"
                    ? "Recording"
                    : voiceStatus === "processing"
                      ? "Transcribing"
                      : "Live Dictation"}
                </span>
                <span className="voice-live-tip">
                  Speak naturally, it updates below
                </span>
              </div>
              <div className="voice-live-text">
                {voiceTranscript || voiceHint}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Chat;
