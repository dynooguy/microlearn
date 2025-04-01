import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Award, Clock, ChevronRight, Trash2, Key } from 'lucide-react';
import { fetchCourseData } from '../services/seatable';
import { getLearningPaths, deleteLearningPath, saveLearningPath, type LearningPath } from '../services/learningPaths';
import { Button } from './ui/Button';
import { AccessCodeForm } from './AccessCodeForm';
import type { Course, Lesson } from '../types/seatable';

interface FlatLesson extends Lesson {
  courseId: string;
  courseName: string;
  chapterName: string;
  chapterNumber: number;
  lessonNumber: number;
}

export function LearningPath() {
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [lessons, setLessons] = useState<FlatLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [selectedPathId, setSelectedPathId] = useState<string | null>(null);
  const [showCodeForm, setShowCodeForm] = useState(false);

  const loadPaths = async () => {
    try {
      const userPaths = await getLearningPaths();
      setPaths(userPaths);
      
      // Select the most recent path by default
      if (userPaths.length > 0) {
        setSelectedPathId(userPaths[0].id);
      }
    } catch (err) {
      console.error('Error loading paths:', err);
    }
  };

  const handleCodeSuccess = async (code: string, name: string, lessonIds: string[]) => {
    try {
      const newPath = await saveLearningPath({
        name,
        lesson_ids: lessonIds,
        access_code: code
      });
      
      // Update paths and select the new one
      await loadPaths();
      setShowCodeForm(false);
    } catch (err) {
      console.error('Error saving learning path:', err);
    }
  };

  const selectedPath = useMemo(
    () => paths.find(p => p.id === selectedPathId),
    [paths, selectedPathId]
  );

  useEffect(() => {
    async function loadLessons() {
      try {
        await loadPaths();

        if (!selectedPath) return;

        const data = await fetchCourseData();
        const courseTable = data.tables.find(t => t.name === 'Kurse');
        
        if (courseTable) {
          const flatLessons: FlatLesson[] = [];
          
          (courseTable.rows as Course[]).forEach(course => {
            course.Kapitel.forEach(chapter => {
              chapter.Lektionen.forEach(lesson => {
                if (selectedPath.lesson_ids.includes(lesson['0000'])) {
                  flatLessons.push({
                    ...lesson,
                    courseId: course['0000'],
                    courseName: course.LVxv,
                    chapterName: chapter.zrXG,
                    chapterNumber: chapter['0Gbu'],
                    lessonNumber: lesson.yt6Q
                  });
                }
              });
            });
          });

          setLessons(flatLessons.sort((a, b) => {
            // Sort by course name, then chapter number, then lesson number
            if (a.courseName !== b.courseName) return a.courseName.localeCompare(b.courseName);
            if (a.chapterNumber !== b.chapterNumber) return a.chapterNumber - b.chapterNumber;
            return a.lessonNumber - b.lessonNumber;
          }));
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load lessons'));
      } finally {
        setLoading(false);
      }
    }

    loadLessons();
  }, [selectedPathId]);

  const handleDeletePath = async (id: string) => {
    try {
      await deleteLearningPath(id);
      setPaths(paths.filter(p => p.id !== id));
      
      // If we deleted the selected path, select the next available one
      if (id === selectedPathId) {
        const remainingPaths = paths.filter(p => p.id !== id);
        setSelectedPathId(remainingPaths.length > 0 ? remainingPaths[0].id : null);
      }
    } catch (err) {
      console.error('Error deleting learning path:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        {error.message}
      </div>
    );
  }

  if (lessons.length === 0) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Noch keine Lernpfade vorhanden
        </h2>
        <p className="text-gray-600">
          Lösen Sie einen Code ein, um Ihren ersten Lernpfad zu erstellen.
        </p>
        <Button
          onClick={() => setShowCodeForm(true)}
          className="mt-4"
        >
          <Key className="w-4 h-4 mr-2" />
          Code einlösen
        </Button>
        
        {showCodeForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="relative w-full max-w-md">
              <button
                onClick={() => setShowCodeForm(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                type="button"
                type="button"
              >
                ×
              </button>
              <AccessCodeForm onSuccess={handleCodeSuccess} />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Deine Lernpfade</h1>
        <Button onClick={() => setShowCodeForm(true)}>
          <Key className="w-4 h-4 mr-2" />
          Code einlösen
        </Button>
      </div>
      
      {showCodeForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="relative w-full max-w-md">
            <button
              onClick={() => setShowCodeForm(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              ×
            </button>
            <AccessCodeForm onSuccess={() => setShowCodeForm(false)} />
          </div>
        </div>
      )}

      {/* Path selector */}
      {paths.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h2 className="text-lg font-semibold mb-4">Verfügbare Lernpfade</h2>
          <div className="space-y-2">
            {paths.map(path => (
              <div
                key={path.id}
                className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                  path.id === selectedPathId
                    ? 'bg-indigo-50 border border-indigo-200'
                    : 'hover:bg-gray-50 border border-transparent'
                }`}
                onClick={() => setSelectedPathId(path.id)}
              >
                <div>
                  <h3 className="font-medium">{path.name}</h3>
                  <p className="text-sm text-gray-500">
                    {path.lesson_ids.length} Lektionen
                  </p>
                </div>
                <Button
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeletePath(path.id);
                  }}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="space-y-6">
        {lessons.map((lesson) => (
          <Link
            key={lesson['0000']}
            to={`/courses/${lesson.courseId}/lessons/${lesson['0000']}`}
            state={{ fromLearningPath: true }}
            className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="p-4 flex items-center gap-4">
              {lesson.m9wb[0] ? (
                <img
                  src={lesson.m9wb[0]}
                  alt={lesson['920y']}
                  className="w-24 h-16 rounded object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-24 h-16 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                  <Award className="w-8 h-8 text-gray-400" />
                </div>
              )}

              <div className="flex-grow min-w-0">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <span>{lesson.courseName}</span>
                  <span>•</span>
                  <span>Kapitel {lesson.chapterNumber}</span>
                  <span>•</span>
                  <span>Lektion {lesson.lessonNumber}</span>
                </div>

                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  {lesson['920y']}
                </h2>

                <div className="flex items-center gap-4 text-sm">
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
                </div>
              </div>

              <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}