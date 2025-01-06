import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { ModuleCard } from './ModuleCard';
import { Course, Lesson } from '../types';

interface CourseViewProps {
  course: Course;
  onBack: () => void;
  onComplete: (lessonId: string) => void;
  onViewLesson: (lesson: Lesson) => void;
}

export const CourseView: React.FC<CourseViewProps> = ({
  course,
  onBack,
  onComplete,
  onViewLesson,
}) => {
  const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
  const completedLessons = course.modules.reduce(
    (acc, module) => acc + module.lessons.filter(l => l.completed).length,
    0
  );
  const progress = (completedLessons / totalLessons) * 100;

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-gray-800 mb-6"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Courses
      </button>

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">{course.title}</h2>
        <p className="text-gray-600 mb-4">{course.description}</p>
        <div className="bg-white rounded-lg p-4 shadow-sm">
          <div className="flex justify-between text-sm mb-2">
            <span>Course Progress</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="space-y-8">
        {course.modules.map((module) => (
          <ModuleCard
            key={module.id}
            module={module}
            onComplete={onComplete}
            onViewLesson={onViewLesson}
          />
        ))}
      </div>
    </div>
  );
};