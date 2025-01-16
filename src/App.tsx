import React, { useState, useEffect } from 'react';
import { GraduationCap, LogOut, LogIn, UserCircle } from 'lucide-react';
import { CourseList } from './components/CourseList';
import { CourseView } from './components/CourseView';
import { Modal } from './components/Modal';
import { LessonContent } from './components/LessonContent';
import { AuthModal } from './components/AuthModal';
import { UserProfile } from './components/UserProfile';
import { Course, Lesson } from './types';
import { courses as staticCourses } from './data/courses';
import { useAuth } from './hooks/useAuth';
import { supabase } from './lib/supabase';

export default function App() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { user, signIn, signUp, signOut } = useAuth();

  // Load courses when component mounts
  useEffect(() => {
    loadCourses();
  }, []);

  // Load user progress whenever user changes or courses are loaded
  useEffect(() => {
    if (user && courses.length > 0) {
      loadUserProgress();
    }
  }, [user, courses]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      setCourses(staticCourses);
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
      console.log('Loading user progress for user:', user.id);
      const { data: progress, error: progressError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id);

      if (progressError) {
        throw progressError;
      }

      console.log('Received progress data:', progress);

      if (progress) {
        setCourses(prevCourses =>
          prevCourses.map(course => ({
            ...course,
            modules: course.modules.map(module => ({
              ...module,
              lessons: module.lessons.map(lesson => {
                const lessonProgress = progress.find(
                  p => p.lesson_id === lesson.id && p.module_id === module.id
                );
                return {
                  ...lesson,
                  completed: lessonProgress?.completed || false
                };
              })
            }))
          }))
        );
      }
    } catch (err) {
      console.error('Error loading user progress:', err);
      setError('Fehler beim Laden des Lernfortschritts.');
    }
  };

  const handleLessonComplete = async (lessonId: string, moduleId: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    try {
      const { error } = await supabase
        .from('user_progress')
        .upsert({
          user_id: user.id,
          lesson_id: lessonId,
          module_id: moduleId,
          completed: true,
          completion_date: new Date().toISOString()
        }, {
          onConflict: 'user_id,lesson_id,module_id'
        });

      if (error) throw error;

      // Update local state
      setCourses(prevCourses =>
        prevCourses.map(course => ({
          ...course,
          modules: course.modules.map(module => ({
            ...module,
            lessons: module.lessons.map(lesson =>
              lesson.id === lessonId && module.id === moduleId
                ? { ...lesson, completed: true }
                : lesson
            )
          }))
        }))
      );
    } catch (err) {
      console.error('Error saving progress:', err);
      setError('Fehler beim Speichern des Fortschritts.');
    }
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
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src="https://www.adlx.de/images/Logo_ADLX_schwarz-gelb.png" 
                alt="ADLX Logo" 
                className="h-8"
              />
            </div>
            <div className="flex items-center space-x-4">
              {user && (
                <button
                  onClick={() => setShowProfile(true)}
                  className="flex items-center space-x-2 px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  <UserCircle className="w-4 h-4" />
                  <span>Profil</span>
                </button>
              )}
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
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {showProfile && user ? (
          <UserProfile
            email={user.email || ''}
            onSignOut={signOut}
            onClose={() => setShowProfile(false)}
            courses={courses}
          />
        ) : selectedCourse ? (
          <CourseView
            course={selectedCourse}
            onBack={() => setSelectedCourse(null)}
            onComplete={handleLessonComplete}
            onViewLesson={setSelectedLesson}
            isLoggedIn={!!user}
          />
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Verfügbare Kurse</h2>
            <CourseList
              courses={courses}
              onSelectCourse={setSelectedCourse}
              isLoggedIn={!!user}
            />
          </>
        )}
      </main>

      <Modal
        isOpen={selectedLesson !== null}
        onClose={() => setSelectedLesson(null)}
      >
        {selectedLesson && (
          <LessonContent
            lesson={selectedLesson}
            moduleId={selectedCourse?.modules.find(m => 
              m.lessons.some(l => l.id === selectedLesson.id)
            )?.id || ''}
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