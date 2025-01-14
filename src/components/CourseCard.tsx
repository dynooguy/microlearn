import React from 'react';
import { Course } from '../types';
import { CourseProgress } from './CourseProgress';
import { 
  Clock, 
  BookOpen, 
  Lock,
  Euro
} from 'lucide-react';

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

  const isAccessible = course.access === 'free' || isLoggedIn;

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
      onClick={() => isAccessible && onClick(course)}
      className={`bg-white rounded-xl shadow-md overflow-hidden group relative
        ${isAccessible ? 'cursor-pointer hover:shadow-xl' : 'cursor-not-allowed opacity-75'}
        transition-all duration-300`}
    >
      <div className="relative">
        <img
          src={course.image}
          alt={course.title}
          className={`w-full h-48 object-cover 
            ${isAccessible ? 'group-hover:scale-105' : 'grayscale'} 
            transition-transform duration-300`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        
        {/* Level Badge */}
        <div className="absolute bottom-4 left-4">
          <span className="h-6 px-2 rounded-full flex items-center bg-gray-700/80">
            <LevelBars level={course.level} />
          </span>
        </div>

        {/* Premium Badge */}
        {course.access === 'paid' && (
          <div className="absolute top-4 right-4">
            <span className="h-6 w-6 flex items-center justify-center rounded-full bg-gray-700/80 text-white">
              <Euro className="w-3.5 h-3.5" />
            </span>
          </div>
        )}
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
      
      {!isAccessible && (
        <div className="absolute inset-0 bg-gray-900/10 backdrop-blur-[1px] flex items-center justify-center">
          <div className="bg-white/90 p-3 rounded-lg shadow-lg">
            <Lock className="w-5 h-5 text-gray-600" />
          </div>
        </div>
      )}
    </div>
  );
};