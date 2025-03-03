import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './lib/supabase';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { AuthForm } from './components/auth/AuthForm';
import { CourseList } from './components/courses/CourseList';
import { CourseDetails } from './components/courses/CourseDetails';
import { LessonView } from './components/courses/LessonView';
import { Profile } from './components/profile/Profile';

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        {session ? (
          <>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-grow w-full max-w-7xl mx-auto py-4 px-4 sm:py-6 sm:px-6 lg:px-8">
                <Routes>
                  <Route path="/" element={<Navigate to="/courses" replace />} />
                  <Route path="/courses" element={<CourseList />} />
                  <Route path="/courses/:courseId" element={<CourseDetails />} />
                  <Route path="/courses/:courseId/lessons/:lessonId" element={<LessonView />} />
                  <Route path="/profile" element={<Profile />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </>
        ) : (
          <div className="min-h-screen flex items-center justify-center px-4">
            <AuthForm />
          </div>
        )}
      </div>
    </BrowserRouter>
  );
}

export default App;