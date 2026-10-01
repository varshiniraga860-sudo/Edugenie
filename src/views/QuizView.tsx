import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  FileCheck2,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  RefreshCw,
  Trophy,
  ArrowRight,
  Clock,
  RotateCcw,
  BookOpen,
  FileText,
  AlertCircle,
  History,
} from 'lucide-react';
import { ActiveTab, QuizData, QuizDifficulty, QuizQuestion, QuizResultRecord } from '../types';
import { CURATED_SUBJECTS } from '../data/curatedData';

interface QuizViewProps {
  initialTopic?: string;
  initialSubject?: string;
  initialContextText?: string;
  onNavigateToTab: (tab: ActiveTab, topic?: string, subject?: string) => void;
  onQuizCompleted: (score: number, total: number) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({
  initialTopic = 'Big-O Notation & Algorithm Complexity',
  initialSubject = 'Computer Science',
  initialContextText = '',
  onNavigateToTab,
  onQuizCompleted,
}) => {
  const [topic, setTopic] = useState(initialTopic);
  const [subject, setSubject] = useState(initialSubject);
  const [difficulty, setDifficulty] = useState<QuizDifficulty>('Medium');
  const [count, setCount] = useState<number>(5);
  const [contextText, setContextText] = useState(initialContextText);
  const [showContextInput, setShowContextInput] = useState(Boolean(initialContextText));

  // Quiz execution state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<Record<number, boolean>>({});
  const [showHint, setShowHint] = useState<Record<number, boolean>>({});
  const [quizFinished, setQuizFinished] = useState(false);

  // Timer
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  // Local storage history
  const [quizHistory, setQuizHistory] = useState<QuizResultRecord[]>(() => {
    try {
      const stored = localStorage.getItem('edugenie_quiz_history');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (initialTopic) setTopic(initialTopic);
    if (initialSubject) setSubject(initialSubject);
    if (initialContextText) {
      setContextText(initialContextText);
      setShowContextInput(true);
    }
  }, [initialTopic, initialSubject, initialContextText]);

  // Timer tick
  useEffect(() => {
    let interval: any = null;
    if (timerActive && !quizFinished) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive, quizFinished]);

  const handleGenerateQuiz = async () => {
    if (!topic.trim()) return;

    setLoading(true);
    setError(null);
    setQuizData(null);
    setCurrentIndex(0);
    setSelectedAnswers({});
    setIsAnswerSubmitted({});
    setShowHint({});
    setQuizFinished(false);
    setTimerSeconds(0);
    setTimerActive(false);

    try {
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.trim(),
          subject: subject || 'General',
          difficulty,
          count,
          contextText: showContextInput ? contextText.trim() : '',
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate quiz.');
      }

      if (!data.questions || data.questions.length === 0) {
        throw new Error('Received empty question set from AI.');
      }

      setQuizData(data);
      setTimerActive(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong while generating quiz.');
    } finally {
      setLoading(false);
    }
  };

  // Initial load if none
  useEffect(() => {
    if (!quizData && !loading) {
      handleGenerateQuiz();
    }
  }, []);

  const handleSelectOption = (qId: number, optionIdx: number) => {
    if (isAnswerSubmitted[qId]) return; // locked once answered

    setSelectedAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
    setIsAnswerSubmitted((prev) => ({ ...prev, [qId]: true }));
  };

  const handleNextQuestion = () => {
    if (!quizData) return;
    if (currentIndex < quizData.questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      finishQuiz();
    }
  };

  const calculateScore = () => {
    if (!quizData) return 0;
    return quizData.questions.reduce((acc, q) => {
      return acc + (selectedAnswers[q.id] === q.correctIndex ? 1 : 0);
    }, 0);
  };

  const finishQuiz = () => {
    setQuizFinished(true);
    setTimerActive(false);

    const score = calculateScore();
    const total = quizData?.questions.length || 0;
    onQuizCompleted(score, total);

    // Save record
    const record: QuizResultRecord = {
      id: `record-${Date.now()}`,
      topic,
      subject,
      difficulty,
      score,
      total,
      date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
    };

    const updated = [record, ...quizHistory.slice(0, 9)];
    setQuizHistory(updated);
    try {
      localStorage.setItem('edugenie_quiz_history', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    // Trigger celebration confetti if score >= 60%
    if (score / total >= 0.6) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  const formatTimer = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins}:${remainder < 10 ? '0' : ''}${remainder}`;
  };

  const currentQ: QuizQuestion | undefined = quizData?.questions[currentIndex];

  return (
    <div className="space-y-8 pb-12 max-w-4xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold">
            <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>AI Practice & Assessment</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Interactive MCQ Practice Quiz
          </h1>
          <p className="text-sm text-slate-600">
            Strengthen neural pathways through active recall. Get real-time feedback and concept explanations.
          </p>
        </div>

        {/* Recent Scores Chip */}
        {quizHistory.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
            <History className="w-3.5 h-3.5 text-slate-400" />
            <span>
              Last Score: {quizHistory[0].score}/{quizHistory[0].total} ({quizHistory[0].topic.split(':')[0]})
            </span>
          </div>
        )}
      </div>

      {/* Quiz Configuration Panel */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6 shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Subject */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Subject
            </label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:ring-2 focus:ring-emerald-500"
            >
              {CURATED_SUBJECTS.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name}
                </option>
              ))}
              <option value="General">Other / General</option>
            </select>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Difficulty
            </label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as QuizDifficulty)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Easy">Easy (Fundamentals)</option>
              <option value="Medium">Medium (Application)</option>
              <option value="Hard">Hard (Deep Thinking)</option>
            </select>
          </div>

          {/* Count */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Questions
            </label>
            <select
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value, 10))}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:ring-2 focus:ring-emerald-500"
            >
              <option value={3}>3 Questions (Quick Sprint)</option>
              <option value={5}>5 Questions (Standard)</option>
              <option value={8}>8 Questions (Comprehensive)</option>
              <option value={10}>10 Questions (Full Test)</option>
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
              placeholder="e.g. Photosynthesis"
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Toggle Custom Context Input */}
        <div>
          <button
            type="button"
            onClick={() => setShowContextInput(!showContextInput)}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 cursor-pointer"
          >
            <span>{showContextInput ? '– Hide custom context notes' : '+ Base questions on custom text/notes'}</span>
          </button>

          {showContextInput && (
            <div className="mt-2">
              <textarea
                value={contextText}
                onChange={(e) => setContextText(e.target.value)}
                rows={3}
                placeholder="Paste lecture notes, study guide, or textbook excerpt here to create a custom targeted quiz..."
                className="w-full p-3 text-xs rounded-xl border border-slate-200 bg-slate-50 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={handleGenerateQuiz}
            disabled={loading || !topic.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold shadow-sm transition disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Generating Smart Quiz...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Create Practice Quiz</span>
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
            <p className="font-semibold">Unable to generate quiz</p>
            <p className="text-xs text-rose-700">{error}</p>
          </div>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 space-y-5 animate-pulse">
          <div className="flex justify-between items-center">
            <div className="h-5 bg-slate-200 rounded w-1/4"></div>
            <div className="h-5 bg-slate-200 rounded w-16"></div>
          </div>
          <div className="h-6 bg-slate-200 rounded w-3/4"></div>
          <div className="space-y-3 pt-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-slate-100 rounded-xl"></div>
            ))}
          </div>
        </div>
      )}

      {/* Active Quiz Question Interface */}
      {quizData && !quizFinished && currentQ && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs space-y-6">
          {/* Progress Header */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
              <span className="text-emerald-700 font-bold">
                Question {currentIndex + 1} of {quizData.questions.length}
              </span>
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  {formatTimer(timerSeconds)}
                </span>
                <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                  {difficulty}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{
                  width: `${((currentIndex + 1) / quizData.questions.length) * 100}%`,
                }}
              />
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-3">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
              {currentQ.question}
            </h2>

            {/* Hint toggler */}
            {currentQ.hint && (
              <div>
                {showHint[currentQ.id] ? (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                    <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      <strong>Hint:</strong> {currentQ.hint}
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowHint((prev) => ({ ...prev, [currentQ.id]: true }))}
                    className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Need a concept hint?</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* 4 Options Grid */}
          <div className="space-y-3">
            {currentQ.options.map((option, optIdx) => {
              const isSelected = selectedAnswers[currentQ.id] === optIdx;
              const hasAnswered = isAnswerSubmitted[currentQ.id];
              const isCorrect = optIdx === currentQ.correctIndex;

              let buttonStyle = 'border-slate-200 hover:bg-slate-50 text-slate-800';

              if (hasAnswered) {
                if (isCorrect) {
                  buttonStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500 font-semibold';
                } else if (isSelected && !isCorrect) {
                  buttonStyle = 'border-rose-500 bg-rose-50 text-rose-950 ring-2 ring-rose-500';
                } else {
                  buttonStyle = 'border-slate-100 opacity-60 text-slate-500';
                }
              }

              return (
                <button
                  key={optIdx}
                  onClick={() => handleSelectOption(currentQ.id, optIdx)}
                  disabled={hasAnswered}
                  className={`w-full text-left p-4 rounded-xl border text-sm transition flex items-center justify-between gap-3 cursor-pointer ${buttonStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs shrink-0">
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span>{option}</span>
                  </div>

                  {hasAnswered && (
                    <div className="shrink-0">
                      {isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                      {isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-600" />}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation Callout (Shown after student answers) */}
          {isAnswerSubmitted[currentQ.id] && (
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-slate-800 space-y-1.5 animate-fadeIn">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-900">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Concept Explanation</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {currentQ.explanation}
              </p>
            </div>
          )}

          {/* Next / Submit Navigation */}
          <div className="pt-2 flex justify-between items-center">
            <span className="text-xs text-slate-400">
              {isAnswerSubmitted[currentQ.id] ? 'Answer recorded' : 'Select an option to test yourself'}
            </span>

            <button
              onClick={handleNextQuestion}
              disabled={!isAnswerSubmitted[currentQ.id]}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold shadow-xs transition disabled:opacity-40 cursor-pointer"
            >
              <span>{currentIndex === quizData.questions.length - 1 ? 'Finish & See Score' : 'Next Question'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Quiz Finished / Score Review Screen */}
      {quizData && quizFinished && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-10 shadow-xs space-y-8">
          {/* Score Header */}
          <div className="text-center max-w-md mx-auto space-y-4">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shadow-md">
              <Trophy className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Quiz Complete!
              </h2>
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                {topic} • {difficulty}
              </p>
            </div>

            {/* Score Ring / Pill */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-around">
              <div>
                <div className="text-3xl font-extrabold text-blue-600">
                  {calculateScore()} / {quizData.questions.length}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">Final Score</div>
              </div>

              <div className="h-8 w-px bg-slate-200" />

              <div>
                <div className="text-3xl font-extrabold text-emerald-600">
                  {Math.round((calculateScore() / quizData.questions.length) * 100)}%
                </div>
                <div className="text-[11px] text-slate-500 font-medium">Accuracy</div>
              </div>

              <div className="h-8 w-px bg-slate-200" />

              <div>
                <div className="text-3xl font-extrabold text-indigo-600">
                  {formatTimer(timerSeconds)}
                </div>
                <div className="text-[11px] text-slate-500 font-medium">Time Taken</div>
              </div>
            </div>

            {/* Assessment message */}
            <p className="text-sm font-medium text-slate-700">
              {calculateScore() / quizData.questions.length === 1
                ? '🌟 Phenomenal! Perfect score, you completely mastered this topic!'
                : calculateScore() / quizData.questions.length >= 0.7
                ? '🎉 Excellent work! You have strong conceptual grasp of this subject.'
                : '💪 Solid effort! Review the detailed explanations below to solidify the weak areas.'}
            </p>
          </div>

          {/* Detailed Question Review */}
          <div className="space-y-4 pt-4 border-t border-slate-100">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">
              Question-by-Question Review
            </h3>

            <div className="space-y-4">
              {quizData.questions.map((q, idx) => {
                const studentAns = selectedAnswers[q.id];
                const isCorrect = studentAns === q.correctIndex;

                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-xl border space-y-3 ${
                      isCorrect ? 'border-emerald-200 bg-emerald-50/40' : 'border-rose-200 bg-rose-50/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2">
                        <span className="font-bold text-xs px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700">
                          Q{idx + 1}
                        </span>
                        <p className="text-sm font-semibold text-slate-900">{q.question}</p>
                      </div>
                      {isCorrect ? (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold shrink-0">
                          Correct
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 text-xs font-bold shrink-0">
                          Missed
                        </span>
                      )}
                    </div>

                    {/* Options summary */}
                    <div className="text-xs space-y-1 pl-7">
                      <p className="text-slate-600">
                        <strong>Your answer:</strong>{' '}
                        {studentAns !== undefined ? q.options[studentAns] : 'Not answered'}
                      </p>
                      {!isCorrect && (
                        <p className="text-emerald-800 font-semibold">
                          <strong>Correct answer:</strong> {q.options[q.correctIndex]}
                        </p>
                      )}
                      <p className="text-slate-600 pt-1 border-t border-slate-200/50">
                        <strong>Explanation:</strong> {q.explanation}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={() => {
                setQuizFinished(false);
                setCurrentIndex(0);
                setSelectedAnswers({});
                setIsAnswerSubmitted({});
                setTimerSeconds(0);
                setTimerActive(true);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake this Quiz</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onNavigateToTab('learn', topic, subject)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Deep Dive with Explainer</span>
              </button>

              <button
                onClick={() => onNavigateToTab('notes', topic, subject)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Review Study Notes</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
