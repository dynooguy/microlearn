import React, { useState } from 'react';
import { GraduationCap } from 'lucide-react';
import { CourseList } from './components/CourseList';
import { CourseView } from './components/CourseView';
import { Modal } from './components/Modal';
import { LessonContent } from './components/LessonContent';
import { courses as initialCourses } from './data/courses';
import { Course, Lesson } from './types';

function App() {
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

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

export default App;