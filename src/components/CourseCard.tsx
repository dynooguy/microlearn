import React from 'react';
import { Course } from '../types';
import { CourseProgress } from './CourseProgress';
import { Clock, BookOpen, BarChart2 } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  onClick: (course: Course) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onClick }) => {
  const totalLessons = course.modules.reduce(
    (acc, module) => acc + module.lessons.length,
    0
  );
  
  const totalDuration = course.modules.reduce(
    (acc, module) => acc + module.lessons.reduce((sum, lesson) => sum + lesson.duration, 0),
    0
  );

  return (
    <div
      onClick={() => onClick(course)}
      className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
    >
      <img
        src={course.image}
        alt={course.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-gray-800">{course.title}</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            course.level === 'starter' ? 'bg-green-100 text-green-800' :
            course.level === 'advanced' ? 'bg-yellow-100 text-yellow-800' :
            'bg-red-100 text-red-800'
          }`}>
            {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
          </span>
        </div>
        <p className="text-gray-600 mb-4">{course.description}</p>
        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <BookOpen className="w-4 h-4 mr-1" />
            <span>{totalLessons} lessons</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>{totalDuration} min</span>
          </div>
        </div>
        <CourseProgress course={course} />
      </div>
    </div>
  );
};