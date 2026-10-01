export type ActiveTab = 'home' | 'learn' | 'tutor' | 'notes' | 'quiz' | 'summarizer' | 'about';

export type ExplanationMode = 'standard' | 'eli5' | 'analogy' | 'cram';

export type GradeLevel = 'Middle School' | 'High School' | 'College / Advanced';

export type QuizDifficulty = 'Easy' | 'Medium' | 'Hard';

export interface SubjectItem {
  id: string;
  name: string;
  iconName: string;
  description: string;
  color: string;
  bgColor: string;
  topics: string[];
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint: string;
}

export interface QuizData {
  quizTitle: string;
  topic: string;
  difficulty: string;
  questions: QuizQuestion[];
}

export interface QuizResultRecord {
  id: string;
  topic: string;
  subject: string;
  difficulty: string;
  score: number;
  total: number;
  date: string;
}

export interface SavedNote {
  id: string;
  topic: string;
  subject: string;
  content: string;
  date: string;
  tags?: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedFollowUps?: string[];
}

export interface LearningStats {
  topicsExplored: number;
  quizzesCompleted: number;
  notesGenerated: number;
  studyStreakDays: number;
  lastActiveDate: string;
}
