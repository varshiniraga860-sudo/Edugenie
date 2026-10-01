import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  Sparkles,
  Send,
  Trash2,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Lightbulb,
  ArrowRight,
  RefreshCw,
  User,
  Bot,
  AlertCircle,
} from 'lucide-react';
import { ChatMessage } from '../types';
import { CURATED_SUBJECTS } from '../data/curatedData';
import { MarkdownRenderer } from '../utils/markdownRenderer';
import { speechService } from '../utils/speech';

interface TutorViewProps {
  initialTopic?: string;
  initialSubject?: string;
  onIncrementExplored: () => void;
}

export const TutorView: React.FC<TutorViewProps> = ({
  initialTopic = '',
  initialSubject = 'General Academic',
  onIncrementExplored,
}) => {
  const [subject, setSubject] = useState(initialSubject);
  const [gradeLevel, setGradeLevel] = useState('High School');
  const [inputVal, setInputVal] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize conversation with a friendly Genie greeting
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const greeting = initialTopic
      ? `Hello! I'm **Genie**, your personal academic tutor. I see you're exploring **${initialTopic}** in *${initialSubject}*. How can I help you master this concept today? You can ask me to solve a problem step-by-step, explain with everyday analogies, or test your intuition!`
      : `Hello! I'm **Genie**, your dedicated AI academic tutor. What concept, homework problem, or topic are you working on today? Feel free to ask anything—from calculus proofs and quantum physics to history and essay writing!`;

    return [
      {
        id: 'msg-welcome',
        role: 'assistant',
        content: greeting,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedFollowUps: initialTopic
          ? [
              `Explain ${initialTopic} with an everyday analogy`,
              `What are common test mistakes in ${initialTopic}?`,
              `Give me a quick 1-minute conceptual overview`,
            ]
          : [
              "Explain Newton's Laws with a sports analogy",
              'How does Photosynthesis work step-by-step?',
              'What is the difference between SN1 and SN2 in Chemistry?',
            ],
      },
    ];
  });

  // Track initialTopic changes
  useEffect(() => {
    if (initialTopic) {
      setInputVal(`Can you explain ${initialTopic} in simple terms and give a real-world example?`);
    }
    if (initialSubject) {
      setSubject(initialSubject);
    }
  }, [initialTopic, initialSubject]);

  // Audio speech synthesis subscription
  useEffect(() => {
    const unsub = speechService.subscribe((state) => {
      setIsSpeaking(state.isSpeaking);
      if (!state.isSpeaking) setSpeakingMsgId(null);
    });
    return () => {
      speechService.stop();
      unsub();
    };
  }, []);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text || loading) return;

    setInputVal('');
    setError(null);
    speechService.stop();

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setLoading(true);

    try {
      const response = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          subject,
          gradeLevel,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get answer from Genie Tutor.');
      }

      // Parse suggested follow-ups from the reply if present
      let replyText = data.reply || '';
      let suggested: string[] = [];

      const followUpSplit = replyText.split(/💡\s*Suggested follow-ups?:/i);
      if (followUpSplit.length > 1) {
        replyText = followUpSplit[0].trim();
        const followUpsRaw = followUpSplit[1];
        suggested = followUpsRaw
          .split('\n')
          .map((s: string) => s.replace(/^[-*•\d.]+\s*/, '').replace(/["']/g, '').trim())
          .filter((s: string) => s.length > 5 && s.length < 90)
          .slice(0, 3);
      }

      const assistantMsg: ChatMessage = {
        id: `genie-${Date.now()}`,
        role: 'assistant',
        content: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedFollowUps: suggested.length > 0 ? suggested : undefined,
      };

      setMessages((prev) => [...prev, assistantMsg]);
      onIncrementExplored();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error communicating with Genie Tutor.');
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    speechService.stop();
    setMessages([
      {
        id: `msg-reset-${Date.now()}`,
        role: 'assistant',
        content: `Chat session refreshed! What academic question would you like to explore next?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleToggleSpeak = (msgId: string, content: string) => {
    if (isSpeaking && speakingMsgId === msgId) {
      speechService.stop();
      setSpeakingMsgId(null);
    } else {
      speechService.stop();
      setSpeakingMsgId(msgId);
      speechService.speak(content);
    }
  };

  const handleCopy = (msgId: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopiedId(msgId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const QUICK_PROMPTS = [
    'Explain with a real-life analogy',
    'Solve this step-by-step',
    'What are common exam traps here?',
    'Give me a mnemonic trick',
    'Test my understanding with a question',
  ];

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto flex flex-col h-[calc(100vh-10rem)] min-h-[600px]">
      {/* Top Header & Settings */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Genie 24/7 Academic AI Tutor</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Conversational Learning Companion
          </h1>
        </div>

        {/* Controls: Subject & Grade */}
        <div className="flex items-center gap-2">
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 shadow-xs focus:ring-2 focus:ring-indigo-500"
          >
            <option value="General Academic">General Subject</option>
            {CURATED_SUBJECTS.map((s) => (
              <option key={s.id} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>

          <select
            value={gradeLevel}
            onChange={(e) => setGradeLevel(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium text-slate-700 shadow-xs focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Middle School">Middle School</option>
            <option value="High School">High School</option>
            <option value="College / Advanced">College</option>
          </select>

          <button
            onClick={handleClearChat}
            className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-500 hover:text-rose-600 transition"
            title="Reset Chat"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chat Messages Container */}
      <div className="flex-1 overflow-y-auto rounded-2xl border border-slate-200 bg-slate-50/50 p-4 sm:p-6 space-y-4 shadow-inner">
        {messages.map((msg) => {
          const isGenie = msg.role === 'assistant';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isGenie ? '' : 'flex-row-reverse'}`}
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                  isGenie
                    ? 'bg-gradient-to-tr from-indigo-700 to-blue-600 text-white'
                    : 'bg-slate-800 text-white'
                }`}
              >
                {isGenie ? <Sparkles className="w-4 h-4 text-amber-300" /> : <User className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 space-y-2 shadow-xs ${
                  isGenie
                    ? 'bg-white border border-slate-200/90 text-slate-800'
                    : 'bg-blue-600 text-white'
                }`}
              >
                <div className="flex items-center justify-between gap-4 text-[11px] opacity-75 pb-1 border-b border-slate-100/20">
                  <span className="font-semibold">{isGenie ? 'Genie Tutor' : 'You'}</span>
                  <span>{msg.timestamp}</span>
                </div>

                <div className={`prose ${isGenie ? 'prose-slate' : 'prose-invert'} max-w-none text-sm leading-relaxed`}>
                  {isGenie ? (
                    <MarkdownRenderer content={msg.content} />
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  )}
                </div>

                {/* Assistant Controls: Listen & Copy */}
                {isGenie && (
                  <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleSpeak(msg.id, msg.content)}
                        className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] font-medium transition ${
                          speakingMsgId === msg.id && isSpeaking
                            ? 'bg-amber-100 text-amber-900 font-semibold'
                            : 'hover:bg-slate-100 text-slate-500'
                        }`}
                        title="Read aloud"
                      >
                        {speakingMsgId === msg.id && isSpeaking ? (
                          <VolumeX className="w-3.5 h-3.5 text-amber-700" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5" />
                        )}
                        <span>{speakingMsgId === msg.id && isSpeaking ? 'Stop' : 'Listen'}</span>
                      </button>

                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-100 text-slate-500 text-[11px] font-medium transition"
                        title="Copy message"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                        <span>{copiedId === msg.id ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* Clickable suggested follow-ups */}
                {isGenie && msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    <p className="text-[11px] font-bold text-indigo-700 flex items-center gap-1">
                      <Lightbulb className="w-3 h-3 text-amber-500" />
                      Suggested questions:
                    </p>
                    <div className="flex flex-col gap-1">
                      {msg.suggestedFollowUps.map((prompt, pIdx) => (
                        <button
                          key={pIdx}
                          onClick={() => handleSendMessage(prompt)}
                          className="text-left px-2.5 py-1.5 rounded-lg bg-indigo-50/70 hover:bg-indigo-100 text-indigo-900 text-xs font-medium transition flex items-center justify-between group cursor-pointer"
                        >
                          <span>{prompt}</span>
                          <ArrowRight className="w-3 h-3 text-indigo-500 group-hover:translate-x-0.5 transition-transform shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-700 to-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
            </div>
            <div className="rounded-2xl p-4 bg-white border border-slate-200/90 text-slate-600 text-sm flex items-center gap-2 shadow-xs">
              <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
              <span>Genie is formulating your answer...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Error state */}
      {error && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 shrink-0">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Quick Prompt Chips */}
      <div className="shrink-0 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0">
          Quick Ask:
        </span>
        {QUICK_PROMPTS.map((qp, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(qp)}
            disabled={loading}
            className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-xs font-medium text-slate-600 transition whitespace-nowrap cursor-pointer disabled:opacity-50"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Input Form Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="shrink-0 relative flex items-center rounded-2xl bg-white border border-slate-300 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 overflow-hidden"
      >
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder={`Ask Genie any question about ${subject}...`}
          disabled={loading}
          className="w-full px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none disabled:bg-slate-50"
        />
        <button
          type="submit"
          disabled={loading || !inputVal.trim()}
          className="m-1.5 p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white transition disabled:opacity-40 cursor-pointer shadow-xs"
          title="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
