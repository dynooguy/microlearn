export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  duration: number;
  completed: boolean;
  content: string;
  image?: string;
  quiz: QuizQuestion;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  title: string;
  description: string;
  image: string;
  modules: Module[];
  level: 'starter' | 'advanced' | 'professional';
  access: 'free' | 'paid';
}