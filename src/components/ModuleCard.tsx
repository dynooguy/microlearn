import React from 'react';
import { LessonCard } from './LessonCard';
import { ProgressBar } from './ProgressBar';
import { Module, Lesson } from '../types';

interface ModuleCardProps {
  module: Module;
  onComplete: (lessonId: string, moduleId: string) => void;
  onViewLesson: (lesson: Lesson) => void;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({ module, onComplete, onViewLesson }) => {
  const progress = (module.lessons.filter(lesson => lesson.completed).length / module.lessons.length) * 100;

  return (
    <div className="bg-gray-50 rounded-xl p-6 mb-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{module.title}</h2>
        <p className="text-gray-600 mb-4">{module.description}</p>
        <ProgressBar progress={progress} />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {module.lessons.map((lesson) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            moduleId={module.id}
            onComplete={onComplete}
            onView={onViewLesson}
          />
        ))}
      </div>
    </div>
  );
};