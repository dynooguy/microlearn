import { Course, Module, Lesson } from '../types';

const BASE_URL = import.meta.env.VITE_SEATABLE_BASE_URL;
const TOKEN = import.meta.env.VITE_SEATABLE_API_TOKEN;

export async function fetchCourses(): Promise<Course[]> {
  try {
    const response = await fetch(`${BASE_URL}/rows/?table_name=Kurs_Prompting`, {
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return processRows(data.rows);
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error;
  }
}

function processRows(rows: any[]): Course[] {
  // Group by course title
  const courseMap = new Map<string, {
    chapters: Map<string, Module>
  }>();

  // Filter out invalid rows and process each row
  rows.forEach(row => {
    const courseTitle = row['0000'];
    const chapterId = row.zbA4;
    const lessonId = row.KgmW;

    // Skip if chapter ID or lesson ID is 0 or missing course title
    if (!courseTitle || chapterId === '0' || chapterId === 0 || 
        lessonId === '0' || lessonId === 0) {
      return;
    }

    if (!courseMap.has(courseTitle)) {
      courseMap.set(courseTitle, {
        chapters: new Map()
      });
    }

    const course = courseMap.get(courseTitle)!;

    // Add chapter if it doesn't exist
    if (!course.chapters.has(chapterId)) {
      course.chapters.set(chapterId, {
        id: chapterId,
        title: row['8rkj'] || 'Unbenanntes Kapitel',
        description: '',
        lessons: []
      });
    }

    // Add lesson to chapter
    const chapter = course.chapters.get(chapterId)!;
    chapter.lessons.push({
      id: row.KgmW,
      title: row.Si03 || 'Unbenannte Lektion',
      description: row['9fe1'] || '',
      duration: 5, // Default duration
      completed: false,
      content: row.HjUA || '',
      image: row.EH60,
      quiz: {
        question: 'Was haben Sie aus dieser Lektion gelernt?',
        options: [
          'Ich habe die Hauptkonzepte verstanden',
          'Ich brauche noch mehr Übung',
          'Ich möchte die Lektion wiederholen',
          'Ich bin bereit für die nächste Lektion'
        ],
        correctAnswer: 0
      }
    });
  });

  // Convert the map to an array of courses
  return Array.from(courseMap.entries()).map(([title, data], index) => ({
    id: `course-${index + 1}`,
    title,
    description: 'Lernen Sie die Grundlagen und fortgeschrittenen Konzepte',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
    level: 'starter',
    modules: Array.from(data.chapters.values())
  }));
}