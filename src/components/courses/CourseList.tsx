import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAtom } from 'jotai';
import { fetchCourseData } from '../../services/seatable';
import { CourseCard } from './CourseCard';
import { themeAtom, getThemeClass } from '../../lib/theme';
import type { Course } from '../../types/seatable';

export function CourseList() {
  const [theme] = useAtom(themeAtom);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function loadCourses() {
      try {
        const data = await fetchCourseData();
        const courseTable = data.tables.find(t => t.name === 'Kurse');
        if (courseTable) {
          setCourses(courseTable.rows as Course[]);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load courses'));
      } finally {
        setLoading(false);
      }
    }

    loadCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${getThemeClass(theme.colors.primary, 'border')}`} aria-label="Laden..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        Fehler beim Laden der Kurse: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Verfügbare Kurse</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {courses.map((course) => (
          <Link key={course['0000']} to={`/courses/${course['0000']}`}>
            <CourseCard course={course} />
          </Link>
        ))}
      </div>
    </div>
  );
}