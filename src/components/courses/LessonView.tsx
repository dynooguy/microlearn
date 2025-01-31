import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { formatMarkdown } from '../../lib/markdown';
import { fetchCourseData } from '../../services/seatable';
import { Button } from '../ui/Button';
import { completeLesson, getLessonProgress } from '../../services/progress';
import type { Course, Lesson } from '../../types/seatable';
import type { LessonProgress } from '../../services/progress';

export function LessonView() {
  const { courseId, lessonId } = useParams();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [progress, setProgress] = useState<LessonProgress[]>([]);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    async function loadLesson() {
      try {
        const data = await fetchCourseData();
        const courseTable = data.tables.find(t => t.name === 'Kurse');
        if (courseTable) {
          const course = courseTable.rows.find(c => c['0000'] === courseId) as Course;
          if (course) {
            setCourse(course);
            for (const chapter of course.Kapitel) {
              const foundLesson = chapter.Lektionen.find(l => l['0000'] === lessonId);
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
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to={`/courses/${courseId}`}
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Zurück zum Kurs
        </Link>

        <Button
          onClick={handleComplete}
          disabled={completing || isCompleted}
          variant={isCompleted ? 'outline' : 'default'}
          size="sm"
          className="inline-flex items-center"
        >
          <Check className="w-4 h-4 mr-1" />
          {isCompleted ? 'Abgeschlossen' : completing ? 'Wird abgeschlossen...' : 'Als abgeschlossen markieren'}
        </Button>
      </div>

      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">
          {lesson['920y']}
        </h1>
        <p className="text-lg text-gray-600">
          {lesson.pg3S.text}
        </p>
      </div>

      {lesson.m9wb[0] && (
        <img
          src={lesson.m9wb[0]}
          alt={lesson['920y']}
          className="w-full rounded-lg shadow-lg"
        />
      )}

      <div className="prose prose-lg max-w-none">
        <div dangerouslySetInnerHTML={{ __html: formatMarkdown(lesson.y1X4.text) }} />
      </div>
    </div>
  );
}