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
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
      {lesson.image && (
        <img
          src={lesson.image}
          alt={lesson.title}
          className="w-full h-48 object-cover rounded-t-lg"
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{lesson.title}</h3>
          <div className="flex items-center text-gray-600">
            <Clock className="w-4 h-4 mr-1" />
            <span className="text-sm">{lesson.duration} Min.</span>
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
            Lektion ansehen
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
                : 'bg-amber-600 text-white hover:bg-amber-700'
            }`}
          >
            {lesson.completed ? 'Abgeschlossen' : 'Als erledigt markieren'}
          </button>
        </div>
      </div>
    </div>
  );
};