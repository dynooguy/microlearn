import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Award, Clock, Lock, Image, BookOpen } from 'lucide-react';
import { fetchCourseData } from '../../services/seatable';
import { getLessonProgress, startCourse } from '../../services/progress';
import { useAtom } from 'jotai';
import { themeAtom, getThemeClass } from '../../lib/theme';
import type { Course } from '../../types/seatable';
import type { LessonProgress } from '../../services/progress';

export function CourseDetails() {
  const [theme] = useAtom(themeAtom);
  const { courseId } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [progress, setProgress] = useState<LessonProgress[]>([]);

  useEffect(() => {
    async function loadCourse() {
      try {
        const data = await fetchCourseData();
        const courseTable = data.tables.find(t => t.name === 'Kurse');
        if (courseTable) {
          const foundCourse = courseTable.rows.find(c => c['0000'] === courseId) as Course;
          if (foundCourse) {
            setCourse(foundCourse);
            await startCourse(courseId);
            const lessonProgress = await getLessonProgress(courseId);
            setProgress(lessonProgress);
          } else {
            throw new Error('Course not found');
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load course'));
      } finally {
        setLoading(false);
      }
    }

    loadCourse();
  }, [courseId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${getThemeClass(theme.colors.primary, 'border')}`} aria-label="Laden..." />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        Fehler: {error?.message || 'Kurs nicht gefunden'}
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <img
            className="h-16 w-16 rounded-lg object-cover shadow-sm"
            src={course.Ev4v[0]}
            alt={course.LVxv}
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {course.LVxv}
            </h1>
            <div className="flex items-center mt-2">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                course.Rfrz === '840548'
                  ? 'bg-green-100 text-green-800'
                  : course.Rfrz === '194107'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-purple-100 text-purple-800'
              }`}>
                <Award className="w-3 h-3 mr-1" />
                {course.Rfrz === '840548' ? 'Starter' : course.Rfrz === '194107' ? 'Fortgeschritten' : 'Experte'}
              </span>
            </div>
          </div>
        </div>
        <p className="text-gray-600 max-w-3xl mt-4">
          {course['6lhR']}
        </p>
      </div>
      
      <div className="pl-6 space-y-6">
        {course.Kapitel.map((chapter) => (
          <div key={chapter['0000']} className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {chapter['0Gbu']}. {chapter.zrXG}
            </h2>
            
            <div className="pl-6 space-y-3">
              {chapter.Lektionen.map((lesson) => (
                <Link
                  key={lesson['0000']}
                  to={`/courses/${courseId}/lessons/${lesson['0000']}`}
                  className="group block hover:bg-gray-50 rounded-lg p-4 -ml-2 transition-colors"
                >
                  <div className="flex gap-4">
                    {/* Lesson Image */}
                    {lesson.m9wb[0] ? (
                      <img
                        src={lesson.m9wb[0]}
                        alt={lesson['920y']}
                        className="w-24 h-16 rounded object-cover flex-shrink-0"
                      />
                    ) : (
                      <div className="w-24 h-16 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <Image className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    
                    <div className="flex-grow min-w-0">
                      {/* Title and Badges */}
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-500">
                          {chapter['0Gbu']}.{lesson.yt6Q}
                        </span>
                        <h3 className="text-lg font-medium text-gray-900">
                          {lesson['920y']}
                        </h3>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                        {lesson.pg3S.text}
                      </p>

                      {/* Meta Information */}
                      <div className="flex items-center gap-3 text-sm">
                        {/* Duration */}
                        <span className="flex items-center text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          {lesson.azCf} min
                        </span>

                        {/* Level */}
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          lesson['2lEO'] === '789462'
                            ? 'bg-green-100 text-green-800'
                            : lesson['2lEO'] === '394309'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          <Award className="w-3 h-3 mr-1" />
                          {lesson['2lEO'] === '789462' ? 'Starter' : lesson['2lEO'] === '394309' ? 'Fortgeschritten' : 'Experte'}
                        </span>

                        {/* Premium/Free Badge */}
                        {lesson['UijR'] === 'premium' && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            <Lock className="w-3 h-3 mr-1" />
                            Premium
                          </span>
                        )}

                        {/* Completion Status */}
                        {progress.some(p => p.lessonId === lesson['0000']) && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            <BookOpen className="w-3 h-3 mr-1" />
                            Abgeschlossen
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}