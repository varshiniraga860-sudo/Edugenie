/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { ActiveTab, LearningStats } from './types';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './views/HomeView';
import { LearnView } from './views/LearnView';
import { TutorView } from './views/TutorView';
import { NotesView } from './views/NotesView';
import { QuizView } from './views/QuizView';
import { SummarizerView } from './views/SummarizerView';
import { AboutView } from './views/AboutView';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [currentTopic, setCurrentTopic] = useState<string>("Newton's Three Laws of Motion");
  const [currentSubject, setCurrentSubject] = useState<string>('Physics');
  const [contextTextForQuiz, setContextTextForQuiz] = useState<string>('');

  // Learning stats persisted in localStorage
  const [stats, setStats] = useState<LearningStats>(() => {
    try {
      const stored = localStorage.getItem('edugenie_stats');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error(e);
    }
    return {
      topicsExplored: 3,
      quizzesCompleted: 1,
      notesGenerated: 2,
      studyStreakDays: 3,
      lastActiveDate: new Date().toISOString().split('T')[0],
    };
  });

  // Check study streak once per day
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    if (stats.lastActiveDate !== today) {
      const lastDate = new Date(stats.lastActiveDate);
      const currentDate = new Date(today);
      const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      setStats((prev) => {
        const newStreak = diffDays === 1 ? prev.studyStreakDays + 1 : 1;
        const updated = {
          ...prev,
          studyStreakDays: newStreak,
          lastActiveDate: today,
        };
        try {
          localStorage.setItem('edugenie_stats', JSON.stringify(updated));
        } catch {}
        return updated;
      });
    }
  }, []);

  const saveStats = (newStats: LearningStats) => {
    setStats(newStats);
    try {
      localStorage.setItem('edugenie_stats', JSON.stringify(newStats));
    } catch {}
  };

  const handleIncrementExplored = () => {
    saveStats({
      ...stats,
      topicsExplored: stats.topicsExplored + 1,
    });
  };

  const handleIncrementNotes = () => {
    saveStats({
      ...stats,
      notesGenerated: stats.notesGenerated + 1,
    });
  };

  const handleQuizCompleted = (_score: number, _total: number) => {
    saveStats({
      ...stats,
      quizzesCompleted: stats.quizzesCompleted + 1,
    });
  };

  const handleSelectTopic = (topic: string, subject: string, targetTab: ActiveTab = 'learn') => {
    setCurrentTopic(topic);
    setCurrentSubject(subject);
    setActiveTab(targetTab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateToTab = (
    tab: ActiveTab,
    topic?: string,
    subject?: string,
    contextText?: string
  ) => {
    if (topic) setCurrentTopic(topic);
    if (subject) setCurrentSubject(subject);
    if (contextText !== undefined) setContextTextForQuiz(contextText);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60 font-sans text-slate-800 antialiased selection:bg-blue-500 selection:text-white">
      {/* Sticky Header Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        stats={stats}
        onSearchSelect={(topic, subject) => handleSelectTopic(topic, subject, 'learn')}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {activeTab === 'home' && (
          <HomeView
            setActiveTab={setActiveTab}
            stats={stats}
            onSelectTopic={handleSelectTopic}
          />
        )}

        {activeTab === 'learn' && (
          <LearnView
            initialTopic={currentTopic}
            initialSubject={currentSubject}
            onNavigateToTab={handleNavigateToTab}
            onIncrementExplored={handleIncrementExplored}
          />
        )}

        {activeTab === 'tutor' && (
          <TutorView
            initialTopic={currentTopic}
            initialSubject={currentSubject}
            onIncrementExplored={handleIncrementExplored}
          />
        )}

        {activeTab === 'notes' && (
          <NotesView
            initialTopic={currentTopic}
            initialSubject={currentSubject}
            onNavigateToTab={handleNavigateToTab}
            onIncrementNotes={handleIncrementNotes}
          />
        )}

        {activeTab === 'quiz' && (
          <QuizView
            initialTopic={currentTopic}
            initialSubject={currentSubject}
            initialContextText={contextTextForQuiz}
            onNavigateToTab={handleNavigateToTab}
            onQuizCompleted={handleQuizCompleted}
          />
        )}

        {activeTab === 'summarizer' && (
          <SummarizerView
            onNavigateToTab={handleNavigateToTab}
            onIncrementExplored={handleIncrementExplored}
          />
        )}

        {activeTab === 'about' && <AboutView setActiveTab={setActiveTab} />}
      </main>

      {/* Footer */}
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}
