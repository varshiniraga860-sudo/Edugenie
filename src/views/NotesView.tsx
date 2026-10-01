import React, { useState, useEffect } from 'react';
import {
  FileText,
  Sparkles,
  Download,
  Copy,
  Check,
  Printer,
  Bookmark,
  BookmarkCheck,
  Trash2,
  Search,
  RefreshCw,
  FolderOpen,
  ArrowRight,
  FileCheck2,
  AlertCircle,
} from 'lucide-react';
import { ActiveTab, SavedNote } from '../types';
import { CURATED_SUBJECTS } from '../data/curatedData';
import { MarkdownRenderer } from '../utils/markdownRenderer';

interface NotesViewProps {
  initialTopic?: string;
  initialSubject?: string;
  onNavigateToTab: (tab: ActiveTab, topic?: string, subject?: string) => void;
  onIncrementNotes: () => void;
}

export const NotesView: React.FC<NotesViewProps> = ({
  initialTopic = 'Calculus: Derivatives & Rates of Change',
  initialSubject = 'Mathematics',
  onNavigateToTab,
  onIncrementNotes,
}) => {
  const [topic, setTopic] = useState(initialTopic);
  const [subject, setSubject] = useState(initialSubject);
  const [detailLevel, setDetailLevel] = useState<'concise' | 'comprehensive' | 'cheat-sheet'>('comprehensive');
  const [focusArea, setFocusArea] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notesContent, setNotesContent] = useState<string>('');
  const [copied, setCopied] = useState(false);

  // Saved Notes in localStorage
  const [savedNotes, setSavedNotes] = useState<SavedNote[]>(() => {
    try {
      const stored = localStorage.getItem('edugenie_saved_notes');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [librarySearch, setLibrarySearch] = useState('');
  const [showLibraryDrawer, setShowLibraryDrawer] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('edugenie_saved_notes', JSON.stringify(savedNotes));
    } catch (e) {
      console.error('Error saving notes to localStorage', e);
    }
  }, [savedNotes]);

  useEffect(() => {
    if (initialTopic) setTopic(initialTopic);
    if (initialSubject) setSubject(initialSubject);
  }, [initialTopic, initialSubject]);

  const handleGenerateNotes = async () => {
    if (!topic.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim(),
          subject: subject || 'General',
          detailLevel,
          focusArea: focusArea.trim(),
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate study notes.');
      }

      setNotesContent(data.notes);
      onIncrementNotes();
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong while generating notes.');
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    if (!notesContent) {
      handleGenerateNotes();
    }
  }, []);

  const handleSaveToLibrary = () => {
    if (!notesContent) return;

    const existingIndex = savedNotes.findIndex((n) => n.topic.toLowerCase() === topic.toLowerCase());
    const newNote: SavedNote = {
      id: `note-${Date.now()}`,
      topic,
      subject,
      content: notesContent,
      date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
    };

    if (existingIndex >= 0) {
      const updated = [...savedNotes];
      updated[existingIndex] = newNote;
      setSavedNotes(updated);
    } else {
      setSavedNotes([newNote, ...savedNotes]);
    }
  };

  const isSaved = savedNotes.some((n) => n.topic.toLowerCase() === topic.toLowerCase());

  const handleDeleteSavedNote = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedNotes(savedNotes.filter((n) => n.id !== id));
  };

  const handleLoadSavedNote = (note: SavedNote) => {
    setTopic(note.topic);
    setSubject(note.subject);
    setNotesContent(note.content);
    setShowLibraryDrawer(false);
  };

  const handleCopy = () => {
    if (!notesContent) return;
    navigator.clipboard.writeText(notesContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (format: 'md' | 'txt') => {
    if (!notesContent) return;
    const blob = new Blob([notesContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${topic.replace(/[^a-zA-Z0-9]/g, '_')}_notes.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredLibrary = savedNotes.filter(
    (n) =>
      n.topic.toLowerCase().includes(librarySearch.toLowerCase()) ||
      n.subject.toLowerCase().includes(librarySearch.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 text-teal-800 text-xs font-semibold">
            <FileText className="w-3.5 h-3.5 text-teal-600" />
            <span>AI Study Notes Architect</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            High-Yield Revision & Study Notes
          </h1>
          <p className="text-sm text-slate-600">
            Synthesize any topic into memory-friendly revision sheets, definitions, formulas, and mnemonics.
          </p>
        </div>

        {/* Saved Library Toggle */}
        <button
          onClick={() => setShowLibraryDrawer(!showLibraryDrawer)}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-xs transition shrink-0"
        >
          <FolderOpen className="w-4 h-4 text-teal-600" />
          <span>Saved Notes Library ({savedNotes.length})</span>
        </button>
      </div>

      {/* Saved Notes Library Drawer/Modal */}
      {showLibraryDrawer && (
        <div className="rounded-2xl border border-teal-200 bg-teal-50/50 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-teal-900 flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-teal-700" />
              Your Saved Study Notes
            </h3>
            <button
              onClick={() => setShowLibraryDrawer(false)}
              className="text-xs text-slate-400 hover:text-slate-700"
            >
              Close ✕
            </button>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={librarySearch}
              onChange={(e) => setLibrarySearch(e.target.value)}
              placeholder="Search saved notes by topic or subject..."
              className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          {filteredLibrary.length === 0 ? (
            <p className="text-xs text-slate-500 py-3 text-center">
              No saved notes found. Generate notes and click "Save to Library" to store them here!
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {filteredLibrary.map((note) => (
                <div
                  key={note.id}
                  onClick={() => handleLoadSavedNote(note)}
                  className="p-3 rounded-xl bg-white border border-slate-200 hover:border-teal-500 hover:shadow-sm cursor-pointer transition flex flex-col justify-between"
                >
                  <div>
                    <span className="text-[10px] font-semibold text-teal-700 uppercase">
                      {note.subject}
                    </span>
                    <h4 className="text-xs font-bold text-slate-800 line-clamp-1 mt-0.5">
                      {note.topic}
                    </h4>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{note.date}</span>
                    <button
                      onClick={(e) => handleDeleteSavedNote(note.id, e)}
                      className="p-1 rounded text-slate-400 hover:text-rose-600 transition"
                      title="Delete saved note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Generator Form Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Subject */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Subject
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              {CURATED_SUBJECTS.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
              <option value="General">Other / General</option>
            </select>
          </div>

          {/* Detail Level */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Format & Depth
            </label>
            <select
              value={detailLevel}
              onChange={(e) => setDetailLevel(e.target.value as any)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="comprehensive">Comprehensive Revision Notes</option>
              <option value="concise">Concise Quick Bullets</option>
              <option value="cheat-sheet">Formula & Definition Cheat Sheet</option>
            </select>
          </div>

          {/* Topic */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Topic
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Cellular Respiration"
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        {/* Optional Focus Area */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
            Specific Focus or Emphasis (Optional)
          </label>
          <input
            type="text"
            value={focusArea}
            onChange={(e) => setFocusArea(e.target.value)}
            placeholder="e.g. Include ATP balance calculation, Krebs cycle steps, and common exam questions"
            className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={handleGenerateNotes}
            disabled={loading || !topic.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold shadow-sm transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Crafting Study Notes...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Generate Notes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">Unable to generate notes</p>
            <p className="text-xs text-rose-700">{error}</p>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && !notesContent && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-4 animate-pulse">
          <div className="h-6 bg-slate-200 rounded-md w-1/3"></div>
          <div className="h-4 bg-slate-100 rounded-md w-3/4"></div>
          <div className="h-4 bg-slate-100 rounded-md w-2/3"></div>
          <div className="h-48 bg-slate-50 rounded-xl border border-slate-100"></div>
        </div>
      )}

      {/* Notes Display Card */}
      {notesContent && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-100 text-teal-800">
                {subject}
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 capitalize">
                {detailLevel}
              </span>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Save to Library */}
              <button
                onClick={handleSaveToLibrary}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition cursor-pointer ${
                  isSaved
                    ? 'bg-teal-50 border-teal-300 text-teal-800 font-semibold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
                title="Save note to local library"
              >
                {isSaved ? <BookmarkCheck className="w-3.5 h-3.5 text-teal-600" /> : <Bookmark className="w-3.5 h-3.5" />}
                <span>{isSaved ? 'Saved' : 'Save'}</span>
              </button>

              {/* Copy */}
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition cursor-pointer"
                title="Copy notes"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>

              {/* Download */}
              <button
                onClick={() => handleDownload('md')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition cursor-pointer"
                title="Download as Markdown"
              >
                <Download className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Download</span>
              </button>

              {/* Print */}
              <button
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium transition cursor-pointer"
                title="Print Notes"
              >
                <Printer className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Print</span>
              </button>
            </div>
          </div>

          {/* Formatted Markdown */}
          <div className="prose prose-slate max-w-none">
            <MarkdownRenderer content={notesContent} />
          </div>

          {/* Quiz CTA */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-teal-50/50 -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 p-6 sm:p-8 rounded-b-2xl">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-teal-900">
                Ready to test what you just reviewed?
              </h4>
              <p className="text-xs text-slate-600">
                Generate an instant MCQ practice quiz based directly on this topic.
              </p>
            </div>
            <button
              onClick={() => onNavigateToTab('quiz', topic, subject)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-700 hover:bg-teal-800 text-white text-xs font-semibold shadow-xs transition cursor-pointer shrink-0"
            >
              <FileCheck2 className="w-4 h-4" />
              <span>Practice Quiz on {topic.split(':')[0]} &rarr;</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
