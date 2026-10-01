import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  MessageSquare,
  FileText,
  FileCheck2,
  FileUp,
  Search,
  ArrowRight,
  Calculator,
  Atom,
  FlaskConical,
  Dna,
  Code,
  Landmark,
  TrendingUp,
  Award,
  Lightbulb,
  CheckCircle2,
  Clock,
  Zap,
} from 'lucide-react';
import { ActiveTab, LearningStats } from '../types';
import { CURATED_SUBJECTS, POPULAR_TOPICS } from '../data/curatedData';

interface HomeViewProps {
  setActiveTab: (tab: ActiveTab) => void;
  stats: LearningStats;
  onSelectTopic: (topic: string, subject: string, tab?: ActiveTab) => void;
}

// Icon mapper for dynamic subject icons
const iconMap: Record<string, React.FC<{ className?: string }>> = {
  Calculator,
  Atom,
  FlaskConical,
  Dna,
  Code,
  Landmark,
  BookOpen,
  TrendingUp,
};

export const HomeView: React.FC<HomeViewProps> = ({
  setActiveTab,
  stats,
  onSelectTopic,
}) => {
  const [searchVal, setSearchVal] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      onSelectTopic(searchVal.trim(), 'General', 'learn');
    }
  };

  const filteredSubjects =
    selectedSubjectFilter === 'all'
      ? CURATED_SUBJECTS
      : CURATED_SUBJECTS.filter((s) => s.id === selectedSubjectFilter);

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900 via-blue-700 to-indigo-800 text-white p-6 sm:p-10 lg:p-14 shadow-xl shadow-blue-900/10">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-blue-500/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-blue-100">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI-Powered Academic Excellence for Every Student</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            Master Any Subject with <span className="text-amber-300">EduGenie</span>
          </h1>

          <p className="text-base sm:text-lg text-blue-100 max-w-2xl leading-relaxed">
            Understand tough concepts in seconds. Switch to simple ELI5 explanations, generate revision notes, test yourself with interactive quizzes, and ask our 24/7 AI tutor anything.
          </p>

          {/* Quick Search Bar */}
          <form onSubmit={handleSearchSubmit} className="pt-2">
            <div className="relative flex items-center max-w-xl shadow-lg rounded-2xl overflow-hidden bg-white p-1.5 focus-within:ring-4 focus-within:ring-blue-400/50 transition">
              <Search className="w-5 h-5 text-slate-400 ml-3" />
              <input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="What topic do you want to master today? (e.g. Newton's Laws)"
                className="w-full px-3 py-2.5 text-slate-800 placeholder-slate-400 text-sm focus:outline-none"
              />
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs sm:text-sm transition shrink-0 cursor-pointer shadow-sm"
              >
                <span>Explain Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Popular Topic Badges */}
          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-blue-200 font-medium">Trending:</span>
            {POPULAR_TOPICS.slice(0, 4).map((pt, i) => (
              <button
                key={i}
                onClick={() => onSelectTopic(pt.topic, pt.subject, 'learn')}
                className="px-2.5 py-1 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 transition cursor-pointer backdrop-blur-xs"
              >
                {pt.topic.split(':')[0]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Launch Suite Cards */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Learning Superpowers
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Choose an AI learning tool to start your study session
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* 1. Explainer */}
          <div
            onClick={() => setActiveTab('learn')}
            className="group relative p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition">
                Topic Explainer
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Break down complex topics with simple analogies, ELI5 mode, and exam cram recaps.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
              <span>Start Learning</span> &rarr;
            </div>
          </div>

          {/* 2. AI Tutor */}
          <div
            onClick={() => setActiveTab('tutor')}
            className="group relative p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition">
                Genie AI Tutor
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                24/7 conversational tutor. Ask homework questions, step-by-step math proofs, and guidance.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-indigo-600 group-hover:translate-x-1 transition-transform">
              <span>Chat with Genie</span> &rarr;
            </div>
          </div>

          {/* 3. Study Notes */}
          <div
            onClick={() => setActiveTab('notes')}
            className="group relative p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-teal-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-600 transition">
                Study Notes
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Generate structured revision notes with definitions, formulas, mnemonics, and cheat sheets.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-teal-600 group-hover:translate-x-1 transition-transform">
              <span>Generate Notes</span> &rarr;
            </div>
          </div>

          {/* 4. MCQ Quiz */}
          <div
            onClick={() => setActiveTab('quiz')}
            className="group relative p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-emerald-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-600 transition">
                Practice Quiz
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Test your mastery with AI-generated multiple choice questions and instant explanations.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-emerald-600 group-hover:translate-x-1 transition-transform">
              <span>Take a Quiz</span> &rarr;
            </div>
          </div>

          {/* 5. PDF Summarizer */}
          <div
            onClick={() => setActiveTab('summarizer')}
            className="group relative p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-purple-500 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileUp className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-purple-600 transition">
                PDF Summarizer
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Upload educational documents or lecture notes to extract key concepts and study flashcards.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center text-xs font-semibold text-purple-600 group-hover:translate-x-1 transition-transform">
              <span>Upload Document</span> &rarr;
            </div>
          </div>
        </div>
      </section>

      {/* Subject Explorer */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              Explore Academic Subjects
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Select a subject to explore high-yield topics or dive into custom lessons
            </p>
          </div>

          {/* Subject Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setSelectedSubjectFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                selectedSubjectFilter === 'all'
                  ? 'bg-blue-600 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All Subjects
            </button>
            {CURATED_SUBJECTS.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSubjectFilter(s.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                  selectedSubjectFilter === s.id
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {s.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map((subject) => {
            const Icon = iconMap[subject.iconName] || BookOpen;
            return (
              <div
                key={subject.id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-xl ${subject.bgColor} flex items-center justify-center ${subject.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">{subject.name}</h3>
                      <p className="text-xs text-slate-500">{subject.description}</p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Popular Topics:
                    </p>
                    <div className="space-y-1.5">
                      {subject.topics.slice(0, 3).map((topic, tIdx) => (
                        <button
                          key={tIdx}
                          onClick={() => onSelectTopic(topic, subject.name, 'learn')}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg bg-slate-50 hover:bg-blue-50 hover:text-blue-700 text-xs text-slate-700 font-medium transition flex items-center justify-between group"
                        >
                          <span className="truncate">{topic}</span>
                          <ArrowRight className="w-3 h-3 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform shrink-0 ml-1" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <button
                    onClick={() => onSelectTopic(subject.topics[0], subject.name, 'learn')}
                    className="font-semibold text-blue-600 hover:text-blue-800"
                  >
                    Explore Subject &rarr;
                  </button>
                  <button
                    onClick={() => onSelectTopic(subject.topics[0], subject.name, 'quiz')}
                    className="text-slate-500 hover:text-slate-800"
                  >
                    Quick Quiz
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* The 4-Step Learning Method */}
      <section className="rounded-3xl border border-blue-100 bg-gradient-to-b from-blue-50/60 to-white p-8 sm:p-10">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5 text-blue-600" />
            <span>Active Learning Loop</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            How EduGenie Accelerates Understanding
          </h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Forget passive memorization. EduGenie applies proven cognitive learning science to ensure durable academic mastery.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h3 className="text-base font-bold text-slate-900">Demystify Concepts</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Toggle into <strong>ELI5 Mode</strong> or <strong>Analogy Mode</strong> to build immediate intuition before tackling mathematical or theoretical rigors.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h3 className="text-base font-bold text-slate-900">Synthesize Notes</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Transform lectures, uploaded PDFs, or topics into structured bullet points, memory mnemonics, and printable cheat sheets.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h3 className="text-base font-bold text-slate-900">Active Recall Testing</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Take generated MCQ quizzes with hints and comprehensive rationales that explain why false options are tempting traps.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm">
              4
            </div>
            <h3 className="text-base font-bold text-slate-900">Socratic AI Coaching</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Stuck on homework or proof? Chat with Genie Tutor for step-by-step hints and follow-up conceptual questions.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
