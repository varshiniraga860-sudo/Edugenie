import React from 'react';
import { Sparkles, BookOpen, Heart, ShieldCheck, HelpCircle } from 'lucide-react';
import { ActiveTab } from '../types';

interface FooterProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Sparkles className="w-4 h-4 text-amber-300" />
              </div>
              <span className="text-lg font-bold text-slate-900">EduGenie</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Empowering students worldwide with conversational AI tutoring, simplified explanations, study note synthesis, and automated MCQ practice.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md w-fit font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Powered by Gemini 3.8 Flash
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Learning Suite
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>
                <button
                  onClick={() => {
                    setActiveTab('learn');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-blue-600 transition"
                >
                  Topic Explainer & ELI5
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('tutor');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-blue-600 transition"
                >
                  Genie AI Academic Tutor
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('notes');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-blue-600 transition"
                >
                  Automated Study Notes
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('quiz');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-blue-600 transition"
                >
                  Interactive MCQ Quizzes
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setActiveTab('summarizer');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="hover:text-blue-600 transition"
                >
                  PDF & Document Summarizer
                </button>
              </li>
            </ul>
          </div>

          {/* Subjects */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Core Subjects
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li>Mathematics & Calculus</li>
              <li>Physics & Mechanics</li>
              <li>Chemistry & Organic Synthesis</li>
              <li>Biology & Genetics</li>
              <li>Computer Science & Data Structures</li>
              <li>World History & Literature</li>
            </ul>
          </div>

          {/* Student guidelines */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
              Study Philosophy
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed mb-3">
              Built on cognitive science: Active Recall, Socratic Inquiry, and Analogical Grounding for deep understanding rather than rote memorization.
            </p>
            <button
              onClick={() => {
                setActiveTab('about');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
            >
              Learn about our methodology &rarr;
            </button>
          </div>
        </div>

        <div className="border-t border-slate-100 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} EduGenie AI Learning Assistant. Designed for academic mastery.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> Safe Academic AI
            </span>
            <span className="flex items-center gap-1 text-slate-500">
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> Built for Students
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
