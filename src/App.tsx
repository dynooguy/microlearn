import React, { useState, useEffect } from 'react';
import { GraduationCap } from 'lucide-react';
import { CourseList } from './components/CourseList';
import { CourseView } from './components/CourseView';
import { Modal } from './components/Modal';
import { LessonContent } from './components/LessonContent';
import { Course, Lesson } from './types';
import { fetchCourses } from './api/seatable';

export default function App() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const fetchedCourses = await fetchCourses();
      setCourses(fetchedCourses);
    } catch (err) {
      setError('Failed to load courses. Please try again later.');
      console.error('Error loading courses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLessonComplete = (lessonId: string) => {
    setCourses(prevCourses =>
      prevCourses.map(course => ({
        ...course,
        modules: course.modules.map(module => ({
          ...module,
          lessons: module.lessons.map(lesson =>
            lesson.id === lessonId
              ? { ...lesson, completed: true }
              : lesson
          ),
        })),
      }))
    );

    setSelectedCourse(prevCourse => {
      if (!prevCourse) return null;
      return {
        ...prevCourse,
        modules: prevCourse.modules.map(module => ({
          ...module,
          lessons: module.lessons.map(lesson =>
            lesson.id === lessonId
              ? { ...lesson, completed: true }
              : lesson
          ),
        })),
      };
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-gray-600">Loading courses...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center space-x-3">
            <GraduationCap className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">MicroLearn</h1>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {selectedCourse ? (
          <CourseView
            course={selectedCourse}
            onBack={() => setSelectedCourse(null)}
            onComplete={handleLessonComplete}
            onViewLesson={setSelectedLesson}
          />
        ) : (
          <>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Available Courses</h2>
            <CourseList
              courses={courses}
              onSelectCourse={setSelectedCourse}
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
            onComplete={handleLessonComplete}
          />
        )}
      </Modal>
    </div>
  );
}