import React from 'react';
import { Course } from '../types';
import { CourseProgress } from './CourseProgress';
import { Clock, BookOpen } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  onClick: (course: Course) => void;
  isLoggedIn: boolean;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onClick, isLoggedIn }) => {
  const totalLessons = course.modules.reduce(
    (acc, module) => acc + module.lessons.length,
    0
  );
  
  const totalDuration = course.modules.reduce(
    (acc, module) => acc + module.lessons.reduce((sum, lesson) => sum + lesson.duration, 0),
    0
  );

  const LevelBars = ({ level }: { level: Course['level'] }) => {
    return (
      <div className="flex items-end gap-0.5 h-4">
        <div
          className={`w-1 h-2 rounded-sm transition-all ${
            level === 'starter' || level === 'advanced' || level === 'professional'
              ? 'bg-white'
              : 'bg-white/30'
          }`}
        />
        <div
          className={`w-1 h-3 rounded-sm transition-all ${
            level === 'advanced' || level === 'professional'
              ? 'bg-white'
              : 'bg-white/30'
          }`}
        />
        <div
          className={`w-1 h-4 rounded-sm transition-all ${
            level === 'professional'
              ? 'bg-white'
              : 'bg-white/30'
          }`}
        />
      </div>
    );
  };

  return (
    <div
      onClick={() => onClick(course)}
      className="bg-white rounded-xl shadow-md overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300 flex flex-col h-full"
    >
      <div className="relative">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Level Badge */}
        <div className="absolute bottom-4 left-4">
          <span className="h-6 px-2 rounded-full flex items-center bg-gray-700/80">
            <LevelBars level={course.level} />
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex-grow">
          <h3 className="text-xl font-bold text-gray-800 mb-3">{course.title}</h3>
          <p className="text-gray-600">{course.description}</p>
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-100">
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
    </div>
  );
};