import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Student, Assessor, StudySession, Simulation, Essay, ForumPost, Subject } from '../types';

interface DataContextType {
  currentUser: User | null;
  students: Student[];
  sessions: StudySession[];
  simulations: Simulation[];
  essays: Essay[];
  posts: ForumPost[];

  // Actions
  login: (email: string, role: 'STUDENT' | 'ASSESSOR') => void;
  logout: () => void;
  addSession: (session: Omit<StudySession, 'id'>) => void;
  addSimulation: (simulation: Omit<Simulation, 'id'>) => void;
  addEssay: (essay: Omit<Essay, 'id'>) => void;
  addPost: (post: Omit<ForumPost, 'id' | 'likes' | 'comments' | 'createdAt'>) => void;
  updateStudentGoals: (studentId: string, goals: Student['goals']) => void;
  updateStudentProfileType: (studentId: string, type: 'ROUTINE' | 'CYCLE') => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Mock Data
const MOCK_STUDENTS: Student[] = [
  {
    id: '1',
    name: 'Carlos Silva',
    email: 'carlos@aluno.com',
    role: 'STUDENT',
    profileType: 'ROUTINE',
    weakSubjects: ['Química', 'Física'],
    goals: { dailyQuestions: 80, dailyHours: 6, weeklyHours: 35, weeklyMockExams: 2, dailySubjects: 5, targetScore: 800 }
  },
  {
    id: '2',
    name: 'Maria Oliveira',
    email: 'maria@aluno.com',
    role: 'STUDENT',
    profileType: 'CYCLE',
    weakSubjects: ['Matemática'],
    goals: { dailyQuestions: 90, dailyHours: 7, weeklyHours: 40, weeklyMockExams: 2, dailySubjects: 4, targetScore: 850 }
  }
];

const MOCK_ASSESSOR: Assessor = {
  id: 'a1',
  name: 'Professor Rogério',
  email: 'rogerio@assessor.com',
  role: 'ASSESSOR',
  students: ['1', '2']
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(MOCK_STUDENTS[0]); // Default login as student 1
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);
  const [sessions, setSessions] = useState<StudySession[]>([]);
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [essays, setEssays] = useState<Essay[]>([]);
  const [posts, setPosts] = useState<ForumPost[]>([]);

  // Initialize some mock data
  useEffect(() => {
    // Generate some past sessions for visualization
    const newSessions: StudySession[] = [];
    const subjects: Subject[] = ['Matemática', 'Português', 'Física', 'Química', 'Biologia', 'História'];

    // Last 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      // Random sessions per day
      const numSessions = Math.floor(Math.random() * 4); // 0-3 sessions
      for (let j = 0; j < numSessions; j++) {
        const subj = subjects[Math.floor(Math.random() * subjects.length)];
        newSessions.push({
          id: `session-${i}-${j}`,
          studentId: '1', // Carlos
          subject: subj,
          topic: `Tópico aleatório de ${subj}`,
          method: Math.random() > 0.5 ? 'Videoaula' : 'Exercícios',
          date: date.toISOString(),
          durationSeconds: 1800 + Math.floor(Math.random() * 5400), // 30min - 2h
          questionsTotal: 20,
          questionsCorrect: 15 + Math.floor(Math.random() * 5),
        });
      }
    }
    setSessions(newSessions);

    // Initial Posts
    setPosts([
      {
        id: 'p1',
        authorId: '1',
        authorName: 'Carlos Silva',
        content: 'Alguém tem resumo de Eletrodinâmica?',
        createdAt: new Date().toISOString(),
        likes: 2,
        comments: []
      }
    ]);
  }, []);

  const login = (email: string, role: 'STUDENT' | 'ASSESSOR') => {
    if (role === 'ASSESSOR') setCurrentUser(MOCK_ASSESSOR);
    else {
      const student = students.find(s => s.email === email) || students[0];
      setCurrentUser(student);
    }
  };

  const logout = () => setCurrentUser(null);

  const addSession = (session: Omit<StudySession, 'id'>) => {
    const newSession = { ...session, id: Math.random().toString(36).substr(2, 9) };
    setSessions(prev => [newSession, ...prev]);
  };

  const addSimulation = (simulation: Omit<Simulation, 'id'>) => {
    setSimulations(prev => [{ ...simulation, id: Math.random().toString(36).substr(2, 9) }, ...prev]);
  };

  const addEssay = (essay: Omit<Essay, 'id'>) => {
    setEssays(prev => [{ ...essay, id: Math.random().toString(36).substr(2, 9) }, ...prev]);
  };

  const addPost = (post: Omit<ForumPost, 'id' | 'likes' | 'comments' | 'createdAt'>) => {
    setPosts(prev => [{
      ...post,
      id: Math.random().toString(36).substr(2, 9),
      likes: 0,
      comments: [],
      createdAt: new Date().toISOString()
    }, ...prev]);
  };

  const updateStudentGoals = (studentId: string, goals: Student['goals']) => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, goals } : s));
  };

  const updateStudentProfileType = (studentId: string, type: 'ROUTINE' | 'CYCLE') => {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, profileType: type } : s));
  };

  return (
    <DataContext.Provider value={{
      currentUser,
      students,
      sessions,
      simulations,
      essays,
      posts,
      login,
      logout,
      addSession,
      addSimulation,
      addEssay,
      addPost,
      updateStudentGoals,
      updateStudentProfileType
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
