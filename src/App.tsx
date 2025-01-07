import React, { useState, useEffect } from 'react';
import { GraduationCap, LogOut, LogIn } from 'lucide-react';
import { CourseList } from './components/CourseList';
import { CourseView } from './components/CourseView';
import { Modal } from './components/Modal';
import { LessonContent } from './components/LessonContent';
import { AuthModal } from './components/AuthModal';
import { Course, Lesson } from './types';
import { fetchCourses } from './api/seatable';
import { useAuth } from './hooks/useAuth';
import { supabase } from './lib/supabase';

export default function App() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user, signIn, signUp, signOut } = useAuth();

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (user) {
      loadUserProgress();
    }
  }, [user]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const fetchedCourses = await fetchCourses();
      setCourses(fetchedCourses);
    } catch (err) {
      setError('Fehler beim Laden der Kurse. Bitte versuchen Sie es später erneut.');
      console.error('Error loading courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadUserProgress = async () => {
    if (!user) return;

    try {
      const { data: progress, error: progressError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id);

      if (progressError) throw progressError;

      if (progress) {
        setCourses(prevCourses =>
          prevCourses.map(course => ({
            ...course,
            modules: course.modules.map(module => ({
              ...module,
              lessons: module.lessons.map(lesson => ({
                ...lesson,
                completed: progress.some(p => p.lesson_id === lesson.id && p.module_id === module.id && p.completed)
              }))
            }))
          }))
        );
      }
    } catch (err) {
      console.error('Error loading user progress:', err);
    }
  };

  const handleLessonComplete = async (lessonId: string, moduleId: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    try {
      const { error: upsertError } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          lesson_id: lessonId,
          module_id: moduleId,
          completed: true
        });

      if (upsertError) throw upsertError;

      setCourses(prevCourses =>
        prevCourses.map(course => ({
          ...course,
          modules: course.modules.map(module => ({
            ...module,
            lessons: module.lessons.map(lesson =>
              module.id === moduleId && lesson.id === lessonId
                ? { ...lesson, completed: true }
                : lesson
            )
          }))
        }))
      );

      setSelectedCourse(prevCourse => {
        if (!prevCourse) return null;
        return {
          ...prevCourse,
          modules: prevCourse.modules.map(module => ({
            ...module,
            lessons: module.lessons.map(lesson =>
              module.id === moduleId && lesson.id === lessonId
                ? { ...lesson, completed: true }
                : lesson
            )
          }))
        };
      });
    } catch (err) {
      console.error('Error saving progress:', err);
    }
  };

  const handleViewLesson = (lesson: Lesson, moduleId: string) => {
    setSelectedLesson(lesson);
    setSelectedModuleId(moduleId);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-gray-600">Kurse werden geladen...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <GraduationCap className="w-8 h-8 text-amber-600" />
              <h1 className="text-2xl font-bold text-gray-800">MicroLearn</h1>
            </div>
            <button
              onClick={user ? signOut : () => setShowAuthModal(true)}
              className="flex items-center space-x-2 px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
            >
              {user ? (
                <>
                  <LogOut className="w-4 h-4" />
                  <span>Abmelden</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Anmelden</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {selectedCourse ? (
          <CourseView
            course={selectedCourse}
            onBack={() => setSelectedCourse(null)}
            onComplete={handleLessonComplete}
            onViewLesson={(lesson, moduleId) => handleViewLesson(lesson, moduleId)}
          />
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Verfügbare Kurse</h2>
            <CourseList
              courses={courses}
              onSelectCourse={setSelectedCourse}
            />
          </>
        )}
      </main>

      <Modal
        isOpen={selectedLesson !== null}
        onClose={() => {
          setSelectedLesson(null);
          setSelectedModuleId(null);
        }}
      >
        {selectedLesson && selectedModuleId && (
          <LessonContent
            lesson={selectedLesson}
            moduleId={selectedModuleId}
            onComplete={handleLessonComplete}
          />
        )}
      </Modal>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSignIn={signIn}
        onSignUp={signUp}
      />
    </div>
  );
}