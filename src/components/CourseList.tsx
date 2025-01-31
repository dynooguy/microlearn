import React from 'react';
import { Award, Clock, ChevronRight } from 'lucide-react';
import type { Course } from '../types/seatable';

interface CourseListProps {
  courses: Course[];
  isLoading: boolean;
  error: Error | null;
}

export function CourseList({ courses, isLoading, error }: CourseListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-lg">
        Error loading courses: {error.message}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {courses.map((course) => {
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
          <div 
            key={course['Kurs-ID']} 
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-4 flex items-center gap-4"
          >
            <img
              src={course.Kursbild}
              alt={course.Name}
              className="w-24 h-24 rounded-lg object-cover flex-shrink-0"
            />
            
            <div className="flex-grow min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-lg font-semibold text-gray-900 truncate">
                  {course.Name}
                </h2>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                  course.Level === 'Starter'
                    ? 'bg-green-100 text-green-800'
                    : course.Level === 'Fortgeschritten'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-purple-100 text-purple-800'
                }`}>
                  <Award className="w-3 h-3 mr-1" />
                  {course.Level}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm line-clamp-2 mb-2">
                {course.Kurzbeschreibung}
              </p>
              
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {totalDuration} min
                </div>
                <div>
                  {course.Kapitel.length} chapters • {totalLessons} lessons
                </div>
              </div>
            </div>
            
            <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
          </div>
        );
      })}
    </div>
  );
}