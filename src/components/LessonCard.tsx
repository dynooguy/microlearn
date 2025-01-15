import React, { useState } from 'react';
import { Clock, Eye, CheckCircle, Lock } from 'lucide-react';
import { Lesson } from '../types';

interface LessonCardProps {
  lesson: Lesson;
  moduleId: string;
  onComplete: (lessonId: string, moduleId: string) => void;
  onView: (lesson: Lesson) => void;
  isLoggedIn: boolean;
}

export const LessonCard: React.FC<LessonCardProps> = ({ 
  lesson, 
  moduleId, 
  onComplete, 
  onView,
  isLoggedIn 
}) => {
  const [isCompleted, setIsCompleted] = useState(lesson.completed);

  const handleComplete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isCompleted) {
      setIsCompleted(true);
      onComplete(lesson.id, moduleId);
    }
  };

  const isAccessible = lesson.access === 'free' || (isLoggedIn && lesson.access === 'premium');

  const LevelBars = ({ level }: { level: Lesson['level'] }) => {
    return (
      <div className="flex items-end gap-0.5 h-4">
        <div
          className={`w-1 h-2 rounded-sm transition-all ${
            level === 'starter' || level === 'advanced' || level === 'professional'
              ? 'bg-gray-600'
              : 'bg-gray-300'
          }`}
        />
        <div
          className={`w-1 h-3 rounded-sm transition-all ${
            level === 'advanced' || level === 'professional'
              ? 'bg-gray-600'
              : 'bg-gray-300'
          }`}
        />
        <div
          className={`w-1 h-4 rounded-sm transition-all ${
            level === 'professional'
              ? 'bg-gray-600'
              : 'bg-gray-300'
          }`}
        />
      </div>
    );
  };

  return (
    <div className={`bg-white rounded-lg shadow-md transition-all ${
      isAccessible ? 'hover:shadow-lg' : 'opacity-75'
    }`}>
      {lesson.image && (
        <img
          src={lesson.image}
          alt={lesson.title}
          className={`w-full h-48 object-cover rounded-t-lg ${!isAccessible && 'grayscale'}`}
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => isAccessible && onView(lesson)}
            className={`text-lg font-semibold text-gray-800 hover:text-gray-600 transition-colors text-left ${
              !isAccessible && 'cursor-not-allowed'
            }`}
          >
            {lesson.title}
          </button>
        </div>
        <p className="text-gray-600 mb-4">{lesson.description}</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <LevelBars level={lesson.level} />
            <div className="flex items-center text-gray-600">
              <Clock className="w-4 h-4 mr-1" />
              <span className="text-sm">{lesson.duration} Min.</span>
            </div>
          </div>
          
          {isAccessible ? (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onView(lesson)}
                className="p-2 rounded-md bg-gray-100 text-gray-400 hover:text-gray-600 hover:bg-gray-200 transition-colors"
                title="Lektion ansehen"
              >
                <Eye className="w-5 h-5" />
              </button>
              <button
                onClick={handleComplete}
                className={`p-2 rounded-md transition-colors ${
                  isCompleted
                    ? 'bg-green-100 text-green-700 cursor-default'
                    : 'bg-gray-100 text-gray-400 hover:text-gray-600 hover:bg-gray-200'
                }`}
                title={isCompleted ? 'Abgeschlossen' : 'Als erledigt markieren'}
              >
                <CheckCircle className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center text-gray-500">
              <Lock className="w-4 h-4 mr-2" />
              <span className="text-sm">Premium Lektion</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}