import React from 'react';
import { Course } from '../types';
import { CourseProgress } from './CourseProgress';
import { Clock, BookOpen } from 'lucide-react';

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
      className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-shadow group"
    >
      <div className="relative">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <span className={`absolute bottom-4 left-4 px-3 py-1 rounded-full text-sm font-medium text-white ${
          course.level === 'starter' ? 'bg-green-500/80' :
          course.level === 'advanced' ? 'bg-amber-500/80' :
          'bg-red-500/80'
        }`}>
          {course.level === 'starter' ? 'Einsteiger' :
           course.level === 'advanced' ? 'Fortgeschritten' :
           'Profi'}
        </span>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-3">{course.title}</h3>
        <p className="text-gray-600 mb-4">{course.description}</p>
        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <BookOpen className="w-4 h-4 mr-1" />
            <span>{totalLessons} Lektionen</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>{totalDuration} Min.</span>
          </div>
        </div>
        <CourseProgress course={course} />
      </div>
    </div>
  );
};