import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Award, Clock, Lock, Image, CheckCircle2, ChevronLeft } from 'lucide-react';
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
            try {
              await startCourse(courseId);
              const lessonProgress = await getLessonProgress(courseId);
              setProgress(lessonProgress);
            } catch (err) {
              console.error('Error tracking course progress:', err);
              // Don't throw here - we still want to show the course even if progress tracking fails
            }
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

  const totalLessons = course.Kapitel.reduce(
    (sum, chapter) => sum + chapter.Lektionen.length,
    0
  );
  
  const completedLessons = progress.length;
  const progressPercentage = (completedLessons / totalLessons) * 100;

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-16 flex items-center">
            <Link
              to="/courses"
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Alle Kurse
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-8">
        {/* Course Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start gap-6">
            <img
              src={course.Ev4v[0]}
              alt={course.LVxv}
              className="w-32 h-32 rounded-lg object-cover shadow-sm flex-shrink-0"
            />
            <div className="flex-grow min-w-0">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {course.LVxv}
              </h1>
              <div className="flex items-center gap-3 mb-4">
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
                <span className="text-sm text-gray-500">
                  {course.Kapitel.length} Kapitel • {totalLessons} Lektionen
                </span>
              </div>
              
              <p className="text-gray-600 mb-6">
                <span className="text-sm">{course['6lhR']}</span>
              </p>

              {/* Progress bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Fortschritt</span>
                  <span className="font-medium">{Math.round(progressPercentage)}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`${getThemeClass(theme.colors.primary)} h-full transition-all duration-300 ease-in-out`}
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                <div className="text-sm text-gray-500">
                  {completedLessons} von {totalLessons} Lektionen abgeschlossen
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chapter List */}
        <div className="mt-8 space-y-6">
          {course.Kapitel.map((chapter) => (
            <div key={chapter['0000']} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">
                  {chapter['0Gbu']}. {chapter.zrXG}
                </h2>
              </div>
              
              <div className="divide-y divide-gray-100">
                {chapter.Lektionen.map((lesson) => {
                  const isCompleted = progress.some(p => p.lessonId === lesson['0000']);
                  
                  return (
                    <Link
                      key={lesson['0000']}
                      to={`/courses/${courseId}/lessons/${lesson['0000']}`}
                      className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                    >
                      {/* Lesson Image */}
                      {lesson.m9wb[0] ? (
                        <img
                          src={lesson.m9wb[0]}
                          alt={lesson['920y']}
                          className="w-20 h-14 rounded object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-20 h-14 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                          <Image className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm text-gray-500">
                            {chapter['0Gbu']}.{lesson.yt6Q}
                          </span>
                          <h3 className="text-base font-medium text-gray-900 truncate mb-1 flex items-center gap-2">
                            {lesson['920y']}
                            {isCompleted && (
                              <span className="text-emerald-500 flex-shrink-0">
                                <CheckCircle2 className="w-4 h-4" />
                              </span>
                            )}
                          </h3>
                        </div>

                        <div className="flex items-center gap-3 text-sm">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            lesson['2lEO'] === '789462'
                              ? 'bg-green-100 text-green-800'
                              : lesson['2lEO'] === '394309'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            <Award className="w-3 h-3 mr-1" />
                            {lesson['2lEO'] === '789462' ? 'Starter' : lesson['2lEO'] === '394309' ? 'Fortgeschritten' : 'Experte'}
                          </span>
                          <span className="flex items-center text-gray-500">
                            <Clock className="w-4 h-4 mr-1" />
                            {lesson.azCf} min
                          </span>

                          {lesson['UijR'] === 'premium' && (
                            <span className="inline-flex items-center text-yellow-600">
                              <Lock className="w-4 h-4 mr-1" />
                              Premium
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}