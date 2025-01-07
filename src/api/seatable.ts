import { Course, Module, Lesson } from '../types';

const SEATABLE_API_URL = 'https://cloud.seatable.io/api-gateway/api/v2/dtables/8af32dd2-2d2b-4307-a32a-88f041d5c8b2/rows/';
const SEATABLE_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzY0NTcxMjQsImR0YWJsZV91dWlkIjoiOGFmMzJkZDItMmQyYi00MzA3LWEzMmEtODhmMDQxZDVjOGIyIiwicGVybWlzc2lvbiI6InJ3Iiwib3JnX2lkIjoyNzU0NCwib3duZXJfaWQiOiJhY2EwNjZiNmY0NTM0M2Q3YjZkMjQ1ZDZlMzBiN2ZmMkBhdXRoLmxvY2FsIiwiYXBwX25hbWUiOiJCb2x0Lm5ldyIsInVzZXJuYW1lIjoiIiwiaWRfaW5fb3JnIjoiIiwidXNlcl9kZXBhcnRtZW50X2lkc19tYXAiOnsiY3VycmVudF91c2VyX2RlcGFydG1lbnRfaWRzIjpbXSwiY3VycmVudF91c2VyX2RlcGFydG1lbnRfYW5kX3N1Yl9pZHMiOltdfX0.6kdp9t1v9RGlu2AVzbrKRlAItmCoSwSMYAJp4DA_ERg';

interface SeaTableRow {
  '0000': string; // Course title
  zbA4: string; // Chapter ID
  '8rkj': string; // Chapter name
  KgmW: string; // Lesson ID
  Si03: string; // Lesson name
  '9fe1': string; // Lesson summary
  HjUA: string; // Lesson content
  EH60: string; // Lesson image
}

export async function fetchCourses(): Promise<Course[]> {
  try {
    const response = await fetch(`${SEATABLE_API_URL}?table_name=Kurs_Prompting`, {
      headers: {
        'Authorization': `Bearer ${SEATABLE_TOKEN}`,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch courses');
    }

    const data = await response.json();
    return transformSeaTableData(data.rows);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return [];
  }
}

function transformSeaTableData(rows: SeaTableRow[]): Course[] {
  const courseMap = new Map<string, Course>();
  const moduleMap = new Map<string, Module>();

  // First pass: Group by course titles
  rows.forEach(row => {
    const courseTitle = row['0000'];
    const chapterId = row.zbA4;
    const chapterName = row['8rkj'];
    
    // Create course if it doesn't exist
    if (!courseMap.has(courseTitle)) {
      courseMap.set(courseTitle, {
        id: courseTitle.toLowerCase().replace(/\s+/g, '-'),
        title: courseTitle,
        description: 'Interactive learning course',
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
        level: 'starter',
        modules: []
      });
    }

    // Create module if it doesn't exist
    const moduleKey = `${courseTitle}-${chapterId}`;
    if (!moduleMap.has(moduleKey)) {
      const newModule: Module = {
        id: chapterId,
        title: chapterName,
        description: `Chapter: ${chapterName}`,
        lessons: []
      };
      moduleMap.set(moduleKey, newModule);
      courseMap.get(courseTitle)?.modules.push(newModule);
    }

    // Add lesson to module
    const lesson: Lesson = {
      id: row.KgmW,
      title: row.Si03,
      description: row['9fe1'] || 'No description available',
      duration: 10,
      completed: false,
      content: row.HjUA || '',
      image: row.EH60,
      quiz: {
        question: "What did you learn from this lesson?",
        options: [
          "I understood everything",
          "I need to review some parts",
          "I need more practice",
          "I'm not sure"
        ],
        correctAnswer: 0
      }
    };
    
    moduleMap.get(moduleKey)?.lessons.push(lesson);
  });

  return Array.from(courseMap.values());
}