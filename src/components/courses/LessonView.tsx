import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Check, ChevronLeft } from 'lucide-react';
import { formatMarkdown } from '../../lib/markdown';
import { fetchCourseData } from '../../services/seatable';
import { Button } from '../ui/Button';
import { completeLesson, getLessonProgress } from '../../services/progress';
import { useAtom } from 'jotai';
import { themeAtom, getThemeClass } from '../../lib/theme';
import type { Course, Lesson } from '../../types/seatable';
import type { LessonProgress } from '../../services/progress';

export function LessonView() {
  const [theme] = useAtom(themeAtom);
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(-1);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(-1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [progress, setProgress] = useState<LessonProgress[]>([]);
  const [completing, setCompleting] = useState(false);

  // Find adjacent lessons for navigation
  const findAdjacentLessons = () => {
    if (!course || currentChapterIndex === -1 || currentLessonIndex === -1) {
      return { prev: null, next: null };
    }

    const currentChapter = course.Kapitel[currentChapterIndex];
    let prev = null;
    let next = null;

    // Previous lesson
    if (currentLessonIndex > 0) {
      prev = currentChapter.Lektionen[currentLessonIndex - 1];
    } else if (currentChapterIndex > 0) {
      const prevChapter = course.Kapitel[currentChapterIndex - 1];
      prev = prevChapter.Lektionen[prevChapter.Lektionen.length - 1];
    }

    // Next lesson
    if (currentLessonIndex < currentChapter.Lektionen.length - 1) {
      next = currentChapter.Lektionen[currentLessonIndex + 1];
    } else if (currentChapterIndex < course.Kapitel.length - 1) {
      next = course.Kapitel[currentChapterIndex + 1].Lektionen[0];
    }

    return { prev, next };
  };

  useEffect(() => {
    async function loadLesson() {
      try {
        const data = await fetchCourseData();
        const courseTable = data.tables.find(t => t.name === 'Kurse');
        if (courseTable) {
          const course = courseTable.rows.find(c => c['0000'] === courseId) as Course;
          if (course) {
            setCourse(course);
            for (let chapterIndex = 0; chapterIndex < course.Kapitel.length; chapterIndex++) {
              const chapter = course.Kapitel[chapterIndex];
              const lessonIndex = chapter.Lektionen.findIndex(l => l['0000'] === lessonId);
              const foundLesson = chapter.Lektionen.find(l => l['0000'] === lessonId);
              if (lessonIndex !== -1) {
                setCurrentChapterIndex(chapterIndex);
                setCurrentLessonIndex(lessonIndex);
              }
              if (foundLesson) {
                setLesson(foundLesson);
                return;
              }
            }
            throw new Error('Lesson not found');
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load lesson'));
      } finally {
        setLoading(false);
      }
    }

    async function loadProgress() {
      if (courseId) {
        const lessonProgress = await getLessonProgress(courseId);
        setProgress(lessonProgress);
      }
    }

    loadLesson();
    loadProgress();
  }, [courseId, lessonId]);

  const handleComplete = async () => {
    if (!courseId || !lessonId || completing) return;
    
    setCompleting(true);
    try {
      await completeLesson(courseId, lessonId);
      const updatedProgress = await getLessonProgress(courseId);
      setProgress(updatedProgress);
    } catch (err) {
      console.error('Error completing lesson:', err);
    } finally {
      setCompleting(false);
    }
  };

  const isCompleted = progress.some(p => p.lessonId === lessonId);
  const { prev, next } = findAdjacentLessons();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" aria-label="Laden..." />
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        Fehler: {error?.message || 'Lektion nicht gefunden'}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 bg-white border-b border-gray-200 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-16 flex items-center justify-between gap-4">
            <Link
              to={`/courses/${courseId}`}
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Zurück zum Kurs
            </Link>

            <div className="flex items-center gap-2">
              {prev && (
                <Button
                  onClick={() => navigate(`/courses/${courseId}/lessons/${prev['0000']}`)}
                  variant="outline"
                  size="sm"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Vorherige Lektion
                </Button>
              )}
              
              <Button
                onClick={handleComplete}
                disabled={completing || isCompleted}
                variant={isCompleted ? 'outline' : 'default'}
                size="sm"
              >
                <Check className="w-4 h-4 mr-1" />
                {isCompleted ? 'Abgeschlossen' : completing ? 'Wird abgeschlossen...' : 'Abschließen'}
              </Button>

              {next && (
                <Button
                  onClick={() => navigate(`/courses/${courseId}/lessons/${next['0000']}`)}
                  variant="default"
                  size="sm"
                >
                  Nächste Lektion
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-8 space-y-8">
        {/* Course Image and Title */}
        <div className="flex items-start gap-6">
          {lesson.m9wb[0] && (
            <img
              src={lesson.m9wb[0]}
              alt={lesson['920y']}
              className="w-32 h-32 rounded-lg object-cover shadow-sm flex-shrink-0"
            />
          )}
          
          <div className="flex-grow min-w-0">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <span>Kapitel {currentChapterIndex + 1}</span>
              <span>•</span>
              <span>Lektion {currentLessonIndex + 1}</span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              {lesson['920y']}
            </h1>
            <p className="text-sm text-gray-500 line-clamp-2">
              {lesson.pg3S.text}
            </p>
          </div>
        </div>

        {/* Lesson Content */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className={`prose prose-lg max-w-none prose-headings:${getThemeClass(theme.colors.primary, 'text')} prose-a:${getThemeClass(theme.colors.primary, 'text')}`}>
            <div
              dangerouslySetInnerHTML={{ __html: formatMarkdown(lesson.y1X4.text, true) }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}