import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  BookOpen,
  Volume2,
  VolumeX,
  Copy,
  Check,
  FileText,
  FileCheck2,
  MessageSquare,
  RefreshCw,
  SlidersHorizontal,
  GraduationCap,
  Lightbulb,
  Zap,
  Smile,
  AlertCircle,
} from 'lucide-react';
import { ActiveTab, ExplanationMode, GradeLevel } from '../types';
import { CURATED_SUBJECTS } from '../data/curatedData';
import { MarkdownRenderer } from '../utils/markdownRenderer';
import { speechService } from '../utils/speech';

interface LearnViewProps {
  initialTopic?: string;
  initialSubject?: string;
  onNavigateToTab: (tab: ActiveTab, topic?: string, subject?: string) => void;
  onIncrementExplored: () => void;
}

export const LearnView: React.FC<LearnViewProps> = ({
  initialTopic = "Newton's Three Laws of Motion",
  initialSubject = 'Physics',
  onNavigateToTab,
  onIncrementExplored,
}) => {
  const [topic, setTopic] = useState(initialTopic);
  const [subject, setSubject] = useState(initialSubject);
  const [mode, setMode] = useState<ExplanationMode>('standard');
  const [gradeLevel, setGradeLevel] = useState<GradeLevel>('High School');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Sync initial topic when props change
  useEffect(() => {
    if (initialTopic && initialTopic !== topic) {
      setTopic(initialTopic);
    }
    if (initialSubject && initialSubject !== subject) {
      setSubject(initialSubject);
    }
  }, [initialTopic, initialSubject]);

  // Audio speech synthesis listener
  useEffect(() => {
    const unsubscribe = speechService.subscribe((state) => {
      setIsSpeaking(state.isSpeaking);
    });
    return () => {
      speechService.stop();
      unsubscribe();
    };
  }, []);

  const handleGenerateExplanation = async (targetMode?: ExplanationMode) => {
    const activeMode = targetMode || mode;
    if (!topic.trim()) return;

    setLoading(true);
    setError(null);
    speechService.stop();

    try {
      const response = await fetch('/api/explain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim(),
          subject: subject || 'General Academic',
          mode: activeMode,
          gradeLevel,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch explanation from AI.');
      }

      setExplanation(data.explanation);
      onIncrementExplored();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong while generating explanation.');
    } finally {
      setLoading(false);
    }
  };

  // Initial auto-load if empty
  useEffect(() => {
    if (!explanation) {
      handleGenerateExplanation();
    }
  }, []);

  const handleModeChange = (newMode: ExplanationMode) => {
    setMode(newMode);
    handleGenerateExplanation(newMode);
  };

  const handleCopy = () => {
    if (!explanation) return;
    navigator.clipboard.writeText(explanation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleSpeech = () => {
    if (isSpeaking) {
      speechService.stop();
    } else if (explanation) {
      speechService.speak(explanation);
    }
  };

  // Quick subjects and popular topics
  const currentSubjectObj = CURATED_SUBJECTS.find((s) => s.name === subject);

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5 text-blue-600" />
          <span>Interactive Topic Explainer</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Concept Demystifier & Deep Learner
        </h1>
        <p className="text-sm text-slate-600">
          Enter any academic topic or question. Switch between standard depth, intuitive ELI5 analogies, or high-yield exam revision.
        </p>
      </div>

      {/* Input Control Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Subject Dropdown */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Subject Area
            </label>
            <select
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                const subj = CURATED_SUBJECTS.find((s) => s.name === e.target.value);
                if (subj && subj.topics.length > 0) {
                  setTopic(subj.topics[0]);
                }
              }}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {CURATED_SUBJECTS.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
              <option value="General Academic">Other / General</option>
            </select>
          </div>

          {/* Grade Level Dropdown */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Academic Level
            </label>
            <select
              value={gradeLevel}
              onChange={(e) => setGradeLevel(e.target.value as GradeLevel)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Middle School">Middle School (Introductory)</option>
              <option value="High School">High School (Standard)</option>
              <option value="College / Advanced">College / Advanced (Deep Rigor)</option>
            </select>
          </div>

          {/* Topic Input */}
          <div className="md:col-span-1">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Topic or Question
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Wave-Particle Duality"
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Curated Topic Chips for the selected subject */}
        {currentSubjectObj && currentSubjectObj.topics.length > 0 && (
          <div className="pt-1 flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Ideas:
            </span>
            {currentSubjectObj.topics.map((t, idx) => (
              <button
                key={idx}
                onClick={() => setTopic(t)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                  topic === t
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        )}

        {/* Explanation Mode Switcher */}
        <div className="pt-2 border-t border-slate-100">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
            Explanation Style & Mode
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {/* Standard */}
            <button
              onClick={() => handleModeChange('standard')}
              className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition cursor-pointer text-left ${
                mode === 'standard'
                  ? 'border-blue-600 bg-blue-50 text-blue-900 shadow-xs ring-1 ring-blue-600'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <GraduationCap className={`w-4 h-4 ${mode === 'standard' ? 'text-blue-600' : 'text-slate-400'}`} />
              <div>
                <div className="font-bold">Standard</div>
                <div className="text-[10px] text-slate-500">Clear & structured</div>
              </div>
            </button>

            {/* ELI5 Mode */}
            <button
              onClick={() => handleModeChange('eli5')}
              className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition cursor-pointer text-left ${
                mode === 'eli5'
                  ? 'border-amber-600 bg-amber-50 text-amber-900 shadow-xs ring-1 ring-amber-600'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <Smile className={`w-4 h-4 ${mode === 'eli5' ? 'text-amber-600' : 'text-slate-400'}`} />
              <div>
                <div className="font-bold">ELI5 (Simple)</div>
                <div className="text-[10px] text-slate-500">Explain like I'm 10</div>
              </div>
            </button>

            {/* Analogy & Story Mode */}
            <button
              onClick={() => handleModeChange('analogy')}
              className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition cursor-pointer text-left ${
                mode === 'analogy'
                  ? 'border-indigo-600 bg-indigo-50 text-indigo-900 shadow-xs ring-1 ring-indigo-600'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <Lightbulb className={`w-4 h-4 ${mode === 'analogy' ? 'text-indigo-600' : 'text-slate-400'}`} />
              <div>
                <div className="font-bold">Analogy Mode</div>
                <div className="text-[10px] text-slate-500">Real-world story</div>
              </div>
            </button>

            {/* Exam Cram Mode */}
            <button
              onClick={() => handleModeChange('cram')}
              className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs font-medium transition cursor-pointer text-left ${
                mode === 'cram'
                  ? 'border-rose-600 bg-rose-50 text-rose-900 shadow-xs ring-1 ring-rose-600'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
            >
              <Zap className={`w-4 h-4 ${mode === 'cram' ? 'text-rose-600' : 'text-slate-400'}`} />
              <div>
                <div className="font-bold">Exam Cram</div>
                <div className="text-[10px] text-slate-500">High-yield bullet points</div>
              </div>
            </button>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={() => handleGenerateExplanation()}
            disabled={loading || !topic.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-sm transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>EduGenie is thinking...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Explain Topic</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-semibold">Unable to generate explanation</p>
            <p className="text-xs text-rose-700">{error}</p>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && !explanation && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-4 animate-pulse">
          <div className="h-6 bg-slate-200 rounded-md w-2/5"></div>
          <div className="h-4 bg-slate-100 rounded-md w-4/5"></div>
          <div className="h-4 bg-slate-100 rounded-md w-3/4"></div>
          <div className="h-32 bg-slate-50 rounded-xl border border-slate-100"></div>
          <div className="h-4 bg-slate-100 rounded-md w-2/3"></div>
        </div>
      )}

      {/* Explanation Result Output */}
      {explanation && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          {/* Header Bar inside card */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                {subject}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                {mode === 'eli5' ? '🧸 ELI5 Simple' : mode === 'analogy' ? '💡 Analogy' : mode === 'cram' ? '⚡ Cram' : '🎓 Standard'}
              </span>
              <span className="text-xs text-slate-400 hidden sm:inline">
                {gradeLevel}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Text-to-speech button */}
              <button
                onClick={handleToggleSpeech}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition cursor-pointer ${
                  isSpeaking
                    ? 'bg-amber-100 border-amber-300 text-amber-900 animate-pulse'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
                title={isSpeaking ? 'Stop listening' : 'Listen to explanation'}
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-3.5 h-3.5 text-amber-700" />
                    <span>Stop Audio</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Listen</span>
                  </>
                )}
              </button>

              {/* Copy button */}
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition cursor-pointer"
                title="Copy to clipboard"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {/* Formatted Markdown */}
          <div className="prose prose-slate max-w-none">
            <MarkdownRenderer content={explanation} />
          </div>

          {/* Next Steps / Active Recall CTA Bar */}
          <div className="mt-8 pt-6 border-t border-slate-100 space-y-3 bg-blue-50/50 -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 p-6 sm:p-8 rounded-b-2xl">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Turn this understanding into lasting memory:
            </h4>
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigateToTab('quiz', topic, subject)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
              >
                <FileCheck2 className="w-4 h-4" />
                <span>Test Myself with Quiz &rarr;</span>
              </button>

              <button
                onClick={() => onNavigateToTab('notes', topic, subject)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Generate Study Notes &rarr;</span>
              </button>

              <button
                onClick={() => onNavigateToTab('tutor', topic, subject)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Ask Genie Tutor Questions &rarr;</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
