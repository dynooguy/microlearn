import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { ModuleCard } from './ModuleCard';
import { Course, Lesson } from '../types';

interface CourseViewProps {
  course: Course;
  onBack: () => void;
  onComplete: (lessonId: string, moduleId: string) => void;
  onViewLesson: (lesson: Lesson) => void;
  isLoggedIn: boolean;
}

export const CourseView: React.FC<CourseViewProps> = ({
  course,
  onBack,
  onComplete,
  onViewLesson,
  isLoggedIn
}) => {
  const totalLessons = course.modules.reduce(
    (acc, module) => acc + module.lessons.length,
    0
  );
  const completedLessons = course.modules.reduce(
    (acc, module) => acc + module.lessons.filter(l => l.completed).length,
    0
  );
  const progress = totalLessons === 0 ? 0 : (completedLessons / totalLessons) * 100;

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Zurück zur Kursübersicht
      </button>

      <div className="mb-8">
        <div className="relative h-64 rounded-xl overflow-hidden mb-6">
          <img
            src={course.image}
            alt={course.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
            <h2 className="text-3xl font-bold mb-2">{course.title}</h2>
            <p className="text-white/90">{course.description}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-800">Kursfortschritt</h3>
            <span className="text-lg font-bold text-gray-600">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-4">
            <div
              className="h-4 rounded-full transition-all duration-300 relative"
              style={{ width: `${progress}%`, backgroundColor: '#157535' }}
            >
              <div className="absolute inset-0 rounded-full animate-pulse" style={{ backgroundColor: 'rgba(102, 102, 102, 0.3)' }}></div>
            </div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {completedLessons} von {totalLessons} Lektionen abgeschlossen
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {course.modules.map((module) => (
          <ModuleCard
            key={module.id}
            module={module}
            onComplete={onComplete}
            onViewLesson={onViewLesson}
            isLoggedIn={isLoggedIn}
          />
        ))}
      </div>
    </div>
  );
};