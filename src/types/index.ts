export type UserRole = 'STUDENT' | 'ASSESSOR' | 'ADMIN';

export type Subject =
  | 'Matemática'
  | 'Português'
  | 'Física'
  | 'Química'
  | 'Biologia'
  | 'História'
  | 'Geografia'
  | 'Filosofia'
  | 'Sociologia'
  | 'Inglês'
  | 'Espanhol'
  | 'Redação'
  | 'Ciências da Natureza'
  | 'Ciências Humanas'
  | 'Linguagens e Códigos';

export interface StudySession {
  id: string;
  studentId: string;
  subject: Subject;
  topic: string;
  method: 'Videoaula' | 'Aula presencial' | 'Livro' | 'Exercícios' | 'Revisão' | 'Resumo';
  date: string; // ISO Date
  durationSeconds: number;
  questionsTotal?: number;
  questionsCorrect?: number;
  notes?: string;
}

export interface Simulation {
  id: string;
  studentId: string;
  title: string;
  date: string; // ISO Date
  type: 'ENEM' | 'FUVEST' | 'UNICAMP' | 'Outros';
  score: number;
  maxScore: number;
  breakdown: Record<Subject, { correct: number; total: number }>;
}

export interface Essay {
  id: string;
  studentId: string;
  title: string;
  theme: string;
  date: string; // ISO Date
  status: 'Pendente' | 'Corrigida';
  score?: number; // 0-1000
  feedback?: string;
  fileUrl?: string; // Mock URL
}

export interface StudentGoals {
  dailyQuestions: number;
  dailyHours: number;
  weeklyHours: number;
  weeklyMockExams: number;
  dailySubjects: number;
  targetScore: number;
  specificGoals?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: 'STUDENT';
  goals: StudentGoals;
  profileType: 'ROUTINE' | 'CYCLE';
  weakSubjects: Subject[];
}

export interface Assessor {
  id: string;
  name: string;
  email: string;
  role: 'ASSESSOR';
  students: string[]; // IDs of students they manage
}

export type User = Student | Assessor;

export interface ForumPost {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  attachmentUrl?: string;
  attachmentType?: 'image' | 'video' | 'pdf';
  createdAt: string; // ISO Date
  likes: number;
  comments: ForumComment[];
}

export interface ForumComment {
  id: string;
  authorId: string;
  authorName: string;
  content: string;
  createdAt: string;
}
