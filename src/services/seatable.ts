import type { Course, Chapter, Lesson, SeatableResponse } from '../types/seatable';

const SEATABLE_BASE_URL = import.meta.env.VITE_SEATABLE_BASE_URL;
const SEATABLE_BASE_ID = import.meta.env.VITE_SEATABLE_BASE_ID;
const APP_ACCESS_TOKEN = import.meta.env.VITE_SEATABLE_APP_ACCESS_TOKEN;

if (!SEATABLE_BASE_URL || !SEATABLE_BASE_ID || !APP_ACCESS_TOKEN) {
  throw new Error('Missing required Seatable environment variables');
}

async function getBaseToken(): Promise<string> {
  try {
    const response = await fetch(`${SEATABLE_BASE_URL}/api/v2.1/dtable/app-access-token/`, {
      headers: {
        'accept': 'application/json',
        'authorization': `Bearer ${APP_ACCESS_TOKEN}`
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to get base token: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error getting base token:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to get base token');
  }
}

export async function fetchCourseData() {
  try {
    const baseToken = await getBaseToken();
    const response = await fetch(
      `${SEATABLE_BASE_URL}/api-gateway/api/v2/dtables/${SEATABLE_BASE_ID}`,
      {
        headers: {
          'accept': 'application/json',
          'authorization': `Bearer ${baseToken}`
        }
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch course data: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    
    if (!data || !data.tables) {
      console.error('Invalid response format:', data);
      throw new Error('Invalid response format from Seatable API');
    }

    // Get all tables
    const courseTable = data.tables.find(t => t._id === 'IH9A');  // Kurse
    const chapterTable = data.tables.find(t => t._id === 'n7qC'); // Kapitel
    const lessonTable = data.tables.find(t => t._id === 'DARI');  // Lektionen

    if (!courseTable || !chapterTable || !lessonTable) {
      console.error('Missing tables:', { courseTable, chapterTable, lessonTable });
      throw new Error('Required tables not found in response');
    }

    // Find the links between tables
    const courseChapterLink = data.links.find(l => l._id === 'Jitp');  // Kurse -> Kapitel
    const chapterLessonLink = data.links.find(l => l._id === 'W2rn');  // Kapitel -> Lektionen

    if (!courseChapterLink || !chapterLessonLink) {
      throw new Error('Required links not found in response');
    }

    // Create lookup maps for faster access
    const lessonMap = new Map(
      lessonTable.rows.map(lesson => [lesson._id, lesson as Lesson])
    );

    const chapterMap = new Map(
      chapterTable.rows.map(chapter => {
        const fullChapter = chapter as Chapter;
        
        // Get lessons for this chapter from the link
        const lessonIds = chapterLessonLink.table2_table1_map[chapter._id] || [];
        fullChapter.Lektionen = lessonIds
          .map(id => lessonMap.get(id))
          .filter((lesson): lesson is Lesson => lesson !== undefined)
          .sort((a, b) => a.yt6Q - b.yt6Q);
        
        return [chapter._id, fullChapter];
      })
    );

    // Build full course structure
    const courses = courseTable.rows.map(course => {
      const fullCourse = course as Course;

      // Attach chapters to courses
      const chapterIds = courseChapterLink.table1_table2_map[course._id] || [];
      fullCourse.Kapitel = chapterIds
        .map(id => chapterMap.get(id))
        .filter((chapter): chapter is Chapter => chapter !== undefined)
        .sort((a, b) => a['0Gbu'] - b['0Gbu']);

      // Ensure Ev4v is always an array
      if (!Array.isArray(fullCourse.Ev4v)) {
        fullCourse.Ev4v = [];
      }

      return fullCourse;
    });

    return {
      ...data,
      tables: [
        {
          name: 'Kurse',
          rows: courses
        }
      ]
    };
    
  } catch (error) {
    console.error('Error fetching course data:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to fetch course data');
  }
}