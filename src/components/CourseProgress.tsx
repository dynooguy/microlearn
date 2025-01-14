import React from 'react';
import { Course } from '../types';

interface CourseProgressProps {
  course: Course;
}

export const CourseProgress: React.FC<CourseProgressProps> = ({ course }) => {
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
    <div className="mt-4">
      <div className="flex justify-between text-sm text-gray-600 mb-1">
        <span>{completedLessons} von {totalLessons} Lektionen abgeschlossen</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%`, backgroundColor: '#666666' }}
        />
      </div>
    </div>
  );
};