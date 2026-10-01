import React from 'react';
import {
  Sparkles,
  GraduationCap,
  Brain,
  ShieldCheck,
  Compass,
  Lightbulb,
  CheckCircle,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import { ActiveTab } from '../types';

interface AboutViewProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ setActiveTab }) => {
  const faqs = [
    {
      q: 'How does EduGenie generate explanations and quizzes?',
      a: 'EduGenie uses state-of-the-art Gemini 3.8 Flash multimodal reasoning through a secure backend architecture. The system designs structured pedagogical explanations, analogies, high-yield notes, and distractors for multiple-choice questions.',
    },
    {
      q: 'Can I upload my own class notes, slides, and textbook chapters?',
      a: 'Yes! The PDF & Document Summarizer allows you to upload lecture slides, PDF chapters, or paste syllabus text. You can generate concise summaries, vocabulary flashcards, and even an interactive MCQ quiz directly from your materials.',
    },
    {
      q: 'What is the "ELI5" explanation mode?',
      a: 'ELI5 stands for "Explain Like I\'m 10." It employs the Feynman Technique: breaking down intimidating academic jargon into straightforward everyday language, intuitive metaphors, and step-by-step thinking so you grasp the core intuition immediately.',
    },
    {
      q: 'How should I use EduGenie to prepare for exams?',
      a: 'Follow our recommended 4-step loop: 1) Explore the concept in Learn mode; 2) Review the generated Study Notes; 3) Take a practice Quiz in Quiz mode to test active recall; 4) Ask Genie Tutor about any questions you missed.',
    },
    {
      q: 'Is my data secure?',
      a: 'Yes. Your API requests are processed securely on the server without storing personal identity details. Your study notes and quiz history are saved locally in your own browser using standard Web Storage.',
    },
  ];

  return (
    <div className="space-y-12 pb-16 max-w-4xl mx-auto">
      {/* Hero Header */}
      <section className="text-center space-y-4 pt-4">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-100 text-blue-800 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Our Academic Vision</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          About EduGenie
        </h1>
        <p className="text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          EduGenie was built on a simple conviction: <strong>no academic concept is too difficult</strong> when explained with the right mental model, intuitive analogies, and personalized guidance.
        </p>
      </section>

      {/* 3 Core Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
            <Brain className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Feynman Technique</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            True mastery means being able to explain an idea simply. EduGenie translates complex mathematical, scientific, and historical concepts into intuitive mental models.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center">
            <GraduationCap className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Active Recall Testing</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Re-reading notes creates an illusion of competence. Generating targeted multiple-choice practice quizzes forces the brain to retrieve information and cement long-term memory.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 space-y-3 shadow-xs">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
            <Compass className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Socratic Mentorship</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Rather than just spitting out solutions, Genie Tutor guides students through problem-solving steps, diagnosing errors and sparking follow-up curiosity.
          </p>
        </div>
      </section>

      {/* Academic Integrity & Ethics */}
      <section className="rounded-3xl border border-slate-200 bg-slate-900 text-white p-8 sm:p-10 space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-300">
          <ShieldCheck className="w-4 h-4" />
          <span>Academic Integrity Promise</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight">
          A Mentor for Understanding, Not a Shortcut
        </h2>
        <p className="text-sm text-slate-300 leading-relaxed">
          EduGenie is designed to be your intellectual sparring partner. We encourage students to formulate questions, test hypotheses, and verify mathematical derivations. We believe AI should amplify human curiosity and cognitive effort, empowering learners to become independent critical thinkers.
        </p>
        <div className="pt-2 flex flex-wrap gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1.5 text-slate-200">
            <CheckCircle className="w-4 h-4 text-emerald-400" /> Transparent Explanations
          </span>
          <span className="flex items-center gap-1.5 text-slate-200">
            <CheckCircle className="w-4 h-4 text-emerald-400" /> Socratic Step-by-Step
          </span>
          <span className="flex items-center gap-1.5 text-slate-200">
            <CheckCircle className="w-4 h-4 text-emerald-400" /> Concept Reinforcement
          </span>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Everything you need to know about using EduGenie effectively.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 bg-white p-5 space-y-2 shadow-xs"
            >
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
                {faq.q}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pl-6">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to action */}
      <section className="rounded-3xl border border-blue-100 bg-blue-50/70 p-8 text-center space-y-4">
        <h2 className="text-2xl font-bold text-blue-950">
          Ready to Ace Your Next Study Session?
        </h2>
        <p className="text-xs sm:text-sm text-blue-800 max-w-lg mx-auto">
          Start exploring concepts with simple analogies or test your readiness with our adaptive quiz master.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              setActiveTab('learn');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <span>Explore Topics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              setActiveTab('tutor');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <span>Ask Genie Tutor</span>
          </button>
        </div>
      </section>
    </div>
  );
};
