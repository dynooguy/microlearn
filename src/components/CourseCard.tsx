import React from 'react';
import { Award, Clock } from 'lucide-react';
import type { Course } from '../types/seatable';

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  const totalLessons = course.Kapitel.reduce(
    (sum, chapter) => sum + chapter.Lektionen.length,
    0
  );
  
  const totalDuration = course.Kapitel.reduce(
    (sum, chapter) => 
      sum + chapter.Lektionen.reduce(
        (chapterSum, lesson) => chapterSum + lesson.DauerInMin,
        0
      ),
    0
  );

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="aspect-video relative">
        <img
          src={course.Kursbild}
          alt={course.Name}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-4 left-4">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            course.Level === 'Starter'
              ? 'bg-green-100 text-green-800'
              : course.Level === 'Fortgeschritten'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-purple-100 text-purple-800'
          }`}>
            <Award className="w-4 h-4 mr-1" />
            {course.Level}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-2">{course.Name}</h2>
        <p className="text-gray-600 mb-4 line-clamp-2">{course.Kurzbeschreibung}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            {totalDuration} min
          </div>
          <div>
            {course.Kapitel.length} chapters • {totalLessons} lessons
          </div>
        </div>
      </div>
    </div>
  );
}