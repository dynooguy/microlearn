import { Course, Module, Lesson } from '../types';

const BASE_URL = import.meta.env.VITE_SEATABLE_BASE_URL;
const TOKEN = import.meta.env.VITE_SEATABLE_API_TOKEN;

export async function fetchCourses(): Promise<Course[]> {
  try {
    // Ensure we use the complete base URL
    const response = await fetch(`${BASE_URL}/rows/?table_name=Kurs_Prompting`, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      console.error('SeaTable API Error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url
      });
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const validRows = data.rows.filter(row => 
      row.zbA4 !== '0' && row.zbA4 !== 0 && 
      row.KgmW !== '0' && row.KgmW !== 0
    );
    return processRows(validRows);
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
}

function processRows(rows: any[]): Course[] {
  const courseGroups = rows.reduce((acc, row) => {
    const courseName = row['0000'];
    if (!courseName) return acc;
    
    if (!acc[courseName]) {
      acc[courseName] = {
        title: courseName,
        chapters: new Map()
      };
    }

    const chapterId = row.zbA4;
    if (!acc[courseName].chapters.has(chapterId)) {
      acc[courseName].chapters.set(chapterId, {
        id: chapterId,
        title: row['8rkj'] || 'Unbenanntes Kapitel',
        description: '',
        lessons: []
      });
    }

    const chapter = acc[courseName].chapters.get(chapterId);
    if (chapter) {
      chapter.lessons.push(transformLesson(row));
    }

    return acc;
  }, {} as Record<string, { title: string, chapters: Map<string, Module> }>);

  return Object.entries(courseGroups).map(([title, data], index) => ({
    id: `course-${index + 1}`,
    title,
    description: 'Lernen Sie die Grundlagen und fortgeschrittenen Konzepte',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
    level: 'starter',
    modules: Array.from(data.chapters.values())
  }));
}

function transformLesson(row: any): Lesson {
  return {
    id: row.KgmW,
    title: row.Si03 || 'Unbenannte Lektion',
    description: row['9fe1'] || '',
    duration: 5,
    completed: false,
    content: row.HjUA || '',
    image: row.EH60 || undefined,
    quiz: {
      question: 'Keine Frage verfügbar',
      options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
      correctAnswer: 0
    }
  };
}