import { Course, Module, Lesson } from '../types';

const BASE_URL = 'https://cloud.seatable.io/api-gateway/api/v2/dtables/8af32dd2-2d2b-4307-a32a-88f041d5c8b2';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzY0NTcxMjQsImR0YWJsZV91dWlkIjoiOGFmMzJkZDItMmQyYi00MzA3LWEzMmEtODhmMDQxZDVjOGIyIiwicGVybWlzc2lvbiI6InJ3Iiwib3JnX2lkIjoyNzU0NCwib3duZXJfaWQiOiJhY2EwNjZiNmY0NTM0M2Q3YjZkMjQ1ZDZlMzBiN2ZmMkBhdXRoLmxvY2FsIiwiYXBwX25hbWUiOiJCb2x0Lm5ldyIsInVzZXJuYW1lIjoiIiwiaWRfaW5fb3JnIjoiIiwidXNlcl9kZXBhcnRtZW50X2lkc19tYXAiOnsiY3VycmVudF91c2VyX2RlcGFydG1lbnRfaWRzIjpbXSwiY3VycmVudF91c2VyX2RlcGFydG1lbnRfYW5kX3N1Yl9pZHMiOltdfX0.6kdp9t1v9RGlu2AVzbrKRlAItmCoSwSMYAJp4DA_ERg';

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
    // Filter out rows with zero IDs before processing
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
  // Group rows by course name
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

  // Convert to Course array
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