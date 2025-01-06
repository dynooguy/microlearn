import React from 'react';
import { Clock } from 'lucide-react';
import { Lesson } from '../types';

interface LessonCardProps {
  lesson: Lesson;
  onComplete: (id: string) => void;
  onView: (lesson: Lesson) => void;
}

export const LessonCard: React.FC<LessonCardProps> = ({ lesson, onComplete, onView }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">{lesson.title}</h3>
        <div className="flex items-center text-gray-600">
          <Clock className="w-4 h-4 mr-1" />
          <span className="text-sm">{lesson.duration} min</span>
        </div>
      </div>
      <p className="text-gray-600 mb-4">{lesson.description}</p>
      <div className="flex justify-between items-center">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onView(lesson);
          }}
          className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
        >
          View Lesson
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onComplete(lesson.id);
          }}
          className={`px-4 py-2 rounded-md transition-colors ${
            lesson.completed
              ? 'bg-green-100 text-green-700'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {lesson.completed ? 'Completed' : 'Mark Complete'}
        </button>
      </div>
    </div>
  );
};