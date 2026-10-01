import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  GraduationCap,
  MessageSquare,
  FileText,
  FileCheck2,
  FileUp,
  Info,
  Menu,
  X,
  Search,
  Flame,
  Award,
} from 'lucide-react';
import { ActiveTab, LearningStats } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  stats: LearningStats;
  onSearchSelect?: (topic: string, subject: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  stats,
  onSearchSelect,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const navItems: { id: ActiveTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: GraduationCap },
    { id: 'learn', label: 'Learn', icon: BookOpen },
    { id: 'tutor', label: 'AI Tutor', icon: MessageSquare },
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'quiz', label: 'Quiz', icon: FileCheck2 },
    { id: 'summarizer', label: 'PDF Summarizer', icon: FileUp },
    { id: 'about', label: 'About', icon: Info },
  ];

  const handleNavClick = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim() && onSearchSelect) {
      onSearchSelect(searchQuery.trim(), 'General');
      setSearchQuery('');
      setSearchOpen(false);
      setActiveTab('learn');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-blue-900 via-blue-700 to-indigo-800 bg-clip-text text-transparent">
                  EduGenie
                </span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-800 font-mono">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
                AI Learning Assistant
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs font-semibold'
                      : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50/70'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Header: Fast Search & Learning Badges */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Search toggle */}
            <div className="relative">
              {searchOpen ? (
                <form onSubmit={handleSearchSubmit} className="flex items-center">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search any topic (e.g. Calculus)..."
                    autoFocus
                    className="w-48 sm:w-64 pl-8 pr-7 py-1.5 text-xs sm:text-sm rounded-lg border border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
                  />
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5" />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="absolute right-2 text-slate-400 hover:text-slate-600 text-xs"
                  >
                    ✕
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 hover:border-blue-400 hover:bg-blue-50/50 transition"
                  title="Search topics"
                >
                  <Search className="w-3.5 h-3.5 text-slate-400" />
                  <span className="hidden sm:inline">Search Topic</span>
                </button>
              )}
            </div>

            {/* Streak & Stats badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-medium" title={`${stats.studyStreakDays} day streak`}>
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>{stats.studyStreakDays}d streak</span>
            </div>

            <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 border border-blue-200/80 text-blue-800 text-xs font-medium" title={`${stats.quizzesCompleted} quizzes completed`}>
              <Award className="w-3.5 h-3.5 text-blue-600" />
              <span>{stats.quizzesCompleted} Quizzes</span>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-1 shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-xs'
                    : 'text-slate-700 hover:bg-blue-50 hover:text-blue-600'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}

          <div className="pt-3 border-t border-slate-100 mt-2 flex items-center justify-between text-xs text-slate-500 px-2">
            <span>Explored: {stats.topicsExplored} topics</span>
            <span>Notes: {stats.notesGenerated} saved</span>
          </div>
        </div>
      )}
    </header>
  );
};
